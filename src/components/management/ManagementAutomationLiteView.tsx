import React, { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Columns3, Download, Filter, Settings, SlidersHorizontal, ZoomIn } from 'lucide-react';

type AutomationLiteColumnKey = 'select' | 'naam' | 'locatie' | 'beschrijving' | 'ingeschakeld' | 'versie';

type AutomationLiteColumnDef = {
  key: AutomationLiteColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const automationLiteColumns: AutomationLiteColumnDef[] = [
  { key: 'select', width: 52, minWidth: 44, resizable: false, thClassName: 'p-3 px-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'naam', label: 'Naam', width: 260, minWidth: 200, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'locatie', label: 'Locatie', width: 170, minWidth: 140, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'beschrijving', label: 'Beschrijving', width: 320, minWidth: 260, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'ingeschakeld', label: 'Ingeschakeld', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'versie', label: 'Versie', width: 110, minWidth: 90, resizable: true, thClassName: 'p-3 pr-6 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
];

export function ManagementAutomationLiteView() {
  const totalCount = 0;

  const [columnWidths, setColumnWidths] = useState<Record<AutomationLiteColumnKey, number>>(() => {
    return automationLiteColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<AutomationLiteColumnKey, number>);
  });
  const resizingRef = useRef<{
    key: AutomationLiteColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const tableMinWidth = useMemo(() => {
    return automationLiteColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const startResize = (key: AutomationLiteColumnKey) => (e: React.PointerEvent) => {
    const col = automationLiteColumns.find(c => c.key === key);
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
        <h1 className="text-2xl font-bold text-gray-900">Automatisering Lite</h1>
        <div className="flex items-center gap-2">
          <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">Nieuw</Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-900">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="mt-1 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-bold shrink-0"
              >
                Alles
                <span className="inline-flex items-center justify-center min-w-7 h-6 px-2 rounded-full bg-emerald-600 text-white text-xs font-extrabold">
                  {totalCount}
                </span>
              </button>

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
                Bulk
              </Button>
              <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
                <Download className="h-4 w-4 mr-2" />
                Exporteren
              </Button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Input placeholder="Zoeken…" className="h-9 w-56 bg-gray-50 border-gray-200 text-sm" />
              <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-900">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse table-fixed" style={{ minWidth: tableMinWidth }}>
            <colgroup>
              {automationLiteColumns.map(col => (
                <col key={col.key} style={{ width: columnWidths[col.key] }} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                {automationLiteColumns.map(col => (
                  <th
                    key={col.key}
                    className={cn('relative select-none overflow-hidden whitespace-nowrap', col.thClassName)}
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
            <tbody>
              <tr>
                <td colSpan={automationLiteColumns.length} className="py-20 text-center text-gray-400 text-sm">
                  Geen resultaten.
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
