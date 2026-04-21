import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Columns3, SlidersHorizontal, AlignJustify, Download, Search, Calendar as CalendarIcon } from 'lucide-react';
import { financeService } from '../../lib/financeService';
import { Quote } from '../../types';

type SalesTotalColumnKey =
  | 'accountManager'
  | 'leads'
  | 'marge'
  | 'marginPerc'
  | 'verkoopmarge'
  | 'inkoopprijs'
  | 'verkoopprijs';

type SalesOfferColumnKey =
  | 'id'
  | 'project'
  | 'accountManager'
  | 'marge'
  | 'marginPerc'
  | 'verkoopmarge'
  | 'inkoopprijs'
  | 'verkoopprijs'
  | 'datum';

type SalesColumnDef<K extends string> = {
  key: K;
  label: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const salesTotalColumns: SalesColumnDef<SalesTotalColumnKey>[] = [
  { key: 'accountManager', label: 'Account manager', width: 220, minWidth: 160, resizable: true, thClassName: 'p-3 font-semibold text-gray-700' },
  { key: 'leads', label: '# Leads', width: 90, minWidth: 80, resizable: true, thClassName: 'p-3 font-semibold text-gray-700 whitespace-nowrap' },
  { key: 'marge', label: 'Marge', width: 120, minWidth: 110, resizable: true, thClassName: 'p-3 font-semibold text-gray-700 text-right' },
  { key: 'marginPerc', label: 'Margin %', width: 110, minWidth: 100, resizable: true, thClassName: 'p-3 font-semibold text-gray-700 text-right whitespace-nowrap' },
  { key: 'verkoopmarge', label: 'Verkoopmarge', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 font-semibold text-gray-700 text-right whitespace-nowrap' },
  { key: 'inkoopprijs', label: 'Inkoopprijs', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 font-semibold text-gray-700 text-right' },
  { key: 'verkoopprijs', label: 'Verkoopprijs', width: 150, minWidth: 130, resizable: true, thClassName: 'p-3 font-semibold text-gray-700 text-right' },
];

const salesOfferColumns: SalesColumnDef<SalesOfferColumnKey>[] = [
  { key: 'id', label: 'Id', width: 70, minWidth: 60, resizable: true, thClassName: 'p-3 font-semibold text-gray-700' },
  { key: 'project', label: 'Project', width: 240, minWidth: 160, resizable: true, thClassName: 'p-3 font-semibold text-gray-700' },
  { key: 'accountManager', label: 'Accountmanager', width: 220, minWidth: 160, resizable: true, thClassName: 'p-3 font-semibold text-gray-700' },
  { key: 'marge', label: 'Marge', width: 120, minWidth: 110, resizable: true, thClassName: 'p-3 font-semibold text-gray-700 text-right' },
  { key: 'marginPerc', label: 'Margin %', width: 110, minWidth: 100, resizable: true, thClassName: 'p-3 font-semibold text-gray-700 text-right whitespace-nowrap' },
  { key: 'verkoopmarge', label: 'Verkoopmarge', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 font-semibold text-gray-700 text-right whitespace-nowrap' },
  { key: 'inkoopprijs', label: 'Inkoopprijs', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 font-semibold text-gray-700 text-right' },
  { key: 'verkoopprijs', label: 'Verkoopprijs', width: 150, minWidth: 130, resizable: true, thClassName: 'p-3 font-semibold text-gray-700 text-right' },
  { key: 'datum', label: 'Geaccepteerd', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 font-semibold text-gray-700 text-right whitespace-nowrap' },
];

export function SalesLayout() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activeSegment, setActiveSegment] = useState<'Alles' | 'Residentieel' | 'Commercieel'>('Alles');

  useEffect(() => {
    const unsubscribe = financeService.subscribeToQuotes((data) => {
      setQuotes(data);
    });
    return () => unsubscribe();
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(val);

  const { totaalData, perOfferteData, totals } = useMemo(() => {
    // Only accepted quotes (or we could show all, but usually sales dashboard shows sold)
    const filteredQuotes = quotes.filter(q => q.status === 'Geaccepteerd');
    
    // In real app, segment filter would check q.clientType if it existed.
    // For now we don't have clientType on Quote, so segment filter might just show all unless we map it.

    const offData = filteredQuotes.map(q => {
      const verkoopprijs = q.amount || 0;
      const inkoopprijs = verkoopprijs * 0.6; // mocked 60% cost for now
      const marge = verkoopprijs - inkoopprijs;
      const marginPerc = verkoopprijs > 0 ? ((marge / verkoopprijs) * 100).toFixed(2) : '0.00';
      const verkoopmarge = verkoopprijs > 0 ? ((marge / inkoopprijs) * 100).toFixed(2) : '0.00';

      return {
        id: q.quoteNumber || q.id.slice(0, 5),
        project: q.projectName || 'Onbekend project',
        manager: q.contactName || 'Onbekende manager',
        margeVal: marge,
        inkoopVal: inkoopprijs,
        verkoopVal: verkoopprijs,
        marge: formatCurrency(marge),
        marginPerc,
        verkoopmarge,
        inkoopprijs: formatCurrency(inkoopprijs),
        verkoopprijs: formatCurrency(verkoopprijs),
        datum: q.date || q.sentDate || 'Onbekend'
      };
    });

    const grouped = offData.reduce((acc, curr) => {
      if (!acc[curr.manager]) {
        acc[curr.manager] = { manager: curr.manager, leads: 0, margeVal: 0, inkoopVal: 0, verkoopVal: 0 };
      }
      acc[curr.manager].leads += 1;
      acc[curr.manager].margeVal += curr.margeVal;
      acc[curr.manager].inkoopVal += curr.inkoopVal;
      acc[curr.manager].verkoopVal += curr.verkoopVal;
      return acc;
    }, {} as Record<string, { manager: string; leads: number; margeVal: number; inkoopVal: number; verkoopVal: number; }>);

    const totData = Object.values(grouped).map(g => {
      const marginPerc = g.verkoopVal > 0 ? ((g.margeVal / g.verkoopVal) * 100).toFixed(2) : '0.00';
      const verkoopmarge = g.verkoopVal > 0 ? ((g.margeVal / g.inkoopVal) * 100).toFixed(2) : '0.00';
      return {
        manager: g.manager,
        leads: g.leads,
        marge: formatCurrency(g.margeVal),
        marginPerc,
        verkoopmarge,
        inkoopprijs: formatCurrency(g.inkoopVal),
        verkoopprijs: formatCurrency(g.verkoopVal)
      };
    });

    const totalsObj = {
      leads: offData.length,
      margeVal: offData.reduce((sum, q) => sum + q.margeVal, 0),
      inkoopVal: offData.reduce((sum, q) => sum + q.inkoopVal, 0),
      verkoopVal: offData.reduce((sum, q) => sum + q.verkoopVal, 0),
    };

    const overallMarginPerc = totalsObj.verkoopVal > 0 ? ((totalsObj.margeVal / totalsObj.verkoopVal) * 100).toFixed(2) : '0.00';
    const overallVerkoopmarge = totalsObj.inkoopVal > 0 ? ((totalsObj.margeVal / totalsObj.inkoopVal) * 100).toFixed(2) : '0.00';

    return { 
      totaalData: totData, 
      perOfferteData: offData,
      totals: {
        ...totalsObj,
        marginPerc: overallMarginPerc,
        verkoopmarge: overallVerkoopmarge
      }
    };
  }, [quotes, activeSegment]);

  const [totalColumnWidths, setTotalColumnWidths] = useState<Record<SalesTotalColumnKey, number>>(() => {
    return salesTotalColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<SalesTotalColumnKey, number>);
  });
  const [offerColumnWidths, setOfferColumnWidths] = useState<Record<SalesOfferColumnKey, number>>(() => {
    return salesOfferColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<SalesOfferColumnKey, number>);
  });
  const totalResizingRef = useRef<{
    key: SalesTotalColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);
  const offerResizingRef = useRef<{
    key: SalesOfferColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const totalTableMinWidth = useMemo(() => {
    return salesTotalColumns.reduce((sum, col) => sum + (totalColumnWidths[col.key] ?? col.width), 0);
  }, [totalColumnWidths]);

  const offerTableMinWidth = useMemo(() => {
    return salesOfferColumns.reduce((sum, col) => sum + (offerColumnWidths[col.key] ?? col.width), 0);
  }, [offerColumnWidths]);

  const startTotalResize = (key: SalesTotalColumnKey) => (e: React.PointerEvent) => {
    const col = salesTotalColumns.find(c => c.key === key);
    if (!col || !col.resizable) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = totalColumnWidths[key] ?? col.width;
    const minWidth = col.minWidth;
    totalResizingRef.current = { key, startX, startWidth, minWidth };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onPointerMove = (evt: PointerEvent) => {
      const nextWidth = Math.max(minWidth, startWidth + (evt.clientX - startX));
      setTotalColumnWidths(prev => ({ ...prev, [key]: nextWidth }));
    };

    const onPointerUp = () => {
      totalResizingRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onPointerMove);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp, { once: true });
  };

  const startOfferResize = (key: SalesOfferColumnKey) => (e: React.PointerEvent) => {
    const col = salesOfferColumns.find(c => c.key === key);
    if (!col || !col.resizable) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = offerColumnWidths[key] ?? col.width;
    const minWidth = col.minWidth;
    offerResizingRef.current = { key, startX, startWidth, minWidth };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onPointerMove = (evt: PointerEvent) => {
      const nextWidth = Math.max(minWidth, startWidth + (evt.clientX - startX));
      setOfferColumnWidths(prev => ({ ...prev, [key]: nextWidth }));
    };

    const onPointerUp = () => {
      offerResizingRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onPointerMove);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp, { once: true });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 space-y-4 px-2 overflow-auto pb-8">
      
      {/* Date Picker mimicking input */}
      <div className="bg-white border text-sm border-gray-200 rounded-lg p-3 flex justify-between items-center text-gray-700 shadow-sm">
        <span>1 Jan 2026 – 31 Dec 2026</span>
        <CalendarIcon className="h-5 w-5 text-gray-400" />
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-white rounded-lg border border-gray-100 p-1 w-max shadow-sm">
        <button 
          onClick={() => setActiveSegment('Alles')}
          className={`px-6 py-2 text-sm font-semibold rounded-md ${activeSegment === 'Alles' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Alles
        </button>
        <button 
          onClick={() => setActiveSegment('Residentieel')}
          className={`px-6 py-2 text-sm font-medium rounded-md ${activeSegment === 'Residentieel' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Residentieel
        </button>
        <button 
          onClick={() => setActiveSegment('Commercieel')}
          className={`px-6 py-2 text-sm font-medium rounded-md ${activeSegment === 'Commercieel' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Commercieel
        </button>
      </div>

      <div className="flex gap-4 items-start xl:flex-row flex-col">
        {/* Totaal Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 w-full overflow-hidden flex flex-col">
          <div className="p-6 pb-4">
            <h2 className="text-xl font-bold text-gray-800">Totaal</h2>
            <p className="text-sm text-gray-500 mt-1">Totaal verkochte offertes in de geselecteerde periode per account manager</p>
          </div>

          <div className="px-4 py-2 border-y border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
              <button className="flex items-center gap-1.5 hover:text-gray-900"><Columns3 className="h-4 w-4" /> Kolommen</button>
              <button className="flex items-center gap-1.5 hover:text-gray-900"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
              <button className="flex items-center gap-1.5 hover:text-gray-900"><AlignJustify className="h-4 w-4" /> Grootte</button>
              <button className="flex items-center gap-1.5 hover:text-gray-900"><Download className="h-4 w-4" /> Exporteren</button>
            </div>
            <button className="text-gray-400 hover:text-gray-600"><Search className="h-4 w-4" /></button>
          </div>

          <div className="overflow-x-auto flex-1 h-[400px]">
            <table
              className="w-full text-left text-sm border-collapse table-fixed"
              style={{ minWidth: totalTableMinWidth }}
            >
              <colgroup>
                {salesTotalColumns.map(col => (
                  <col key={col.key} style={{ width: totalColumnWidths[col.key] }} />
                ))}
              </colgroup>
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  {salesTotalColumns.map(col => (
                    <th key={col.key} className={`relative select-none overflow-hidden whitespace-nowrap ${col.thClassName ?? ''}`}>
                      <span className="truncate block">{col.label}</span>
                      {col.resizable ? (
                        <div
                          onPointerDown={startTotalResize(col.key)}
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
              <tbody>
                {totaalData.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 text-gray-600 truncate">{row.manager}</td>
                    <td className="p-3 text-gray-600">{row.leads}</td>
                    <td className="p-3 text-gray-600 text-right">{row.marge}</td>
                    <td className="p-3 text-gray-600 text-right">{row.marginPerc}</td>
                    <td className="p-3 text-gray-600 text-right">{row.verkoopmarge}</td>
                    <td className="p-3 text-gray-600 text-right">{row.inkoopprijs}</td>
                    <td className="p-3 text-gray-600 text-right">{row.verkoopprijs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer totals */}
          <div className="bg-white border-t border-gray-200 p-4 shrink-0">
            <div className="flex justify-between items-center text-sm font-bold text-green-700 border-t-4 border-gray-300 pt-2 pb-1">
              <span className="w-1/5"></span>
              <span className="w-1/12">{totals.leads}</span>
              <span className="w-1/6 text-right">{formatCurrency(totals.margeVal)}</span>
              <span className="w-1/12 text-right">{totals.marginPerc}</span>
              <span className="w-1/6 text-right">{totals.verkoopmarge}</span>
              <span className="w-1/6 text-right">{formatCurrency(totals.inkoopVal)}</span>
              <span className="w-1/6 text-right">{formatCurrency(totals.verkoopVal)}</span>
            </div>
            <div className="text-right text-xs text-gray-500 mt-2 font-medium">
              Totaal: {totaalData.length}
            </div>
          </div>
        </div>

        {/* Per Offerte Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-[1.4] w-full overflow-hidden flex flex-col">
          <div className="p-6 pb-4">
            <h2 className="text-xl font-bold text-gray-800">Per offerte</h2>
            <p className="text-sm text-gray-500 mt-1">Elk verkocht project in de geselecteerde periode per account manager</p>
          </div>

          <div className="px-4 py-2 border-y border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
              <button className="flex items-center gap-1.5 hover:text-gray-900"><Columns3 className="h-4 w-4" /> Kolommen</button>
              <button className="flex items-center gap-1.5 hover:text-gray-900"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
              <button className="flex items-center gap-1.5 hover:text-gray-900"><AlignJustify className="h-4 w-4" /> Grootte</button>
              <button className="flex items-center gap-1.5 hover:text-gray-900"><Download className="h-4 w-4" /> Exporteren</button>
            </div>
            <button className="text-gray-400 hover:text-gray-600"><Search className="h-4 w-4" /></button>
          </div>

          <div className="overflow-x-auto flex-1 h-[400px]">
            <table
              className="w-full text-left text-sm border-collapse table-fixed"
              style={{ minWidth: offerTableMinWidth }}
            >
              <colgroup>
                {salesOfferColumns.map(col => (
                  <col key={col.key} style={{ width: offerColumnWidths[col.key] }} />
                ))}
              </colgroup>
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  {salesOfferColumns.map(col => (
                    <th key={col.key} className={`relative select-none overflow-hidden whitespace-nowrap ${col.thClassName ?? ''}`}>
                      <span className="truncate block">{col.label}</span>
                      {col.resizable ? (
                        <div
                          onPointerDown={startOfferResize(col.key)}
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
              <tbody>
                {perOfferteData.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 text-emerald-700 font-bold">{row.id}</td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-semibold hover:underline cursor-pointer truncate block">{row.project}</span>
                    </td>
                    <td className="p-3 text-gray-600 truncate">{row.manager}</td>
                    <td className="p-3 text-gray-600 text-right">{row.marge}</td>
                    <td className="p-3 text-gray-600 text-right">{row.marginPerc}</td>
                    <td className="p-3 text-gray-600 text-right">{row.verkoopmarge}</td>
                    <td className="p-3 text-gray-600 text-right">{row.inkoopprijs}</td>
                    <td className="p-3 text-gray-600 text-right">{row.verkoopprijs}</td>
                    <td className="p-3 text-gray-600 text-right">{row.datum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer totals */}
          <div className="bg-white border-t border-gray-200 p-4 shrink-0">
            <div className="flex justify-between items-center text-sm font-bold text-green-700 border-t-4 border-gray-300 pt-2 pb-1 pr-[10%]">
              <span className="w-1/4"></span>
              <span className="w-1/6 text-right">{formatCurrency(totals.margeVal)}</span>
              <span className="w-1/12 text-right">{totals.marginPerc}</span>
              <span className="w-1/6 text-right">{totals.verkoopmarge}</span>
              <span className="w-1/6 text-right">{formatCurrency(totals.inkoopVal)}</span>
              <span className="w-1/6 text-right">{formatCurrency(totals.verkoopVal)}</span>
            </div>
            <div className="text-right text-xs text-gray-500 mt-2 font-medium">
              Totaal: {perOfferteData.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
