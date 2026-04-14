import React, { useMemo, useRef, useState } from 'react';
import { Check, Eye, Link as LinkIcon, Send, SquarePen, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InvoiceRow } from './types';
import { formatCurrency, statusBadge } from './utils';

type InvoicesColumnKey =
  | 'select'
  | 'jaarcode'
  | 'code'
  | 'status'
  | 'project'
  | 'offerte'
  | 'volledigBetaald'
  | 'totaalExcl'
  | 'totaalIncl'
  | 'totaalBetaald'
  | 'totaalVoorschot'
  | 'kredietOorspr'
  | 'bedrijfsnaam'
  | 'contactName'
  | 'emailAddress'
  | 'sentIndicator'
  | 'reference'
  | 'paymentTermDays'
  | 'createdAt'
  | 'createdBy'
  | 'updatedAt'
  | 'updatedBy'
  | 'actions';

type InvoicesColumnDef = {
  key: InvoicesColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const invoicesColumns: InvoicesColumnDef[] = [
  { key: 'select', width: 56, minWidth: 48, resizable: false, thClassName: 'p-3 pl-4 text-center' },
  { key: 'jaarcode', label: 'Jaarcode', width: 110, minWidth: 90, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'code', label: 'Code', width: 90, minWidth: 80, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'status', label: 'Status', width: 150, minWidth: 130, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'project', label: 'Project', width: 220, minWidth: 160, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'offerte', label: 'Offerte', width: 200, minWidth: 140, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'volledigBetaald', label: 'Volledig betaald', width: 150, minWidth: 130, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase text-center' },
  { key: 'totaalExcl', label: 'Totaal excl.', width: 150, minWidth: 130, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase text-right' },
  { key: 'totaalIncl', label: 'Totaal incl.', width: 150, minWidth: 130, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase text-right' },
  { key: 'totaalBetaald', label: 'Totaal betaald', width: 150, minWidth: 130, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase text-right' },
  { key: 'totaalVoorschot', label: 'Totaal voorschot', width: 170, minWidth: 150, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase text-right' },
  { key: 'kredietOorspr', label: 'Krediet oorspr.', width: 180, minWidth: 150, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'bedrijfsnaam', label: 'Bedrijfsnaam', width: 220, minWidth: 170, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'contactName', label: 'Contactnaam', width: 220, minWidth: 170, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'emailAddress', label: 'E-mailadres', width: 240, minWidth: 190, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'sentIndicator', label: 'Verstuurd', width: 120, minWidth: 100, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'reference', label: 'Referentie', width: 180, minWidth: 150, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'paymentTermDays', label: 'Betalingstermijn', width: 160, minWidth: 140, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'createdAt', label: 'Gemaakt op', width: 170, minWidth: 150, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'createdBy', label: 'Gemaakt door', width: 240, minWidth: 200, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'updatedAt', label: 'Bijgewerkt op', width: 170, minWidth: 150, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'updatedBy', label: 'Bijgewerkt door', width: 240, minWidth: 200, resizable: true, thClassName: 'p-3 text-xs font-semibold text-gray-600 uppercase' },
  { key: 'actions', width: 120, minWidth: 110, resizable: false, thClassName: 'p-3 text-right' },
];

function Actor({ name, initials, tone }: { name: string; initials: string; tone: 'system' | 'user' }) {
  return (
    <div className="inline-flex items-center gap-2 min-w-0">
      <div
        className={cn(
          'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
          tone === 'system' ? 'bg-amber-400 text-amber-950' : 'bg-slate-800 text-white'
        )}
        aria-hidden="true"
      >
        {initials}
      </div>
      <span className="truncate text-sm text-gray-700" title={name}>
        {name}
      </span>
    </div>
  );
}

function SendIcons({ count }: { count: number }) {
  if (count <= 0) return <span className="text-gray-400">-</span>;

  return (
    <div className="inline-flex items-center gap-1 text-sky-600">
      {Array.from({ length: count }).map((_, i) => (
        <Send key={i} className="h-4 w-4" />
      ))}
    </div>
  );
}

export function InvoicesTable({ rows }: { rows: InvoiceRow[] }) {
  const [columnWidths, setColumnWidths] = useState<Record<InvoicesColumnKey, number>>(() => {
    return invoicesColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<InvoicesColumnKey, number>);
  });
  const resizingRef = useRef<{
    key: InvoicesColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const tableMinWidth = useMemo(() => {
    return invoicesColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const startResize = (key: InvoicesColumnKey) => (e: React.PointerEvent) => {
    const col = invoicesColumns.find(c => c.key === key);
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
    <div className="overflow-auto flex-1">
      <table className="w-full text-left text-sm border-collapse table-fixed" style={{ minWidth: tableMinWidth }}>
        <colgroup>
          {invoicesColumns.map(col => (
            <col key={col.key} style={{ width: columnWidths[col.key] }} />
          ))}
        </colgroup>
        <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-gray-100/60">
          <tr className="border-b border-gray-200">
            {invoicesColumns.map(col => (
              <th
                key={col.key}
                className={cn('relative select-none overflow-hidden whitespace-nowrap', col.thClassName)}
              >
                {col.key === 'select' ? (
                  <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
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

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={invoicesColumns.length} className="p-8 text-center text-gray-500">
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
                <td className="p-3">
                  <span className="text-sm font-semibold text-emerald-700 truncate" title={row.contactName}>
                    {row.contactName}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm text-gray-600 truncate" title={row.emailAddress || '-'}>{row.emailAddress || '-'}</span>
                    <SendIcons count={row.emailIndicators} />
                  </div>
                </td>
                <td className="p-3">
                  {row.sentIndicator ? <Send className="h-4 w-4 text-sky-600" /> : <span className="text-gray-400">-</span>}
                </td>
                <td className="p-3 text-sm text-gray-700 truncate" title={row.reference}>
                  {row.reference}
                </td>
                <td className="p-3 text-sm text-gray-700">{row.paymentTermDays}</td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{row.createdAt}</td>
                <td className="p-3">
                  <Actor
                    name={row.createdBy.name}
                    initials={row.createdBy.initials}
                    tone={row.createdBy.kind === 'Systeem' ? 'system' : 'user'}
                  />
                </td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{row.updatedAt}</td>
                <td className="p-3">
                  <Actor
                    name={row.updatedBy.name}
                    initials={row.updatedBy.initials}
                    tone={row.updatedBy.kind === 'Systeem' ? 'system' : 'user'}
                  />
                </td>
                <td className="p-3 text-right">
                  <div className="inline-flex items-center gap-2 text-emerald-700">
                    <button type="button" className="p-1 hover:text-emerald-900" aria-label="Bekijken">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button type="button" className="p-1 hover:text-emerald-900" aria-label="Koppelen">
                      <LinkIcon className="h-4 w-4" />
                    </button>
                    <button type="button" className="p-1 hover:text-emerald-900" aria-label="Bewerken">
                      <SquarePen className="h-4 w-4" />
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
