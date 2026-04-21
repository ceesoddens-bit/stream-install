import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Columns3 } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Popover } from '@base-ui/react/popover';

export interface ColumnToggle {
  key: string;
  label: string;
  visible: boolean;
}

interface Props {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  storageKey?: string;
  columns?: ColumnToggle[];
  onColumnsChange?: (cols: ColumnToggle[]) => void;
  children?: React.ReactNode; // custom filter-slot
  right?: React.ReactNode; // actions
}

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Zoeken...',
  columns,
  onColumnsChange,
  children,
  right,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8"
          />
        </div>
        {children}
      </div>
      <div className="flex items-center gap-2">
        {columns && onColumnsChange && (
          <Popover.Root>
            <Popover.Trigger
              render={(props) => (
                <Button variant="outline" size="sm" {...props}>
                  <Columns3 className="h-4 w-4" />
                  Kolommen
                </Button>
              )}
            />
            <Popover.Portal>
              <Popover.Positioner sideOffset={6} align="end">
                <Popover.Popup className="min-w-52 rounded-lg border border-gray-200 bg-white p-2 shadow-md focus:outline-none">
                  {columns.map((c) => (
                    <label key={c.key} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-50">
                      <Checkbox
                        checked={c.visible}
                        onCheckedChange={(v) =>
                          onColumnsChange(columns.map((x) => (x.key === c.key ? { ...x, visible: !!v } : x)))
                        }
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
        )}
        {right}
      </div>
    </div>
  );
}

// Persist column-visibility in localStorage.
export function usePersistedColumns(storageKey: string, defaults: ColumnToggle[]): [ColumnToggle[], (c: ColumnToggle[]) => void] {
  const [cols, setCols] = useState<ColumnToggle[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return defaults;
      const saved = JSON.parse(raw) as Record<string, boolean>;
      return defaults.map((d) => ({ ...d, visible: saved[d.key] ?? d.visible }));
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    try {
      const map: Record<string, boolean> = {};
      cols.forEach((c) => (map[c.key] = c.visible));
      localStorage.setItem(storageKey, JSON.stringify(map));
    } catch {}
  }, [cols, storageKey]);

  return [cols, setCols];
}
