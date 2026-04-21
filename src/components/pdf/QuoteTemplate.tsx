import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PDFBase, PriceRow, styles } from './PDFBase';
import { Quote, LineItem } from '@/types';
import { Tenant } from '@/lib/tenantTypes';

interface Props {
  quote: Quote;
  tenant: Tenant;
}

export const QuoteTemplate: React.FC<Props> = ({ quote, tenant }) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);

  const lineItems = quote.lineItems || [
    { id: '1', description: 'Installatie zonnepanelen pakket', quantity: 1, price: quote.amount, vatRate: 21 }
  ];

  const totalExcl = lineItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vatTotal = lineItems.reduce((acc, item) => acc + (item.price * item.quantity * (item.vatRate / 100)), 0);
  const totalIncl = totalExcl + vatTotal;

  const meta = [
    { label: 'Offertenummer', value: quote.quoteNumber || quote.referenceNumber },
    { label: 'Datum', value: quote.date || new Date().toLocaleDateString('nl-NL') },
    { label: 'Project', value: quote.projectName },
    { label: 'Geldig tot', value: '30 dagen na dagtekening' },
  ];

  return (
    <PDFBase 
      tenant={tenant} 
      title="Offerte" 
      recipient={{ name: quote.clientName || quote.contactName, email: '' }}
      meta={meta}
    >
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.colDescription, { fontWeight: 'bold' }]}>Beschrijving</Text>
          <Text style={[styles.colQty, { fontWeight: 'bold' }]}>Aantal</Text>
          <Text style={[styles.colPrice, { fontWeight: 'bold' }]}>Prijs</Text>
          <Text style={[styles.colTotal, { fontWeight: 'bold' }]}>Totaal</Text>
        </View>

        {lineItems.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.colDescription}>{item.description}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>{formatCurrency(item.price)}</Text>
            <Text style={styles.colTotal}>{formatCurrency(item.price * item.quantity)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totalsContainer}>
        <View style={styles.totalsBox}>
          <PriceRow label="Subtotaal (excl. BTW)" value={formatCurrency(totalExcl)} />
          <PriceRow label="BTW (21%)" value={formatCurrency(vatTotal)} />
          <PriceRow label="Totaal" value={formatCurrency(totalIncl)} isBold />
        </View>
      </View>

      <View style={{ marginTop: 40 }}>
        <Text style={styles.label}>Voorwaarden</Text>
        <Text style={{ fontSize: 8 }}>
          Op alle offertes zijn onze algemene voorwaarden van toepassing. 
          Deze offerte is 30 dagen geldig. Bij akkoord gaan wij over tot planning van de werkzaamheden.
        </Text>
      </View>
    </PDFBase>
  );
};
