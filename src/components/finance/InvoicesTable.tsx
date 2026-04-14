import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { financeService, Invoice } from '@/lib/financeService';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Download, 
  Send, 
  MoreHorizontal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Concept': return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'In Afwachting': return 'bg-orange-50 text-orange-700 border-orange-100';
    case 'Goedgekeurd': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'Afgerond': return 'bg-green-50 text-green-700 border-green-100';
    case 'Geweigerd': return 'bg-red-50 text-red-700 border-red-100';
    default: return 'bg-gray-50 text-gray-700 border-gray-100';
  }
};

const tabs = ['Concept', 'In Afwachting', 'Geweigerd', 'Goedgekeurd', 'Afgerond'];

export function InvoicesTable() {
  const [activeTab, setActiveTab] = useState('Goedgekeurd');
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    return financeService.subscribeToInvoices((data) => {
      setInvoices(data);
    });
  }, []);

  const filteredInvoices = invoices.filter(i => i.status === activeTab);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-4 border-b">
        {tabs.map((label) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={cn(
              "pb-2 px-1 text-sm font-medium transition-colors relative",
              activeTab === label ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
            )}
          >
            {label}
            {activeTab === label && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b">
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Project</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Totaal Excl.</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Totaal Incl.</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase text-center">Betaald</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-3 font-mono text-xs text-gray-500">{invoice.invoiceCode}</td>
                <td className="p-3">
                  <Badge variant="outline" className={cn("text-[10px] font-medium px-2 py-0", getStatusColor(invoice.status))}>
                    {invoice.status}
                  </Badge>
                </td>
                <td className="p-3 text-sm font-medium text-gray-900">{invoice.projectName}</td>
                <td className="p-3 text-sm text-gray-600">
                  €{invoice.totalExcl.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 text-sm font-semibold text-gray-900">
                  €{invoice.totalIncl.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 text-center">
                  {invoice.fullyPaid ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                  )}
                </td>
                <td className="p-3 text-sm text-gray-600">{invoice.contactName}</td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500 text-sm">
                  Geen facturen gevonden voor deze status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
