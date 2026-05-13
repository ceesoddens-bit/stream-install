import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, Truck } from 'lucide-react';
import { inventoryService, Supplier } from '@/lib/inventoryService';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/lib/tenantContext';
import { toast } from 'sonner';

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: Supplier | null;
}

export function SupplierDialog({ open, onOpenChange, supplier }: SupplierDialogProps) {
  const { userDoc } = useTenant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    currency: 'EUR',
    address: '',
    kvk: ''
  });

  useEffect(() => {
    if (open) {
      if (supplier) {
        setFormData({
          name: supplier.name || '',
          currency: supplier.currency || 'EUR',
          address: supplier.address || '',
          kvk: supplier.kvk || ''
        });
      } else {
        setFormData({
          name: '',
          currency: 'EUR',
          address: '',
          kvk: ''
        });
      }
    }
  }, [open, supplier]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    setIsSubmitting(true);
    try {
      if (supplier?.id) {
        await inventoryService.updateSupplier(supplier.id, {
          ...formData,
          updatedByName: userDoc?.displayName || 'Gebruiker',
          updatedByInitials: (userDoc?.displayName || 'G').charAt(0)
        });
        toast.success('Leverancier bijgewerkt');
      } else {
        await inventoryService.addSupplier({
          ...formData,
          createdByName: userDoc?.displayName || 'Gebruiker',
          createdByInitials: (userDoc?.displayName || 'G').charAt(0),
          updatedByName: userDoc?.displayName || 'Gebruiker',
          updatedByInitials: (userDoc?.displayName || 'G').charAt(0)
        });
        toast.success('Leverancier toegevoegd');
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error('Er ging iets mis: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none mb-1">
                {supplier ? 'Leverancier bewerken' : 'Nieuwe leverancier'}
              </h2>
              <p className="text-xs text-gray-400 font-medium">Beheer leverancier details</p>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Bedrijfsnaam *</label>
            <input
              type="text"
              required
              autoFocus
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              placeholder="Naam leverancier"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Adres</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              placeholder="Straat en huisnummer, postcode, plaats"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">KvK Nummer</label>
              <input
                type="text"
                value={formData.kvk || ''}
                onChange={(e) => setFormData({ ...formData, kvk: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
                placeholder="Bijv. 12345678"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Munteenheid</label>
              <select
                value={formData.currency || 'EUR'}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-500 font-bold">Annuleren</Button>
            <Button type="submit" disabled={isSubmitting || !formData.name} className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {supplier ? 'Opslaan' : 'Toevoegen'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
