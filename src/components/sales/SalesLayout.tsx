import React from 'react';
import { Columns3, SlidersHorizontal, AlignJustify, Download, Search, Calendar as CalendarIcon } from 'lucide-react';

export function SalesLayout() {
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
            <table className="w-full text-left text-sm border-collapse min-w-[700px]">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="p-3 font-semibold text-gray-700">Account manager</th>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap"># Leads</th>
                  <th className="p-3 font-semibold text-gray-700 text-right">Marge</th>
                  <th className="p-3 font-semibold text-gray-700 text-right whitespace-nowrap">Margin %</th>
                  <th className="p-3 font-semibold text-gray-700 text-right whitespace-nowrap">Verkoopmar...</th>
                  <th className="p-3 font-semibold text-gray-700 text-right">Inkoopprijs</th>
                  <th className="p-3 font-semibold text-gray-700 text-right">Verkoopprijs</th>
                </tr>
              </thead>
              <tbody>
                {totaalData.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 text-gray-600">{row.manager}</td>
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
            <table className="w-full text-left text-sm border-collapse min-w-[940px]">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="p-3 font-semibold text-gray-700 w-[60px]">Id</th>
                  <th className="p-3 font-semibold text-gray-700">Project</th>
                  <th className="p-3 font-semibold text-gray-700">Accountmanager</th>
                  <th className="p-3 font-semibold text-gray-700 text-right">Marge</th>
                  <th className="p-3 font-semibold text-gray-700 text-right whitespace-nowrap">Margin %</th>
                  <th className="p-3 font-semibold text-gray-700 text-right whitespace-nowrap">Verkoopmar...</th>
                  <th className="p-3 font-semibold text-gray-700 text-right">Inkoopprijs</th>
                  <th className="p-3 font-semibold text-gray-700 text-right">Verkoopprijs</th>
                  <th className="p-3 font-semibold text-gray-700 text-right whitespace-nowrap">Accepteer...</th>
                </tr>
              </thead>
              <tbody>
                {perOfferteData.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 text-emerald-700 font-bold">{row.id}</td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-semibold hover:underline cursor-pointer">{row.project}</span>
                    </td>
                    <td className="p-3 text-gray-600">{row.manager}</td>
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
