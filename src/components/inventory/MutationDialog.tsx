import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, ArrowRightLeft } from 'lucide-react';
import { inventoryService, StockMutation, InventoryItem, Warehouse } from '@/lib/inventoryService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MutationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MutationDialog({ open, onOpenChange }: MutationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  
  const [formData, setFormData] = useState<Omit<StockMutation, 'id' | 'createdAt'>>({
    itemId: '',
    itemName: '',
    warehouseId: '',
    warehouseName: '',
    type: 'In',
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
    reference: '',
    note: ''
  });

  useEffect(() => {
    if (open) {
      const unsubItems = inventoryService.subscribeToInventory(setItems);
      const unsubWarehouses = inventoryService.subscribeToWarehouses(setWarehouses);
      
      setFormData({
        itemId: '',
        itemName: '',
        warehouseId: '',
        warehouseName: '',
        type: 'In',
        quantity: 1,
        date: new Date().toISOString().split('T')[0],
        reference: '',
        note: ''
      });

      return () => {
        unsubItems();
        unsubWarehouses();
      };
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemId || !formData.warehouseId || formData.quantity <= 0) return;
    
    setIsSubmitting(true);
    try {
      await inventoryService.addMutation(formData);
      toast.success('Mutatie verwerkt');
      onOpenChange(false);
    } catch (err: any) {
      toast.error('Fout bij verwerken mutatie: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-800">
              <ArrowRightLeft className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none mb-1">
                Nieuwe Mutatie
              </h2>
              <p className="text-xs text-gray-400 font-medium">Voorraad in/uit of correctie</p>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Type Mutatie *</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-600"
              >
                <option value="In">Inkomend (+)</option>
                <option value="Uit">Uitgaand (-)</option>
                <option value="Correctie">Correctie (=)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Datum *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Artikel *</label>
            <select
              required
              value={formData.itemId}
              onChange={(e) => {
                const itemId = e.target.value;
                const itemName = items.find(i => i.id === itemId)?.name || '';
                setFormData({ ...formData, itemId, itemName });
              }}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="">Selecteer een artikel</option>
              {items.map(i => (
                <option key={i.id} value={i.id}>{i.name} ({i.stock} {i.unit})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Magazijn *</label>
              <select
                required
                value={formData.warehouseId}
                onChange={(e) => {
                  const warehouseId = e.target.value;
                  const warehouseName = warehouses.find(w => w.id === warehouseId)?.name || '';
                  setFormData({ ...formData, warehouseId, warehouseName });
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-600"
              >
                <option value="">Kies magazijn</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                {formData.type === 'Correctie' ? 'Nieuwe Voorraad *' : 'Aantal *'}
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Referentie / Project</label>
            <input
              type="text"
              value={formData.reference || ''}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-600"
              placeholder="Optionele referentie"
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-500 font-bold">Annuleren</Button>
            <Button type="submit" disabled={isSubmitting || !formData.itemId || !formData.warehouseId} className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Toevoegen
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
