import React, { useState } from 'react';
import { ArticlesTable } from './ArticlesTable';
import { BOMTable } from './BOMTable';
import { cn } from '@/lib/utils';
import { Search, Filter, Plus, Download, PackageOpen, AlertTriangle, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { articles } from '@/data/mockData';

const tabs = [
  { id: 'artikelen', label: 'Alle Artikelen' },
  { id: 'magazijnen', label: 'Magazijnen & Locaties' },
  { id: 'inkooporders', label: 'Inkooporders' },
  { id: 'leveranciers', label: 'Leveranciers' },
  { id: 'mutaties', label: 'Voorraadmutaties' },
  { id: 'boms', label: 'BOM / Stuklijsten' },
];

export function InventoryLayout() {
  const [activeTab, setActiveTab] = useState('artikelen');

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);

  // Kpi Calculations
  const totalItems = articles.length;
  const totalValue = articles.reduce((acc, art) => acc + (art.stockCount * art.purchasePrice), 0);
  const lowStockItems = articles.filter(a => a.stockCount > 0 && a.stockCount <= a.minStock).length;
  const outOfStockItems = articles.filter(a => a.stockCount === 0).length;

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* ── Page Header & KPIs ── */}
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
        {/* Sub-navigation */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 bg-gray-50/50 shrink-0">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-semibold transition-colors relative whitespace-nowrap",
                  activeTab === tab.id 
                    ? "text-blue-700" 
                    : "text-gray-500 hover:text-gray-800"
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
            <Button size="sm" className="h-8 gap-2 bg-blue-600 hover:bg-blue-700 text-xs font-semibold ml-2">
              <Plus className="h-3.5 w-3.5" />
              Nieuw Artikel
            </Button>
          </div>
        </div>

        {/* Toolbar */}
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
              Totaal: <span className="text-gray-900">{totalItems} res.</span>
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50/30">
          {activeTab === 'artikelen' && <ArticlesTable />}
          {activeTab === 'boms' && <BOMTable />}
          {activeTab !== 'artikelen' && activeTab !== 'boms' && (
            <div className="flex items-center justify-center p-12 h-64">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PackageOpen className="h-5 w-5 text-gray-400" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">{tabs.find(t => t.id === activeTab)?.label} in aanbouw</h2>
                <p className="text-sm text-gray-500">Deze module wordt momenteel ontwikkeld.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
