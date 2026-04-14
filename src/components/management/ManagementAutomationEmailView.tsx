import React, { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { automationEmailRows } from '@/data/managementMockData';
import { Columns3, ExternalLink, Filter, Search, ChevronDown } from 'lucide-react';

type AutomationEmailColumnKey = 'expand' | 'naam' | 'beschrijving' | 'actief' | 'actions';

type AutomationEmailColumnDef = {
  key: AutomationEmailColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const automationEmailColumns: AutomationEmailColumnDef[] = [
  { key: 'expand', width: 56, minWidth: 48, resizable: false, thClassName: 'p-3 px-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'naam', label: 'Naam', width: 360, minWidth: 260, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'beschrijving', label: 'Beschrijving', width: 320, minWidth: 240, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'actief', label: 'Actief', width: 110, minWidth: 90, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'actions', width: 84, minWidth: 72, resizable: false, thClassName: 'p-3 pr-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
];

export function ManagementAutomationEmailView() {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [columnWidths, setColumnWidths] = useState<Record<AutomationEmailColumnKey, number>>(() => {
    return automationEmailColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<AutomationEmailColumnKey, number>);
  });
  const resizingRef = useRef<{
    key: AutomationEmailColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return automationEmailRows;
    return automationEmailRows.filter((r) => {
      const hit = r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      const childHit = (r.children ?? []).some((c) => c.name.toLowerCase().includes(q));
      return hit || childHit;
    });
  }, [query]);

  const total = 7;

  const tableMinWidth = useMemo(() => {
    return automationEmailColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const startResize = (key: AutomationEmailColumnKey) => (e: React.PointerEvent) => {
    const col = automationEmailColumns.find(c => c.key === key);
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
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Automatiseringen met mails</h1>
        <p className="text-sm text-gray-500 mt-1">
          Hier vindt u alle automatiseringen met daaraan gekoppelde mails. U kunt de inhoud van de mail bekijken en bewerken in dit scherm.
        </p>
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
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">Grootte</Button>
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
              {automationEmailColumns.map(col => (
                <col key={col.key} style={{ width: columnWidths[col.key] }} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-white border-b border-gray-200">
                {automationEmailColumns.map(col => (
                  <th
                    key={col.key}
                    className={cn('relative select-none overflow-hidden whitespace-nowrap', col.thClassName)}
                  >
                    {col.key === 'expand' || col.key === 'actions' ? null : (
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
                const hasChildren = (r.children ?? []).length > 0;
                const isExpanded = !!expanded[r.id];
                return (
                  <React.Fragment key={r.id}>
                    <tr className="hover:bg-emerald-50/20 transition-colors">
                      <td className="p-3 px-4">
                        {hasChildren ? (
                          <button
                            className="h-8 w-8 rounded-md hover:bg-gray-100 text-gray-600 inline-flex items-center justify-center"
                            onClick={() => setExpanded((prev) => ({ ...prev, [r.id]: !prev[r.id] }))}
                          >
                            <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded ? 'rotate-180' : '')} />
                          </button>
                        ) : (
                          <div className="h-8 w-8" />
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Checkbox checked={false} aria-label="Selecteer" />
                          <span className="text-sm text-gray-900 font-medium truncate">{r.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600 truncate" title={r.description}>{r.description}</td>
                      <td className="p-3">
                        <span className={cn('text-sm font-semibold', r.active ? 'text-emerald-700' : 'text-gray-400')}>
                          {r.active ? '✓' : '×'}
                        </span>
                      </td>
                      <td className="p-3 pr-4">
                        <button className="h-8 w-8 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 inline-flex items-center justify-center">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>

                    {hasChildren && isExpanded &&
                      (r.children ?? []).map((c) => (
                        <tr key={c.id} className="bg-white hover:bg-emerald-50/10 transition-colors">
                          <td className="p-3 px-4" />
                          <td className="p-3">
                            <div className="flex items-center gap-2 pl-8">
                              <Checkbox checked={false} aria-label="Selecteer" />
                              <span className="text-sm text-gray-700 truncate">{c.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-gray-400">-</td>
                          <td className="p-3">
                            <span className={cn('text-sm font-semibold', c.active ? 'text-emerald-700' : 'text-gray-400')}>
                              {c.active ? '✓' : '×'}
                            </span>
                          </td>
                          <td className="p-3 pr-4">
                            <button className="h-8 w-8 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 inline-flex items-center justify-center">
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-end text-xs text-gray-500 shrink-0">
          <span className="text-gray-800 font-semibold">Totaal: {total}</span>
        </div>
      </div>
    </div>
  );
}
