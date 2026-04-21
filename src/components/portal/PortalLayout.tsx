import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, onSnapshot, query, where, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tenant } from '@/lib/tenantTypes';
import { Quote, Invoice } from '@/types';
import { Contact } from '@/lib/crmService';
import { 
  FileText, CreditCard, LayoutDashboard, CheckCircle2, 
  XCircle, Clock, Download, ExternalLink, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { pdfService } from '@/lib/pdfService';
import { QuoteTemplate } from '../pdf/QuoteTemplate';
import { InvoiceTemplate } from '../pdf/InvoiceTemplate';
import { toast } from 'sonner';

export function PortalLayout() {
  const { tenantId, contactId } = useParams<{ tenantId: string; contactId: string }>();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'quotes' | 'invoices'>('quotes');

  useEffect(() => {
    if (!tenantId || !contactId) return;

    const fetchData = async () => {
      // Fetch Tenant Branding
      const tDoc = await getDoc(doc(db, 'tenants', tenantId));
      if (tDoc.exists()) {
        setTenant({ id: tDoc.id, ...tDoc.data() } as Tenant);
      }

      // Fetch Contact
      const cDoc = await getDoc(doc(db, 'tenants', tenantId, 'contacts', contactId));
      if (cDoc.exists()) {
        setContact({ id: cDoc.id, ...cDoc.data() } as Contact);
      }

      // Subscribe to Quotes
      const qRef = collection(db, 'tenants', tenantId, 'offertes');
      const qQuery = query(qRef, where('contactId', '==', contactId));
      const unsubQuotes = onSnapshot(qQuery, (snap) => {
        setQuotes(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Quote[]);
      });

      // Subscribe to Invoices
      const iRef = collection(db, 'tenants', tenantId, 'facturen');
      const iQuery = query(iRef, where('contactId', '==', contactId));
      const unsubInvoices = onSnapshot(iQuery, (snap) => {
        setInvoices(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Invoice[]);
        setIsLoading(false);
      });

      return () => {
        unsubQuotes();
        unsubInvoices();
      };
    };

    fetchData();
  }, [tenantId, contactId]);

  const handleDownloadPDF = async (item: any, type: 'quote' | 'invoice') => {
    if (!tenant) return;
    const toastId = toast.loading('PDF genereren...');
    try {
      const component = type === 'quote' 
        ? <QuoteTemplate quote={item} tenant={tenant} />
        : <InvoiceTemplate invoice={item} tenant={tenant} />;
      
      const blob = await pdfService.generateBlob(component);
      pdfService.downloadInBrowser(blob, `${type === 'quote' ? 'Offerte' : 'Factuur'}-${item.id}.pdf`);
      toast.success('Document gedownload', { id: toastId });
    } catch (err) {
      toast.error('Fout bij genereren PDF', { id: toastId });
    }
  };

  const handleAcceptQuote = async (quote: Quote) => {
    if (!tenant || !tenantId) return;
    if (!window.confirm("Weet u zeker dat u deze offerte wilt accepteren?")) return;

    const toastId = toast.loading('Offerte accepteren...');
    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      const quoteRef = doc(db, 'tenants', tenantId, 'offertes', quote.id);
      
      await updateDoc(quoteRef, {
        status: 'Geaccepteerd',
        acceptedAt: new Date(),
        updatedAt: new Date()
      });

      // Automation trigger (we call it manually here since we are in the portal and not in the main app's edit dialog)
      const { automationService } = await import('@/lib/automationService');
      await automationService.handleQuoteStatusChange(quote, 'Geaccepteerd', tenant);

      toast.success('Offerte geaccepteerd! U ontvangt spoedig een bevestiging.', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Fout bij accepteren offerte', { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 italic">
        Portaal laden...
      </div>
    );
  }

  if (!tenant || !contact) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 font-bold">
        Ongeldige link of portaal niet beschikbaar.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Portal Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tenant.branding?.logoUrl ? (
              <img src={tenant.branding.logoUrl} alt={tenant.naam} className="h-8 w-auto" />
            ) : (
              <h1 className="text-xl font-bold" style={{ color: tenant.branding?.kleur || '#0F172A' }}>
                {tenant.naam}
              </h1>
            )}
            <span className="h-4 w-px bg-gray-200 mx-2" />
            <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Klantportaal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-right text-right">
              <span className="text-sm font-bold text-gray-900">{contact.name}</span>
              <span className="text-[11px] text-gray-500">{contact.email}</span>
            </div>
            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <User className="h-6 w-6" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 space-y-4">
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('quotes')}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'quotes' ? "bg-white text-emerald-700 shadow-sm border border-emerald-100" : "text-gray-500 hover:bg-gray-100"
                )}
              >
                <FileText className="h-4 w-4" /> Mijn Offertes
              </button>
              <button 
                onClick={() => setActiveTab('invoices')}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'invoices' ? "bg-white text-emerald-700 shadow-sm border border-emerald-100" : "text-gray-500 hover:bg-gray-100"
                )}
              >
                <CreditCard className="h-4 w-4" /> Mijn Facturen
              </button>
            </nav>

            <div className="bg-emerald-800 rounded-2xl p-6 text-white shadow-lg shadow-emerald-900/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="h-20 w-20" />
              </div>
              <h3 className="text-lg font-bold mb-2">Hulp nodig?</h3>
              <p className="text-emerald-100 text-xs leading-relaxed mb-4">
                Heeft u vragen over uw offerte of factuur? Neem dan contact met ons op.
              </p>
              <a 
                href={`mailto:${tenant.naam}@streaminstall.nl`}
                className="inline-flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
              >
                Stuur een bericht <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </aside>

          {/* Content Area */}
          <section className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {activeTab === 'quotes' ? 'Uw Offertes' : 'Uw Facturen'}
                </h2>
              </div>

              <div className="p-0">
                {activeTab === 'quotes' ? (
                  <div className="divide-y divide-gray-50">
                    {quotes.length === 0 ? (
                      <div className="p-12 text-center text-gray-400 italic">Geen offertes gevonden.</div>
                    ) : quotes.map(quote => (
                      <div key={quote.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{quote.quoteNumber || quote.referenceNumber}</h4>
                            <p className="text-sm text-gray-500">{quote.projectName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">€{quote.amount?.toLocaleString('nl-NL')}</p>
                            <p className="text-[11px] text-gray-400 uppercase font-bold">{quote.status}</p>
                          </div>
                          <div className="flex items-center gap-2">
                             <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-9 px-4 rounded-lg gap-2"
                              onClick={() => handleDownloadPDF(quote, 'quote')}
                             >
                               <Download className="h-4 w-4" /> PDF
                             </Button>
                             {quote.status !== 'Geaccepteerd' && (
                               <Button 
                                 onClick={() => handleAcceptQuote(quote)}
                                 className="h-9 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white"
                               >
                                 Akkoord Geven
                               </Button>
                             )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {invoices.length === 0 ? (
                      <div className="p-12 text-center text-gray-400 italic">Geen facturen gevonden.</div>
                    ) : invoices.map(invoice => (
                      <div key={invoice.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <CreditCard className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{invoice.invoiceNumber || invoice.invoiceCode}</h4>
                            <p className="text-sm text-gray-500">{invoice.projectName} • {invoice.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">€{invoice.totalIncl?.toLocaleString('nl-NL')}</p>
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full",
                              invoice.fullyPaid ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                            )}>
                              {invoice.fullyPaid ? 'BETAALD' : 'OPENSTAAND'}
                            </span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-4 rounded-lg gap-2"
                            onClick={() => handleDownloadPDF(invoice, 'invoice')}
                          >
                            <Download className="h-4 w-4" /> PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} {tenant.naam}. Beveiligd klantportaal.</p>
        </div>
      </footer>
    </div>
  );
}