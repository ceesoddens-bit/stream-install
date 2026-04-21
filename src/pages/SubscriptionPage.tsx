import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTenant } from '@/lib/tenantContext';
import { MODULES, MODULE_MAP, BASIS_PRIJS_PER_GEBRUIKER, berekenMaandprijs, ModuleKey } from '@/lib/modules';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, Info, AlertTriangle, ArrowLeft, ShieldCheck, CreditCard, Sparkles, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { createSubscriptionUpdatePayload, createCancelSubscriptionPayload } from '@/lib/stripe';
import { toast } from 'sonner';

export default function SubscriptionPage() {
  const { tenant, updateTenantModules } = useTenant();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set());
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelText, setCancelText] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize from tenant
  useEffect(() => {
    if (tenant?.actiefModules) {
      setSelectedModules(new Set(tenant.actiefModules));
    }
  }, [tenant]);

  // Handle ?activeer=X query param
  useEffect(() => {
    const activeer = searchParams.get('activeer');
    if (activeer && MODULE_MAP[activeer as ModuleKey]) {
      setSelectedModules(prev => {
        const next = new Set(prev);
        next.add(activeer);
        return next;
      });
      // Scroll to the specific module if needed (optional)
      const el = document.getElementById(`module-${activeer}`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchParams]);

  if (!tenant) return null;

  const currentPrice = berekenMaandprijs(tenant.aantalGebruikers, tenant.actiefModules || []);
  const newPrice = berekenMaandprijs(tenant.aantalGebruikers, Array.from(selectedModules) as ModuleKey[]);
  const diff = newPrice - currentPrice;

  const toggleModule = (key: string) => {
    // Basis modules can't be toggled off
    if (MODULE_MAP[key as ModuleKey]?.inbegrepen) return;
    
    setSelectedModules(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSave = async () => {
    if (!tenant || !authUser) return;
    setLoading(true);
    try {
      const { doc, collection, setDoc, onSnapshot } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      // Fase 2 - Stripe Integratie
      if (tenant.stripeSubscriptionId) {
        const updateRef = doc(collection(db, `customers/${authUser.uid}/subscription_updates`));
        await setDoc(updateRef, createSubscriptionUpdatePayload(
          tenant.id,
          tenant.stripeSubscriptionId,
          tenant.aantalGebruikers,
          Array.from(selectedModules) as ModuleKey[]
        ));
        
        // Wacht op webhook sync (detecteer wijziging in actiefModules op tenant doc)
        toast.info('Betaling wordt verwerkt...');
        
        const tenantRef = doc(db, 'tenants', tenant.id);
        const unsubscribe = onSnapshot(tenantRef, (snap) => {
          const data = snap.data();
          const remoteModules = (data?.actiefModules || []).sort().join(',');
          const localModules = Array.from(selectedModules).sort().join(',');
          
          if (remoteModules === localModules) {
            unsubscribe();
            toast.success('Abonnement succesvol bijgewerkt');
            setLoading(false);
            setIsConfirmOpen(false);
          }
        });

        // Timeout na 15 seconden
        setTimeout(() => {
          unsubscribe();
          if (loading) {
            setLoading(false);
            toast.error('Het duurt langer dan verwacht. Controleer over enkele minuten uw status.');
          }
        }, 15000);
        
        return; // De rest wordt door de listener afgehandeld
      } else {
        // Indien geen subscription (bijv. in proefperiode zonder stripe gekoppeld), 
        // direct updaten of checkout sessie starten? 
        // Voor nu houden we de directe update als fallback.
        await updateTenantModules(Array.from(selectedModules) as ModuleKey[]);
        toast.success('Abonnement succesvol bijgewerkt');
        setIsConfirmOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Er is iets misgegaan bij het bijwerken van uw abonnement');
    } finally {
      if (!tenant.stripeSubscriptionId) setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (cancelText !== 'OPZEGGEN' || !tenant || !authUser) return;
    setLoading(true);
    try {
      const { doc, collection, setDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      // Fase 2 - Stripe Integratie
      if (tenant.stripeSubscriptionId) {
        const cancelRef = doc(collection(db, `customers/${authUser.uid}/subscription_cancellations`));
        await setDoc(cancelRef, createCancelSubscriptionPayload(tenant.id, tenant.stripeSubscriptionId));
        toast.success('Opzegging wordt verwerkt. Uw abonnement stopt aan het einde van de factuurperiode.');
      } else {
        toast.info('U heeft geen actief betaald abonnement om op te zeggen.');
      }

      setIsCancelOpen(false);
    } catch (err) {
      toast.error('Fout bij opzeggen');
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = JSON.stringify(Array.from(selectedModules).sort()) !== JSON.stringify((tenant.actiefModules || []).sort());

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Terug
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Abonnement & Modules</h1>
          <p className="text-gray-600 mt-1">Beheer uw pakket en actieve functionaliteiten.</p>
        </div>
        
        <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Huidige maandprijs</p>
            <p className="text-2xl font-black text-gray-900">&euro;{currentPrice.toFixed(2)}</p>
          </div>
          <div className="h-10 w-px bg-gray-100" />
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Gebruikers</p>
            <p className="text-2xl font-black text-gray-900">{tenant.aantalGebruikers}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Module Selection */}
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(
            MODULES.reduce((acc, m) => {
              if (!acc[m.categorie]) acc[m.categorie] = [];
              acc[m.categorie].push(m);
              return acc;
            }, {} as Record<string, typeof MODULES>)
          ).map(([cat, mods]) => (
            <div key={cat} className="space-y-3">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">{cat}</h3>
              <div className="grid gap-3">
                {mods.map(mod => {
                  const isActive = selectedModules.has(mod.key);
                  const isBasis = mod.inbegrepen;
                  const isNew = searchParams.get('activeer') === mod.key;

                  return (
                    <div 
                      key={mod.key}
                      id={`module-${mod.key}`}
                      onClick={() => !isBasis && toggleModule(mod.key)}
                      className={cn(
                        "group relative flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer",
                        isActive ? "bg-white border-emerald-200 shadow-sm" : "bg-gray-50 border-transparent hover:border-gray-200",
                        isBasis && "cursor-default opacity-80",
                        isNew && "ring-2 ring-blue-500 ring-offset-2"
                      )}
                    >
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
                        isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-200 text-gray-400 group-hover:bg-gray-300"
                      )}>
                        {isActive ? <Check className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{mod.naam}</span>
                          {isBasis && (
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase">Basis</span>
                          )}
                          {isNew && (
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase animate-pulse">Nieuw</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{mod.beschrijving}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className={cn(
                          "text-sm font-bold",
                          isActive ? "text-emerald-600" : "text-gray-400"
                        )}>
                          {isBasis ? 'Inbegrepen' : `+€${mod.prijsPerGebruiker}`}
                        </p>
                        {!isBasis && (
                          <p className="text-[10px] text-gray-400 uppercase font-medium">p/gebruiker</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card className={cn(
            "sticky top-24 transition-all",
            hasChanges ? "border-blue-200 shadow-lg ring-1 ring-blue-100" : ""
          )}>
            <CardHeader>
              <CardTitle>Overzicht wijzigingen</CardTitle>
              <CardDescription>Uw nieuwe configuratie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Basisplatform ({tenant.aantalGebruikers} gebruikers)</span>
                  <span className="font-medium">€{(tenant.aantalGebruikers * BASIS_PRIJS_PER_GEBRUIKER).toFixed(2)}</span>
                </div>
                {Array.from(selectedModules).map(key => {
                  const mod = MODULE_MAP[key as ModuleKey];
                  if (!mod || mod.inbegrepen) return null;
                  return (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600">{mod.naam}</span>
                      <span className="font-medium">€{(tenant.aantalGebruikers * mod.prijsPerGebruiker).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">Nieuw totaal</span>
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900">€{newPrice.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">per maand, excl. BTW</p>
                  </div>
                </div>

                {hasChanges && (
                  <div className={cn(
                    "p-3 rounded-lg flex items-center gap-3 text-sm",
                    diff > 0 ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"
                  )}>
                    {diff > 0 ? <Sparkles className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                    <span>
                      {diff > 0 
                        ? `Prijsverhoging van €${diff.toFixed(2)} p/m`
                        : `Prijsverlaging van €${Math.abs(diff).toFixed(2)} p/m`}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full h-12 text-lg font-bold" 
                disabled={!hasChanges || loading}
                onClick={() => setIsConfirmOpen(true)}
              >
                Wijzigingen bevestigen
              </Button>
            </CardFooter>
          </Card>

          <div className="p-6 bg-gray-50 border border-dashed rounded-2xl text-center">
            <p className="text-sm text-gray-500 mb-4">
              Wilt u uw gehele abonnement beëindigen?
            </p>
            <Button 
              variant="link" 
              className="text-red-500 hover:text-red-600 font-bold"
              onClick={() => setIsCancelOpen(true)}
            >
              Abonnement opzeggen
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abonnement bijwerken?</DialogTitle>
            <DialogDescription>
              De wijzigingen gaan per direct in. U ontvangt een aangepaste factuur bij de volgende betaalcyclus.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-blue-50 p-4 rounded-xl space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Oude prijs</span>
              <span className="font-bold">€{currentPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-black">
              <span className="text-blue-900">Nieuwe prijs</span>
              <span>€{newPrice.toFixed(2)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>Annuleren</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verwerken...
                </>
              ) : 'Bevestigen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancellation Modal */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Weet u het zeker?
            </DialogTitle>
            <DialogDescription>
              U verliest direct toegang tot al uw gegevens, projecten en planningen. Deze actie kan niet ongedaan worden gemaakt.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm font-medium text-gray-900 text-center">
              Typ <span className="font-black">OPZEGGEN</span> om door te gaan:
            </p>
            <Input 
              value={cancelText} 
              onChange={e => setCancelText(e.target.value.toUpperCase())}
              placeholder="OPZEGGEN"
              className="text-center font-black tracking-widest uppercase border-red-200 focus-visible:ring-red-500"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCancelOpen(false)}>Ik blijf liever</Button>
            <Button 
              variant="destructive" 
              disabled={cancelText !== 'OPZEGGEN' || loading}
              onClick={handleCancelSubscription}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Bezig...
                </>
              ) : 'Definitief opzeggen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
