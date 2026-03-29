import React from 'react';
import { 
  Hourglass, Settings, Columns3, SlidersHorizontal, AlignJustify, Maximize2, Download, Search, Edit, Wrench, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserRound } from 'lucide-react';

const rowData = [
  { id: 1, type: 'Service Algemeen', typeBg: 'bg-gray-400 text-white', datum: '26-03-2026 Th 08:00 - Th 10:00', hasWrench: true, project: '2600213-Jan van Doo...', contact: 'Jan van Doore', mobiel: '06-23350054', gemaaktOp: '25-03-2026 13:48', gemaaktDoor: 'Sandra Brader' },
  { id: 2, type: 'Service Zonnepanelen', typeBg: 'bg-cyan-400 text-white', datum: '26-03-2026 Th 14:00 - Th 16:00', hasWrench: true, project: '2600177-Gijs Noort-...', contact: 'Gijs Noort', mobiel: '', gemaaktOp: '25-03-2026 08:49', gemaaktDoor: 'Sandra Brader' },
  { id: 3, type: 'Installatie Thuisbatterij', typeBg: 'bg-purple-500 text-white', datum: '26-03-2026 Th 08:00 - Th 14:00', hasWrench: true, project: '2500313-Ricardo Zoon...', contact: 'Ricardo Zoon', mobiel: '06-47558061', gemaaktOp: '20-03-2026 16:11', gemaaktDoor: 'Sandra Brader' },
  { id: 4, type: 'Service Algemeen', typeBg: 'bg-gray-400 text-white', datum: '27-03-2026 Fr 08:00 - Fr 16:30', hasWrench: true, project: '', contact: '-', mobiel: '', gemaaktOp: '20-03-2026 15:27', gemaaktDoor: 'Sven | Insta...' },
  { id: 5, type: 'Service Algemeen', typeBg: 'bg-gray-400 text-white', datum: '26-03-2026 Th 12:00 - Th 16:00', hasWrench: true, project: '2600188-J.M. Dam-I...', contact: 'J.M. Dam', mobiel: '06-41752164', gemaaktOp: '18-03-2026 12:54', gemaaktDoor: 'Sandra Brader' },
  { id: 6, type: 'Adviesgesprek Airco', typeBg: 'bg-orange-400 text-white', datum: '27-03-2026 Fr 11:00 - Fr 13:00', hasWrench: true, project: '2600158-Joost en M...', contact: 'Joost en Monique de...', mobiel: '', gemaaktOp: '17-03-2026 09:49', gemaaktDoor: 'Sandra Brader' },
  { id: 7, type: 'Adviesgesprek Warmte...', typeBg: 'bg-purple-500 text-white', datum: '27-03-2026 Fr 08:00 - Fr 10:00', hasWrench: true, project: '2600176-Mira Gosse...', contact: 'Mira Gosselink', mobiel: '06-41186386', gemaaktOp: '17-03-2026 09:46', gemaaktDoor: 'Sandra Brader' },
];

export function PlanningListLayout() {
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
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            <button className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-1 border-b-2 border-transparent hover:border-gray-200">
              Alles <span className="bg-emerald-800 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">7</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 border-b-2 border-transparent hover:border-gray-200">
              Herplannen <span className="bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">0</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 border-b-2 border-transparent hover:border-gray-200">
              Open <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">7</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 border-b-2 border-transparent hover:border-gray-200">
              Afgewezen <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">0</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 border-b-2 border-transparent hover:border-gray-200">
              Concept <span className="bg-cyan-500 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">0</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 border-b-2 border-transparent hover:border-gray-200">
              Voltooid <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">0</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 border-b-2 border-transparent hover:border-gray-200">
              Gearchiveerd <span className="bg-orange-400 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">0</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-white border text-sm border-gray-200 rounded-lg p-2 px-3 flex justify-between items-center text-gray-700 shadow-sm min-w-[200px]">
              <span>26-03-2026 – 27-03-2026</span>
              <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
            <button className="p-2 border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Columns3 className="h-4 w-4" /> Kolommen</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><AlignJustify className="h-4 w-4" /> Dichtheid</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Maximize2 className="h-4 w-4" /> Schaal</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Download className="h-4 w-4" /> Exporteren</button>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoeken..."
              className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50 w-full"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm border-collapse min-w-[1200px]">
            <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-gray-100/50">
              <tr className="border-b border-gray-200">
                <th className="p-3 w-10 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                </th>
                <th className="p-3 font-semibold text-gray-700">Type</th>
                <th className="p-3 font-semibold text-gray-700">Datum</th>
                <th className="p-3 font-semibold text-gray-700">Toegewez...</th>
                <th className="p-3 font-semibold text-gray-700 text-center">Status</th>
                <th className="p-3 font-semibold text-gray-700">Project</th>
                <th className="p-3 font-semibold text-gray-700">Contact</th>
                <th className="p-3 font-semibold text-gray-700">Mobiel nu...</th>
                <th className="p-3 font-semibold text-gray-700">Gemaakt op</th>
                <th className="p-3 font-semibold text-gray-700">Gemaakt door</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {rowData.map((row, i) => (
                <tr key={row.id} className="border-b border-gray-100/80 hover:bg-gray-50/50">
                  <td className="p-3 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  </td>
                  <td className="p-3">
                    <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded shadow-sm opacity-90", row.typeBg)}>
                      {row.type}
                    </span>
                  </td>
                  <td className="p-3 text-xs font-medium text-black">
                    {row.datum}
                  </td>
                  <td className="p-3">
                    <div className="flex -space-x-1.5">
                      <Avatar className="h-6 w-6 border-2 border-white bg-gray-200">
                        <AvatarFallback className="bg-gray-300"><UserRound className="h-3 w-3 text-white"/></AvatarFallback>
                      </Avatar>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <Wrench className="h-3.5 w-3.5 text-blue-500 mx-auto" />
                  </td>
                  <td className="p-3 text-xs font-semibold text-emerald-600 hover:underline cursor-pointer truncate max-w-[200px]" title={row.project}>
                    {row.project}
                  </td>
                  <td className="p-3 text-xs font-semibold text-emerald-600 hover:underline cursor-pointer truncate max-w-[150px]" title={row.contact}>
                    {row.contact}
                  </td>
                  <td className="p-3 text-xs text-gray-600">
                    {row.mobiel}
                  </td>
                  <td className="p-3 text-xs text-gray-600">
                    {row.gemaaktOp}
                  </td>
                  <td className="p-3 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                       <Avatar className="h-5 w-5 bg-gray-200 shrink-0">
                        <AvatarFallback className="bg-gray-300"><UserRound className="h-3 w-3 text-white"/></AvatarFallback>
                      </Avatar>
                      <span className="truncate max-w-[120px]">{row.gemaaktDoor}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-emerald-600 hover:text-emerald-800 p-1">
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Force table height padding */}
              <tr className="h-auto">
                <td colSpan={11}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer info area */}
        <div className="bg-white border-t border-gray-200 p-4 shrink-0 flex items-center justify-end">
          <div className="flex items-center gap-6 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <span>Regels per pagina:</span>
              <select className="border-none outline-none font-semibold text-gray-800 focus:ring-0 bg-transparent cursor-pointer">
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
            <span>1–7 of 7</span>
            <div className="flex gap-4 items-center pl-2">
              <button className="text-gray-400 cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="text-gray-400 cursor-not-allowed">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
