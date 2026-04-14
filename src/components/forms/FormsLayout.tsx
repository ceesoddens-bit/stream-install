import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  LifeBuoy,
  HelpCircle,
  Mail,
  Bell,
  Settings,
  Columns3,
  SlidersHorizontal,
  AlignJustify,
  Maximize2,
  Zap,
  Download,
  Search,
  History,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formsService, FormItem } from '@/lib/formsService';

type FormsColumnKey =
  | 'select'
  | 'naam'
  | 'status'
  | 'project'
  | 'planningsregel'
  | 'gemaaktOp'
  | 'gemaaktDoor'
  | 'bijgewerktOp'
  | 'bijgewerktDoor'
  | 'download';

type FormsColumnDef = {
  key: FormsColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const formsColumns: FormsColumnDef[] = [
  { key: 'select', width: 52, minWidth: 44, resizable: false, thClassName: 'p-3 text-center' },
  { key: 'naam', label: 'Naam', width: 260, minWidth: 160, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'status', label: 'Status', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'project', label: 'Project', width: 240, minWidth: 160, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'planningsregel', label: 'Planningsregel', width: 220, minWidth: 160, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'gemaaktOp', label: 'Gemaakt op', width: 140, minWidth: 130, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'gemaaktDoor', label: 'Gemaakt door', width: 190, minWidth: 150, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'bijgewerktOp', label: 'Bijgewerkt op', width: 140, minWidth: 130, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'bijgewerktDoor', label: 'Bijgewerkt door', width: 200, minWidth: 150, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'download', width: 56, minWidth: 48, resizable: false, thClassName: 'p-3 text-right' },
];

export function FormsLayout() {
  const [formItems, setFormItems] = useState<FormItem[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    return formsService.subscribeToFormItems(setFormItems);
  }, []);

  const [columnWidths, setColumnWidths] = useState<Record<FormsColumnKey, number>>(() => {
    return formsColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<FormsColumnKey, number>);
  });
  const resizingRef = useRef<{
    key: FormsColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const tableMinWidth = useMemo(() => {
    return formsColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const startResize = (key: FormsColumnKey) => (e: React.PointerEvent) => {
    const col = formsColumns.find(c => c.key === key);
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

  const formatTimestamp = (ts: any) => {
    if (!ts) return '-';
    if (typeof ts === 'string') return ts;
    if (ts.toDate) return ts.toDate().toLocaleString('nl-NL');
    return '-';
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return formItems;
    return formItems.filter(f => 
      f.name.toLowerCase().includes(q) || 
      f.project.toLowerCase().includes(q) || 
      f.planningsregel.toLowerCase().includes(q)
    );
  }, [query, formItems]);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <LifeBuoy className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Ingevulde formulieren</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoeken..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
            />
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <HelpCircle className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Mail className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
          </button>
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-medium text-sm">
            <Zap className="h-4 w-4" />
            Installatiegroep Duurzaam
          </div>
        </div>
      </div>

      {/* ── Toolbar Area ── */}
      <div className="px-6 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 border-b border-gray-200">
            <button className="px-4 py-2 text-sm font-semibold border-b-2 border-green-600 text-green-700 -mb-px flex items-center gap-2">
              Alles
              <span className="bg-green-700 text-white text-[10px] px-1.5 py-0.5 rounded-md leading-none">
                {filtered.length}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-700 rounded-md text-sm font-semibold hover:bg-green-50 transition-colors">
              <History className="h-4 w-4" />
              Bekijk Oude Formulieren
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-md transition-colors bg-gray-100">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900">
              <Columns3 className="h-4 w-4" />
              Kolommen
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900">
              <AlignJustify className="h-4 w-4" />
              Dichtheid
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900">
              <Maximize2 className="h-4 w-4" />
              Schaal
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-400 cursor-not-allowed">
              <Zap className="h-4 w-4" />
              Bulk
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900">
              <Download className="h-4 w-4" />
              Exporteren
            </button>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table
              className="w-full text-left border-collapse table-fixed"
              style={{ minWidth: tableMinWidth }}
            >
              <colgroup>
                {formsColumns.map(col => (
                  <col key={col.key} style={{ width: columnWidths[col.key] }} />
                ))}
              </colgroup>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {formsColumns.map(col => (
                    <th
                      key={col.key}
                      className={cn('relative select-none overflow-hidden whitespace-nowrap', col.thClassName)}
                    >
                      {col.key === 'select' ? (
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                      ) : col.key === 'download' ? (
                        <>
                          <span className="sr-only">Download</span>
                          <Download className="h-3.5 w-3.5 text-gray-400 inline" aria-hidden="true" />
                        </>
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
              {filtered.map((form, index) => (
                <tr key={form.id} className={cn("border-b border-gray-100 hover:bg-gray-50", index % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                  <td className="p-3 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  </td>
                  <td className="p-3 text-sm font-medium text-green-600 cursor-pointer hover:underline truncate" title={form.name}>
                    {form.name}
                  </td>
                  <td className="p-3">
                    <span 
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded",
                        form.status === 'PUBLISHED' ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                      )}
                    >
                      {form.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm font-medium text-green-600 cursor-pointer hover:underline truncate" title={form.project}>
                    {form.project}
                  </td>
                  <td className="p-3 text-sm text-gray-600 truncate" title={form.planningsregel}>
                    {form.planningsregel}
                  </td>
                  <td className="p-3 text-sm text-gray-600 whitespace-nowrap">
                    {formatTimestamp(form.createdAt)}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                        <UserCircleIcon name={form.createdBy || ''} />
                      </div>
                      <span className="truncate" title={form.createdBy}>{form.createdBy}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600 whitespace-nowrap">
                    {formatTimestamp(form.updatedAt)}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                        <UserCircleIcon name={form.updatedBy || ''} />
                      </div>
                      <span className="truncate" title={form.updatedBy}>{form.updatedBy}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-green-600 hover:text-green-800 p-1" type="button" title="Download" aria-label="Download">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-sm text-gray-500">
                    Geen formulieren gevonden.
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination placeholder */}
        <div className="flex items-center justify-end py-4 text-sm text-gray-600 gap-4">
          <div className="flex items-center gap-2">
            <span>Regels per pagina:</span>
            <select className="border-none bg-transparent font-medium focus:ring-0 cursor-pointer" defaultValue="25">
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <span>1–{filtered.length} of {formItems.length}</span>
          <div className="flex items-center gap-2">
            <button className="p-1 text-gray-400 hover:text-gray-600 cursor-not-allowed"><ChevronLeft className="h-5 w-5" /></button>
            <button className="p-1 text-gray-600 hover:text-gray-900"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper generic avatar mimicking the screenshot
function UserCircleIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 h-4 w-4">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
