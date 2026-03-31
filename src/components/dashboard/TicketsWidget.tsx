import React, { useState, useEffect } from 'react';
import { ExternalLink, Search, Filter, Columns, SlidersHorizontal, LayoutList, Pin, Bell, MoreHorizontal, User, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ticketService, Ticket } from '@/lib/ticketService';

export function TicketsWidget() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = ticketService.subscribeToTickets(setTickets);
    setLoading(false);
    return () => unsubscribe();
  }, []);

  const handleAddSample = async () => {
    const titles = ["Factureren", "Offerte nabellen", "Project opstellen", "Klantcontact"];
    const users = ["u1", "u2", "u3"];
    
    await ticketService.addTicket({
      title: titles[Math.floor(Math.random() * titles.length)],
      date: "vandaag",
      type: "To-do",
      status: "Nieuw",
      userId: users[Math.floor(Math.random() * users.length)],
      userImage: `https://i.pravatar.cc/150?u=${users[Math.floor(Math.random() * users.length)]}`
    });
  };
  return (
    <Card className="border border-gray-100 shadow-sm flex flex-col h-full bg-white overflow-hidden">
      <CardHeader className="py-3.5 px-4 border-b border-gray-50 flex flex-row items-center justify-between space-y-0 shrink-0">
        <CardTitle className="text-base font-bold text-gray-800">Uw tickets</CardTitle>
        <div className="flex items-center gap-1">
          <button 
           onClick={handleAddSample}
           className="h-8 w-8 rounded-md flex items-center justify-center text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200"
          >
            <Plus className="h-[18px] w-[18px]" />
          </button>
          <button className="h-8 w-8 rounded-md flex items-center justify-center text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200" title="Alle tickets bekijken">
            <ExternalLink className="h-[18px] w-[18px]" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-2 px-4 border-b border-gray-50 bg-gray-50/50 flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 pr-2 border-r border-gray-200">
            <LayoutList className="h-4 w-4 text-emerald-999" />
            <SlidersHorizontal className="h-4 w-4 text-gray-300" />
            <Columns className="h-4 w-4 text-gray-300" />
            <LayoutList className="h-4 w-4 text-gray-300 rotate-90" />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-600">Voltooid?</span>
            <div className="w-8 h-4 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner opacity-80 hover:opacity-100 transition-opacity">
                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
            </div>
          </div>

          <div className="flex items-center gap-2 border border-gray-100 bg-white rounded px-2 py-1 shadow-sm group cursor-pointer hover:border-emerald-200 transition-all">
            <span className="text-[11px] font-bold text-gray-600">Alles</span>
            <ChevronLeft className="h-3 w-3 text-gray-300 -rotate-90 group-hover:text-emerald-500 transition-colors" />
          </div>

          <div className="relative flex-1 min-w-[120px]">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
            <input 
              placeholder="Zoeken..." 
              type="text"
              className="h-8 w-full pl-8 text-[11px] bg-white border border-gray-100 focus:border-emerald-200 focus:ring-0 rounded outline-none"
            />
          </div>
          
          <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center cursor-help">
            <span className="text-[10px] font-bold text-emerald-800">i</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-gray-50">
              <tr className="text-gray-400 font-bold uppercase tracking-tighter">
                <th className="p-2 pl-4 w-10"><input type="checkbox" className="rounded-sm border-gray-200" /></th>
                <th className="p-2 w-8"><MoreHorizontal className="h-3.5 w-3.5" /></th>
                <th className="p-2 w-8"><Pin className="h-3.5 w-3.5" /></th>
                <th className="p-2 w-8"><Bell className="h-3.5 w-3.5" /></th>
                <th className="p-2 font-bold text-gray-600">Titel</th>
                <th className="p-2 font-bold text-gray-600">De..</th>
                <th className="p-2 font-bold text-gray-600">User</th>
                <th className="p-2 font-bold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="p-10 text-center text-gray-300 italic">Laden...</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={10} className="p-10 text-center text-gray-300 italic text-[10px]">Geen tickets. Druk op +</td></tr>
              ) : tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-gray-50 hover:bg-emerald-50/20 transition-colors group cursor-pointer">
                  <td className="p-2 pl-4"><input type="checkbox" className="rounded-sm border-gray-200" /></td>
                  <td className="p-2"><LayoutList className="h-3.5 w-3.5 text-blue-500" /></td>
                  <td className="p-2"><Pin className="h-3.5 w-3.5 text-gray-200 group-hover:text-emerald-500 transition-colors" /></td>
                  <td className="p-2 flex items-center gap-1">
                    <Bell className="h-3.5 w-3.5 text-gray-200" />
                    <span className="text-[10px] bg-gray-100 text-gray-400 px-1 rounded-sm">0</span>
                  </td>
                  <td className="p-2 font-bold text-gray-800 group-hover:text-emerald-700 truncate max-w-[150px]">{ticket.title}</td>
                  <td className="p-2 text-gray-500">{ticket.date}</td>
                  <td className="p-2">
                    <Avatar className="h-5 w-5 border border-gray-100">
                      <AvatarImage src={ticket.userImage} />
                      <AvatarFallback className="text-[8px] bg-gray-50">{ticket.userId.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="p-2">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-[9px] px-1.5 py-0 rounded-sm font-bold uppercase tracking-tighter">
                      {ticket.type}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  );
}
