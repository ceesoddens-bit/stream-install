import React, { useState, useEffect } from 'react';
import { QuotesTable } from './QuotesTable';
import { InvoicesTable } from './InvoicesTable';
import { cn } from '@/lib/utils';
import { Search, Filter, Plus, Download, FileText, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { financeService } from '@/lib/financeService';
import { Quote } from '@/types';

const tabs = [
  { id: 'offertes', label: 'Offertes', icon: FileText },
  { id: 'facturen', label: 'Facturen', icon: CreditCard },
  { id: 'inkoopfacturen', label: 'Inkoopfacturen', icon: CreditCard },
  { id: 'betalingen', label: 'Betalingen', icon: CreditCard },
];

export function FinanceLayout() {
  const [activeTab, setActiveTab] = useState('offertes');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = financeService.subscribeToQuotes((fetched) => {
      setQuotes(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50/50 p-6 gap-6 overflow-hidden">
      <div className="flex items-center justify-between border-b bg-white -mx-6 px-6 -mt-6 py-2 sticky top-0 z-10">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap flex items-center gap-2",
                activeTab === tab.id 
                  ? "text-blue-600" 
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Download className="h-4 w-4" />
            Exporteren
          </Button>
          <Button 
            size="sm" className="h-9 gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            Nieuwe {activeTab === 'offertes' ? 'Offerte' : 'Factuur'}
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Zoek op nummer, project of contact..." className="pl-10 h-10 border-gray-200" />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
           Totaal: {activeTab === 'offertes' ? quotes.length : 0} items
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-20 text-center text-gray-400 italic">Laden van gegevens...</div>
        ) : (
          <>
            {activeTab === 'offertes' && <QuotesTable quotes={quotes} />}
            {activeTab === 'facturen' && <InvoicesTable />}
            {activeTab !== 'offertes' && activeTab !== 'facturen' && (
              <div className="flex flex-col items-center justify-center h-64 bg-white border border-dashed rounded-xl text-gray-400">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <CreditCard className="h-8 w-8 text-gray-300" />
                </div>
                <p className="font-medium text-gray-500">De module "{tabs.find(t => t.id === activeTab)?.label}" wordt gemigreerd naar Firestore.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
