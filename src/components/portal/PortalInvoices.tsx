import React, { useEffect, useState } from 'react';
import { useTenant } from '@/lib/tenantContext';
import { financeService } from '@/lib/financeService';
import { Invoice } from '@/types';
import { Receipt, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Concept': return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none">Concept</Badge>;
    case 'In Afwachting': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">In Afwachting</Badge>;
    case 'Betaald': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Betaald</Badge>;
    case 'Vervallen': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Vervallen</Badge>;
    default: return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none">{status}</Badge>;
  }
};

export function PortalInvoices() {
  const { userDoc, tenantId, tenant } = useTenant();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const primaryColor = tenant?.branding?.kleur || '#076735';

  useEffect(() => {
    if (!userDoc?.contactId) return;
    const unsub = financeService.subscribeToInvoices(setInvoices, userDoc.contactId);
    return () => unsub();
  }, [userDoc?.contactId]);

  const handleDownload = async (invoice: Invoice) => {
    if (!tenantId || !invoice.id) return;
    try {
      const storageRef = ref(storage, `tenants/${tenantId}/invoices/${invoice.id}.pdf`);
      const url = await getDownloadURL(storageRef);
      window.open(url, '_blank');
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error('Kan PDF niet downloaden. Mogelijk is deze nog niet gegenereerd.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Facturen</h1>
        <p className="text-sm text-gray-500">Bekijk, download en betaal uw facturen.</p>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Receipt className="h-12 w-12 text-gray-300 mb-4" />
            <p>U heeft op dit moment geen facturen.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Factuurnummer</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Datum</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Vervaldatum</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Bedrag</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{invoice.invoiceNumber}</td>
                  <td className="p-4 text-sm text-gray-600">{invoice.date}</td>
                  <td className="p-4 text-sm text-gray-600">{(invoice as any).dueDate || 'Onbekend'}</td>
                  <td className="p-4 text-sm font-medium text-gray-900 text-right">
                    € {invoice.amount.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 gap-2 text-gray-600 hover:text-gray-900"
                        onClick={() => handleDownload(invoice)}
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                      
                      {(invoice.status === 'In Afwachting' || invoice.status === 'Vervallen') && (
                        <Button 
                          size="sm" 
                          className="h-8 gap-2"
                          style={{ backgroundColor: primaryColor }}
                          onClick={() => {
                            // Integrate with Stripe payment link if available
                            toast.info('Online betalen is binnenkort beschikbaar.');
                          }}
                        >
                          Betaal nu
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}