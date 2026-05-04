import React, { useState, useEffect } from 'react';
import { 
  Hourglass, Search, Filter, Folder, X, Tag, ChevronLeft, ChevronRight, 
  Menu, Grid, List, Columns, Calendar as CalendarIcon, Wrench, LayoutGrid as LayoutGridIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { planningService, PlanningEntry } from '@/lib/planningService';
import { projectService, Project } from '@/lib/projectService';
import { teamService, Technician } from '@/lib/teamService';
import { ticketService, Ticket } from '@/lib/ticketService';
import { format, addDays, subDays } from 'date-fns';
import { nl } from 'date-fns/locale';
import { PlanProjectDialog } from './PlanningDialogs';
import { toast } from 'sonner';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 07 to 18

export function PlannerView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [entries, setEntries] = useState<PlanningEntry[]>([]);
  const [techs, setTechs] = useState<Technician[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [copied, setCopied] = useState(false);

  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const unsubProjects = projectService.subscribeToProjects(setProjects);
    const unsubTechs = teamService.subscribeToTechnicians(setTechs);
    const unsubTickets = ticketService.subscribeToTickets(setTickets);
    setIsLoading(false);
    return () => {
      unsubProjects();
      unsubTechs();
      unsubTickets();
    };
  }, []);

  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    const unsubPlanning = planningService.subscribeToPlanning(setEntries, { date: dateKey });
    return () => unsubPlanning();
  }, [dateKey]);

  // Use real techs or fallback
  const displayTechs = techs.length > 0 ? techs.map(t => t.name) : [];

  const handlePlan = (project: Project) => {
    setSelectedProject(project);
    setIsPlanOpen(true);
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm("Weet je zeker dat je deze planning wilt verwijderen?")) {
      try {
        await planningService.deletePlanningEntry(id);
        toast.success('Planning verwijderd');
      } catch (err) {
        toast.error('Fout bij verwijderen');
      }
    }
  };

  const getRows = () => {
    return techs.map(tech => {
      const techEntries = entries.filter(e => e.technician === tech.name);
      const techTickets = tickets.filter(t => t.assigneeId === tech.id && t.slaDate === dateKey);

      const entryBlocks = techEntries.map(e => {
        const start = parseInt(e.startTime.split(':')[0]) + (parseInt(e.startTime.split(':')[1]) / 60);
        const end = parseInt(e.endTime.split(':')[0]) + (parseInt(e.endTime.split(':')[1]) / 60);
        return {
          id: e.id,
          title: `${e.client} - ${e.projectName}`,
          start,
          end,
          color: 'bg-emerald-100/80 border-emerald-200 text-emerald-800'
        };
      });

      const ticketBlocks = techTickets.map(t => {
        const start = parseInt((t.startTime || '08:00').split(':')[0]) + (parseInt((t.startTime || '08:00').split(':')[1]) / 60);
        const end = parseInt((t.endTime || '09:00').split(':')[0]) + (parseInt((t.endTime || '09:00').split(':')[1]) / 60);
        return {
          id: t.id,
          title: `🎟️ ${t.title}`,
          start,
          end,
          color: 'bg-blue-100/80 border-blue-200 text-blue-800'
        };
      });

      return {
        name: tech.name,
        eff: (techEntries.length + techTickets.length) > 0 ? "85%" : "",
        blocks: [...entryBlocks, ...ticketBlocks]
      };
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden space-y-4 pt-2">
      
      {/* ── Page Header Mimicking Screenshot ── */}
      <div className="flex items-center gap-2 px-6 pb-2 shrink-0">
        <Hourglass className="h-6 w-6 text-emerald-800 bg-emerald-100 p-1 rounded" />
        <h1 className="text-xl font-bold text-gray-900">Planner</h1>
      </div>

      {/* ── Top Box: Projects Selection ── */}
      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm shrink-0 flex flex-col p-4">
        {/* Tabs */}
        <div className="flex bg-gray-50/50 p-1 rounded-lg border border-gray-100 w-full mb-4">
          <button className="flex-1 py-2 text-sm font-semibold rounded-md bg-green-50 text-green-800 shadow-sm border border-green-100 transition-all">
            Projectplanning
          </button>
          <button className="flex-1 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md transition-all">
            Planningsregels
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Project zoeken..." 
              className="w-full pl-4 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400">
              <div className="relative cursor-pointer hover:text-gray-600">
                <Filter className="h-4 w-4" />
              </div>
              <Folder className="h-4 w-4 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
        </div>

        {/* Project Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 -tracking-tight">Beschikbare Projecten</h3>
            <span className="bg-green-700 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">{projects.length}</span>
          </div>
        </div>

        {/* Project Cards (Horizontal Scroll) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {projects.map((p) => (
            <div 
              key={p.id} 
              onClick={() => handlePlan(p)}
              className="min-w-[180px] w-[180px] bg-white border border-gray-200 rounded-xl p-3 shadow-sm snap-start hover:border-emerald-300 transition-all cursor-pointer group"
            >
              <div className="text-xs text-gray-500 font-medium mb-0.5">{p.client}</div>
              <div className="text-sm text-gray-900 font-semibold mb-3 truncate" title={p.name}>{p.name}</div>
              <span className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded uppercase", p.priority === 'High' ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-800")}>
                {p.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Box: Timeline Grid ── */}
      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden mb-6">
        
        {/* Date Navigator & Options */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex gap-1.5">
            <button className="p-1.5 rounded bg-gray-100 text-gray-600 hover:text-gray-900"><Menu className="h-4 w-4" /></button>
            <button className="p-1.5 rounded bg-emerald-700 text-white"><CalendarIcon className="h-4 w-4" /></button>
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-900"><List className="h-4 w-4" /></button>
          </div>

          <div className="flex items-center gap-4 text-gray-800 font-bold min-w-[200px] justify-center">
            <button 
              onClick={() => setSelectedDate(prev => subDays(prev, 1))}
              className="p-1 hover:bg-gray-100 rounded text-emerald-600 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="capitalize">{format(selectedDate, 'EEEE d MMMM', { locale: nl })}</span>
            <button 
              onClick={() => setSelectedDate(prev => addDays(prev, 1))}
              className="p-1 hover:bg-gray-100 rounded text-emerald-600 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                try {
                  const url = window.location.href;
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    });
                  }
                } catch {}
              }}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-md shadow-sm transition-colors"
            >
              {copied ? 'Gekopieerd' : 'Exporteren Als URL'}
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-md shadow-sm transition-colors"
            >
              Vandaag
            </button>
          </div>
        </div>

        {/* Timeline Table */}
        <div className="flex-1 overflow-auto flex flex-col relative w-full border-b border-white">
          <div className="min-w-[1000px] flex flex-col w-full h-full">
            
            {/* Table Header */}
            <div className="flex border-b border-gray-200 sticky top-0 bg-white z-30">
              <div className="w-[100px] border-r border-gray-200 p-3 shrink-0 flex items-end">
                <span className="font-bold text-gray-800 text-xs text-center w-full">Efficiëntie</span>
              </div>
              <div className="w-[200px] border-r border-gray-200 p-3 shrink-0 flex items-end">
                <span className="font-bold text-gray-800 text-xs">Monteur</span>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex relative h-8">
                  {HOURS.map(h => (
                    <div key={h} className="flex-1 border-r border-gray-200 flex justify-start pl-2 items-center shrink-0 min-w-[50px]">
                      <span className="font-bold text-gray-800 text-xs">{h.toString().padStart(2, '0')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="flex-1 relative z-10 w-full min-h-0 bg-white">
              <div className="absolute inset-0 right-0 w-full overflow-y-auto">
                {getRows().map((row, i) => (
                  <div key={i} className="flex border-b border-gray-100 h-12 w-full">
                    {/* Left Fixed Cols */}
                    <div className="w-[100px] border-r border-gray-100 shrink-0 flex items-center justify-center bg-gray-50/20">
                      <span className="text-[10px] text-gray-600 font-bold">{row.eff}</span>
                    </div>
                    <div className="w-[200px] border-r border-gray-100 shrink-0 flex items-center px-3 bg-gray-50/30">
                      <div className="h-6 w-6 bg-emerald-100 rounded-full mr-2 flex items-center justify-center text-[10px] font-bold text-emerald-800 border border-emerald-200">
                        {row.name.charAt(0)}
                      </div>
                      <span className="text-xs text-gray-800 font-medium">{row.name}</span>
                    </div>
                    {/* Grid Area */}
                    <div className="flex-1 relative bg-white">
                      {/* Grid background lines */}
                      <div className="absolute inset-0 flex">
                        {HOURS.map(h => (
                          <div key={h} className="flex-1 border-r border-gray-100/50 h-full shrink-0 min-w-[50px]"></div>
                        ))}
                      </div>
                      
                      {/* Blocks */}
                      {row.blocks.map((b, bIdx) => {
                        const startPercent = ((b.start - 7) / 12) * 100;
                        const widthPercent = ((b.end - b.start) / 12) * 100;
                        return (
                          <div 
                            key={bIdx}
                            className={cn(
                              "absolute top-2 bottom-2 rounded border px-2 flex items-center overflow-hidden cursor-pointer shadow-sm transition-all hover:scale-[1.02] group",
                              b.color
                            )}
                            style={{ 
                              left: `${startPercent}%`, 
                              width: `${widthPercent}%`,
                              zIndex: 20
                            }}
                          >
                            <span className="text-[9px] font-bold truncate flex-1">{b.title}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (b.id) handleDeleteEntry(b.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/50 rounded transition-opacity"
                            >
                              <X className="h-3 w-3 text-red-600" />
                            </button>
                            <Wrench className="h-2.5 w-2.5 ml-1 shrink-0 opacity-70" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
                
                {/* Empty rows to visually fill up space */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex border-b border-gray-100 h-12 w-full">
                    <div className="w-[100px] border-r border-gray-100 shrink-0 bg-gray-50/10" />
                    <div className="w-[200px] border-r border-gray-100 shrink-0 bg-gray-50/10" />
                    <div className="flex-1 flex bg-white opacity-40">
                      {HOURS.map(h => (
                        <div key={h} className="flex-1 border-r border-gray-100/30 h-full shrink-0 min-w-[50px]"></div>
                      ))}
                    </div>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </div>

      </div>

      <PlanProjectDialog 
        open={isPlanOpen}
        onOpenChange={setIsPlanOpen}
        project={selectedProject}
        technicians={techs}
        selectedDate={dateKey}
      />
    </div>
  );
}
