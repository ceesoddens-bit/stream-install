import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { bomItems, articles } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useResizableColumns } from '@/lib/useResizableColumns';
import {
  Columns3,
  Download,
  Filter,
  Settings,
  SlidersHorizontal,
  ZoomIn,
  Leaf
} from 'lucide-react';

type BomRow = {
  id: string;
  offerteNaam: string;
  projectCode: string;
  projectStatusLabel: string;
  planningBadgeLabel: string;
  planningDate1: string;
  planningDate2: string;
  planningDate3: string;
  artikel: string;
  sku: string;
  definitie: number;
  verkoopprijs: number;
  aankoopprijs: number;
};

const projectStatusBadgeClass = 'bg-purple-600 text-white border-purple-600';
const planningBadgeClass = 'bg-emerald-500 text-white border-emerald-500';

const formatNumberNl = (value: number) => new Intl.NumberFormat('nl-NL').format(value);

type BomColumnKey =
  | 'offerteNaam'
  | 'projectCode'
  | 'projectStatus'
  | 'planningBadge'
  | 'planningDate1'
  | 'planningDate2'
  | 'planningDate3'
  | 'artikel'
  | 'sku'
  | 'definitie'
  | 'verkoopprijs'
  | 'aankoopprijs';

type BomColumnDef = {
  key: BomColumnKey;
  label: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const bomColumns: BomColumnDef[] = [
  { key: 'offerteNaam', label: 'Offerte', width: 180, minWidth: 140, resizable: true, thClassName: 'p-3 px-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'projectCode', label: 'Projectnaam', width: 190, minWidth: 150, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'projectStatus', label: 'Projectstatus', width: 150, minWidth: 130, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'planningBadge', label: 'Planningstatus', width: 170, minWidth: 140, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'planningDate1', label: 'Planning 1', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'planningDate2', label: 'Planning 2', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'planningDate3', label: 'Planning 3', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'artikel', label: 'Artikel', width: 320, minWidth: 220, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'sku', label: 'SKU', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'definitie', label: 'Definitie', width: 120, minWidth: 100, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider text-right' },
  { key: 'verkoopprijs', label: 'Verkoopprijs', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider text-right' },
  { key: 'aankoopprijs', label: 'Aankoopprijs', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 pr-6 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider text-right' },
];

export function BOMTable() {
  const [query, setQuery] = useState('');
  const totalCount = 643;

  const { columnWidths, startResize, tableMinWidth } = useResizableColumns(bomColumns);

  const rows: BomRow[] = useMemo(() => {
    return bomItems.map((item, idx) => {
      const article = articles.find((a) => a.sku === item.sku);
      const verkoopprijs = article?.salePrice ?? 0;
      const aankoopprijs = article?.purchasePrice ?? 0;

      return {
        id: item.id,
        offerteNaam: 'naam',
        projectCode: `250000${2 + (idx % 3)}-Cer`,
        projectStatusLabel: 'Projectafg',
        planningBadgeLabel: `Installatie ${2 + (idx % 2)}`,
        planningDate1: item.plannedDate,
        planningDate2: item.plannedDate,
        planningDate3: item.plannedDate,
        artikel: item.articleName,
        sku: item.sku || '-',
        definitie: item.requiredQuantity,
        verkoopprijs,
        aankoopprijs,
      };
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      return (
        r.offerteNaam.toLowerCase().includes(q) ||
        r.projectCode.toLowerCase().includes(q) ||
        r.artikel.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q)
      );
    });
  }, [query, rows]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Leaf className="h-4 w-4 text-emerald-600" />
            </div>
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">BOM-lijst</h2>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-bold shrink-0"
            >
              Alles
              <span className="inline-flex items-center justify-center min-w-7 h-6 px-2 rounded-full bg-emerald-600 text-white text-xs font-extrabold">
                {formatNumberNl(totalCount)}
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
            <div className="relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Zoeken..."
                className="h-9 w-56 bg-gray-50 border-gray-200 text-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-900">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-left border-collapse table-fixed" style={{ minWidth: tableMinWidth }}>
          <colgroup>
            {bomColumns.map(col => (
              <col key={col.key} style={{ width: columnWidths[col.key] }} />
            ))}
          </colgroup>
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200">
              {bomColumns.map(col => (
                <th
                  key={col.key}
                  className={cn('relative select-none overflow-hidden whitespace-nowrap', col.thClassName)}
                >
                  <span className="truncate block">{col.label}</span>
                  {col.resizable ? (
                    <div
                      onPointerDown={startResize(col.key)}
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize group"
                      role="separator"
                      aria-orientation="vertical"
                      aria-label={`Resize column ${col.label}`}
                    >
                      <div className="absolute right-0 top-0 h-full w-px bg-transparent group-hover:bg-gray-300" />
                    </div>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-emerald-50/20 transition-colors">
                <td className="p-3 px-4 text-sm font-medium text-gray-900">{row.offerteNaam}</td>
                <td className="p-3 text-sm text-emerald-700 font-semibold">{row.projectCode}</td>
                <td className="p-3">
                  <Badge variant="outline" className={cn('text-[10px] font-extrabold px-2 py-0.5 rounded-full', projectStatusBadgeClass)}>
                    {row.projectStatusLabel}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge variant="outline" className={cn('text-[10px] font-extrabold px-2 py-0.5 rounded-full', planningBadgeClass)}>
                    {row.planningBadgeLabel}
                  </Badge>
                </td>
                <td className="p-3 text-sm text-gray-900">{row.planningDate1}</td>
                <td className="p-3 text-sm text-gray-900">{row.planningDate2}</td>
                <td className="p-3 text-sm text-gray-900">{row.planningDate3}</td>
                <td className="p-3 text-sm text-gray-900 truncate" title={row.artikel}>{row.artikel}</td>
                <td className="p-3 font-mono text-xs text-gray-600">{row.sku}</td>
                <td className="p-3 text-sm text-gray-900 text-right">{formatNumberNl(row.definitie)}</td>
                <td className="p-3 text-sm text-gray-900 text-right">{formatNumberNl(row.verkoopprijs)}</td>
                <td className="p-3 pr-6 text-sm text-gray-900 text-right">{formatNumberNl(row.aankoopprijs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-end gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Regels per pagina:</span>
          <span className="text-gray-800 font-bold">25</span>
        </div>
        <span className="text-gray-800 font-semibold">1–25 of {formatNumberNl(totalCount)}</span>
        <div className="flex items-center gap-2">
          <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50">
            ‹
          </button>
          <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
