import React, { useState } from 'react';
import { TenantSettings } from './TenantSettings';
import { ManagementUsersView } from '../management/ManagementUsersView';
import { ManagementFormTemplatesListView } from '../management/ManagementFormTemplatesListView';
import { ManagementCustomerPortalView } from '../management/ManagementCustomerPortalView';
import { cn } from '@/lib/utils';
import { 
  Settings, 
  FileText, 
  Users, 
  Shield, 
  Mail, 
  Bell, 
  Globe,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

        <div className="mt-8 border-t pt-4">
          <Link
            to="/dashboard/instellingen/abonnement"
            className="flex items-center justify-between px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-3">
              <ExternalLink className="h-4 w-4" />
              Abonnement
            </span>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'bedrijf' && <TenantSettings />}
        {activeTab === 'sjablonen' && <ManagementFormTemplatesListView />}
        {activeTab === 'gebruikers' && <ManagementUsersView />}
        {activeTab === 'portal' && <ManagementCustomerPortalView />}
        
        {activeTab === 'rechten' && (
          <div className="max-w-4xl space-y-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Rechten (RBAC)</h1>
              <p className="text-sm text-gray-500">Beheer welke rollen toegang hebben tot welke acties in de applicatie.</p>
            </div>
            <div className="bg-white border rounded-xl p-6 shadow-sm text-center py-12">
              <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">RBAC Matrix Editor in ontwikkeling</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Op dit moment is de rollenmatrix hardcoded in de broncode om veiligheidsredenen.
                Een visuele editor om aangepaste rollen en rechten toe te wijzen komt in een toekomstige update.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="max-w-3xl space-y-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Email Instellingen</h1>
              <p className="text-sm text-gray-500">Configureer uitgaande e-mails (via Firebase Trigger Email).</p>
            </div>
            <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
              <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-lg text-sm">
                <p>Uitgaande e-mails worden momenteel verzonden via het systeemadres <strong>noreply@streaminstall.nl</strong>.</p>
                <p className="mt-2">Om e-mails te versturen vanuit uw eigen domein, dient u DNS-records in te stellen.</p>
              </div>
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Domein Verificatie</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Neem contact op met support om uw eigen domein (DKIM/SPF) in te stellen voor Firebase Trigger Email.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notificaties' && (
          <div className="max-w-3xl space-y-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Notificaties</h1>
              <p className="text-sm text-gray-500">Stel in wanneer en hoe je meldingen wilt ontvangen.</p>
            </div>
            <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">In-app Notificaties</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-gray-900">Nieuwe tickets</div>
                    <div className="text-xs text-gray-500">Wanneer een klant een nieuw ticket aanmaakt in de portal</div>
                  </div>
                  <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                    <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-gray-900">Offerte geaccepteerd</div>
                    <div className="text-xs text-gray-500">Wanneer een klant een offerte digitaal ondertekent</div>
                  </div>
                  <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                    <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">E-mail Notificaties</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-gray-900">Wekelijkse samenvatting</div>
                    <div className="text-xs text-gray-500">Ontvang elke maandag een overzicht van de prestaties</div>
                  </div>
                  <div className="w-10 h-5 bg-gray-200 rounded-full relative">
                    <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fallback for anything else */}
        {activeTab !== 'bedrijf' && 
         activeTab !== 'sjablonen' && 
         activeTab !== 'gebruikers' && 
         activeTab !== 'rechten' && 
         activeTab !== 'email' && 
         activeTab !== 'notificaties' && 
         activeTab !== 'portal' && (
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
