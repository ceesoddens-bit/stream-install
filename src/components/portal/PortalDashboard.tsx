import React, { useEffect, useState } from 'react';
import { useTenant } from '@/lib/tenantContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Receipt, LifeBuoy } from 'lucide-react';
import { financeService } from '@/lib/financeService';
import { ticketService } from '@/lib/ticketService';
import { Quote, Invoice } from '@/types';
import { Ticket } from '@/lib/ticketService';

export function PortalDashboard() {
  const { tenant, userDoc } = useTenant();
  const primaryColor = tenant?.branding?.kleur || '#076735';
  
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (!userDoc?.contactId) return;

    const unsubQuotes = financeService.subscribeToQuotes(setQuotes, userDoc.contactId);
    const unsubInvoices = financeService.subscribeToInvoices(setInvoices, userDoc.contactId);
    const unsubTickets = ticketService.subscribeToTickets(setTickets, 50, userDoc.contactId);

    return () => {
      unsubQuotes();
      unsubInvoices();
      unsubTickets();
    };
  }, [userDoc?.contactId]);

  const openQuotes = quotes.filter(q => q.status === 'Concept' || q.status === 'Verstuurd').length;
  const unpaidInvoicesAmount = invoices
    .filter(i => i.status === 'Concept' || i.status === 'In Afwachting' || i.status === 'Vervallen')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const activeTickets = tickets.filter(t => t.status !== 'Afgerond').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welkom, {userDoc?.displayName || 'Klant'}</h1>
        <p className="text-sm text-gray-500">Hier is een overzicht van uw recente activiteiten.</p>
      </div>

      {!userDoc?.contactId && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm">
          Uw account is nog niet gekoppeld aan een klantprofiel. Neem contact op met support om uw account te koppelen, zodat u uw gegevens kunt inzien.
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Openstaande Offertes</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: primaryColor }}>{openQuotes}</div>
            <p className="text-xs text-gray-500">Wachtend op uw reactie</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onbetaalde Facturen</CardTitle>
            <Receipt className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">€ {unpaidInvoicesAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-gray-500">Te betalen bedrag</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Tickets</CardTitle>
            <LifeBuoy className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: primaryColor }}>{activeTickets}</div>
            <p className="text-xs text-gray-500">In behandeling</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recente Documenten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quotes.slice(0, 3).map(quote => (
                <div key={quote.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <FileText className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quote.referenceNumber}</div>
                      <div className="text-xs text-gray-500">Offerte • {quote.date}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">€ {quote.amount.toLocaleString('nl-NL')}</div>
                </div>
              ))}
              {invoices.slice(0, 2).map(invoice => (
                <div key={invoice.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Receipt className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                      <div className="text-xs text-gray-500">Factuur • {invoice.date}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">€ {invoice.amount.toLocaleString('nl-NL')}</div>
                </div>
              ))}
              {quotes.length === 0 && invoices.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-4">
                  Geen recente documenten gevonden.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mijn Gegevens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Naam</span>
              <span className="text-sm font-medium">{userDoc?.displayName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">E-mailadres</span>
              <span className="text-sm font-medium">{userDoc?.email}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}