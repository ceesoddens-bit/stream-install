import { pdf } from '@react-pdf/renderer';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { Quote, Invoice } from '@/types';
import { Tenant } from '@/lib/tenantTypes';
import React from 'react';

export const pdfService = {
  /**
   * Genereert een PDF blob van een component
   */
  generateBlob: async (component: React.ReactElement): Promise<Blob> => {
    const blob = await pdf(component).toBlob();
    return blob;
  },

  /**
   * Slaat een PDF op in Firebase Storage onder het juiste tenant pad
   */
  uploadPDF: async (
    tenantId: string, 
    type: 'offertes' | 'facturen', 
    id: string, 
    blob: Blob
  ): Promise<string> => {
    const fileName = `${type}/${id}.pdf`;
    const storageRef = ref(storage, `tenants/${tenantId}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, blob, {
      contentType: 'application/pdf',
      customMetadata: {
        tenantId,
        type,
        docId: id
      }
    });

    return getDownloadURL(snapshot.ref);
  },

  /**
   * Helper om direct te downloaden in de browser
   */
  downloadInBrowser: (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
