import React, { useEffect, useMemo, useState } from 'react';
import { FileText, Clock, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuotesLayout } from '@/components/finance/QuotesLayout';
import { InvoicesTab } from '@/components/administration/invoices/InvoicesTab';
import { TimeTrackingTab } from '@/components/administration/TimeTrackingTab';

type AdministratieTab = 'offertes' | 'facturen' | 'urenregistratie';

const viewToTab: Record<string, AdministratieTab | undefined> = {
  administratie_offertes: 'offertes',
  administratie_facturen: 'facturen',
  administratie_urenregistratie: 'urenregistratie',
};

const tabToView: Record<AdministratieTab, string> = {
  offertes: 'administratie_offertes',
  facturen: 'administratie_facturen',
  urenregistratie: 'administratie_urenregistratie',
};

const tabDefs: Array<{ id: AdministratieTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'offertes', label: 'Offertes', icon: FileText },
  { id: 'facturen', label: 'Facturen', icon: CreditCard },
  { id: 'urenregistratie', label: 'Urenregistratie', icon: Clock },
];

export function AdministrationLayout({
  activeView,
  onViewChange,
}: {
  activeView: string;
  onViewChange: (view: string) => void;
}) {
  const initialTab = useMemo<AdministratieTab>(() => {
    const fromView = viewToTab[activeView];
    if (fromView) return fromView;
    const saved = window.localStorage.getItem('administratie:lastTab') as AdministratieTab | null;
    if (saved && tabToView[saved]) return saved;
    return 'facturen';
  }, [activeView]);

  const [activeTab, setActiveTab] = useState<AdministratieTab>(initialTab);

  useEffect(() => {
    const next = viewToTab[activeView];
    if (next && next !== activeTab) setActiveTab(next);
  }, [activeTab, activeView]);

  useEffect(() => {
    window.localStorage.setItem('administratie:lastTab', activeTab);
  }, [activeTab]);

  const selectTab = (tab: AdministratieTab) => {
    setActiveTab(tab);
    onViewChange(tabToView[tab]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <CreditCard className="h-6 w-6 text-emerald-700" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-800">Administratie</h1>
            <p className="text-sm text-gray-500">Offertes, facturen en urenregistratie op één plek.</p>
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabDefs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => selectTab(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors',
                activeTab === tab.id
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'offertes' && <QuotesLayout />}
        {activeTab === 'facturen' && <InvoicesTab />}
        {activeTab === 'urenregistratie' && <TimeTrackingTab />}
      </div>
    </div>
  );
}
