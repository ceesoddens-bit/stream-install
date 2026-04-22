import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Columns3, Filter, Search, Users, Mail, Plus, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { userService, InviteDoc, berekenKostenImpact } from '@/lib/userService';
import { useTenant } from '@/lib/tenantContext';
import { UserDoc, Rol } from '@/lib/tenantTypes';
import { PERMISSIONS, PERMISSION_CATEGORIEEN, DEFAULT_MEMBER_PERMISSIONS, PermissionKey } from '@/lib/permissions';
import { PRIJS_OWNER, PRIJS_ADMIN, PRIJS_MEMBER } from '@/lib/modules';
import { toast } from 'sonner';

const formatRangeLabel = (from: number, to: number, total: number) => `${from}–${to} van ${total}`;

const ROL_LABELS: Record<Rol, string> = {
  owner: 'Hoofdgebruiker',
  admin: 'Extra hoofdgebr.',
  member: 'Medewerker',
};

const ROL_PRIJS: Record<Rol, number> = {
  owner: PRIJS_OWNER,
  admin: PRIJS_ADMIN,
  member: PRIJS_MEMBER,
};

type UsersColumnKey = 'foto' | 'naam' | 'email' | 'rol' | 'status' | 'actions';

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
  role: Rol;
  status: string;
  initials: string;
  permissions?: PermissionKey[];
};

// === Invite Modal ===
function InviteModal({ onClose }: { onClose: () => void }) {
  const { tenantId, tenant, role: myRole } = useTenant();
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState<Rol>('member');
  const [permissions, setPermissions] = useState<PermissionKey[]>([...DEFAULT_MEMBER_PERMISSIONS]);
  const [permOpen, setPermOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const kostenImpact = useMemo(() => {
    if (!tenant) return null;
    return berekenKostenImpact(tenant, rol);
  }, [tenant, rol]);

  const handleSubmit = async () => {
    if (!tenantId || !tenant) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Voer een geldig e-mailadres in');
      return;
    }
    setEmailError('');
    setLoading(true);
    try {
      await userService.createInvite(
        tenantId,
        tenant.naam,
        email.trim().toLowerCase(),
        rol,
        rol === 'member' ? permissions : []
      );
      toast.success(`Uitnodiging verstuurd naar ${email}`);
      onClose();
    } catch {
      toast.error('Uitnodiging versturen mislukt. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const togglePerm = (key: PermissionKey) => {
    setPermissions(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gebruiker uitnodigen</DialogTitle>
          <DialogDescription>Alleen eigenaren (owners) kunnen gebruikers uitnodigen.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* E-mail */}
          <div className="space-y-1.5">
            <Label>E-mailadres</Label>
            <Input
              type="email"
              placeholder="naam@bedrijf.nl"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
            />
            {emailError && <p className="text-xs text-red-600">{emailError}</p>}
          </div>

          {/* Rol kiezen */}
          <div className="space-y-1.5">
            <Label>Rol</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['owner', 'admin', 'member'] as Rol[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRol(r)}
                  className={cn(
                    'rounded-lg border p-3 text-left transition-colors',
                    rol === r ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'
                  )}
                >
                  <p className="text-xs font-semibold text-gray-900">{ROL_LABELS[r]}</p>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">&euro;{ROL_PRIJS[r]}/mnd</p>
                </button>
              ))}
            </div>
          </div>

          {/* Kostenimpact — altijd zichtbaar */}
          {kostenImpact && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="text-sm font-semibold">Kostenwijziging</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <p className="text-xs text-amber-700">Huidig</p>
                  <p className="font-bold text-gray-900">&euro;{kostenImpact.huidigeMaandprijs}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-amber-700">Nieuw</p>
                  <p className="font-bold text-gray-900">&euro;{kostenImpact.nieuweMaandprijs}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-amber-700">Verschil</p>
                  <p className="font-bold text-emerald-700">+&euro;{kostenImpact.verschil}/mnd</p>
                </div>
              </div>
              <p className="text-xs text-amber-700">
                Toevoeging van een {ROL_LABELS[rol].toLowerCase()} verhoogt uw maandlasten met <strong>&euro;{kostenImpact.verschil}</strong>. Dit wordt verrekend in uw volgende factuur.
              </p>
            </div>
          )}

          {/* Permissies voor members */}
          {rol === 'member' && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setPermOpen(!permOpen)}
                className="flex items-center gap-2 text-sm text-emerald-700 font-medium w-full"
              >
                {permOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                Permissies instellen ({permissions.length} van {PERMISSIONS.length})
              </button>
              {permOpen && (
                <div className="rounded-lg border border-gray-200 p-4 space-y-4">
                  {PERMISSION_CATEGORIEEN.map((cat) => {
                    const perms = PERMISSIONS.filter((p) => p.categorie === cat);
                    return (
                      <div key={cat}>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{cat}</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {perms.map((p) => (
                            <label key={p.key} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                              <Checkbox
                                checked={permissions.includes(p.key)}
                                onCheckedChange={() => togglePerm(p.key)}
                              />
                              {p.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Annuleren</Button>
          <Button onClick={handleSubmit} disabled={loading || !email}>
            {loading ? 'Versturen...' : 'Uitnodiging versturen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// === Permissie bewerken Modal ===
function EditPermissionsModal({ user, onClose }: { user: CombinedUserRow; onClose: () => void }) {
  const [permissions, setPermissions] = useState<PermissionKey[]>(user.permissions ?? []);
  const [loading, setLoading] = useState(false);

  const toggle = (key: PermissionKey) =>
    setPermissions(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await userService.updateUserPermissions(user.id, permissions);
      toast.success('Permissies opgeslagen');
      onClose();
    } catch {
      toast.error('Opslaan mislukt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Permissies — {user.name}</DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {PERMISSION_CATEGORIEEN.map((cat) => {
            const perms = PERMISSIONS.filter((p) => p.categorie === cat);
            return (
              <div key={cat}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{cat}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {perms.map((p) => (
                    <label key={p.key} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <Checkbox
                        checked={permissions.includes(p.key)}
                        onCheckedChange={() => toggle(p.key)}
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Annuleren</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Opslaan...' : 'Opslaan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// === Hoofd view ===
export function ManagementUsersView() {
  const { tenantId, role: myRole } = useTenant();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [invites, setInvites] = useState<InviteDoc[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editPermUser, setEditPermUser] = useState<CombinedUserRow | null>(null);

  useEffect(() => {
    if (!tenantId) return;
    const unsubUsers = userService.subscribeToUsers(tenantId, (data) => setUsers(data));
    const unsubInvites = userService.subscribeToInvites((data) => setInvites(data));
    return () => { unsubUsers(); unsubInvites(); };
  }, [tenantId]);

  const [columnWidths, setColumnWidths] = useState<Record<UsersColumnKey, number>>(() =>
    usersColumns.reduce((acc, col) => { acc[col.key] = col.width; return acc; }, {} as Record<UsersColumnKey, number>)
  );
  const resizingRef = useRef<{ key: UsersColumnKey; startX: number; startWidth: number; minWidth: number } | null>(null);

  const tableMinWidth = useMemo(
    () => usersColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0),
    [columnWidths]
  );

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
        initials: u.displayName ? u.displayName.substring(0, 2).toUpperCase() : u.email.substring(0, 2).toUpperCase(),
        permissions: u.permissions,
      })),
      ...invites.map(i => ({
        id: i.id || crypto.randomUUID(),
        isInvite: true,
        name: 'Uitgenodigd',
        email: i.email,
        role: i.role,
        status: 'Wachtend',
        initials: i.email.substring(0, 2).toUpperCase(),
        permissions: i.permissions,
      })),
    ];
    if (!q) return combined;
    return combined.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  }, [query, users, invites]);

  const activeCount = users.length;
  const invitedCount = invites.length;
  const perPage = 50;

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
          <Card className="border-0 shadow-sm bg-blue-700 text-white min-w-[220px]">
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

          <Card className="border-0 shadow-sm bg-amber-600 text-white min-w-[220px]">
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

          {myRole === 'owner' && (
            <Button
              onClick={() => setShowInviteModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-11 px-4 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Gebruiker uitnodigen
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-bold shrink-0">
            Alles
          </button>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
              <Columns3 className="h-4 w-4 mr-2" />Kolommen
            </Button>
            <Button variant="ghost" className="h-9 px-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
              <Filter className="h-4 w-4 mr-2" />Filters
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
              {usersColumns.map(col => <col key={col.key} style={{ width: columnWidths[col.key] }} />)}
            </colgroup>
            <thead>
              <tr className="bg-white border-b border-gray-200">
                {usersColumns.map(col => (
                  <th key={col.key} className={cn('relative select-none overflow-hidden whitespace-nowrap', col.thClassName)}>
                    {col.key !== 'actions' && <span className="truncate block">{col.label}</span>}
                    {col.resizable && (
                      <div
                        onPointerDown={startResize(col.key)}
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize group"
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`Verander breedte ${col.label ?? col.key}`}
                      >
                        <div className="absolute right-0 top-0 h-full w-px bg-transparent group-hover:bg-gray-300" />
                      </div>
                    )}
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
                  <td className="p-3 text-sm text-gray-800">
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-semibold',
                      u.role === 'owner' ? 'bg-blue-100 text-blue-700' :
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    )}>
                      {ROL_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
                      u.status === 'Actief' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    )}>
                      {u.status}
                    </div>
                  </td>
                  <td className="p-3 pr-4">
                    {!u.isInvite && u.role === 'member' && myRole === 'owner' && (
                      <button
                        onClick={() => setEditPermUser(u)}
                        className="h-8 px-2 rounded-md hover:bg-gray-100 text-xs text-gray-500 hover:text-gray-900"
                        title="Permissies bewerken"
                      >
                        Permissies
                      </button>
                    )}
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
          <span className="text-gray-800 font-semibold">{formatRangeLabel(1, filtered.length, activeCount)}</span>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50">‹</button>
            <button className="h-8 w-8 rounded-md border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>

      {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} />}
      {editPermUser && <EditPermissionsModal user={editPermUser} onClose={() => setEditPermUser(null)} />}
    </div>
  );
}
