import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { LayoutDashboard } from 'lucide-react';

export function TasksLayout() {
  const [personalView, setPersonalView] = useState(true);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] relative">
      
      {/* ── Top Header Bar ── */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          {/* Custom Taken Icon */}
          <div className="flex flex-col gap-1 w-6 h-6 justify-center">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <div className="h-1.5 w-4 rounded-sm bg-emerald-900"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <div className="h-1.5 w-4 rounded-sm bg-blue-900"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <div className="h-1.5 w-4 rounded-sm bg-emerald-900"></div>
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Takenlijst</h1>
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <div className="flex flex-col flex-1 p-6 overflow-hidden">
        
        {/* Navigation / Filter Bar */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-2 pt-2 mb-8 shrink-0">
          <div className="flex items-center border-b-2 border-emerald-800 px-6 pb-2 pt-1 translate-y-[2px]">
            <span className="text-[13px] font-medium text-gray-900">Persoonlijk</span>
          </div>
          
          <div className="flex items-center px-4 pb-2 pt-1">
            <button 
              type="button"
              onClick={() => setPersonalView(!personalView)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2",
                personalView ? "bg-emerald-800" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
                  personalView ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>

        {/* Empty State Centered Content */}
        <div className="flex flex-col items-center justify-center flex-1 w-full text-center">
          
          <h2 className="text-[28px] font-bold text-gray-900 mb-8">Geen taken gevonden!</h2>
          
          {/* Custom Illustration Composition Mimicking Screenshot */}
          <div className="relative w-64 h-64 flex items-center justify-center mb-6">
            {/* Background blob */}
            <div className="absolute inset-0 bg-[#f1f5f9] rounded-full scale-x-125 scale-y-100 opacity-80" style={{ borderRadius: '48% 52% 51% 49% / 51% 48% 52% 49%'}}></div>
            <div className="absolute inset-0 bg-[#e2e8f0] opacity-40 rounded-full blur-xl transform translate-x-4 translate-y-4"></div>
            
            {/* Window Element */}
            <div className="relative z-10 w-40 h-28 bg-[#e2e8f0] rounded-xl shadow-sm border px-3 py-3 border-[#cbd5e1] flex flex-col items-center">
              <div className="flex gap-1.5 w-full mb-3">
                <div className="w-2 h-2 rounded-full bg-white opacity-80"></div>
                <div className="w-2 h-2 rounded-full bg-white opacity-80"></div>
                <div className="w-2 h-2 rounded-full bg-white opacity-80"></div>
              </div>
              <div className="flex gap-2 w-full flex-1">
                 <div className="flex flex-col gap-2 flex-1 pt-1">
                    <div className="h-2 w-3/4 border-2 border-dashed border-[#cbd5e1] rounded-full"></div>
                    <div className="h-2 w-full border-2 border-dashed border-[#cbd5e1] rounded-full"></div>
                    <div className="h-2 w-2/3 border-2 border-dashed border-[#cbd5e1] rounded-full"></div>
                 </div>
                 <div className="w-14 h-full bg-[#cbd5e1] rounded-lg"></div>
              </div>
            </div>

            {/* Floating geometric elements */}
            <LayoutDashboard className="absolute top-10 left-8 h-4 w-4 text-[#cbd5e1] opacity-60" />
            <div className="absolute top-12 right-10 h-3 w-3 rounded-full bg-[#cbd5e1] opacity-50"></div>
            <div className="absolute bottom-16 right-12 text-[#cbd5e1] opacity-60 font-bold text-xl leading-none">^</div>
            <div className="absolute bottom-12 left-12 text-[#cbd5e1] opacity-60 font-bold text-xl leading-none">^</div>
            <div className="absolute bottom-8 right-24 h-4 w-4 rounded-full border-2 border-[#cbd5e1] opacity-50"></div>
          </div>

          <p className="text-[13px] text-gray-500 max-w-sm mb-6 font-medium">
            U heeft nog geen persoonlijke taken aangemaakt. Klik hieronder om een nieuwe taak aan te maken
          </p>

          <button className="px-5 py-2.5 bg-[#0f764a] hover:bg-[#0c613c] text-white font-medium text-[13px] rounded-lg shadow-sm transition-colors">
            Taak Toevoegen
          </button>

        </div>
      </div>
    </div>
  );
}
