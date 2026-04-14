import React, { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { automationRows } from '@/data/managementMockData';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Columns3, Copy, Filter, Pencil, Plus, Search, Trash2 } from 'lucide-react';

type RowSelection = Record<string, boolean>;

type AutomationColumnKey =
  | 'select'
  | 'id'
  | 'naam'
  | 'beschrijving'
  | 'versie'
  | 'locatie'
  | 'gemaaktOp'
  | 'gemaaktDoor'
  | 'bijgewerktOp'
  | 'bijgewerktDoor'
  | 'actions';

type AutomationColumnDef = {
  key: AutomationColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const automationColumns: AutomationColumnDef[] = [
  { key: 'select', width: 52, minWidth: 44, resizable: false, thClassName: 'p-3 px-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'id', label: 'id', width: 180, minWidth: 160, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'naam', label: 'Naam', width: 220, minWidth: 180, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'beschrijving', label: 'Beschrijving', width: 280, minWidth: 220, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'versie', label: 'Versie', width: 110, minWidth: 90, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'locatie', label: 'Locatie', width: 140, minWidth: 110, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'gemaaktOp', label: 'Gemaakt op', width: 170, minWidth: 140, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'gemaaktDoor', label: 'Gemaakt door', width: 200, minWidth: 160, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'bijgewerktOp', label: 'Bijgewerkt op', width: 170, minWidth: 140, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'bijgewerktDoor', label: 'Bijgewerkt door', width: 200, minWidth: 160, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'actions', width: 140, minWidth: 120, resizable: false, thClassName: 'p-3 pr-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
];

export function ManagementAutomationView() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<RowSelection>({});
  const [columnWidths, setColumnWidths] = useState<Record<AutomationColumnKey, number>>(() => {
    return automationColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<AutomationColumnKey, number>);
  });
  const resizingRef = useRef<{
    key: AutomationColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return automationRows;
    return automationRows.filter((r) => {
      return (
        r.id.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.version.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.createdBy.toLowerCase().includes(q) ||
        r.updatedBy.toLowerCase().includes(q)
      );
    });
  }, [query]);

  const allChecked = filtered.length > 0 && filtered.every((r) => selected[r.id]);

  const tableMinWidth = useMemo(() => {
    return automationColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const handleToggleAll = (nextChecked: boolean) => {
    if (!nextChecked) {
      const next: RowSelection = { ...selected };
      filtered.forEach((r) => {
        delete next[r.id];
      });
      setSelected(next);
      return;
    }

    const next: RowSelection = { ...selected };
    filtered.forEach((r) => {
      next[r.id] = true;
    });
    setSelected(next);
  };

  const handleToggleOne = (id: string, nextChecked: boolean) => {
    setSelected((prev) => ({
      ...prev,
      [id]: nextChecked,
    }));
  };

  const startResize = (key: AutomationColumnKey) => (e: React.PointerEvent) => {
    const col = automationColumns.find(c => c.key === key);
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
        <h1 className="text-2xl font-bold text-gray-900">Automation</h1>
        <div className="flex items-center gap-2">
          <Button className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2">
            <Plus className="h-4 w-4" />
            Nieuw
          </Button>
        </div>
      </div>

      <div className="flex flex-col flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/50 shrink-0">
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
              Filtersjablonen
            </Button>
          </div>

          <div className="relative w-64 shrink-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoeken…"
              className="pl-9 h-9 bg-white border-gray-200 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse table-fixed" style={{ minWidth: tableMinWidth }}>
            <colgroup>
              {automationColumns.map(col => (
                <col key={col.key} style={{ width: columnWidths[col.key] }} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-white border-b border-gray-200">
                {automationColumns.map(col => (
                  <th
                    key={col.key}
                    className={cn('relative select-none overflow-hidden whitespace-nowrap', col.thClassName)}
                  >
                    {col.key === 'select' ? (
                      <Checkbox
                        checked={allChecked}
                        onCheckedChange={handleToggleAll}
                        aria-label="Selecteer alle regels"
                      />
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
                const initialsCreated = r.createdBy
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((p) => p[0]?.toUpperCase())
                  .join('');
                const initialsUpdated = r.updatedBy
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((p) => p[0]?.toUpperCase())
                  .join('');

                return (
                  <tr key={r.id} className={cn('transition-colors', selected[r.id] ? 'bg-emerald-50/40' : 'hover:bg-emerald-50/20')}>
                    <td className="p-3 px-4">
                      <Checkbox
                        checked={!!selected[r.id]}
                        onCheckedChange={(next) => handleToggleOne(r.id, !!next)}
                        aria-label={`Selecteer ${r.name}`}
                      />
                    </td>
                    <td className="p-3 text-sm text-gray-700 font-mono">{r.id}</td>
                    <td className="p-3 text-sm text-emerald-700 font-semibold">{r.name}</td>
                    <td className="p-3 text-sm text-gray-700">{r.description}</td>
                    <td className="p-3 text-sm text-gray-700">{r.version}</td>
                    <td className="p-3 text-sm text-gray-700">{r.location}</td>
                    <td className="p-3 text-sm text-gray-600">{r.createdAt}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-blue-600 text-white text-[10px]">{initialsCreated || 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-800">{r.createdBy}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{r.updatedAt}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-blue-600 text-white text-[10px]">{initialsUpdated || 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-800">{r.updatedBy}</span>
                      </div>
                    </td>
                    <td className="p-3 pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="h-8 w-8 rounded-md hover:bg-gray-100 text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="h-8 w-8 rounded-md hover:bg-gray-100 text-emerald-700">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="h-8 w-8 rounded-md hover:bg-gray-100 text-blue-600">
                          <Copy className="h-4 w-4" />
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
          <span className="text-gray-800 font-semibold">1–{filtered.length} of {filtered.length}</span>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50">‹</button>
            <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
