import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function CalendarWidget() {
  const hours = ['07', '08', '09', '10', '11', '12', '13', '14'];

  return (
    <Card className="border border-gray-100 shadow-sm flex flex-col h-full bg-white overflow-hidden">
      <CardHeader className="py-3 px-4 border-b border-gray-50 flex flex-row items-center justify-between space-y-0 shrink-0">
        <CardTitle className="text-base font-bold text-gray-800">Kalender</CardTitle>
        <button className="h-8 w-8 rounded-md flex items-center justify-center text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200" title="Kalender volledig bekijken">
          <ExternalLink className="h-[18px] w-[18px]" />
        </button>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
        {/* Day Header */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div className="w-12 border-r border-gray-100 p-2 flex items-center justify-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">W13</span>
          </div>
          <div className="flex-1 p-2 text-center">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">donderdag</span>
          </div>
        </div>

        {/* Scrollable Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Hele dag row */}
          <div className="flex border-b border-gray-100 bg-gray-50/20">
            <div className="w-12 border-r border-gray-100 p-1 flex flex-col items-center justify-center leading-none">
              <span className="text-[9px] text-gray-400 font-medium">Hele</span>
              <span className="text-[9px] text-gray-400 font-medium">dag</span>
            </div>
            <div className="flex-1 h-10"></div>
          </div>

          {/* Hourly slots */}
          {hours.map((hour) => (
            <div key={hour} className="flex border-b border-gray-50 last:border-0 h-12 group">
              <div className="w-12 border-r border-gray-100 p-1.5 text-center shrink-0 flex items-start justify-center">
                <span className="text-[11px] font-bold text-gray-400 group-hover:text-emerald-600 transition-colors">{hour}</span>
              </div>
              <div className="flex-1 relative">
                {/* Visual grid lines for half hours */}
                <div className="absolute inset-0 border-t border-gray-50/50 top-1/2 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
