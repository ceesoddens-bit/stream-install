import React, { useState, useEffect } from 'react';
import { 
  Target, Settings, Columns3, SlidersHorizontal, AlignJustify, Maximize2, Download, Search, Plus, UserCircle2, Network, FileText, Trash2, Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { crmService, Contact } from '@/lib/crmService';

export function ContactsLayout() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to real-time updates from Firebase
  useEffect(() => {
    const unsubscribe = crmService.subscribeToContacts((fetched) => {
      setContacts(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Weet je zeker dat je dit contact wilt verwijderen?")) {
      await crmService.deleteContact(id);
    }
  };

  const handleAddSample = async () => {
    const names = ["Cees Oddens", "Sandra Brader", "Sven Nooij", "Lars Albregts"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    await crmService.addContact({
      name: randomName,
      email: `${randomName.toLowerCase().replace(' ', '.')}@example.com`,
      phone: "06-12345678",
      company: "Installatiegroep Duurzaam",
      role: "Beheerder",
      status: "Actief"
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative space-y-4 pt-2 pb-8">
      
      {/* ── Page Header ── */}
      <div className="flex items-center gap-3 px-6 pb-2 shrink-0">
        <Target className="h-6 w-6 text-purple-700 bg-purple-100 p-1 rounded" />
        <h1 className="text-xl font-bold text-gray-900">Contactenlijst</h1>
      </div>

      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        
        {/* Top Tabs and Action Row */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-6 pb-1">
            <button className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-1 border-b-2 border-green-600">
              Alles <span className="bg-emerald-800 text-white text-[11px] px-2 py-0.5 rounded-full leading-none shrink-0 font-bold">{contacts.length}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
                onClick={handleAddSample}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-medium text-sm rounded-md shadow-sm opacity-90 hover:opacity-100 transition-opacity"
            >
              <Plus className="h-4 w-4" /> Sample Toevoegen
            </button>
            <button className="p-2 border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Columns3 className="h-4 w-4" /> Kolommen</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><AlignJustify className="h-4 w-4" /> Dichtheid</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Maximize2 className="h-4 w-4" /> Schaal</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Download className="h-4 w-4" /> Exporteren</button>
          </div>
          <div className="relative w-64 flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoeken..."
              className="pl-9 pr-8 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50 w-full"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm border-collapse min-w-[1000px]">
            <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-gray-100">
              <tr className="bg-gray-50/30 font-bold uppercase tracking-tighter text-gray-400 text-[11px]">
                <th className="p-3 pl-4 w-10 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
                </th>
                <th className="p-3">Naam</th>
                <th className="p-3">Email</th>
                <th className="p-3">Bedrijf</th>
                <th className="p-3">Telefoon</th>
                <th className="p-3">Rol</th>
                <th className="p-3">Status</th>
                <th className="p-3 w-40 sticky right-0 bg-white z-20"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-20 text-center text-gray-400 italic">
                    Laden van contacten...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                   <td colSpan={8} className="p-20 text-center text-gray-400 italic">
                    Geen contacten gevonden. Klik op "+ Sample Toevoegen" om te testen!
                  </td>
                </tr>
              ) : contacts.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="p-3 pl-4 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 cursor-pointer" 
                      checked={selectedIds.includes(row.id!)}
                      onChange={() => toggleSelect(row.id!)}
                    />
                  </td>
                  <td className="p-3 text-[13px] font-bold text-emerald-800 hover:underline cursor-pointer">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {row.name.charAt(0)}
                        </div>
                        {row.name}
                    </div>
                  </td>
                  <td className="p-3 text-[13px] font-medium text-emerald-600">
                    {row.email}
                  </td>
                  <td className="p-3 text-[13px] text-gray-600">
                    {row.company}
                  </td>
                  <td className="p-3 text-[13px] text-blue-600 font-medium">
                    {row.phone}
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{row.role}</span>
                  </td>
                  <td className="p-3">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter",
                      row.status === 'Actief' ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                    )}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3 text-right sticky right-0 bg-white/90 backdrop-blur-sm group-hover:bg-gray-50/90 transition-colors z-10">
                    <div className="flex items-center justify-end gap-3 text-emerald-700">
                        <button className="hover:text-emerald-900 transition-colors"><UserCircle2 className="h-4 w-4" /></button>
                        <button className="hover:text-emerald-900 transition-colors"><Network className="h-4 w-4" /></button>
                        <button className="hover:text-emerald-900 transition-colors"><FileText className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(row.id!)} className="text-gray-300 hover:text-red-500 transition-colors ml-1 border-l pl-3 border-gray-100">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border-t border-gray-100 p-3 shrink-0 flex items-center justify-end text-[12px] text-gray-500 font-medium">
           {contacts.length} contacten in totaal
        </div>

      </div>
    </div>
  );
}
