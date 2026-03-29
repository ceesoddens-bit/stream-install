import React from 'react';
import { 
  ChevronLeft, ChevronRight, Menu, Columns3, Grid, Calendar as CalendarIcon, Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function CalendarLayout() {
  const times = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
  const days = [
    { name: 'ma', date: '2-3' },
    { name: 'di', date: '3-3' },
    { name: 'wo', date: '4-3' },
    { name: 'do', date: '5-3' },
    { name: 'vr', date: '6-3' },
    { name: 'za', date: '7-3' },
    { name: 'zo', date: '8-3' }
  ];

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
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">maandag 2 maart 2026</h2>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-md shadow-sm transition-colors">
            Exporteren Als URL
          </button>
          <button className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-md shadow-sm transition-colors">
            Vandaag
          </button>
        </div>

      </div>

      {/* ── Calendar Grid Header ── */}
      <div className="flex border-b border-gray-200 bg-white shrink-0 pr-2"> {/* pr-2 for scrollbar compensation if needed */}
        {/* Time column header */}
        <div className="w-[60px] shrink-0 border-r border-gray-100 flex items-center justify-center py-2">
          <div className="bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-sm">
            W 10
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

      {/* ── Hele Dag Row ── */}
      <div className="flex border-b border-gray-200 bg-white shrink-0 pr-2">
        <div className="w-[60px] shrink-0 border-r border-gray-100 py-1.5">
          <div className="text-[11px] text-gray-500 text-center leading-tight mt-1">
            Hele<br/>dag
          </div>
        </div>
        <div className="flex-1 flex">
          {days.map((_, i) => (
            <div key={i} className="flex-1 border-r border-gray-100 bg-gray-50/20">
              {/* Empty background slots for all-day events */}
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
          {/* Bottom padding to allow scrolling past the very end */}
          <div className="h-10 border-r border-gray-100"></div>
        </div>

        {/* Days Columns Body */}
        <div className="flex-1 flex relative">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="flex-1 border-r border-gray-100 relative">
              {/* Horizontal grid lines for each hour */}
              {times.map((_, timeIndex) => (
                <div key={timeIndex} className="h-[64px] border-b border-gray-200/50 w-full" />
              ))}
              
              {/* Render Event on Thursday (index 3) */}
              {dayIndex === 3 && (
                <div 
                  className="absolute left-0 right-0 mx-1 bg-purple-200 border border-purple-300 rounded shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden p-2 hover:brightness-95 cursor-pointer transition-all hover:z-10"
                  style={{
                    top: `calc(${3 * 64}px + 4px)`, // Hour 10 starts at index 3 (07, 08, 09 -> 10)
                    height: `calc(${2 * 64}px - 8px)` // Duration 2 hours
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-medium text-gray-800 leading-tight">
                      Lelystad - Stolp - 2500073
                    </span>
                    <Wand2 className="h-3.5 w-3.5 text-blue-500 shrink-0 ml-1 mt-0.5" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
