import React, { useMemo, useState } from 'react';
import {
  AlignJustify,
  Columns3,
  CreditCard,
  Download,
  Edit,
  Maximize2,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { invoicesData } from './mock';
import { InvoicesTable } from './InvoicesTable';
import { StatusFilter, statusFilters, InvoiceStatus } from './types';
import { computeInvoiceCounts, filterInvoices, toneClasses } from './utils';

export function InvoicesTab() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Alles');
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const counts = useMemo(() => computeInvoiceCounts(invoicesData), []);

  const filtered = useMemo(() => {
    return filterInvoices({ rows: invoicesData, statusFilter, query });
  }, [query, statusFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pageRows = filtered.slice(startIndex, startIndex + pageSize);
  const from = total === 0 ? 0 : startIndex + 1;
  const to = total === 0 ? 0 : Math.min(startIndex + pageRows.length, total);

  const setFilter = (next: StatusFilter) => {
    setStatusFilter(next);
    setPage(1);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative space-y-4 pt-2 pb-8">
      <div className="flex items-center gap-3 px-6 pb-2 shrink-0">
        <div className="bg-emerald-100 p-2 rounded-lg">
          <CreditCard className="h-5 w-5 text-emerald-700" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Facturen</h2>
      </div>

      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 shrink-0 gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {statusFilters.map((f) => {
              const isActive = statusFilter === f.id;
              const tone = toneClasses(f.tone);
              const count = f.id === 'Alles' ? counts.all : counts[f.id as InvoiceStatus] ?? 0;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'flex items-center gap-2 text-sm font-semibold rounded-full px-3 py-1 border transition-colors',
                    isActive ? 'border-emerald-600 shadow-[0_1px_0_rgba(0,0,0,0.04)]' : 'border-transparent hover:border-gray-200',
                    tone.pill
                  )}
                >
                  {f.label}
                  <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full leading-none', tone.count)}>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-emerald-900 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Factuur Aanmaken
            </button>
            <button
              type="button"
              className="p-2 border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50"
              aria-label="Instellingen"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-4 py-2 flex items-center justify-between bg-white shrink-0 border-b border-gray-100 gap-3">
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            <button type="button" className="flex items-center gap-1.5 hover:text-gray-900">
              <Columns3 className="h-4 w-4" /> Kolommen
            </button>
            <button type="button" className="flex items-center gap-1.5 hover:text-gray-900">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <button type="button" className="flex items-center gap-1.5 hover:text-gray-900">
              <AlignJustify className="h-4 w-4" /> Dichtheid
            </button>
            <button type="button" className="flex items-center gap-1.5 hover:text-gray-900">
              <Maximize2 className="h-4 w-4" /> Schaal
            </button>
            <button type="button" className="flex items-center gap-1.5 text-gray-400 cursor-not-allowed">
              <MoreHorizontal className="h-4 w-4" /> Bulk
            </button>
            <button type="button" className="flex items-center gap-1.5 hover:text-gray-900">
              <Download className="h-4 w-4" /> Exporteren
            </button>
            <button type="button" className="flex items-center gap-1.5 hover:text-gray-900">
              <Edit className="h-4 w-4" /> Bewerken
            </button>
          </div>

          <div className="relative w-64 flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              type="text"
              placeholder="Zoeken..."
              className="pl-9 pr-10 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50 w-full"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-emerald-700" aria-hidden="true" />
          </div>
        </div>

        <InvoicesTable rows={pageRows} />

        <div className="bg-white border-t border-gray-200 p-4 shrink-0 flex items-center justify-end">
          <div className="flex items-center gap-6 text-[13px] font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <span>Regels per pagina:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border-none outline-none font-semibold text-gray-800 focus:ring-0 bg-transparent cursor-pointer"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <span>
              {from}–{to} of {total}
            </span>
            <div className="flex gap-4 items-center pl-2">
              <button
                type="button"
                className={cn('text-gray-700 hover:text-gray-900', safePage <= 1 && 'text-gray-400 cursor-not-allowed hover:text-gray-400')}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                aria-label="Vorige pagina"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button
                type="button"
                className={cn('text-gray-700 hover:text-gray-900', safePage >= totalPages && 'text-gray-400 cursor-not-allowed hover:text-gray-400')}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                aria-label="Volgende pagina"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

