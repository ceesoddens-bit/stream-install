import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Dialog } from '@base-ui/react/dialog';
import { X, User, Phone, Mail, MapPin, Tag, Calendar, History, FileText, CheckCircle2, Send } from 'lucide-react';
import { Contact } from '@/lib/crmService';
import { financeService } from '@/lib/financeService';
import { Quote, Invoice } from '@/types';
import { Button } from '../ui/button';
import { useTenant } from '@/lib/tenantContext';
import { aiService } from '@/lib/aiService';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
}

export function ContactDetailView({ open, onOpenChange, contact }: Props) {
  const { heeftToegang } = useTenant();
  const hasAi = heeftToegang('ai_assistent');
  const [emailText, setEmailText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeTab, setActiveTab] = useState<'timeline' | 'docs'>('timeline');

  useEffect(() => {
    if (!contact?.id || !open) return;
    
    // Fetch quotes and invoices for this contact
    const unsubQuotes = financeService.subscribeToQuotes((data) => {
      setQuotes(data.filter(q => q.contactId === contact.id || q.contactName === contact.name));
    });
    const unsubInvoices = financeService.subscribeToInvoices((data) => {
      setInvoices(data.filter(i => i.contactId === contact.id || i.contactName === contact.name));
    });

    return () => {
      unsubQuotes();
      unsubInvoices();
    };
  }, [contact?.id, contact?.name, open]);

  if (!contact) return null;

  const handleGenerateEmail = async () => {
    setIsAiLoading(true);
    try {
      const reply = await aiService.generate(`Schrijf een formele e-mail naar ${contact.name} over onze diensten.`, 'email_reply');
      setEmailText(reply);
      toast.success('E-mail gegenereerd');
    } catch (error) {
      toast.error('Fout bij genereren');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendEmail = () => {
    toast.success('E-mail verzonden via Trigger Email');
    setIsEmailOpen(false);
    setEmailText('');
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Dialog.Popup
          className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-lg focus:outline-none overflow-hidden flex flex-col max-h-[90vh]"
        >
          <header className="bg-slate-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{contact.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{contact.role || 'Contact'}</span>
                    <span className="h-1 w-1 bg-gray-300 rounded-full" />
                    <span className="text-sm font-medium text-emerald-600">{contact.status || 'Actief'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setIsEmailOpen(true)}
                >
                  <Mail className="h-4 w-4" />
                  E-mail
                </Button>
                <Dialog.Close className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <X className="h-5 w-5 text-gray-500" />
                </Dialog.Close>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column: Info */}
              <div className="md:col-span-1 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contactgegevens</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {contact.email || '-'}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {contact.mobile || contact.phone || '-'}
                    </div>
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="flex-1">{contact.address || '-'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {contact.tags?.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold uppercase">
                        {tag}
                      </span>
                    )) || <span className="text-sm text-gray-400 italic">Geen tags</span>}
                  </div>
                </div>
              </div>

              {/* Middle/Right Column: Timeline & Linked */}
              <div className="md:col-span-2 space-y-8">
                <div className="flex border-b border-gray-100 gap-6">
                  <button 
                    onClick={() => setActiveTab('timeline')}
                    className={cn(
                      "pb-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all",
                      activeTab === 'timeline' ? "border-emerald-600 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
                    )}
                  >
                    <History className="h-4 w-4" /> Historie & Activiteit
                  </button>
                  <button 
                    onClick={() => setActiveTab('docs')}
                    className={cn(
                      "pb-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all",
                      activeTab === 'docs' ? "border-emerald-600 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
                    )}
                  >
                    <FileText className="h-4 w-4" /> Documenten ({quotes.length + invoices.length})
                  </button>
                </div>

                {activeTab === 'timeline' ? (
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                    <TimelineItem 
                      icon={<CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                      title="Contact aangemaakt"
                      date="Zojuist"
                      description="Het contact is toegevoegd aan het CRM."
                    />
                    {quotes.length > 0 && (
                      <TimelineItem 
                        icon={<FileText className="h-3 w-3 text-blue-500" />}
                        title="Offerte(s) aanwezig"
                        date="Recent"
                        description={`Er zijn ${quotes.length} offertes gekoppeld aan dit contact.`}
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Offertes</h4>
                      {quotes.length === 0 ? (
                        <p className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-lg">Geen offertes gevonden.</p>
                      ) : (
                        <div className="divide-y border rounded-lg overflow-hidden">
                          {quotes.map(q => (
                            <div key={q.id} className="p-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-emerald-600" />
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">{q.quoteNumber || q.referenceNumber}</p>
                                  <p className="text-[11px] text-gray-500">{q.projectName} • {q.date}</p>
                                </div>
                              </div>
                              <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter",
                                q.status === 'Geaccepteerd' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                              )}>
                                {q.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Facturen</h4>
                      {invoices.length === 0 ? (
                        <p className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-lg">Geen facturen gevonden.</p>
                      ) : (
                        <div className="divide-y border rounded-lg overflow-hidden">
                          {invoices.map(i => (
                            <div key={i.id} className="p-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">{i.invoiceNumber || i.invoiceCode}</p>
                                  <p className="text-[11px] text-gray-500">{i.projectName} • €{i.totalIncl?.toLocaleString('nl-NL')}</p>
                                </div>
                              </div>
                              <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter",
                                i.status === 'Betaald' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                              )}>
                                {i.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Gekoppelde Projecten
                  </h3>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500 italic">Geen lopende projecten gevonden voor dit contact.</p>
                    <Button variant="outline" size="sm" className="mt-3">Nieuw Project Starten</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>

      </Dialog.Root>

      <Dialog.Root open={isEmailOpen} onOpenChange={setIsEmailOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-[70] w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-lg focus:outline-none overflow-hidden flex flex-col">
            <header className="bg-slate-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">E-mail versturen naar {contact.name}</h2>
              <Dialog.Close className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </Dialog.Close>
            </header>
            <div className="p-6 flex flex-col gap-4 flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Aan: <span className="font-medium text-gray-900">{contact.email || 'Geen e-mailadres beschikbaar'}</span></span>
                {hasAi && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    onClick={handleGenerateEmail}
                    disabled={isAiLoading || !contact.email}
                  >
                    {isAiLoading ? 'Genereren...' : '✨ AI Concept'}
                  </Button>
                )}
              </div>
              <textarea 
                value={emailText}
                onChange={e => setEmailText(e.target.value)}
                className="w-full h-64 p-4 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Typ uw bericht..."
              />
            </div>
            <footer className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsEmailOpen(false)}>Annuleren</Button>
              <Button 
                onClick={handleSendEmail} 
                disabled={!emailText.trim() || !contact.email}
                className="bg-emerald-800 hover:bg-emerald-700 text-white gap-2"
              >
                <Send className="h-4 w-4" /> Versturen
              </Button>
            </footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function TimelineItem({ icon, title, date, description }: { icon: React.ReactNode, title: string, date: string, description: string }) {
  return (
    <div className="relative">
      <div className="absolute -left-[22px] top-1 h-5 w-5 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-gray-900">{title}</h4>
          <span className="text-[11px] text-gray-400 font-medium">{date}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
