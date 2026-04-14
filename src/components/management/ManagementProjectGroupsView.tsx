import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckSquare, ChevronDown, Columns3, Filter, Pencil, Plus, Search, Users } from 'lucide-react';

export function ManagementProjectGroupsView() {
  const rows: Array<{ id: string; name: string; projectCount: number; updatedBy: string }> = [];
  const perPage = 25;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projectgroepen</h1>
            <p className="text-sm text-gray-500">Projecten</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-11 px-4 shadow-sm">
            <Plus className="h-4 w-4" />
            Nieuwe Groep
          </Button>
        </div>
      </div>

      <div className="flex flex-col flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm font-bold shrink-0"
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
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
              Grootte
            </Button>
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
              <Pencil className="h-4 w-4 mr-2" />
              Bewerken
            </Button>
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
              <CheckSquare className="h-4 w-4 mr-2" />
              Bulk
            </Button>
          </div>

          <div className="relative w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Zoeken…" className="pl-9 h-9 bg-white border-gray-200 text-sm" />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col style={{ width: 44 }} />
              <col />
              <col style={{ width: 140 }} />
              <col style={{ width: 220 }} />
            </colgroup>
            <thead>
              <tr className="bg-white border-b border-gray-200">
                <th className="p-3 pl-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="h-4 w-4" />
                </th>
                <th className="p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Naam</th>
                <th className="p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider text-right"># Projecten</th>
                <th className="p-3 pr-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Bijgewerkt door</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? null :
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="p-3 pl-4">
                      <input type="checkbox" className="h-4 w-4" />
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900 truncate" title={r.name}>
                      {r.name}
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-right">{r.projectCount}</td>
                    <td className="p-3 pr-4 text-sm text-gray-700 truncate" title={r.updatedBy}>
                      {r.updatedBy}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {rows.length === 0 ? (
            <div className="h-full min-h-[320px] flex items-center justify-center text-sm text-gray-400">
              Geen rijen
            </div>
          ) : null}
        </div>

        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-end gap-6 text-xs text-gray-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Regels per pagina:</span>
            <button type="button" className="inline-flex items-center gap-1 text-gray-800 font-bold">
              {perPage}
              <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
            </button>
          </div>
          <span className="text-gray-800 font-semibold">0–0 of 0</span>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-400" disabled>
              ‹
            </button>
            <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-400" disabled>
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
