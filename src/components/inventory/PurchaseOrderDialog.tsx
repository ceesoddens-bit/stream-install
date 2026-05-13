import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, ShoppingCart } from 'lucide-react';
import { inventoryService, PurchaseOrder, Supplier } from '@/lib/inventoryService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: PurchaseOrder | null;
}

export function PurchaseOrderDialog({ open, onOpenChange, order }: PurchaseOrderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  const [formData, setFormData] = useState<Omit<PurchaseOrder, 'id' | 'createdAt'>>({
    orderNumber: '',
    supplierId: '',
    supplierName: '',
    status: 'Concept',
    totalAmount: 0,
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: ''
  });

  useEffect(() => {
    if (open) {
      const unsub = inventoryService.subscribeToSuppliers(setSuppliers);
      if (order) {
        setFormData({
          orderNumber: order.orderNumber,
          supplierId: order.supplierId,
          supplierName: order.supplierName,
          status: order.status,
          totalAmount: order.totalAmount,
          orderDate: order.orderDate,
          expectedDeliveryDate: order.expectedDeliveryDate || ''
        });
      } else {
        setFormData({
          orderNumber: 'PO-' + Math.floor(Math.random() * 10000),
          supplierId: '',
          supplierName: '',
          status: 'Concept',
          totalAmount: 0,
          orderDate: new Date().toISOString().split('T')[0],
          expectedDeliveryDate: ''
        });
      }
      return () => unsub();
    }
  }, [open, order]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orderNumber || !formData.supplierId) return;
    
    setIsSubmitting(true);
    try {
      if (order?.id) {
        await inventoryService.updatePurchaseOrder(order.id, formData);
        toast.success('Inkooporder bijgewerkt');
      } else {
        await inventoryService.addPurchaseOrder(formData);
        toast.success('Inkooporder toegevoegd');
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error('Fout: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none mb-1">
                {order ? 'Inkooporder Bewerken' : 'Nieuwe Inkooporder'}
              </h2>
              <p className="text-xs text-gray-400 font-medium">Beheer inkoopgegevens</p>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Ordernummer *</label>
              <input
                type="text"
                required
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Totaal Bedrag</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Leverancier *</label>
            <select
              required
              value={formData.supplierId}
              onChange={(e) => {
                const supplierId = e.target.value;
                const supplierName = suppliers.find(s => s.id === supplierId)?.name || '';
                setFormData({ ...formData, supplierId, supplierName });
              }}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
            >
              <option value="">Kies leverancier</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Besteldatum</label>
              <input
                type="date"
                required
                value={formData.orderDate}
                onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Verwachte Leverdatum</label>
              <input
                type="date"
                value={formData.expectedDeliveryDate || ''}
                onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
            >
              <option value="Concept">Concept</option>
              <option value="Verzonden">Verzonden</option>
              <option value="Ontvangen">Ontvangen</option>
              <option value="Geannuleerd">Geannuleerd</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-500 font-bold">Annuleren</Button>
            <Button type="submit" disabled={isSubmitting || !formData.supplierId} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Opslaan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
