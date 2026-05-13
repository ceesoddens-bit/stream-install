import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, Package } from 'lucide-react';
import { inventoryService, InventoryItem } from '@/lib/inventoryService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: InventoryItem | null;
}

type FormData = Omit<InventoryItem, 'id' | 'createdAt'>;

const CATEGORIES = [
  'Zonnepanelen', 'Omvormers', 'Batterij', 'Warmtepompen',
  'Airco', 'CV Ketel', 'Bevestigingsmateriaal', 'Elektrisch',
  'Overig',
];

const UNITS = ['stuk', 'meter', 'rol', 'set', 'doos', 'kg', 'liter'];

const emptyForm = (): FormData => ({
  sku: '',
  name: '',
  category: 'Overig',
  stock: 0,
  minStock: 0,
  price: 0,
  unit: 'stuk',
  location: '',
  status: 'Op voorraad',
});

export function ArticleDialog({ open, onOpenChange, article }: ArticleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm());

  useEffect(() => {
    if (!open) return;
    if (article) {
      const { id, createdAt, ...rest } = article as InventoryItem & { id?: string; createdAt?: unknown };
      setFormData({ ...emptyForm(), ...rest });
    } else {
      setFormData(emptyForm());
    }
  }, [open, article]);

  if (!open) return null;

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setFormData(prev => ({ ...prev, [key]: value }));

  const deriveStatus = (stock: number, min: number): InventoryItem['status'] => {
    if (stock === 0) return 'Niet op voorraad';
    if (stock <= min) return 'Bijna op';
    return 'Op voorraad';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload: FormData = {
      ...formData,
      status: deriveStatus(formData.stock, formData.minStock),
    };

    setIsSubmitting(true);
    try {
      if (article?.id) {
        await inventoryService.updateItem(article.id, payload);
        toast.success('Artikel bijgewerkt');
      } else {
        await inventoryService.addItem(payload);
        toast.success('Artikel toegevoegd');
      }
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error('Er ging iets mis bij het opslaan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">

        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none mb-1">
                {article ? 'Artikel bewerken' : 'Nieuw artikel'}
              </h2>
              <p className="text-xs text-gray-400 font-medium">Voorraadartikel beheren</p>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Naam *</label>
              <input
                type="text"
                required
                autoFocus
                value={formData.name}
                onChange={e => set('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                placeholder="Naam van het artikel"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={e => set('sku', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                placeholder="bijv. ZP-400W-XL"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Categorie</label>
              <select
                value={formData.category}
                onChange={e => set('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Eenheid</label>
              <select
                value={formData.unit}
                onChange={e => set('unit', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
              >
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Inkoopprijs (€)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={e => set('price', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Voorraad</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={e => set('stock', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Min. Voorraad</label>
              <input
                type="number"
                min="0"
                value={formData.minStock}
                onChange={e => set('minStock', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Locatie</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => set('location', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
              placeholder="bijv. Magazijn A, rek 3"
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-500 font-bold">
              Annuleren
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {article ? 'Opslaan' : 'Toevoegen'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
