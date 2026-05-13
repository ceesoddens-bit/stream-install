import React from 'react';
import { Document } from '@react-pdf/renderer';
import { SharedLayout } from './SharedLayout';
import { Tenant } from '../tenantTypes';
import { Invoice } from '../../types';

interface FactuurTemplateProps {
  tenant: Tenant;
  invoice: Invoice;
}

export function FactuurTemplate({ tenant, invoice }: FactuurTemplateProps) {
  const lineItems = invoice.lineItems || [];
  
  const subtotal = lineItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vatAmount = lineItems.reduce((acc, item) => acc + (item.price * item.quantity * (item.vatRate / 100)), 0);
  const total = subtotal + vatAmount;

  // Vervaldatum is factuurdatum + 14 dagen
  const invoiceDate = new Date(invoice.date);
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 14);

  return (
    <Document>
      <SharedLayout 
        tenant={tenant}
        clientName={invoice.clientName}
        docTitle={`Factuur ${invoice.invoiceNumber}`}
        meta={[
          { label: 'Factuurdatum', value: invoiceDate.toLocaleDateString('nl-NL') },
          { label: 'Vervaldatum', value: dueDate.toLocaleDateString('nl-NL') },
          { label: 'Factuurnummer', value: invoice.invoiceNumber }
        ]}
        lineItems={lineItems}
        subtotal={subtotal}
        vatAmount={vatAmount}
        total={total}
        notes={`Wij verzoeken u vriendelijk het factuurbedrag van € ${(total).toFixed(2).replace('.', ',')} voor ${dueDate.toLocaleDateString('nl-NL')} over te maken op IBAN ${tenant.bank?.iban || '...'} t.n.v. ${tenant.bank?.tenaamstelling || tenant.naam} onder vermelding van factuurnummer ${invoice.invoiceNumber}.`}
      />
    </Document>
  );
}
