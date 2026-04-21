import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  Hourglass,
  Settings,
  Columns3,
  SlidersHorizontal,
  AlignJustify,
  Maximize2,
  Download,
  Search,
  Edit,
  Wrench,
  Plus,
  Trash2,
  UserRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { planningService, PlanningEntry } from '@/lib/planningService';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function PlanningListLayout() {
  const [entries, setEntries] = useState<PlanningEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  type ColumnId =
    | 'type'
    | 'date'
    | 'added'
    | 'status'
    | 'accountManager'
    | 'project'
    | 'contact'
    | 'mobile'
    | 'createdAt'
    | 'createdBy';

  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnId, boolean>>({
    type: true,
    date: true,
    added: true,
    status: true,
    accountManager: true,
    project: true,
    contact: true,
    mobile: true,
    createdAt: true,
    createdBy: true,
  });

  const [columnWidths, setColumnWidths] = useState<Record<ColumnId, number>>({
    type: 140,
    date: 240,
    added: 120,
    status: 110,
    accountManager: 190,
    project: 260,
    contact: 190,
    mobile: 150,
    createdAt: 170,
    createdBy: 190,
  });
  const resizingRef = useRef<{
    key: ColumnId;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = planningService.subscribeToPlanning((fetched) => {
      setEntries(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);


  const handleDelete = async (id: string) => {
    if (window.confirm("Afspraak verwijderen?")) {
      await planningService.deletePlanningEntry(id);
    }
  };

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'Installatie': return 'bg-purple-500 text-white';
      case 'Onderhoud': return 'bg-cyan-400 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const formatDateRange = (row: PlanningEntry) => {
    const date = new Date(row.date);
    const datePart = date.toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const weekday = date.toLocaleDateString('nl-NL', { weekday: 'short' });
    return `${datePart} ${weekday} ${row.startTime} – ${row.endTime}`;
  };

  const formatTimestamp = (row: PlanningEntry) => {
    const d = row.createdAt?.toDate();
    if (!d) return '-';
    return d.toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns = [
    {
      id: 'type' as const,
      label: 'Type',
      width: 140,
      minWidth: 120,
      headerClassName: 'p-3 font-semibold text-gray-700',
      cellClassName: 'p-3',
      render: (row: PlanningEntry) => (
        <span
          className={cn(
            'text-[10px] font-bold px-2 py-0.5 rounded shadow-sm opacity-90 uppercase tracking-tighter',
            getTypeStyle(row.type)
          )}
        >
          {row.type}
        </span>
      ),
    },
    {
      id: 'date' as const,
      label: 'Datum',
      width: 240,
      minWidth: 200,
      headerClassName: 'p-3 font-semibold text-gray-700',
      cellClassName: 'p-3 text-xs font-semibold text-gray-900 font-mono',
      render: (row: PlanningEntry) => formatDateRange(row),
    },
    {
      id: 'added' as const,
      label: 'Toegewezen',
      width: 120,
      minWidth: 100,
      headerClassName: 'p-3 font-semibold text-gray-700 text-center',
      cellClassName: 'p-3 text-center text-gray-400',
      render: (row: PlanningEntry) => (
        <div className="flex items-center justify-center">
          <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center">
            <UserRound className="h-4 w-4 text-gray-500" />
          </div>
          <span className="sr-only">{row.technician}</span>
        </div>
      ),
    },
    {
      id: 'status' as const,
      label: 'Status',
      width: 110,
      minWidth: 90,
      headerClassName: 'p-3 font-semibold text-gray-700 text-center',
      cellClassName: 'p-3 text-center',
      render: () => <Wrench className="h-4 w-4 inline-block text-blue-600" />,
    },
    {
      id: 'accountManager' as const,
      label: 'Accountmanager',
      width: 190,
      minWidth: 150,
      headerClassName: 'p-3 font-semibold text-gray-700',
      cellClassName: 'p-3 text-xs',
      render: (row: PlanningEntry) => row.accountManager ?? '-',
    },
    {
      id: 'project' as const,
      label: 'Project',
      width: 260,
      minWidth: 200,
      headerClassName: 'p-3 font-semibold text-gray-700',
      cellClassName: 'p-3 text-xs font-semibold text-emerald-600 hover:underline cursor-pointer truncate',
      render: (row: PlanningEntry) => `${row.projectId} - ${row.projectName}`,
    },
    {
      id: 'contact' as const,
      label: 'Contact',
      width: 190,
      minWidth: 150,
      headerClassName: 'p-3 font-semibold text-gray-700',
      cellClassName: 'p-3 text-xs font-semibold text-emerald-600 hover:underline cursor-pointer truncate',
      render: (row: PlanningEntry) => row.client,
    },
    {
      id: 'mobile' as const,
      label: 'Mobiel nr',
      width: 150,
      minWidth: 130,
      headerClassName: 'p-3 font-semibold text-gray-700',
      cellClassName: 'p-3 text-xs text-gray-700',
      render: (row: PlanningEntry) => row.contactMobile ?? '-',
    },
    {
      id: 'createdAt' as const,
      label: 'Gemaakt op',
      width: 170,
      minWidth: 150,
      headerClassName: 'p-3 font-semibold text-gray-700',
      cellClassName: 'p-3 text-xs text-gray-500',
      render: (row: PlanningEntry) => formatTimestamp(row),
    },
    {
      id: 'createdBy' as const,
      label: 'Gemaakt door',
      width: 190,
      minWidth: 160,
      headerClassName: 'p-3 font-semibold text-gray-700',
      cellClassName: 'p-3 text-xs text-gray-700',
      render: (row: PlanningEntry) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 bg-gray-200 rounded-full" />
          <span className="truncate">{row.createdBy ?? '—'}</span>
        </div>
      ),
    },
  ];

  const orderedVisibleColumns = columns.filter((c) => visibleColumns[c.id]);

  const tableColSpan = 2 + orderedVisibleColumns.length;

  const tableMinWidth = useMemo(() => {
    const selectWidth = 52;
    const actionsWidth = 72;
    const colsWidth = orderedVisibleColumns.reduce((sum, col) => {
      return sum + (columnWidths[col.id] ?? col.width);
    }, 0);
    return selectWidth + colsWidth + actionsWidth;
  }, [columnWidths, orderedVisibleColumns]);

  const startResize = (key: ColumnId) => (e: React.PointerEvent) => {
    const col = columns.find(c => c.id === key);
    if (!col) return;
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
    <div className="flex flex-col h-full bg-slate-50 relative space-y-4 pt-2 pb-8">
      
      {/* ── Page Header Mimicking Screenshot ── */}
      <div className="flex items-center gap-3 px-6 pb-2 shrink-0">
        <Hourglass className="h-6 w-6 text-emerald-800 bg-emerald-100 p-1 rounded" />
        <h1 className="text-xl font-bold text-gray-900">Planningsregels</h1>
      </div>

      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        
        {/* Top Tabs and Date Row */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 gap-4 shrink-0">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <button className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-1 border-b-2 border-green-600">
              Alles <span className="bg-emerald-800 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">{entries.length}</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 pb-1 border-b-2 border-transparent">Herplannen <span className="bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">0</span></button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 pb-1 border-b-2 border-transparent">Open <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">{entries.filter(e => e.status === 'Ingepland').length}</span></button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 pb-1 border-b-2 border-transparent">Afgewezen <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">0</span></button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 pb-1 border-b-2 border-transparent">Concept <span className="bg-gray-400 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">0</span></button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 pb-1 border-b-2 border-transparent">Voltooid <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">{entries.filter(e => e.status === 'Afgerond').length}</span></button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 pb-1 border-b-2 border-transparent">Gearchiveerd <span className="bg-gray-600 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">0</span></button>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
                className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-medium text-xs rounded-md shadow-sm hover:bg-emerald-700 transition-all"
              >
              <Plus className="h-4 w-4" /> Afspraak Maken
            </button>
            <button className="p-2 border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50">
              <Settings className="h-4 w-4" />
            </button>
            <div className="hidden md:flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white">
              <span>26-03-2026 – 27-03-2026</span>
            </div>
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Zoeken..."
                className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50 w-full"
              />
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 hover:text-gray-900 outline-none">
                <Columns3 className="h-4 w-4" /> Kolommen
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Kolommen</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={visibleColumns[col.id]}
                    onCheckedChange={(checked) =>
                      setVisibleColumns((prev) => ({
                        ...prev,
                        [col.id]: Boolean(checked),
                      }))
                    }
                  >
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><AlignJustify className="h-4 w-4" /> Dichtheid</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Maximize2 className="h-4 w-4" /> Schaal</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Download className="h-4 w-4" /> Exporteren</button>
          </div>
          <div />
        </div>

        {/* Data Table */}
        <div className="overflow-auto flex-1">
          <table
            className="w-full text-left text-sm border-collapse table-fixed"
            style={{ minWidth: tableMinWidth }}
          >
            <colgroup>
              <col style={{ width: 52 }} />
              {orderedVisibleColumns.map(col => (
                <col key={col.id} style={{ width: columnWidths[col.id] ?? col.width }} />
              ))}
              <col style={{ width: 72 }} />
            </colgroup>
            <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-gray-100/50">
              <tr className="border-b border-gray-200 bg-gray-50/20">
                <th className="p-3 w-10 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                </th>
                {orderedVisibleColumns.map((col) => (
                  <th
                    key={col.id}
                    className={cn(
                      'relative select-none overflow-hidden whitespace-nowrap',
                      col.headerClassName
                    )}
                  >
                    <span className="truncate block">{col.label}</span>
                    <div
                      onPointerDown={startResize(col.id)}
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize group"
                      role="separator"
                      aria-orientation="vertical"
                      aria-label={`Resize column ${col.label}`}
                    >
                      <div className="absolute right-0 top-0 h-full w-px bg-transparent group-hover:bg-gray-300" />
                    </div>
                  </th>
                ))}
                <th className="p-3 w-14"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={tableColSpan} className="p-20 text-center text-gray-400 italic">
                    Bezig met laden...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={tableColSpan} className="p-20 text-center text-gray-400 italic">
                    Geen afspraken gevonden.
                  </td>
                </tr>
              ) : entries.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 group transition-colors">
                  <td className="p-3 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  </td>
                  {orderedVisibleColumns.map((col) => (
                    <td key={col.id} className={col.cellClassName}>
                      {col.render(row)}
                    </td>
                  ))}
                  <td className="p-3 text-right">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-emerald-600 hover:text-emerald-800 p-1"><Edit className="h-4 w-4" /></button>
                      <button 
                        onClick={() => handleDelete(row.id!)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border-t border-gray-100 p-3 shrink-0 flex items-center justify-end text-[12px] text-gray-500 font-medium">
           {entries.length} regels in totaal
        </div>

      </div>
    </div>
  );
}
