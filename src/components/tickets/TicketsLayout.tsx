import React, { useState } from 'react';
import { 
  Square, Calendar, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, LayoutTemplate, SquareKanban, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function TicketsLayout() {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [showCompleted, setShowCompleted] = useState(true);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      
      {/* ── Top Header Bar ── */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          {/* Custom Tickets Icon */}
          <div className="flex flex-col gap-1 w-6 h-6 justify-center">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <div className="h-1.5 w-4 rounded-sm bg-blue-900"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <div className="h-1.5 w-4 rounded-sm bg-green-900"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <div className="h-1.5 w-4 rounded-sm bg-blue-900"></div>
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Tickets</h1>
        </div>

        {/* View Toggles (List vs Kanban) */}
        <div className="flex bg-gray-100 rounded-lg p-1 mr-6">
          <button 
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-white shadow-sm text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <SquareKanban className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-green-700 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LayoutTemplate className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 px-6 py-3 bg-white border-b border-gray-100 shrink-0">
        
        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex-shrink-0">
          <Square className="h-4 w-4 text-emerald-800" />
          None Selected
        </button>

        <div className="flex items-center gap-3 px-3 py-1.5 border border-gray-200 rounded-md shrink-0">
          <span className="text-sm font-medium text-gray-700">Toon afgerond</span>
          <button 
            type="button"
            onClick={() => setShowCompleted(!showCompleted)}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2",
              showCompleted ? "bg-green-700" : "bg-gray-200"
            )}
          >
            <span
              className={cn(
                "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
                showCompleted ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>

        <button className="flex items-center justify-between gap-2 px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 w-40 shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            Alles
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>

        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-700 transition-colors" />
          <input
            type="text"
            placeholder="Zoeken..."
            className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-md text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-shadow bg-gray-50/50"
          />
        </div>

        <button className="p-2 text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors shrink-0">
          <Filter className="h-4 w-4" />
        </button>
        <button className="p-2 text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors shrink-0">
          <ArrowUpDown className="h-4 w-4" />
        </button>

      </div>

      {/* ── Main Content Area (Empty State with Chevrons) ── */}
      <div className="flex-1 overflow-hidden relative bg-white m-6 mt-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between px-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <div className="flex-1 flex flex-col items-center justify-center pointer-events-none">
          {/* Geen data nog, placeholder voor de visual */}
        </div>
        
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

    </div>
  );
}
