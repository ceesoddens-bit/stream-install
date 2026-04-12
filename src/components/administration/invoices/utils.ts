import { InvoiceRow, InvoiceStatus, StatusFilter, statusFilters } from './types';

export function toneClasses(tone: (typeof statusFilters)[number]['tone']) {
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

export function formatCurrency(value: number) {
  return value.toLocaleString('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  });
}

export function statusBadge(status: InvoiceStatus) {
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

export function computeInvoiceCounts(rows: InvoiceRow[]) {
  return rows.reduce<Record<'all' | InvoiceStatus, number>>(
    (acc, r) => {
      acc.all += 1;
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    },
    {
      all: 0,
      Concept: 0,
      'In Afwachting': 0,
      Geweigerd: 0,
      Goedgekeurd: 0,
      Afgerond: 0,
      Creditfactuur: 0,
    }
  );
}

export function filterInvoices({
  rows,
  statusFilter,
  query,
}: {
  rows: InvoiceRow[];
  statusFilter: StatusFilter;
  query: string;
}) {
  const q = query.trim().toLowerCase();
  return rows
    .filter((r) => (statusFilter === 'Alles' ? true : r.status === statusFilter))
    .filter((r) => {
      if (!q) return true;
      const haystack = [String(r.code), r.project, r.bedrijfsnaam, r.offerte?.label ?? ''].join(' ').toLowerCase();
      return haystack.includes(q);
    });
}

