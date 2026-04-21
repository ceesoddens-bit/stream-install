import { addDoc, Timestamp } from 'firebase/firestore';
import { tenantCol } from './firebase';
import { Quote, Invoice } from '@/types';
import { Tenant } from '@/lib/tenantTypes';
import { pdfService } from './pdfService';
import { QuoteTemplate } from '@/components/pdf/QuoteTemplate';
import { InvoiceTemplate } from '@/components/pdf/InvoiceTemplate';
import { OrderConfirmationTemplate } from '@/components/pdf/OrderConfirmationTemplate';
import React from 'react';

const MAIL_COLLECTION = 'mail';

export const automationService = {
  /**
   * Basis functie om een mail in de wachtrij te zetten
   */
  queueEmail: async (to: string, subject: string, html: string, attachments: any[] = []) => {
    try {
      await addDoc(tenantCol(MAIL_COLLECTION), {
        to: [to],
        message: {
          subject,
          html,
          attachments
        },
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Error queuing email: ", error);
      throw error;
    }
  },

  /**
   * Verzendt een offerte email met PDF bijlage
   */
  sendQuoteEmail: async (quote: Quote, tenant: Tenant, to: string) => {
    // 1. Genereer PDF
    const blob = await pdfService.generateBlob(<QuoteTemplate quote={quote} tenant={tenant} />);
    
    // 2. Upload naar Storage om een URL te krijgen (of stuur als base64 als de extensie dat toestaat)
    // De extensie kan ook 'content' als base64 accepteren.
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
    });
    reader.readAsDataURL(blob);
    const base64Content = await base64Promise;

    // 3. Queue mail
    const html = `
      <div style="font-family: sans-serif; color: #333;">
        <h2>Offerte van ${tenant.naam}</h2>
        <p>Beste ${quote.clientName || quote.contactName},</p>
        <p>Hierbij ontvangt u de offerte <strong>${quote.quoteNumber || quote.referenceNumber}</strong> voor het project <strong>${quote.projectName}</strong>.</p>
        <p>In de bijlage vindt u de volledige offerte in PDF formaat.</p>
        <br/>
        <p>Met vriendelijke groet,</p>
        <p>${tenant.naam}</p>
      </div>
    `;

    await automationService.queueEmail(
      to,
      `Offerte ${quote.quoteNumber || quote.referenceNumber} - ${tenant.naam}`,
      html,
      [{
        filename: `Offerte-${quote.quoteNumber || quote.id}.pdf`,
        content: base64Content,
        encoding: 'base64'
      }]
    );
  },

  /**
   * Verzendt een factuur email met PDF bijlage
   */
  sendInvoiceEmail: async (invoice: Invoice, tenant: Tenant, to: string) => {
    const blob = await pdfService.generateBlob(<InvoiceTemplate invoice={invoice} tenant={tenant} />);
    
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
    });
    reader.readAsDataURL(blob);
    const base64Content = await base64Promise;

    const html = `
      <div style="font-family: sans-serif; color: #333;">
        <h2>Factuur van ${tenant.naam}</h2>
        <p>Beste ${invoice.clientName || invoice.contactName},</p>
        <p>Hierbij ontvangt u factuur <strong>${invoice.invoiceNumber || invoice.invoiceCode}</strong>.</p>
        <p>Wij verzoeken u vriendelijk het bedrag van <strong>€${invoice.totalIncl?.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</strong> binnen de gestelde termijn te voldoen.</p>
        <br/>
        <p>Met vriendelijke groet,</p>
        <p>${tenant.naam}</p>
      </div>
    `;

    await automationService.queueEmail(
      to,
      `Factuur ${invoice.invoiceNumber || invoice.invoiceCode} - ${tenant.naam}`,
      html,
      [{
        filename: `Factuur-${invoice.invoiceNumber || invoice.id}.pdf`,
        content: base64Content,
        encoding: 'base64'
      }]
    );
  },

  /**
   * Verzendt een orderbevestiging
   */
  sendOrderConfirmation: async (quote: Quote, tenant: Tenant, to: string) => {
    const blob = await pdfService.generateBlob(<OrderConfirmationTemplate quote={quote} tenant={tenant} />);
    
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
    });
    reader.readAsDataURL(blob);
    const base64Content = await base64Promise;

    const html = `
      <div style="font-family: sans-serif; color: #333;">
        <h2>Orderbevestiging: ${quote.projectName}</h2>
        <p>Beste ${quote.clientName || quote.contactName},</p>
        <p>Bedankt voor uw akkoord op de offerte! Hierbij bevestigen wij uw opdracht.</p>
        <p>Onze planning zal spoedig contact met u opnemen.</p>
        <br/>
        <p>Met vriendelijke groet,</p>
        <p>${tenant.naam}</p>
      </div>
    `;

    await automationService.queueEmail(
      to,
      `Orderbevestiging ${quote.projectName} - ${tenant.naam}`,
      html,
      [{
        filename: `Bevestiging-${quote.id}.pdf`,
        content: base64Content,
        encoding: 'base64'
      }]
    );
  },

  /**
   * Automatiseringslogica bij statuswijziging van een offerte
   */
  handleQuoteStatusChange: async (quote: Quote, newStatus: string, tenant: Tenant) => {
    if (newStatus === 'Geaccepteerd') {
      // Trigger orderbevestiging email (indien email bekend)
      const email = (quote as any).contactEmail;
      if (email) {
        await automationService.sendOrderConfirmation(quote, tenant, email);
      }
    }
  }
};
