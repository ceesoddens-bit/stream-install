import { collection, doc, onSnapshot, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { tenantCol, tenantDoc } from './firebase';

export interface AiRequest {
  id?: string;
  prompt: string;
  context?: any;
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  response?: string;
  error?: string;
  createdAt: Timestamp;
  type: 'quote' | 'ticket_summary' | 'ticket_reply' | 'email_reply';
}

const AI_COLLECTION = 'ai_requests';

export const aiService = {
  /**
   * Generates text via the Firestore GenAI extension.
   * Creates a document and listens for the completion.
   */
  generate: async (
    prompt: string,
    type: AiRequest['type'],
    context?: any
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const docRef = doc(tenantCol(AI_COLLECTION));
      
      const newRequest: AiRequest = {
        prompt,
        type,
        context,
        status: 'PENDING',
        createdAt: Timestamp.now(),
      };

      // Write the request to trigger the extension
      setDoc(docRef, newRequest)
        .then(() => {
          // In a real GenAI extension setup, the extension listens to 'ai_requests' creations,
          // processes the 'prompt' field, and writes back to 'response' or a similar field.
          // We listen for the update.
          const unsubscribe = onSnapshot(docRef, (snapshot) => {
            const data = snapshot.data() as AiRequest | undefined;
            if (!data) return;

            // If the extension has completed the request
            if (data.status === 'COMPLETED' && data.response) {
              unsubscribe();
              resolve(data.response);
            } 
            // Handle error state from extension
            else if (data.status === 'ERROR') {
              unsubscribe();
              reject(new Error(data.error || 'AI generatie is mislukt.'));
            }
            // Mock fallback if extension is not installed (for testing Phase 11 without Phase 13)
            // We simulate the extension behavior after 2 seconds
            else if (data.status === 'PENDING') {
              // Mark as processing so we only trigger mock once
              updateDoc(docRef, { status: 'PROCESSING' }).then(() => {
                setTimeout(() => {
                  let mockResponse = '';
                  switch (type) {
                    case 'quote':
                      mockResponse = `Geachte heer/mevrouw,\n\nBedankt voor uw interesse in onze diensten. Naar aanleiding van uw aanvraag sturen wij u hierbij onze offerte. Wij stellen voor om de volgende werkzaamheden uit te voeren conform de besproken specificaties.\n\nMet vriendelijke groet,\nStreamInstall`;
                      break;
                    case 'ticket_summary':
                      mockResponse = `Klant heeft een probleem gemeld met de installatie. Het lijkt erop dat de omvormer een foutcode (E031) geeft. Gevraagd wordt om een monteur in te plannen voor inspectie op locatie.`;
                      break;
                    case 'ticket_reply':
                      mockResponse = `Beste klant,\n\nBedankt voor uw bericht. We hebben de foutcode geanalyseerd en we zullen zo snel mogelijk een monteur inplannen om dit op locatie te verhelpen. U ontvangt van ons een planningsvoorstel.\n\nMet vriendelijke groet,\nSupport Team`;
                      break;
                    case 'email_reply':
                      mockResponse = `Beste klant,\n\nBedankt voor uw e-mail. Wij hebben uw verzoek in goede orde ontvangen en zullen hier binnen 2 werkdagen op terugkomen.\n\nMet vriendelijke groet,`;
                      break;
                  }
                  updateDoc(docRef, { 
                    status: 'COMPLETED', 
                    response: mockResponse 
                  });
                }, 1500);
              });
            }
          });
        })
        .catch(reject);
    });
  }
};
