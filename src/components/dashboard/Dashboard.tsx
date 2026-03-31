import React from 'react';
import { CalendarWidget } from './CalendarWidget';
import { HoursWidget } from './HoursWidget';
import { TicketsWidget } from './TicketsWidget';
import { ProjectsWidget } from './ProjectsWidget';

interface DashboardProps {
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
}

export function Dashboard({ timerSeconds, isTimerRunning, onToggleTimer, onResetTimer }: DashboardProps) {
  return (
    <div className="h-full w-full bg-[#f8fafc]/50 overflow-hidden flex flex-col p-4 gap-4">
      {/* ── Main Dashboard Grid ── */}
      <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden min-h-0">
        
        {/* Left Column: Calendar & Tickets */}
        <div className="col-span-8 flex flex-col gap-4 min-h-0 overflow-hidden">
          <div className="flex-1 min-h-[300px]">
            <CalendarWidget />
          </div>
          <div className="flex-1 min-h-[300px]">
             <TicketsWidget />
          </div>
        </div>

        {/* Right Column: Time Tracking & Projects */}
        <div className="col-span-4 flex flex-col gap-4 min-h-0 overflow-hidden">
          <div className="flex-1 min-h-[300px]">
            <HoursWidget 
              timerSeconds={timerSeconds}
              isTimerRunning={isTimerRunning}
              onToggleTimer={onToggleTimer}
              onResetTimer={onResetTimer}
            />
          </div>
          <div className="flex-1 min-h-[300px]">
            <ProjectsWidget />
          </div>
        </div>
        
      </div>
    </div>
  );
}
