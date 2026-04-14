import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2 } from 'lucide-react';

type TabId = 'general' | 'esdec' | 'blubase' | 'valk' | 'cobalt' | 'sunbeam' | 'schletter';

const tabs: { id: TabId; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'esdec', label: 'Esdec' },
  { id: 'blubase', label: 'Blubase' },
  { id: 'valk', label: 'Valk' },
  { id: 'cobalt', label: 'Cobalt' },
  { id: 'sunbeam', label: 'Sunbeam' },
  { id: 'schletter', label: 'Schletter' },
];

type ProviderId = 'esdec' | 'blubase' | 'valk' | 'cobalt' | 'sunbeam' | 'schletter';

type ProviderCard = {
  id: ProviderId;
  name: string;
  logoText: string;
};

const providers: ProviderCard[] = [
  { id: 'esdec', name: 'Esdec Mounting Systems', logoText: 'ESDEC' },
  { id: 'blubase', name: 'Blubase Mounting Systems', logoText: 'blubase' },
  { id: 'valk', name: 'Van Der Valk Solar Systems', logoText: 'VAN DER VALK' },
  { id: 'cobalt', name: 'Cobalt Mounting Systems', logoText: 'cobalt' },
  { id: 'sunbeam', name: 'Sunbeam Mounting Systems', logoText: 'Sunbeam' },
  { id: 'schletter', name: 'Schletter Mounting Systems', logoText: 'SCHLETTER' },
];

export function ManagementPVDesignerSettingsView() {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [defaultProvider, setDefaultProvider] = useState<ProviderId>('esdec');
  const enabled = useMemo(() => new Set<ProviderId>(providers.map(p => p.id)), []);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">PV-Designer instellingen</h1>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={cn(
                'relative py-3 text-sm font-semibold whitespace-nowrap',
                activeTab === t.id ? 'text-emerald-700' : 'text-gray-500 hover:text-gray-900'
              )}
            >
              {t.label}
              {activeTab === t.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'general' && (
        <div className="flex-1 overflow-auto">
          <div className="mb-4">
            <h2 className="text-lg font-extrabold text-gray-900">Onderconstructies</h2>
            <p className="text-sm text-gray-500">Kies de te gebruiken substructuren</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {providers.map((p) => {
              const isEnabled = enabled.has(p.id);
              const isDefault = defaultProvider === p.id;
              return (
                <div
                  key={p.id}
                  className={cn(
                    'relative rounded-xl border bg-white shadow-sm p-4 min-h-[148px] flex flex-col justify-between',
                    isEnabled ? 'border-blue-500' : 'border-gray-200'
                  )}
                >
                  {isEnabled && (
                    <div className="absolute left-3 top-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                  )}

                  <div className="pt-6">
                    <div className="h-12 flex items-center justify-center">
                      <div className="text-2xl font-black tracking-wider text-gray-800">{p.logoText}</div>
                    </div>
                    <div className="mt-3 text-sm font-semibold text-gray-900 text-center">{p.name}</div>
                  </div>

                  <label className="mt-4 flex items-center gap-2 text-xs text-gray-600 font-semibold">
                    <Checkbox
                      checked={isDefault}
                      onCheckedChange={(next) => {
                        if (next) setDefaultProvider(p.id);
                      }}
                    />
                    Als standaard gebruiken
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab !== 'general' && (
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col items-center justify-center h-64 bg-white border border-dashed rounded-xl text-gray-400">
            <p className="font-medium">Deze tab is nog in ontwikkeling.</p>
          </div>
        </div>
      )}
    </div>
  );
}

