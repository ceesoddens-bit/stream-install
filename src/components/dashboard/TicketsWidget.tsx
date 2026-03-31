import React from 'react';
import { ExternalLink, Search, Filter, Columns, SlidersHorizontal, LayoutList, Pin, Bell, MoreHorizontal, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const tickets = [
  { id: 1, title: 'Factureren', date: '25-03', user: 'https://i.pravatar.cc/150?u=u1', type: 'To-do', status: 'Nieuw' },
  { id: 2, title: 'Offerte nabellen', date: '25-03', user: 'https://i.pravatar.cc/150?u=u2', type: 'To-do', status: 'Nieuw' },
  { id: 3, title: 'Offerte nabellen', date: '25-03', user: 'https://i.pravatar.cc/150?u=u3', type: 'To-do', status: 'Nieuw' },
];

export function TicketsWidget() {
  return (
    <Card className="border border-gray-100 shadow-sm flex flex-col h-full bg-white overflow-hidden">
      <CardHeader className="py-3.5 px-4 border-b border-gray-50 flex flex-row items-center justify-between space-y-0 shrink-0">
        <CardTitle className="text-base font-bold text-gray-800">Uw tickets</CardTitle>
        <button className="text-emerald-500 hover:text-emerald-600 transition-colors">
          <ExternalLink className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-2 px-4 border-b border-gray-50 bg-gray-50/50 flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 pr-2 border-r border-gray-200">
            <LayoutList className="h-4 w-4 text-emerald-900" />
            <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            <Columns className="h-4 w-4 text-gray-400" />
            <LayoutList className="h-4 w-4 text-gray-400 rotate-90" />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-700">Voltooid?</span>
            <div className="w-8 h-4 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
            </div>
          </div>

          <div className="flex items-center gap-2 border border-gray-100 bg-white rounded px-2 py-1 shadow-sm group cursor-pointer hover:border-emerald-200 transition-all">
            <span className="text-[11px] font-bold text-gray-700">Alles</span>
            <ChevronLeft className="h-3 w-3 text-gray-400 -rotate-90 group-hover:text-emerald-500 transition-colors" />
          </div>

          <div className="relative flex-1 min-w-[120px]">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input 
              placeholder="Zoeken..." 
              className="h-8 pl-8 text-[11px] bg-white border-gray-100 focus:border-emerald-200 focus:ring-emerald-100 rounded"
            />
          </div>
          
          <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-emerald-800">i</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-gray-100">
              <tr className="text-gray-400 font-bold uppercase tracking-tighter">
                <th className="p-2 pl-4 w-10"><input type="checkbox" className="rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5" /></th>
                <th className="p-2 w-8"><MoreHorizontal className="h-4 w-4" /></th>
                <th className="p-2 w-8"><Pin className="h-4 w-4" /></th>
                <th className="p-2 w-8"><Bell className="h-4 w-4" /></th>
                <th className="p-2 font-bold text-gray-800">Titel</th>
                <th className="p-2 font-bold text-gray-800">De..</th>
                <th className="p-2 font-bold text-gray-800">Gebruikers</th>
                <th className="p-2 font-bold text-gray-800">Afd..</th>
                <th className="p-2 font-bold text-gray-800">Type</th>
                <th className="p-2 font-bold text-gray-800">S..</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group cursor-pointer">
                  <td className="p-2 pl-4"><input type="checkbox" className="rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5" /></td>
                  <td className="p-2"><LayoutList className="h-3.5 w-3.5 text-blue-500" /></td>
                  <td className="p-2"><Pin className="h-3.5 w-3.5 text-gray-300 group-hover:text-emerald-500 transition-colors" /></td>
                  <td className="p-2 flex items-center gap-1.5">
                    <Bell className="h-3.5 w-3.5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1 rounded-sm">0</span>
                  </td>
                  <td className="p-2 font-bold text-emerald-999 group-hover:text-emerald-600 truncate max-w-[150px]">{ticket.title}</td>
                  <td className="p-2 text-gray-500">{ticket.date}</td>
                  <td className="p-2">
                    <Avatar className="h-6 w-6 ring-1 ring-white">
                      <AvatarImage src={ticket.user} />
                      <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="p-2 text-gray-500">-</td>
                  <td className="p-2">
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold border-emerald-100">
                      {ticket.type}
                    </Badge>
                  </td>
                  <td className="p-2 flex items-center justify-center">
                    <div className="p-1 border border-gray-100 rounded hover:bg-white text-emerald-500 hover:shadow-sm">
                        <MoreHorizontal className="h-3 w-3" />
                    </div>
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
