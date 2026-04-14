import React, { useMemo, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { managementCustomers } from '@/data/managementMockData';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Columns3, Filter, Search, Users, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatRangeLabel = (from: number, to: number, total: number) => `${from}–${to} of ${total}`;

type CustomersColumnKey = 'foto' | 'naam' | 'email' | 'rol' | 'actions';

type CustomersColumnDef = {
  key: CustomersColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const customersColumns: CustomersColumnDef[] = [
  { key: 'foto', label: 'Foto', width: 96, minWidth: 80, resizable: false, thClassName: 'p-3 px-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'naam', label: 'Naam', width: 280, minWidth: 200, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'email', label: 'Email', width: 320, minWidth: 220, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'rol', label: 'Rol', width: 220, minWidth: 160, resizable: true, thClassName: 'p-3 pr-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'actions', width: 64, minWidth: 56, resizable: false, thClassName: 'p-3 pr-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
];

export function ManagementCustomersView() {
  const [query, setQuery] = useState('');
  const [columnWidths, setColumnWidths] = useState<Record<CustomersColumnKey, number>>(() => {
    return customersColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<CustomersColumnKey, number>);
  });
  const resizingRef = useRef<{
    key: CustomersColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return managementCustomers;
    return managementCustomers.filter((c) => {
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.role.toLowerCase().includes(q);
    });
  }, [query]);

  const activeCount = 81;
  const invitedCount = 0;
  const perPage = 50;
  const shownFrom = filtered.length ? 1 : 0;
  const shownTo = Math.min(filtered.length, perPage);

  const tableMinWidth = useMemo(() => {
    return customersColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const startResize = (key: CustomersColumnKey) => (e: React.PointerEvent) => {
    const col = customersColumns.find(c => c.key === key);
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
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Users className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Klanten</h1>
        </div>

        <div className="flex items-stretch gap-3 flex-1 justify-end">
          <Card className="border-0 shadow-sm bg-blue-700 text-white min-w-[260px]">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-3xl font-extrabold leading-none">{activeCount}</div>
                <div className="text-xs font-semibold text-white/80 mt-1">Actieve klanten</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-amber-600 text-white min-w-[260px]">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-3xl font-extrabold leading-none">{invitedCount}</div>
                <div className="text-xs font-semibold text-white/80 mt-1">Uitgenodigd</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
            </CardContent>
          </Card>
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
              {customersColumns.map(col => (
                <col key={col.key} style={{ width: columnWidths[col.key] }} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-white border-b border-gray-200">
                {customersColumns.map(col => (
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
              {filtered.slice(0, perPage).map((c) => (
                <tr key={c.id} className="hover:bg-emerald-50/20 transition-colors">
                  <td className="p-3 px-4">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-100 text-gray-500 text-xs"> </AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="p-3 text-sm font-medium text-gray-900 truncate" title={c.name}>{c.name}</td>
                  <td className="p-3 text-sm text-gray-700 truncate" title={c.email}>{c.email}</td>
                  <td className="p-3 pr-4 text-sm text-gray-700 truncate" title={c.role}>{c.role}</td>
                  <td className="p-3 pr-4">
                    <button className="h-8 w-8 rounded-md hover:bg-gray-100 text-gray-500">⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-end gap-6 text-xs text-gray-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Regels per pagina:</span>
            <span className="text-gray-800 font-bold">{perPage}</span>
          </div>
          <span className="text-gray-800 font-semibold">{formatRangeLabel(shownFrom, shownTo, activeCount)}</span>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50">‹</button>
            <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
