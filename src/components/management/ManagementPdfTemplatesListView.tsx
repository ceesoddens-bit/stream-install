import React, { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { pdfTemplateRows } from '@/data/managementMockData';
import { Columns3, Filter, Plus, Search } from 'lucide-react';

type PdfTemplatesColumnKey = 'select' | 'naam' | 'categorie' | 'gemaaktOp' | 'gemaaktDoor';

type PdfTemplatesColumnDef = {
  key: PdfTemplatesColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const pdfTemplatesColumns: PdfTemplatesColumnDef[] = [
  { key: 'select', width: 52, minWidth: 44, resizable: false, thClassName: 'p-3 px-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'naam', label: 'Naam', width: 360, minWidth: 260, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'categorie', label: 'Categorie', width: 200, minWidth: 160, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'gemaaktOp', label: 'Gemaakt op', width: 180, minWidth: 150, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'gemaaktDoor', label: 'Gemaakt door', width: 260, minWidth: 190, resizable: true, thClassName: 'p-3 pr-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
];

export function ManagementPdfTemplatesListView() {
  const [query, setQuery] = useState('');
  const [columnWidths, setColumnWidths] = useState<Record<PdfTemplatesColumnKey, number>>(() => {
    return pdfTemplatesColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<PdfTemplatesColumnKey, number>);
  });
  const resizingRef = useRef<{
    key: PdfTemplatesColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pdfTemplateRows;
    return pdfTemplateRows.filter((r) => {
      return (
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.createdBy.toLowerCase().includes(q)
      );
    });
  }, [query]);

  const totalCount = 12;

  const tableMinWidth = useMemo(() => {
    return pdfTemplatesColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const startResize = (key: PdfTemplatesColumnKey) => (e: React.PointerEvent) => {
    const col = pdfTemplatesColumns.find(c => c.key === key);
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
        <h1 className="text-2xl font-bold text-gray-900">PDF sjablonenlijst</h1>
      </div>

      <div className="flex flex-col flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-bold shrink-0"
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
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">Filtersjablonen</Button>
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">Bulk</Button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2">
              <Plus className="h-4 w-4" />
              Sjabloon Toevoegen
            </Button>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Zoeken…"
                className="pl-9 h-9 bg-white border-gray-200 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse table-fixed" style={{ minWidth: tableMinWidth }}>
            <colgroup>
              {pdfTemplatesColumns.map(col => (
                <col key={col.key} style={{ width: columnWidths[col.key] }} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-white border-b border-gray-200">
                {pdfTemplatesColumns.map(col => (
                  <th
                    key={col.key}
                    className={`relative select-none overflow-hidden whitespace-nowrap ${col.thClassName ?? ''}`}
                  >
                    {col.key === 'select' ? (
                      <Checkbox checked={false} aria-label="Selecteer alles" />
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
              {filtered.map((r) => {
                const initials = r.createdBy
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((p) => p[0]?.toUpperCase())
                  .join('');

                return (
                  <tr key={r.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="p-3 px-4">
                      <Checkbox checked={false} aria-label="Selecteer" />
                    </td>
                    <td className="p-3 text-sm font-medium text-emerald-700 truncate" title={r.name}>{r.name}</td>
                    <td className="p-3 text-sm text-gray-700">{r.category}</td>
                    <td className="p-3 text-sm text-gray-600">{r.createdAt}</td>
                    <td className="p-3 pr-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-emerald-600 text-white text-[10px]">{initials || 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-800 truncate">{r.createdBy}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-end gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Regels per pagina:</span>
            <span className="text-gray-800 font-bold">25</span>
          </div>
          <span className="text-gray-800 font-semibold">1–{filtered.length} of {totalCount}</span>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50">‹</button>
            <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
