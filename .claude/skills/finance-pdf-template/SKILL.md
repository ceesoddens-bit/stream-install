---
name: finance-pdf-template
description: Genereer een nieuwe @react-pdf/renderer template (offerte/factuur/herinnering/orderbevestiging) met tenant-branding, line-items, totalen, en opslag in Firebase Storage + optioneel Trigger Email. Gebruiken bij nieuwe document-types in Finance of aanpassingen aan bestaande PDF-layout.
---

# Finance-pdf-template

Maak een tenant-aware PDF-document met consistente branding, en koppel aan de flow: genereer → upload Storage → (optioneel) queue voor e-mail.

## Inputs
1. **Document-type** — `quote`, `invoice`, `reminder`, `order_confirmation`, ...
2. **Data-bron** — welk document uit Firestore (`tenants/{t}/quotes/{id}` etc.)
3. **Heeft line-items?** — zo ja, hergebruik shared `LineItemsTable`
4. **Verstuurd via e-mail?** — zo ja, template voor `mail/` doc ook aanmaken

## Structuur

```
src/components/finance/pdf/
├── shared/
│   ├── BrandingHeader.tsx    ← logo + bedrijfsgegevens uit tenant
│   ├── AddressBlock.tsx      ← klantadres + referentie
│   ├── LineItemsTable.tsx    ← kolommen omschrijving/aantal/prijs/btw/totaal
│   ├── TotalsBlock.tsx       ← subtotaal, btw-splitsing, eindtotaal
│   ├── FooterBlock.tsx       ← betalingscondities, KvK, BTW, IBAN
│   └── styles.ts             ← @react-pdf StyleSheet constants
├── QuotePDF.tsx
├── InvoicePDF.tsx
└── ReminderPDF.tsx
```

## Implementatie-checklist

### 1. Template-component: `{Type}PDF.tsx`
- [ ] Props: `{ tenant: Tenant; document: {Type}; contact?: Contact }` — alle data pre-fetched, nooit async in render
- [ ] Gebruik `@react-pdf/renderer`: `Document`, `Page`, `View`, `Text`, `Image`
- [ ] Hergebruik shared-components
- [ ] A4 formaat, marges 40pt
- [ ] Font via `Font.register` (Geist — al in project)

### 2. Tenant-branding ophalen
- [ ] Lees `tenant.branding = { logoUrl, kleur, bedrijfsnaam }`
- [ ] Logo via `<Image src={logoUrl} />` — fallback naar tekst-logo als geen URL
- [ ] Primaire kleur toegepast op koppen en total-regel

### 3. Totaalberekening
- [ ] **Nooit hercalculeren in PDF** — gebruik opgeslagen waarden uit het document
- [ ] Reuse `recalculateTotals()` uit [src/components/administration/invoices/utils.ts](src/components/administration/invoices/utils.ts) alleen op schrijf-momenten
- [ ] BTW-splitsing per tarief (0/9/21%)
- [ ] NL-getalformat via `Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })`

### 4. Generatie-service: `src/lib/pdfService.ts`
- [ ] Functie `generateAndUpload{Type}(documentId): Promise<string>` — returnt download-URL
- [ ] Gebruikt `pdf(<{Type}PDF />).toBlob()` client-side
- [ ] Upload naar Storage pad `tenants/{tId}/{type}s/{docId}.pdf`
- [ ] Update het Firestore-document met `{ pdfUrl, pdfGeneratedAt }`

### 5. E-mail verzenden (optioneel)
- [ ] Schrijf `mail/{autoId}` document met:
  ```ts
  {
    to: [contactEmail],
    message: {
      subject: `Offerte ${documentRef} - ${tenant.branding.bedrijfsnaam}`,
      html: renderTemplate(emailTemplate, vars),
      attachments: [{ path: pdfUrl, filename: `${type}-${ref}.pdf` }]
    }
  }
  ```
- [ ] Reuse email-template uit `tenants/{t}/form_templates` (type=email) — Fase 9

### 6. UI-integratie
- [ ] "📄 Preview" knop in quote/invoice edit-form → opent PDF in modal via `<PDFViewer>`
- [ ] "📥 Download" knop → `generateAndUpload` + browser-download
- [ ] "✉️ Verstuur" knop → confirm modal → genereer + queue mail + toast

### 7. Permissies
- [ ] Alleen tonen bij `hasModule('offertes'|'facturering')` + juiste rol
- [ ] Storage-rules staan write toe aan `tenants/{tId}/quotes/**` voor juiste rollen

## Performance-tips

- `@react-pdf/renderer` is traag bij grote documenten — paginering via `<Page wrap>` en `break`-flags
- `Image` met externe URL laadt sync — pre-fetch logoUrl als base64 in tenant-context om CORS-issues te voorkomen
- Hergebruik `Document`-instance nooit — maak nieuwe component bij elke render

## Valkuilen

- **Font-registratie** moet vóór eerste render gebeuren (één keer, in module-scope)
- **Totalen mismatch**: altijd opgeslagen totalen tonen; herberekening leidt tot afrondingsdiff
- **Logo-URL** kan expire tokens bevatten (Firebase Storage) — refresh in genereer-stap
- **Trigger Email `attachments`** verwacht Storage-URL of base64 — niet een lokale pad
- **Margins op `<Page>`** vs. `<View>` — zet op Page, gebruik View-padding alleen voor sub-blokken
