import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  MODULES,
  ModuleKey,
  berekenMaandprijs,
  INBEGREPEN_MODULES,
  PRIJS_OWNER,
  PRIJS_ADMIN,
  PRIJS_MEMBER,
} from '@/lib/modules';

function Teller({
  label,
  sub,
  prijs,
  value,
  min,
  onChange,
}: {
  label: string;
  sub: string;
  prijs: number;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{sub} — <span className="font-medium text-emerald-700">&euro;{prijs}/mnd</span></p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="h-8 w-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 font-bold text-lg leading-none flex items-center justify-center"
        >−</button>
        <span className="w-7 text-center text-sm font-bold text-gray-900">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="h-8 w-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-lg leading-none flex items-center justify-center"
        >+</button>
      </div>
    </div>
  );
}

export function PriceCalculator() {
  const navigate = useNavigate();
  const [owners, setOwners] = useState(1);
  const [admins, setAdmins] = useState(0);
  const [members, setMembers] = useState(2);
  const [selectedModules, setSelectedModules] = useState<ModuleKey[]>([]);

  const toggleModule = (key: ModuleKey) => {
    setSelectedModules(prev =>
      prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key]
    );
  };

  const maandPrijs = berekenMaandprijs(owners, admins, members, selectedModules);
  const gebruikersKosten = owners * PRIJS_OWNER + admins * PRIJS_ADMIN + members * PRIJS_MEMBER;
  const betaald = owners + admins;
  const moduleKosten = selectedModules
    .filter(k => !INBEGREPEN_MODULES.includes(k))
    .reduce((s, k) => s + (MODULES.find(m => m.key === k)?.prijsPerGebruiker ?? 0), 0) * betaald;

  const handleStart = () => {
    const searchParams = new URLSearchParams();
    if (selectedModules.length > 0) searchParams.set('modules', selectedModules.join(','));
    navigate(`/registreren?${searchParams.toString()}`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg ring-1 ring-foreground/10 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Links: configuratie */}
        <div className="p-6 md:p-8 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Stel je pakket samen</h3>
            <p className="text-sm text-gray-500">Kies het soort gebruikers en de gewenste modules.</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700 mb-2">Gebruikers</p>
            <Teller label="Hoofdgebruikers" sub="Volledige toegang" prijs={PRIJS_OWNER} value={owners} min={1} onChange={setOwners} />
            <Teller label="Extra hoofdgebr." sub="Excl. abonnement" prijs={PRIJS_ADMIN} value={admins} min={0} onChange={setAdmins} />
            <Teller label="Medewerkers" sub="Toegang op maat" prijs={PRIJS_MEMBER} value={members} min={0} onChange={setMembers} />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Extra modules</p>
            <div className="grid grid-cols-1 gap-2">
              {MODULES.filter(m => !INBEGREPEN_MODULES.includes(m.key)).map((module) => {
                const isSelected = selectedModules.includes(module.key);
                return (
                  <div
                    key={module.key}
                    onClick={() => toggleModule(module.key)}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all',
                      isSelected ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex items-center justify-center h-5 w-5 rounded border',
                        isSelected ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-gray-300'
                      )}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{module.naam}</div>
                        <div className="text-xs text-gray-500">{module.beschrijving}</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      +&euro;{module.prijsPerGebruiker}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rechts: samenvatting */}
        <div className="p-6 md:p-8 bg-gray-50/50 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Overzicht</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Hoofdgebr.</span>
                  <Tooltip>
                    <TooltipTrigger><Info className="h-4 w-4 text-gray-400" /></TooltipTrigger>
                    <TooltipContent><p className="max-w-xs">Volledige toegang inclusief gebruikersbeheer.</p></TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-gray-600">{owners} × &euro;{PRIJS_OWNER}</span>
              </div>
              {admins > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-900">Extra hoofdgebr.</span>
                  <span className="text-gray-600">{admins} × &euro;{PRIJS_ADMIN}</span>
                </div>
              )}
              {members > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-900">Medewerkers</span>
                  <span className="text-gray-600">{members} × &euro;{PRIJS_MEMBER}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-semibold border-b border-gray-200 pb-3">
                <span className="text-gray-900">Subtotaal gebruikers</span>
                <span>&euro;{gebruikersKosten},-</span>
              </div>

              {selectedModules.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Extra modules ({betaald} betaalde gebr.)
                  </div>
                  {selectedModules.map(key => {
                    const m = MODULES.find(mod => mod.key === key);
                    if (!m) return null;
                    return (
                      <div key={key} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{m.naam}</span>
                        <span className="text-gray-600">{betaald} × &euro;{m.prijsPerGebruiker}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="text-sm text-gray-500 font-medium">Totaal per maand</div>
                <div className="text-xs text-gray-400">Excl. BTW, maandelijks opzegbaar</div>
              </div>
              <div className="text-4xl font-bold text-gray-900">&euro;{maandPrijs},-</div>
            </div>
            <Button
              size="lg"
              className="w-full h-14 text-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              onClick={handleStart}
            >
              Start Nu
            </Button>

            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p>💡 <strong>Waarom betalen medewerkers minder?</strong> Medewerkers hebben beperkte toegang. De hoofdgebruiker bepaalt wat zij mogen doen.</p>
              <p>📅 <strong>Later meer gebruikers toevoegen?</strong> Ja, via Instellingen → Gebruikers op elk moment.</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
