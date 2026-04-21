import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Receipt, 
  LifeBuoy, 
  Settings,
  Menu,
  ChevronLeft,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTenant } from '@/lib/tenantContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

interface PortalSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function PortalSidebar({ collapsed, setCollapsed, currentPath, onNavigate }: PortalSidebarProps) {
  const { tenant } = useTenant();
  const primaryColor = tenant?.branding?.kleur || '#076735';
  const logoUrl = tenant?.branding?.logoUrl;
  const bedrijfsnaam = tenant?.branding?.bedrijfsnaam || tenant?.naam || 'Klantportaal';

  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/portaal/dashboard' },
    { label: 'Offertes', icon: FileText, path: '/portaal/offertes' },
    { label: 'Facturen', icon: Receipt, path: '/portaal/facturen' },
    { label: 'Tickets', icon: LifeBuoy, path: '/portaal/tickets' },
    { label: 'Instellingen', icon: Settings, path: '/portaal/instellingen' },
  ];

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-gray-200 bg-white transition-all duration-300 relative shrink-0 z-20",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4">
        <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "justify-center w-full")}>
          {!collapsed && (
            <div className="flex items-center gap-3 truncate">
              {logoUrl ? (
                <img src={logoUrl} alt={bedrijfsnaam} className="h-8 w-auto object-contain" />
              ) : (
                <div 
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-white shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  {bedrijfsnaam.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="truncate font-semibold text-gray-900">{bedrijfsnaam}</span>
            </div>
          )}
          {collapsed && (
            <div 
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-white shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              {bedrijfsnaam.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPath.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon 
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"
                )} 
                style={isActive ? { color: primaryColor } : undefined}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4 space-y-2">
        <button
          onClick={handleLogout}
          className={cn(
            "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-500" />
          {!collapsed && <span>Uitloggen</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? (
            <Menu className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600" />
              <span>Inklappen</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}