import React from 'react';
import { Plus, Settings, Search, LayoutList, SlidersHorizontal, Columns, LayoutGrid, MapPin, User, Edit2, ChevronLeft, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const projects = [
  { id: 1, type: 'Commercieel', ref: '2600210', source: 'Direct', title: '2600210', user: 'https://i.pravatar.cc/150?u=u4' },
  { id: 2, type: 'Residentieel', ref: '2600207', source: 'Web', title: '2600207', user: 'https://i.pravatar.cc/150?u=u5' },
  { id: 3, type: 'Commercieel', ref: '2600205', source: 'Direct', title: '2600205', user: 'https://i.pravatar.cc/150?u=u6' },
];

export function ProjectsWidget() {
  return (
    <Card className="border border-gray-100 shadow-sm flex flex-col h-full bg-white overflow-hidden">
      <CardHeader className="py-2 px-4 border-b border-gray-50 flex flex-row items-center justify-between space-y-0 shrink-0">
        <CardTitle className="text-base font-bold text-gray-800">Uw projecten</CardTitle>
        <div className="flex items-center gap-1">
          <button className="h-8 w-8 rounded-md bg-emerald-900 text-white flex items-center justify-center hover:bg-emerald-800 transition-all shadow-sm">
            <Plus className="h-5 w-5" />
          </button>
          <button className="h-8 w-8 rounded-md flex items-center justify-center text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200" title="Alle projecten bekijken">
            <ExternalLink className="h-[18px] w-[18px]" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
        {/* Top Mini Toolbar */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-gray-50 bg-gray-50/20 shrink-0">
           <div className="flex items-center gap-2 px-2 py-0.5 bg-emerald-50 text-emerald-900 rounded-sm border border-emerald-100 cursor-pointer shadow-sm">
            <span className="text-[11px] font-bold">Alles</span>
            <span className="bg-emerald-900 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold min-w-[20px] text-center">
              244
            </span>
          </div>
          <button className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {/* Search Toolbar */}
        <div className="p-2 px-4 border-b border-gray-50 flex items-center gap-3 shrink-0">
           <div className="flex items-center gap-1.5 pr-2 border-r border-gray-200">
            <LayoutList className="h-4 w-4 text-emerald-900" />
            <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            <Columns className="h-4 w-4 text-gray-400" />
            <LayoutGrid className="h-4 w-4 text-gray-400" />
            <span className="text-gray-300 mx-1">|</span>
            <span className="text-gray-300"><ChevronLeft className="h-4 w-4 rotate-180" /></span>
          </div>

          <div className="relative flex-1 min-w-[120px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input 
              placeholder="Zoeken..." 
              className="h-8 pl-8 text-[11px] bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-200 focus:ring-emerald-100 rounded transition-all"
            />
          </div>

          <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-emerald-800">i</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-gray-100">
              <tr className="text-gray-400 font-bold uppercase tracking-tighter">
                <th className="p-2 pl-4 w-10"><input type="checkbox" className="rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5" /></th>
                <th className="p-2 w-8"><MoreHorizontal className="h-4 w-4" /></th>
                <th className="p-2 font-bold text-gray-800">Klanttype</th>
                <th className="p-2 font-bold text-gray-800">Referentie..</th>
                <th className="p-2 font-bold text-gray-800">Bron</th>
                <th className="p-2 font-bold text-gray-800">Projectn..</th>
                <th className="p-2 text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group cursor-pointer">
                  <td className="p-2 pl-4"><input type="checkbox" className="rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5" /></td>
                  <td className="p-2"><ChevronLeft className="h-3 w-3 text-gray-400" /></td>
                  <td className="p-2">
                    <Badge variant="secondary" className={cn(
                      "text-[10px] px-2 py-0.5 rounded uppercase font-bold border-0 h-5 flex items-center w-fit",
                      project.type === 'Commercieel' ? "bg-emerald-50 text-emerald-700 shadow-sm" : "bg-blue-50 text-blue-700 shadow-sm"
                    )}>
                      {project.type}
                    </Badge>
                  </td>
                  <td className="p-2 font-bold text-gray-700 truncate">{project.ref}</td>
                  <td className="p-2 text-gray-500">{project.source}</td>
                  <td className="p-2 font-bold text-emerald-800">{project.title}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-1 rounded hover:bg-white text-emerald-500 border border-transparent hover:border-gray-100">
                            <Edit2 className="h-3 w-3" />
                        </div>
                        <div className="p-1 rounded hover:bg-white text-gray-400 border border-transparent hover:border-gray-100">
                             <Avatar className="h-4 w-4">
                               <AvatarImage src={project.user} />
                               <AvatarFallback><User className="h-2 w-2" /></AvatarFallback>
                             </Avatar>
                        </div>
                        <div className="p-1 rounded hover:bg-white text-emerald-600 border border-transparent hover:border-gray-100">
                            <MapPin className="h-3 w-3" />
                        </div>
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

function MoreHorizontal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
