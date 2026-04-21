import React, { useMemo, useState } from 'react';
import { Search, Check } from 'lucide-react';
import { Popover } from '@base-ui/react/popover';
import { Input } from './input';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface EntityOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface Props {
  value: string | null;
  onChange: (id: string | null) => void;
  options: EntityOption[];
  placeholder?: string;
  emptyLabel?: string;
  allowClear?: boolean;
  disabled?: boolean;
}

export function EntityPicker({
  value,
  onChange,
  options,
  placeholder = 'Selecteer...',
  emptyLabel = 'Geen resultaten',
  allowClear = true,
  disabled,
}: Props) {
  const [search, setSearch] = useState('');
  const selected = options.find((o) => o.id === value) ?? null;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || (o.sublabel ?? '').toLowerCase().includes(q)
    );
  }, [options, search]);

  return (
    <Popover.Root>
      <Popover.Trigger
        render={(props) => (
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            {...props}
            className="w-full justify-between"
          >
            <span className={cn('truncate', !selected && 'text-gray-400')}>
              {selected ? selected.label : placeholder}
            </span>
          </Button>
        )}
      />
      <Popover.Portal>
        <Popover.Positioner sideOffset={4} align="start">
          <Popover.Popup className="w-[var(--anchor-width)] min-w-64 max-w-md rounded-lg border border-gray-200 bg-white shadow-md focus:outline-none">
            <div className="relative border-b border-gray-100 p-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Zoeken..."
                className="pl-8"
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {allowClear && value && (
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="w-full px-3 py-1.5 text-left text-xs text-gray-500 hover:bg-gray-50"
                >
                  Wissen
                </button>
              )}
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-gray-400">{emptyLabel}</div>
              ) : (
                filtered.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => onChange(o.id)}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50',
                      o.id === value && 'bg-emerald-50'
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-gray-900">{o.label}</span>
                      {o.sublabel && <span className="block truncate text-xs text-gray-500">{o.sublabel}</span>}
                    </span>
                    {o.id === value && <Check className="h-4 w-4 text-emerald-600" />}
                  </button>
                ))
              )}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
