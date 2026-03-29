import React from 'react';
import {
  LifeBuoy,
  HelpCircle,
  Mail,
  Bell,
  Settings,
  Columns3,
  SlidersHorizontal,
  AlignJustify,
  Maximize2,
  Zap,
  Download,
  Search,
  History,
  MoreVertical,
  CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formItems } from '@/data/mockData';

export function FormsLayout() {
  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <LifeBuoy className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Ingevulde formulieren</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Zoeken..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
            />
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <HelpCircle className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Mail className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
          </button>
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-medium text-sm">
            <Zap className="h-4 w-4" />
            Installatiegroep Duurzaam
          </div>
        </div>
      </div>

      {/* ── Toolbar Area ── */}
      <div className="px-6 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 border-b border-gray-200">
            <button className="px-4 py-2 text-sm font-semibold border-b-2 border-green-600 text-green-700 -mb-px flex items-center gap-2">
              Alles
              <span className="bg-green-700 text-white text-[10px] px-1.5 py-0.5 rounded-md leading-none">
                421
              </span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-700 rounded-md text-sm font-semibold hover:bg-green-50 transition-colors">
              <History className="h-4 w-4" />
              Bekijk Oude Formulieren
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-md transition-colors bg-gray-100">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900">
              <Columns3 className="h-4 w-4" />
              Kolommen
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900">
              <AlignJustify className="h-4 w-4" />
              Dichtheid
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900">
              <Maximize2 className="h-4 w-4" />
              Schaal
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-400 cursor-not-allowed">
              <Zap className="h-4 w-4" />
              Bulk
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900">
              <Download className="h-4 w-4" />
              Exporteren
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoeken..."
              className="pl-9 pr-8 py-1.5 border-b border-gray-300 text-sm focus:outline-none focus:border-green-500 bg-transparent w-48"
            />
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-3 w-10 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                </th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase">Project</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase">Planningsregel</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase">Gemaakt op</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase">Gemaakt door</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase">Bijgewerkt op</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase">Bijgewerkt door</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {formItems.map((form, index) => (
                <tr key={form.id} className={cn("border-b border-gray-100 hover:bg-gray-50", index % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                  <td className="p-3 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  </td>
                  <td className="p-3">
                    <span 
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded",
                        form.status === 'PUBLISHED' ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                      )}
                    >
                      {form.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm font-medium text-green-600 cursor-pointer hover:underline truncate max-w-[200px]" title={form.project}>
                    {form.project}
                  </td>
                  <td className="p-3 text-sm text-gray-600 truncate max-w-[200px]" title={form.planningsregel}>
                    {form.planningsregel}
                  </td>
                  <td className="p-3 text-sm text-gray-600 whitespace-nowrap">
                    {form.createdAt}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                        <UserCircleIcon name={form.createdBy} />
                      </div>
                      <span className="truncate max-w-[120px]" title={form.createdBy}>{form.createdBy}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600 whitespace-nowrap">
                    {form.updatedAt}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                        <UserCircleIcon name={form.updatedBy} />
                      </div>
                      <span className="truncate max-w-[120px]" title={form.updatedBy}>{form.updatedBy}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-green-600 hover:text-green-800 p-1">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="flex items-center justify-end py-4 text-sm text-gray-600 gap-4">
          <div className="flex items-center gap-2">
            <span>Regels per pagina:</span>
            <select className="border-none bg-transparent font-medium focus:ring-0 cursor-pointer">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <span>1–19 of 421</span>
          <div className="flex items-center gap-2">
            <button className="p-1 text-gray-400 hover:text-gray-600 cursor-not-allowed"><ChevronLeft className="h-5 w-5" /></button>
            <button className="p-1 text-gray-600 hover:text-gray-900"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper generic avatar mimicking the screenshot
function UserCircleIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 h-4 w-4">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
)

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
)
