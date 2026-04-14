import React, { useState } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  Calendar,
  Users,
  KanbanSquare,
  Map,
  Package,
  Settings,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Zap,
  ListTodo,
  UserCircle2,
  Home,
  CheckSquare,
  Building2,
  List,
  Box,
  Target,
  FileText,
  Ticket,
  Clock,
  BarChart3,
  MessageSquare,
  Sparkles,
  Globe,
  CheckCircle2,
  Play,
  Square,
  X as XIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { currentUser } from '@/data/mockData';
import { formatSeconds } from '@/lib/timeUtils';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activeView: string;
  onViewChange: (view: string) => void;
  isChatOpen: boolean;
  onChatOpenChange: (isOpen: boolean) => void;
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
}

type NavItem = {
  icon: any;
  label: string;
  id: string;
  subItems?: { 
    label: string; 
    id: string; 
    icon?: any; 
    badge?: string;
    subItems?: { label: string; id: string; icon?: any }[];
  }[];
};

const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: 'MIJN OMGEVING',
    id: 'mijn_omgeving',
    subItems: [
      { label: 'Home', id: 'dashboard', icon: Home },
      { 
        label: 'Tickets', 
        id: 'tickets_parent', 
        icon: Ticket, 
        badge: '0',
        subItems: [
          { label: 'Alle Tickets', id: 'tickets_all' },
          { label: 'Mijn Tickets', id: 'tickets_my' }
        ]
      },
      { label: 'Taken', id: 'tasks', icon: CheckSquare },
      { label: 'Kalender', id: 'calendar', icon: Calendar },
      { label: 'Mijn Uren', id: 'hours', icon: Clock },
      { label: 'Verkoop', id: 'sales', icon: BarChart3 },
    ]
  },
  {
    icon: Map,
    label: 'PLANNING',
    id: 'planning_parent',
    subItems: [
      { label: 'Planner', id: 'planning', icon: Calendar },
      { label: 'Planner', id: 'planning_beta', icon: Calendar, badge: 'BETA' },
      { label: 'Lijst', id: 'planning_list', icon: List },
      { label: 'Teams', id: 'teams', icon: Users },
    ]
  },
  {
    icon: Users,
    label: 'CRM',
    id: 'crm_parent',
    subItems: [
      { label: 'Contacten', id: 'crm', icon: Users },
      { label: 'Bedrijven', id: 'crm_companies', icon: Building2 },
    ]
  },
  { 
    icon: KanbanSquare, 
    label: 'PROJECTEN', 
    id: 'projects_parent',
    subItems: [
      { label: 'Alle Projecten', id: 'projects', icon: ListTodo },
      { label: 'Mijn Projecten', id: 'my_projects', icon: UserCircle2 }
    ]
  },
  {
    icon: Target,
    label: 'FORMULIEREN',
    id: 'formulieren_parent',
    subItems: [
      { label: 'Alles', id: 'forms', icon: FileText }
    ]
  },
  {
    icon: CreditCard,
    label: 'ADMINISTRATIE',
    id: 'finance_parent',
    subItems: [
      { label: 'Offertes', id: 'administratie_offertes', icon: FileText },
      { label: 'Facturen', id: 'administratie_facturen', icon: CreditCard },
      { label: 'Urenregistratie', id: 'administratie_urenregistratie', icon: Clock }
    ]
  },
  {
    icon: Package,
    label: 'VOORRAAD',
    id: 'logistiek_parent',
    subItems: [
      { label: 'Overzicht', id: 'inventory_overview', icon: LayoutDashboard },
      { label: 'Mutaties', id: 'inventory_mutaties', icon: List },
      { label: 'Magazijnen', id: 'inventory_magazijnen', icon: Building2 },
      { label: 'Artikelen', id: 'inventory', icon: Box },
      { label: 'Inkooporders', id: 'inventory_inkooporders', icon: FileText },
      { label: 'Leveranciers', id: 'inventory_leveranciers', icon: Users },
      { label: 'BOMs', id: 'inventory_boms', icon: Package },
    ]
  },
  {
    icon: BarChart3,
    label: 'MANAGEMENT',
    id: 'management_parent',
    subItems: [
      { label: 'Dashboard', id: 'management_dashboard', icon: LayoutDashboard },
      { label: 'Gebruikers', id: 'management_users', icon: Users },
      { label: 'Klanten', id: 'management_customers', icon: Building2 },
      {
        label: 'Automation',
        id: 'management_automation_parent',
        icon: Sparkles,
        subItems: [
          { label: 'Automation', id: 'management_automation' },
          { label: 'Automatisering Lite', id: 'management_automation_lite' }
        ]
      },
      { label: 'PV-Designer', id: 'management_pv_designer', icon: Map },
      {
        label: 'Sjablonen',
        id: 'management_templates_parent',
        icon: FileText,
        subItems: [
          { label: 'Automation E-Mail', id: 'management_templates_automation_email' },
          { label: 'Email', id: 'management_templates_email' },
          { label: 'Formulieren', id: 'management_templates_forms' },
          { label: 'PDF', id: 'management_templates_pdf' },
          { label: 'Workflows', id: 'management_templates_workflows' }
        ]
      },
      {
        label: 'Projecten',
        id: 'management_projects',
        icon: ListTodo,
        subItems: [{ label: 'Groepen', id: 'management_projectgroups' }]
      },
      {
        label: 'Customer Portal',
        id: 'management_customer_portal',
        icon: Globe,
        subItems: [
          { label: 'Layout', id: 'management_customer_portal_layout' },
          { label: 'Klantportaalinhoud', id: 'management_customer_portal_content' }
        ]
      },
    ]
  },
  {
    icon: Settings,
    label: 'INSTELLINGEN',
    id: 'settings_parent',
    subItems: [
      { label: 'Beheer', id: 'settings', icon: Settings },
    ]
  }
];

export function Sidebar({ 
  collapsed, 
  setCollapsed, 
  activeView, 
  onViewChange,
  isChatOpen,
  onChatOpenChange,
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
  onResetTimer
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([
    'mijn_omgeving', 
    'planning_parent', 
    'crm_parent', 
    'projects_parent',
    'formulieren_parent',
    'finance_parent',
    'logistiek_parent',
    'management_parent',
    'management_projects',
    'management_customer_portal',
    'settings_parent',
    'tickets_parent'
  ]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div
      className={cn(
        'flex flex-col h-screen border-r border-white/10 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] transition-all duration-300 relative shadow-[2px_0_24px_rgba(0,0,0,0.12)]',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-4 top-6 h-8 w-8 rounded-full z-10 bg-[var(--sidebar)] border-white/15 text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-white"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <div className="flex items-center h-16 px-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="bg-blue-600 p-1.5 rounded-lg shrink-0">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {!collapsed && <span className="font-bold text-lg whitespace-nowrap">Stream Install</span>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 relative">
        {navItems.map((item) => {
          const isExpanded = expandedItems.includes(item.id);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isActive = activeView === item.id || (hasSubItems && item.subItems?.some(sub => sub.id === activeView || sub.subItems?.some(s => s.id === activeView)));

          return (
            <div key={item.id} className="flex flex-col space-y-1">
              <button
                onClick={() => {
                  if (hasSubItems) {
                    const willExpand = !isExpanded;
                    toggleExpand(item.id);
                    if (willExpand && item.id === 'management_customer_portal') {
                      const defaultSubItemId = item.subItems?.[0]?.id;
                      if (defaultSubItemId) onViewChange(defaultSubItemId);
                    }
                  } else {
                    onViewChange(item.id);
                  }
                }}
                className={cn(
                  'flex items-center justify-between w-full rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive && !hasSubItems
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white',
                  collapsed && 'justify-center px-0'
                )}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-white' : 'text-white/55')} />
                  {!collapsed && <span className={cn(isActive && hasSubItems ? 'text-white font-semibold' : '')}>{item.label}</span>}
                </div>
                {!collapsed && hasSubItems && (
                  <ChevronDown className={cn('h-4 w-4 text-white/45 transition-transform', isExpanded && 'rotate-180')} />
                )}
              </button>
              
              {!collapsed && hasSubItems && isExpanded && (
                <div className="flex flex-col pl-9 pr-2 space-y-1 mt-1">
                  {item.subItems?.map((subItem) => {
                    const hasSubSubItems = subItem.subItems && subItem.subItems.length > 0;
                    const isSubExpanded = expandedItems.includes(subItem.id);
                    const isSubActive = activeView === subItem.id || (hasSubSubItems && subItem.subItems?.some(s => s.id === activeView));

                    return (
                      <div key={subItem.id} className="flex flex-col space-y-1">
                        <button
                          onClick={() => {
                            if (hasSubSubItems) {
                              if (subItem.id === 'management_customer_portal') {
                                if (!isSubExpanded) toggleExpand(subItem.id);
                                const defaultLeafId = subItem.subItems?.[0]?.id;
                                if (defaultLeafId) onViewChange(defaultLeafId);
                                return;
                              }
                              toggleExpand(subItem.id);
                            } else {
                              onViewChange(subItem.id);
                            }
                          }}
                          className={cn(
                            'flex items-center justify-between w-full rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                            !hasSubSubItems && isSubActive
                              ? 'bg-white/10 text-white'
                              : 'text-white/65 hover:bg-white/5 hover:text-white',
                          )}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {subItem.icon && <subItem.icon className={cn('h-4 w-4 shrink-0', (isSubActive && !hasSubSubItems) ? 'text-white' : 'text-white/45')} />}
                            <span className={cn("truncate", hasSubSubItems && isSubActive ? "text-white font-semibold" : "")}>{subItem.label}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {subItem.badge && (
                              <span className="bg-white/10 text-white border border-white/15 text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0">
                                {subItem.badge}
                              </span>
                            )}
                            {hasSubSubItems && (
                              <ChevronDown className={cn('h-3.5 w-3.5 text-white/45 transition-transform', isSubExpanded && 'rotate-180')} />
                            )}
                          </div>
                        </button>

                        {/* Third level */}
                        {hasSubSubItems && isSubExpanded && (
                          <div className="flex flex-col pl-6 space-y-1 mt-0.5">
                            {subItem.subItems?.map((subSubItem) => (
                              <button
                                key={subSubItem.id}
                                onClick={() => onViewChange(subSubItem.id)}
                                className={cn(
                                  'flex items-center gap-2 text-left w-full rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                                  activeView === subSubItem.id
                                    ? 'text-white bg-white/10'
                                    : 'text-white/55 hover:text-white'
                                )}
                              >
                                <div className={cn("h-1 w-1 rounded-full shrink-0", activeView === subSubItem.id ? "bg-white" : "bg-white/35")} />
                                <span className="truncate">{subSubItem.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10 shrink-0 space-y-4 bg-[var(--sidebar)] relative z-10">
        <button 
          onClick={() => onChatOpenChange(!isChatOpen)}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-left group shadow-sm bg-white/5",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="p-1 px-1.5 bg-white/10 rounded-md ring-1 ring-white/15 group-hover:scale-110 transition-transform">
            <Sparkles className="h-4 w-4 text-white/80" />
          </div>
          {!collapsed && (
            <span className="text-[13px] font-bold text-white tracking-tight">Chat met AI</span>
          )}
        </button>

        {/* Global Timer Widget (OpusFlow Style) */}
        <div className={cn(
          "bg-white/5 rounded-lg p-2 flex items-center justify-between border border-white/10 shadow-sm",
          collapsed && "flex-col gap-2 py-3"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Clock className={cn("h-4 w-4 text-sky-300", isTimerRunning && "animate-pulse")} />
              <span className="text-sm font-mono font-bold text-white tracking-wider">
                {formatSeconds(timerSeconds)}
              </span>
            </div>
          )}
          {collapsed && (
            <div className="relative">
              <Clock className={cn("h-5 w-5 text-sky-300", isTimerRunning && "animate-pulse")} />
              {isTimerRunning && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full border border-[var(--sidebar)]"></span>}
            </div>
          )}
          
          <div className={cn("flex items-center gap-1.5", collapsed && "flex-col")}>
            <button 
              onClick={onToggleTimer}
              className={cn(
                "p-1.5 rounded shadow-sm transition-all border border-white/10 bg-white/10 hover:bg-white/15",
                isTimerRunning 
                  ? "text-orange-300" 
                  : "text-emerald-300"
              )}
            >
              {isTimerRunning ? <Square className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
            </button>
            {timerSeconds > 0 && !isTimerRunning && (
              <button 
                onClick={onResetTimer}
                className="p-1.5 bg-white/10 rounded shadow-sm text-white/60 hover:bg-white/15 transition-colors border border-white/10"
              >
                <XIcon className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <Button className={cn('w-full bg-white/10 hover:bg-white/15 text-white border border-white/10 shadow-sm', collapsed && 'px-0')} variant="default">
          <PlayCircle className={cn('h-4 w-4', !collapsed && 'mr-2')} />
          {!collapsed && 'Start Timer'}
        </Button>
        
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate text-white">{currentUser.name}</span>
              <span className="text-xs text-white/55 truncate">{currentUser.role}</span>
            </div>
          )}
        </div>

        {/* Operationeel Footer Bar */}
        <div className={cn(
          "pt-2 mt-2 border-t border-white/10 flex items-center gap-2",
          collapsed && "justify-center"
        )}>
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300 fill-emerald-300/20" />
          {!collapsed && (
            <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-widest">Operationeel</span>
          )}
        </div>
      </div>
    </div>
  );
}
