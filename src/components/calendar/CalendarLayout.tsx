import React from 'react';
import { 
  ChevronLeft, ChevronRight, Menu, Columns3, Grid, Calendar as CalendarIcon, Wand2, X, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, subWeeks, addWeeks, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { planningService, PlanningEntry } from '@/lib/planningService';
import { ticketService, Ticket } from '@/lib/ticketService';
import { teamService, Technician } from '@/lib/teamService';
import { TicketSidePanel } from '../tickets/TicketSidePanel';
import { EditPlanningDialog } from '../planning/PlanningDialogs';
import { toast } from 'sonner';

export function CalendarLayout() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [entries, setEntries] = React.useState<PlanningEntry[]>([]);
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [techs, setTechs] = React.useState<Technician[]>([]);
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null);
  const [selectedEntry, setSelectedEntry] = React.useState<PlanningEntry | null>(null);
  const [isEditEntryOpen, setIsEditEntryOpen] = React.useState(false);
  
  const times = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(weekStart, i);
    return {
      full: d,
      name: format(d, 'eee', { locale: nl }),
      date: format(d, 'd-M'),
      key: format(d, 'yyyy-MM-dd')
    };
  });

  React.useEffect(() => {
    const unsubPlanning = planningService.subscribeToPlanning(setEntries);
    const unsubTickets = ticketService.subscribeToTickets(setTickets);
    const unsubTechs = teamService.subscribeToTechnicians(setTechs);
    return () => {
      unsubPlanning();
      unsubTickets();
      unsubTechs();
    };
  }, []);

  const handlePrev = () => setCurrentDate(prev => addDays(prev, -7));
  const handleNext = () => setCurrentDate(prev => addDays(prev, 7));
  const handleToday = () => setCurrentDate(new Date());

  const getBlocksForDay = (dateKey: string) => {
    const dayEntries = entries.filter(e => e.date === dateKey);
    const dayTickets = tickets.filter(t => t.slaDate === dateKey && t.assigneeId);
    
    const entryBlocks = dayEntries.map(e => ({
      id: e.id,
      type: 'entry' as const,
      title: `${e.client} - ${e.projectName}`,
      start: parseInt(e.startTime.split(':')[0]) + (parseInt(e.startTime.split(':')[1]) / 60),
      end: parseInt(e.endTime.split(':')[0]) + (parseInt(e.endTime.split(':')[1]) / 60),
      color: 'bg-emerald-100 border-emerald-200 text-emerald-800',
      data: e
    }));

    const ticketBlocks = dayTickets.map(t => ({
      id: t.id,
      type: 'ticket' as const,
      title: `🎟️ ${t.title}`,
      start: parseInt((t.startTime || '08:00').split(':')[0]) + (parseInt((t.startTime || '08:00').split(':')[1]) / 60),
      end: parseInt((t.endTime || '09:00').split(':')[0]) + (parseInt((t.endTime || '09:00').split(':')[1]) / 60),
      color: 'bg-blue-100 border-blue-200 text-blue-800',
      data: t
    }));

    return [...entryBlocks, ...ticketBlocks];
  };

  const handleBlockClick = (block: any) => {
    if (block.type === 'ticket') {
      setSelectedTicket(block.data);
    } else {
      setSelectedEntry(block.data);
      setIsEditEntryOpen(true);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm("Verwijderen?")) {
      await planningService.deletePlanningEntry(id);
      toast.success('Verwijderd');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
        
        {/* Left Toggles */}
        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
          <button className="p-1.5 text-gray-500 hover:text-gray-900 rounded-md transition-colors">
            <Menu className="h-4 w-4" />
          </button>
          <button className="p-1.5 bg-gray-200 text-gray-900 rounded-md shadow-sm transition-colors mx-0.5">
            <Columns3 className="h-4 w-4" />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-900 rounded-md transition-colors">
            <Grid className="h-4 w-4" />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-900 rounded-md transition-colors">
            <CalendarIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Center Date */}
        <div className="flex items-center gap-6">
          <button onClick={handlePrev} className="text-gray-600 hover:text-gray-900 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-[17px] font-bold text-gray-900 tracking-tight capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: nl })}
          </h2>
          <button onClick={handleNext} className="text-gray-600 hover:text-gray-900 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-md shadow-sm transition-colors">
            Exporteren Als URL
          </button>
          <button onClick={handleToday} className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-md shadow-sm transition-colors">
            Vandaag
          </button>
        </div>

      </div>

      {/* ── Calendar Grid Header ── */}
      <div className="flex border-b border-gray-200 bg-white shrink-0 pr-2">
        {/* Time column header */}
        <div className="w-[60px] shrink-0 border-r border-gray-100 flex items-center justify-center py-2">
          <div className="bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-sm">
            W {format(currentDate, 'w')}
          </div>
        </div>
        
        {/* Days headers */}
        <div className="flex-1 flex">
          {days.map((day, i) => (
            <div key={i} className="flex-1 border-r border-gray-100 py-3 text-center">
              <span className="text-[13px] font-semibold text-gray-800">{day.name} {day.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Calendar Main Grid ── */}
      <div className="flex-1 overflow-auto bg-white flex relative">
        {/* Time column */}
        <div className="w-[60px] shrink-0 border-r border-gray-100 flex flex-col pt-0 bg-white z-10">
          {times.map((time, i) => (
            <div key={i} className="h-[64px] border-b border-gray-200/50 flex items-start justify-center pt-1.5">
              <div className="bg-blue-100 text-blue-800 text-[12px] font-bold px-1.5 py-0.5 w-[32px] text-center border-l-4 border-blue-500">
                {time}
              </div>
            </div>
          ))}
          <div className="h-10 border-r border-gray-100"></div>
        </div>

        {/* Days Columns Body */}
        <div className="flex-1 flex relative">
          {days.map((day, dayIndex) => {
            const dayBlocks = getBlocksForDay(day.key);
            return (
              <div key={dayIndex} className="flex-1 border-r border-gray-100 relative">
                {times.map((_, timeIndex) => (
                  <div key={timeIndex} className="h-[64px] border-b border-gray-200/50 w-full" />
                ))}
                
                {/* Render Blocks */}
                {dayBlocks.map((block, i) => {
                  const startPercent = ((block.start - 7) / 12) * (12 * 64);
                  const height = (block.end - block.start) * 64;
                  return (
                    <div 
                      key={i}
                      onClick={() => handleBlockClick(block)}
                      className={cn(
                        "absolute left-0 right-0 mx-1 border rounded shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden p-2 hover:brightness-95 cursor-pointer transition-all hover:z-20 group",
                        block.color
                      )}
                      style={{
                        top: `${startPercent}px`,
                        height: `${height}px`
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold leading-tight truncate flex-1">
                          {block.title}
                        </span>
                        {block.type === 'entry' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteEntry(block.id!); }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-black/5 rounded text-gray-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <div className="text-[9px] opacity-70 mt-1">
                        {block.data.startTime} - {block.data.endTime}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {selectedTicket && (
        <TicketSidePanel 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}

      <EditPlanningDialog 
        open={isEditEntryOpen}
        onOpenChange={setIsEditEntryOpen}
        entry={selectedEntry}
        technicians={techs}
      />
    </div>
  );
}
