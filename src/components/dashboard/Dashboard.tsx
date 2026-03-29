import React from 'react';
import { 
  TrendingUp, 
  Users, 
  FileCheck, 
  Euro, 
  Calendar as CalendarIcon,
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { planningCards, quotes, invoices, currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);

// KPI Calculation logic
const activeProjects = planningCards.filter(c => 
  ['Montage plannen', 'Montage gepland', 'Restpunt plannen', 'Restpunt gepland', 'Service gepland', 'Service in afwachting'].includes(c.status)
).length;

const openQuotes = quotes.filter(q => q.status === 'Verstuurd' || q.status === 'Concept').length;
const totalRevenue = invoices.filter(i => i.status === 'Afgerond' || i.status === 'Goedgekeurd').reduce((acc, i) => acc + i.totalIncl, 0);
const totalUninvoiced = planningCards.filter(c => c.status === 'Oplevering controleren & Factureren').reduce((acc, c) => acc + c.amount, 0);

const recentActivities = [
  { id: 1, text: 'Nieuwe offerte geaccepteerd door Fam. Klaassen', time: '10 min geleden', icon: FileCheck, color: 'text-green-500', bg: 'bg-green-100' },
  { id: 2, text: 'Zonnepanelen project Centrada afgerond', time: 'Uur geleden', icon: CheckCircle2, color: 'text-purple-500', bg: 'bg-purple-100' },
  { id: 3, text: 'Service aanvraag: Warmtepomp Storing', time: 'Vandaag 09:15', icon: Zap, color: 'text-red-500', bg: 'bg-red-100' },
  { id: 4, text: 'Factuur 2024-002 deels betaald', time: 'Gisteren', icon: Euro, color: 'text-blue-500', bg: 'bg-blue-100' },
];

export function Dashboard() {
  return (
    <div className="flex flex-col h-full bg-gray-50/30 overflow-y-auto pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welkom terug, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4" />
            Vandaag is {new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date('2026-03-26'))}.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <Button variant="outline" className="bg-white hover:bg-gray-50">
            Bekijk Rapportages
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Zap className="h-4 w-4" />
            Snelle Actie
          </Button>
        </div>
      </div>

      {/* ── Top Level KPIs ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* KPI 1 */}
        <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Actieve Projecten</p>
              <h3 className="text-2xl font-bold text-gray-900">{activeProjects} <span className="text-sm font-normal text-gray-400 ml-1">in planning</span></h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Te Factureren</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalUninvoiced)}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <Euro className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Openstaande Offertes</p>
              <h3 className="text-2xl font-bold text-gray-900">{openQuotes} <span className="text-sm font-normal text-gray-400 ml-1">leads</span></h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <FileCheck className="h-6 w-6 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Gerealiseerde Omzet</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)} <span className="text-sm font-normal text-gray-400 ml-1">YTD</span></h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Middle Left: Projects Summary & Graph Mock ── */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-200 shadow-sm h-[380px] flex flex-col">
            <CardHeader className="pb-2 border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-bold text-gray-800">Verwachte Omzet Provisie</CardTitle>
              <p className="text-xs text-gray-500">Omzet per maand (geaccepteerde offertes vs. afgerond)</p>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col justify-end">
              {/* Simple CSS-based Bar Chart mock */}
              <div className="flex h-52 items-end gap-4 sm:gap-8 justify-between mt-auto px-4">
                {[
                  { month: 'Jan', val1: 40, val2: 25 },
                  { month: 'Feb', val1: 65, val2: 45 },
                  { month: 'Mar', val1: 55, val2: 85 },
                  { month: 'Apr', val1: 90, val2: 40, active: true },
                  { month: 'Mei', val1: 30, val2: 10 },
                  { month: 'Jun', val1: 0, val2: 0 },
                ].map((col) => (
                  <div key={col.month} className="flex flex-col items-center flex-1 gap-2 group cursor-pointer">
                    <div className="flex items-end gap-1.5 w-full h-full relative">
                      {/* Bar 1: Geaccepteerd */}
                      <div 
                        className={cn("w-full rounded-t-sm transition-all duration-500", col.active ? "bg-emerald-400" : "bg-emerald-200 group-hover:bg-emerald-300")} 
                        style={{ height: `${col.val1}%` }} 
                      />
                      {/* Bar 2: Afgerond/Gefactureerd */}
                      <div 
                        className={cn("w-full rounded-t-sm transition-all duration-500", col.active ? "bg-blue-600" : "bg-blue-300 group-hover:bg-blue-400")} 
                        style={{ height: `${col.val2}%` }} 
                      />
                      
                      {/* Tooltip hint mock */}
                      {col.active && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          € 82.500 Omzet
                        </div>
                      )}
                    </div>
                    <span className={cn("text-xs font-semibold mt-1", col.active ? "text-gray-900" : "text-gray-400")}>{col.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-6 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-emerald-400" />
                  <span className="text-xs text-gray-500 font-medium">Offertes geaccepteerd</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-blue-600" />
                  <span className="text-xs text-gray-500 font-medium">Daadwerkelijk Gefactureerd</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Tasks / Unassigned List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-bold text-gray-800">Aandacht Vereist</CardTitle>
                <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 font-bold">3 acties</Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {[
                    { text: 'Planning conflict: Montage Jansen (12-04)', type: 'conflict' },
                    { text: 'Servicecontract Visser verloopt bijna', type: 'warning' },
                    { text: 'Onderdelen tekort: AlphaEss 10kWh', type: 'stock' }
                  ].map((item, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3 w-full pr-4">
                        <div className={cn("w-2 h-2 rounded-full shrink-0", 
                          item.type === 'conflict' ? 'bg-red-500' : 
                          item.type === 'warning' ? 'bg-orange-500' : 'bg-yellow-500'
                        )} />
                        <p className="text-sm font-medium text-gray-700 truncate group-hover:text-blue-600 transition-colors">{item.text}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600 shrink-0" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-bold text-gray-800">Direct Plannen</CardTitle>
                <div className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                  Alle <ArrowRight className="h-3 w-3" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {planningCards.filter(c => c.status === 'Montage plannen' || c.status === 'Restpunt plannen').slice(0, 3).map(card => (
                    <div key={card.id} className="p-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-900 truncate">{card.clientName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 rounded">{card.projectType}</span>
                          <span className="text-[10px] text-gray-500 truncate">{card.address.split(',')[0]}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs h-7 ml-3 shrink-0">Inplannen</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Right sidebar: Recent Activities ── */}
        <div className="lg:col-span-1">
          <Card className="border-gray-200 shadow-sm h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                Recente Activiteiten
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              {/* Activity feed */}
              <div className="p-4 space-y-6">
                {recentActivities.map((activity, idx) => (
                  <div key={activity.id} className="relative flex gap-4">
                    {/* Connection line */}
                    {idx !== recentActivities.length - 1 && (
                      <div className="absolute top-8 bottom-[-24px] left-[15px] w-px bg-gray-200" />
                    )}
                    
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ring-4 ring-white shadow-sm border border-gray-100", activity.bg, activity.color)}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex flex-col pt-1.5 pb-2 min-w-0">
                      <p className="text-sm font-medium text-gray-800 leading-snug">{activity.text}</p>
                      <span className="text-xs font-semibold text-gray-400 mt-1">{activity.time}</span>
                    </div>
                  </div>
                ))}
                
                {/* Team Online mock */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Team Online (3)</h4>
                  <div className="flex -space-x-3">
                    <Avatar className="border-2 border-white w-9 h-9 shadow-sm"><AvatarImage src="https://i.pravatar.cc/150?u=u1" /><AvatarFallback>CO</AvatarFallback></Avatar>
                    <Avatar className="border-2 border-white w-9 h-9 shadow-sm"><AvatarImage src="https://i.pravatar.cc/150?u=c2" /><AvatarFallback>SB</AvatarFallback></Avatar>
                    <Avatar className="border-2 border-white w-9 h-9 shadow-sm"><AvatarImage src="https://i.pravatar.cc/150?u=c3" /><AvatarFallback>JD</AvatarFallback></Avatar>
                    <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm z-10">
                      +4
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
