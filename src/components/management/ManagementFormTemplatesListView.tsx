import React, { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formTemplateListRows } from '@/data/managementMockData';
import { cn } from '@/lib/utils';
import { Columns3, Copy, Eye, Filter, Lock, Pencil, Plus, Search, Trash2, ChevronDown } from 'lucide-react';

const badgeClassByValue = (value: string) => {
  const v = value.toLowerCase();
  if (v.startsWith('install')) return 'bg-blue-600 text-white border-blue-600';
  if (v.startsWith('serv')) return 'bg-emerald-600 text-white border-emerald-600';
  if (v.startsWith('advies')) return 'bg-purple-600 text-white border-purple-600';
  if (v === '-' || v === 'c') return 'bg-gray-200 text-gray-700 border-gray-200';
  if (v === 'ad' || v === 'ag') return 'bg-purple-600 text-white border-purple-600';
  return 'bg-emerald-600 text-white border-emerald-600';
};

type FormTemplatesColumnKey =
  | 'select'
  | 'naam'
  | 'type'
  | 'planningstype'
  | 'standaard'
  | 'bewerker'
  | 'beheer'
  | 'hulpverlening'
  | 'bijgewerktOp'
  | 'bijgewerktDoor'
  | 'actions';

type FormTemplatesColumnDef = {
  key: FormTemplatesColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const formTemplatesColumns: FormTemplatesColumnDef[] = [
  { key: 'select', width: 52, minWidth: 44, resizable: false, thClassName: 'p-3 px-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'naam', label: 'Naam', width: 280, minWidth: 220, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'type', label: 'Type', width: 220, minWidth: 180, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'planningstype', label: 'Planningstype', width: 240, minWidth: 200, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'standaard', label: 'Standaard', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'bewerker', label: 'Bewerker', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'beheer', label: 'Beheer', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'hulpverlening', label: 'Hulpverlening', width: 160, minWidth: 130, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'bijgewerktOp', label: 'Bijgewerkt op', width: 170, minWidth: 140, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'bijgewerktDoor', label: 'Bijgewerkt door', width: 220, minWidth: 180, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'actions', width: 200, minWidth: 180, resizable: false, thClassName: 'p-3 pr-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
];

export function ManagementFormTemplatesListView() {
  const [query, setQuery] = useState('');
  const [columnWidths, setColumnWidths] = useState<Record<FormTemplatesColumnKey, number>>(() => {
    return formTemplatesColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<FormTemplatesColumnKey, number>);
  });
  const resizingRef = useRef<{
    key: FormTemplatesColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return formTemplateListRows;
    return formTemplateListRows.filter((r) => {
      return (
        r.name.toLowerCase().includes(q) ||
        r.updatedBy.toLowerCase().includes(q) ||
        r.planningTypes.join(' ').toLowerCase().includes(q)
      );
    });
  }, [query]);

  const totalCount = 12;

  const tableMinWidth = useMemo(() => {
    return formTemplatesColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const startResize = (key: FormTemplatesColumnKey) => (e: React.PointerEvent) => {
    const col = formTemplatesColumns.find(c => c.key === key);
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
        <h1 className="text-2xl font-bold text-gray-900">Formuliersjablonenlijst</h1>
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
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
              Naar Oude Formuliersjablonen
            </Button>
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2">
              <Plus className="h-4 w-4" />
              Nieuw
              <ChevronDown className="h-4 w-4" />
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
              {formTemplatesColumns.map(col => (
                <col key={col.key} style={{ width: columnWidths[col.key] }} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-white border-b border-gray-200">
                {formTemplatesColumns.map(col => (
                  <th
                    key={col.key}
                    className={cn('relative select-none overflow-hidden whitespace-nowrap', col.thClassName)}
                  >
                    {col.key === 'select' ? (
                      <Checkbox checked={false} aria-label="Selecteer alles" />
                    ) : col.key === 'actions' ? null : (
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
                const initials = r.updatedBy
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
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {r.types.map((t, idx) => (
                          <Badge
                            key={`${r.id}-t-${idx}`}
                            variant="outline"
                            className={cn('text-[10px] font-extrabold px-2 py-0.5 rounded-full', badgeClassByValue(t))}
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {r.planningTypes.map((pt, idx) => (
                          <Badge
                            key={`${r.id}-pt-${idx}`}
                            variant="outline"
                            className={cn('text-[10px] font-extrabold px-2 py-0.5 rounded-full', badgeClassByValue(pt))}
                          >
                            {pt}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-700">{r.standaard}</td>
                    <td className="p-3 text-sm text-gray-700">{r.bewerker}</td>
                    <td className="p-3 text-sm text-gray-700">{r.beheer}</td>
                    <td className="p-3 text-sm text-gray-700">{r.hulpverlening}</td>
                    <td className="p-3 text-sm text-gray-600">{r.updatedAt}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-blue-600 text-white text-[10px]">{initials || 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-800">{r.updatedBy}</span>
                      </div>
                    </td>
                    <td className="p-3 pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="h-8 w-8 rounded-md hover:bg-gray-100 text-emerald-700">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="h-8 w-8 rounded-md hover:bg-gray-100 text-emerald-700">
                          <Lock className="h-4 w-4" />
                        </button>
                        <button className="h-8 w-8 rounded-md hover:bg-gray-100 text-blue-600">
                          <Copy className="h-4 w-4" />
                        </button>
                        <button className="h-8 w-8 rounded-md hover:bg-gray-100 text-emerald-700">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="h-8 w-8 rounded-md hover:bg-gray-100 text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-end gap-6 text-xs text-gray-500 shrink-0">
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
