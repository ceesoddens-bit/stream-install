import React from 'react';
import { Check, Edit, ExternalLink, Link as LinkIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InvoiceRow } from './types';
import { formatCurrency, statusBadge } from './utils';

export function InvoicesTable({ rows }: { rows: InvoiceRow[] }) {
  return (
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
          {rows.length === 0 ? (
            <tr>
              <td colSpan={14} className="p-8 text-center text-gray-500">
                Geen facturen gevonden
              </td>
            </tr>
          ) : (
            rows.map((row) => (
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
                    <button type="button" className="text-sm font-semibold text-sky-700 hover:underline truncate" title={row.offerte.label}>
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
                <td className="p-3 text-sm text-gray-800 text-right whitespace-nowrap">{formatCurrency(row.totaalExcl)}</td>
                <td className="p-3 text-sm text-gray-900 font-semibold text-right whitespace-nowrap">{formatCurrency(row.totaalIncl)}</td>
                <td className="p-3 text-sm text-gray-700 text-right whitespace-nowrap">{formatCurrency(row.totaalBetaald)}</td>
                <td className="p-3 text-sm text-gray-700 text-right whitespace-nowrap">{formatCurrency(row.totaalVoorschot)}</td>
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
  );
}

