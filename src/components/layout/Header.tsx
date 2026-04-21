import React from 'react';
import { Search, Bell, HelpCircle, MessageSquare, Zap, User, LogOut, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { currentUser } from '@/data/mockData';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useTenant } from '@/lib/tenantContext';

export function Header() {
  const { tenant } = useTenant();
  return (
    <header className="h-16 border-b border-border/70 bg-white/70 backdrop-blur flex items-center justify-between px-6 shrink-0 relative z-20">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Zoeken..."
            className="pl-10 h-10 bg-white border-border/70 focus:bg-white transition-all text-sm rounded-lg shadow-sm"
          />
        </div>
      </div>

        <div className="flex items-center gap-2">
        {/* Action Icons */}
        <div className="flex items-center border-r border-gray-200/60 pr-4 mr-2 gap-0.5">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-gray-900 hover:bg-gray-100/60 transition-colors">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-gray-900 hover:bg-gray-100/60 transition-colors">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-gray-900 hover:bg-gray-100/60 transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-emerald-500 rounded-full border-2 border-white"></span>
          </Button>
        </div>

        {/* Company Profile Area */}
        <div className="flex items-center gap-3 pl-2 group cursor-pointer hover:bg-gray-100/60 p-1 px-2 rounded-lg transition-all">
          <div className="flex items-center gap-2.5">
             <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm shadow-blue-200/60 overflow-hidden">
                {tenant?.branding?.logoUrl ? (
                  <img src={tenant.branding.logoUrl} alt={tenant.naam} className="h-full w-full object-cover" />
                ) : (
                  <Zap className="h-5 w-5 text-white fill-current" />
                )}
             </div>
             <div className="flex flex-col items-start leading-tight">
                <span className="text-xs font-bold text-gray-800 tracking-tight">{tenant?.naam || 'Stream Install'}</span>
             </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center border border-white shadow-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-emerald-500/30">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback className="bg-gray-200">
                  <User className="h-5 w-5 text-gray-500" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 py-1.5">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{currentUser.name}</span>
                    <span className="text-xs text-gray-500">{currentUser.role}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="px-2 py-2">
                  <Settings className="h-4 w-4" />
                  Instellingen
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="px-2 py-2"
                  onClick={() => {
                    signOut(auth);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Uitloggen
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
