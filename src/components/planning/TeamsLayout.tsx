import React from 'react';
import { 
  Plus, Columns3, SlidersHorizontal, AlignJustify, Search, Filter, Zap
} from 'lucide-react';

export function TeamsLayout() {
  return (
    <div className="flex flex-col h-full bg-slate-50 relative space-y-4 pt-2 pb-8">
      
      {/* ── Page Header Mimicking Screenshot ── */}
      <div className="flex items-center gap-3 px-6 pb-2 shrink-0">
        {/* Custom Hourglass Icon */}
        <div className="flex items-center justify-center w-7 h-7">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4H18L14 10.5L18 17H6L10 10.5L6 4Z" fill="#1e3a8a" />
            <path d="M6 17H18L14 23H6L10 17Z" fill="#10b981" />
            <path d="M6 4L10 10.5L6 17H4L8 10.5L4 4H6Z" fill="#047857" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Teamlijst</h1>
      </div>

      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        
        {/* Top Tabs and Action Row */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-6 pb-1">
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-1 border-b-2 border-emerald-800 px-1">
              Alles
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-medium text-sm rounded-md shadow-sm transition-opacity hover:opacity-90">
              <Plus className="h-4 w-4" /> Groep Aanmaken
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-4 text-[13px] font-semibold text-gray-700">
            <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><Columns3 className="h-4 w-4" /> Kolommen</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><AlignJustify className="h-4 w-4" /> Grootte</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><Filter className="h-4 w-4" /> Filtersjablonen</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><Zap className="h-4 w-4" /> Bulk</button>
          </div>
          <div className="flex items-center justify-end pr-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-auto flex-1 bg-white">
          <table className="w-full text-left text-[13px] border-collapse min-w-[800px]">
            <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-gray-100/50">
              <tr className="border-b border-gray-200">
                <th className="p-3 pl-4 w-10 text-center">
                  <div className="w-3.5 h-3.5 border-2 border-gray-400 rounded-sm"></div>
                </th>
                <th className="p-3 font-semibold text-gray-800 w-1/2">Naam</th>
                <th className="p-3 font-semibold text-gray-800 w-64">Bijgewerkt op</th>
                <th className="p-3 font-semibold text-gray-800 w-64">Bijgewerkt door</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {/* Empty State */}
              <tr>
                <td colSpan={5} className="text-center py-48">
                  <span className="text-[13px] text-gray-600">Geen rijen</span>
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
              <select className="border-none outline-none font-semibold text-gray-800 focus:ring-0 bg-transparent cursor-pointer pl-1 pr-4">
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
