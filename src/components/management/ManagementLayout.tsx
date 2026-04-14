import React, { useMemo } from 'react';
import { BarChart3, Building2, FileText, Globe, LayoutDashboard, Map, Settings, Sparkles, Users, ListTodo } from 'lucide-react';
import { ManagementUsersView } from './ManagementUsersView';
import { ManagementCustomersView } from './ManagementCustomersView';
import { ManagementAutomationView } from './ManagementAutomationView';
import { ManagementAutomationLiteView } from './ManagementAutomationLiteView';
import { ManagementPVDesignerSettingsView } from './ManagementPVDesignerSettingsView';
import { ManagementAutomationEmailView } from './ManagementAutomationEmailView';
import { ManagementEmailTemplatesView } from './ManagementEmailTemplatesView';
import { ManagementFormTemplatesListView } from './ManagementFormTemplatesListView';
import { ManagementPdfTemplatesListView } from './ManagementPdfTemplatesListView';
import { ManagementWorkflowsView } from './ManagementWorkflowsView';
import { ManagementProjectGroupsView } from './ManagementProjectGroupsView';
import { ManagementCustomerPortalView } from './ManagementCustomerPortalView';

type ManagementLayoutProps = {
  activeView: string;
};

const managementViews = [
  { id: 'management_users', label: 'Gebruikers', icon: Users },
  { id: 'management_customers', label: 'Klanten', icon: Building2 },
  { id: 'management_automation', label: 'Automation', icon: Sparkles },
  { id: 'management_automation_lite', label: 'Automatisering Lite', icon: Sparkles },
  { id: 'management_pv_designer', label: 'PV-Designer', icon: Map },
  { id: 'management_templates_automation_email', label: 'Sjablonen · Automation E-Mail', icon: FileText },
  { id: 'management_templates_email', label: 'Sjablonen · Email', icon: FileText },
  { id: 'management_templates_forms', label: 'Sjablonen · Formulieren', icon: FileText },
  { id: 'management_templates_pdf', label: 'Sjablonen · PDF', icon: FileText },
  { id: 'management_templates_workflows', label: 'Sjablonen · Workflows', icon: FileText },
  { id: 'management_projects', label: 'Projecten', icon: ListTodo },
  { id: 'management_projectgroups', label: 'Projectgroepen', icon: Users },
  { id: 'management_customer_portal', label: 'Customer Portal', icon: Globe },
  { id: 'management_customer_portal_layout', label: 'Customer Portal · Layout', icon: Globe },
  { id: 'management_customer_portal_content', label: 'Customer Portal · Klantportaalinhoud', icon: Globe },
  { id: 'management_settings', label: 'Instellingen', icon: Settings },
  { id: 'management_dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export function ManagementLayout({ activeView }: ManagementLayoutProps) {
  if (activeView === 'management_users') return <ManagementUsersView />;
  if (activeView === 'management_customers') return <ManagementCustomersView />;
  if (activeView === 'management_automation') return <ManagementAutomationView />;
  if (activeView === 'management_automation_lite') return <ManagementAutomationLiteView />;
  if (activeView === 'management_pv_designer') return <ManagementPVDesignerSettingsView />;
  if (activeView === 'management_templates_automation_email') return <ManagementAutomationEmailView />;
  if (activeView === 'management_templates_email') return <ManagementEmailTemplatesView />;
  if (activeView === 'management_templates_forms') return <ManagementFormTemplatesListView />;
  if (activeView === 'management_templates_pdf') return <ManagementPdfTemplatesListView />;
  if (activeView === 'management_templates_workflows') return <ManagementWorkflowsView />;
  if (activeView === 'management_projectgroups') return <ManagementProjectGroupsView />;
  if (activeView === 'management_customer_portal') return <ManagementCustomerPortalView initialTab="layout" />;
  if (activeView === 'management_customer_portal_layout') return <ManagementCustomerPortalView initialTab="layout" />;
  if (activeView === 'management_customer_portal_content') return <ManagementCustomerPortalView initialTab="content" />;

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
