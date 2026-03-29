import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Euro, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Paperclip, 
  CheckCircle2, 
  Clock, 
  Wrench,
  MoreVertical,
  Plus,
  Zap,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { planningCards, quotes, invoices, currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ProjectDetailProps {
  onBack: () => void;
  // Usually you'd pass a projectId, we just mock it using the first PC
}

export function ProjectDetail({ onBack }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'overzicht' | 'financieel' | 'bestanden' | 'producten'>('overzicht');
  
  // Hardcoded mock project for the demo
  const project = planningCards[0]; 

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(amount);

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
      {/* ── Top Navigation & Header ── */}
      <div className="bg-white border-b border-gray-200 px-6 pt-4 pb-0 flex flex-col shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 cursor-pointer w-fit mb-3 transition-colors font-medium" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Terug naar Projectenlijst
        </div>
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4 items-center">
            <Avatar className="h-16 w-16 border-2 border-white shadow-sm ring-1 ring-gray-100">
              <AvatarImage src={project.imageUrl || `https://i.pravatar.cc/150?u=${project.clientName}`} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-xl">{project.clientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 leading-none">{project.clientName}</h1>
                <Badge className={cn(
                  "ml-2 text-[10px] font-bold px-2 py-0 border-transparent",
                  project.status === 'Offerte maken' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                )}>
                  {project.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {project.address}</span>
                <span className="flex items-center gap-1.5"><span className="text-gray-300">•</span> {project.projectRef}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="border-gray-200 gap-2 font-semibold">
              <MessageSquare className="h-4 w-4" /> Stuur Email
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold gap-2">
              <Euro className="h-4 w-4" /> Maak Factuur
            </Button>
            <Button variant="ghost" size="icon" className="border border-gray-200 hover:bg-gray-100">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-end gap-6 border-transparent">
          {[
            { id: 'overzicht', label: 'Dossier Overzicht' },
            { id: 'financieel', label: 'Offertes & Facturen' },
            { id: 'producten', label: 'Producten (BOM)' },
            { id: 'bestanden', label: 'Bestanden & Media' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'px-1 py-3 text-sm font-bold border-b-[3px] transition-colors',
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'overzicht' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
              {/* Highlight Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-gray-200 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contractwaarde</p>
                    <h3 className="text-xl font-bold text-gray-900">{formatCurrency(project.amount)}</h3>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gefactureerd</p>
                    <h3 className="text-xl font-bold text-green-600">{formatCurrency(0)}</h3>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gepland op</p>
                    <h3 className="text-sm font-bold text-gray-900 mt-1 leading-snug">Nog niet<br/><span className="text-blue-600 cursor-pointer font-semibold underline text-xs">Plan nu in</span></h3>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Product</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {project.productTags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* CRM Info Block */}
              <Card className="border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-2 border-b border-gray-100 bg-gray-50/50">
                  <CardTitle className="text-base font-bold text-gray-800 flex items-center justify-between">
                    Klantinformatie
                    <span className="text-blue-600 text-xs font-semibold cursor-pointer">Bewerken</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 flex flex-col md:flex-row gap-8">
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-0.5">Contactpersoon</p>
                      <p className="text-sm font-bold text-gray-900">{project.clientName} (Beslisser)</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-0.5">Adres</p>
                      <p className="text-sm font-bold text-gray-900">{project.address}</p>
                    </div>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-0.5">Telefoonnummer</p>
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-gray-400"/> 06 12345678
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-0.5">Emailadres</p>
                      <p className="text-sm font-bold text-blue-600 flex items-center gap-2 cursor-pointer">
                        <Mail className="h-3.5 w-3.5 text-gray-400"/> {project.clientName.replace('Fam. ', '').toLowerCase()}@voorbeeld.nl
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technisch Dossier preview */}
              <Card className="border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-bold text-gray-800">Technisch Dossier (BOM)</CardTitle>
                  <Button variant="outline" size="sm" className="h-7 text-xs font-semibold">Bekijk Alles</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100">
                    <div className="p-3 px-5 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                          <Zap className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">SolarEdge SE5000H Omvormer</p>
                          <p className="text-xs font-medium text-gray-500">SE-INV-5K • 1 Stuk(s)</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 font-bold border-transparent">Op Voorraad</Badge>
                    </div>
                    <div className="p-3 px-5 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                          <Wrench className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Montagemateriaal Schuin Dak</p>
                          <p className="text-xs font-medium text-gray-500">MM-SD-01 • 12 Stuk(s)</p>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-700 font-bold border-transparent">Besteld</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right sidebar: Tijdlijn / Activiteit */}
            <div className="lg:col-span-1">
              <Card className="border-gray-200 shadow-sm h-full flex flex-col bg-white">
                <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
                  <CardTitle className="text-base font-bold text-gray-800 flex items-center justify-between">
                    Interne Tijdlijn
                    <MoreVertical className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 flex-1 overflow-auto">
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    {/* Activity Item 1 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-green-100 text-green-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded bg-white shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-gray-900 text-xs">Offerte Getekend</div>
                          <time className="font-medium text-gray-400 text-[10px]">Gisteren</time>
                        </div>
                        <div className="text-[11px] font-medium text-gray-500">Klant heeft digitaal geaccordeerd</div>
                      </div>
                    </div>
                    {/* Activity Item 2 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded bg-white shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-gray-900 text-xs">Offerte Verstuurd</div>
                          <time className="font-medium text-gray-400 text-[10px]">2 dagen terug</time>
                        </div>
                        <div className="text-[11px] font-medium text-gray-500">Door {project.accountManager}</div>
                      </div>
                    </div>
                    {/* Activity Item 3 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-gray-100 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <Plus className="h-4 w-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded bg-white shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-gray-900 text-xs">Project Aangemaakt</div>
                          <time className="font-medium text-gray-400 text-[10px]">Vorige week</time>
                        </div>
                        <div className="text-[11px] font-medium text-gray-500">Lead binnengekomen via website</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-gray-100">
                    <Button variant="outline" className="w-full bg-gray-50 border-dashed text-xs font-semibold h-8 text-gray-500 hover:text-blue-600">
                      <Plus className="h-3 w-3 mr-1" /> Voeg notitie toe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
          </div>
        )}

        {activeTab !== 'overzicht' && (
          <div className="flex items-center justify-center p-12 bg-white rounded-lg border border-gray-200 border-dashed">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Deze specifieke tab binnen het projectdossier kan verder uitgewerkt worden, bijvoorbeeld met een overzicht van bestanden, schouwingsverslagen of facturen.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
