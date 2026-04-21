import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Columns3, Filter, Search, Users, Mail, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { userService, InviteDoc } from '@/lib/userService';
import { useTenant } from '@/lib/tenantContext';
import { UserDoc } from '@/lib/tenantTypes';

const formatRangeLabel = (from: number, to: number, total: number) => `${from}–${to} of ${total}`;

type UsersColumnKey =
  | 'foto'
  | 'naam'
  | 'email'
  | 'rol'
  | 'status'
  | 'actions';

type UsersColumnDef = {
  key: UsersColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const usersColumns: UsersColumnDef[] = [
  { key: 'foto', label: 'Foto', width: 80, minWidth: 80, resizable: false, thClassName: 'p-3 px-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'naam', label: 'Naam', width: 240, minWidth: 180, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'email', label: 'Email', width: 260, minWidth: 200, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'rol', label: 'Rol', width: 160, minWidth: 140, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'status', label: 'Status', width: 160, minWidth: 140, resizable: true, thClassName: 'p-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
  { key: 'actions', width: 64, minWidth: 56, resizable: false, thClassName: 'p-3 pr-4 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider' },
];

type CombinedUserRow = {
  id: string;
  isInvite: boolean;
  name: string;
  email: string;
  role: string;
  status: string;
  initials: string;
};

export function ManagementUsersView() {
  const { tenantId } = useTenant();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [invites, setInvites] = useState<InviteDoc[]>([]);

  useEffect(() => {
    if (!tenantId) return;
    const unsubUsers = userService.subscribeToUsers(tenantId, (data) => setUsers(data));
    const unsubInvites = userService.subscribeToInvites((data) => setInvites(data));

    return () => {
      unsubUsers();
      unsubInvites();
    };
  }, [tenantId]);

  const [columnWidths, setColumnWidths] = useState<Record<UsersColumnKey, number>>(() => {
    return usersColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<UsersColumnKey, number>);
  });
  const resizingRef = useRef<{
    key: UsersColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const tableMinWidth = useMemo(() => {
    return usersColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    const combined: CombinedUserRow[] = [
      ...users.map(u => ({
        id: u.uid,
        isInvite: false,
        name: u.displayName || 'Geen naam',
        email: u.email,
        role: u.role,
        status: 'Actief',
        initials: u.displayName ? u.displayName.substring(0, 2).toUpperCase() : u.email.substring(0, 2).toUpperCase()
      })),
      ...invites.map(i => ({
        id: i.id || crypto.randomUUID(),
        isInvite: true,
        name: 'Uitgenodigd',
        email: i.email,
        role: i.role,
        status: 'Wachtend',
        initials: i.email.substring(0, 2).toUpperCase()
      }))
    ];

    if (!q) return combined;
    return combined.filter((u) => {
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    });
  }, [query, users, invites]);

  const activeCount = users.length;
  const invitedCount = invites.length;
  const perPage = 50;
  const shownFrom = filtered.length ? 1 : 0;
  const shownTo = filtered.length;

  const startResize = (key: UsersColumnKey) => (e: React.PointerEvent) => {
    const col = usersColumns.find(c => c.key === key);
    if (!col || !col.resizable) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = columnWidths[key] ?? col.width;
    const minWidth = col.minWidth;
    resizingRef.current = { key, startX, startWidth, minWidth };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onPointerMove = (evt: PointerEvent) => {
      const nextWidth = Math.max(minWidth, startWidth + (evt.clientX - startX));
      setColumnWidths(prev => ({ ...prev, [key]: nextWidth }));
    };

    const onPointerUp = () => {
      resizingRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onPointerMove);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp, { once: true });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Users className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Gebruikers</h1>
        </div>

        <div className="flex items-stretch gap-3 flex-1 justify-end">
          <Card className="border-0 shadow-sm bg-blue-700 text-white min-w-[260px]">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-3xl font-extrabold leading-none">{activeCount}</div>
                <div className="text-xs font-semibold text-white/80 mt-1">Actieve gebruikers</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-amber-600 text-white min-w-[260px]">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-3xl font-extrabold leading-none">{invitedCount}</div>
                <div className="text-xs font-semibold text-white/80 mt-1">Uitgenodigd</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
            </CardContent>
          </Card>

          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-11 px-4 shadow-sm">
            <Plus className="h-4 w-4" />
            Nieuwe Gebruiker
          </Button>
        </div>
      </div>

      <div className="flex flex-col flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-bold shrink-0"
          >
            Alles
          </button>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
              <Columns3 className="h-4 w-4 mr-2" />
              Kolommen
            </Button>
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
              Grootte
            </Button>
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
              Filtersjablonen
            </Button>
          </div>

          <div className="relative w-64 shrink-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoeken…"
              className="pl-9 h-9 bg-white border-gray-200 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse table-fixed" style={{ minWidth: tableMinWidth }}>
            <colgroup>
              {usersColumns.map(col => (
                <col key={col.key} style={{ width: columnWidths[col.key] }} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-white border-b border-gray-200">
                {usersColumns.map(col => (
                  <th
                    key={col.key}
                    className={cn('relative select-none overflow-hidden whitespace-nowrap', col.thClassName)}
                  >
                    {col.key === 'actions' ? null : (
                      <span className="truncate block">{col.label}</span>
                    )}

                    {col.resizable ? (
                      <div
                        onPointerDown={startResize(col.key)}
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize group"
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`Resize column ${col.label ?? col.key}`}
                      >
                        <div className="absolute right-0 top-0 h-full w-px bg-transparent group-hover:bg-gray-300" />
                      </div>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-emerald-50/20 transition-colors">
                  <td className="p-3 px-4">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-100 text-gray-500 text-xs">{u.initials}</AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="p-3 text-sm font-medium text-gray-900">
                    {u.name}
                    {u.isInvite && <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-100 text-amber-800 rounded-full">Invite</span>}
                  </td>
                  <td className="p-3 text-sm text-gray-700 truncate" title={u.email}>{u.email}</td>
                  <td className="p-3 text-sm text-gray-800 capitalize">{u.role}</td>
                  <td className="p-3">
                    <div className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold', 
                      u.status === 'Actief' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    )}>
                      {u.status}
                    </div>
                  </td>
                  <td className="p-3 pr-4">
                    <button className="h-8 w-8 rounded-md hover:bg-gray-100 text-gray-500">⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-end gap-6 text-xs text-gray-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Regels per pagina:</span>
            <span className="text-gray-800 font-bold">{perPage}</span>
          </div>
          <span className="text-gray-800 font-semibold">{formatRangeLabel(shownFrom, shownTo, activeCount)}</span>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50">‹</button>
            <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
