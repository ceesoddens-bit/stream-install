import React from 'react';
import { 
  Page, 
  Text, 
  View, 
  Document, 
  StyleSheet, 
  Font,
  Image
} from '@react-pdf/renderer';
import { Tenant } from '@/lib/tenantTypes';

// Registreer een nette font (optioneel, anders fallback naar Helvetica)
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
// });

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#334155', // Slate 700
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 20,
  },
  logo: {
    width: 120,
    height: 'auto',
  },
  companyInfo: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  metaGrid: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  metaCol: {
    flex: 1,
  },
  label: {
    fontSize: 8,
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 10,
    color: '#1E293B',
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginBottom: 30,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
    minHeight: 24,
    paddingVertical: 6,
  },
  tableHeader: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    fontWeight: 'bold',
  },
  colDescription: { width: '50%' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '20%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },
  
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  totalsBox: {
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: '#0F172A',
    marginTop: 8,
    paddingTop: 8,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#0F172A',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#94A3B8',
  }
});

interface BaseProps {
  tenant: Tenant;
  title: string;
  children: React.ReactNode;
  recipient: {
    name: string;
    address?: string;
    email?: string;
  };
  meta: Array<{ label: string; value: string }>;
}

export const PDFBase: React.FC<BaseProps> = ({ tenant, title, children, recipient, meta }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          {tenant.branding?.logoUrl ? (
            <Image src={tenant.branding.logoUrl} style={styles.logo} />
          ) : (
            <Text style={[styles.companyName, { color: tenant.branding?.kleur || '#0F172A' }]}>
              {tenant.naam}
            </Text>
          )}
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{tenant.naam}</Text>
          <Text>{tenant.adres?.straat} {tenant.adres?.nummer}</Text>
          <Text>{tenant.adres?.postcode} {tenant.adres?.plaats}</Text>
          <Text>{tenant.adres?.land}</Text>
        </View>
      </View>

      {/* Recipient & Title */}
      <View style={{ marginBottom: 40 }}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.metaGrid}>
          <View style={styles.metaCol}>
            <Text style={styles.label}>Factureren aan</Text>
            <Text style={[styles.value, { fontWeight: 'bold' }]}>{recipient.name}</Text>
            {recipient.address && <Text style={styles.value}>{recipient.address}</Text>}
            {recipient.email && <Text style={styles.value}>{recipient.email}</Text>}
          </View>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
            {meta.map((m, i) => (
              <View key={i} style={{ width: '50%', marginBottom: 10 }}>
                <Text style={styles.label}>{m.label}</Text>
                <Text style={styles.value}>{m.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text>KvK: {tenant.kvk || '-'}</Text>
          <Text>BTW: {tenant.btw || '-'}</Text>
        </View>
        <View style={{ textAlign: 'center' }}>
          <Text>Bank: {tenant.bank?.tenaamstelling || tenant.naam}</Text>
          <Text>IBAN: {tenant.bank?.iban || '-'}</Text>
        </View>
        <View style={{ textAlign: 'right' }}>
          <Text>Pagina 1 van 1</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export const PriceRow = ({ label, value, isBold = false }: { label: string; value: string; isBold?: boolean }) => (
  <View style={[styles.totalRow, isBold && styles.grandTotal]}>
    <Text>{label}</Text>
    <Text>{value}</Text>
  </View>
);
