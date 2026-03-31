import React, { useState } from 'react';
import { financeService, Quote } from '@/lib/financeService';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Edit2, 
  FileDown, 
  FileText, 
  PenTool, 
  MessageSquare, 
  Eye,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuotesTableProps {
  quotes: Quote[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Draft': return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'Sent': return 'bg-purple-50 text-purple-700 border-purple-100';
    case 'Accepted': return 'bg-green-50 text-green-700 border-green-100';
    case 'Declined': return 'bg-red-50 text-red-700 border-red-100';
    default: return 'bg-gray-50 text-gray-700 border-gray-100';
  }
};

export function QuotesTable({ quotes }: QuotesTableProps) {
  const [activeFilter, setActiveFilter] = useState('Alles');

  const filteredQuotes = activeFilter === 'Alles' 
    ? quotes 
    : quotes.filter(q => q.status === activeFilter);

  const counts = {
    Alles: quotes.length,
    Sent: quotes.filter(q => q.status === 'Sent').length,
    Accepted: quotes.filter(q => q.status === 'Accepted').length,
    Draft: quotes.filter(q => q.status === 'Draft').length,
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Offerte verwijderen?")) {
      await financeService.deleteQuote(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-4 border-b">
        {Object.entries(counts).map(([label, count]) => (
          <button
            key={label}
            onClick={() => setActiveFilter(label)}
            className={cn(
              "pb-2 px-1 text-sm font-semibold transition-all relative",
              activeFilter === label ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <span className="flex items-center gap-2 uppercase tracking-tighter text-[11px]">
              {label}
              <Badge variant="secondary" className={cn(
                "ml-1 h-4 min-w-[18px] px-1 flex items-center justify-center text-[9px] font-bold",
                activeFilter === label ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
              )}>
                {count}
              </Badge>
            </span>
            {activeFilter === label && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Offertenummer</th>
              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Klant</th>
              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right pr-6">Bedrag</th>
              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Datum</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredQuotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-3">
                  <div className="text-xs font-mono font-bold text-blue-600">{quote.quoteNumber}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm font-bold text-gray-900">{quote.client}</div>
                </td>
                <td className="p-3">
                  <Badge variant="outline" className={cn("text-[10px] font-bold px-2 py-0.5 uppercase tracking-tighter", getStatusColor(quote.status))}>
                    {quote.status}
                  </Badge>
                </td>
                <td className="p-3 text-sm font-bold text-gray-900 text-right pr-6">
                  €{quote.amount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 text-xs font-medium text-gray-500">{quote.date}</td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 className="h-4 w-4" /></button>
                    <button 
                      onClick={() => handleDelete(quote.id!)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
