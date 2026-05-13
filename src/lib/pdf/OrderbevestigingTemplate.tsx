import React from 'react';
import { Document } from '@react-pdf/renderer';
import { SharedLayout } from './SharedLayout';
import { Tenant } from '../tenantTypes';
import { Quote } from '../../types';

interface OrderbevestigingTemplateProps {
  tenant: Tenant;
  quote: Quote;
}

export function OrderbevestigingTemplate({ tenant, quote }: OrderbevestigingTemplateProps) {
  const lineItems = quote.lineItems || [];
  
  const subtotal = lineItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vatAmount = lineItems.reduce((acc, item) => acc + (item.price * item.quantity * (item.vatRate / 100)), 0);
  const total = subtotal + vatAmount;

  return (
    <Document>
      <SharedLayout 
        tenant={tenant}
        clientName={quote.clientName}
        docTitle={`Orderbevestiging`}
        meta={[
          { label: 'Datum', value: new Date().toLocaleDateString('nl-NL') },
          { label: 'Oorspr. Offertenummer', value: quote.quoteNumber },
          { label: 'Referentie', value: quote.referenceNumber || '-' }
        ]}
        lineItems={lineItems}
        subtotal={subtotal}
        vatAmount={vatAmount}
        total={total}
        notes={`Hartelijk dank voor uw opdracht. Hierbij bevestigen wij de order volgens bovenstaande specificaties.`}
      />
    </Document>
  );
}
