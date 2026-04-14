import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Boxes, Columns3, Download, Filter, Plus, Settings, SlidersHorizontal, ZoomIn } from 'lucide-react';

const pageSize = 25;

export function PurchaseOrdersTable() {
  const [subTab, setSubTab] = useState<'inkooporders' | 'regels'>('inkooporders');
  const [query, setQuery] = useState('');
  const count = 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inkooporders</h1>
        <div className="flex items-center gap-2">
          <Button className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2">
            <Plus className="h-4 w-4" />
            Inkooporder Aanmaken
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 bg-white border-gray-200 text-gray-600 hover:bg-gray-50">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('inkooporders')}
            className={cn(
              'h-9 px-3 rounded-lg border text-sm font-semibold',
              subTab === 'inkooporders'
                ? 'bg-white border-gray-200 text-gray-900'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white'
            )}
          >
            Inkooporders
          </button>
          <button
            type="button"
            onClick={() => setSubTab('regels')}
            className={cn(
              'h-9 px-3 rounded-lg border text-sm font-semibold',
              subTab === 'regels'
                ? 'bg-white border-gray-200 text-gray-900'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white'
            )}
          >
            Regels
          </button>
        </div>

        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoeken..."
            className="h-9 w-64 bg-white border-gray-200 text-sm pr-8"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-600" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-800"
        >
          Alles
          <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-100">
            {count}
          </span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
            <Columns3 className="h-4 w-4 mr-2" />
            Kolommen
          </Button>
          <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Dichtheid
          </Button>
          <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
            <ZoomIn className="h-4 w-4 mr-2" />
            Schaal
          </Button>
          <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
            <Boxes className="h-4 w-4 mr-2" />
            Bulk
          </Button>
          <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
            <Download className="h-4 w-4 mr-2" />
            Exporteren
          </Button>
          <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
            Bewerken
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="p-3 px-4 w-14">
                  <input type="checkbox" className="rounded border-gray-300 shadow-sm" />
                </th>
                <th className="p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">#</th>
                <th className="p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Naam</th>
                <th className="p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Leverancier</th>
                <th className="p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Magazijn</th>
                <th className="p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Leveringsstatus</th>
                <th className="p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Totale prijs</th>
                <th className="p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Project</th>
                <th className="p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Gema…</th>
                <th className="p-3 pr-6 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Bewerken</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={11} className="p-12 text-center text-sm text-gray-500">
                  Geen resultaten.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-end gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Regels per pagina:</span>
            <span className="text-gray-800 font-bold">{pageSize}</span>
          </div>
          <span className="text-gray-800 font-semibold">0–0 of 0</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              className="h-8 w-8 rounded-md border border-gray-200 text-gray-500 opacity-50 cursor-not-allowed"
            >
              ‹
            </button>
            <button
              type="button"
              disabled
              className="h-8 w-8 rounded-md border border-gray-200 text-gray-500 opacity-50 cursor-not-allowed"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

