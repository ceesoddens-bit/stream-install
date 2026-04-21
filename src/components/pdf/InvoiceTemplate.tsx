import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PDFBase, PriceRow, styles } from './PDFBase';
import { Invoice, LineItem } from '@/types';
import { Tenant } from '@/lib/tenantTypes';

interface Props {
  invoice: Invoice;
  tenant: Tenant;
}

export const InvoiceTemplate: React.FC<Props> = ({ invoice, tenant }) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);

  const lineItems = invoice.lineItems || [
    { id: '1', description: 'Geleverde diensten/producten conform afspraak', quantity: 1, price: invoice.totalExcl || invoice.amount, vatRate: 21 }
  ];

  const totalExcl = lineItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vatTotal = lineItems.reduce((acc, item) => acc + (item.price * item.quantity * (item.vatRate / 100)), 0);
  const totalIncl = totalExcl + vatTotal;

  const meta = [
    { label: 'Factuurnummer', value: invoice.invoiceNumber || invoice.invoiceCode },
    { label: 'Factuurdatum', value: invoice.date || new Date().toLocaleDateString('nl-NL') },
    { label: 'Vervaldatum', value: '14 dagen na factuurdatum' },
    { label: 'Project', value: invoice.projectName },
  ];

  return (
    <PDFBase 
      tenant={tenant} 
      title="Factuur" 
      recipient={{ name: invoice.clientName || invoice.contactName, email: '' }}
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
        <Text style={styles.label}>Betalingsinformatie</Text>
        <Text style={{ fontSize: 8 }}>
          Wij verzoeken u vriendelijk het bovenstaande totaalbedrag binnen 14 dagen te voldoen 
          onder vermelding van het factuurnummer {invoice.invoiceNumber || invoice.invoiceCode}.
        </Text>
      </View>
    </PDFBase>
  );
};
