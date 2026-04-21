import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Columns3, Copy, Download, Filter, Pencil, Plus, Search, Trash2, ZoomIn, SlidersHorizontal } from 'lucide-react';
import { templateService, EmailTemplate } from '@/lib/templateService';

type EmailTemplatesColumnKey = 'naam' | 'sjabloontype' | 'versie' | 'bijgewerktOp' | 'bijgewerktDoor' | 'actions';

type EmailTemplatesColumnDef = {
  key: EmailTemplatesColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const emailTemplatesColumns: EmailTemplatesColumnDef[] = [
  { key: 'naam', label: 'Naam', width: 320, minWidth: 240, resizable: true, thClassName: 'p-3 px-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'sjabloontype', label: 'Sjabloontype', width: 220, minWidth: 170, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'versie', label: 'Versie', width: 110, minWidth: 90, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'bijgewerktOp', label: 'Bijgewerkt op', width: 170, minWidth: 140, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'bijgewerktDoor', label: 'Bijgewerkt door', width: 240, minWidth: 190, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'actions', width: 140, minWidth: 120, resizable: false, thClassName: 'p-3 pr-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
];

export function ManagementEmailTemplatesView() {
  const [query, setQuery] = useState('');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);

  useEffect(() => {
    const unsubscribe = templateService.subscribeToEmailTemplates((data) => {
      setTemplates(data);
    });
    return () => unsubscribe();
  }, []);

  const [columnWidths, setColumnWidths] = useState<Record<EmailTemplatesColumnKey, number>>(() => {
    return emailTemplatesColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<EmailTemplatesColumnKey, number>);
  });
  const resizingRef = useRef<{
    key: EmailTemplatesColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const mapped = templates.map(t => ({
      id: t.id,
      name: t.name,
      templateType: t.type,
      version: '1.0',
      updatedAt: t.updatedAt?.toDate ? t.updatedAt.toDate().toLocaleDateString('nl-NL') : 'Onbekend',
      updatedBy: 'Systeem',
    }));

    if (!q) return mapped;
    return mapped.filter((r) => {
      return (
        r.name.toLowerCase().includes(q) ||
        r.templateType.toLowerCase().includes(q) ||
        r.updatedBy.toLowerCase().includes(q)
      );
    });
  }, [query, templates]);

  const totalCount = templates.length;

  const tableMinWidth = useMemo(() => {
    return emailTemplatesColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const startResize = (key: EmailTemplatesColumnKey) => (e: React.PointerEvent) => {
    const col = emailTemplatesColumns.find(c => c.key === key);
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
        <h1 className="text-2xl font-bold text-gray-900">E-mailsjablonen</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3">
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
                <Download className="h-4 w-4 mr-2" />
                Exporteren
              </Button>
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
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse table-fixed" style={{ minWidth: tableMinWidth }}>
            <colgroup>
              {emailTemplatesColumns.map(col => (
                <col key={col.key} style={{ width: columnWidths[col.key] }} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                {emailTemplatesColumns.map(col => (
                  <th
                    key={col.key}
                    className={cn('relative select-none overflow-hidden whitespace-nowrap', col.thClassName)}
                  >
                    {col.key === 'actions' ? null : (
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
                    <td className="p-3 px-4 text-sm font-medium text-emerald-700 truncate" title={r.name}>{r.name}</td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] font-extrabold px-2 py-0.5 rounded-full border-emerald-200 bg-emerald-50 text-emerald-800'
                        )}
                      >
                        {r.templateType}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-700">{r.version}</td>
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
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="h-8 w-8 rounded-md hover:bg-gray-100 text-blue-600">
                          <Copy className="h-4 w-4" />
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

        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-end gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Regels per pagina:</span>
            <span className="text-gray-800 font-bold">25</span>
          </div>
          <span className="text-gray-800 font-semibold">1–{filtered.length} of {totalCount}</span>
        </div>
      </div>
    </div>
  );
}
