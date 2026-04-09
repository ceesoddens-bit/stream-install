import React, { useState, useEffect } from 'react';
import { 
  Square, Calendar, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, LayoutTemplate, SquareKanban, ChevronDown, Plus, Trash2, Clock, User, AlertCircle, Paperclip
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ticketService, Ticket } from '@/lib/ticketService';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TicketFormModal } from './TicketFormModal';

const statusColumns: { id: Ticket['status']; label: string; color: string }[] = [
  { id: 'Nieuw', label: 'Nieuw', color: 'bg-blue-100/50 border-blue-200' },
  { id: 'Bezig', label: 'In Behandeling', color: 'bg-amber-100/50 border-amber-200' },
  { id: 'Wachten', label: 'Wachten', color: 'bg-purple-100/50 border-purple-200' },
  { id: 'Afgerond', label: 'Afgerond', color: 'bg-emerald-100/50 border-emerald-200' },
];

export function TicketsLayout() {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = ticketService.subscribeToTickets((fetched) => {
      setTickets(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddSample = async () => {
    const titles = ["Factuur #25001 - Jan van Doore", "Offerte nabellen - Gijs Noort", "Klantvraag: Zonnepanelen defect?", "Planning checken voor morgen", "Inkoopartikel bestellen"];
    const priorities: Ticket['priority'][] = ['Low', 'Medium', 'High'];
    const statuses: Ticket['status'][] = ['Nieuw', 'Bezig', 'Wachten', 'Afgerond'];
    const types = ["Facturatie", "Consult", "Techniek", "Inkoop"];
    
    await ticketService.addTicket({
      title: titles[Math.floor(Math.random() * titles.length)],
      description: "Sample ticket gegenereerd voor demo.",
      date: new Date().toISOString().split('T')[0],
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      userId: `user-${Math.floor(Math.random() * 10)}`,
      userImage: `https://i.pravatar.cc/150?u=${Math.random()}`
    });
  };

  const handleUpdateStatus = async (id: string, newStatus: Ticket['status']) => {
    await ticketService.updateTicket(id, { status: newStatus });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Ticket verwijderen?")) {
      await ticketService.deleteTicket(id);
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      
      {/* ── Page Header Mimicking Screenshot ── */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white shadow-sm">
             <SquareKanban className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 -tracking-tight">Tickets & Regels</h1>
        </div>

        <div className="flex items-center gap-4">
           {/* View Toggles */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('kanban')}
              className={cn("p-1.5 rounded-md transition-all text-xs font-bold flex items-center gap-2", viewMode === 'kanban' ? 'bg-white shadow-sm text-emerald-800' : 'text-gray-400')}
            >
              <SquareKanban className="h-4 w-4" /> Board
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-1.5 rounded-md transition-all text-xs font-bold flex items-center gap-2", viewMode === 'list' ? 'bg-white shadow-sm text-emerald-800' : 'text-gray-400')}
            >
              <LayoutTemplate className="h-4 w-4" /> Lijst
            </button>
          </div>

          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-emerald-700 transition-all border border-emerald-999"
          >
            <Plus className="h-4 w-4" /> Nieuwe Ticket
          </button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-4 px-6 py-3 bg-white border-b border-gray-100 shrink-0">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Zoeken naar tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-emerald-600 focus:ring-0 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
           <span>{filteredTickets.length} tickets gevonden</span>
        </div>
      </div>

      {/* ── Main Canvas (Conditional Board or List) ── */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-gray-400 italic">Gegevens ophalen...</div>
        ) : (
          viewMode === 'kanban' ? (
            <div className="flex gap-6 h-full min-w-[1200px]">
              {statusColumns.map((col) => {
                const colTickets = filteredTickets.filter(t => t.status === col.id);
                return (
                  <div key={col.id} className="flex-1 flex flex-col min-w-[300px]">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-900 uppercase tracking-widest leading-none bg-white py-1 px-2 border border-gray-100 rounded shadow-sm">
                          {col.label}
                        </span>
                        <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-1.5 py-0.5 rounded-full leading-none">
                          {colTickets.length}
                        </span>
                      </div>
                      <button 
                        onClick={() => setIsFormOpen(true)}
                        className="text-gray-400 hover:text-emerald-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className={cn("flex-1 p-2 rounded-xl border border-dashed transition-all", col.color)}>
                      <div className="space-y-4">
                        {colTickets.map(ticket => (
                          <div 
                            key={ticket.id}
                            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant="outline" className={cn(
                                "text-[9px] font-bold px-1.5 py-0 border leading-none uppercase",
                                ticket.priority === 'High' ? "bg-red-50 text-red-700 border-red-200" :
                                ticket.priority === 'Medium' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                "bg-emerald-50 text-emerald-700 border-emerald-200"
                              )}>
                                {ticket.priority}
                              </Badge>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                 {ticket.attachments && ticket.attachments.length > 0 && (
                                   <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold mr-2">
                                      <Paperclip className="h-3 w-3" />
                                      {ticket.attachments.length}
                                   </div>
                                 )}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDelete(ticket.id!); }}
                                  className="p-1 text-gray-300 hover:text-red-500 transition-all"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                            
                            <h3 className="text-sm font-bold text-gray-900 mb-2 leading-tight">{ticket.title}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{ticket.description}</p>
                            
                            {/* Attachment Pills If not hover */}
                            {ticket.attachments && ticket.attachments.length > 0 && (
                               <div className="flex flex-wrap gap-1 mb-4 group-hover:hidden">
                                  {ticket.attachments.slice(0, 2).map((att, i) => (
                                    <div key={i} className="flex items-center gap-1 py-0.5 px-1.5 bg-gray-50 border border-gray-100 rounded text-[9px] text-gray-400 font-bold truncate max-w-[80px]">
                                       <Paperclip className="h-2.5 w-2.5" />
                                       {att.name}
                                    </div>
                                  ))}
                                  {ticket.attachments.length > 2 && <span className="text-[9px] text-gray-300 font-bold">+{ticket.attachments.length - 2}</span>}
                               </div>
                            )}

                            <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                <Clock className="h-3 w-3" />
                                {ticket.date}
                              </div>
                              <Avatar className="h-6 w-6 border border-white shadow-sm shrink-0">
                                <AvatarImage src={ticket.userImage} />
                                <AvatarFallback className="text-[10px] font-bold bg-emerald-100 text-emerald-800">{ticket.userId.charAt(0)}</AvatarFallback>
                              </Avatar>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Simple List View Placeholder */
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
               <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                       <th className="p-3 font-bold text-gray-600 text-xs">TICKET</th>
                       <th className="p-3 font-bold text-gray-600 text-xs text-center">STATUS</th>
                       <th className="p-3 font-bold text-gray-600 text-xs text-center">PRIO</th>
                       <th className="p-3 font-bold text-gray-600 text-xs">DATUM</th>
                       <th className="p-3 font-bold text-gray-600 text-xs text-right pr-6">ASSIGNEE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map(ticket => (
                      <tr key={ticket.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{ticket.title}</div>
                          <div className="text-xs text-gray-400 uppercase tracking-tighter">{ticket.type}</div>
                        </td>
                        <td className="p-4 text-center">
                           <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-tighter">
                            {ticket.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                           <span className={cn(
                             "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-tighter",
                             ticket.priority === 'High' ? "bg-red-50 text-red-700 border-red-100" : "bg-gray-50 text-gray-600 border-gray-200"
                           )}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-medium text-gray-500 font-mono">{ticket.date}</td>
                        <td className="p-4 text-right pr-6">
                           <div className="flex justify-end gap-2 items-center">
                             <span className="text-xs text-gray-700 font-medium">{ticket.userId}</span>
                             <Avatar className="h-6 w-6">
                                <AvatarImage src={ticket.userImage} />
                                <AvatarFallback>{ticket.userId.charAt(0)}</AvatarFallback>
                             </Avatar>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )
        )}
      </div>

      {isFormOpen && <TicketFormModal onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}
