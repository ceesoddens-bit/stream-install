import React, { useState, useEffect } from 'react';
import { 
  Plus, Columns3, SlidersHorizontal, AlignJustify, Search, Filter, Zap, Trash2, Edit
} from 'lucide-react';
import { teamService, Technician } from '@/lib/teamService';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { EditDialog } from '../ui/EditDialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

export function TeamsLayout() {
  const [techs, setTechs] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technician | null>(null);

  useEffect(() => {
    const unsubscribe = teamService.subscribeToTechnicians((fetched) => {
      setTechs(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = () => {
    setEditingTech(null);
    setIsEditOpen(true);
  };

  const handleEdit = (tech: Technician) => {
    setEditingTech(tech);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Weet je zeker dat je deze monteur wilt verwijderen?")) {
      try {
        await teamService.deleteTechnician(id);
        toast.success('Monteur verwijderd');
      } catch (err) {
        toast.error('Fout bij verwijderen');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative space-y-4 pt-2 pb-8">
      
      <div className="flex items-center gap-3 px-6 pb-2 shrink-0">
        <div className="flex items-center justify-center w-7 h-7">
           <Zap className="h-6 w-6 text-emerald-800 bg-emerald-100 p-1 rounded" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Monteurs & Teams</h1>
      </div>

      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-6 pb-1">
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-1 border-b-2 border-emerald-800 px-1">
              Alles <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full text-[10px]">{techs.length}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-medium text-sm rounded-md shadow-sm transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> Monteur Toevoegen
            </button>
          </div>
        </div>

        <div className="px-4 py-2 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-4 text-[13px] font-semibold text-gray-700">
            <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><Columns3 className="h-4 w-4" /> Kolommen</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
          </div>
        </div>

        <div className="overflow-auto flex-1 bg-white">
          <table className="w-full text-left text-[13px] border-collapse min-w-[800px]">
            <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-gray-100/50">
              <tr className="border-b border-gray-200">
                <th className="p-3 pl-4 w-10 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                </th>
                <th className="p-3 font-semibold text-gray-800">Naam</th>
                <th className="p-3 font-semibold text-gray-800">Email</th>
                <th className="p-3 font-semibold text-gray-800">Status</th>
                <th className="p-3 w-20">Acties</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-20 text-gray-400 italic">Laden...</td></tr>
              ) : techs.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-20 text-gray-400 italic">Geen monteurs gevonden</td></tr>
              ) : techs.map(tech => (
                <tr key={tech.id} className="border-b border-gray-50 hover:bg-gray-50/50 group">
                  <td className="p-3 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                  </td>
                  <td className="p-3 font-medium text-gray-900 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                      {tech.name.charAt(0)}
                    </div>
                    {tech.name}
                  </td>
                  <td className="p-3 text-gray-600">{tech.email || '-'}</td>
                  <td className="p-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", tech.status === 'Actief' ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500")}>
                      {tech.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(tech)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-emerald-700">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(tech.id!)} className="p-1 hover:bg-red-50 rounded text-gray-300 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TechnicianEditDialog 
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        tech={editingTech}
      />
    </div>
  );
}

function TechnicianEditDialog({ open, onOpenChange, tech }: { open: boolean, onOpenChange: (open: boolean) => void, tech: Technician | null }) {
  const form = useForm<Partial<Technician>>({
    defaultValues: { name: '', email: '', status: 'Actief' }
  });

  useEffect(() => {
    if (tech) form.reset(tech);
    else form.reset({ name: '', email: '', status: 'Actief' });
  }, [tech, open]);

  const onSubmit = async (values: Partial<Technician>) => {
    try {
      if (tech?.id) {
        await teamService.updateTechnician(tech.id, values);
        toast.success('Monteur bijgewerkt');
      } else {
        await teamService.addTechnician(values as Technician);
        toast.success('Monteur toegevoegd');
      }
      onOpenChange(false);
    } catch (err) {
      toast.error('Fout bij opslaan');
    }
  };

  return (
    <EditDialog
      open={open}
      onOpenChange={onOpenChange}
      title={tech ? 'Monteur bewerken' : 'Nieuwe monteur'}
      form={form}
      onSubmit={onSubmit}
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Volledige naam</Label>
          <Input {...form.register('name')} placeholder="bijv. Jan de Vries" />
        </div>
        <div className="space-y-1.5">
          <Label>E-mailadres</Label>
          <Input {...form.register('email')} type="email" />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select 
            {...form.register('status')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="Actief">Actief</option>
            <option value="Inactief">Inactief</option>
          </select>
        </div>
      </div>
    </EditDialog>
  );
}
