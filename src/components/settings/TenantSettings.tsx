import React, { useState } from 'react';
import { tenantSettings } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, Palette, Building2, Hash } from 'lucide-react';

export function TenantSettings() {
  const [settings, setSettings] = useState(tenantSettings);

  return (
    <div className="max-w-2xl space-y-8">
      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b pb-4">
          <Building2 className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Bedrijfsinstellingen</h3>
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Bedrijfsnaam
            </Label>
            <Input 
              id="companyName" 
              value={settings.companyName} 
              onChange={(e) => setSettings({...settings, companyName: e.target.value})}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prefix" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Referentie Prefix
              <Hash className="h-3 w-3 text-gray-400" />
            </Label>
            <Input 
              id="prefix" 
              value={settings.referencePrefix} 
              onChange={(e) => setSettings({...settings, referencePrefix: e.target.value})}
              className="h-10 font-mono"
            />
            <p className="text-xs text-gray-500 italic">Gebruikt voor offertes en facturen (bijv. OF-2024-001)</p>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Huisstijl Kleur
              <Palette className="h-3 w-3 text-gray-400" />
            </Label>
            <div className="flex items-center gap-4">
              <div 
                className="h-12 w-12 rounded-lg border shadow-inner transition-transform hover:scale-105"
                style={{ backgroundColor: settings.primaryColor }}
              />
              <div className="flex-1 relative">
                <Input 
                  value={settings.primaryColor} 
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                  className="h-10 font-mono uppercase pl-10"
                />
                <div 
                  className="absolute left-3 top-2.5 h-5 w-5 rounded border"
                  style={{ backgroundColor: settings.primaryColor }}
                />
              </div>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden flex">
              <div className="flex-1 h-full" style={{ backgroundColor: settings.primaryColor }} />
              <div className="flex-1 h-full opacity-80" style={{ backgroundColor: settings.primaryColor }} />
              <div className="flex-1 h-full opacity-60" style={{ backgroundColor: settings.primaryColor }} />
              <div className="flex-1 h-full opacity-40" style={{ backgroundColor: settings.primaryColor }} />
              <div className="flex-1 h-full opacity-20" style={{ backgroundColor: settings.primaryColor }} />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Save className="h-4 w-4" />
            Wijzigingen Opslaan
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <div className="bg-blue-100 p-2 rounded-lg h-fit">
          <Palette className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-blue-900">Portal Preview</h4>
          <p className="text-xs text-blue-700 mt-1">
            De geselecteerde kleur wordt gebruikt voor knoppen, links en accenten in de klantportal en op documenten.
          </p>
        </div>
      </div>
    </div>
  );
}
