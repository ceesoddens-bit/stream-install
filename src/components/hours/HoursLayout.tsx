import React, { useEffect, useMemo, useRef, useState } from 'react';
import { 
  Settings, Columns3, SlidersHorizontal, AlignJustify, Maximize2, Download, Search, Info, Plus, Play, Pause
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { hoursService, HourEntry } from '@/lib/hoursService';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { HoursAddModal } from './HoursAddModal';

type HoursColumnKey =
  | 'select'
  | 'gebruiker'
  | 'begin'
  | 'einde'
  | 'duur'
  | 'type'
  | 'project'
  | 'status'
  | 'spacer';

type HoursColumnDef = {
  key: HoursColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const hoursColumns: HoursColumnDef[] = [
  { key: 'select', width: 52, minWidth: 44, resizable: false, thClassName: 'p-3 pl-4 text-center' },
  { key: 'gebruiker', label: 'Gebruiker', width: 180, minWidth: 150, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'begin', label: 'Begin', width: 150, minWidth: 120, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'einde', label: 'Einde', width: 150, minWidth: 120, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'duur', label: 'Duur', width: 100, minWidth: 90, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'type', label: 'Type', width: 120, minWidth: 110, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'project', label: 'Project / Ticket', width: 240, minWidth: 160, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'status', label: 'Status', width: 140, minWidth: 120, resizable: true, thClassName: 'p-3 font-semibold text-gray-800' },
  { key: 'spacer', width: 120, minWidth: 100, resizable: false, thClassName: 'p-3 border-l border-transparent' },
];

export function HoursLayout() {
  const [hours, setHours] = useState<HourEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'Urenlijst' | 'Rapportage'>('Urenlijst');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [timerDuration, setTimerDuration] = useState(0); // in seconds
  
  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = hoursService.subscribeToHours((data) => {
      setHours(data);
    });
    return () => unsubscribe();
  }, []);

  // Timer interval
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerStart) {
      interval = setInterval(() => {
        setTimerDuration(Math.floor((new Date().getTime() - timerStart.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerStart]);

  const toggleTimer = async () => {
    if (!isTimerRunning) {
      setTimerStart(new Date());
      setIsTimerRunning(true);
    } else {
      // Stop timer and save
      const end = new Date();
      setIsTimerRunning(false);
      if (timerStart) {
        const durationMins = Math.max(1, Math.round(timerDuration / 60));
        const hoursPart = Math.floor(durationMins / 60);
        const minsPart = durationMins % 60;
        
        try {
          await hoursService.addEntry({
            userId: 'current-user',
            userName: 'Huidige Gebruiker',
            type: 'Werktijd',
            begin: timerStart.toISOString(),
            einde: end.toISOString(),
            pauze: '0',
            duur: `${hoursPart.toString().padStart(2, '0')}:${minsPart.toString().padStart(2, '0')}`,
            durationMinutes: durationMins,
            date: format(timerStart, 'yyyy-MM-dd'),
            status: 'Concept'
          });
        } catch (err) {
          console.error(err);
          alert('Fout bij opslaan uren: ' + (err as Error).message);
        }
      }
      setTimerStart(null);
      setTimerDuration(0);
    }
  };

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  const [columnWidths, setColumnWidths] = useState<Record<HoursColumnKey, number>>(() => {
    return hoursColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<HoursColumnKey, number>);
  });
  const resizingRef = useRef<{
    key: HoursColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const tableMinWidth = useMemo(() => {
    return hoursColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const startResize = (key: HoursColumnKey) => (e: React.PointerEvent) => {
    const col = hoursColumns.find(c => c.key === key);
    if (!col || !col.resizable) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = columnWidths[key] ?? col.width;
    const minWidth = col.minWidth;
    resizingRef.current = { key, startX, startWidth, minWidth };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onPointerMove = (evt: PointerEvent) => {
      const nextWidth = Math.max(minWidth, startWidth + (evt.clientX - startX));
      setColumnWidths(prev => ({ ...prev, [key]: nextWidth }));
    };

    const onPointerUp = () => {
      resizingRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onPointerMove);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp, { once: true });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative space-y-4 pt-2 pb-8">
      
      {/* ── Page Header Mimicking Screenshot ── */}
      <div className="flex items-center justify-between px-6 pb-2 shrink-0">
        <div className="flex items-center gap-3">
          {/* Custom Icon */}
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
          <h1 className="text-xl font-bold text-gray-900">Urenregistratie</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer Display */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <span className="font-mono text-sm font-bold text-gray-700 w-[60px] text-center">
              {formatTimer(timerDuration)}
            </span>
            <button
              onClick={toggleTimer}
              className={cn(
                "p-1.5 rounded-md transition-all",
                isTimerRunning ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
              )}
            >
              {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-emerald-700 transition-all"
          >
            <Plus className="h-4 w-4" /> Uren Toevoegen
          </button>
        </div>
      </div>

      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        
        {/* Top Tabs and Action Row */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-6 pb-1">
            {(['Urenlijst', 'Rapportage'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex items-center gap-2 text-sm font-bold pb-1 transition-all",
                  activeTab === tab ? "text-gray-900 border-b-2 border-emerald-800" : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab} 
                {tab === 'Urenlijst' && (
                  <span className={cn(
                    "text-[11px] px-1.5 py-0.5 rounded-sm leading-none shrink-0 font-bold",
                    activeTab === tab ? "bg-emerald-800 text-white" : "bg-gray-200 text-gray-600"
                  )}>
                    {hours.length}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {activeTab === 'Urenlijst' ? (
          <>
            {/* Toolbar */}
            <div className="px-4 py-2 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
              <div className="flex items-center gap-4 text-[13px] font-semibold text-gray-700">
                <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><Columns3 className="h-4 w-4" /> Kolommen</button>
                <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
                <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><AlignJustify className="h-4 w-4" /> Dichtheid</button>
                <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><Maximize2 className="h-4 w-4" /> Schaal</button>
                <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><Download className="h-4 w-4" /> Exporteren</button>
              </div>
              <div className="relative w-64 flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoeken..."
                  className="pl-9 pr-8 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50 w-full"
                />
                <Info className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-800" />
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-auto flex-1">
              <table
                className="w-full text-left text-[13px] border-collapse table-fixed"
                style={{ minWidth: tableMinWidth }}
              >
                <colgroup>
                  {hoursColumns.map(col => (
                    <col key={col.key} style={{ width: columnWidths[col.key] }} />
                  ))}
                </colgroup>
                <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-gray-100/50">
                  <tr className="border-b border-gray-200">
                    {hoursColumns.map(col => (
                      <th
                        key={col.key}
                        className={cn('relative select-none overflow-hidden whitespace-nowrap', col.thClassName)}
                      >
                        {col.key === 'select' ? (
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4" />
                        ) : col.key === 'spacer' ? null : (
                          <span className="truncate block">{col.label}</span>
                        )}

                        {col.resizable ? (
                          <div
                            onPointerDown={startResize(col.key)}
                            className="absolute right-0 top-0 h-full w-2 cursor-col-resize group"
                            role="separator"
                            aria-orientation="vertical"
                            aria-label={`Resize column ${col.label ?? col.key}`}
                          >
                            <div className="absolute right-0 top-0 h-full w-px bg-transparent group-hover:bg-gray-300" />
                          </div>
                        ) : null}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hours.length === 0 ? (
                    <tr>
                      <td colSpan={hoursColumns.length} className="text-center py-40">
                        <span className="text-[13px] text-gray-700">Geen resultaten.</span>
                      </td>
                    </tr>
                  ) : (
                    hours.filter(h => 
                      h.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      h.project?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      h.type.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((hour) => (
                      <tr key={hour.id} className="border-b border-gray-100 hover:bg-gray-50/50 group">
                        <td className="p-3 pl-4 text-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4" />
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-gray-900">{hour.userName}</div>
                        </td>
                        <td className="p-3 text-gray-700">
                          {format(new Date(hour.begin), 'dd MMM HH:mm', { locale: nl })}
                        </td>
                        <td className="p-3 text-gray-700">
                          {format(new Date(hour.einde), 'dd MMM HH:mm', { locale: nl })}
                        </td>
                        <td className="p-3 font-mono text-sm text-gray-700">
                          {hour.duur}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="bg-gray-50 text-gray-700">{hour.type}</Badge>
                        </td>
                        <td className="p-3 text-gray-700 truncate max-w-[200px]">
                          {hour.project || hour.ticketId || '-'}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className={cn(
                            "text-[10px] uppercase",
                            hour.status === 'Goedgekeurd' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            hour.status === 'Ingediend' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            hour.status === 'Afgewezen' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          )}>
                            {hour.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right border-l border-transparent">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {hour.status !== 'Goedgekeurd' && (
                              <button 
                                onClick={() => hoursService.updateEntry(hour.id!, { status: 'Goedgekeurd' })}
                                className="p-1.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors"
                                title="Goedkeuren"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                              </button>
                            )}
                            {hour.status !== 'Afgewezen' && (
                              <button 
                                onClick={() => hoursService.updateEntry(hour.id!, { status: 'Afgewezen' })}
                                className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                title="Afwijzen"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer info area */}
            <div className="bg-white border-t border-gray-200 p-4 shrink-0 flex items-center justify-end">
              <div className="flex items-center gap-6 text-[13px] font-medium text-gray-600">
                <div className="flex items-center gap-2">
                  <span>Regels per pagina:</span>
                  <select className="border-none outline-none font-semibold text-gray-800 focus:ring-0 bg-transparent cursor-pointer">
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </div>
                <span>{hours.length > 0 ? `1–${hours.length} of ${hours.length}` : '0-0 of 0'}</span>
                <div className="flex gap-4 items-center pl-2">
                  <button className="text-gray-300 cursor-not-allowed">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <button className="text-gray-300 cursor-not-allowed">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <AlignJustify className="h-8 w-8 text-emerald-800 opacity-80" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Rapportage & Aggregatie</h2>
              <p className="text-sm text-gray-500 mb-6">
                Hier kun je een uren-uitdraai genereren per medewerker of project. Deze feature verzamelt alle uren op basis van <code>durationMinutes</code> en kan exporteren naar CSV/PDF.
              </p>
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100 text-sm font-medium">
                Totaal geregistreerd in systeem: <strong>{hours.reduce((acc, h) => acc + (h.durationMinutes || 0), 0) / 60} uur</strong>
              </div>
            </div>
          </div>
        )}

      </div>
      
      {isAddModalOpen && <HoursAddModal onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
}
