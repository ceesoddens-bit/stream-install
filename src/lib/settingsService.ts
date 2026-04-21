import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Tenant } from './tenantTypes';

export const settingsService = {
  updateTenant: async (tenantId: string, data: Partial<Tenant>) => {
    try {
      const tenantRef = doc(db, 'tenants', tenantId);
      await updateDoc(tenantRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating tenant settings:', error);
      throw error;
    }
  },

  updateBranding: async (tenantId: string, branding: Tenant['branding']) => {
    try {
      const tenantRef = doc(db, 'tenants', tenantId);
      await updateDoc(tenantRef, {
        branding,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating tenant branding:', error);
      throw error;
    }
  }
};
