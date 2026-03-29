import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Wrench, MoreVertical, LayoutGrid, List, Filter, UserRound, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { planningCards, resources, scheduleItems } from '@/data/mockData';
import { PlanningCard } from '@/types';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 07:00 to 18:00

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);

// Helper for smaller product tags in the planner sidebar
const getProductTagStyle = (tag: string): string => {
  switch (tag) {
    case 'Zonnepanelen':    return 'bg-yellow-400 text-yellow-900';
    case 'Warmtepomp':      return 'bg-orange-500 text-white';
    case 'CV-ketel':        return 'bg-orange-500 text-white';
    case 'Airco':           return 'bg-blue-500 text-white';
    case 'Energie opslag':  return 'bg-green-600 text-white';
    default:                return 'bg-gray-500 text-white';
  }
};

export function PlannerView() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use real PlanningCards directly for the "to be scheduled" list
  const unscheduledProjects = planningCards.filter(
    (c) => c.status === 'Montage plannen' || c.status === 'Service gepland' || c.status === 'Restpunt plannen'
  ).filter(c => 
    c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.projectRef.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculatePosition = (startTime: string, endTime: string) => {
    const startHour = parseInt(startTime.split(':')[0]);
    const startMin = parseInt(startTime.split(':')[1]);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMin = parseInt(endTime.split(':')[1]);

    const startOffset = (startHour - 7) * 60 + startMin;
    const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);

    return {
      left: `${(startOffset / (12 * 60)) * 100}%`,
      width: `${(duration / (12 * 60)) * 100}%`,
    };
  };

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* ── Top Toolbar ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">Resource Planning</h2>
          
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm ml-4">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-gray-900"><ChevronLeft className="h-4 w-4" /></Button>
            <div className="px-4 flex items-center gap-2 font-medium text-sm text-gray-700">
              <CalendarIcon className="h-4 w-4 text-blue-600" />
              donderdag 26 maart 2026
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-gray-900"><ChevronRight className="h-4 w-4" /></Button>
          </div>
          
          <Button variant="outline" size="sm" className="h-9 px-4 font-medium">Vandaag</Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-200/80 p-1 rounded-lg">
            <Button variant="ghost" size="sm" className="h-7 text-xs px-4 bg-white shadow-sm font-semibold">Dag</Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs px-4 font-semibold text-gray-500 hover:text-gray-900">Week</Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs px-4 font-semibold text-gray-500 hover:text-gray-900">Maand</Button>
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button className="h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium">Auto-Plan (Beta)</Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Sidebar: Unscheduled Tasks ── */}
        <div className="w-[320px] flex flex-col border-r border-gray-200 bg-gray-50/30 shrink-0">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800 text-sm">Te plannen projecten <span className="text-gray-400 font-normal">({unscheduledProjects.length})</span></h3>
              <div className="flex gap-1 text-gray-400">
                <button className="hover:text-blue-600 transition-colors"><List className="h-4 w-4" /></button>
                <button className="hover:text-blue-600 transition-colors"><LayoutGrid className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Zoeken op ref of naam..."
                className="pl-9 h-9 text-sm bg-white border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {unscheduledProjects.map((project: PlanningCard) => (
                <div 
                  key={project.id} 
                  className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden"
                >
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1", 
                    project.projectType === 'Installatie' ? 'bg-green-500' : 'bg-orange-400'
                  )} />
                  <div className="pl-2">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-gray-500 truncate mr-2">{project.projectRef}</span>
                      <MoreVertical className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 cursor-pointer shrink-0" />
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight mb-0.5">{project.clientName}</h4>
                    <p className="text-[10px] text-gray-500 mb-2 truncate">{project.address}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {project.productTags.slice(0, 2).map(tag => (
                          <span key={tag} className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-sm", getProductTagStyle(tag))}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] font-semibold text-gray-700">{formatCurrency(project.amount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* ── Right Panel: The Timeline Grid ── */}
        <div className="flex-1 flex flex-col relative overflow-auto bg-gray-50/20">
          <div className="min-w-[900px]">
            {/* Header: Timeline Hours */}
            <div className="flex border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-20 shadow-sm">
              <div className="w-[200px] border-r border-gray-200 shrink-0 p-3 flex items-center bg-gray-50">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Team / Autopark</span>
              </div>
              <div className="flex-1 grid grid-cols-11 h-12 relative">
                {/* Current time indicator line - e.g. at 10:30 */}
                <div className="absolute top-0 bottom-0 left-[31.8%] w-px bg-blue-500 z-30 pointer-events-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500" />
                </div>
                
                {HOURS.slice(0, 11).map(hour => (
                  <div key={hour} className="border-r border-gray-100 last:border-r-0 flex flex-col justify-end pb-1.5 px-2">
                    <span className="text-[11px] font-bold text-gray-400">{hour.toString().padStart(2, '0')}:00</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content: Resource Rows */}
            <div className="relative z-10">
              {resources.map((resource, idx) => (
                <div key={resource.id} className={cn(
                  "flex border-b border-gray-100 group transition-colors relative min-h-[80px]",
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                  "hover:bg-blue-50/50"
                )}>
                  {/* Left fixed part: Resource details */}
                  <div className="w-[200px] border-r border-gray-200 shrink-0 p-3 flex items-center gap-3 bg-white group-hover:bg-blue-50/50 transition-colors z-20">
                    <Avatar className="h-10 w-10 border border-gray-200 shadow-sm">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${resource.id}`} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-bold"><UserRound className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-gray-900 truncate" title={resource.name}>{resource.name}</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: resource.efficiency }}
                          />
                        </div>
                        <span className="text-[9px] font-semibold text-gray-500">{resource.efficiency}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right scrollable part: timeline */}
                  <div className="flex-1 relative py-2">
                    {/* Background Grid Lines rendering hourly dividers */}
                    <div className="absolute inset-0 grid grid-cols-11 pointer-events-none">
                      {Array.from({ length: 11 }).map((_, i) => (
                        <div key={i} className="border-r border-gray-100 last:border-r-0 h-full" />
                      ))}
                    </div>

                    {/* The scheduled items strictly positioned */}
                    {scheduleItems
                      .filter(item => item.resourceId === resource.id)
                      .map(item => {
                        const pos = calculatePosition(item.startTime, item.endTime);
                        return (
                          <div
                            key={item.id}
                            className={cn(
                              "absolute top-2 bottom-2 rounded-lg border shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all z-20 overflow-hidden group/item flex flex-col",
                              item.colorCode.includes('yellow') ? "bg-yellow-50 border-yellow-200" :
                              item.colorCode.includes('red') ? "bg-red-50 border-red-200" :
                              item.colorCode.includes('blue') ? "bg-blue-50 border-blue-200" :
                              item.colorCode.includes('emerald') ? "bg-emerald-50 border-emerald-200" :
                              "bg-indigo-50 border-indigo-200"
                            )}
                            style={{ left: pos.left, width: pos.width }}
                          >
                            {/* Color accent bar top */}
                            <div className={cn("h-1 w-full shrink-0", 
                              item.colorCode.includes('yellow') ? "bg-yellow-400" :
                              item.colorCode.includes('red') ? "bg-red-500" :
                              item.colorCode.includes('blue') ? "bg-blue-500" :
                              item.colorCode.includes('emerald') ? "bg-emerald-500" :
                              "bg-indigo-500"
                            )} />
                            
                            <div className="flex-1 p-2 min-w-0">
                              <div className="flex items-center gap-1.5 text-gray-800 font-bold text-xs truncate mb-1">
                                {item.colorCode.includes('yellow') ? <Wrench className="h-3 w-3 shrink-0" /> : <Wrench className="h-3 w-3 shrink-0" />}
                                <span className="truncate">{item.title}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-gray-600 font-medium">
                                <span>{item.startTime}</span>
                                <ArrowRight className="h-2.5 w-2.5" />
                                <span>{item.endTime}</span>
                              </div>
                            </div>

                            {/* Hover drag handles */}
                            <div className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover/item:opacity-100 bg-black/5 transition-opacity" />
                            <div className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover/item:opacity-100 bg-black/5 transition-opacity" />
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
              
              {/* Extra empty rows to show timeline depth */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`empty-${i}`} className="flex border-b border-gray-100 h-[80px] bg-white opacity-40">
                  <div className="w-[200px] border-r border-gray-200 shrink-0" />
                  <div className="flex-1 relative">
                    <div className="absolute inset-0 grid grid-cols-11 pointer-events-none">
                      {Array.from({ length: 11 }).map((_, idx) => (
                        <div key={idx} className="border-r border-gray-100 last:border-r-0 h-full" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
