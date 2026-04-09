import { projectService, Project } from '@/lib/projectService';
import { Plus, Settings, Search, LayoutList, SlidersHorizontal, Columns, LayoutGrid, FileText, Link, Settings2, ExternalLink, ChevronLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

export function ProjectsWidget() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = projectService.subscribeToProjects((fetched) => {
      setProjects(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddSample = async () => {
    const idx = projects.length + 1;
    const base = `26002${(idx % 100).toString().padStart(2, '0')}`;
    await projectService.addProject({
      name: `Project ${idx}`,
      client: "Installatiegroep Duurzaam",
      customerType: idx % 2 === 0 ? 'Residentieel' : 'Commercieel',
      reference: `${base}0`,
      source: `${base}1`,
      projectNumber: `${base}2`,
      status: 'Lopend',
      progress: 45,
      dueDate: "2026-04-15",
      team: ["Sven"],
      priority: projects.length % 2 === 0 ? 'High' : 'Medium'
    });
  };

  return (
    <Card className="border border-gray-100 shadow-sm flex flex-col h-full bg-white overflow-hidden">
      <CardHeader className="py-2 px-4 border-b border-gray-50 flex flex-row items-center justify-between space-y-0 shrink-0">
        <CardTitle className="text-base font-bold text-gray-800">Uw projecten</CardTitle>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleAddSample}
            className="h-8 w-8 rounded-md bg-emerald-900 text-white flex items-center justify-center hover:bg-emerald-800 transition-all shadow-sm"
          >
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
              {projects.length}
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
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-gray-100">
              <tr className="text-gray-400 font-bold uppercase tracking-tighter">
                <th className="p-2 pl-4 font-bold text-gray-800">Klanttype</th>
                <th className="p-2 font-bold text-gray-800">Referentie</th>
                <th className="p-2 font-bold text-gray-800">Bron</th>
                <th className="p-2 font-bold text-gray-800">Projectnr</th>
                <th className="p-2 w-[96px]" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400 italic">Projecten laden...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400 italic">Geen projecten. Klik op + om er één te maken.</td></tr>
              ) : projects.map((project) => (
                <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group cursor-pointer">
                  <td className="p-2">
                    <Badge variant="secondary" className={cn(
                      "text-[10px] px-2 py-0.5 rounded uppercase font-bold border-0 h-5 flex items-center w-fit shadow-sm",
                      "bg-emerald-50 text-emerald-700"
                    )}>
                      {project.customerType ?? 'Commercieel'}
                    </Badge>
                  </td>
                  <td className="p-2 font-bold text-gray-700 truncate">{project.reference ?? project.id?.slice(-7) ?? '-'}</td>
                  <td className="p-2 text-gray-500">{project.source ?? '-'}</td>
                  <td className="p-2 font-bold text-emerald-800">{project.projectNumber ?? '-'}</td>
                  <td className="p-2">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 rounded hover:bg-white text-emerald-600 border border-transparent hover:border-gray-100 transition-all">
                        <FileText className="h-3 w-3" />
                      </button>
                      <button className="p-1 rounded hover:bg-white text-emerald-600 border border-transparent hover:border-gray-100 transition-all">
                        <Link className="h-3 w-3" />
                      </button>
                      <button className="p-1 rounded hover:bg-white text-emerald-600 border border-transparent hover:border-gray-100 transition-all">
                        <Settings2 className="h-3 w-3" />
                      </button>
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

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
