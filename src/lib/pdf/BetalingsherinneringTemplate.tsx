import React from 'react';
import { Document } from '@react-pdf/renderer';
import { SharedLayout } from './SharedLayout';
import { Tenant } from '../tenantTypes';
import { Invoice } from '../../types';

interface BetalingsherinneringTemplateProps {
  tenant: Tenant;
  invoice: Invoice;
}

export function BetalingsherinneringTemplate({ tenant, invoice }: BetalingsherinneringTemplateProps) {
  const lineItems = invoice.lineItems || [];
  
  const subtotal = lineItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vatAmount = lineItems.reduce((acc, item) => acc + (item.price * item.quantity * (item.vatRate / 100)), 0);
  const total = subtotal + vatAmount;

  const today = new Date();
  const newDueDate = new Date(today);
  newDueDate.setDate(today.getDate() + 7);

  return (
    <Document>
      <SharedLayout 
        tenant={tenant}
        clientName={invoice.clientName}
        docTitle={`Betalingsherinnering`}
        meta={[
          { label: 'Datum', value: today.toLocaleDateString('nl-NL') },
          { label: 'Vervaldatum', value: newDueDate.toLocaleDateString('nl-NL') },
          { label: 'Oorspr. Factuurnr', value: invoice.invoiceNumber }
        ]}
        lineItems={lineItems}
        subtotal={subtotal}
        vatAmount={vatAmount}
        total={total}
        notes={`Uit onze administratie is gebleken dat factuur ${invoice.invoiceNumber} nog niet is voldaan. Wij verzoeken u het openstaande bedrag van € ${(total).toFixed(2).replace('.', ',')} binnen 7 dagen over te maken op IBAN ${tenant.bank?.iban || '...'} t.n.v. ${tenant.bank?.tenaamstelling || tenant.naam}. Indien u de betaling inmiddels heeft voldaan, kunt u deze herinnering als niet verzonden beschouwen.`}
      />
    </Document>
  );
}
