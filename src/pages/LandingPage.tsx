import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, ChevronDown, ChevronUp, Layers, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriceCalculator } from '@/components/landing/PriceCalculator';
import { MODULES, BASIS_PRIJS_PER_GEBRUIKER } from '@/lib/modules';

export function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const imageUrl = (prompt: string, image_size: string = 'landscape_16_9') => {
    return `https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${image_size}`;
  };

  const dashboardExample = {
    title: 'Dashboard',
    prompt: 'modern saas dashboard ui for installation management, daily overview, calendar widgets, tickets list, time tracking cards, clean white background, subtle emerald and blue accents, soft shadows, minimal, realistic app screenshot style, no text',
  };

  const faqs = [
    {
      q: 'Kan ik later nog modules toevoegen of verwijderen?',
      a: 'Ja, Stream Install is volledig flexibel. Je kunt maandelijks modules in- of uitschakelen. Je betaalt alleen voor wat je daadwerkelijk gebruikt.'
    },
    {
      q: 'Wat is inbegrepen in het basisplatform?',
      a: 'Het basisplatform bevat standaard een compleet CRM voor al je klanten en bedrijven, plus een krachtig dashboard met overzichten en KPI\'s.'
    },
    {
      q: 'Is de prijs per gebruiker voor elke module?',
      a: 'Voor de meeste modules rekenen we een klein bedrag per gebruiker bovenop de basisprijs. Sommige zwaardere modules zoals Automatiseringen hebben een hogere meerprijs.'
    },
    {
      q: 'Zit ik vast aan een jaarcontract?',
      a: 'Nee, alle abonnementen zijn maandelijks opzegbaar. Geen verborgen kleine lettertjes, je zit nergens aan vast.'
    }
  ];

  const groupedModules = MODULES.reduce((acc, mod) => {
    if (!acc[mod.categorie]) acc[mod.categorie] = [];
    acc[mod.categorie].push(mod);
    return acc;
  }, {} as Record<string, typeof MODULES>);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Stream Install</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Inloggen
            </button>
            <Button
              type="button"
              onClick={() => navigate('/registreren')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-sm"
            >
              Start Nu
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-32 px-6">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          
          <div className="mx-auto max-w-6xl text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
              Alles voor planning, projecten <br className="hidden md:block"/> en uren in <span className="text-emerald-600">één systeem.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 leading-relaxed mb-10">
              Werk sneller met een overzichtelijk dashboard, planningsregels, tickets en urenregistratie. Deel kalenders, stuur offertes op en houd je team op koers.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                type="button"
                size="lg"
                onClick={() => navigate('/registreren')}
                className="h-14 px-8 text-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold w-full sm:w-auto"
              >
                Gratis 14 dagen proberen
              </Button>
              <a href="#modules" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-8 text-lg border-gray-300 text-gray-700 w-full sm:w-auto")}>
                Bekijk alle modules
              </a>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Maandelijks opzegbaar</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Geen creditcard nodig</div>
            </div>
          </div>

          <div className="mx-auto max-w-5xl mt-16 relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 opacity-20 blur-xl"></div>
            <div className="relative rounded-2xl border border-border/50 bg-white/50 backdrop-blur-sm p-2 shadow-2xl">
              <img
                src={imageUrl(dashboardExample.prompt)}
                alt="Stream Install Dashboard"
                className="w-full rounded-xl border border-border/50 shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="border-y border-border/50 bg-gray-50/50 py-10 px-6">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
              Vertrouwd door 500+ installateurs en servicebedrijven in de Benelux
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
              {/* Plaats hier SVG logo's. Voor nu tekst placeholders met strakke styling */}
              <div className="text-xl font-black font-serif">TechnoFix</div>
              <div className="text-xl font-bold tracking-tighter">Install<span className="text-emerald-600">Pro</span></div>
              <div className="text-xl font-semibold italic">ServiceNL</div>
              <div className="text-xl font-extrabold uppercase">KlimaatTech</div>
              <div className="text-xl font-medium tracking-widest">AQUA<span className="font-light">WORKS</span></div>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section id="modules" className="py-24 px-6 bg-white">
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Bouw je eigen software</h2>
              <p className="mt-4 text-lg text-gray-600">
                Betaal alleen voor wat je gebruikt. Start klein en voeg modules toe wanneer je bedrijf groeit.
              </p>
            </div>

            <div className="space-y-16">
              {Object.entries(groupedModules).map(([categorie, modules]) => (
                <div key={categorie}>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 capitalize flex items-center gap-2">
                    <Layers className="h-5 w-5 text-emerald-600" />
                    {categorie === 'basis' ? 'Standaard inbegrepen' : `Modules - ${categorie}`}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map(mod => (
                      <Card key={mod.key} className="shadow-sm border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex justify-between items-center">
                            {mod.naam}
                            {mod.inbegrepen ? (
                              <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Basis</span>
                            ) : (
                              <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-full">+€{mod.prijsPerGebruiker} p/m</span>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">{mod.beschrijving}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vergelijkingstabel (Pakketten) */}
        <section className="py-24 px-6 bg-gray-50/50 border-y border-border/50">
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Kant-en-klare pakketten</h2>
              <p className="mt-4 text-lg text-gray-600">
                Kies een bundel die past bij jouw groeifase, of stel zelf je pakket samen.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Basis */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Start</CardTitle>
                  <CardDescription>Ideaal voor de startende monteur</CardDescription>
                  <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                    €{BASIS_PRIJS_PER_GEBRUIKER}
                    <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {['CRM (Klanten & Bedrijven)', 'Dashboarding', '1 Gebruiker', 'Basis support'].map(feature => (
                      <li key={feature} className="flex gap-x-3 text-sm text-gray-600">
                        <Check className="h-5 w-5 flex-none text-emerald-600" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/registreren?users=1')}
                    className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                  >
                    Kies Start
                  </Button>
                </CardContent>
              </Card>

              {/* Groei (Popular) */}
              <Card className="shadow-xl ring-2 ring-emerald-600 relative transform md:-translate-y-4">
                <div className="absolute top-0 inset-x-0 transform -translate-y-1/2 flex justify-center">
                  <span className="bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full">Meest gekozen</span>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Groei</CardTitle>
                  <CardDescription>Voor het groeiende installatiebedrijf</CardDescription>
                  <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                    €89
                    <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Gebaseerd op 2 gebruikers</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {['Alles uit Start, plus:', 'Offertes', 'Planning', 'Facturering'].map((feature, i) => (
                      <li key={feature} className={cn("flex gap-x-3 text-sm text-gray-600", i === 0 && "font-semibold pb-1")}>
                        <Check className="h-5 w-5 flex-none text-emerald-600" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    onClick={() => navigate('/registreren?users=2&modules=offertes,planning,facturering')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                  >
                    Kies Groei
                  </Button>
                </CardContent>
              </Card>

              {/* Volledig */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <CardDescription>De complete oplossing voor teams</CardDescription>
                  <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                    €179
                    <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Gebaseerd op 3 gebruikers</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {['Alles uit Groei, plus:', 'Voorraadbeheer', 'Projectmanagement', 'Formulieren'].map((feature, i) => (
                      <li key={feature} className={cn("flex gap-x-3 text-sm text-gray-600", i === 0 && "font-semibold pb-1")}>
                        <Check className="h-5 w-5 flex-none text-emerald-600" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/registreren?users=3&modules=offertes,planning,facturering,voorraadbeheer,projectmanagement,formulieren')}
                    className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                  >
                    Kies Pro
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-24 px-6 bg-white relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gray-50/50 rounded-l-3xl -z-10"></div>
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Bereken je maandprijs</h2>
              <p className="mt-4 text-lg text-gray-600">
                Stel zelf je ideale pakket samen. Geen verrassingen achteraf.
              </p>
            </div>
            <PriceCalculator />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 bg-gray-50/50">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-12">Veelgestelde vragen</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-border/80 rounded-xl bg-white overflow-hidden transition-all shadow-sm">
                  <button
                    className="flex w-full justify-between items-center p-5 text-left font-semibold text-gray-900 cursor-pointer"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span>{faq.q}</span>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="p-5 pt-0 text-gray-600 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-emerald-900 py-16 px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Klaar om efficiënter te werken?</h2>
            <p className="mt-4 text-lg text-emerald-100">
              Probeer Stream Install 14 dagen gratis. Geen creditcard nodig, direct toegang tot alle functionaliteiten.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                type="button"
                size="lg"
                onClick={() => navigate('/registreren')}
                className="h-14 px-8 text-lg bg-white text-emerald-900 hover:bg-gray-100 font-bold shadow-xl"
              >
                Start gratis proefperiode <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 py-12 px-6 border-t border-gray-900">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-6 w-6 text-emerald-500" />
              <span className="font-bold text-white text-lg">Stream Install</span>
            </div>
            <p className="text-sm text-gray-400">
              De alles-in-één oplossing voor moderne installatiebedrijven.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#modules" className="hover:text-emerald-400">Modules</a></li>
              <li><Link to="/registreren" className="hover:text-emerald-400">Prijzen</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400">Inloggen</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Bedrijf</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-emerald-400">Over ons</a></li>
              <li><a href="#" className="hover:text-emerald-400">Contact</a></li>
              <li><a href="#" className="hover:text-emerald-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400">Algemene Voorwaarden</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contactgegevens</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>info@streaminstall.nl</li>
              <li>+31 (0)85 123 45 67</li>
              <li className="pt-2 text-xs">KvK: 12345678</li>
              <li className="text-xs">BTW: NL123456789B01</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-6xl mt-12 pt-8 border-t border-gray-900 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Stream Install. Alle rechten voorbehouden.
        </div>
      </footer>
    </div>
  );
}
