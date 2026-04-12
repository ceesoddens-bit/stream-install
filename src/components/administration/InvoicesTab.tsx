import React, { useMemo, useState } from 'react';
import {
  AlignJustify,
  Columns3,
  CreditCard,
  Download,
  Edit,
  ExternalLink,
  Link as LinkIcon,
  MoreHorizontal,
  Maximize2,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type InvoiceStatus =
  | 'Concept'
  | 'In Afwachting'
  | 'Geweigerd'
  | 'Goedgekeurd'
  | 'Afgerond'
  | 'Creditfactuur';

type InvoiceRow = {
  id: string;
  jaarcode?: string | null;
  code: number;
  status: InvoiceStatus;
  project: string;
  offerte: { label: string; href?: string } | null;
  volledigBetaald: boolean;
  totaalExcl: number;
  totaalIncl: number;
  totaalBetaald: number;
  totaalVoorschot: number;
  kredietOorspr: string;
  bedrijfsnaam: string;
};

const invoicesData: InvoiceRow[] = [
  {
    id: 'inv-82',
    jaarcode: null,
    code: 82,
    status: 'Concept',
    project: '-',
    offerte: { label: 'Nieuw' },
    volledigBetaald: false,
    totaalExcl: 5.63,
    totaalIncl: 5.63,
    totaalBetaald: 0,
    totaalVoorschot: 0,
    kredietOorspr: '-',
    bedrijfsnaam: '-',
  },
  {
    id: 'inv-81',
    jaarcode: null,
    code: 81,
    status: 'Concept',
    project: '-',
    offerte: null,
    volledigBetaald: false,
    totaalExcl: 65,
    totaalIncl: 78.65,
    totaalBetaald: 0,
    totaalVoorschot: 0,
    kredietOorspr: '-',
    bedrijfsnaam: 'Centrada',
  },
  {
    id: 'inv-80',
    jaarcode: null,
    code: 80,
    status: 'Concept',
    project: '-',
    offerte: null,
    volledigBetaald: false,
    totaalExcl: 65,
    totaalIncl: 78.65,
    totaalBetaald: 0,
    totaalVoorschot: 0,
    kredietOorspr: '-',
    bedrijfsnaam: 'OpusFlow',
  },
  {
    id: 'inv-79',
    jaarcode: null,
    code: 79,
    status: 'Concept',
    project: '-',
    offerte: { label: 'naam' },
    volledigBetaald: false,
    totaalExcl: 2000,
    totaalIncl: 2119.7,
    totaalBetaald: 0,
    totaalVoorschot: 0,
    kredietOorspr: '-',
    bedrijfsnaam: 'Centrada',
  },
  {
    id: 'inv-78',
    jaarcode: null,
    code: 78,
    status: 'Goedgekeurd',
    project: '-',
    offerte: { label: 'naam' },
    volledigBetaald: false,
    totaalExcl: 960,
    totaalIncl: 960,
    totaalBetaald: 0,
    totaalVoorschot: 0,
    kredietOorspr: '-',
    bedrijfsnaam: 'Centrada',
  },
];

type StatusFilter = 'Alles' | InvoiceStatus;

const statusFilters: Array<{
  id: StatusFilter;
  label: string;
  tone: 'neutral' | 'orange' | 'amber' | 'red' | 'green' | 'blue' | 'purple';
}> = [
  { id: 'Alles', label: 'Alles', tone: 'neutral' },
  { id: 'Concept', label: 'Concept', tone: 'amber' },
  { id: 'In Afwachting', label: 'In Afwachting', tone: 'orange' },
  { id: 'Geweigerd', label: 'Geweigerd', tone: 'red' },
  { id: 'Goedgekeurd', label: 'Goedgekeurd', tone: 'green' },
  { id: 'Afgerond', label: 'Afgerond', tone: 'neutral' },
  { id: 'Creditfactuur', label: 'Creditfactuur', tone: 'blue' },
];

function toneClasses(tone: (typeof statusFilters)[number]['tone']) {
  switch (tone) {
    case 'amber':
      return {
        pill: 'bg-amber-50 text-amber-900 border-amber-100',
        count: 'bg-amber-500 text-white',
      };
    case 'orange':
      return {
        pill: 'bg-orange-50 text-orange-900 border-orange-100',
        count: 'bg-orange-500 text-white',
      };
    case 'red':
      return {
        pill: 'bg-red-50 text-red-900 border-red-100',
        count: 'bg-red-500 text-white',
      };
    case 'green':
      return {
        pill: 'bg-emerald-50 text-emerald-900 border-emerald-100',
        count: 'bg-emerald-600 text-white',
      };
    case 'blue':
      return {
        pill: 'bg-sky-50 text-sky-900 border-sky-100',
        count: 'bg-sky-600 text-white',
      };
    case 'purple':
      return {
        pill: 'bg-purple-50 text-purple-900 border-purple-100',
        count: 'bg-purple-600 text-white',
      };
    default:
      return {
        pill: 'bg-gray-50 text-gray-900 border-gray-200',
        count: 'bg-gray-700 text-white',
      };
  }
}

function formatCurrency(value: number) {
  return value.toLocaleString('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  });
}

function statusBadge(status: InvoiceStatus) {
  switch (status) {
    case 'Concept':
      return 'bg-amber-500 text-white';
    case 'Goedgekeurd':
      return 'bg-purple-600 text-white';
    case 'In Afwachting':
      return 'bg-orange-500 text-white';
    case 'Geweigerd':
      return 'bg-red-500 text-white';
    case 'Afgerond':
      return 'bg-emerald-600 text-white';
    case 'Creditfactuur':
      return 'bg-sky-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
}

export function InvoicesTab() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Alles');
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const byStatus = invoicesData.reduce<Record<InvoiceStatus, number>>(
      (acc, inv) => {
        acc[inv.status] = (acc[inv.status] ?? 0) + 1;
        return acc;
      },
      {
        Concept: 0,
        'In Afwachting': 0,
        Geweigerd: 0,
        Goedgekeurd: 0,
        Afgerond: 0,
        Creditfactuur: 0,
      }
    );
    return {
      all: invoicesData.length,
      ...byStatus,
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoicesData
      .filter((inv) => {
        if (statusFilter === 'Alles') return true;
        return inv.status === statusFilter;
      })
      .filter((inv) => {
        if (!q) return true;
        const haystack = [
          String(inv.code),
          inv.project,
          inv.bedrijfsnaam,
          inv.offerte?.label ?? '',
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      });
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
              const count =
                f.id === 'Alles'
                  ? counts.all
                  : counts[f.id as InvoiceStatus] ?? 0;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'flex items-center gap-2 text-sm font-semibold rounded-full px-3 py-1 border transition-colors',
                    isActive
                      ? 'border-emerald-600 shadow-[0_1px_0_rgba(0,0,0,0.04)]'
                      : 'border-transparent hover:border-gray-200',
                    tone.pill
                  )}
                >
                  {f.label}
                  <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full leading-none', tone.count)}>
                    {count}
                  </span>
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

        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm border-collapse table-fixed min-w-[1400px]">
            <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-gray-100/60">
              <tr className="border-b border-gray-200">
                <th className="p-3 pl-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
                </th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-24">Jaarcode</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-20">Code</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-36">Status</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-40">Project</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-40">Offerte</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-32 text-center">Volledig b...</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-36 text-right">Totaal excl.</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-36 text-right">Totaal incl.</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-36 text-right">Totaal bet...</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-36 text-right">Totaal voo...</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-40">Krediet oorsp...</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-48">Bedrijfsnaam</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-24 text-right"> </th>
              </tr>
            </thead>

            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={14} className="p-8 text-center text-gray-500">
                    Geen facturen gevonden
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors group">
                    <td className="p-3 pl-4 text-center">
                      <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
                    </td>
                    <td className="p-3 text-sm text-gray-600">{row.jaarcode ?? ''}</td>
                    <td className="p-3 text-sm text-gray-800 font-medium">{row.code}</td>
                    <td className="p-3">
                      <span className={cn('text-[11px] font-bold px-2 py-1 rounded-full inline-flex', statusBadge(row.status))}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600 truncate" title={row.project}>
                      {row.project}
                    </td>
                    <td className="p-3">
                      {row.offerte ? (
                        <button
                          type="button"
                          className="text-sm font-semibold text-sky-700 hover:underline truncate"
                          title={row.offerte.label}
                        >
                          {row.offerte.label}
                        </button>
                      ) : (
                        <X className="h-4 w-4 text-sky-600" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {row.volledigBetaald ? (
                        <Check className="h-4 w-4 text-emerald-700 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-sky-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-800 text-right whitespace-nowrap">
                      {formatCurrency(row.totaalExcl)}
                    </td>
                    <td className="p-3 text-sm text-gray-900 font-semibold text-right whitespace-nowrap">
                      {formatCurrency(row.totaalIncl)}
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-right whitespace-nowrap">
                      {formatCurrency(row.totaalBetaald)}
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-right whitespace-nowrap">
                      {formatCurrency(row.totaalVoorschot)}
                    </td>
                    <td className="p-3 text-sm text-gray-600 truncate" title={row.kredietOorspr}>
                      {row.kredietOorspr}
                    </td>
                    <td
                      className={cn(
                        'p-3 text-sm font-semibold truncate',
                        row.bedrijfsnaam === '-' ? 'text-gray-400' : 'text-emerald-700 hover:underline'
                      )}
                      title={row.bedrijfsnaam}
                    >
                      <button type="button" className={cn(row.bedrijfsnaam === '-' && 'cursor-default')}>
                        {row.bedrijfsnaam}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-2 text-emerald-700">
                        <button type="button" className="p-1 hover:text-emerald-900" aria-label="Openen">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button type="button" className="p-1 hover:text-emerald-900" aria-label="Koppelen">
                          <LinkIcon className="h-4 w-4" />
                        </button>
                        <button type="button" className="p-1 hover:text-emerald-900" aria-label="Bewerken">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
                className={cn(
                  'text-gray-700 hover:text-gray-900',
                  safePage >= totalPages && 'text-gray-400 cursor-not-allowed hover:text-gray-400'
                )}
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
