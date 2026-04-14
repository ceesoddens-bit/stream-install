import React, { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { stockOverviewRows } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Calendar, Columns3, Download, Filter, Search, Settings, SlidersHorizontal } from 'lucide-react';

const formatNumberNl = (value: number) => new Intl.NumberFormat('nl-NL').format(value);

type StockOverviewColumnKey =
  | 'select'
  | 'artikel'
  | 'magazijn'
  | 'locatie'
  | 'statusLocatie'
  | 'status'
  | 'hoeveelheid'
  | 'prijsPerStuk'
  | 'wisselkoers'
  | 'totaal';

type StockOverviewColumnDef = {
  key: StockOverviewColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const columns: StockOverviewColumnDef[] = [
  { key: 'select', width: 56, minWidth: 48, resizable: false, thClassName: 'p-3 px-4' },
  { key: 'artikel', label: 'Artikel', width: 260, minWidth: 180, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'magazijn', label: 'Magazijn', width: 220, minWidth: 160, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'locatie', label: 'Locatie', width: 200, minWidth: 140, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'statusLocatie', label: 'Status (Lo…)', width: 150, minWidth: 130, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'status', label: 'Stat…', width: 120, minWidth: 110, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'hoeveelheid', label: 'Hoeveelheid', width: 140, minWidth: 130, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider text-right' },
  { key: 'prijsPerStuk', label: 'Prijs per stuk', width: 160, minWidth: 140, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider text-right' },
  { key: 'wisselkoers', label: 'Wisselkoers', width: 140, minWidth: 130, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider text-right' },
  { key: 'totaal', label: 'Totaal', width: 140, minWidth: 130, resizable: true, thClassName: 'p-3 pr-6 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider text-right' },
];

export function StockOverviewTable() {
  const [mode, setMode] = useState<'artikel' | 'magazijn'>('artikel');
  const [query, setQuery] = useState('');

  const [columnWidths, setColumnWidths] = useState<Record<StockOverviewColumnKey, number>>(() => {
    return columns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<StockOverviewColumnKey, number>);
  });

  const stickyRightOffsets = useMemo(() => {
    const stickyKeys: StockOverviewColumnKey[] = ['hoeveelheid', 'prijsPerStuk', 'wisselkoers', 'totaal'];
    const offsets = new Map<StockOverviewColumnKey, number>();
    let right = 0;
    for (let i = columns.length - 1; i >= 0; i -= 1) {
      const key = columns[i].key;
      if (stickyKeys.includes(key)) offsets.set(key, right);
      right += columnWidths[key] ?? columns[i].width;
    }
    return offsets;
  }, [columnWidths]);
  const resizingRef = useRef<{
    key: StockOverviewColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const tableMinWidth = useMemo(() => {
    return columns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const startResize = (key: StockOverviewColumnKey) => (e: React.PointerEvent) => {
    const col = columns.find((c) => c.key === key);
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
      setColumnWidths((prev) => ({ ...prev, [key]: nextWidth }));
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stockOverviewRows;
    return stockOverviewRows.filter((r) => {
      return (
        r.artikel.toLowerCase().includes(q) ||
        r.magazijn.toLowerCase().includes(q) ||
        r.locatie.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Voorraadoverzicht</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 bg-white border-gray-200 text-gray-700 font-semibold gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            Datum 26-03-2026 22:06
          </Button>
          <Button variant="outline" className="h-9 bg-white border-gray-200 text-gray-700 font-semibold">
            PO Creëren
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode('artikel')}
          className={cn(
            'h-9 px-3 rounded-lg border text-sm font-semibold',
            mode === 'artikel'
              ? 'bg-white border-gray-200 text-gray-900'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white'
          )}
        >
          Artikel
        </button>
        <button
          type="button"
          onClick={() => setMode('magazijn')}
          className={cn(
            'h-9 px-3 rounded-lg border text-sm font-semibold',
            mode === 'magazijn'
              ? 'bg-white border-gray-200 text-gray-900'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white'
          )}
        >
          Magazijn
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
            Grootte
          </Button>
          <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
            <Download className="h-4 w-4 mr-2" />
            Exporteren
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoeken..."
              className="h-9 w-64 bg-white border-gray-200 text-sm pl-9"
            />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9 bg-white border-gray-200 text-gray-600 hover:bg-gray-50">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-left border-collapse table-fixed" style={{ minWidth: tableMinWidth }}>
            <colgroup>
              {columns.map((col) => (
                <col key={col.key} style={{ width: columnWidths[col.key] }} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((col) => {
                  const isSticky = stickyRightOffsets.has(col.key);
                  const isStickyDivider = col.key === 'hoeveelheid';
                  return (
                    <th
                      key={col.key}
                      className={cn(
                        'relative select-none overflow-hidden whitespace-nowrap',
                        isSticky ? 'sticky bg-gray-50 z-20' : undefined,
                        isStickyDivider
                          ? 'border-l border-gray-200 shadow-[-12px_0_14px_-14px_rgba(17,24,39,0.35)]'
                          : undefined,
                        col.thClassName
                      )}
                      style={isSticky ? { right: stickyRightOffsets.get(col.key) } : undefined}
                    >
                      {col.key === 'select' ? (
                        <input type="checkbox" className="rounded border-gray-300 shadow-sm" />
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
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((row) => (
                <tr key={row.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="p-3 px-4 bg-white group-hover:bg-gray-50">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="p-3 text-sm text-gray-900 bg-white group-hover:bg-gray-50">{row.artikel}</td>
                  <td className="p-3 text-sm text-gray-900 bg-white group-hover:bg-gray-50">{row.magazijn}</td>
                  <td className="p-3 text-sm text-gray-900 bg-white group-hover:bg-gray-50">{row.locatie}</td>
                  <td className="p-3 text-sm text-gray-700 bg-white group-hover:bg-gray-50">{row.statusLocatie}</td>
                  <td className="p-3 text-sm text-gray-700 bg-white group-hover:bg-gray-50">{row.status}</td>
                  <td
                    className="p-3 text-sm text-gray-900 text-right sticky bg-white group-hover:bg-gray-50 border-l border-gray-200 shadow-[-12px_0_14px_-14px_rgba(17,24,39,0.35)] z-10"
                    style={{ right: stickyRightOffsets.get('hoeveelheid') }}
                  >
                    {formatNumberNl(row.hoeveelheid)}
                  </td>
                  <td
                    className="p-3 text-sm text-gray-900 text-right sticky bg-white group-hover:bg-gray-50 z-10"
                    style={{ right: stickyRightOffsets.get('prijsPerStuk') }}
                  >
                    {formatNumberNl(row.prijsPerStuk)}
                  </td>
                  <td
                    className="p-3 text-sm text-gray-900 text-right sticky bg-white group-hover:bg-gray-50 z-10"
                    style={{ right: stickyRightOffsets.get('wisselkoers') }}
                  >
                    {formatNumberNl(row.wisselkoers)}
                  </td>
                  <td
                    className="p-3 pr-6 text-sm text-gray-900 text-right sticky bg-white group-hover:bg-gray-50 z-10"
                    style={{ right: stickyRightOffsets.get('totaal') }}
                  >
                    {formatNumberNl(row.totaal)}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-sm text-gray-500">
                    Geen resultaten.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
