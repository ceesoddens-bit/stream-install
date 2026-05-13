import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, Leaf } from 'lucide-react';
import { inventoryService, BOMItem, InventoryItem } from '@/lib/inventoryService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCollection } from '@/lib/useCollection';

interface BOMItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bomItem?: BOMItem | null;
}

export function BOMItemDialog({ open, onOpenChange, bomItem }: BOMItemDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [articles, setArticles] = useState<InventoryItem[]>([]);
  const projects = useCollection('projects');
  
  const [formData, setFormData] = useState<Omit<BOMItem, 'id' | 'createdAt'>>({
    projectName: '',
    projectStatus: 'Nieuw',
    planningStatus: 'Ongepland',
    plannedDate: '',
    articleName: '',
    sku: '',
    requiredQuantity: 1
  });

  useEffect(() => {
    if (open) {
      const unsub = inventoryService.subscribeToInventory(setArticles);
      if (bomItem) {
        setFormData({
          projectName: bomItem.projectName,
          projectStatus: bomItem.projectStatus || 'Nieuw',
          planningStatus: bomItem.planningStatus || 'Ongepland',
          plannedDate: bomItem.plannedDate || '',
          articleName: bomItem.articleName,
          sku: bomItem.sku || '',
          requiredQuantity: bomItem.requiredQuantity
        });
      } else {
        setFormData({
          projectName: '',
          projectStatus: 'Nieuw',
          planningStatus: 'Ongepland',
          plannedDate: '',
          articleName: '',
          sku: '',
          requiredQuantity: 1
        });
      }
      return () => unsub();
    }
  }, [open, bomItem]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName || !formData.articleName) return;
    
    setIsSubmitting(true);
    try {
      if (bomItem?.id) {
        await inventoryService.updateBOMItem(bomItem.id, formData);
        toast.success('BOM-regel bijgewerkt');
      } else {
        await inventoryService.addBOMItem(formData);
        toast.success('BOM-regel toegevoegd');
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
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none mb-1">
                {bomItem ? 'BOM-regel Bewerken' : 'Nieuwe BOM-regel'}
              </h2>
              <p className="text-xs text-gray-400 font-medium">Beheer projectmateriaal</p>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Project *</label>
            <select
              required
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
            >
              <option value="">Kies een project of offerte</option>
              {projects.data.map((p: any) => (
                <option key={p.id} value={p.title}>{p.title}</option>
              ))}
              <option value="Overig">Overig</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Artikel *</label>
            <select
              required
              value={formData.sku || ''}
              onChange={(e) => {
                const sku = e.target.value;
                const articleName = articles.find(a => a.sku === sku)?.name || '';
                setFormData({ ...formData, sku, articleName });
              }}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
            >
              <option value="">Kies artikel</option>
              {articles.map(a => (
                <option key={a.id} value={a.sku}>{a.name} ({a.sku})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Benodigd Aantal *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.requiredQuantity}
                onChange={(e) => setFormData({ ...formData, requiredQuantity: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Geplande Datum</label>
              <input
                type="date"
                value={formData.plannedDate}
                onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-500 font-bold">Annuleren</Button>
            <Button type="submit" disabled={isSubmitting || !formData.projectName || !formData.sku} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Opslaan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
