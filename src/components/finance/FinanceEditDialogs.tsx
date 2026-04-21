import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { EditDialog } from '../ui/EditDialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { financeService } from '@/lib/financeService';
import { Quote, Invoice } from '@/types';
import { toast } from 'sonner';
import { useTenant } from '@/lib/tenantContext';
import { aiService } from '@/lib/aiService';
import { Button } from '../ui/button';

interface QuoteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote?: Quote | null;
}

import { automationService } from '@/lib/automationService';

export function QuoteEditDialog({ open, onOpenChange, quote }: QuoteProps) {
  const { heeftToegang, tenant } = useTenant();
  const hasAi = heeftToegang('ai_assistent');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const form = useForm<Partial<Quote>>({
    defaultValues: {
      title: '',
      status: 'Concept',
      projectName: '',
      contactName: '',
      totalAmount: 0,
      sentDate: '',
      openedCount: 0,
      projectStatus: 'Offerte maken'
    }
  });

  useEffect(() => {
    if (quote) form.reset(quote);
    else form.reset({ title: 'Nieuwe offerte', status: 'Concept', totalAmount: 0, sentDate: new Date().toISOString().split('T')[0], openedCount: 0 });
  }, [quote, open]);

  const onSubmit = async (values: Partial<Quote>) => {
    try {
      if (quote?.id) {
        await financeService.updateQuote(quote.id, values);
        
        // Trigger Automatisering bij statuswijziging
        if (values.status && values.status !== quote.status && tenant) {
          automationService.handleQuoteStatusChange(quote, values.status, tenant);
        }
        
        toast.success('Offerte bijgewerkt');
      } else {
        await financeService.addQuote(values as Quote);
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
      const result = await aiService.generate('Maak een offerte concept aan op basis van veelgebruikte zonnepanelen installaties', 'quote');
      form.setValue('title', 'AI: Zonnepanelen Installatie 10 stuks');
      form.setValue('totalAmount', 4500);
      form.setValue('projectName', 'Installatie 10x 400Wp');
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
      <div className="space-y-4">
        {hasAi && !quote && (
          <div className="flex justify-end mb-2">
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Totaalbedrag (Excl. BTW)</Label>
            <Input type="number" step="0.01" {...form.register('totalAmount', { valueAsNumber: true })} />
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
              <option value="Rejected">Rejected</option>
            </select>
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
