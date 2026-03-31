import React, { useState, useEffect } from 'react';
import { 
  Hourglass, Settings, Columns3, SlidersHorizontal, AlignJustify, Maximize2, Download, Search, Edit, Wrench, ChevronLeft, ChevronRight, Plus, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserRound } from 'lucide-react';
import { planningService, PlanningEntry } from '@/lib/planningService';

export function PlanningListLayout() {
  const [entries, setEntries] = useState<PlanningEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = planningService.subscribeToPlanning((fetched) => {
      setEntries(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddSample = async () => {
    const types: ('Service' | 'Installatie' | 'Onderhoud')[] = ['Service', 'Installatie', 'Onderhoud'];
    const names = ["Jan van Doore", "Gijs Noort", "Ricardo Zoon", "J.M. Dam"];
    const techs = ["Sven", "Lars", "Sandra"];
    
    await planningService.addPlanningEntry({
      projectId: `PRJ-${Math.floor(Math.random() * 1000)}`,
      projectName: `Project ${Math.floor(Math.random() * 100)}`,
      client: names[Math.floor(Math.random() * names.length)],
      technician: techs[Math.floor(Math.random() * techs.length)],
      startTime: "09:00",
      endTime: "11:00",
      date: new Date().toISOString().split('T')[0],
      status: 'Ingepland',
      type: types[Math.floor(Math.random() * types.length)]
    });
  };

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
            <button className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-1 border-b-2 border-green-600">
              Alles <span className="bg-emerald-800 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">{entries.length}</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 border-b-2 border-transparent">
              Open <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">{entries.filter(e => e.status === 'Ingepland').length}</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 border-b-2 border-transparent">
              Voltooid <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded leading-none shrink-0">{entries.filter(e => e.status === 'Afgerond').length}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
                onClick={handleAddSample}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-medium text-xs rounded-md shadow-sm hover:bg-emerald-700 transition-all"
              >
              <Plus className="h-4 w-4" /> Afspraak Maken
            </button>
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
              <tr className="border-b border-gray-200 bg-gray-50/20">
                <th className="p-3 w-10 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                </th>
                <th className="p-3 font-semibold text-gray-700">Type</th>
                <th className="p-3 font-semibold text-gray-700">Datum</th>
                <th className="p-3 font-semibold text-gray-700">Technicus</th>
                <th className="p-3 font-semibold text-gray-700 text-center">Status</th>
                <th className="p-3 font-semibold text-gray-700">Project</th>
                <th className="p-3 font-semibold text-gray-700">Contact</th>
                <th className="p-3 font-semibold text-gray-700">Gemaakt op</th>
                <th className="p-3 w-14"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={9} className="p-20 text-center text-gray-400 italic">Bezig met laden...</td></tr>
              ) : entries.length === 0 ? (
                <tr><td colSpan={9} className="p-20 text-center text-gray-400 italic">Geen afspraken gevonden. Gebruik "Afspraak Maken".</td></tr>
              ) : entries.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 group transition-colors">
                  <td className="p-3 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  </td>
                  <td className="p-3">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded shadow-sm opacity-90 uppercase tracking-tighter", getTypeStyle(row.type))}>
                      {row.type}
                    </span>
                  </td>
                  <td className="p-3 text-xs font-semibold text-gray-900 font-mono">
                    {row.date} | {row.startTime} - {row.endTime}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                       <div className="h-6 w-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {row.technician.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-gray-700">{row.technician}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">{row.status}</span>
                  </td>
                  <td className="p-3 text-xs font-semibold text-emerald-600 hover:underline cursor-pointer truncate max-w-[200px]">
                    {row.projectId} - {row.projectName}
                  </td>
                  <td className="p-3 text-xs font-semibold text-emerald-600 hover:underline cursor-pointer truncate max-w-[150px]">
                    {row.client}
                  </td>
                  <td className="p-3 text-xs text-gray-500">
                    {row.createdAt?.toDate().toLocaleDateString('nl-NL') || '-'}
                  </td>
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
