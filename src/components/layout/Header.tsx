import React from 'react';
import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search projects, clients, tickets..."
            className="pl-9 bg-gray-50 border-transparent focus-visible:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}>
            <span className="font-medium text-sm">Installatiegroep Duurzaam</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Tenants</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Installatiegroep Duurzaam</DropdownMenuItem>
              <DropdownMenuItem>Solar Experts BV</DropdownMenuItem>
              <DropdownMenuItem>HeatPump Masters</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="text-gray-500 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>
        
        <Button variant="ghost" size="icon" className="text-gray-500">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
