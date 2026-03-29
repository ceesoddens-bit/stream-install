import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formTemplates } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Settings, 
  Check, 
  X, 
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const getPlanningTypeColor = (type: string) => {
  switch (type) {
    case 'Adviesgesprek': return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'Installatie': return 'bg-green-50 text-green-700 border-green-100';
    case 'Service': return 'bg-purple-50 text-purple-700 border-purple-100';
    case 'Schouwing': return 'bg-orange-50 text-orange-700 border-orange-100';
    default: return 'bg-gray-50 text-gray-700 border-gray-100';
  }
};

export function FormTemplatesTable() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Formuliersjablonen</h3>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="h-4 w-4" />
          Nieuw Sjabloon
        </Button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b">
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Naam</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase text-center">Installatie</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase text-center">Service</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Planningstype</th>
              <th className="p-3 text-xs font-semibold text-gray-500 uppercase text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {formTemplates.map((template) => (
              <tr key={template.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{template.name}</span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  {template.appliesToInstall ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                      <Check className="h-3 w-3" />
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-400 hover:bg-gray-100 border-none">
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                </td>
                <td className="p-3 text-center">
                  {template.appliesToService ? (
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-none">
                      <Check className="h-3 w-3" />
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-400 hover:bg-gray-100 border-none">
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                </td>
                <td className="p-3">
                  <Badge variant="outline" className={cn("text-[10px] font-medium px-2 py-0", getPlanningTypeColor(template.planningType))}>
                    {template.planningType}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                      <Settings className="h-4 w-4" />
                    </Button>
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
