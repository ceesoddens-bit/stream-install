import React, { useState } from 'react';
import { 
  Layers, Settings, Columns3, SlidersHorizontal, AlignJustify, Maximize2, Download, Search, Plus, Archive, Edit, Info, ChevronDown, MoreHorizontal, CheckCircle2, FileText, Send, CheckSquare, MessageSquare, Check, X, UserCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const quotesData = [
  { id: 530, naam: 'Nieuwe offerte', status: 'Afgerond', statusColor: 'bg-green-100 text-green-800', geaccept: 'pending', projStatus: 'Offerte verstuurd', projColor: 'bg-green-200 text-green-900', project: '2500179-fam Caeta...', contact: 'fam Caetano', inbeh: '0%', gefac: '0%', totaal: '6.1...', mail: 'check', verstuurd: '26-03-26 11:03', geopend: '-', keren: '0', reden: '', gemaakt_op: '26-03-2026 11:00', gemaakt_door: 'Sven | Ins...' },
  { id: 529, naam: 'Nieuwe offerte', status: 'Afgerond', statusColor: 'bg-green-100 text-green-800', geaccept: 'pending', projStatus: '-', projColor: 'bg-gray-100 text-gray-800', project: '-', contact: '-', inbeh: '0%', gefac: '0%', totaal: '6.8...', mail: 'check', verstuurd: '25-03-26 12:20', geopend: '25-03-26 12:22', keren: '2', reden: '', gemaakt_op: '25-03-2026 12:19', gemaakt_door: 'Sven | Ins...' },
  { id: 528, naam: 'Nieuwe offerte', status: 'Concept', statusColor: 'bg-orange-100 text-orange-800', geaccept: 'pending', projStatus: 'Offerte maken', projColor: 'bg-green-200 text-green-900', project: '2600135-Fam. van d...', contact: 'Fam. van den Brink', inbeh: '0%', gefac: '0%', totaal: '-', mail: 'cross', verstuurd: '-', geopend: '-', keren: '0', reden: '', gemaakt_op: '25-03-2026 09:22', gemaakt_door: 'Sven | Ins...' },
  { id: 527, naam: 'Nieuwe offerte', status: 'Afgerond', statusColor: 'bg-green-100 text-green-800', geaccept: 'pending', projStatus: 'Montage gepland', projColor: 'bg-yellow-200 text-yellow-900', project: '2600124-Mireille de l...', contact: 'Mireille de Haan', inbeh: '0%', gefac: '0%', totaal: '1.2...', mail: 'check', verstuurd: '25-03-26 09:21', geopend: '-', keren: '0', reden: '', gemaakt_op: '25-03-2026 09:09', gemaakt_door: 'Sven | Ins...' },
  { id: 526, naam: 'Nieuwe offerte', status: 'Afgerond', statusColor: 'bg-green-100 text-green-800', geaccept: 'accepted', projStatus: 'Oplevering controle', projColor: 'bg-purple-500 text-white', project: '2600210-Centrada-l...', contact: '-', inbeh: '0%', gefac: '0%', totaal: '2.9...', mail: 'cross', verstuurd: '-', geopend: '-', keren: '0', reden: 'Woco', gemaakt_op: '25-03-2026 08:58', gemaakt_door: 'Sven | Ins...' },
  { id: 525, naam: 'Nieuwe offerte', status: 'Concept', statusColor: 'bg-orange-100 text-orange-800', geaccept: 'pending', projStatus: 'Offerte maken', projColor: 'bg-green-200 text-green-900', project: '2600144-Frank van d...', contact: 'Frank van der Drift', inbeh: '0%', gefac: '0%', totaal: '1.0...', mail: 'cross', verstuurd: '-', geopend: '-', keren: '0', reden: '', gemaakt_op: '24-03-2026 15:49', gemaakt_door: 'Sven | Ins...' },
  { id: 524, naam: 'Nieuwe offerte', status: 'Afgerond', statusColor: 'bg-green-100 text-green-800', geaccept: 'pending', projStatus: 'Offerte verstuurd', projColor: 'bg-green-200 text-green-900', project: '2600207-Martijn van...', contact: 'Martijn van de Laar', inbeh: '0%', gefac: '0%', totaal: '1.6...', mail: 'check', verstuurd: '24-03-26 15:38', geopend: '26-03-26 10:29', keren: '2', reden: '', gemaakt_op: '24-03-2026 15:28', gemaakt_door: 'Sven | Ins...' },
  { id: 523, naam: 'Nieuwe offerte', status: 'Afgerond', statusColor: 'bg-green-100 text-green-800', geaccept: 'pending', projStatus: 'Offerte verstuurd', projColor: 'bg-green-200 text-green-900', project: '2600205-V & O Cars...', contact: '-', inbeh: '0%', gefac: '0%', totaal: '1.7.9...', mail: 'check', verstuurd: '24-03-26 10:33', geopend: '-', keren: '0', reden: '', gemaakt_op: '24-03-2026 10:13', gemaakt_door: 'Sven | Ins...' },
  { id: 522, naam: 'Nieuwe offerte', status: 'Afgerond', statusColor: 'bg-green-100 text-green-800', geaccept: 'pending', projStatus: 'Offerte verstuurd', projColor: 'bg-green-200 text-green-900', project: '2600204-V & O Cars...', contact: '-', inbeh: '0%', gefac: '0%', totaal: '6.2...', mail: 'check', verstuurd: '24-03-26 08:35', geopend: '-', keren: '0', reden: '', gemaakt_op: '24-03-2026 08:24', gemaakt_door: 'Sven | Ins...' },
  { id: 521, naam: 'Nieuwe offerte', status: 'Afgerond', statusColor: 'bg-green-100 text-green-800', geaccept: 'pending', projStatus: 'Offerte verstuurd', projColor: 'bg-green-200 text-green-900', project: '2600163-Rob Holtsla...', contact: 'Rob Holtslag', inbeh: '0%', gefac: '0%', totaal: '8.3...', mail: 'check', verstuurd: '23-03-26 14:38', geopend: '23-03-26 21:29', keren: '7', reden: '', gemaakt_op: '23-03-2026 14:03', gemaakt_door: 'Sven | Ins...' },
  { id: 520, naam: 'Nieuwe offerte', status: 'Afgerond', statusColor: 'bg-green-100 text-green-800', geaccept: 'pending', projStatus: 'Offerte verstuurd', projColor: 'bg-green-200 text-green-900', project: '2600196-Mark MCT...', contact: 'Mark MCT', inbeh: '0%', gefac: '0%', totaal: '3.8...', mail: 'check', verstuurd: '20-03-26 12:36', geopend: '20-03-26 14:07', keren: '4', reden: '', gemaakt_op: '20-03-2026 12:10', gemaakt_door: 'Sven | Ins...' },
  { id: 519, naam: 'Nieuwe offerte', status: 'Afgerond', statusColor: 'bg-green-100 text-green-800', geaccept: 'pending', projStatus: 'Offerte verstuurd', projColor: 'bg-green-200 text-green-900', project: '2600194-Sylvia van d...', contact: 'Sylvia van den Hoek', inbeh: '0%', gefac: '0%', totaal: '6.8...', mail: 'cross', verstuurd: '-', geopend: '-', keren: '0', reden: '', gemaakt_op: '19-03-2026 13:22', gemaakt_door: 'Sven | Ins...' },
  { id: 518, naam: 'Nieuwe offerte', status: 'Afgerond', statusColor: 'bg-green-100 text-green-800', geaccept: 'pending', projStatus: 'Offerte verstuurd', projColor: 'bg-green-200 text-green-900', project: '2600194-Sylvia van d...', contact: 'Sylvia van den Hoek', inbeh: '0%', gefac: '0%', totaal: '4.9...', mail: 'cross', verstuurd: '-', geopend: '-', keren: '0', reden: '', gemaakt_op: '19-03-2026 13:12', gemaakt_door: 'Sven | Ins...' },
  { id: 515, naam: 'Nieuwe offerte', status: 'Afgerond', statusColor: 'bg-green-100 text-green-800', geaccept: 'pending', projStatus: 'Offerte verstuurd', projColor: 'bg-green-200 text-green-900', project: '2600190-Beauty by ...', contact: '-', inbeh: '0%', gefac: '0%', totaal: '1.6...', mail: 'check', verstuurd: '18-03-26 14:43', geopend: '-', keren: '0', reden: '', gemaakt_op: '18-03-2026 14:33', gemaakt_door: 'Sven | Ins...' },
  { id: 514, naam: 'Nieuwe offerte', status: 'Afgerond', statusColor: 'bg-green-100 text-green-800', geaccept: 'pending', projStatus: 'Montage plannen', projColor: 'bg-yellow-200 text-yellow-900', project: '2600168-Stephan Pr...', contact: 'Stephan Prins', inbeh: '0%', gefac: '0%', totaal: '2.6...', mail: 'check', verstuurd: '18-03-26 12:56', geopend: '21-03-26 13:29', keren: '2', reden: '', gemaakt_op: '18-03-2026 12:20', gemaakt_door: 'Sven | Ins...' },
  { id: 513, naam: 'naam', status: 'Concept', statusColor: 'bg-orange-100 text-orange-800', geaccept: 'pending', projStatus: 'Offerte verstuurd', projColor: 'bg-green-200 text-green-900', project: '2500179-fam Caeta...', contact: 'fam Caetano', inbeh: '0%', gefac: '0%', totaal: '5.2...', mail: 'cross', verstuurd: '-', geopend: '-', keren: '0', reden: '', gemaakt_op: '18-03-2026 11:33', gemaakt_door: 'Sven | Ins...' },
  { id: 512, naam: 'Nieuwe offerte', status: 'Afgerond', statusColor: 'bg-green-100 text-green-800', geaccept: 'pending', projStatus: 'Offerte verstuurd', projColor: 'bg-green-200 text-green-900', project: '2600186-Almira Kalk...', contact: 'Almira Kalkhoven', inbeh: '0%', gefac: '0%', totaal: '1.8...', mail: 'check', verstuurd: '18-03-26 11:09', geopend: '18-03-26 11:19', keren: '1', reden: '', gemaakt_op: '18-03-2026 11:04', gemaakt_door: 'Sven | Ins...' },
];

export function QuotesLayout() {
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
        <Layers className="h-6 w-6 text-cyan-600 bg-cyan-100 p-1 rounded transform rotate-90" />
        <h1 className="text-xl font-bold text-gray-900">Offertelijst</h1>
      </div>

      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        
        {/* Top Tabs and Action Row */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-6 pb-1 overflow-x-auto scrollbar-hide">
            <button className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-1 border-b-2 border-green-600 shrink-0">
              Alles <span className="bg-emerald-800 text-white text-[10px] px-1.5 py-0.5 rounded-sm leading-none shrink-0 font-bold">289</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 border-b-2 border-transparent hover:border-gray-200 shrink-0">
              Rejected <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm leading-none shrink-0 font-bold">12</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 border-b-2 border-transparent hover:border-gray-200 shrink-0">
              Geaccepteerd <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm leading-none shrink-0 font-bold">126</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 border-b-2 border-transparent hover:border-gray-200 shrink-0">
              Concept <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm leading-none shrink-0 font-bold">41</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-medium text-sm rounded-md shadow-sm opacity-90 hover:opacity-100 transition-opacity">
              <Plus className="h-4 w-4" /> Nieuwe Offerte
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
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Edit className="h-4 w-4" /> Bewerken</button>
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
          <table className="w-full text-left text-sm border-collapse min-w-[1300px]">
            <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-gray-100/50">
              <tr className="border-b border-gray-200">
                <th className="p-3 pl-4 w-10 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4" />
                </th>
                <th className="p-3 w-8"></th>
                <th className="p-3 font-semibold text-gray-800">id</th>
                <th className="p-3 font-semibold text-gray-800">Naam</th>
                <th className="p-3 font-semibold text-gray-800">Status</th>
                <th className="p-3 font-semibold text-gray-800">Geaccept...</th>
                <th className="p-3 font-semibold text-gray-800">Project status</th>
                <th className="p-3 font-semibold text-gray-800">Project</th>
                <th className="p-3 font-semibold text-gray-800">Contact</th>
                <th className="p-3 font-semibold text-gray-800">In beh...</th>
                <th className="p-3 font-semibold text-gray-800">Gefac...</th>
                <th className="p-3 font-semibold text-gray-800">Totaal</th>
                <th className="p-3 font-semibold text-gray-800">ndtekening d...</th>
                <th className="p-3 font-semibold text-gray-800">Mail</th>
                <th className="p-3 font-semibold text-gray-800">Verstuurd op</th>
                <th className="p-3 font-semibold text-gray-800">Geopend door kla...</th>
                <th className="p-3 font-semibold text-gray-800">Keren geopend door ...</th>
                <th className="p-3 font-semibold text-gray-800">Reden</th>
                <th className="p-3 font-semibold text-gray-800 flex items-center gap-1 cursor-pointer">Gemaakt op <ChevronDown className="h-3.5 w-3.5" /></th>
                <th className="p-3 font-semibold text-gray-800">Gemaakt door</th>
                <th className="p-3 w-40 sticky right-0 bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]"></th>
              </tr>
            </thead>
            <tbody>
              {quotesData.map((row, i) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                  <td className="p-3 pl-4 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4 cursor-pointer" 
                      onClick={() => toggleSelect(row.id)}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <ChevronDown className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-700" />
                  </td>
                  <td className="p-3 text-[13px] font-semibold text-emerald-600 hover:underline cursor-pointer">
                    {row.id}
                  </td>
                  <td className="p-3 text-[13px] font-semibold text-emerald-600 hover:underline cursor-pointer truncate max-w-[150px]">
                    {row.naam}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    <span className={cn("text-[11px] font-bold px-2 py-0.5 border border-transparent rounded-sm", row.statusColor)}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {row.geaccept === 'accepted' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                    ) : (
                      <div className="h-4 w-4 bg-green-700 rounded-full text-white flex items-center justify-center mx-auto shadow-sm">
                        <MoreHorizontal className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    {row.projStatus !== '-' ? (
                      <span className={cn("text-[11px] font-bold px-2 py-0.5 border rounded-sm", row.projColor)}>
                        {row.projStatus}
                      </span>
                    ) : (
                       '-' 
                    )}
                  </td>
                  <td className="p-3 text-[13px] font-semibold text-emerald-600 hover:underline cursor-pointer truncate max-w-[170px]" title={row.project}>
                    {row.project}
                  </td>
                  <td className="p-3 text-[13px] font-semibold text-emerald-600 hover:underline cursor-pointer truncate max-w-[150px]" title={row.contact}>
                    {row.contact}
                  </td>
                  <td className="p-3 text-[13px] text-gray-600">
                    {row.inbeh}
                  </td>
                  <td className="p-3 text-[13px] text-gray-600">
                    {row.gefac}
                  </td>
                  <td className="p-3 text-[13px] text-gray-900 font-medium whitespace-nowrap">
                    {row.totaal !== '-' ? `€ ${row.totaal}` : '-'}
                  </td>
                  <td className="p-3 text-[13px] text-gray-600">
                    {/* Empty column */}
                  </td>
                  <td className="p-3 text-[13px] text-gray-600">
                    {row.mail === 'check' ? (
                      <Check className="h-4 w-4 text-gray-600" />
                    ) : (
                      <X className="h-4 w-4 text-gray-300" />
                    )}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700 whitespace-nowrap">
                    {row.verstuurd}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700 whitespace-nowrap">
                    {row.geopend}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700 text-right pr-6">
                    {row.keren}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    {row.reden ? (
                      <span className="bg-green-500 text-white font-bold text-[11px] px-2 py-0.5 rounded-sm shadow-sm">{row.reden}</span>
                    ) : ''}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700 whitespace-nowrap">
                    {row.gemaakt_op}
                  </td>
                  <td className="p-3 text-[13px] text-gray-600">
                    <div className="flex items-center gap-2 max-w-[120px]">
                      <UserCircle2 className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate" title={row.gemaakt_door}>{row.gemaakt_door}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right sticky right-0 bg-white/95 backdrop-blur-sm group-hover:bg-gray-50/95 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.02)] transition-colors">
                     <div className="flex items-center justify-end gap-2 text-emerald-600">
                      <button className="hover:text-emerald-800 p-0.5"><Edit className="h-3.5 w-3.5" /></button>
                      <button className="hover:text-emerald-800 p-0.5"><Download className="h-3.5 w-3.5" /></button>
                      <button className="hover:text-emerald-800 p-0.5"><FileText className="h-3.5 w-3.5" /></button>
                      <button className="hover:text-emerald-800 p-0.5 text-gray-400"><Send className="h-3.5 w-3.5" /></button>
                      <button className="hover:text-emerald-800 p-0.5 text-gray-400"><CheckSquare className="h-3.5 w-3.5" /></button>
                      <button className="hover:text-emerald-800 p-0.5 text-gray-400"><MessageSquare className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="h-auto">
                <td colSpan={13}></td>
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
            <span>1–25 of 289</span>
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
