# AI-assistent

## Status
Volledig gebouwd. Gemini-integratie via Firebase Extension (`@google/genai`). AI-chat popup in sidebar. Genereren van offerteteksten, ticket-samenvattingen, ticket-replies en e-mail replies. Mock-fallback aanwezig.

## Firestore collecties
- `tenants/{tenantId}/ai_requests` — AI-verzoeken: prompt, context, type (quote/ticket_summary/ticket_reply/email_reply), status (PENDING/PROCESSING/COMPLETED/ERROR), response, error, timestamps

## Services
- [src/lib/aiService.ts](../../src/lib/aiService.ts) — `generate(prompt, type, context)` — schrijft naar `ai_requests`, luistert op response van Gemini Extension; bevat mock-fallback

## Componenten
- [src/components/layout/AIChatPopup.tsx](../../src/components/layout/AIChatPopup.tsx) — AI-chat interface in sidebar (toggle)

## Koppelingen met andere modules
- **Offertes**: type `quote` — AI genereert offertetekst op basis van context
- **Tickets**: type `ticket_summary` — AI vat ticket samen; type `ticket_reply` — AI stelt antwoord voor
- **CRM**: type `email_reply` — AI stelt e-mail reply voor aan contact
- **Firebase Extension**: Gemini Extension verwerkt `ai_requests` async en schrijft `response` terug

## Permissies
| Rol | Toegang |
|-----|---------|
| owner | volledig |
| admin | volledig |
| member | toegang tot AI-chat indien module actief |
| customer | geen toegang |

## Module-toegang
Module-key: `ai_assistent` — **betaald** (€20/gebruiker/maand)
Wrap views met `<ModuleGuard module="ai_assistent">`.
[TODO: verificatie nodig] AIChatPopup in sidebar al geconditional op module-toegang?

## Nog te bouwen
- [TODO: verificatie nodig] Context-aware suggesties per module (bijv. automatisch context van huidig project meegeven)
- [TODO: verificatie nodig] Streaming responses (nu polling op status)
- [TODO: verificatie nodig] Kosten-monitoring per tenant (Gemini API usage)
- [TODO: verificatie nodig] Prompt-templates per bedrijf configureerbaar
