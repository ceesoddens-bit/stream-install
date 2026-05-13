import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, Building2 } from 'lucide-react';
import { inventoryService, Warehouse } from '@/lib/inventoryService';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/lib/tenantContext';
import { toast } from 'sonner';

interface WarehouseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouse?: Warehouse | null;
}

export function WarehouseDialog({ open, onOpenChange, warehouse }: WarehouseDialogProps) {
  const { userDoc } = useTenant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>>({
    shortCode: '',
    name: '',
    subCount: 0
  });

  useEffect(() => {
    if (open) {
      if (warehouse) {
        setFormData({
          shortCode: warehouse.shortCode || '',
          name: warehouse.name || '',
          subCount: warehouse.subCount || 0
        });
      } else {
        setFormData({
          shortCode: '',
          name: '',
          subCount: 0
        });
      }
    }
  }, [open, warehouse]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.shortCode) return;
    
    setIsSubmitting(true);
    try {
      if (warehouse?.id) {
        await inventoryService.updateWarehouse(warehouse.id, {
          ...formData,
          updatedByName: userDoc?.displayName || 'Gebruiker',
          updatedByInitials: (userDoc?.displayName || 'G').charAt(0)
        });
        toast.success('Magazijn bijgewerkt');
      } else {
        await inventoryService.addWarehouse({
          ...formData,
          createdByName: userDoc?.displayName || 'Gebruiker',
          createdByInitials: (userDoc?.displayName || 'G').charAt(0),
          updatedByName: userDoc?.displayName || 'Gebruiker',
          updatedByInitials: (userDoc?.displayName || 'G').charAt(0)
        });
        toast.success('Magazijn toegevoegd');
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
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none mb-1">
                {warehouse ? 'Magazijn bewerken' : 'Nieuw magazijn'}
              </h2>
              <p className="text-xs text-gray-400 font-medium">Beheer magazijn details</p>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Korte code *</label>
              <input
                type="text"
                required
                autoFocus
                value={formData.shortCode}
                onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600 uppercase"
                placeholder="Bijv. M1"
                maxLength={10}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Aantal sublocaties</label>
              <input
                type="number"
                min="0"
                value={formData.subCount}
                onChange={(e) => setFormData({ ...formData, subCount: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Naam *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              placeholder="Naam magazijn"
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-500 font-bold">Annuleren</Button>
            <Button type="submit" disabled={isSubmitting || !formData.name || !formData.shortCode} className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {warehouse ? 'Opslaan' : 'Toevoegen'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
