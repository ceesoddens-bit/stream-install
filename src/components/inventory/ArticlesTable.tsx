import { inventoryService, InventoryItem } from '@/lib/inventoryService';
import { Package, Search, Image as ImageIcon, AlertTriangle, ArrowRight, TrendingUp, Trash2, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ArticlesTableProps {
  items: InventoryItem[];
}

const getCategoryBadge = (category: string) => {
  switch (category) {
    case 'Warmtepompen': return 'bg-red-50 text-red-700 border-red-200';
    case 'Batterij': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Airco': return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'CV Ketel': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Omvormers': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Zonnepanelen': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    case 'Bevestigingsmateriaal': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getStockStatus = (stock: number, min: number) => {
  if (stock === 0) {
    return { label: 'Uitverkocht', color: 'bg-red-50 text-red-700 border-red-200', icon: <AlertTriangle className="h-3 w-3" /> };
  }
  if (stock <= min) {
    return { label: 'Bijna op', color: 'bg-orange-50 text-orange-700 border-orange-200', icon: <TrendingUp className="h-3 w-3" /> };
  }
  return { label: 'Ruim', color: 'bg-green-50 text-green-700 border-green-200', icon: null };
};

export function ArticlesTable({ items }: ArticlesTableProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(amount);

  const handleDelete = async (id: string) => {
    if (window.confirm("Artikel verwijderen?")) {
      await inventoryService.deleteItem(id);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-200">
            <th className="p-3 px-4 w-12"><input type="checkbox" className="rounded border-gray-300 shadow-sm" /></th>
            <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[60px]">Foto</th>
            <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-32">Artikel / SKU</th>
            <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Omschrijving</th>
            <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Categorie</th>
            <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Prijs</th>
            <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-40 text-right pr-6">Voorraad</th>
            <th className="p-3 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((article) => {
            const stockStatus = getStockStatus(article.stock, article.minStock);
            
            return (
              <tr key={article.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                <td className="p-3 px-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="p-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center p-0.5">
                    <ImageIcon className="h-5 w-5 text-gray-300" />
                  </div>
                </td>
                <td className="p-3 space-y-0.5">
                  <div className="font-mono text-[10px] font-bold bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded w-max">
                    {article.sku || 'GEEN-SKU'}
                  </div>
                </td>
                <td className="p-3">
                  <span className="font-bold text-sm text-gray-900 group-hover:text-blue-700 transition-colors">{article.name}</span>
                </td>
                <td className="p-3">
                  <Badge variant="outline" className={cn("text-[10px] font-bold px-2 py-0.5 whitespace-nowrap uppercase tracking-tighter", getCategoryBadge(article.category))}>
                    {article.category}
                  </Badge>
                </td>
                <td className="p-3 text-sm font-bold text-gray-900 text-right">{formatCurrency(article.price)}</td>
                <td className="p-3 pr-6">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-gray-900">{article.stock} <span className="text-xs text-gray-400 font-normal">{article.unit}</span></span>
                    {stockStatus && (
                      <div className={cn("flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border leading-none uppercase tracking-tighter shadow-sm", stockStatus.color)}>
                        {stockStatus.icon} {stockStatus.label}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-3 text-right">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-1 hover:text-emerald-600 transition-colors"><Edit2 className="h-4 w-4" /></button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(article.id!); }}
                          className="p-1 hover:text-red-500 transition-colors text-gray-300"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
