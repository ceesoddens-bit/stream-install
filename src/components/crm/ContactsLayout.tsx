import React, { useState } from 'react';
import { 
  Target, Settings, Columns3, SlidersHorizontal, AlignJustify, Maximize2, Download, Search, Plus, UserCircle2, Network, FileText, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const contactsData = [
  { id: 1, naam: 'Test test', roepnaam: 'Test', achternaam: 'test', tags: '', pr: '0', adres: 'Joop Geesinkweg 601, 1114...', mobiel: '-', telefoon: '1245784521', email: 'test@test.c...' },
  { id: 2, naam: 'Johnny Doe', roepnaam: 'Johnny', achternaam: 'Doe', tags: '', pr: '0', adres: 'Maagdenburgstraat 5, 7421...', mobiel: '-', telefoon: '1234567789', email: 'test-accou...' },
  { id: 3, naam: 'Johnny Doe', roepnaam: 'Johnny', achternaam: 'Doe', tags: '', pr: '0', adres: 'Maagdenburgstraat 5, 7421...', mobiel: '-', telefoon: '1234567789', email: 'test@doma...' },
  { id: 4, naam: 'N. Ahmed', roepnaam: 'N.', achternaam: 'Ahmed', tags: '', pr: '0', adres: 'Hemmeland 23, 8223ZG, Lel...', mobiel: '0642794218', telefoon: '-', email: 'admin@inst...' },
  { id: 5, naam: 'fam. Strating', roepnaam: 'fam.', achternaam: 'Strating', tags: '', pr: '0', adres: 'Kamp 16 50, 8225DK, Lelysta...', mobiel: '-', telefoon: '-', email: 'josientje16...' },
  { id: 6, naam: 'fam. Bragt', roepnaam: 'fam.', achternaam: 'Bragt', tags: '', pr: '0', adres: 'Steile Bank 2, 8223BA, Lelyst...', mobiel: '-', telefoon: '-', email: 'admin@inst...' },
  { id: 7, naam: 'Sven Nooij', roepnaam: 'Sven', achternaam: 'Nooij', tags: '', pr: '3', adres: 'Bunschotenlaan 17, 8244DS...', mobiel: '0642794218', telefoon: '-', email: 'sven@insta...' },
  { id: 8, naam: 'Johnny Doe', roepnaam: 'Johnny', achternaam: 'Doe', tags: '', pr: '0', adres: 'Maagdenburgstraat 5, 7421...', mobiel: '-', telefoon: '1234567789', email: 'test@doma...' },
  { id: 9, naam: 'test Doe', roepnaam: 'test', achternaam: 'Doe', tags: '', pr: '0', adres: 'Melkdistel 3, 1775HA, Midde...', mobiel: '-', telefoon: '06 45545223', email: 'john.renata...' },
  { id: 10, naam: 'Test Abnormal', roepnaam: 'Test', achternaam: 'Abnormal', tags: '', pr: '3', adres: 'Joop Geesinkweg 601, 1114...', mobiel: '-', telefoon: '0123456789', email: 'onderhoud...' },
  { id: 11, naam: 'Test new test', roepnaam: 'Test new', achternaam: 'test', tags: '', pr: '0', adres: 'Joop Geesinkweg 601, 1114...', mobiel: '-', telefoon: '2145784512', email: 'chetan@ab...' },
  { id: 12, naam: 'Test test', roepnaam: 'Test', achternaam: 'test', tags: '', pr: '0', adres: 'Joop Geesinkweg 601, 1114...', mobiel: '-', telefoon: '32323', email: 'chetan@ab...' },
  { id: 13, naam: 'VL Dempster', roepnaam: 'VL', achternaam: 'Dempster', tags: '', pr: '0', adres: 'Bunschotenlaan 17, 8244DS...', mobiel: '-', telefoon: '0641212954', email: 'viclouisede...' },
  { id: 14, naam: 'Damian -', roepnaam: 'Damian', achternaam: '-', tags: '', pr: '0', adres: '- -, -, -', mobiel: '-', telefoon: '0653585871', email: 'jamal1918@...' },
  { id: 15, naam: 'Fam. Kort - de Groot', roepnaam: 'Fam.', achternaam: 'Kort - de Gro...', tags: '', pr: '1', adres: 'Zoom 11 5, 8225KC, Lelysta...', mobiel: '-', telefoon: '-', email: 'h.kort1@ch...' },
];

export function ContactsLayout() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative space-y-4 pt-2 pb-8">
      
      {/* ── Page Header Mimicking Screenshot ── */}
      <div className="flex items-center gap-3 px-6 pb-2 shrink-0">
        <Target className="h-6 w-6 text-purple-700 bg-purple-100 p-1 rounded" />
        <h1 className="text-xl font-bold text-gray-900">Contactenlijst</h1>
      </div>

      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        
        {/* Top Tabs and Action Row */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-6 pb-1">
            <button className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-1 border-b-2 border-green-600">
              Alles <span className="bg-emerald-800 text-white text-[11px] px-2 py-0.5 rounded-full leading-none shrink-0 font-bold">318</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-medium text-sm rounded-md shadow-sm opacity-90 hover:opacity-100 transition-opacity">
              <Plus className="h-4 w-4" /> Contact Maken
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
            <button className="flex items-center gap-1.5 hover:text-gray-900 text-gray-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
              Bulk
            </button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Download className="h-4 w-4" /> Exporteren</button>
          </div>
          <div className="relative w-64 flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoeken..."
              className="pl-9 pr-8 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50 w-full"
            />
            <Info className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-800" />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm border-collapse min-w-[1200px]">
            <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-gray-100/50">
              <tr className="border-b border-gray-200">
                <th className="p-3 pl-4 w-10 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4" />
                </th>
                <th className="p-3 font-semibold text-gray-800">Naam</th>
                <th className="p-3 font-semibold text-gray-800">Voornaam</th>
                <th className="p-3 font-semibold text-gray-800">Achternaam</th>
                <th className="p-3 font-semibold text-gray-800">Tags</th>
                <th className="p-3 font-semibold text-gray-800">Pr...</th>
                <th className="p-3 font-semibold text-gray-800">Adres</th>
                <th className="p-3 font-semibold text-gray-800">Mobiele num...</th>
                <th className="p-3 font-semibold text-gray-800">Telefoonnum...</th>
                <th className="p-3 font-semibold text-gray-800">E-mailadre...</th>
                <th className="p-3 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {contactsData.map((row, i) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                  <td className="p-3 pl-4 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4 cursor-pointer" 
                      onClick={() => toggleSelect(row.id)}
                    />
                  </td>
                  <td className="p-3 text-[13px] font-semibold text-emerald-600 hover:underline cursor-pointer truncate max-w-[180px]" title={row.naam}>
                    {row.naam}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    {row.roepnaam}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    {row.achternaam}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    {row.tags}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    {row.pr}
                  </td>
                  <td className="p-3 text-[13px] text-gray-600 truncate max-w-[200px]" title={row.adres}>
                    {row.adres}
                  </td>
                  <td className="p-3 text-[13px] font-medium text-blue-600">
                    {row.mobiel}
                  </td>
                  <td className="p-3 text-[13px] font-medium text-blue-600">
                    {row.telefoon}
                  </td>
                  <td className="p-3 text-[13px] font-semibold text-emerald-600 hover:underline cursor-pointer truncate max-w-[150px]" title={row.email}>
                    {row.email}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-3 text-emerald-700">
                      <button className="hover:text-emerald-900 group relative">
                        <UserCircle2 className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                      <button className="hover:text-emerald-900 group relative">
                        <Network className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                      <button className="hover:text-emerald-900 group relative">
                        <FileText className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="h-auto">
                <td colSpan={11}></td>
              </tr>
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
            <span>1–25 of 318</span>
            <div className="flex gap-4 items-center pl-2">
              <button className="text-gray-400 cursor-not-allowed">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button className="text-gray-700 hover:text-gray-900 cursor-pointer">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
