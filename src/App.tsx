import React, { useState, useEffect } from 'react';
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
import { TooltipProvider } from '@/components/ui/tooltip';
import { AIChatPopup } from '@/components/layout/AIChatPopup';
import { Target } from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LoginPage } from '@/components/auth/LoginPage';
import { stateService, TimerState } from '@/lib/stateService';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Monitor Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Global Timer State from Firestore
  const [timerDoc, setTimerDoc] = useState<TimerState>({ isRunning: false, startTime: null, baseSeconds: 0 });
  const [timerSeconds, setTimerSeconds] = useState(0);

  // 1. Subscribe to Firestore Global State
  useEffect(() => {
    if (!user) return;
    const unsubscribe = stateService.subscribeToTimer((state) => {
      setTimerDoc(state);
    });
    return () => unsubscribe();
  }, [user]);

  // 2. Local UI Tick for smooth counting
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const updateLocalTimer = () => {
      if (timerDoc.isRunning && timerDoc.startTime) {
        const startMillis = timerDoc.startTime.toMillis();
        const elapsedSinceStart = Math.floor((Date.now() - startMillis) / 1000);
        setTimerSeconds(timerDoc.baseSeconds + elapsedSinceStart);
      } else {
        setTimerSeconds(timerDoc.baseSeconds);
      }
    };

    updateLocalTimer(); // Initial call

    if (timerDoc.isRunning) {
      interval = setInterval(updateLocalTimer, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timerDoc]);

  const toggleTimer = () => stateService.toggleTimer(timerDoc, timerSeconds);
  const resetTimer = () => stateService.resetTimer();

  const isTimerRunning = timerDoc.isRunning;

  if (authLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <Target className="h-6 w-6 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Laden van uw dashbord...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans relative">
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
              <Dashboard 
                timerSeconds={timerSeconds}
                isTimerRunning={isTimerRunning}
                onToggleTimer={toggleTimer}
                onResetTimer={resetTimer}
              />
            )}
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
            {activeView === 'hours' && <HoursLayout />}
            {activeView === 'teams' && <TeamsLayout />}
            {['tickets_all', 'tickets_my'].includes(activeView) && <TicketsLayout />}
            {activeView !== 'project_detail' && activeView !== 'dashboard' && activeView !== 'projects' && activeView !== 'my_projects' && activeView !== 'planning' && activeView !== 'planning_list' && activeView !== 'teams' && activeView !== 'inventory' && activeView !== 'finance' && activeView !== 'quotes' && activeView !== 'settings' && activeView !== 'crm' && activeView !== 'crm_companies' && activeView !== 'forms' && activeView !== 'sales' && activeView !== 'tasks' && activeView !== 'calendar' && activeView !== 'hours' && activeView !== 'tickets_all' && activeView !== 'tickets_my' && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2 capitalize">{activeView.replace('_', ' ')}</h2>
                  <p>Deze module is nog in ontwikkeling.</p>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Global Chat Popup */}
        <AIChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </TooltipProvider>
  );
}
