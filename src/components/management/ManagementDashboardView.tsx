import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Plus } from 'lucide-react';

export function ManagementDashboardView() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
            <span className="text-sm font-semibold text-gray-700">26–02</span>
            <CalendarDays className="h-4 w-4 text-gray-500" />
          </div>
        </div>

        <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 gap-2">
          <Plus className="h-4 w-4" />
          Voeg Een Widget Toe
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Card className="border-0 bg-transparent shadow-none">
          <CardContent className="flex flex-col items-center text-center gap-3">
            <div className="w-44 h-44 rounded-full bg-gray-100 flex items-center justify-center">
              <div className="w-28 h-20 rounded-xl bg-white border border-gray-200 shadow-sm" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Nog geen widgets</h2>
            <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
              Voeg Een Widget Toe
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

