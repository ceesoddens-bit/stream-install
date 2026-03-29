import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { quotes } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { 
  Edit2, 
  FileDown, 
  FileText, 
  PenTool, 
  MessageSquare, 
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Concept': return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'Verstuurd': return 'bg-purple-50 text-purple-700 border-purple-100';
    case 'Geaccepteerd': return 'bg-green-50 text-green-700 border-green-100';
    case 'Rejected': return 'bg-red-50 text-red-700 border-red-100';
    default: return 'bg-gray-50 text-gray-700 border-gray-100';
  }
};

const getProjectStatusColor = (status: string) => {
  switch (status) {
    case 'Lead': return 'bg-orange-50 text-orange-700 border-orange-100';
    case 'Offerte': return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'Project': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    default: return 'bg-gray-50 text-gray-700 border-gray-100';
  }
};

export function QuotesTable() {
  const [activeTab, setActiveTab] = useState('Alles');

  const filteredQuotes = activeTab === 'Alles' 
    ? quotes 
    : quotes.filter(q => q.status === activeTab);

  const counts = {
    Alles: quotes.length,
    Rejected: quotes.filter(q => q.status === 'Rejected').length,
    Geaccepteerd: quotes.filter(q => q.status === 'Geaccepteerd').length,
    Concept: quotes.filter(q => q.status === 'Concept').length,
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-4 border-b">
        {Object.entries(counts).map(([label, count]) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={cn(
              "pb-2 px-1 text-sm font-medium transition-colors relative",
              activeTab === label ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <span className="flex items-center gap-2">
              {label}
              <Badge variant="secondary" className={cn(
                "ml-1 h-5 min-w-[20px] px-1 flex items-center justify-center text-[10px]",
                label === 'Rejected' && activeTab === label ? "bg-red-100 text-red-700" :
                label === 'Geaccepteerd' && activeTab === label ? "bg-green-100 text-green-700" :
                label === 'Concept' && activeTab === label ? "bg-blue-100 text-blue-700" : ""
              )}>
                {count}
              </Badge>
            </span>
            {activeTab === label && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b">
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Naam</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Project Status</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Project</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Bedrag</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Datum</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase text-center">Bekeken</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredQuotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-3">
                  <div className="text-sm font-medium text-gray-900">{quote.title}</div>
                </td>
                <td className="p-3">
                  <Badge variant="outline" className={cn("text-[10px] font-medium px-2 py-0", getStatusColor(quote.status))}>
                    {quote.status}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge variant="outline" className={cn("text-[10px] font-medium px-2 py-0", getProjectStatusColor(quote.projectStatus))}>
                    {quote.projectStatus}
                  </Badge>
                </td>
                <td className="p-3 text-sm text-gray-600">{quote.projectName}</td>
                <td className="p-3 text-sm text-gray-600">{quote.contactName}</td>
                <td className="p-3 text-sm font-semibold text-gray-900">
                  €{quote.totalAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 text-xs text-gray-500">{quote.sentDate}</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                    <Eye className="h-3 w-3" />
                    {quote.openedCount}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Tooltip>
                      <TooltipTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-gray-400 hover:text-blue-600")}>
                        <Edit2 className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>Bewerken</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-gray-400 hover:text-blue-600")}>
                        <FileDown className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>Download PDF</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-gray-400 hover:text-blue-600")}>
                        <FileText className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>Document Genereren</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-gray-400 hover:text-blue-600")}>
                        <PenTool className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>Ondertekenen</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-gray-400 hover:text-blue-600")}>
                        <MessageSquare className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>Notities</TooltipContent>
                    </Tooltip>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
