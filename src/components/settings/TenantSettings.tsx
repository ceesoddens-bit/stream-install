import React, { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, Palette, Building2, CheckCircle2, MapPin, Building, CreditCard, Image as ImageIcon, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTenant } from '@/lib/tenantContext';
import { settingsService } from '@/lib/settingsService';

export function TenantSettings() {
  const { tenant, tenantId } = useTenant();
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    naam: '',
    bedrijfsnaam: '',
    kvk: '',
    btw: '',
    kleur: '#076735',
    logoUrl: '',
    straat: '',
    nummer: '',
    postcode: '',
    plaats: '',
    land: 'Nederland',
    iban: '',
    bic: '',
    tenaamstelling: '',
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        naam: tenant.naam || '',
        bedrijfsnaam: tenant.branding?.bedrijfsnaam || '',
        kvk: tenant.kvk || '',
        btw: tenant.btw || '',
        kleur: tenant.branding?.kleur || '#076735',
        logoUrl: tenant.branding?.logoUrl || '',
        straat: tenant.adres?.straat || '',
        nummer: tenant.adres?.nummer || '',
        postcode: tenant.adres?.postcode || '',
        plaats: tenant.adres?.plaats || '',
        land: tenant.adres?.land || 'Nederland',
        iban: tenant.bank?.iban || '',
        bic: tenant.bank?.bic || '',
        tenaamstelling: tenant.bank?.tenaamstelling || '',
      });
    }
  }, [tenant]);

  const handleSave = async () => {
    if (!tenantId) return;
    setSaving(true);
    try {
      await settingsService.updateTenant(tenantId, {
        naam: formData.naam,
        kvk: formData.kvk,
        btw: formData.btw,
        adres: {
          straat: formData.straat,
          nummer: formData.nummer,
          postcode: formData.postcode,
          plaats: formData.plaats,
          land: formData.land,
        },
        bank: {
          iban: formData.iban,
          bic: formData.bic,
          tenaamstelling: formData.tenaamstelling,
        },
        branding: {
          ...(tenant?.branding || {}),
          bedrijfsnaam: formData.bedrijfsnaam,
          kleur: formData.kleur,
          logoUrl: formData.logoUrl,
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="max-w-3xl space-y-8 pb-12">
      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b pb-4">
          <Building2 className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Bedrijfsgegevens</h3>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="naam" className="text-sm font-medium text-gray-700">Systeemnaam (intern)</Label>
              <Input 
                id="naam" 
                value={formData.naam} 
                onChange={(e) => setFormData({...formData, naam: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrijfsnaam" className="text-sm font-medium text-gray-700">Bedrijfsnaam (voor documenten/portaal)</Label>
              <Input 
                id="bedrijfsnaam" 
                value={formData.bedrijfsnaam} 
                onChange={(e) => setFormData({...formData, bedrijfsnaam: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kvk" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-400" />
                KvK Nummer
              </Label>
              <Input 
                id="kvk" 
                value={formData.kvk} 
                onChange={(e) => setFormData({...formData, kvk: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="btw" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                BTW Nummer
              </Label>
              <Input 
                id="btw" 
                value={formData.btw} 
                onChange={(e) => setFormData({...formData, btw: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              Adres
            </Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Input 
                  placeholder="Straat"
                  value={formData.straat} 
                  onChange={(e) => setFormData({...formData, straat: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Input 
                  placeholder="Huisnummer"
                  value={formData.nummer} 
                  onChange={(e) => setFormData({...formData, nummer: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Input 
                  placeholder="Postcode"
                  value={formData.postcode} 
                  onChange={(e) => setFormData({...formData, postcode: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Input 
                  placeholder="Plaats"
                  value={formData.plaats} 
                  onChange={(e) => setFormData({...formData, plaats: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Landmark className="h-4 w-4 text-gray-400" />
              Bankgegevens
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input 
                  placeholder="IBAN"
                  value={formData.iban} 
                  onChange={(e) => setFormData({...formData, iban: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Input 
                  placeholder="BIC"
                  value={formData.bic} 
                  onChange={(e) => setFormData({...formData, bic: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Input 
                placeholder="Tenaamstelling"
                value={formData.tenaamstelling} 
                onChange={(e) => setFormData({...formData, tenaamstelling: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-gray-400" />
              Logo
            </Label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-32 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <Input 
                  placeholder="Logo URL (bijv. https://example.com/logo.png)"
                  value={formData.logoUrl} 
                  onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">Plak hier de URL van uw logo. Dit wordt getoond op offertes en facturen.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Palette className="h-4 w-4 text-gray-400" />
              Huisstijl Kleur
            </Label>
            <div className="flex items-center gap-4">
              <div 
                className="h-12 w-12 rounded-lg border shadow-inner transition-transform hover:scale-105"
                style={{ backgroundColor: formData.kleur }}
              />
              <div className="flex-1 max-w-xs relative">
                <Input 
                  value={formData.kleur} 
                  onChange={(e) => setFormData({...formData, kleur: e.target.value})}
                  className="h-10 font-mono uppercase pl-10"
                />
                <div 
                  className="absolute left-3 top-2.5 h-5 w-5 rounded border"
                  style={{ backgroundColor: formData.kleur }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">De geselecteerde kleur wordt gebruikt voor knoppen, links en accenten in de klantportal en op documenten.</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Opslaan...' : 'Wijzigingen Opslaan'}
          </Button>
        </div>
      </div>

    </div>
  );
}
