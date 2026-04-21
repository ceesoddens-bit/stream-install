import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { inventoryService, StockMutation } from '@/lib/inventoryService';
import { cn } from '@/lib/utils';
import { useResizableColumns, type ResizableColumnDef } from '@/lib/useResizableColumns';
import { ArrowUp, CheckCircle2, ChevronDown, Columns3, Download, Filter, Settings, SlidersHorizontal, ZoomIn } from 'lucide-react';

const pageSize = 25;

type MutationColumnKey =
  | 'select'
  | 'type'
  | 'identificatie'
  | 'status'
  | 'magazijn'
  | 'project'
  | 'regels'
  | 'totaal'
  | 'gereserveerd'
  | 'uitgegeven'
  | 'gemaaktOp'
  | 'gemaaktDoor'
  | 'bijgewerktOp';

type MutationColumnDef = ResizableColumnDef<MutationColumnKey> & {
  label: string;
  thClassName?: string;
  tdClassName?: string;
  sortable?: boolean;
};

const mutationColumns: MutationColumnDef[] = [
  { key: 'select', label: '', width: 56, minWidth: 56, resizable: false, thClassName: 'p-3 px-4 w-14' },
  { key: 'type', label: 'Type', width: 120, minWidth: 90, resizable: true, thClassName: 'p-3' },
  { key: 'identificatie', label: 'Identificatie', width: 170, minWidth: 130, resizable: true, thClassName: 'p-3' },
  { key: 'status', label: 'Status', width: 150, minWidth: 120, resizable: true, thClassName: 'p-3' },
  { key: 'magazijn', label: 'Magazijn', width: 150, minWidth: 120, resizable: true, thClassName: 'p-3' },
  { key: 'project', label: 'Project', width: 170, minWidth: 130, resizable: true, thClassName: 'p-3' },
  { key: 'regels', label: '# Reg…', width: 90, minWidth: 80, resizable: true, thClassName: 'p-3' },
  { key: 'totaal', label: 'Tot…', width: 90, minWidth: 80, resizable: true, thClassName: 'p-3' },
  { key: 'gereserveerd', label: 'Ge…', width: 90, minWidth: 80, resizable: true, thClassName: 'p-3' },
  { key: 'uitgegeven', label: 'Uit…', width: 90, minWidth: 80, resizable: true, thClassName: 'p-3' },
  { key: 'gemaaktOp', label: 'Gemaakt op', width: 130, minWidth: 120, resizable: true, thClassName: 'p-3', sortable: true },
  { key: 'gemaaktDoor', label: 'Gemaakt door', width: 150, minWidth: 120, resizable: true, thClassName: 'p-3' },
  { key: 'bijgewerktOp', label: 'Bijgewerkt op', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 pr-6' },
];

export function MutationsTable() {
  const [subTab, setSubTab] = useState<'mutaties' | 'regels'>('mutaties');
  const [segment, setSegment] = useState<'alles' | 'inkomend' | 'voorraadcontrole' | 'intern' | 'uitgaand'>('alles');
  const [query, setQuery] = useState('');
  const [mutations, setMutations] = useState<StockMutation[]>([]);

  useEffect(() => {
    const unsubscribe = inventoryService.subscribeToMutations((fetched) => {
      setMutations(fetched);
    });
    return () => unsubscribe();
  }, []);

  const { columnWidths, startResize, tableMinWidth } = useResizableColumns(mutationColumns);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = mutations;
    if (segment !== 'alles') {
      const map = {
        inkomend: 'In',
        voorraadcontrole: 'Correctie',
        intern: 'Intern',
        uitgaand: 'Uit',
      } as const;
      rows = rows.filter((r) => r.type === map[segment]);
    }
    if (!q) return rows;
    return rows.filter((r) => {
      return (
        r.itemName.toLowerCase().includes(q) ||
        r.warehouseName.toLowerCase().includes(q) ||
        (r.reference && r.reference.toLowerCase().includes(q))
      );
    });
  }, [query, segment, mutations]);

  const count = filtered.length;
  const page = 1;
  const start = count === 0 ? 0 : 1;
  const end = Math.min(pageSize, count);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mutaties</h1>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSubTab('mutaties')}
              className={cn(
                'h-9 px-3 rounded-lg border text-sm font-semibold',
                subTab === 'mutaties'
                  ? 'bg-gray-100 border-gray-200 text-gray-900'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              Mutaties
            </button>
            <button
              type="button"
              onClick={() => setSubTab('regels')}
              className={cn(
                'h-9 px-3 rounded-lg border text-sm font-semibold',
                subTab === 'regels'
                  ? 'bg-gray-100 border-gray-200 text-gray-900'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              Regels
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSegment('alles')}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-800"
            >
              Alles
              <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-emerald-600 text-white text-xs font-bold">
                {count}
              </span>
            </button>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setSegment('inkomend')}
                className={cn(
                  'h-9 px-3 rounded-lg text-sm font-semibold border shadow-sm',
                  segment === 'inkomend'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-emerald-500/90 text-white border-emerald-500/90 hover:bg-emerald-600'
                )}
              >
                Inkomend
              </button>
              <button
                type="button"
                onClick={() => setSegment('voorraadcontrole')}
                className={cn(
                  'h-9 px-3 rounded-lg text-sm font-semibold border shadow-sm',
                  segment === 'voorraadcontrole'
                    ? 'bg-amber-400 text-gray-900 border-amber-400 ring-1 ring-amber-500/40'
                    : 'bg-amber-300 text-gray-900 border-amber-300 hover:bg-amber-400'
                )}
              >
                Voorraadcontrole
              </button>
              <button
                type="button"
                onClick={() => setSegment('intern')}
                className={cn(
                  'h-9 px-3 rounded-lg text-sm font-semibold border shadow-sm',
                  segment === 'intern' ? 'bg-sky-600 text-white border-sky-600' : 'bg-sky-500/90 text-white border-sky-500/90 hover:bg-sky-600'
                )}
              >
                Intern
              </button>
              <button
                type="button"
                onClick={() => setSegment('uitgaand')}
                className={cn(
                  'h-9 px-3 rounded-lg text-sm font-semibold border shadow-sm',
                  segment === 'uitgaand'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-rose-500/90 text-white border-rose-500/90 hover:bg-rose-600'
                )}
              >
                Uitgaand
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-900 hover:bg-gray-50">
              <Settings className="h-4 w-4" />
            </Button>

            <div className="relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Zoeken..."
                className="h-9 w-64 bg-gray-50 border-gray-200 text-sm pr-8"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-600" />
            </div>
          </div>
        </div>

        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center gap-1 overflow-x-auto no-scrollbar">
          <Button
            variant="ghost"
            className="h-8 px-2 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            <Columns3 className="h-4 w-4 mr-2" />
            Kolommen
          </Button>
          <Button
            variant="ghost"
            className="h-8 px-2 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button
            variant="ghost"
            className="h-8 px-2 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Dichtheid
          </Button>
          <Button
            variant="ghost"
            className="h-8 px-2 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            <ZoomIn className="h-4 w-4 mr-2" />
            Schaal
          </Button>
          <Button
            variant="ghost"
            className="h-8 px-2 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporteren
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <table
            className="w-full text-left border-collapse table-fixed"
            style={{ minWidth: tableMinWidth }}
          >
            <colgroup>
              {mutationColumns.map((col) => (
                <col key={col.key} style={{ width: columnWidths[col.key] }} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-white border-b border-gray-200">
                {mutationColumns.map((col) => (
                  <th
                    key={col.key}
                    className={cn('relative select-none overflow-hidden whitespace-nowrap', col.thClassName)}
                  >
                    {col.key === 'select' ? (
                      <input type="checkbox" className="rounded border-gray-300 shadow-sm" />
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600">
                        {col.label}
                        {col.sortable ? <ArrowUp className="h-3 w-3 text-gray-400" /> : null}
                      </span>
                    )}
                    {col.resizable ? (
                      <div
                        onPointerDown={startResize(col.key)}
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize group"
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`Resize column ${col.label}`}
                      >
                        <div className="absolute right-0 top-0 h-full w-px bg-transparent group-hover:bg-gray-300" />
                      </div>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.slice(0, pageSize).map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-3 px-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="p-3 text-sm font-semibold text-gray-900 truncate">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs uppercase tracking-wider",
                      row.type === 'In' ? "bg-emerald-100 text-emerald-800" :
                      row.type === 'Uit' ? "bg-red-100 text-red-800" :
                      "bg-amber-100 text-amber-800"
                    )}>{row.type}</span>
                  </td>
                  <td className="p-3 text-sm text-gray-900 truncate">{row.itemName}</td>
                  <td className="p-3 text-sm text-gray-700 truncate">-</td>
                  <td className="p-3 text-sm text-gray-700 truncate">{row.warehouseName}</td>
                  <td className="p-3 text-sm text-gray-700 truncate">{row.reference || '-'}</td>
                  <td className="p-3 text-sm text-gray-700 truncate">-</td>
                  <td className="p-3 text-sm font-bold text-gray-900 truncate">{row.quantity}</td>
                  <td className="p-3 text-sm text-gray-700 truncate">-</td>
                  <td className="p-3 text-sm text-gray-700 truncate">-</td>
                  <td className="p-3 text-sm text-gray-700 truncate">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="p-3 text-sm text-gray-700 truncate">-</td>
                  <td className="p-3 pr-6 text-sm text-gray-700 truncate">-</td>
                </tr>
              ))}
              {count === 0 && (
                <tr>
                  <td colSpan={13} className="p-12 text-center text-sm text-gray-500">
                    Geen mutaties gevonden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-end gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Regels per pagina:</span>
            <span className="inline-flex items-center gap-1 text-gray-800 font-bold">
              {pageSize}
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </span>
          </div>
          <span className="text-gray-800 font-semibold">
            {start}–{end} of {count}
          </span>
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
