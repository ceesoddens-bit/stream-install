import React, { useMemo, useRef, useState } from 'react';
import { Columns3, SlidersHorizontal, AlignJustify, Download, Search, Calendar as CalendarIcon } from 'lucide-react';

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

  const totaalData = [
    { manager: 'Installatiegroep...', leads: 6, marge: '€ 5.747,78', marginPerc: '66.19', verkoopmarge: '39.83', inkoopprijs: '€ 8.684,00', verkoopprijs: '€ 14.431,78' },
    { manager: 'Sandra Brader', leads: 1, marge: '€ 1.612,00', marginPerc: '76.91', verkoopmarge: '43.47', inkoopprijs: '€ 2.096,00', verkoopprijs: '€ 3.708,00' }
  ];

  const perOfferteData = [
    { id: 498, project: '2600145-Centrad-1', manager: 'Sven | Installatiegroep', marge: '€ 1.089,00', marginPerc: '58.52', verkoopmarge: '36.92', inkoopprijs: '€ 1.861,00', verkoopprijs: '€ 2.950,00', datum: '03-03-2026' },
    { id: 508, project: '2600160-Centrad-1', manager: 'Sandra Brader', marge: '€ 1.612,00', marginPerc: '76.91', verkoopmarge: '43.47', inkoopprijs: '€ 2.096,00', verkoopprijs: '€ 3.708,00', datum: '12-03-2026' },
    { id: 496, project: '2600136-Centrad-1', manager: 'Sven | Installatiegroep', marge: '€ 1.089,00', marginPerc: '58.52', verkoopmarge: '36.92', inkoopprijs: '€ 1.861,00', verkoopprijs: '€ 2.950,00', datum: '27-02-2026' },
    { id: 526, project: '2600210-Centrad-1', manager: 'Sven | Installatiegroep', marge: '€ 1.089,00', marginPerc: '58.52', verkoopmarge: '36.92', inkoopprijs: '€ 1.861,00', verkoopprijs: '€ 2.950,00', datum: '25-03-2026' },
    { id: 503, project: '2600157-Edwin Hols', manager: 'Sven | Installatiegroep', marge: '€ 545,00', marginPerc: '54500', verkoopmarge: '100', inkoopprijs: '€ 0,00', verkoopprijs: '€ 545,00', datum: '05-03-2026' },
    { id: 499, project: '2600117-Nathalie Ba', manager: 'Sven | Installatiegroep', marge: '€ 846,78', marginPerc: '68.29', verkoopmarge: '40.58', inkoopprijs: '€ 1.240,00', verkoopprijs: '€ 2.086,78', datum: '03-03-2026' },
    { id: 501, project: '2600153-Centrad-1', manager: 'Sven | Installatiegroep', marge: '€ 1.089,00', marginPerc: '58.52', verkoopmarge: '36.92', inkoopprijs: '€ 1.861,00', verkoopprijs: '€ 2.950,00', datum: '05-03-2026' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 space-y-4 px-2 overflow-auto pb-8">
      
      {/* Date Picker mimicking input */}
      <div className="bg-white border text-sm border-gray-200 rounded-lg p-3 flex justify-between items-center text-gray-700 shadow-sm">
        <span>26-02-2026 – 27-03-2026</span>
        <CalendarIcon className="h-5 w-5 text-gray-400" />
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-white rounded-lg border border-gray-100 p-1 w-max shadow-sm">
        <button className="px-6 py-2 text-sm font-semibold rounded-md bg-green-50 text-green-700">
          Alles
        </button>
        <button className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md">
          Residentieel
        </button>
        <button className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md">
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
              <span className="w-1/12">7</span>
              <span className="w-1/6 text-right">€ 7.359,78</span>
              <span className="w-1/12 text-right">68.27</span>
              <span className="w-1/6 text-right">40.57</span>
              <span className="w-1/6 text-right">€ 10.780,00</span>
              <span className="w-1/6 text-right">€ 18.139,78</span>
            </div>
            <div className="text-right text-xs text-gray-500 mt-2 font-medium">
              Totaal: 2
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
              <span className="w-1/6 text-right">€ 7.359,78</span>
              <span className="w-1/12 text-right">68.27</span>
              <span className="w-1/6 text-right">40.57</span>
              <span className="w-1/6 text-right">€ 10.780,00</span>
              <span className="w-1/6 text-right">€ 18.139,78</span>
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
