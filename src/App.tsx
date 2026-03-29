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
import { CRMModule } from '@/components/crm/CRMModule';
import { FormsLayout } from '@/components/forms/FormsLayout';
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
            {activeView === 'inventory' && <InventoryLayout />}
            {activeView === 'finance' && <FinanceLayout />}
            {activeView === 'settings' && <SettingsLayout />}
            {activeView === 'crm' && <CRMModule />}
            {activeView === 'forms' && <FormsLayout />}
            {activeView !== 'project_detail' && activeView !== 'dashboard' && activeView !== 'projects' && activeView !== 'my_projects' && activeView !== 'planning' && activeView !== 'inventory' && activeView !== 'finance' && activeView !== 'settings' && activeView !== 'crm' && activeView !== 'forms' && (
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
