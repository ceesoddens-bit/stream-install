import React from 'react';
import { 
  Settings, Columns3, SlidersHorizontal, AlignJustify, Maximize2, Download, Search, Info
} from 'lucide-react';

export function HoursLayout() {
  return (
    <div className="flex flex-col h-full bg-slate-50 relative space-y-4 pt-2 pb-8">
      
      {/* ── Page Header Mimicking Screenshot ── */}
      <div className="flex items-center gap-3 px-6 pb-2 shrink-0">
        {/* Custom Icon */}
        <div className="flex flex-col gap-1 w-6 h-6 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <div className="h-1.5 w-4 rounded-sm bg-emerald-900"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <div className="h-1.5 w-4 rounded-sm bg-blue-900"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <div className="h-1.5 w-4 rounded-sm bg-emerald-900"></div>
          </div>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Urenregistratielijst</h1>
      </div>

      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        
        {/* Top Tabs and Action Row */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-6 pb-1">
            <button className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-1 border-b-2 border-emerald-800">
              Alles <span className="bg-emerald-800 text-white text-[11px] px-1.5 py-0.5 rounded-sm leading-none shrink-0 font-bold">0</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-4 text-[13px] font-semibold text-gray-700">
            <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><Columns3 className="h-4 w-4" /> Kolommen</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><AlignJustify className="h-4 w-4" /> Dichtheid</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><Maximize2 className="h-4 w-4" /> Schaal</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><Download className="h-4 w-4" /> Exporteren</button>
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
          <table className="w-full text-left text-[13px] border-collapse min-w-[1200px]">
            <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-gray-100/50">
              <tr className="border-b border-gray-200">
                <th className="p-3 pl-4 w-10 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4" />
                </th>
                <th className="p-3 font-semibold text-gray-800">Gebruiker</th>
                <th className="p-3 font-semibold text-gray-800">Begin</th>
                <th className="p-3 font-semibold text-gray-800">Einde</th>
                <th className="p-3 font-semibold text-gray-800">Duur</th>
                <th className="p-3 font-semibold text-gray-800">Duration (...</th>
                <th className="p-3 font-semibold text-gray-800">Type</th>
                <th className="p-3 font-semibold text-gray-800">Project</th>
                <th className="p-3 font-semibold text-gray-800">Evene...</th>
                <th className="p-3 font-semibold text-gray-800">Planningsregel</th>
                <th className="p-3 font-semibold text-gray-800">Bedrijf</th>
                {/* Extra spacer for scroll effect matching screenshot */}
                <th className="p-3 min-w-[100px] border-l border-transparent"></th>
              </tr>
            </thead>
            <tbody>
              {/* Empty State */}
              <tr>
                <td colSpan={12} className="text-center py-40">
                  <span className="text-[13px] text-gray-700">Geen resultaten.</span>
                </td>
              </tr>
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
            <span>0–0 of 0</span>
            <div className="flex gap-4 items-center pl-2">
              <button className="text-gray-300 cursor-not-allowed">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button className="text-gray-300 cursor-not-allowed">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
