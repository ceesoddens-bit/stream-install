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
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { currentUser } from '@/data/mockData';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

type NavItem = {
  icon: any;
  label: string;
  id: string;
  subItems?: { label: string; id: string; icon?: any }[];
};

const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: 'MIJN OMGEVING',
    id: 'mijn_omgeving',
    subItems: [
      { label: 'Home', id: 'dashboard', icon: Home },
      { label: 'Taken', id: 'tasks', icon: CheckSquare },
      { label: 'Kalender', id: 'calendar', icon: Calendar },
    ]
  },
  {
    icon: Map,
    label: 'PLANNING',
    id: 'planning_parent',
    subItems: [
      { label: 'Planner', id: 'planning', icon: Map },
      { label: 'Lijst', id: 'planning_list', icon: List },
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
      { label: 'Overzicht', id: 'finance', icon: CreditCard }
    ]
  },
  {
    icon: Package,
    label: 'VOORRAAD',
    id: 'logistiek_parent',
    subItems: [
      { label: 'Artikelen', id: 'inventory', icon: Box },
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

export function Sidebar({ collapsed, setCollapsed, activeView, onViewChange }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([
    'mijn_omgeving', 
    'planning_parent', 
    'crm_parent', 
    'projects_parent',
    'formulieren_parent',
    'finance_parent',
    'logistiek_parent',
    'settings_parent'
  ]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div
      className={cn(
        'flex flex-col h-screen border-r bg-white transition-all duration-300 relative',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-4 top-6 h-8 w-8 rounded-full z-10 bg-white"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <div className="flex items-center h-16 px-4 border-b shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="bg-blue-600 p-1.5 rounded-lg shrink-0">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {!collapsed && <span className="font-bold text-lg whitespace-nowrap">Stream Install</span>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isExpanded = expandedItems.includes(item.id);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isActive = activeView === item.id || (hasSubItems && item.subItems?.some(sub => sub.id === activeView));

          return (
            <div key={item.id} className="flex flex-col space-y-1">
              <button
                onClick={() => {
                  if (hasSubItems) {
                    toggleExpand(item.id);
                  } else {
                    onViewChange(item.id);
                  }
                }}
                className={cn(
                  'flex items-center justify-between w-full rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive && !hasSubItems
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  collapsed && 'justify-center px-0'
                )}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-blue-700' : 'text-gray-500')} />
                  {!collapsed && <span className={cn(isActive && hasSubItems ? 'text-blue-700 font-semibold' : '')}>{item.label}</span>}
                </div>
                {!collapsed && hasSubItems && (
                  <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', isExpanded && 'rotate-180')} />
                )}
              </button>
              
              {!collapsed && hasSubItems && isExpanded && (
                <div className="flex flex-col pl-9 pr-2 space-y-1 mt-1">
                  {item.subItems?.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => onViewChange(subItem.id)}
                      className={cn(
                        'flex items-center gap-2 text-left w-full rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                        activeView === subItem.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      {subItem.icon && <subItem.icon className={cn('h-4 w-4 shrink-0', activeView === subItem.id ? 'text-blue-700' : 'text-gray-400')} />}
                      <span>{subItem.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t shrink-0 space-y-4">
        <Button className={cn('w-full', collapsed && 'px-0')} variant="default">
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
              <span className="text-sm font-medium truncate">{currentUser.name}</span>
              <span className="text-xs text-gray-500 truncate">{currentUser.role}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
