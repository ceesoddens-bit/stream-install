import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { financeService } from '@/lib/financeService';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Download, 
  Send, 
  MoreHorizontal,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InvoiceEditDialog } from './FinanceEditDialogs';
import { toast } from 'sonner';

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

const tabs = ['Alles', 'Concept', 'In Afwachting', 'Geweigerd', 'Goedgekeurd', 'Afgerond'];

import { useTenant } from '@/lib/tenantContext';
import { pdfService } from '@/lib/pdfService';
import { automationService } from '@/lib/automationService';
import { InvoiceTemplate } from '../pdf/InvoiceTemplate';

export function InvoicesTable() {
  const { tenant } = useTenant();
  const [activeTab, setActiveTab] = useState('Alles');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any | null>(null);

  useEffect(() => {
    return financeService.subscribeToInvoices((data) => {
      setInvoices(data);
    });
  }, []);

  const filteredInvoices = invoices.filter(i => activeTab === 'Alles' || i.status === activeTab);

  const handleAdd = () => {
    setEditingInvoice(null);
    setIsEditOpen(true);
  };

  const handleEdit = (inv: any) => {
    setEditingInvoice(inv);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Factuur verwijderen?")) {
      try {
        await financeService.deleteInvoice(id);
        toast.success('Factuur verwijderd');
      } catch (err) {
        toast.error('Fout bij verwijderen');
      }
    }
  };

  const handleDownloadPDF = async (invoice: any) => {
    if (!tenant) return;
    const toastId = toast.loading('Factuur PDF genereren...');
    try {
      const blob = await pdfService.generateBlob(<InvoiceTemplate invoice={invoice} tenant={tenant} />);
      pdfService.downloadInBrowser(blob, `Factuur-${invoice.invoiceNumber || invoice.invoiceCode}.pdf`);
      toast.success('Factuur gedownload', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Fout bij genereren PDF', { id: toastId });
    }
  };

  const handleSendEmail = async (invoice: any) => {
    if (!tenant) return;
    const email = window.prompt("Stuur factuur naar:", invoice.contactEmail || "");
    if (!email) return;

    const toastId = toast.loading('Factuur verzenden...');
    try {
      await automationService.sendInvoiceEmail(invoice, tenant, email);
      toast.success('Factuur in de wachtrij geplaatst voor verzending', { id: toastId });
      
      // Update status naar 'Verstuurd' indien nog Concept/In Afwachting
      if (invoice.status === 'Concept' || invoice.status === 'In Afwachting') {
        await financeService.updateInvoice(invoice.id!, { 
          status: 'Verstuurd'
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Fout bij verzenden email', { id: toastId });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Search/Action */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 border-b flex-1">
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
        <Button onClick={handleAdd} className="bg-emerald-800 hover:bg-emerald-700 text-white ml-4">
          <Plus className="h-4 w-4 mr-2" /> Nieuwe Factuur
        </Button>
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
                    <Button onClick={() => handleEdit(invoice)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDelete(invoice.id!)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDownloadPDF(invoice)} variant="ghost" size="icon" title="Download PDF" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleSendEmail(invoice)} variant="ghost" size="icon" title="Verzenden" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                      <Send className="h-4 w-4" />
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

      <InvoiceEditDialog 
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        invoice={editingInvoice}
      />
    </div>
  );
}
