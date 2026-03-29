import React from 'react';
import { Package, Search, Image as ImageIcon, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { articles } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Article } from '@/types';

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

export function ArticlesTable() {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(amount);

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
            <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Inkoop</th>
            <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Verkoop</th>
            <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-40 text-right pr-6">Voorraad</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {articles.map((article: Article) => {
            const stockStatus = getStockStatus(article.stockCount, article.minStock);
            
            return (
              <tr key={article.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                <td className="p-3 px-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="p-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center p-0.5">
                    {article.imagePlaceholderUrl ? (
                      <img 
                        src={article.imagePlaceholderUrl} 
                        alt={article.name} 
                        className="w-full h-full object-cover rounded-md"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                </td>
                <td className="p-3 space-y-0.5">
                  <div className="font-mono text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded w-max">
                    {article.sku || 'GEEN-SKU'}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">L: TechData</div>
                </td>
                <td className="p-3">
                  <span className="font-bold text-sm text-gray-900 group-hover:text-blue-700 transition-colors">{article.name}</span>
                </td>
                <td className="p-3">
                  <Badge variant="outline" className={cn("text-[10px] font-bold px-2 py-0.5 whitespace-nowrap", getCategoryBadge(article.category))}>
                    {article.category}
                  </Badge>
                </td>
                <td className="p-3 text-sm font-medium text-gray-500 text-right">{formatCurrency(article.purchasePrice)}</td>
                <td className="p-3 text-sm font-bold text-gray-900 text-right">{formatCurrency(article.salePrice)}</td>
                <td className="p-3 pr-6">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-gray-900">{article.stockCount} <span className="text-xs text-gray-400 font-normal">stk.</span></span>
                    {stockStatus && (
                      <div className={cn("flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border leading-none", stockStatus.color)}>
                        {stockStatus.icon} {stockStatus.label}
                      </div>
                    )}
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
