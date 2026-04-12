import React, { useMemo } from 'react';
import { BarChart3, Building2, FileText, Globe, LayoutDashboard, Map, Settings, Sparkles, Users, ListTodo } from 'lucide-react';

type ManagementLayoutProps = {
  activeView: string;
};

const managementViews = [
  { id: 'management_users', label: 'Gebruikers', icon: Users },
  { id: 'management_customers', label: 'Klanten', icon: Building2 },
  { id: 'management_automation_overview', label: 'Automation · Overzicht', icon: Sparkles },
  { id: 'management_automation_integrations', label: 'Automation · Integraties', icon: Sparkles },
  { id: 'management_pv_designer', label: 'PV-Designer', icon: Map },
  { id: 'management_templates_documents', label: 'Sjablonen · Documenten', icon: FileText },
  { id: 'management_templates_emails', label: 'Sjablonen · E-mails', icon: FileText },
  { id: 'management_projects', label: 'Projecten', icon: ListTodo },
  { id: 'management_customer_portal', label: 'Customer Portal', icon: Globe },
  { id: 'management_settings', label: 'Instellingen', icon: Settings },
  { id: 'management_dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export function ManagementLayout({ activeView }: ManagementLayoutProps) {
  const current = useMemo(() => {
    return managementViews.find(v => v.id === activeView) ?? {
      id: activeView,
      label: 'Management',
      icon: BarChart3,
    };
  }, [activeView]);

  const Icon = current.icon;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{current.label}</h1>
          <p className="text-sm text-gray-500">Management</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col items-center justify-center h-64 bg-white border border-dashed rounded-xl text-gray-400">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <Icon className="h-8 w-8" />
          </div>
          <p className="font-medium">De pagina voor "{current.label}" is nog in ontwikkeling.</p>
        </div>
      </div>
    </div>
  );
}

