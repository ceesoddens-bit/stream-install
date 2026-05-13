import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { EditDialog } from '../ui/EditDialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { financeService } from '@/lib/financeService';
import { Quote, Invoice, LineItem } from '@/types';
import { toast } from 'sonner';
import { useTenant } from '@/lib/tenantContext';
import { aiService } from '@/lib/aiService';
import { Button } from '../ui/button';
import { Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuoteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote?: Quote | null;
}

import { automationService } from '@/lib/automationService';

const eur = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });

const VAT_OPTIONS = [0, 9, 21];

function newLineItem(): LineItem {
  return { id: crypto.randomUUID(), description: '', quantity: 1, price: 0, vatRate: 21 };
}

export function QuoteEditDialog({ open, onOpenChange, quote }: QuoteProps) {
  const { heeftToegang, tenant } = useTenant();
  const hasAi = heeftToegang('ai_assistent');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([newLineItem()]);

  const form = useForm<Partial<Quote>>({
    defaultValues: {
      title: '',
      status: 'Concept',
      projectName: '',
      contactName: '',
      sentDate: '',
      openedCount: 0,
      projectStatus: 'Offerte maken'
    }
  });

  useEffect(() => {
    if (!open) return;
    if (quote) {
      form.reset(quote);
      setLineItems(quote.lineItems?.length ? quote.lineItems : [newLineItem()]);
    } else {
      form.reset({ title: '', status: 'Concept', sentDate: new Date().toISOString().split('T')[0], openedCount: 0 });
      setLineItems([newLineItem()]);
    }
  }, [quote, open]);

  const updateItem = useCallback((id: string, field: keyof LineItem, raw: string) => {
    setLineItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const numFields: (keyof LineItem)[] = ['quantity', 'price', 'vatRate'];
      return { ...item, [field]: numFields.includes(field) ? (parseFloat(raw) || 0) : raw };
    }));
  }, []);

  const removeItem = (id: string) => setLineItems(prev => prev.filter(i => i.id !== id));
  const addItem = () => setLineItems(prev => [...prev, newLineItem()]);

  const subtotal = lineItems.reduce((s, i) => s + i.quantity * i.price, 0);
  const vatAmount = lineItems.reduce((s, i) => s + i.quantity * i.price * (i.vatRate / 100), 0);
  const total = subtotal + vatAmount;

  const onSubmit = async (values: Partial<Quote>) => {
    try {
      const payload: Partial<Quote> = { ...values, lineItems, totalAmount: subtotal };
      if (quote?.id) {
        await financeService.updateQuote(quote.id, payload);
        if (values.status && values.status !== quote.status && tenant) {
          automationService.handleQuoteStatusChange(quote, values.status, tenant);
        }
        toast.success('Offerte bijgewerkt');
      } else {
        await financeService.addQuote(payload as Quote);
        toast.success('Offerte aangemaakt');
      }
      onOpenChange(false);
    } catch (err) {
      toast.error('Fout bij opslaan');
    }
  };

  const handleGenerateQuote = async () => {
    setIsAiLoading(true);
    try {
      await aiService.generate('Maak een offerte concept aan op basis van veelgebruikte zonnepanelen installaties', 'quote');
      form.setValue('title', 'AI: Zonnepanelen Installatie 10 stuks');
      form.setValue('projectName', 'Installatie 10x 400Wp');
      setLineItems([
        { id: crypto.randomUUID(), description: 'Zonnepanelen 400Wp (10 stuks)', quantity: 10, price: 250, vatRate: 21 },
        { id: crypto.randomUUID(), description: 'Omvormer 3kW', quantity: 1, price: 800, vatRate: 21 },
        { id: crypto.randomUUID(), description: 'Montage & installatie', quantity: 1, price: 950, vatRate: 21 },
      ]);
      toast.success('Offerte concept gegenereerd');
    } catch (error) {
      toast.error('Fout bij genereren');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <EditDialog
      open={open}
      onOpenChange={onOpenChange}
      title={quote ? 'Offerte bewerken' : 'Nieuwe offerte'}
      form={form}
      onSubmit={onSubmit}
    >
      <div className="space-y-5 min-w-[580px]">
        {hasAi && !quote && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              onClick={handleGenerateQuote}
              disabled={isAiLoading}
            >
              {isAiLoading ? 'Genereren...' : '✨ AI Concept Genereren'}
            </Button>
          </div>
        )}

        {/* Basis */}
        <div className="space-y-1.5">
          <Label>Onderwerp</Label>
          <Input {...form.register('title')} placeholder="bijv. Zonnepanelen Installatie" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Klant / Contact</Label>
            <Input {...form.register('contactName')} />
          </div>
          <div className="space-y-1.5">
            <Label>Project</Label>
            <Input {...form.register('projectName')} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select
            {...form.register('status')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Concept">Concept</option>
            <option value="Verstuurd">Verstuurd</option>
            <option value="Geaccepteerd">Geaccepteerd</option>
            <option value="Rejected">Afgewezen</option>
          </select>
        </div>

        {/* Regeleditor */}
        <div className="space-y-2">
          <Label>Regeloverzicht</Label>
          <div className="rounded-md border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <tr>
                  <th className="px-3 py-2 text-left w-[40%]">Omschrijving</th>
                  <th className="px-2 py-2 text-right w-[10%]">Aantal</th>
                  <th className="px-2 py-2 text-right w-[15%]">Prijs excl.</th>
                  <th className="px-2 py-2 text-right w-[10%]">BTW%</th>
                  <th className="px-2 py-2 text-right w-[15%]">Totaal</th>
                  <th className="px-2 py-2 w-[10%]" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lineItems.map((item) => (
                  <tr key={item.id} className="group">
                    <td className="px-2 py-1.5">
                      <Input
                        value={item.description}
                        onChange={e => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Omschrijving..."
                        className="h-8 text-xs border-transparent group-hover:border-gray-200 focus:border-gray-300"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <Input
                        type="number"
                        min={0}
                        value={item.quantity}
                        onChange={e => updateItem(item.id, 'quantity', e.target.value)}
                        className="h-8 text-xs text-right border-transparent group-hover:border-gray-200 focus:border-gray-300"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={item.price}
                        onChange={e => updateItem(item.id, 'price', e.target.value)}
                        className="h-8 text-xs text-right border-transparent group-hover:border-gray-200 focus:border-gray-300"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <select
                        value={item.vatRate}
                        onChange={e => updateItem(item.id, 'vatRate', e.target.value)}
                        className="h-8 w-full rounded-md border border-transparent group-hover:border-gray-200 focus:border-gray-300 bg-background px-1 text-xs text-right"
                      >
                        {VAT_OPTIONS.map(v => <option key={v} value={v}>{v}%</option>)}
                      </select>
                    </td>
                    <td className="px-2 py-1.5 text-right text-xs font-medium text-gray-700 tabular-nums whitespace-nowrap">
                      {eur.format(item.quantity * item.price)}
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className={cn("text-gray-300 hover:text-red-500 transition-colors", lineItems.length === 1 && "invisible")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium mt-1"
          >
            <Plus className="h-3.5 w-3.5" /> Regel toevoegen
          </button>
        </div>

        {/* Totalen */}
        <div className="rounded-md bg-gray-50 border border-gray-200 p-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotaal (excl. BTW)</span>
            <span className="tabular-nums font-medium">{eur.format(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>BTW</span>
            <span className="tabular-nums font-medium">{eur.format(vatAmount)}</span>
          </div>
          <div className="flex justify-between text-gray-900 font-bold border-t border-gray-200 pt-1.5 mt-1">
            <span>Totaal incl. BTW</span>
            <span className="tabular-nums">{eur.format(total)}</span>
          </div>
        </div>
      </div>
    </EditDialog>
  );
}

interface InvoiceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;
}

export function InvoiceEditDialog({ open, onOpenChange, invoice }: InvoiceProps) {
  const form = useForm<Partial<Invoice>>({
    defaultValues: {
      invoiceCode: '',
      status: 'Concept',
      projectName: '',
      contactName: '',
      totalExcl: 0,
      totalIncl: 0,
      fullyPaid: false
    }
  });

  useEffect(() => {
    if (invoice) form.reset(invoice);
    else form.reset({ invoiceCode: `FACT-${Date.now().toString().slice(-6)}`, status: 'Concept', totalExcl: 0, totalIncl: 0, fullyPaid: false });
  }, [invoice, open]);

  const onSubmit = async (values: Partial<Invoice>) => {
    try {
      if (invoice?.id) {
        await financeService.updateInvoice(invoice.id, values);
        toast.success('Factuur bijgewerkt');
      } else {
        await financeService.addInvoice(values as Invoice);
        toast.success('Factuur aangemaakt');
      }
      onOpenChange(false);
    } catch (err) {
      toast.error('Fout bij opslaan');
    }
  };

  return (
    <EditDialog
      open={open}
      onOpenChange={onOpenChange}
      title={invoice ? 'Factuur bewerken' : 'Nieuwe factuur'}
      form={form}
      onSubmit={onSubmit}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Factuurnummer</Label>
            <Input {...form.register('invoiceCode')} />
          </div>
          <div className="space-y-1.5">
            <Label>Project</Label>
            <Input {...form.register('projectName')} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Klant</Label>
          <Input {...form.register('contactName')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Totaal Excl.</Label>
            <Input type="number" step="0.01" {...form.register('totalExcl', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Totaal Incl.</Label>
            <Input type="number" step="0.01" {...form.register('totalIncl', { valueAsNumber: true })} />
          </div>
        </div>
        <div className="flex items-center gap-2">
           <input type="checkbox" {...form.register('fullyPaid')} id="paid" className="rounded border-gray-300" />
           <Label htmlFor="paid">Factuur is volledig betaald</Label>
        </div>
      </div>
    </EditDialog>
  );
}
