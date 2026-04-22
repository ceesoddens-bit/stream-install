import React, { useState, useEffect } from 'react';
import { ArticlesTable } from './ArticlesTable';
import { BOMTable } from './BOMTable';
import { SuppliersTable } from './SuppliersTable';
import { StockOverviewTable } from './StockOverviewTable';
import { MutationsTable } from './MutationsTable';
import { WarehousesTable } from './WarehousesTable';
import { PurchaseOrdersTable } from './PurchaseOrdersTable';
import { cn } from '@/lib/utils';
import { Search, Filter, Plus, Download, PackageOpen, AlertTriangle, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { inventoryService, InventoryItem } from '@/lib/inventoryService';
import { PermissionGuard } from '@/components/auth/PermissionGuard';

const tabs = [
  { id: 'overzicht', label: 'Overzicht' },
  { id: 'mutaties', label: 'Mutaties' },
  { id: 'magazijnen', label: 'Magazijnen' },
  { id: 'artikelen', label: 'Artikelen' },
  { id: 'inkooporders', label: 'Inkooporders' },
  { id: 'leveranciers', label: 'Leveranciers' },
  { id: 'boms', label: 'BOMs' },
];

type InventoryLayoutProps = {
  initialTab?: string;
};

export function InventoryLayout({ initialTab }: InventoryLayoutProps) {
  const [activeTab, setActiveTab] = useState(() => {
    if (initialTab && tabs.some((t) => t.id === initialTab)) return initialTab;
    return 'artikelen';
  });
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(activeTab === 'artikelen');

  useEffect(() => {
    if (!initialTab) return;
    if (!tabs.some((t) => t.id === initialTab)) return;
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (activeTab !== 'artikelen') {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const unsubscribe = inventoryService.subscribeToInventory((fetched) => {
      setItems(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [activeTab]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);

  // Kpi Calculations
  const totalItems = items.length;
  const totalValue = items.reduce((acc, art) => acc + (art.stock * art.price), 0);
  const lowStockItems = items.filter(a => a.stock > 0 && a.stock <= a.minStock).length;
  const outOfStockItems = items.filter(a => a.stock === 0).length;

  if (activeTab === 'overzicht') return <StockOverviewTable />;
  if (activeTab === 'mutaties') return <MutationsTable />;
  if (activeTab === 'magazijnen') return <WarehousesTable />;
  if (activeTab === 'inkooporders') return <PurchaseOrdersTable />;
  if (activeTab === 'leveranciers') return <SuppliersTable />;
  if (activeTab === 'boms') return <BOMTable />;

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Voorraadbeheer</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white border-gray-200">Magazijn Kiezen</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="h-4 w-4" /> Actie
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-gray-200 shadow-sm bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <PackageOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Unieke Artikelen</p>
                <h3 className="text-xl font-bold text-gray-900">{totalItems}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Inkoopwaarde Voorraad</p>
                <h3 className="text-xl font-bold text-gray-900">{formatCurrency(totalValue)}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 border-l-4 border-l-orange-400 shadow-sm bg-white cursor-pointer hover:bg-orange-50/30 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-orange-600 mb-1">Bijna Op (Min. Voorraad)</p>
                <h3 className="text-xl font-bold text-gray-900">{lowStockItems} Items</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 border-l-4 border-l-red-500 shadow-sm bg-white cursor-pointer hover:bg-red-50/30 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-red-600 mb-1">Uit Verkocht</p>
                <h3 className="text-xl font-bold text-gray-900">{outOfStockItems} Items</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 bg-gray-50/50 shrink-0">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-semibold transition-colors relative whitespace-nowrap",
                  activeTab === tab.id ? "text-blue-700" : "text-gray-500 hover:text-gray-800"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs font-medium text-gray-500 hover:text-gray-900">
              <Download className="h-3.5 w-3.5" />
              Exporteren
            </Button>
            <PermissionGuard permission="voorraad.bewerken">
              <Button
                size="sm"
                className="h-8 gap-2 bg-blue-600 hover:bg-blue-700 text-xs font-semibold ml-2 shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                Nieuw Artikel
              </Button>
            </PermissionGuard>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 p-4 shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Zoek op naam, SKU of EAN..." className="pl-9 h-9 text-sm border-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9 gap-2 text-sm text-gray-600 border-gray-200 font-medium">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
              Totaal: <span className="text-gray-900">{totalItems} artikelen</span>
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50/30">
          {isLoading ? (
            <div className="p-20 text-center text-gray-400 animate-pulse">Laden van artikelen...</div>
          ) : (
            <ArticlesTable items={items} />
          )}
        </div>
      </div>
    </div>
  );
}
