import React from 'react';
import { Search, Bell, HelpCircle, ChevronDown, MessageSquare, Zap, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { currentUser } from '@/data/mockData';

export function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 relative z-20">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Zoeken..."
            className="pl-10 h-10 bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-sm rounded-lg"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Action Icons */}
        <div className="flex items-center border-r border-gray-100 pr-4 mr-2 gap-0.5">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-emerald-500 rounded-full border-2 border-white"></span>
          </Button>
        </div>

        {/* Company Profile Area */}
        <div className="flex items-center gap-3 pl-2 group cursor-pointer hover:bg-gray-50 p-1 px-2 rounded-lg transition-all">
          <div className="flex items-center gap-2.5">
             <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm shadow-emerald-200">
                <Zap className="h-5 w-5 text-white fill-current" />
             </div>
             <div className="flex flex-col items-start leading-tight">
                <span className="text-xs font-bold text-gray-800 tracking-tight">Installatiegroep Duurzaam</span>
             </div>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center border border-white shadow-sm">
             <User className="h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
