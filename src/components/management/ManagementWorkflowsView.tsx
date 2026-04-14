import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Columns3, Filter, Pencil, Search } from 'lucide-react';

export function ManagementWorkflowsView() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Workflow-sjablonen</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-800 text-sm font-bold shrink-0"
          >
            Alles
          </button>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
              <Columns3 className="h-4 w-4 mr-2" />
              Kolommen
            </Button>
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">Grootte</Button>
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
              <Pencil className="h-4 w-4 mr-2" />
              Bewerken
            </Button>
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">Filtersjablonen</Button>
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">Bulk</Button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">Nieuwe Template</Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-900">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="p-3 px-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider w-10">
                  <Checkbox checked={false} aria-label="Selecteer alles" />
                </th>
                <th className="p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider min-w-[260px]">Naam</th>
                <th className="p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider min-w-[320px]">Omschrijving</th>
                <th className="p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider w-44">Gemaakt op</th>
                <th className="p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider w-56">Gemaakt door</th>
                <th className="p-3 pr-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider w-44">Bijgewerkt op</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="py-24 text-center text-gray-400 text-sm">
                  Geen rijen
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-end gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Regels per pagina:</span>
            <span className="text-gray-800 font-bold">25</span>
          </div>
          <span className="text-gray-800 font-semibold">0–0 of 0</span>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed">‹</button>
            <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
