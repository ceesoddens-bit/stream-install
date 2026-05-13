import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

interface MailMessage {
  to: string | string[];
  cc?: string | string[];
  replyTo?: string;
  message: {
    subject: string;
    text?: string;
    html: string;
  };
}

const wrapHtml = (body: string, bedrijfsnaam: string) => `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
  .container { max-width: 600px; margin: 0 auto; padding: 24px; }
  .footer { margin-top: 32px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 16px; }
  a.btn { display: inline-block; padding: 10px 20px; background: #059669; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; }
</style></head>
<body><div class="container">
  ${body}
  <div class="footer">Dit bericht is verzonden door <strong>${bedrijfsnaam}</strong>.</div>
</div></body></html>`;

export const mailService = {
  sendMail: async (mail: MailMessage): Promise<void> => {
    await addDoc(collection(db, 'mail'), mail);
  },

  sendInvite: async (email: string, tenantNaam: string, inviteLink: string): Promise<void> => {
    await mailService.sendMail({
      to: email,
      message: {
        subject: `Uitnodiging voor ${tenantNaam}`,
        html: wrapHtml(`
          <h2>Je bent uitgenodigd</h2>
          <p>Je bent uitgenodigd om deel te nemen aan <strong>${tenantNaam}</strong>.</p>
          <p><a href="${inviteLink}" class="btn">Uitnodiging accepteren</a></p>
          <p>Of kopieer deze link: <a href="${inviteLink}">${inviteLink}</a></p>
        `, tenantNaam),
      },
    });
  },

  sendQuote: async (to: string, tenantNaam: string, quoteTitle: string, pdfUrl: string): Promise<void> => {
    await mailService.sendMail({
      to,
      message: {
        subject: `Offerte: ${quoteTitle} — ${tenantNaam}`,
        html: wrapHtml(`
          <h2>Uw offerte is klaar</h2>
          <p>Beste klant,</p>
          <p>Hierbij ontvangt u de offerte <strong>${quoteTitle}</strong> van <strong>${tenantNaam}</strong>.</p>
          <p><a href="${pdfUrl}" class="btn">Offerte bekijken</a></p>
          <p>Met vriendelijke groet,<br>${tenantNaam}</p>
        `, tenantNaam),
      },
    });
  },

  sendInvoice: async (to: string, tenantNaam: string, invoiceCode: string, pdfUrl: string): Promise<void> => {
    await mailService.sendMail({
      to,
      message: {
        subject: `Factuur ${invoiceCode} — ${tenantNaam}`,
        html: wrapHtml(`
          <h2>Uw factuur</h2>
          <p>Beste klant,</p>
          <p>Hierbij ontvangt u factuur <strong>${invoiceCode}</strong> van <strong>${tenantNaam}</strong>.</p>
          <p><a href="${pdfUrl}" class="btn">Factuur bekijken</a></p>
          <p>Met vriendelijke groet,<br>${tenantNaam}</p>
        `, tenantNaam),
      },
    });
  },

  sendPaymentReminder: async (
    to: string,
    tenantNaam: string,
    invoiceCode: string,
    dueDate: string,
    pdfUrl: string
  ): Promise<void> => {
    await mailService.sendMail({
      to,
      message: {
        subject: `Betalingsherinnering — Factuur ${invoiceCode}`,
        html: wrapHtml(`
          <h2>Vriendelijke betalingsherinnering</h2>
          <p>Beste klant,</p>
          <p>Wij attenderen u op de openstaande factuur <strong>${invoiceCode}</strong> van <strong>${tenantNaam}</strong>.</p>
          <p>Vervaldatum: <strong>${dueDate}</strong></p>
          <p><a href="${pdfUrl}" class="btn">Factuur bekijken</a></p>
          <p>Indien u al betaald heeft, kunt u dit bericht negeren.</p>
          <p>Met vriendelijke groet,<br>${tenantNaam}</p>
        `, tenantNaam),
      },
    });
  },

  sendTicketReply: async (
    to: string,
    tenantNaam: string,
    ticketTitle: string,
    replyContent: string
  ): Promise<void> => {
    await mailService.sendMail({
      to,
      message: {
        subject: `Reactie op uw melding: ${ticketTitle}`,
        html: wrapHtml(`
          <h2>Nieuwe reactie op uw melding</h2>
          <p>Beste klant,</p>
          <p>Er is een reactie geplaatst op uw melding <strong>${ticketTitle}</strong>:</p>
          <blockquote style="border-left:4px solid #059669;padding-left:12px;margin:16px 0;color:#555">${replyContent}</blockquote>
          <p>Met vriendelijke groet,<br>${tenantNaam}</p>
        `, tenantNaam),
      },
    });
  },

  sendOrderConfirmation: async (
    to: string,
    tenantNaam: string,
    quoteTitle: string,
    pdfUrl: string
  ): Promise<void> => {
    await mailService.sendMail({
      to,
      message: {
        subject: `Orderbevestiging — ${quoteTitle}`,
        html: wrapHtml(`
          <h2>Bedankt voor uw opdracht</h2>
          <p>Beste klant,</p>
          <p>Wij hebben uw opdracht voor <strong>${quoteTitle}</strong> ontvangen en bevestigd.</p>
          <p><a href="${pdfUrl}" class="btn">Orderbevestiging bekijken</a></p>
          <p>We nemen spoedig contact met u op over de planning.</p>
          <p>Met vriendelijke groet,<br>${tenantNaam}</p>
        `, tenantNaam),
      },
    });
  },
};
