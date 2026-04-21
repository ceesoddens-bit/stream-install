import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { useTenant } from '@/lib/tenantContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function PortalSettings() {
  const { userDoc } = useTenant();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Instellingen</h1>
        <p className="text-sm text-gray-500">Beheer uw persoonlijke gegevens en voorkeuren.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-400" />
            Persoonlijke Gegevens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="naam">Naam</Label>
            <Input id="naam" value={userDoc?.displayName || ''} disabled />
            <p className="text-xs text-gray-500">Neem contact met ons op om uw naam te wijzigen.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mailadres</Label>
            <Input id="email" type="email" value={userDoc?.email || ''} disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}