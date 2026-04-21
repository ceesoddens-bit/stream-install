import React from 'react';
import { useTenant } from '@/lib/tenantContext';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PortalHeader() {
  const { userDoc, tenant } = useTenant();
  const primaryColor = tenant?.branding?.kleur || '#076735';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        {/* Placeholder for breadcrumbs or page title if needed */}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-900">
          <Bell className="h-5 w-5" />
          {/* Notification badge placeholder */}
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} />
        </Button>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">{userDoc?.displayName || 'Klant'}</span>
            <span className="text-xs text-gray-500">{userDoc?.email}</span>
          </div>
          <div 
            className="flex h-9 w-9 items-center justify-center rounded-full text-white font-medium shadow-sm"
            style={{ backgroundColor: primaryColor }}
          >
            {userDoc?.displayName?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
          </div>
        </div>
      </div>
    </header>
  );
}