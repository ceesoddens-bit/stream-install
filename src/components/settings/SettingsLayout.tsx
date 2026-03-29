import React, { useState } from 'react';
import { TenantSettings } from './TenantSettings';
import { FormTemplatesTable } from './FormTemplatesTable';
import { cn } from '@/lib/utils';
import { 
  Settings, 
  FileText, 
  Users, 
  Shield, 
  Mail, 
  Bell, 
  Globe 
} from 'lucide-react';

const tabs = [
  { id: 'bedrijf', label: 'Bedrijf', icon: Settings },
  { id: 'sjablonen', label: 'Sjablonen', icon: FileText },
  { id: 'gebruikers', label: 'Gebruikers', icon: Users },
  { id: 'rechten', label: 'Rechten', icon: Shield },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'notificaties', label: 'Notificaties', icon: Bell },
  { id: 'portal', label: 'Portal', icon: Globe },
];

export function SettingsLayout() {
  const [activeTab, setActiveTab] = useState('bedrijf');

  return (
    <div className="flex h-full gap-8">
      {/* Sidebar Navigation */}
      <div className="w-64 flex flex-col gap-1 border-r pr-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Instellingen</h2>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === tab.id 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-blue-600" : "text-gray-400")} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'bedrijf' && <TenantSettings />}
        {activeTab === 'sjablonen' && <FormTemplatesTable />}
        {activeTab !== 'bedrijf' && activeTab !== 'sjablonen' && (
          <div className="flex flex-col items-center justify-center h-64 bg-white border border-dashed rounded-xl text-gray-400">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <Settings className="h-8 w-8" />
            </div>
            <p className="font-medium">De instellingen voor "{tabs.find(t => t.id === activeTab)?.label}" zijn nog in ontwikkeling.</p>
          </div>
        )}
      </div>
    </div>
  );
}
