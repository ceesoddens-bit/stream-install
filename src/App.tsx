/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
import { TooltipProvider } from '@/components/ui/tooltip';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
          activeView={activeView}
          onViewChange={setActiveView}
        />
        
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          
          <main className="flex-1 overflow-hidden p-6">
            {activeView === 'dashboard' && <Dashboard />}
            {activeView === 'project_detail' && <ProjectDetail onBack={() => setActiveView('projects')} />}
            {(activeView === 'projects' || activeView === 'my_projects') && <KanbanBoard onViewProject={(id) => setActiveView('project_detail')} />}
            {activeView === 'planning' && <PlannerView />}
            {activeView === 'planning_list' && <PlanningListLayout />}
            {activeView === 'inventory' && <InventoryLayout />}
            {activeView === 'finance' && <FinanceLayout />}
            {activeView === 'quotes' && <QuotesLayout />}
            {activeView === 'settings' && <SettingsLayout />}
            {activeView === 'crm' && <ContactsLayout />}
            {activeView === 'crm_companies' && <CompaniesLayout />}
            {activeView === 'forms' && <FormsLayout />}
            {activeView === 'sales' && <SalesLayout />}
            {activeView === 'tasks' && <TasksLayout />}
            {activeView === 'calendar' && <CalendarLayout />}
            {['tickets_all', 'tickets_my'].includes(activeView) && <TicketsLayout />}
            {activeView !== 'project_detail' && activeView !== 'dashboard' && activeView !== 'projects' && activeView !== 'my_projects' && activeView !== 'planning' && activeView !== 'planning_list' && activeView !== 'inventory' && activeView !== 'finance' && activeView !== 'quotes' && activeView !== 'settings' && activeView !== 'crm' && activeView !== 'crm_companies' && activeView !== 'forms' && activeView !== 'sales' && activeView !== 'tasks' && activeView !== 'calendar' && activeView !== 'tickets_all' && activeView !== 'tickets_my' && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2 capitalize">{activeView.replace('_', ' ')}</h2>
                  <p>Deze module is nog in ontwikkeling.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
