import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PDFBase, PriceRow, styles } from './PDFBase';
import { Quote, LineItem } from '@/types';
import { Tenant } from '@/lib/tenantTypes';

interface Props {
  quote: Quote;
  tenant: Tenant;
}

export const OrderConfirmationTemplate: React.FC<Props> = ({ quote, tenant }) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);

  const lineItems = quote.lineItems || [
    { id: '1', description: 'Bevestigde bestelling conform offerte', quantity: 1, price: quote.amount, vatRate: 21 }
  ];

  const totalExcl = lineItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vatTotal = lineItems.reduce((acc, item) => acc + (item.price * item.quantity * (item.vatRate / 100)), 0);
  const totalIncl = totalExcl + vatTotal;

  const meta = [
    { label: 'Ordernummer', value: `ORD-${quote.quoteNumber?.split('-')[1] || quote.id.slice(-5)}` },
    { label: 'Bevestigingsdatum', value: new Date().toLocaleDateString('nl-NL') },
    { label: 'Referentie', value: quote.quoteNumber || quote.id },
    { label: 'Project', value: quote.projectName },
  ];

  return (
    <PDFBase 
      tenant={tenant} 
      title="Orderbevestiging" 
      recipient={{ name: quote.clientName || quote.contactName, email: '' }}
      meta={meta}
    >
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 10 }}>
          Hartelijk dank voor uw opdracht. Hierbij bevestigen wij de bestelling van de onderstaande artikelen/diensten. 
          Wij zullen spoedig contact met u opnemen voor de verdere afhandeling en planning.
        </Text>
      </View>

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
        <Text style={styles.label}>Vervolgstappen</Text>
        <Text style={{ fontSize: 8 }}>
          Onze planning zal binnen 2 werkdagen contact met u opnemen om een definitieve datum af te spreken voor de uitvoering.
        </Text>
      </View>
    </PDFBase>
  );
};
