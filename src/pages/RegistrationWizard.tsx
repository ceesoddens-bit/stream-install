import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, writeBatch, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { createCheckoutSessionPayload } from '@/lib/stripe';
import { Check, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import {
  registrationSchema,
  RegistrationValues,
  STEP_FIELDS,
  passwordStrength,
} from './RegistrationWizard.schema';
import { MODULES, ModuleKey, berekenMaandprijs, INBEGREPEN_MODULES } from '@/lib/modules';
import { cn } from '@/lib/utils';
import { useTenant } from '@/lib/tenantContext';

const STEPS = [
  { nr: 1, label: 'Bedrijf' },
  { nr: 2, label: 'Account' },
  { nr: 3, label: 'Pakket' },
  { nr: 4, label: 'Bevestigen' },
];

function mapAuthError(code?: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Dit e-mailadres is al in gebruik.';
    case 'auth/weak-password':
      return 'Wachtwoord is te zwak.';
    case 'auth/network-request-failed':
      return 'Geen netwerkverbinding.';
    default:
      return 'Registratie mislukt. Probeer het opnieuw.';
  }
}

export function RegistrationWizard() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const { authUser, loading: authLoading } = useTenant();

  const preModules = useMemo<ModuleKey[]>(() => {
    const raw = params.get('modules');
    if (!raw) return [];
    const set = new Set(MODULES.filter((m) => !m.inbegrepen).map((m) => m.key));
    return raw
      .split(',')
      .map((s) => s.trim() as ModuleKey)
      .filter((k) => set.has(k));
  }, [params]);

  const preUsers = Math.max(1, Math.min(500, parseInt(params.get('users') ?? '1', 10) || 1));

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    mode: 'onTouched',
    defaultValues: {
      bedrijfsnaam: '',
      kvk: '',
      btw: '',
      land: 'NL',
      voornaam: '',
      achternaam: '',
      email: '',
      password: '',
      aantalGebruikers: preUsers,
      modules: preModules,
      voorwaarden: false as unknown as true,
    },
  });

  // Redirect if already logged in, but ONLY if we are NOT currently submitting
  // and only after the initial auth check is done.
  React.useEffect(() => {
    if (authUser && !authLoading && !form.formState.isSubmitting && step !== 4) {
      navigate('/dashboard', { replace: true });
    }
  }, [authUser, authLoading, form.formState.isSubmitting, navigate, step]);

  const watchAantal = form.watch('aantalGebruikers') || 1;
  const watchModules = form.watch('modules') || [];
  const watchPassword = form.watch('password') || '';
  const liveTotaal = berekenMaandprijs(Number(watchAantal), watchModules as ModuleKey[]);

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    const ok = await form.trigger(fields as any);
    if (!ok) return;
    setStep((s) => Math.min(4, s + 1));
  };
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = async (values: RegistrationValues) => {
    setError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const displayName = `${values.voornaam} ${values.achternaam}`.trim();
      await updateProfile(cred.user, { displayName });

      const tenantRef = doc(collection(db, 'tenants'));
      const userRef = doc(db, 'users', cred.user.uid);
      const maandprijs = berekenMaandprijs(values.aantalGebruikers, values.modules as ModuleKey[]);

      const batch = writeBatch(db);
      batch.set(tenantRef, {
        naam: values.bedrijfsnaam,
        plan: 'custom',
        aantalGebruikers: values.aantalGebruikers,
        actiefModules: [...INBEGREPEN_MODULES, ...values.modules],
        maandprijs,
        abonnementStatus: 'trialing', // Trial modus actief na checkout
        abonnementStartDatum: Date.now(),
        kvk: values.kvk || null,
        btw: values.btw || null,
        adres: { land: values.land },
        branding: { bedrijfsnaam: values.bedrijfsnaam },
        ownerUid: cred.user.uid,
        createdAt: serverTimestamp(),
      });
      batch.set(userRef, {
        tenantId: tenantRef.id,
        role: 'owner',
        displayName,
        email: values.email,
        createdAt: serverTimestamp(),
      });

      // Fase 2 - Stripe Integratie
      // We maken een Checkout Session aan via de extensie
      const checkoutRef = doc(collection(db, `customers/${cred.user.uid}/checkout_sessions`));
      batch.set(checkoutRef, createCheckoutSessionPayload(
        tenantRef.id, 
        values.aantalGebruikers, 
        values.modules as ModuleKey[],
        `${window.location.origin}/dashboard?welkom=1`,
        `${window.location.origin}/registreren?step=3`
      ));
      
      await batch.commit();

      try {
        await sendEmailVerification(cred.user);
      } catch {
        /* niet-fataal */
      }

      // Luister naar de redirect URL
      const { onSnapshot } = await import('firebase/firestore');
      const unsubscribe = onSnapshot(checkoutRef, (snap) => {
        const data = snap.data();
        if (data?.url) {
          unsubscribe();
          window.location.assign(data.url);
        } else if (data?.error) {
          unsubscribe();
          console.error("Stripe error:", data.error);
          setError("Fout bij het starten van de betaling. Probeer het opnieuw.");
        }
      });

      // Fallback timeout
      setTimeout(() => {
        unsubscribe();
        if (!window.location.href.includes('stripe.com')) {
          navigate('/dashboard', { replace: true });
        }
      }, 10000);
    } catch (err: any) {
      setError(mapAuthError(err?.code));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Target className="h-6 w-6 text-emerald-600" />
          </div>
          <span className="font-bold text-gray-900">StreamInstall</span>
        </div>

        <ol className="flex items-center mb-8">
          {STEPS.map((s, i) => {
            const done = step > s.nr;
            const active = step === s.nr;
            return (
              <li key={s.nr} className="flex-1 flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold',
                      done && 'bg-emerald-600 text-white',
                      active && 'bg-emerald-100 text-emerald-700 border-2 border-emerald-600',
                      !done && !active && 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : s.nr}
                  </div>
                  <span className={cn('text-sm hidden sm:block', active ? 'font-medium text-gray-900' : 'text-gray-500')}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && <div className={cn('flex-1 h-px mx-2', done ? 'bg-emerald-600' : 'bg-gray-200')} />}
              </li>
            );
          })}
        </ol>

        <Card>
          <CardHeader>
            <h1 className="text-xl font-semibold text-gray-900">
              {step === 1 && 'Bedrijfsgegevens'}
              {step === 2 && 'Uw account'}
              {step === 3 && 'Kies uw pakket'}
              {step === 4 && 'Bevestigen & starten'}
            </h1>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* === STEP 1 === */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="bedrijfsnaam">Bedrijfsnaam</Label>
                    <Input id="bedrijfsnaam" {...form.register('bedrijfsnaam')} />
                    {form.formState.errors.bedrijfsnaam && (
                      <p className="text-xs text-red-600">{form.formState.errors.bedrijfsnaam.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="kvk">KvK-nummer</Label>
                      <Input id="kvk" placeholder="12345678" {...form.register('kvk')} />
                      {form.formState.errors.kvk && <p className="text-xs text-red-600">{form.formState.errors.kvk.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="btw">BTW-nummer</Label>
                      <Input id="btw" placeholder="NL..." {...form.register('btw')} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="land">Land</Label>
                    <select
                      id="land"
                      {...form.register('land')}
                      className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                    >
                      <option value="NL">Nederland</option>
                      <option value="BE">België</option>
                      <option value="DE">Duitsland</option>
                    </select>
                  </div>
                </div>
              )}

              {/* === STEP 2 === */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="voornaam">Voornaam</Label>
                      <Input id="voornaam" {...form.register('voornaam')} />
                      {form.formState.errors.voornaam && (
                        <p className="text-xs text-red-600">{form.formState.errors.voornaam.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="achternaam">Achternaam</Label>
                      <Input id="achternaam" {...form.register('achternaam')} />
                      {form.formState.errors.achternaam && (
                        <p className="text-xs text-red-600">{form.formState.errors.achternaam.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
                    {form.formState.errors.email && <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Wachtwoord</Label>
                    <Input id="password" type="password" autoComplete="new-password" {...form.register('password')} />
                    <PasswordStrength value={watchPassword} />
                    {form.formState.errors.password && (
                      <p className="text-xs text-red-600">{form.formState.errors.password.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* === STEP 3 === */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="aantalGebruikers">Aantal gebruikers</Label>
                    <Input id="aantalGebruikers" type="number" min={1} max={500} {...form.register('aantalGebruikers')} />
                    {form.formState.errors.aantalGebruikers && (
                      <p className="text-xs text-red-600">{form.formState.errors.aantalGebruikers.message}</p>
                    )}
                  </div>

                  <Controller
                    control={form.control}
                    name="modules"
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label>Betaalde modules</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {MODULES.filter((m) => !m.inbegrepen).map((m) => {
                            const checked = (field.value ?? []).includes(m.key);
                            return (
                              <label
                                key={m.key}
                                className={cn(
                                  'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                                  checked ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'
                                )}
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(v) => {
                                    const next = new Set(field.value ?? []);
                                    if (v) next.add(m.key);
                                    else next.delete(m.key);
                                    field.onChange(Array.from(next));
                                  }}
                                />
                                <span className="flex-1 min-w-0">
                                  <span className="block text-sm font-medium text-gray-900">{m.naam}</span>
                                  <span className="block text-xs text-gray-500">{m.beschrijving}</span>
                                  <span className="block text-xs font-medium text-emerald-700 mt-1">
                                    +&euro;{m.prijsPerGebruiker}/gebruiker/mnd
                                  </span>
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  />

                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-emerald-800">Totaal per maand</span>
                      <span className="text-2xl font-bold text-emerald-900">
                        &euro;{liveTotaal.toLocaleString('nl-NL', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-emerald-700">
                      Incl. basisprijs €29 × {watchAantal} gebruiker{Number(watchAantal) > 1 ? 's' : ''}, excl. btw. Maandelijks opzegbaar.
                    </p>
                  </div>
                </div>
              )}

              {/* === STEP 4 === */}
              {step === 4 && (
                <div className="space-y-4">
                  <Summary values={form.getValues()} totaal={liveTotaal} />
                  <Controller
                    control={form.control}
                    name="voorwaarden"
                    render={({ field, fieldState }) => (
                      <div>
                        <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200">
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={(v) => field.onChange(!!v)}
                          />
                          <span className="text-sm text-gray-700">
                            Ik ga akkoord met de{' '}
                            <a href="#" className="text-emerald-600 underline">
                              algemene voorwaarden
                            </a>{' '}
                            en het{' '}
                            <a href="#" className="text-emerald-600 underline">
                              privacybeleid
                            </a>
                            .
                          </span>
                        </label>
                        {fieldState.error && <p className="text-xs text-red-600 mt-1">{fieldState.error.message}</p>}
                      </div>
                    )}
                  />
                </div>
              )}

              {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</p>}

              <div className="flex items-center justify-between pt-2">
                <div>
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={goBack} disabled={form.formState.isSubmitting}>
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Terug
                    </Button>
                  )}
                </div>
                <div>
                  {step < 4 && (
                    <Button type="button" onClick={goNext}>
                      Volgende
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                  {step === 4 && (
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'Account aanmaken...' : 'Start gratis proefperiode'}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Al een account?{' '}
          <Link to="/login" className="text-emerald-600 hover:underline">
            Inloggen
          </Link>
        </p>
      </div>
    </div>
  );
}

function PasswordStrength({ value }: { value: string }) {
  const { score, label } = passwordStrength(value);
  const colors = ['bg-red-400', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-600'];
  return (
    <div>
      <div className="flex gap-1 mt-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn('h-1 flex-1 rounded', i < score ? colors[score] : 'bg-gray-200')}
          />
        ))}
      </div>
      {value && <p className="text-[11px] text-gray-500 mt-1">{label}</p>}
    </div>
  );
}

function Summary({ values, totaal }: { values: RegistrationValues; totaal: number }) {
  const betaald = (values.modules ?? []) as ModuleKey[];
  return (
    <div className="space-y-3">
      <Row label="Bedrijf" value={values.bedrijfsnaam} />
      <Row label="Contactpersoon" value={`${values.voornaam} ${values.achternaam}`} />
      <Row label="E-mail" value={values.email} />
      <Row label="Aantal gebruikers" value={String(values.aantalGebruikers)} />
      <Row
        label="Modules"
        value={
          betaald.length === 0
            ? 'Alleen basispakket (CRM + Dashboard)'
            : betaald.map((k) => MODULES.find((m) => m.key === k)?.naam).filter(Boolean).join(', ')
        }
      />
      <div className="flex items-baseline justify-between pt-3 border-t border-gray-200">
        <span className="text-sm font-medium text-gray-900">Totaal per maand</span>
        <span className="text-xl font-bold text-emerald-700">
          &euro;{totaal.toLocaleString('nl-NL')}
        </span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium text-right">{value}</span>
    </div>
  );
}
