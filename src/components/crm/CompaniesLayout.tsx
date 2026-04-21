import React, { useMemo, useRef, useState, useEffect } from 'react';
import { 
  Target, Settings, Columns3, SlidersHorizontal, AlignJustify, Maximize2, Download, Search, Plus, Archive, Edit, Info, Trash2
} from 'lucide-react';
import { crmService, Company } from '@/lib/crmService';
import { cn } from '@/lib/utils';
import { CompanyEditDialog } from './CRMEditDialogs';
import { toast } from 'sonner';

type CompaniesColumnKey =
  | 'select'
  | 'referentie'
  | 'bedrijfsnaam'
  | 'tags'
  | 'projecten'
  | 'telefoonnummer'
  | 'kvk'
  | 'primaireContactpersoon'
  | 'adres'
  | 'btw'
  | 'actions';

type CompaniesColumnDef = {
  key: CompaniesColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const companiesColumns: CompaniesColumnDef[] = [
  { key: 'select', width: 52, minWidth: 44, resizable: false, thClassName: 'p-3 pl-4 text-center' },
  { key: 'referentie', label: 'Referentie', width: 120, minWidth: 100, resizable: true, thClassName: 'p-3' },
  { key: 'bedrijfsnaam', label: 'Bedrijfsnaam', width: 240, minWidth: 160, resizable: true, thClassName: 'p-3' },
  { key: 'tags', label: 'Tags', width: 240, minWidth: 160, resizable: true, thClassName: 'p-3' },
  { key: 'projecten', label: 'Projecten', width: 110, minWidth: 90, resizable: true, thClassName: 'p-3' },
  { key: 'telefoonnummer', label: 'Telefoonnummer', width: 160, minWidth: 140, resizable: true, thClassName: 'p-3 whitespace-nowrap' },
  { key: 'kvk', label: 'KVK', width: 120, minWidth: 100, resizable: true, thClassName: 'p-3' },
  { key: 'primaireContactpersoon', label: 'Primaire contactpersoon', width: 250, minWidth: 180, resizable: true, thClassName: 'p-3 whitespace-nowrap' },
  { key: 'adres', label: 'Adres', width: 360, minWidth: 220, resizable: true, thClassName: 'p-3' },
  { key: 'btw', label: 'BTW', width: 160, minWidth: 130, resizable: true, thClassName: 'p-3' },
  { key: 'actions', width: 88, minWidth: 72, resizable: false, thClassName: 'p-3 w-14 sticky right-0 bg-white z-20' },
];

export function CompaniesLayout() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const [columnWidths, setColumnWidths] = useState<Record<CompaniesColumnKey, number>>(() => {
    return companiesColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<CompaniesColumnKey, number>);
  });
  const resizingRef = useRef<{
    key: CompaniesColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const tableMinWidth = useMemo(() => {
    return companiesColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const formatReference = (row: Company) => row.referenceNumber || (row.id ? row.id.slice(-6).toUpperCase() : '-');

  const renderTags = (tags?: string[]) => {
    if (!tags || tags.length === 0) return <span className="text-gray-300">-</span>;
    return (
      <div className="flex flex-wrap gap-1 max-w-[220px]">
        {tags.slice(0, 3).map((t) => (
          <span
            key={t}
            className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-tighter"
          >
            {t}
          </span>
        ))}
        {tags.length > 3 ? (
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">+{tags.length - 3}</span>
        ) : null}
      </div>
    );
  };

  const renderProjects = (count?: number) => {
    if (!count) return <span className="text-gray-300">-</span>;
    return <span className="text-[13px] font-semibold text-gray-700">{count}</span>;
  };

  const formatAddress = (row: Company) => {
    const base = row.address || '';
    const city = row.city || '';
    const combined = [base, city].filter(Boolean).join(', ');
    return combined || '-';
  };

  const filteredCompanies = useMemo(() => {
    if (!searchQuery) return companies;
    const q = searchQuery.toLowerCase();
    return companies.filter(c => 
      c.name?.toLowerCase().includes(q) || 
      c.email?.toLowerCase().includes(q) ||
      c.kvkNumber?.toLowerCase().includes(q)
    );
  }, [companies, searchQuery]);

  // Subscribe to real-time updates from Firebase
  useEffect(() => {
    const unsubscribe = crmService.subscribeToCompanies((fetched) => {
      setCompanies(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const startResize = (key: CompaniesColumnKey) => (e: React.PointerEvent) => {
    const col = companiesColumns.find(c => c.key === key);
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

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAdd = () => {
    setEditingCompany(null);
    setIsEditOpen(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Weet je zeker dat je dit bedrijf wilt verwijderen?")) {
      try {
        await crmService.deleteCompany(id);
        toast.success('Bedrijf verwijderd');
      } catch (err) {
        toast.error('Fout bij verwijderen');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative space-y-4 pt-2 pb-8">
      
      {/* ── Page Header ── */}
      <div className="flex items-center gap-3 px-6 pb-2 shrink-0">
        <Target className="h-6 w-6 text-purple-700 bg-purple-100 p-1 rounded" />
        <h1 className="text-xl font-bold text-gray-900">Bedrijvenlijst</h1>
      </div>

      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        
        {/* Top Tabs and Action Row */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-6 pb-1">
            <button className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-1 border-b-2 border-green-600">
              Alles <span className="bg-emerald-800 text-white text-[11px] px-2 py-0.5 rounded-full leading-none shrink-0 font-bold">{companies.length}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-medium text-sm rounded-md shadow-sm opacity-90 hover:opacity-100 transition-opacity"
            >
              <Plus className="h-4 w-4" /> Bedrijf Toevoegen
            </button>
            <button className="p-2 border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Columns3 className="h-4 w-4" /> Kolommen</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><AlignJustify className="h-4 w-4" /> Dichtheid</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Maximize2 className="h-4 w-4" /> Schaal</button>
            <button 
              className="flex items-center gap-1.5 hover:text-gray-900"
              onClick={() => crmService.exportToCSV(companies, 'bedrijven.csv')}
            >
              <Download className="h-4 w-4" /> Exporteren
            </button>
          </div>
          <div className="relative w-64 flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoeken..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50 w-full"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-auto flex-1">
          <table
            className="w-full text-left text-sm border-collapse table-fixed"
            style={{ minWidth: tableMinWidth }}
          >
            <colgroup>
              {companiesColumns.map(col => (
                <col key={col.key} style={{ width: columnWidths[col.key] }} />
              ))}
            </colgroup>
            <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-gray-100">
              <tr className="bg-gray-50/30 font-bold uppercase tracking-tighter text-gray-400 text-[11px]">
                {companiesColumns.map(col => (
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
              {isLoading ? (
                <tr>
                  <td colSpan={companiesColumns.length} className="p-20 text-center text-gray-400 italic">
                    Laden van bedrijven...
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                   <td colSpan={companiesColumns.length} className="p-20 text-center text-gray-400 italic">
                    Geen bedrijven gevonden.
                  </td>
                </tr>
              ) : filteredCompanies.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="p-3 pl-4 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 cursor-pointer" 
                      checked={selectedIds.includes(row.id!)}
                      onChange={() => toggleSelect(row.id!)}
                    />
                  </td>
                  <td className="p-3 text-[13px] text-gray-500 font-mono whitespace-nowrap">
                    {formatReference(row)}
                  </td>
                  <td 
                    className="p-3 text-[13px] font-bold text-emerald-800 hover:underline cursor-pointer truncate"
                    onClick={() => handleEdit(row)}
                  >
                    {row.name}
                  </td>
                  <td className="p-3">
                    {renderTags(row.tags)}
                  </td>
                  <td className="p-3">
                    {renderProjects(row.projectsCount)}
                  </td>
                  <td className="p-3 text-[13px] font-medium text-blue-600 whitespace-nowrap">
                    {row.phone || <span className="text-gray-300">-</span>}
                  </td>
                  <td className="p-3 text-[13px] text-gray-600 whitespace-nowrap">
                    {row.kvkNumber || <span className="text-gray-300">-</span>}
                  </td>
                  <td className="p-3 text-[13px] text-gray-600 truncate">
                    {row.contactPerson || <span className="text-gray-300">-</span>}
                  </td>
                  <td className="p-3 text-[13px] text-gray-600 truncate">
                    {formatAddress(row)}
                  </td>
                  <td className="p-3 text-[13px] text-gray-600 whitespace-nowrap">
                    {row.vatNumber || <span className="text-gray-300">-</span>}
                  </td>
                  <td className="p-3 text-right sticky right-0 bg-white/90 backdrop-blur-sm group-hover:bg-gray-50/90 transition-colors z-10">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="text-gray-400 hover:text-emerald-700 p-1 rounded hover:bg-gray-100 transition-colors"
                        onClick={() => handleEdit(row)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id!)}
                        className="text-gray-300 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
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

        {/* Footer */}
        <div className="bg-white border-t border-gray-100 p-3 shrink-0 flex items-center justify-end text-[12px] text-gray-500 font-medium">
           {filteredCompanies.length} bedrijven getoond van {companies.length} totaal
        </div>

      </div>
      
      <CompanyEditDialog 
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        company={editingCompany}
      />
    </div>
  );
}
