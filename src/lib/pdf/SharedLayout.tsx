import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Tenant } from '../tenantTypes';
import { LineItem } from '../../types';

// Optioneel: Registreer een mooi font als dat nodig is. We gebruiken standaard Helvetica.
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    maxHeight: 60,
    objectFit: 'contain',
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 9,
    lineHeight: 1.4,
    color: '#666',
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  clientInfoContainer: {
    marginBottom: 40,
  },
  clientName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clientDetails: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#444',
  },
  titleSection: {
    marginBottom: 20,
  },
  docTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },
  metaTable: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  metaCol: {
    marginRight: 40,
  },
  metaLabel: {
    fontSize: 8,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#666',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: 'right' },
  colPrice: { flex: 1, textAlign: 'right' },
  colVat: { flex: 1, textAlign: 'right' },
  colTotal: { flex: 1, textAlign: 'right' },
  totals: {
    width: '40%',
    alignSelf: 'flex-end',
    marginBottom: 40,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalRowBold: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  totalLabel: {
    color: '#666',
  },
  totalValue: {
    textAlign: 'right',
  },
  totalValueBold: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#888',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  customColorBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 6,
  }
});

interface SharedLayoutProps {
  tenant: Tenant;
  clientName: string;
  clientAddress?: string;
  docTitle: string;
  meta: Array<{ label: string; value: string }>;
  lineItems: LineItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
  notes?: string;
  footerText?: string;
}

export function SharedLayout({ 
  tenant, 
  clientName, 
  clientAddress, 
  docTitle, 
  meta, 
  lineItems,
  subtotal,
  vatAmount,
  total,
  notes,
  footerText
}: SharedLayoutProps) {
  
  const formatCurrency = (amount: number) => {
    return '€ ' + amount.toFixed(2).replace('.', ',');
  };

  const primaryColor = tenant.branding?.kleur || '#059669';

  return (
    <Page size="A4" style={styles.page}>
      <View style={[styles.customColorBar, { backgroundColor: primaryColor }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          {tenant.branding?.logoUrl ? (
            <Image src={tenant.branding.logoUrl} style={styles.logo} />
          ) : (
            <Text style={[styles.companyName, { color: primaryColor }]}>{tenant.naam}</Text>
          )}
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{tenant.branding?.bedrijfsnaam || tenant.naam}</Text>
          {tenant.adres?.straat && <Text>{tenant.adres.straat} {tenant.adres.nummer}</Text>}
          {(tenant.adres?.postcode || tenant.adres?.plaats) && (
            <Text>{tenant.adres.postcode} {tenant.adres.plaats}</Text>
          )}
          {tenant.adres?.land && <Text>{tenant.adres.land}</Text>}
        </View>
      </View>

      {/* Client Info */}
      <View style={styles.clientInfoContainer}>
        <Text style={styles.clientName}>{clientName}</Text>
        {clientAddress ? (
          <Text style={styles.clientDetails}>{clientAddress}</Text>
        ) : (
          <Text style={styles.clientDetails}>Adres onbekend</Text>
        )}
      </View>

      {/* Title & Meta */}
      <View style={styles.titleSection}>
        <Text style={[styles.docTitle, { color: primaryColor }]}>{docTitle}</Text>
      </View>

      <View style={styles.metaTable}>
        {meta.map((m, i) => (
          <View key={i} style={styles.metaCol}>
            <Text style={styles.metaLabel}>{m.label}</Text>
            <Text style={styles.metaValue}>{m.value}</Text>
          </View>
        ))}
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.colDesc]}>Omschrijving</Text>
          <Text style={[styles.tableHeaderCell, styles.colQty]}>Aantal</Text>
          <Text style={[styles.tableHeaderCell, styles.colPrice]}>Prijs</Text>
          <Text style={[styles.tableHeaderCell, styles.colVat]}>BTW</Text>
          <Text style={[styles.tableHeaderCell, styles.colTotal]}>Totaal</Text>
        </View>
        
        {lineItems.map((item, i) => {
          const itemTotal = item.quantity * item.price;
          return (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatCurrency(item.price)}</Text>
              <Text style={styles.colVat}>{item.vatRate}%</Text>
              <Text style={styles.colTotal}>{formatCurrency(itemTotal)}</Text>
            </View>
          );
        })}
      </View>

      {/* Totals */}
      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotaal</Text>
          <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>BTW bedrag</Text>
          <Text style={styles.totalValue}>{formatCurrency(vatAmount)}</Text>
        </View>
        <View style={styles.totalRowBold}>
          <Text style={styles.totalLabel}>Totaal (incl. BTW)</Text>
          <Text style={[styles.totalValue, styles.totalValueBold, { color: primaryColor }]}>{formatCurrency(total)}</Text>
        </View>
      </View>

      {/* Notes */}
      {notes && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 9, lineHeight: 1.4 }}>{notes}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>
          {tenant.branding?.bedrijfsnaam || tenant.naam} 
          {tenant.kvk ? ` | KVK: ${tenant.kvk}` : ''} 
          {tenant.btw ? ` | BTW: ${tenant.btw}` : ''} 
          {tenant.bank?.iban ? ` | IBAN: ${tenant.bank.iban}` : ''}
        </Text>
        {footerText && <Text style={{ marginTop: 4 }}>{footerText}</Text>}
      </View>
    </Page>
  );
}
