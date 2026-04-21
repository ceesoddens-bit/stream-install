import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PDFBase, PriceRow, styles } from './PDFBase';
import { Invoice } from '@/types';
import { Tenant } from '@/lib/tenantTypes';

interface Props {
  invoice: Invoice;
  tenant: Tenant;
}

export const PaymentReminderTemplate: React.FC<Props> = ({ invoice, tenant }) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);

  const totalIncl = invoice.totalIncl || invoice.amount;

  const meta = [
    { label: 'Factuurnummer', value: invoice.invoiceNumber || invoice.invoiceCode },
    { label: 'Originele datum', value: invoice.date || '-' },
    { label: 'Herinneringsdatum', value: new Date().toLocaleDateString('nl-NL') },
    { label: 'Openstaand bedrag', value: formatCurrency(totalIncl) },
  ];

  return (
    <PDFBase 
      tenant={tenant} 
      title="Betalingsherinnering" 
      recipient={{ name: invoice.clientName || invoice.contactName, email: '' }}
      meta={meta}
    >
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 10 }}>Onderwerp: Eerste herinnering factuur {invoice.invoiceNumber || invoice.invoiceCode}</Text>
        <Text style={{ fontSize: 10 }}>
          Uit onze administratie is gebleken dat de onderstaande factuur nog niet (volledig) is voldaan. 
          Waarschijnlijk is dit aan uw aandacht ontsnapt. Wij verzoeken u vriendelijk het openstaande bedrag 
          alsnog binnen 7 dagen aan ons over te maken.
        </Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={{ width: '60%', fontWeight: 'bold' }}>Omschrijving</Text>
          <Text style={{ width: '40%', textAlign: 'right', fontWeight: 'bold' }}>Bedrag</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={{ width: '60%' }}>Factuur {invoice.invoiceNumber || invoice.invoiceCode} d.d. {invoice.date}</Text>
          <Text style={{ width: '40%', textAlign: 'right' }}>{formatCurrency(totalIncl)}</Text>
        </View>
      </View>

      <View style={styles.totalsContainer}>
        <View style={styles.totalsBox}>
          <PriceRow label="Totaal openstaand" value={formatCurrency(totalIncl)} isBold />
        </View>
      </View>

      <View style={{ marginTop: 40 }}>
        <Text style={styles.label}>Betaalwijze</Text>
        <Text style={{ fontSize: 8 }}>
          U kunt het bedrag overmaken naar IBAN {tenant.bank?.iban || '-'} ten name van {tenant.bank?.tenaamstelling || tenant.naam}. 
          Mocht u in de tussentijd al hebben betaald, dan kunt u deze herinnering als niet verzonden beschouwen.
        </Text>
      </View>
    </PDFBase>
  );
};
