import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
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
import { Check, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import {
  registrationSchema,
  RegistrationValues,
  STEP_FIELDS,
  passwordStrength,
} from './RegistrationWizard.schema';
import { MODULES, ModuleKey, berekenMaandprijs, INBEGREPEN_MODULES, PRIJS_OWNER, PRIJS_ADMIN, PRIJS_MEMBER } from '@/lib/modules';
import { PERMISSIONS, PERMISSION_CATEGORIEEN, DEFAULT_MEMBER_PERMISSIONS, PermissionKey } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { useTenant } from '@/lib/tenantContext';
import { PublicNavbar } from '@/components/layout/PublicNavbar';

const STEPS = [
  { nr: 1, label: 'Bedrijf' },
  { nr: 2, label: 'Account' },
  { nr: 3, label: 'Pakket' },
  { nr: 4, label: 'Team' },
  { nr: 5, label: 'Bevestigen' },
];

function mapAuthError(code?: string): string {
  switch (code) {
    case 'auth/email-already-in-use': return 'Dit e-mailadres is al in gebruik.';
    case 'auth/weak-password': return 'Wachtwoord is te zwak.';
    case 'auth/network-request-failed': return 'Geen netwerkverbinding.';
    default: return 'Registratie mislukt. Probeer het opnieuw.';
  }
}

export function RegistrationWizard() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const { authUser, loading: authLoading, role } = useTenant();

  const preModules = useMemo<ModuleKey[]>(() => {
    const raw = params.get('modules');
    if (!raw) return [];
    const set = new Set(MODULES.filter((m) => !m.inbegrepen).map((m) => m.key));
    return raw.split(',').map((s) => s.trim() as ModuleKey).filter((k) => set.has(k));
  }, [params]);

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
      modules: preModules,
      aantalOwners: 1,
      aantalAdmins: 0,
      aantalMembers: 0,
      teamleden: [],
      voorwaarden: false as unknown as true,
    },
  });

  const { fields: teamFields } = useFieldArray({
    control: form.control,
    name: 'teamleden',
  });

  React.useEffect(() => {
    if (authUser && !authLoading && !form.formState.isSubmitting && step !== 5 && role) {
      navigate('/dashboard', { replace: true });
    }
  }, [authUser, authLoading, form.formState.isSubmitting, navigate, step, role]);

  const watchModules = form.watch('modules') || [];
  const watchPassword = form.watch('password') || '';
  const watchOwners = Number(form.watch('aantalOwners')) || 1;
  const watchAdmins = Number(form.watch('aantalAdmins')) || 0;
  const watchMembers = Number(form.watch('aantalMembers')) || 0;
  const liveTotaal = berekenMaandprijs(watchOwners, watchAdmins, watchMembers, watchModules as ModuleKey[]);

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    const ok = await form.trigger(fields as any);
    if (!ok) return;
    // Stap 4 → team: sync teamleden array met de aantallen
    if (step === 4) {
      await syncTeamleden();
    }
    setStep((s) => Math.min(5, s + 1));
  };
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  // Past teamleden-array aan op basis van de tellerwaarden
  const syncTeamleden = async () => {
    const current = form.getValues('teamleden');
    const owners = Math.max(1, watchOwners) - 1; // -1 voor de registrerende user
    const admins = watchAdmins;
    const members = watchMembers;
    const ownerLeden = current.filter((t) => t.role === 'owner').slice(0, owners);
    const adminLeden = current.filter((t) => t.role === 'admin').slice(0, admins);
    const memberLeden = current.filter((t) => t.role === 'member').slice(0, members);

    const fill = (arr: typeof ownerLeden, target: number, role: 'owner' | 'admin' | 'member') => {
      while (arr.length < target) {
        arr.push({
          email: '',
          role,
          permissions: role === 'member' ? [...DEFAULT_MEMBER_PERMISSIONS] : [],
        });
      }
      return arr;
    };

    const nieuw = [
      ...fill(ownerLeden, owners, 'owner'),
      ...fill(adminLeden, admins, 'admin'),
      ...fill(memberLeden, members, 'member'),
    ];

    form.setValue('teamleden', nieuw as any, { shouldValidate: false });
  };

  const onSubmit = async (values: RegistrationValues) => {
    setError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const displayName = `${values.voornaam} ${values.achternaam}`.trim();
      await updateProfile(cred.user, { displayName });

      const tenantRef = doc(collection(db, 'tenants'));
      const userRef = doc(db, 'users', cred.user.uid);
      const aantalOwners = values.aantalOwners;
      const aantalAdmins = values.aantalAdmins;
      const aantalMembers = values.aantalMembers;
      const maandprijs = berekenMaandprijs(aantalOwners, aantalAdmins, aantalMembers, values.modules as ModuleKey[]);

      const batch = writeBatch(db);
      batch.set(tenantRef, {
        naam: values.bedrijfsnaam,
        plan: 'custom',
        aantalGebruikers: aantalOwners + aantalAdmins + aantalMembers,
        aantalOwners,
        aantalAdmins,
        aantalMembers,
        actiefModules: [...INBEGREPEN_MODULES, ...values.modules],
        maandprijs,
        abonnementStatus: 'trialing',
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

      const checkoutRef = doc(collection(db, `customers/${cred.user.uid}/checkout_sessions`));
      batch.set(checkoutRef, createCheckoutSessionPayload(
        tenantRef.id,
        aantalOwners,
        aantalAdmins,
        aantalMembers,
        values.modules as ModuleKey[],
        `${window.location.origin}/dashboard?welkom=1`,
        `${window.location.origin}/registreren?step=3`
      ));

      await batch.commit();

      // Maak uitnodigingen aan voor teamleden (na batch commit, zodat tenantId bekend is)
      if (values.teamleden.length > 0) {
        const { userService } = await import('@/lib/userService');
        await Promise.allSettled(
          values.teamleden
            .filter((t) => t.email.trim())
            .map((t) =>
              userService.createInvite(
                tenantRef.id,
                values.bedrijfsnaam,
                t.email,
                t.role as 'owner' | 'admin' | 'member',
                t.permissions as PermissionKey[]
              )
            )
        );
      }

      try { await sendEmailVerification(cred.user); } catch { /* niet-fataal */ }

      const { onSnapshot } = await import('firebase/firestore');
      const unsubscribe = onSnapshot(checkoutRef, (snap) => {
        const data = snap.data();
        if (data?.url) {
          unsubscribe();
          window.location.assign(data.url);
        } else if (data?.error) {
          unsubscribe();
          setError('Fout bij het starten van de betaling. Probeer het opnieuw.');
        }
      });

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
    <div className="min-h-screen bg-background font-sans flex flex-col relative overflow-hidden">
      <PublicNavbar />
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="flex-1 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <ol className="flex items-center mb-8">
            {STEPS.map((s, i) => {
              const done = step > s.nr;
              const active = step === s.nr;
              return (
                <li key={s.nr} className="flex-1 flex items-center">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold',
                      done && 'bg-emerald-600 text-white',
                      active && 'bg-emerald-100 text-emerald-700 border-2 border-emerald-600',
                      !done && !active && 'bg-gray-200 text-gray-500'
                    )}>
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
                {step === 4 && 'Uw team samenstellen'}
                {step === 5 && 'Bevestigen & starten'}
              </h1>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                {/* === STEP 1 — Bedrijf === */}
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
                      <select id="land" {...form.register('land')} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm">
                        <option value="NL">Nederland</option>
                        <option value="BE">België</option>
                        <option value="DE">Duitsland</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* === STEP 2 — Account === */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="voornaam">Voornaam</Label>
                        <Input id="voornaam" {...form.register('voornaam')} />
                        {form.formState.errors.voornaam && <p className="text-xs text-red-600">{form.formState.errors.voornaam.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="achternaam">Achternaam</Label>
                        <Input id="achternaam" {...form.register('achternaam')} />
                        {form.formState.errors.achternaam && <p className="text-xs text-red-600">{form.formState.errors.achternaam.message}</p>}
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
                      {form.formState.errors.password && <p className="text-xs text-red-600">{form.formState.errors.password.message}</p>}
                    </div>
                  </div>
                )}

                {/* === STEP 3 — Pakket === */}
                {step === 3 && (
                  <div className="space-y-5">
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
                                <label key={m.key} className={cn(
                                  'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                                  checked ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'
                                )}>
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(v) => {
                                      const next = new Set(field.value ?? []);
                                      if (v) next.add(m.key); else next.delete(m.key);
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
                    <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      Modulekosten worden berekend per <strong>hoofdgebruiker + extra hoofdgebruiker</strong>. Medewerkers betalen alleen hun basistoegang.
                    </p>
                  </div>
                )}

                {/* === STEP 4 — Team === */}
                {step === 4 && (
                  <div className="space-y-5">
                    {/* Rol-tellers met live prijsoverzicht */}
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">Hoeveel gebruikers heeft u?</p>
                        <p className="text-xs text-gray-500 mt-0.5">U bent zelf al meegeteld als hoofdgebruiker.</p>
                      </div>
                      <div className="divide-y divide-gray-100">
                        <RolTeller
                          label="Hoofdgebruikers"
                          beschrijving="Volledige toegang incl. facturering en gebruikersbeheer"
                          prijs={PRIJS_OWNER}
                          value={watchOwners}
                          min={1}
                          onChange={(v) => form.setValue('aantalOwners', v)}
                        />
                        <RolTeller
                          label="Extra hoofdgebruikers"
                          beschrijving="Volledige toegang, excl. abonnementsbeheer"
                          prijs={PRIJS_ADMIN}
                          value={watchAdmins}
                          min={0}
                          onChange={(v) => form.setValue('aantalAdmins', v)}
                        />
                        <RolTeller
                          label="Medewerkers"
                          beschrijving="Toegang op maat — u bepaalt wat zij mogen"
                          prijs={PRIJS_MEMBER}
                          value={watchMembers}
                          min={0}
                          onChange={(v) => form.setValue('aantalMembers', v)}
                        />
                      </div>
                    </div>

                    {/* Live prijsoverzicht */}
                    <PrijsOverzicht
                      watchOwners={watchOwners}
                      watchAdmins={watchAdmins}
                      watchMembers={watchMembers}
                      watchModules={watchModules as ModuleKey[]}
                      liveTotaal={liveTotaal}
                    />

                    {/* E-mailadressen teamleden */}
                    {(watchOwners > 1 || watchAdmins > 0 || watchMembers > 0) && (
                      <div className="space-y-3">
                        <Label>E-mailadressen teamleden</Label>
                        <p className="text-xs text-gray-500">Teamleden ontvangen een uitnodigingsmail. Vul in na registratie als u nog niet alle e-mailadressen weet.</p>
                        {teamFields.map((field, i) => (
                          <TeamlidRij
                            key={field.id}
                            index={i}
                            form={form}
                            role={field.role as 'owner' | 'admin' | 'member'}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* === STEP 5 — Bevestigen === */}
                {step === 5 && (
                  <div className="space-y-4">
                    <Summary values={form.getValues()} totaal={liveTotaal} />
                    <Controller
                      control={form.control}
                      name="voorwaarden"
                      render={({ field, fieldState }) => (
                        <div>
                          <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200">
                            <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(!!v)} />
                            <span className="text-sm text-gray-700">
                              Ik ga akkoord met de{' '}
                              <a href="#" className="text-emerald-600 underline">algemene voorwaarden</a>{' '}
                              en het{' '}
                              <a href="#" className="text-emerald-600 underline">privacybeleid</a>.
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
                        <ChevronLeft className="h-4 w-4 mr-1" />Terug
                      </Button>
                    )}
                  </div>
                  <div>
                    {step < 5 && (
                      <Button type="button" onClick={goNext}>
                        Volgende<ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                    {step === 5 && (
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
            <Link to="/login" className="text-emerald-600 hover:underline">Inloggen</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// === Sub-componenten ===

function RolTeller({
  label, beschrijving, prijs, value, min, onChange,
}: {
  label: string; beschrijving: string; prijs: number; value: number; min: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 truncate">{beschrijving}</p>
        <p className="text-xs font-semibold text-emerald-700 mt-0.5">&euro;{prijs}/mnd</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="h-8 w-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          disabled={value <= min}
        >−</button>
        <span className="w-8 text-center text-sm font-bold">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="h-8 w-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
        >+</button>
      </div>
      <div className="text-sm font-semibold text-gray-800 w-20 text-right">
        &euro;{value * prijs}
      </div>
    </div>
  );
}

function PrijsOverzicht({
  watchOwners, watchAdmins, watchMembers, watchModules, liveTotaal,
}: {
  watchOwners: number; watchAdmins: number; watchMembers: number; watchModules: ModuleKey[]; liveTotaal: number;
}) {
  const modulesom = watchModules
    .filter(k => !INBEGREPEN_MODULES.includes(k))
    .reduce((s, k) => s + (MODULES.find(m => m.key === k)?.prijsPerGebruiker ?? 0), 0);
  const betaald = watchOwners + watchAdmins;

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-1.5">
      <PrijsRegel label={`Hoofdgebruikers (${watchOwners}×)`} bedrag={watchOwners * PRIJS_OWNER} />
      {watchAdmins > 0 && <PrijsRegel label={`Extra hoofdgebr. (${watchAdmins}×)`} bedrag={watchAdmins * PRIJS_ADMIN} />}
      {watchMembers > 0 && <PrijsRegel label={`Medewerkers (${watchMembers}×)`} bedrag={watchMembers * PRIJS_MEMBER} />}
      {modulesom > 0 && <PrijsRegel label={`Modules (${betaald}× €${modulesom}/gebr.)`} bedrag={modulesom * betaald} />}
      <div className="pt-2 mt-2 border-t border-emerald-200 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-emerald-900">Totaal per maand</span>
        <span className="text-2xl font-bold text-emerald-900">&euro;{liveTotaal}</span>
      </div>
      <p className="text-xs text-emerald-700">Excl. btw. Maandelijks opzegbaar.</p>
    </div>
  );
}

function PrijsRegel({ label, bedrag }: { label: string; bedrag: number }) {
  return (
    <div className="flex items-baseline justify-between text-sm text-emerald-800">
      <span>{label}</span>
      <span className="font-medium">&euro;{bedrag}</span>
    </div>
  );
}

function TeamlidRij({ index, form, role }: { index: number; form: any; role: 'owner' | 'admin' | 'member' }) {
  const [open, setOpen] = useState(false);
  const rolLabels = { owner: 'Hoofdgebruiker', admin: 'Extra hoofdgebruiker', member: 'Medewerker' };
  const error = form.formState.errors.teamleden?.[index]?.email;
  const currentPermissions: string[] = form.watch(`teamleden.${index}.permissions`) ?? [];

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2 bg-gray-50">
        <span className={cn(
          'text-xs font-semibold px-2 py-0.5 rounded-full',
          role === 'owner' ? 'bg-blue-100 text-blue-700' :
          role === 'admin' ? 'bg-purple-100 text-purple-700' :
          'bg-gray-200 text-gray-700'
        )}>{rolLabels[role]}</span>
        <Input
          placeholder="e-mailadres"
          className="h-8 flex-1 text-sm bg-white"
          {...form.register(`teamleden.${index}.email`)}
        />
      </div>
      {error && <p className="text-xs text-red-600 px-3 pb-1">{error.message}</p>}
      {role === 'member' && (
        <>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full text-xs text-emerald-700 font-medium px-3 py-1.5 flex items-center gap-1 hover:bg-emerald-50"
          >
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            Permissies instellen ({currentPermissions.length} geselecteerd)
          </button>
          {open && (
            <div className="px-3 py-3 border-t border-gray-100 space-y-4">
              {PERMISSION_CATEGORIEEN.map((cat) => {
                const perms = PERMISSIONS.filter((p) => p.categorie === cat);
                return (
                  <div key={cat}>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{cat}</p>
                    <div className="grid grid-cols-2 gap-1">
                      {perms.map((p) => {
                        const checked = currentPermissions.includes(p.key);
                        return (
                          <label key={p.key} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(v) => {
                                const next = new Set(currentPermissions);
                                if (v) next.add(p.key); else next.delete(p.key);
                                form.setValue(`teamleden.${index}.permissions`, Array.from(next));
                              }}
                            />
                            {p.label}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
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
          <div key={i} className={cn('h-1 flex-1 rounded', i < score ? colors[score] : 'bg-gray-200')} />
        ))}
      </div>
      {value && <p className="text-[11px] text-gray-500 mt-1">{label}</p>}
    </div>
  );
}

function Summary({ values, totaal }: { values: RegistrationValues; totaal: number }) {
  const betaald = (values.modules ?? []) as ModuleKey[];
  const teamCount = values.teamleden.filter((t) => t.email.trim()).length;
  return (
    <div className="space-y-3">
      <Row label="Bedrijf" value={values.bedrijfsnaam} />
      <Row label="Contactpersoon" value={`${values.voornaam} ${values.achternaam}`} />
      <Row label="E-mail" value={values.email} />
      <Row label="Gebruikers" value={`${values.aantalOwners} hoofdgebr. · ${values.aantalAdmins} extra · ${values.aantalMembers} medewerkers`} />
      {teamCount > 0 && <Row label="Uitnodigingen" value={`${teamCount} teamleden ontvangen een uitnodiging`} />}
      <Row
        label="Modules"
        value={betaald.length === 0 ? 'Alleen basispakket (CRM + Dashboard)' : betaald.map((k) => MODULES.find((m) => m.key === k)?.naam).filter(Boolean).join(', ')}
      />
      <div className="flex items-baseline justify-between pt-3 border-t border-gray-200">
        <span className="text-sm font-medium text-gray-900">Totaal per maand</span>
        <span className="text-xl font-bold text-emerald-700">&euro;{totaal.toLocaleString('nl-NL')}</span>
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
