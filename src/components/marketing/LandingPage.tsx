import React, { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Chrome, Lock, Mail, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const imageUrl = (prompt: string, image_size: string = 'landscape_16_9') => {
    return `https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${image_size}`;
  };

  const examples = [
    {
      title: 'Dashboard',
      description: 'Snel overzicht van vandaag: planning, open tickets en uren.',
      bullets: ['Dagoverzicht per team', 'Open tickets en prioriteit', 'Urenregistratie in één klik'],
      prompt:
        'modern saas dashboard ui for installation management, daily overview, calendar widgets, tickets list, time tracking cards, clean white background, subtle emerald and blue accents, soft shadows, minimal, realistic app screenshot style, no text',
    },
    {
      title: 'Planner',
      description: 'Weekplanning met filters, planningsregels en export.',
      bullets: ['Sleep & drop planning', 'Filters per monteur', 'Export/print voor onderweg'],
      prompt:
        'modern saas planning calendar ui, week view timeline, field service scheduling, filter sidebar, assignments cards, clean grid, white background, emerald highlights, minimal, realistic app screenshot style, no text',
    },
    {
      title: 'Tickets',
      description: 'Werkbonnen en serviceverzoeken met status, SLA en notities.',
      bullets: ['Statusflow en labels', 'Foto’s/bijlagen', 'Koppeling met project'],
      prompt:
        'modern saas ticket management ui, kanban + list hybrid, service requests, status columns, detail drawer, clean white background, subtle blue and emerald accents, minimal, realistic app screenshot style, no text',
    },
    {
      title: 'Projecten & CRM',
      description: 'Klanten, projecten, offertes en voortgang in één overzicht.',
      bullets: ['Projecttijdlijn', 'Contactpersonen', 'Offerte en werkzaamheden'],
      prompt:
        'modern saas project and crm ui, client profile, project timeline, quotation summary, progress charts, clean white background, soft gray panels, emerald accents, minimal, realistic app screenshot style, no text',
    },
  ] as const;

  const dashboardExample = examples[0];
  const gridExamples = examples.slice(1);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Inloggen mislukt.');
      setBusy(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setBusy(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err?.message ?? 'Inloggen mislukt.');
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-gray-900">Stream install</div>
              <div className="text-xs text-gray-500">Installatiebeheer, planning en tickets</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Operationeel
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Alles voor planning, projecten en uren in één systeem.
            </h1>
            <p className="mt-4 text-gray-600 text-base leading-relaxed max-w-xl">
              Werk sneller met een overzichtelijk dashboard, planningsregels, tickets en urenregistratie. Deel kalenders, stuur offertes op en houd je team op koers.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                'Dashboard met kalender, uren, tickets en projecten',
                'Planner + planningsregels met filters en export',
                'Koppelingen naar projecten en CRM',
                'Multi-tenant klaar (organisatie + gebruikers)',
              ].map((t) => (
                <div key={t} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <span className="text-sm text-gray-700">{t}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-white">
                <div className="text-sm font-semibold text-gray-900">Voorbeeld dashboard</div>
                <div className="text-xs text-gray-500">Snel overzicht van de dag</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                <div className="relative overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                  <div className="relative aspect-video w-full bg-gradient-to-br from-white to-gray-50">
                    <img
                      src={imageUrl(dashboardExample.prompt)}
                      alt="Voorbeeld van het dashboard"
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <div className="text-sm font-semibold text-gray-900">Voorbeelden uit de app</div>
                  <div className="text-xs text-gray-500">Planning, tickets, projecten en uren in dezelfde workflow</div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {gridExamples.map((ex) => (
                  <Card key={ex.title} className="overflow-hidden shadow-sm ring-1 ring-foreground/5">
                    <div className="relative aspect-video w-full bg-gradient-to-br from-white to-gray-50">
                      <img
                        src={imageUrl(ex.prompt)}
                        alt={`Voorbeeld van ${ex.title}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
                    </div>
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-base font-bold text-gray-900">{ex.title}</CardTitle>
                      <CardDescription className="text-gray-500">{ex.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid gap-2">
                        {ex.bullets.map((b) => (
                          <div key={b} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                            <span className="text-sm text-gray-700">{b}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="shadow-sm ring-1 ring-foreground/10">
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {isRegistering ? 'Account aanmaken' : 'Inloggen'}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {isRegistering ? 'Maak een account aan om te starten.' : 'Log in om door te gaan naar je omgeving.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold text-gray-600">E-mailadres</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="naam@bedrijf.nl"
                        className="pl-10 h-10 bg-white border-border/70 focus:border-emerald-300 focus:ring-emerald-100"
                        required
                        disabled={busy}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-semibold text-gray-600">Wachtwoord</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-10 bg-white border-border/70 focus:border-emerald-300 focus:ring-emerald-100"
                        required
                        disabled={busy}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-10 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
                    disabled={busy}
                  >
                    {isRegistering ? 'Account aanmaken' : 'Inloggen'}
                  </Button>
                </form>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-card px-3 text-[10px] font-bold tracking-widest text-gray-400">OF</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleAuth}
                  className={cn("w-full h-10 border-border/70 bg-white text-gray-700 hover:bg-gray-50", busy && "pointer-events-none opacity-70")}
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  Inloggen met Google
                </Button>

                <button
                  type="button"
                  onClick={() => setIsRegistering((v) => !v)}
                  className="text-xs font-semibold text-gray-500 hover:text-emerald-700 underline underline-offset-4"
                >
                  {isRegistering ? 'Al een account? Log in' : 'Nog geen account? Registreer hier'}
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
