import React, { useMemo, useState, useEffect, useRef } from 'react';
import { 
  Layers, Settings, Columns3, SlidersHorizontal, AlignJustify, Maximize2, Download, Search, Plus, Archive, Edit, Info, ChevronDown, MoreHorizontal, CheckCircle2, FileText, Send, CheckSquare, MessageSquare, Check, X, UserCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { financeService } from '@/lib/financeService';
import { Quote } from '@/types';
import { QuoteEditDialog } from './FinanceEditDialogs';
import { toast } from 'sonner';

const eur = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });

const formatEur = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return '-';
  return eur.format(amount).replace(/\u00A0/g, ' ');
};

type QuotesColumnKey =
  | 'select'
  | 'expand'
  | 'id'
  | 'naam'
  | 'status'
  | 'geaccepteerd'
  | 'projectStatus'
  | 'project'
  | 'contact'
  | 'inBehandeling'
  | 'gefactureerd'
  | 'totaalOfferte'
  | 'totaal'
  | 'statusWijziging'
  | 'deadline'
  | 'handtekeningDeadline'
  | 'mail'
  | 'verstuurdOp'
  | 'geopendDoorKlant'
  | 'kerenGeopendDoorKlant'
  | 'reden'
  | 'gemaaktOp'
  | 'gemaaktDoor'
  | 'actions';

type QuotesColumnDef = {
  key: QuotesColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const quotesColumns: QuotesColumnDef[] = [
  { key: 'select', width: 52, minWidth: 44, resizable: false, thClassName: 'p-3 pl-4 text-center' },
  { key: 'expand', width: 40, minWidth: 36, resizable: false, thClassName: 'p-3 text-center' },
  { key: 'id', label: 'id', width: 70, minWidth: 60, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'naam', label: 'Naam', width: 170, minWidth: 120, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'status', label: 'Status', width: 140, minWidth: 110, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'geaccepteerd', label: 'Geaccepteerd', width: 130, minWidth: 110, resizable: true, thClassName: 'p-3 font-semibold text-gray-800 text-center' },
  { key: 'projectStatus', label: 'Project status', width: 170, minWidth: 140, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'project', label: 'Project', width: 220, minWidth: 150, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'contact', label: 'Contact', width: 190, minWidth: 140, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'inBehandeling', label: 'In behandeling', width: 150, minWidth: 130, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'gefactureerd', label: 'Gefactureerd', width: 130, minWidth: 120, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'totaalOfferte', label: 'Totaal offerte', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 font-semibold text-gray-800 text-right' },
  { key: 'totaal', label: 'Totaal', width: 120, minWidth: 100, resizable: true, thClassName: 'p-3 font-semibold text-gray-800 text-right' },
  { key: 'statusWijziging', label: 'Status wijziging', width: 160, minWidth: 140, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'deadline', label: 'Deadline', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'handtekeningDeadline', label: 'Handtekening deadline', width: 190, minWidth: 160, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'mail', label: 'Mail', width: 80, minWidth: 70, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'verstuurdOp', label: 'Verstuurd op', width: 150, minWidth: 130, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'geopendDoorKlant', label: 'Geopend door klant', width: 180, minWidth: 150, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'kerenGeopendDoorKlant', label: 'Keren geopend door klant', width: 210, minWidth: 170, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'reden', label: 'Reden', width: 120, minWidth: 100, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'gemaaktOp', label: 'Gemaakt op', width: 170, minWidth: 140, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'gemaaktDoor', label: 'Gemaakt door', width: 190, minWidth: 150, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'actions', width: 160, minWidth: 140, resizable: false, thClassName: 'p-3 sticky right-0 bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]' },
];

import { useTenant } from '@/lib/tenantContext';
import { pdfService } from '@/lib/pdfService';
import { automationService } from '@/lib/automationService';
import { QuoteTemplate } from '../pdf/QuoteTemplate';

export function QuotesLayout() {
  const { tenant } = useTenant();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const unsub = financeService.subscribeToQuotes((fetched) => {
      setQuotes(fetched);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [columnWidths, setColumnWidths] = useState<Record<QuotesColumnKey, number>>(() => {
    return quotesColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<QuotesColumnKey, number>);
  });

  const handleAdd = () => {
    setEditingQuote(null);
    setIsEditOpen(true);
  };

  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Weet je zeker dat je deze offerte wilt verwijderen?")) {
      try {
        await financeService.deleteQuote(id);
        toast.success('Offerte verwijderd');
      } catch (err) {
        toast.error('Fout bij verwijderen');
      }
    }
  };

  const handleDownloadPDF = async (quote: Quote) => {
    if (!tenant) return;
    const toastId = toast.loading('PDF genereren...');
    try {
      const blob = await pdfService.generateBlob(<QuoteTemplate quote={quote} tenant={tenant} />);
      pdfService.downloadInBrowser(blob, `Offerte-${quote.quoteNumber || quote.id}.pdf`);
      toast.success('PDF gedownload', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Fout bij genereren PDF', { id: toastId });
    }
  };

  const handleSendEmail = async (quote: Quote) => {
    if (!tenant) return;
    const email = window.prompt("Stuur offerte naar:", (quote as any).contactEmail || "");
    if (!email) return;

    const toastId = toast.loading('Offerte verzenden...');
    try {
      await automationService.sendQuoteEmail(quote, tenant, email);
      toast.success('Offerte in de wachtrij geplaatst voor verzending', { id: toastId });
      
      // Update status naar 'Verstuurd' indien nog Concept
      if (quote.status === 'Concept') {
        await financeService.updateQuote(quote.id!, { 
          status: 'Verstuurd',
          sentDate: new Date().toLocaleDateString('nl-NL')
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Fout bij verzenden email', { id: toastId });
    }
  };

  const tableMinWidth = useMemo(() => {
    return quotesColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const resizingRef = useRef<{
    key: QuotesColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const startResize = (key: QuotesColumnKey) => (e: React.PointerEvent) => {
    const col = quotesColumns.find(c => c.key === key);
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
    <div className="flex flex-col h-full bg-slate-50 relative space-y-4 pt-2 pb-8">
      
      {/* ── Page Header Mimicking Screenshot ── */}
      <div className="flex items-center gap-3 px-6 pb-2 shrink-0">
        <Layers className="h-6 w-6 text-cyan-600 bg-cyan-100 p-1 rounded transform rotate-90" />
        <h1 className="text-xl font-bold text-gray-900">Offertelijst</h1>
      </div>

      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        
        {/* Top Tabs and Action Row */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-6 pb-1 overflow-x-auto scrollbar-hide">
            <button className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-1 border-b-2 border-green-600 shrink-0">
              Alles <span className="bg-emerald-800 text-white text-[10px] px-1.5 py-0.5 rounded-sm leading-none shrink-0 font-bold">{quotes.length}</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 border-b-2 border-transparent hover:border-gray-200 shrink-0">
              Rejected <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm leading-none shrink-0 font-bold">{quotes.filter(q => q.status === 'Rejected').length}</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 border-b-2 border-transparent hover:border-gray-200 shrink-0">
              Geaccepteerd <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm leading-none shrink-0 font-bold">{quotes.filter(q => q.status === 'Geaccepteerd').length}</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 border-b-2 border-transparent hover:border-gray-200 shrink-0">
              Concept <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm leading-none shrink-0 font-bold">{quotes.filter(q => q.status === 'Concept').length}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-medium text-sm rounded-md shadow-sm opacity-90 hover:opacity-100 transition-opacity"
            >
              <Plus className="h-4 w-4" /> Nieuwe Offerte
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
            <button className="flex items-center gap-1.5 hover:text-gray-900 text-gray-400">
              <FileText className="h-4 w-4" />
              Bulk
            </button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Download className="h-4 w-4" /> Exporteren</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Edit className="h-4 w-4" /> Bewerken</button>
          </div>
          <div className="relative w-64 flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoeken..."
              className="pl-9 pr-8 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50 w-full"
            />
            <Info className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-800" />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-auto flex-1">
          <table
            className="w-full text-left text-sm border-collapse table-fixed"
            style={{ minWidth: tableMinWidth }}
          >
            <colgroup>
              {quotesColumns.map(col => (
                <col key={col.key} style={{ width: columnWidths[col.key] }} />
              ))}
            </colgroup>
            <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-gray-100/50">
              <tr className="border-b border-gray-200">
                {quotesColumns.map(col => (
                  <th
                    key={col.key}
                    className={cn(
                      'relative select-none overflow-hidden whitespace-nowrap',
                      col.thClassName
                    )}
                  >
                    {col.key === 'select' ? (
                      <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4" />
                    ) : col.key === 'expand' ? null : col.key === 'actions' ? null : col.key === 'gemaaktOp' ? (
                      <button className="w-full flex items-center gap-1 cursor-pointer">
                        <span className="truncate">{col.label}</span>
                        <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                      </button>
                    ) : (
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
                <tr><td colSpan={quotesColumns.length} className="p-20 text-center text-gray-400 italic">Laden...</td></tr>
              ) : quotes.length === 0 ? (
                <tr><td colSpan={quotesColumns.length} className="p-20 text-center text-gray-400 italic">Geen offertes gevonden. Klik op "Nieuwe Offerte" om te starten.</td></tr>
              ) : quotes.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors group">
                  <td className="p-3 pl-4 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4 cursor-pointer" 
                      onChange={() => toggleSelect(row.id!)}
                      checked={selectedIds.includes(row.id!)}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <ChevronDown className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-700" />
                  </td>
                  <td className="p-3 text-[13px] font-semibold text-emerald-600 hover:underline cursor-pointer">
                    {row.id?.slice(-5)}
                  </td>
                  <td className="p-3 text-[13px] font-semibold text-emerald-600 hover:underline cursor-pointer truncate">
                    {row.title}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    <span className={cn(
                      "text-[11px] font-bold px-2 py-0.5 border border-transparent rounded-sm",
                      row.status === 'Geaccepteerd' ? "bg-green-100 text-green-800" :
                      row.status === 'Concept' ? "bg-orange-100 text-orange-800" :
                      row.status === 'Rejected' ? "bg-red-100 text-red-800" :
                      "bg-blue-100 text-blue-800"
                    )}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {row.status === 'Geaccepteerd' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                    ) : (
                      <div className="h-4 w-4 bg-green-700 rounded-full text-white flex items-center justify-center mx-auto shadow-sm">
                        <MoreHorizontal className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    {row.projectStatus ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 border rounded-sm bg-green-200 text-green-900">
                        {row.projectStatus}
                      </span>
                    ) : (
                       '-' 
                    )}
                  </td>
                  <td className="p-3 text-[13px] font-semibold text-emerald-600 hover:underline cursor-pointer truncate" title={row.projectName}>
                    {row.projectName}
                  </td>
                  <td className="p-3 text-[13px] font-semibold text-emerald-600 hover:underline cursor-pointer truncate" title={row.contactName}>
                    {row.contactName}
                  </td>
                  <td className="p-3 text-[13px] text-gray-600">0%</td>
                  <td className="p-3 text-[13px] text-gray-600">0%</td>
                  <td className="p-3 text-[13px] text-gray-900 font-medium">
                    <span className="block truncate text-right tabular-nums">
                      {formatEur(row.totalAmount)}
                    </span>
                  </td>
                  <td className="p-3 text-[13px] text-gray-900 font-medium">
                    <span className="block truncate text-right tabular-nums">
                      € 0,00
                    </span>
                  </td>
                  <td className="p-3 text-[13px] text-gray-700 whitespace-nowrap truncate">-</td>
                  <td className="p-3 text-[13px] text-gray-700 whitespace-nowrap">-</td>
                  <td className="p-3 text-[13px] text-gray-700 whitespace-nowrap">-</td>
                  <td className="p-3 text-[13px] text-gray-600">
                    <Check className="h-4 w-4 text-gray-600" />
                  </td>
                  <td className="p-3 text-[13px] text-gray-700 whitespace-nowrap">
                    {row.sentDate || '-'}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700 whitespace-nowrap">-</td>
                  <td className="p-3 text-[13px] text-gray-700 text-right pr-6">
                    {row.openedCount || 0}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">-</td>
                  <td className="p-3 text-[13px] text-gray-700 whitespace-nowrap">
                      {((row as any).createdAt || (row as any).date)?.toDate?.().toLocaleDateString() || '-'}
                    </td>
                  <td className="p-3 text-[13px] text-gray-600">
                    <div className="flex items-center gap-2 min-w-0">
                      <UserCircle2 className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate">{row.createdBy || 'Gebruiker'}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right sticky right-0 bg-white/95 backdrop-blur-sm group-hover:bg-gray-50/95 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.02)] transition-colors">
                     <div className="flex items-center justify-end gap-2 text-emerald-600">
                      <button onClick={() => handleEdit(row)} title="Bewerken" className="hover:text-emerald-800 p-0.5"><Edit className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDelete(row.id!)} title="Verwijderen" className="hover:text-red-600 p-0.5"><Archive className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDownloadPDF(row)} title="Download PDF" className="hover:text-emerald-800 p-0.5"><Download className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleSendEmail(row)} className="hover:text-emerald-800 p-0.5 text-emerald-600" title="Verzenden"><Send className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info area */}
        <div className="bg-white border-t border-gray-200 p-4 shrink-0 flex items-center justify-end">
          <div className="flex items-center gap-6 text-[13px] font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <span>Regels per pagina:</span>
              <select className="border-none outline-none font-semibold text-gray-800 focus:ring-0 bg-transparent cursor-pointer">
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
            <span>{quotes.length} offertes totaal</span>
          </div>
        </div>

      </div>

      <QuoteEditDialog 
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        quote={editingQuote}
      />
    </div>
  );
}
