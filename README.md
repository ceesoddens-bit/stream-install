<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/61d4af37-cba2-4800-afd8-9821850fff02

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Demo-tenant seeden

Seed een demo-tenant met voorbeelddata (2 companies, 5 contacts, 3 projects,
10 uren-entries, 5 tickets, 2 offertes, 3 facturen, 1 user per rol):

```
npm run seed             # voegt toe / werkt bij
npm run seed:reset       # wist de demo-tenant eerst, dan opnieuw seeden
```

Vereist dat `.env` de `VITE_FIREBASE_*` keys bevat en dat Email/Password-auth
in Firebase is ingeschakeld.

### Demo-credentials

Wachtwoord voor alle demo-users: `Demo1234!`

| Rol | E-mail |
|---|---|
| owner | owner@demo.streaminstall.app |
| admin | admin@demo.streaminstall.app |
| manager | manager@demo.streaminstall.app |
| sales | sales@demo.streaminstall.app |
| finance | finance@demo.streaminstall.app |
| technician | tech@demo.streaminstall.app |
| customer | klant@demo.streaminstall.app |
