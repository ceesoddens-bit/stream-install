import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Play, Square, Check, Plus, X, Clock, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatSeconds } from '@/lib/timeUtils';

interface HoursWidgetProps {
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
}

interface HourEntry {
  id: number;
  type: string;
  begin: string;
  einde: string;
  pauze: string;
  duur: string;
  project: string;
  date: string;
}

export function HoursWidget({ timerSeconds, isTimerRunning, onToggleTimer, onResetTimer }: HoursWidgetProps) {
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [entries, setEntries] = useState<HourEntry[]>([
    { id: 101, type: 'Project', begin: '08:30', einde: '10:00', pauze: '0m', duur: '01:30:00', project: 'Solar West', date: '26-03-2026' }
  ]);

  const [manualForm, setManualForm] = useState({
    date: '2026-03-31',
    start: '09:00',
    end: '10:00',
    project: 'Solar Expertise'
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [startH, startM] = manualForm.start.split(':').map(Number);
    const [endH, endM] = manualForm.end.split(':').map(Number);
    const durationSeconds = (endH * 3600 + endM * 60) - (startH * 3600 + startM * 60);

    const newEntry: HourEntry = {
      id: Date.now(),
      type: 'Handmatig',
      begin: manualForm.start,
      einde: manualForm.end,
      pauze: '0m',
      duur: formatSeconds(Math.max(0, durationSeconds)),
      project: manualForm.project,
      date: manualForm.date
    };

    setEntries([newEntry, ...entries]);
    setIsManualModalOpen(false);
  };

  const handleAfronden = () => {
    if (timerSeconds === 0) return;
    
    const now = new Date();
    const beginTime = new Date(now.getTime() - timerSeconds * 1000);
    
    const newEntry: HourEntry = {
      id: Date.now(),
      type: 'Project',
      begin: beginTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
      einde: now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
      pauze: '0m',
      duur: formatSeconds(timerSeconds),
      project: 'Lopend Project',
      date: now.toLocaleDateString('nl-NL')
    };

    setEntries([newEntry, ...entries]);
    onResetTimer();
  };

  return (
    <Card className="border border-gray-100 shadow-sm flex flex-col h-full bg-white overflow-hidden relative">
      <CardHeader className="py-3 px-4 border-b border-gray-50 flex flex-row items-center justify-between space-y-0 shrink-0">
        <div className="flex flex-col">
          <CardTitle className="text-base font-bold text-gray-800">Urenregistratie</CardTitle>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">Beheer of maak nieuwe urenregistraties</p>
        </div>
        
        {/* Date Switcher */}
        <div className="flex items-center gap-1.5">
          <button className="p-1 hover:bg-gray-50 rounded text-emerald-500 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 px-2 py-1.5 border border-gray-100 rounded bg-gray-50/20 group cursor-pointer hover:border-emerald-200 transition-all">
            <span className="text-[11px] font-bold text-gray-700">26-03-2026</span>
            <CalendarIcon className="h-3.5 w-3.5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
          </div>
          <button className="p-1 hover:bg-gray-50 rounded text-emerald-500 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
          
          <div className="h-4 w-px bg-gray-200 mx-1" />
          
          <button className="h-8 w-8 rounded-md flex items-center justify-center text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200" title="Mijn uren volledig bekijken">
            <ExternalLink className="h-[18px] w-[18px]" />
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex-1 overflow-hidden flex flex-col gap-4">
        
        {/* Blue Timer Bar */}
        <div className="bg-[#EBF7FF] border border-[#CEE9FF] rounded-lg p-2.5 px-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <span className={cn(
            "text-xl font-mono font-extrabold text-blue-600 tracking-widest",
            isTimerRunning && "animate-pulse"
          )}>
            {formatSeconds(timerSeconds)}
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={onToggleTimer}
              className={cn(
                "p-1.5 rounded-md shadow-sm transition-all border border-gray-100",
                isTimerRunning 
                  ? "bg-white text-orange-500 hover:bg-orange-50 ring-1 ring-orange-200 shadow-orange-100" 
                  : "bg-white text-emerald-500 hover:bg-emerald-50 ring-1 ring-emerald-200 shadow-emerald-100"
              )}
            >
              {isTimerRunning ? <Square className="h-4 w-4 fill-current text-white stroke-orange-500 fill-orange-500" /> : <Play className="h-4 w-4 fill-emerald-500 text-emerald-500" />}
            </button>
            <button 
              onClick={onResetTimer}
              disabled={timerSeconds === 0}
              className="p-1.5 bg-white rounded-md shadow-sm text-gray-400 hover:bg-gray-50 transition-colors border border-gray-100 disabled:opacity-50"
            >
              <Square className="h-4 w-4 fill-current rotate-45 scale-75" />
            </button>
          </div>
        </div>

        {/* Mini Table Area */}
        <div className="flex-1 overflow-hidden flex flex-col border border-gray-50 rounded bg-gray-50/5">
          <div className="overflow-y-auto w-full">
            <table className="w-full text-left text-[11px] border-collapse relative">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-gray-100">
                  <th className="p-2 py-1.5 font-bold text-gray-400 uppercase tracking-tighter">Type</th>
                  <th className="p-2 py-1.5 font-bold text-gray-400 uppercase tracking-tighter">Begin</th>
                  <th className="p-2 py-1.5 font-bold text-gray-400 uppercase tracking-tighter">Einde</th>
                  <th className="p-2 py-1.5 font-bold text-gray-400 uppercase tracking-tighter">Pauze</th>
                  <th className="p-2 py-1.5 font-bold text-gray-400 uppercase tracking-tighter">Duur</th>
                  <th className="p-2 py-1.5 font-bold text-gray-400 uppercase tracking-tighter text-right pr-4">Project</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {/* Live Session Row Hint */}
                {isTimerRunning && (
                  <tr className="bg-blue-50/30 group animate-in fade-in duration-500">
                      <td className="p-2">
                        <span className="flex items-center gap-1 text-blue-600 font-bold">
                            <Clock className="h-2.5 w-2.5 animate-spin duration-[3s]" /> Live
                        </span>
                      </td>
                      <td className="p-2 text-gray-500">Active</td>
                      <td className="p-2 text-gray-500">Now</td>
                      <td className="p-2">0m</td>
                      <td className="p-2 font-mono font-bold text-blue-700">{formatSeconds(timerSeconds)}</td>
                      <td className="p-2 text-right pr-4 italic text-gray-400">Wordt bijgehouden...</td>
                  </tr>
                )}
                
                {entries.map(entry => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-2 font-bold text-gray-800">{entry.type}</td>
                    <td className="p-2 text-gray-500">{entry.begin}</td>
                    <td className="p-2 text-gray-500">{entry.einde}</td>
                    <td className="p-2 text-gray-500">{entry.pauze}</td>
                    <td className="p-2 font-bold text-emerald-800 font-mono">{entry.duur}</td>
                    <td className="p-2 text-right pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                            <span className="text-gray-600 truncate max-w-[80px]">{entry.project}</span>
                            <MapPin className="h-2.5 w-2.5 text-emerald-400 opacity-0 group-hover:opacity-100" />
                        </div>
                    </td>
                  </tr>
                ))}
                
                {entries.length === 0 && !isTimerRunning && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-300 font-medium italic">Geen uren gelogd vandaag</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Area */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50 flex-shrink-0">
          <Button 
            onClick={() => setIsManualModalOpen(true)}
            variant="outline" 
            size="sm" 
            className="h-8 text-[11px] font-bold border-emerald-900 bg-emerald-900 text-white hover:bg-emerald-800 hover:text-white px-4 rounded-md shadow-sm transition-all active:scale-95"
          >
            Handmatig
          </Button>
          <div className="flex items-center gap-2">
           <Button 
            onClick={onToggleTimer}
            size="sm" 
            className={cn(
                "h-8 text-[11px] font-bold px-4 rounded-md gap-1.5 transition-all shadow-sm ring-1",
                isTimerRunning 
                    ? "bg-orange-600 border-orange-500 ring-orange-100 hover:bg-orange-700 text-white" 
                    : "bg-emerald-900 border-emerald-800 ring-emerald-100 text-white hover:bg-emerald-800"
            )}
           >
              {isTimerRunning ? (
                  <><Square className="h-3 w-3 fill-current" /> Pauzeren</>
              ) : (
                  <><Play className="h-3 w-3 fill-current" /> {timerSeconds > 0 ? "Hervatten" : "Begin"}</>
              )}
           </Button>
           <Button 
            onClick={handleAfronden}
            disabled={timerSeconds === 0}
            size="sm" 
            variant="secondary" 
            className={cn(
                "h-8 text-[11px] font-bold px-4 rounded-md gap-1.5 transition-all shadow-sm ring-1",
                timerSeconds > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-50 hover:bg-emerald-100" : "bg-gray-100 text-gray-400 border-transparent ring-transparent"
            )}
           >
              <Check className="h-3 w-3" /> Afronden
           </Button>
          </div>
        </div>
      </CardContent>

      {/* Manual Entry Custom Modal Overlay */}
      {isManualModalOpen && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-[100] p-4 flex items-center justify-center animate-in fade-in duration-200">
            <Card className="w-full max-w-xs shadow-2xl border-emerald-100 animate-in zoom-in-95 duration-200 overflow-hidden">
                <CardHeader className="py-3 px-4 bg-emerald-900 text-white flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 shadow-text">
                        <Plus className="h-4 w-4" /> Uren Toevoegen
                    </CardTitle>
                    <button onClick={() => setIsManualModalOpen(false)} className="hover:bg-white/10 p-1 rounded-sm transition-colors text-white">
                        <X className="h-4 w-4" />
                    </button>
                </CardHeader>
                <CardContent className="p-4 space-y-4 bg-white/95">
                    <form onSubmit={handleManualSubmit} className="space-y-3">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Datum</Label>
                            <Input 
                                type="date" 
                                value={manualForm.date} 
                                onChange={(e) => setManualForm({...manualForm, date: e.target.value})}
                                className="h-8 text-xs border-gray-100 focus:ring-emerald-100" 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Start</Label>
                                <Input 
                                    type="time" 
                                    value={manualForm.start}
                                    onChange={(e) => setManualForm({...manualForm, start: e.target.value})}
                                    className="h-8 text-xs border-gray-100 focus:ring-emerald-100" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Einde</Label>
                                <Input 
                                    type="time" 
                                    value={manualForm.end}
                                    onChange={(e) => setManualForm({...manualForm, end: e.target.value})}
                                    className="h-8 text-xs border-gray-100 focus:ring-emerald-100" 
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Project</Label>
                            <Input 
                                placeholder="Selecteer project..." 
                                value={manualForm.project}
                                onChange={(e) => setManualForm({...manualForm, project: e.target.value})}
                                className="h-8 text-xs border-gray-100 focus:ring-emerald-100" 
                            />
                        </div>
                        <div className="pt-2">
                           <Button type="submit" className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold h-9 shadow-emerald-900/10">
                                Opslaan & Toevoegen
                           </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
      )}
    </Card>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
