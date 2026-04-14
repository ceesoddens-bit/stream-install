import React, { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { suppliers } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  Columns3,
  Download,
  ExternalLink,
  Filter,
  Plus,
  Settings,
  SlidersHorizontal,
  ArrowUp,
  ZoomIn,
  Boxes
} from 'lucide-react';

const pageSize = 25;

type SuppliersColumnKey =
  | 'select'
  | 'naam'
  | 'munteenheid'
  | 'adres'
  | 'kvk'
  | 'gemaaktOp'
  | 'gemaaktDoor'
  | 'bijgewerktOp'
  | 'bijgewerktDoor'
  | 'actions';

type SuppliersColumnDef = {
  key: SuppliersColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const suppliersColumns: SuppliersColumnDef[] = [
  { key: 'select', width: 56, minWidth: 48, resizable: false, thClassName: 'p-3 px-4' },
  { key: 'naam', label: 'Naam', width: 220, minWidth: 160, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'munteenheid', label: 'Munteenheid', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'adres', label: 'Adres', width: 260, minWidth: 180, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'kvk', label: 'KvK', width: 120, minWidth: 100, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'gemaaktOp', label: 'Gemaakt op', width: 170, minWidth: 150, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'gemaaktDoor', label: 'Gemaakt door', width: 200, minWidth: 170, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'bijgewerktOp', label: 'Bijgewerkt op', width: 170, minWidth: 150, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'bijgewerktDoor', label: 'Bijgewerkt door', width: 210, minWidth: 170, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'actions', width: 64, minWidth: 56, resizable: false, thClassName: 'p-3 pr-4' },
];

function UserBadge({ initials, name }: { initials: string; name: string }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="h-6 w-6 rounded-full bg-amber-200 text-amber-950 flex items-center justify-center text-[11px] font-extrabold">
        {initials}
      </div>
      <span className="text-sm text-gray-800 truncate">{name}</span>
    </div>
  );
}

export function SuppliersTable() {
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const [columnWidths, setColumnWidths] = useState<Record<SuppliersColumnKey, number>>(() => {
    return suppliersColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<SuppliersColumnKey, number>);
  });
  const resizingRef = useRef<{
    key: SuppliersColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const tableMinWidth = useMemo(() => {
    return suppliersColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) => {
      return (
        s.name.toLowerCase().includes(q) ||
        (s.currency ?? '').toLowerCase().includes(q) ||
        (s.address ?? '').toLowerCase().includes(q) ||
        (s.kvk ?? '').toLowerCase().includes(q) ||
        s.createdAt.toLowerCase().includes(q) ||
        s.updatedAt.toLowerCase().includes(q)
      );
    });
  }, [query]);

  const count = filtered.length;
  const page = 1;
  const start = count === 0 ? 0 : 1;
  const end = Math.min(pageSize, count);

  const allOnPageSelected = count > 0 && filtered.slice(0, pageSize).every((s) => selectedIds.has(s.id));

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const pageIds = filtered.slice(0, pageSize).map((s) => s.id);
      if (pageIds.every((id) => next.has(id))) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startResize = (key: SuppliersColumnKey) => (e: React.PointerEvent) => {
    const col = suppliersColumns.find(c => c.key === key);
    if (!col || !col.resizable) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = columnWidths[key] ?? col.width;
    const minWidth = col.minWidth;
    resizingRef.current = { key, startX, startWidth, minWidth };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onPointerMove = (evt: PointerEvent) => {
      const nextWidth = Math.max(minWidth, startWidth + (evt.clientX - startX));
      setColumnWidths(prev => ({ ...prev, [key]: nextWidth }));
    };

    const onPointerUp = () => {
      resizingRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onPointerMove);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp, { once: true });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Leveranciers</h1>
        <div className="flex items-center gap-2">
          <Button className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2">
            <Plus className="h-4 w-4" />
            Nieuwe Leverancier
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 bg-white border-gray-200 text-gray-600 hover:bg-gray-50">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mb-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-800"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
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

      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-left border-collapse table-fixed" style={{ minWidth: tableMinWidth }}>
            <colgroup>
              {suppliersColumns.map(col => (
                <col key={col.key} style={{ width: columnWidths[col.key] }} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                {suppliersColumns.map(col => (
                  <th
                    key={col.key}
                    className={cn('relative select-none overflow-hidden whitespace-nowrap', col.thClassName)}
                  >
                    {col.key === 'select' ? (
                      <input
                        type="checkbox"
                        checked={allOnPageSelected}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 shadow-sm"
                      />
                    ) : col.key === 'actions' ? null : col.key === 'naam' ? (
                      <span className="inline-flex items-center gap-1 truncate">
                        Naam <ArrowUp className="h-3.5 w-3.5 text-gray-400" />
                      </span>
                    ) : (
                      <span className="truncate block">{col.label}</span>
                    )}

                    {col.resizable ? (
                      <div
                        onPointerDown={startResize(col.key)}
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize group"
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`Resize column ${col.label ?? col.key}`}
                      >
                        <div className="absolute right-0 top-0 h-full w-px bg-transparent group-hover:bg-gray-300" />
                      </div>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.slice(0, pageSize).map((row) => {
                const isSelected = selectedIds.has(row.id);
                return (
                  <tr key={row.id} className={cn('transition-colors', isSelected ? 'bg-emerald-50/40' : 'hover:bg-gray-50/60')}>
                    <td className="p-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(row.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-3">
                      <button type="button" className="text-sm font-semibold text-teal-700 hover:text-teal-800">
                        {row.name}
                      </button>
                    </td>
                    <td className="p-3 text-sm text-gray-700">{row.currency || '-'}</td>
                    <td className="p-3 text-sm text-gray-700 truncate" title={row.address || '-'}>{row.address || '-'}</td>
                    <td className="p-3 text-sm text-gray-700">{row.kvk || '-'}</td>
                    <td className="p-3 text-sm text-gray-700">{row.createdAt}</td>
                    <td className="p-3">
                      <UserBadge initials={row.createdByInitials} name={row.createdByName} />
                    </td>
                    <td className="p-3 text-sm text-gray-700">{row.updatedAt}</td>
                    <td className="p-3">
                      <UserBadge initials={row.updatedByInitials} name={row.updatedByName} />
                    </td>
                    <td className="p-3 pr-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {count === 0 && (
                <tr>
                  <td colSpan={suppliersColumns.length} className="p-10 text-center text-sm text-gray-500">
                    Geen leveranciers gevonden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-end gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Regels per pagina:</span>
            <button type="button" className="inline-flex items-center gap-1 text-gray-800 font-bold">
              {pageSize} <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </div>
          <span className="text-gray-800 font-semibold">
            {start}–{end} of {count}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              className={cn(
                'h-8 w-8 rounded-md border border-gray-200 text-gray-500',
                page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              ‹
            </button>
            <button
              type="button"
              disabled={count <= pageSize}
              className={cn(
                'h-8 w-8 rounded-md border border-gray-200 text-gray-500',
                count <= pageSize ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
