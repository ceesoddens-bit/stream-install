import React, { useState } from 'react';
import { 
  Target, Settings, Columns3, SlidersHorizontal, AlignJustify, Maximize2, Download, Search, Plus, Archive, Edit, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const companiesData = [
  { id: 1, ref: '2600001', naam: 'W.P.J. Montage Vloerverwar...', tags: '', telefoon: '-', kvk: '-', contact: '-', moeder: '-', adres: 'Schieland 27, 8245GB, Lelys...', btw: '-' },
  { id: 2, ref: '2600010', naam: 'V & O Cars', tags: '', telefoon: '0642516759', kvk: '-', contact: '-', moeder: '-', adres: 'Apolloweg 138, 8239DA, Lely...', btw: '-' },
  { id: 3, ref: '2500011', naam: 'Test company', tags: '', telefoon: '-', kvk: '-', contact: '-', moeder: '-', adres: 'Maagdenburgstraat 5, 7421...', btw: '-' },
  { id: 4, ref: '2500019', naam: 'Smits', tags: '', telefoon: '-', kvk: '-', contact: '-', moeder: '-', adres: 'A. Hofmanweg 24, 2031 BL, H...', btw: '-' },
  { id: 5, ref: '2600003', naam: 'Salverda Bouw B.V.', tags: '', telefoon: '0525-651666', kvk: '-', contact: '-', moeder: '-', adres: 'Industrieweg 13, 8084 GS, \'t...', btw: '-' },
  { id: 6, ref: '2600004', naam: 'Rebo OGV Amsterdam BV', tags: '', telefoon: '-', kvk: '-', contact: '-', moeder: '-', adres: 'Haparandaweg 13, 1013 BD...', btw: '-' },
  { id: 7, ref: '2600002', naam: 'RMT Autoschade', tags: '', telefoon: '-', kvk: '-', contact: '-', moeder: '-', adres: 'De Steiger 27, 1351AB, Alme...', btw: '-' },
  { id: 8, ref: '2500020', naam: 'R. Jannink Beheer B.V.', tags: '', telefoon: '06-53255507', kvk: '39064065', contact: '-', moeder: '-', adres: 'Hollandse Hout 240, 8244GK...', btw: 'NL80...' },
  { id: 9, ref: '2500007', naam: 'OpusFlow', tags: '', telefoon: '-', kvk: '-', contact: '-', moeder: '-', adres: 'Maagdenburgstraat 5, 7421...', btw: '-' },
  { id: 10, ref: '2500010', naam: 'Not provided', tags: '', telefoon: '-', kvk: '-', contact: '-', moeder: '-', adres: 'Joop Geesinkweg 601, 1114...', btw: '-' },
  { id: 11, ref: '2500...', naam: 'M2U Holding BV', tags: '', telefoon: '-', kvk: '-', contact: '-', moeder: '-', adres: 'Smedengilde 8, 8253 HV, Dro...', btw: '-' },
  { id: 12, ref: '2600008', naam: 'Lenferink Zwolle Renovatie B...', tags: '', telefoon: '038-4651455', kvk: '-', contact: '-', moeder: '-', adres: 'Wilhelm Röntgenstraat 3, 80...', btw: '-' },
  { id: 13, ref: '2500008', naam: 'Installatiegroep Duurzaam B...', tags: '', telefoon: '+31851308934', kvk: '78281725', contact: '-', moeder: '-', adres: 'Wigstraat 13B, 8223 EE, Lely...', btw: 'NL86...' },
  { id: 14, ref: '2500018', naam: 'Inntens Klimaattechniek', tags: '', telefoon: '-', kvk: '-', contact: '-', moeder: '-', adres: 'Zuiveringweg 50A, 8243PZ, L...', btw: '-' },
  { id: 15, ref: '2500016', naam: 'Hilal Bakkerij', tags: '', telefoon: '0681683186', kvk: '-', contact: '-', moeder: '-', adres: 'Voorstraat 481, 8226KD, Lely...', btw: '-' },
  { id: 16, ref: '2600006', naam: 'HKV Vastgoed B.V.', tags: '', telefoon: '0320-294252', kvk: '39069387', contact: '-', moeder: '-', adres: 'Botter 11 29, 8232JN, Lelysta...', btw: '-' },
  { id: 17, ref: '2600005', naam: 'HKV Lijn in Water B.V.', tags: '', telefoon: '0320-294248', kvk: '39060355', contact: '-', moeder: '-', adres: 'Botter 11 29, 8232 JN, Lelysta...', btw: '-' },
  { id: 18, ref: '2500013', naam: 'Energy Bridge', tags: '', telefoon: '0854005050', kvk: '-', contact: '-', moeder: '-', adres: 'Bobinestraat 74, 3903 KG, Ve...', btw: '-' },
  { id: 19, ref: '2500012', naam: 'Energiewacht B.V.', tags: '', telefoon: '088-5553000', kvk: '76591042', contact: '-', moeder: '-', adres: 'Lippestraat 1, 8028 PS, Zwoll...', btw: 'NL860...' },
];

export function CompaniesLayout() {
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
        <h1 className="text-xl font-bold text-gray-900">Bedrijvenlijst</h1>
      </div>

      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        
        {/* Top Tabs and Action Row */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-6 pb-1">
            <button className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-1 border-b-2 border-green-600">
              Alles <span className="bg-emerald-800 text-white text-[11px] px-2 py-0.5 rounded-full leading-none shrink-0 font-bold">24</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-medium text-sm rounded-md shadow-sm opacity-90 hover:opacity-100 transition-opacity">
              <Plus className="h-4 w-4" /> Bedrijf Maken
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
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Archive className="h-4 w-4" /> Archief</button>
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
                <th className="p-3 font-semibold text-gray-800">Referentie...</th>
                <th className="p-3 font-semibold text-gray-800 flex items-center gap-1">
                  Bedrijfsnaam 
                  <svg className="h-3.5 w-3.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </th>
                <th className="p-3 font-semibold text-gray-800">Tags</th>
                <th className="p-3 font-semibold text-gray-800">Telefoonnummer</th>
                <th className="p-3 font-semibold text-gray-800">KVK</th>
                <th className="p-3 font-semibold text-gray-800">Primaire contactpersoon</th>
                <th className="p-3 font-semibold text-gray-800">Moederbe...</th>
                <th className="p-3 font-semibold text-gray-800">Adres</th>
                <th className="p-3 font-semibold text-gray-800">BTW</th>
                <th className="p-3 w-14"></th>
              </tr>
            </thead>
            <tbody>
              {companiesData.map((row, i) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                  <td className="p-3 pl-4 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4 cursor-pointer" 
                      onClick={() => toggleSelect(row.id)}
                    />
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    <span className={cn(row.ref.includes('...') && "bg-gray-600 text-white px-1 py-0.5 rounded text-[11px] font-medium")}>
                      {row.ref.includes('...') ? '2500010' : row.ref}
                    </span>
                  </td>
                  <td className="p-3 text-[13px] font-semibold text-emerald-600 hover:underline cursor-pointer truncate max-w-[200px]" title={row.naam}>
                    {row.naam}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    {row.tags}
                  </td>
                  <td className="p-3 text-[13px] font-medium text-blue-600">
                    {row.telefoon}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    {row.kvk}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    {row.contact}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    {row.moeder}
                  </td>
                  <td className="p-3 text-[13px] text-gray-600 truncate max-w-[200px]" title={row.adres}>
                    {row.adres}
                  </td>
                  <td className="p-3 text-[13px] text-gray-600 truncate max-w-[100px]">
                    {row.btw}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end">
                      <button className="text-emerald-600 hover:text-emerald-800 p-1 group relative">
                        <Edit className="h-4 w-4" />
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
            <span>1–24 of 24</span>
            <div className="flex gap-4 items-center pl-2">
              <button className="text-gray-400 cursor-not-allowed">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button className="text-gray-400 cursor-not-allowed">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
