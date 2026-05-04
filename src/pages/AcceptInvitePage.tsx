import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Rol } from '@/lib/tenantTypes';

const schema = z
  .object({
    voornaam: z.string().trim().min(1, 'Voornaam is verplicht'),
    achternaam: z.string().trim().min(1, 'Achternaam is verplicht'),
    password: z
      .string()
      .min(8, 'Minimaal 8 tekens')
      .regex(/[A-Z]/, 'Minimaal 1 hoofdletter')
      .regex(/[0-9]/, 'Minimaal 1 cijfer'),
    passwordConfirm: z.string(),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Wachtwoorden komen niet overeen',
  });

type Values = z.infer<typeof schema>;

interface InviteDoc {
  tenantId: string;
  tenantNaam?: string;
  email: string;
  role: Rol;
  contactId?: string;
  expiresAt?: number;
  used?: boolean;
}

// Token format: "{tenantId}.{nonce}" so we can look up the invite doc
// without a collection-group query.
function parseToken(token: string | undefined): { tenantId: string; token: string } | null {
  if (!token) return null;
  const idx = token.indexOf('.');
  if (idx <= 0) return null;
  return { tenantId: token.slice(0, idx), token };
}

export function AcceptInvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const parsed = parseToken(token);
  const [invite, setInvite] = useState<InviteDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { voornaam: '', achternaam: '', password: '', passwordConfirm: '' },
  });

  useEffect(() => {
    (async () => {
      if (!parsed) {
        setLoadError('Ongeldige uitnodiging-link.');
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'tenants', parsed.tenantId, 'invites', parsed.token));
        if (!snap.exists()) {
          setLoadError('Deze uitnodiging bestaat niet of is verlopen.');
        } else {
          const data = snap.data() as InviteDoc;
          if (data.used) setLoadError('Deze uitnodiging is al gebruikt.');
          else if (data.expiresAt && data.expiresAt < Date.now()) setLoadError('Deze uitnodiging is verlopen.');
          else setInvite(data);
        }
      } catch {
        setLoadError('Uitnodiging kon niet worden geladen.');
      } finally {
        setLoading(false);
      }
    })();
  }, [parsed?.tenantId, parsed?.token]);

  const onSubmit = async (values: Values) => {
    if (!invite || !parsed) return;
    setSubmitError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, invite.email, values.password);
      const displayName = `${values.voornaam} ${values.achternaam}`.trim();
      await updateProfile(cred.user, { displayName });

      const batch = writeBatch(db);
      batch.set(doc(db, 'users', cred.user.uid), {
        tenantId: invite.tenantId,
        role: invite.role,
        displayName,
        email: invite.email,
        contactId: invite.contactId ?? null,
        createdAt: serverTimestamp(),
      });
      batch.update(doc(db, 'tenants', parsed.tenantId, 'invites', parsed.token), {
        used: true,
        usedAt: serverTimestamp(),
        usedByUid: cred.user.uid,
      });
      await batch.commit();

      try {
        await sendEmailVerification(cred.user);
      } catch {}

      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      if (err?.code === 'auth/email-already-in-use') {
        setSubmitError('Er bestaat al een account met dit e-mailadres. Log in en vraag een nieuwe uitnodiging aan.');
      } else {
        setSubmitError('Account aanmaken mislukt. Probeer het opnieuw.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-10 w-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (loadError || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Uitnodiging</CardTitle>
            <CardDescription>{loadError ?? 'Geen geldige uitnodiging gevonden.'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/login" className="text-sm text-emerald-600 hover:underline">
              Terug naar inloggen
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welkom bij {invite.tenantNaam ?? 'StreamInstall'}</CardTitle>
          <CardDescription>
            Je bent uitgenodigd als <span className="font-medium text-gray-900">{invite.role}</span> met het e-mailadres{' '}
            <span className="font-medium text-gray-900">{invite.email}</span>.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
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
              <Label htmlFor="password">Wachtwoord</Label>
              <Input id="password" type="password" autoComplete="new-password" {...form.register('password')} />
              {form.formState.errors.password && (
                <p className="text-xs text-red-600">{form.formState.errors.password.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="passwordConfirm">Herhaal wachtwoord</Label>
              <Input id="passwordConfirm" type="password" autoComplete="new-password" {...form.register('passwordConfirm')} />
              {form.formState.errors.passwordConfirm && (
                <p className="text-xs text-red-600">{form.formState.errors.passwordConfirm.message}</p>
              )}
            </div>
            {submitError && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">{submitError}</p>
            )}
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
              {form.formState.isSubmitting ? 'Account aanmaken...' : 'Account aanmaken'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
