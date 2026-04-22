import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { PlannerView } from '@/components/planning/PlannerView';
import { ProjectDetail } from '@/components/crm/ProjectDetail';
import { InventoryLayout } from '@/components/inventory/InventoryLayout';
import { FinanceLayout } from '@/components/finance/FinanceLayout';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { ContactsLayout } from '@/components/crm/ContactsLayout';
import { CompaniesLayout } from '@/components/crm/CompaniesLayout';
import { QuotesLayout } from '@/components/finance/QuotesLayout';
import { FormsLayout } from '@/components/forms/FormsLayout';
import { SalesLayout } from '@/components/sales/SalesLayout';
import { PlanningListLayout } from '@/components/planning/PlanningListLayout';
import { TicketsLayout } from '@/components/tickets/TicketsLayout';
import { TasksLayout } from '@/components/tasks/TasksLayout';
import { CalendarLayout } from '@/components/calendar/CalendarLayout';
import { HoursLayout } from '@/components/hours/HoursLayout';
import { TeamsLayout } from '@/components/planning/TeamsLayout';
import SubscriptionPage from '@/pages/SubscriptionPage';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AIChatPopup } from '@/components/layout/AIChatPopup';
import { Toaster } from 'sonner';
import { stateService, TimerState } from '@/lib/stateService';
import { isAdministrationView, isKnownView, isManagementView, isTicketsView, VIEW_REGISTRY } from '@/lib/viewRegistry';
import { AdministrationLayout } from '@/components/administration/AdministrationLayout';
import { ManagementLayout } from '@/components/management/ManagementLayout';
import { ManagementDashboardView } from '@/components/management/ManagementDashboardView';
import { useTenant } from '@/lib/tenantContext';
import { ModuleGuard } from '@/components/auth/ModuleGuard';
import { useNavigate, useParams } from 'react-router-dom';
import { ModuleKey } from '@/lib/modules';

function withModuleGuard(viewId: string, node: React.ReactNode): React.ReactNode {
  const meta = VIEW_REGISTRY[viewId];
  if (meta?.requiredModule) {
    return <ModuleGuard module={meta.requiredModule as ModuleKey}>{node}</ModuleGuard>;
  }
  return node;
}

export default function DashboardShell() {
  const { authUser } = useTenant();
  const navigate = useNavigate();
  const params = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const viewId = params.viewId;
  const subPath = params['*'];
  let activeView = subPath 
    ? `${viewId}_${subPath.replace(/\//g, '_')}` 
    : (viewId || 'dashboard');

  // Specific handling for project_detail to extract the ID
  let projectIdForDetail = '';
  if (activeView.startsWith('project_detail_')) {
    projectIdForDetail = activeView.replace('project_detail_', '');
    activeView = 'project_detail';
  }

  const setActiveView = (v: string) => {
    const path = v === 'dashboard' ? '' : v.replace(/_/g, '/');
    navigate(`/dashboard/${path}`);
  };
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [timerDoc, setTimerDoc] = useState<TimerState>({ isRunning: false, startTime: null, baseSeconds: 0 });
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    if (!authUser) return;
    return stateService.subscribeToTimer((state) => setTimerDoc(state));
  }, [authUser]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const tick = () => {
      if (timerDoc.isRunning && timerDoc.startTime) {
        const startMillis = timerDoc.startTime.toMillis();
        const elapsed = Math.floor((Date.now() - startMillis) / 1000);
        setTimerSeconds(timerDoc.baseSeconds + elapsed);
      } else {
        setTimerSeconds(timerDoc.baseSeconds);
      }
    };
    tick();
    if (timerDoc.isRunning) interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timerDoc]);

  const toggleTimer = () => stateService.toggleTimer(timerDoc, timerSeconds);
  const resetTimer = () => stateService.resetTimer();
  const isTimerRunning = timerDoc.isRunning;

  const isAdministration = isAdministrationView(activeView);
  const isTickets = isTicketsView(activeView);
  const isManagement = isManagementView(activeView);
  const isKnown = isKnownView(activeView);

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden font-sans relative">
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          activeView={activeView}
          onViewChange={setActiveView}
          isChatOpen={isChatOpen}
          onChatOpenChange={setIsChatOpen}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          onToggleTimer={toggleTimer}
          onResetTimer={resetTimer}
        />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 overflow-hidden p-6">
            {activeView === 'dashboard' && (
              <Dashboard timerSeconds={timerSeconds} isTimerRunning={isTimerRunning} onToggleTimer={toggleTimer} onResetTimer={resetTimer} />
            )}
            {activeView === 'management_dashboard' && <ManagementDashboardView />}
            {activeView === 'project_detail' &&
              withModuleGuard('project_detail', <ProjectDetail projectId={projectIdForDetail} onBack={() => setActiveView('projects')} />)}
            {(activeView === 'projects' || activeView === 'my_projects') &&
              withModuleGuard(activeView, (
                <KanbanBoard
                  scope={activeView === 'my_projects' ? 'mine' : 'all'}
                  onViewProject={(id) => setActiveView('project_detail_' + id)}
                />
              ))}
            {activeView === 'planning' && withModuleGuard('planning', <PlannerView />)}
            {activeView === 'planning_list' && withModuleGuard('planning_list', <PlanningListLayout />)}
            {activeView === 'inventory' && withModuleGuard('inventory', <InventoryLayout initialTab="artikelen" />)}
            {activeView === 'inventory_overview' && withModuleGuard('inventory_overview', <InventoryLayout initialTab="overzicht" />)}
            {activeView === 'inventory_mutaties' && withModuleGuard('inventory_mutaties', <InventoryLayout initialTab="mutaties" />)}
            {activeView === 'inventory_magazijnen' && withModuleGuard('inventory_magazijnen', <InventoryLayout initialTab="magazijnen" />)}
            {activeView === 'inventory_inkooporders' && withModuleGuard('inventory_inkooporders', <InventoryLayout initialTab="inkooporders" />)}
            {activeView === 'inventory_leveranciers' && withModuleGuard('inventory_leveranciers', <InventoryLayout initialTab="leveranciers" />)}
            {activeView === 'inventory_boms' && withModuleGuard('inventory_boms', <InventoryLayout initialTab="boms" />)}
            {activeView === 'finance' && withModuleGuard('finance', <FinanceLayout />)}
            {activeView === 'quotes' && withModuleGuard('quotes', <QuotesLayout />)}
            {isAdministration && <AdministrationLayout activeView={activeView} onViewChange={setActiveView} />}
            {activeView === 'settings' && <SettingsLayout />}
            {activeView === 'crm' && withModuleGuard('crm', <ContactsLayout />)}
            {activeView === 'crm_companies' && withModuleGuard('crm_companies', <CompaniesLayout />)}
            {activeView === 'forms' && withModuleGuard('forms', <FormsLayout />)}
            {activeView === 'sales' && withModuleGuard('sales', <SalesLayout />)}
            {activeView === 'tasks' && withModuleGuard('tasks', <TasksLayout />)}
            {activeView === 'calendar' && withModuleGuard('calendar', <CalendarLayout />)}
            {activeView === 'hours' && withModuleGuard('hours', <HoursLayout />)}
            {activeView === 'teams' && withModuleGuard('teams', <TeamsLayout />)}
            {activeView === 'settings_subscription' && <SubscriptionPage />}
            {isTickets && withModuleGuard(activeView, <TicketsLayout />)}
            {isManagement && activeView !== 'management_dashboard' && <ManagementLayout activeView={activeView} />}
            {!isKnown && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2 capitalize">{activeView.replace('_', ' ')}</h2>
                  <p>Deze module is nog in ontwikkeling.</p>
                </div>
              </div>
            )}
          </main>
        </div>
        <AIChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        <Toaster position="top-right" richColors />
      </div>
    </TooltipProvider>
  );
}
