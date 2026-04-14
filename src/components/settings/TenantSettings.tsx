import React, { useState } from 'react';
import { tenantSettings } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, Palette, Building2, Hash, Database, CheckCircle2 } from 'lucide-react';
import { seedDatabase } from '@/lib/firebaseSeeder';

export function TenantSettings() {
  const [settings, setSettings] = useState(tenantSettings);
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedDatabase();
      setSeeded(true);
      setTimeout(() => setSeeded(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8 pb-12">
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
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Save className="h-4 w-4" />
            Wijzigingen Opslaan
          </Button>
        </div>
      </div>

      {/* Database Seeding Section */}
      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b pb-4">
          <Database className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900">Database Migratie</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Initialiseer je Firestore database met de huidige mock data. Dit is handig voor de eerste migratie of om een testomgeving te vullen.
          </p>
          
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-3">
            <div className="bg-amber-100 p-1.5 rounded h-fit">
              <Database className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-xs text-amber-800 leading-normal">
              <strong>Let op:</strong> Dit voegt alleen data toe aan lege collecties. Bestaande data wordt niet overschreven om dataduplicatie te voorkomen.
            </p>
          </div>

          <Button 
            variant="outline" 
            onClick={handleSeed}
            disabled={seeding || seeded}
            className={cn(
              "w-full h-11 transition-all gap-2",
              seeded ? "border-emerald-500 text-emerald-600 bg-emerald-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
            )}
          >
            {seeding ? (
              <>
                <div className="h-4 w-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                Synchroniseren...
              </>
            ) : seeded ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Synchronisatie Voltooid
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Start Database Seeding
              </>
            )}
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
