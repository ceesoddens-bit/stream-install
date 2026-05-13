import React from 'react';
import { Document } from '@react-pdf/renderer';
import { SharedLayout } from './SharedLayout';
import { Tenant } from '../tenantTypes';
import { Quote } from '../../types';

interface OfferteTemplateProps {
  tenant: Tenant;
  quote: Quote;
}

export function OfferteTemplate({ tenant, quote }: OfferteTemplateProps) {
  const lineItems = quote.lineItems || [];
  
  const subtotal = lineItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vatAmount = lineItems.reduce((acc, item) => acc + (item.price * item.quantity * (item.vatRate / 100)), 0);
  const total = subtotal + vatAmount;

  return (
    <Document>
      <SharedLayout 
        tenant={tenant}
        clientName={quote.clientName}
        docTitle={`Offerte ${quote.quoteNumber}`}
        meta={[
          { label: 'Offertedatum', value: new Date(quote.date).toLocaleDateString('nl-NL') },
          { label: 'Offertenummer', value: quote.quoteNumber },
          { label: 'Referentie', value: quote.referenceNumber || '-' }
        ]}
        lineItems={lineItems}
        subtotal={subtotal}
        vatAmount={vatAmount}
        total={total}
        notes={`Graag deze offerte uiterlijk binnen 14 dagen accorderen.`}
      />
    </Document>
  );
}
