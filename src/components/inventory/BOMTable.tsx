import React from 'react';
import { Badge } from '@/components/ui/badge';
import { bomItems } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Calendar, ClipboardList } from 'lucide-react';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'In_Progress': return 'bg-purple-50 text-purple-700 border-purple-100';
    case 'Scheduled': return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'Quoted': return 'bg-orange-50 text-orange-700 border-orange-100';
    default: return 'bg-gray-50 text-gray-700 border-gray-100';
  }
};

const getPlanningBadge = (status: string) => {
  switch (status) {
    case 'Planned': return 'bg-green-50 text-green-700 border-green-100';
    case 'Confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'Draft': return 'bg-amber-50 text-amber-700 border-amber-100';
    default: return 'bg-gray-50 text-gray-700 border-gray-100';
  }
};

export function BOMTable() {
  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b">
            <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
            <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Planning</th>
            <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Datum</th>
            <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Artikel</th>
            <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
            <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Aantal</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {bomItems.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{item.projectName}</span>
                </div>
              </td>
              <td className="p-3">
                <Badge variant="outline" className={cn("text-[10px] font-medium px-2 py-0", getStatusBadge(item.projectStatus))}>
                  {item.projectStatus.replace('_', ' ')}
                </Badge>
              </td>
              <td className="p-3">
                <Badge variant="outline" className={cn("text-[10px] font-medium px-2 py-0", getPlanningBadge(item.planningStatus))}>
                  {item.planningStatus}
                </Badge>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {item.plannedDate}
                </div>
              </td>
              <td className="p-3 font-medium text-sm text-gray-900">{item.articleName}</td>
              <td className="p-3 font-mono text-xs text-gray-500">{item.sku || '-'}</td>
              <td className="p-3 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-gray-100 font-bold text-sm text-gray-700">
                  {item.requiredQuantity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
