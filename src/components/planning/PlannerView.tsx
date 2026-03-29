import React, { useState } from 'react';
import { 
  Hourglass, Search, Filter, Folder, X, Tag, ChevronLeft, ChevronRight, 
  Menu, Grid, List, Columns, Calendar as CalendarIcon, Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const projectCards = [
  { id: 1, city: 'Lelystad', name: 'Dylan Lanser', tag: 'Zonnepanelen', tagColor: 'bg-yellow-100 text-yellow-800' },
  { id: 2, city: 'Lelystad', name: 'I. van Uitert', tag: 'Zonnepanelen', tagColor: 'bg-yellow-100 text-yellow-800' },
  { id: 3, city: 'Almere', name: 'Herman Paddenburg -', tag: 'Isolatie', tagColor: 'bg-emerald-100 text-emerald-800' },
  { id: 4, city: 'Lelystad', name: 'Centrada', tag: 'Zonnepanelen', tagColor: 'bg-yellow-100 text-yellow-800' },
  { id: 5, city: 'Lelystad', name: 'Centrada', tag: 'Zonnepanelen', tagColor: 'bg-yellow-100 text-yellow-800' },
  { id: 6, city: 'Lelystad', name: 'Centrada', tag: 'Zonnepanelen', tagColor: 'bg-yellow-100 text-yellow-800' },
  { id: 7, city: 'Lelystad', name: 'Centrada', tag: 'Zonnepanelen', tagColor: 'bg-yellow-100 text-yellow-800' },
];

const teamRows = [
  { eff: '', name: 'Connor van Dreemen', blocks: [{ title: 'Installatie voor Opdrachtgever', start: 7, end: 14.5, color: 'bg-green-100/80 border-green-200 text-green-800' }] },
  { eff: '66.7%', name: 'Damian Tobolski', blocks: [{ title: 'Swifterbant - Zoon - 2500147', start: 8.5, end: 13, color: 'bg-pink-100/80 border-pink-200 text-pink-800' }] },
  { eff: '44.4%', name: 'Daniel Leutscher', blocks: [{ title: 'Lelystad - Dam - 2600121', start: 12, end: 15, color: 'bg-gray-100/80 border-gray-200 text-gray-800' }] },
  { eff: '', name: 'Elektra Team', blocks: [] },
  { eff: '22.2%', name: 'hans alberts', blocks: [{ title: 'Lelystad - van Doore...', start: 8.5, end: 11, color: 'bg-blue-100/80 border-blue-200 text-blue-800' }] },
  { eff: '', name: 'Patrick Van wingerden', blocks: [] },
];

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 07 to 18

export function PlannerView() {
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
                <span className="absolute -top-1.5 -right-1.5 bg-green-600 text-white text-[9px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-full border-2 border-white">
                  1
                </span>
              </div>
              <Folder className="h-4 w-4 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
        </div>

        {/* Active Filters Pill */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium border border-gray-200 w-max">
            Offerte beoordeeld op: oplopend
            <X className="h-3 w-3 cursor-pointer hover:text-gray-900" />
          </div>
        </div>

        {/* Project Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 -tracking-tight">Projecten</h3>
            <span className="bg-green-700 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">15/479</span>
          </div>
          <button className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-1.5 rounded">
            <Tag className="h-4 w-4 rotate-90" />
          </button>
        </div>

        {/* Project Cards (Horizontal Scroll) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {projectCards.map((p, i) => (
            <div 
              key={p.id} 
              className="min-w-[180px] w-[180px] bg-white border border-gray-200 rounded-xl p-3 shadow-sm snap-start hover:border-gray-300 transition-colors cursor-pointer group"
            >
              <div className="text-xs text-gray-500 font-medium mb-0.5">{p.city}</div>
              <div className="text-sm text-gray-900 font-semibold mb-3 truncate" title={p.name}>{p.name}</div>
              <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", p.tagColor)}>
                {p.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Box: Timeline Grid ── */}
      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden mb-6">
        
        {/* Dropdowns */}
        <div className="flex gap-4 p-4 border-b border-gray-100 shrink-0">
          <select className="flex-1 bg-white border border-gray-200 text-gray-500 text-sm rounded-md px-3 py-2 outline-none focus:border-green-500 appearance-none">
            <option>Selecteer groepen voor planning</option>
          </select>
          <select className="flex-1 bg-white border border-gray-200 text-gray-500 text-sm rounded-md px-3 py-2 outline-none focus:border-green-500 appearance-none">
            <option>Selecteer rollen voor filter</option>
          </select>
          <button className="px-6 py-2 border border-green-600 text-green-700 font-semibold text-sm rounded-md hover:bg-green-50 transition-colors">
            Handmatig
          </button>
        </div>

        {/* Date Navigator & Options */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex gap-1.5">
            <button className="p-1.5 rounded bg-gray-100 text-gray-600 hover:text-gray-900"><Menu className="h-4 w-4" /></button>
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-900"><Columns className="h-4 w-4" /></button>
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-900"><Grid className="h-4 w-4" /></button>
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-900"><LayoutGridIcon className="h-4 w-4" /></button>
            <button className="p-1.5 rounded bg-gray-600 text-white"><CalendarIcon className="h-4 w-4" /></button>
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-900"><List className="h-4 w-4" /></button>
          </div>

          <div className="flex items-center gap-4 text-gray-800 font-bold">
            <button className="p-1 hover:bg-gray-100 rounded text-emerald-600"><ChevronLeft className="h-5 w-5" /></button>
            <span>donderdag 26 maart 2026</span>
            <button className="p-1 hover:bg-gray-100 rounded text-emerald-600"><ChevronRight className="h-5 w-5" /></button>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-emerald-700 text-white font-semibold text-sm rounded-md shadow-sm opacity-90 hover:opacity-100">
              Exporteren Als URL
            </button>
            <button className="px-4 py-1.5 bg-emerald-800 text-white font-semibold text-sm rounded-md shadow-sm">
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
                <span className="font-bold text-gray-800 text-xs">Efficiëntie</span>
              </div>
              <div className="w-[200px] border-r border-gray-200 p-3 shrink-0 flex items-end">
                <span className="font-bold text-gray-800 text-xs">Team</span>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="text-center text-xs font-bold text-gray-800 py-1 border-b border-gray-100 border-r border-red-200 relative">
                  W 13
                  <div className="absolute right-0 bottom-0 w-2 h-2 bg-red-500 translate-y-1/2 translate-x-1/2 rotate-45 transform" />
                </div>
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
              <div className="absolute inset-0 right-0 w-full">
                {teamRows.map((row, i) => (
                  <div key={i} className="flex border-b border-gray-100 h-12 w-full">
                    {/* Left Fixed Cols */}
                    <div className="w-[100px] border-r border-gray-100 shrink-0 flex items-center justify-center bg-gray-50/20">
                      <span className="text-xs text-gray-600 font-medium">{row.eff}</span>
                    </div>
                    <div className="w-[200px] border-r border-gray-100 shrink-0 flex items-center px-3 bg-gray-50/20">
                      <span className="text-xs text-gray-800">{row.name}</span>
                    </div>
                    {/* Grid Area */}
                    <div className="flex-1 relative bg-white">
                      {/* Grid background lines */}
                      <div className="absolute inset-0 flex">
                        {HOURS.map(h => (
                          <div key={h} className="flex-1 border-r border-gray-100 h-full shrink-0 min-w-[50px]"></div>
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
                              "absolute top-2 bottom-2 rounded-sm border px-2 flex items-center overflow-hidden cursor-pointer",
                              b.color
                            )}
                            style={{ 
                              left: `${startPercent}%`, 
                              width: `${widthPercent}%`,
                              zIndex: 20
                            }}
                          >
                            <span className="text-[10px] font-medium truncate flex-1">{b.title}</span>
                            <Wrench className="h-2.5 w-2.5 ml-1 shrink-0 opacity-70" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
                
                {/* Empty rows to visually fill up space */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex border-b border-gray-100 h-12 w-full">
                    <div className="w-[100px] border-r border-gray-100 shrink-0 bg-gray-50/20" />
                    <div className="w-[200px] border-r border-gray-100 shrink-0 bg-gray-50/20" />
                    <div className="flex-1 flex bg-white">
                      {HOURS.map(h => (
                        <div key={h} className="flex-1 border-r border-gray-100 h-full shrink-0 min-w-[50px]"></div>
                      ))}
                    </div>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// Just an alias for layout-grid from lucide missing from import initially
const LayoutGridIcon = ({ className }: {className?: string}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
)
