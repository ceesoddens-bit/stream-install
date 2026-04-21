import React, { useEffect, useState } from 'react';
import { useTenant } from '@/lib/tenantContext';
import { financeService } from '@/lib/financeService';
import { Quote } from '@/types';
import { FileText, Eye, CheckCircle2, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Concept': return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none">Concept</Badge>;
    case 'Verstuurd': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">In afwachting</Badge>;
    case 'Geaccepteerd': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Geaccepteerd</Badge>;
    case 'Rejected': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Afgewezen</Badge>;
    default: return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none">{status}</Badge>;
  }
};

export function PortalQuotes() {
  const { userDoc, tenantId, tenant } = useTenant();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const primaryColor = tenant?.branding?.kleur || '#076735';

  useEffect(() => {
    if (!userDoc?.contactId) return;
    const unsub = financeService.subscribeToQuotes(setQuotes, userDoc.contactId);
    return () => unsub();
  }, [userDoc?.contactId]);

  const handleDownload = async (quote: Quote) => {
    if (!tenantId || !quote.id) return;
    try {
      const storageRef = ref(storage, `tenants/${tenantId}/quotes/${quote.id}.pdf`);
      const url = await getDownloadURL(storageRef);
      window.open(url, '_blank');
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error('Kan PDF niet downloaden. Mogelijk is deze nog niet gegenereerd.');
    }
  };

  const handleAccept = async (quote: Quote) => {
    if (!quote.id) return;
    try {
      await financeService.updateQuote(quote.id, { status: 'Geaccepteerd' });
      toast.success(`Offerte ${quote.referenceNumber} is succesvol geaccepteerd!`);
      // Here we could also trigger an email or notification
    } catch (error) {
      console.error("Error accepting quote:", error);
      toast.error('Er is een fout opgetreden bij het accepteren van de offerte.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Offertes</h1>
        <p className="text-sm text-gray-500">Bekijk en accepteer uw openstaande offertes.</p>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        {quotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FileText className="h-12 w-12 text-gray-300 mb-4" />
            <p>U heeft op dit moment geen offertes.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Offertenummer</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Datum</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Vervaldatum</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Bedrag</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{quote.referenceNumber}</td>
                  <td className="p-4 text-sm text-gray-600">{quote.date}</td>
                  <td className="p-4 text-sm text-gray-600">{(quote as any).validUntil || 'Onbekend'}</td>
                  <td className="p-4 text-sm font-medium text-gray-900 text-right">
                    € {quote.amount.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(quote.status)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 gap-2 text-gray-600 hover:text-gray-900"
                        onClick={() => handleDownload(quote)}
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                      
                      {quote.status === 'Verstuurd' && (
                        <Button 
                          size="sm" 
                          className="h-8 gap-2"
                          style={{ backgroundColor: primaryColor }}
                          onClick={() => handleAccept(quote)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Accepteren
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