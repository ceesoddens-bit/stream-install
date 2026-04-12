import React, { useMemo, useRef, useState, useEffect } from 'react';
import { 
  Target, Settings, Columns3, SlidersHorizontal, AlignJustify, Maximize2, Download, Search, Plus, UserCircle2, Network, FileText, Trash2, Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { crmService, Contact } from '@/lib/crmService';

type ContactsColumnKey =
  | 'select'
  | 'naam'
  | 'voornaam'
  | 'achternaam'
  | 'tags'
  | 'prioriteit'
  | 'adres'
  | 'mobiel'
  | 'telefoon'
  | 'email'
  | 'actions';

type ContactsColumnDef = {
  key: ContactsColumnKey;
  label?: string;
  width: number;
  minWidth: number;
  resizable: boolean;
  thClassName?: string;
};

const contactsColumns: ContactsColumnDef[] = [
  { key: 'select', width: 52, minWidth: 44, resizable: false, thClassName: 'p-3 pl-4 text-center' },
  { key: 'naam', label: 'Naam', width: 220, minWidth: 150, resizable: true, thClassName: 'p-3' },
  { key: 'voornaam', label: 'Voornaam', width: 170, minWidth: 130, resizable: true, thClassName: 'p-3' },
  { key: 'achternaam', label: 'Achternaam', width: 200, minWidth: 150, resizable: true, thClassName: 'p-3' },
  { key: 'tags', label: 'Tags', width: 240, minWidth: 160, resizable: true, thClassName: 'p-3' },
  { key: 'prioriteit', label: 'Prio', width: 90, minWidth: 70, resizable: true, thClassName: 'p-3' },
  { key: 'adres', label: 'Adres', width: 320, minWidth: 200, resizable: true, thClassName: 'p-3' },
  { key: 'mobiel', label: 'Mobiele nummer', width: 170, minWidth: 150, resizable: true, thClassName: 'p-3' },
  { key: 'telefoon', label: 'Telefoonnummer', width: 170, minWidth: 150, resizable: true, thClassName: 'p-3' },
  { key: 'email', label: 'E-mailadres', width: 260, minWidth: 180, resizable: true, thClassName: 'p-3' },
  { key: 'actions', width: 160, minWidth: 140, resizable: false, thClassName: 'p-3 w-40 sticky right-0 bg-white z-20' },
];

export function ContactsLayout() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [columnWidths, setColumnWidths] = useState<Record<ContactsColumnKey, number>>(() => {
    return contactsColumns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<ContactsColumnKey, number>);
  });
  const resizingRef = useRef<{
    key: ContactsColumnKey;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const tableMinWidth = useMemo(() => {
    return contactsColumns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths]);

  const getNameParts = (contact: Contact) => {
    const firstName = contact.firstName?.trim();
    const lastName = contact.lastName?.trim();
    if (firstName || lastName) {
      return {
        firstName: firstName ?? '',
        lastName: lastName ?? '',
      };
    }

    const parts = (contact.name ?? '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return { firstName: '', lastName: '' };
    }
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: '' };
    }
    return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
  };

  const renderValue = (value?: string | number | null) => {
    if (value === 0) return '0';
    const normalized = typeof value === 'string' ? value.trim() : value;
    if (normalized === undefined || normalized === null || normalized === '') return '-';
    return String(normalized);
  };

  const normalizePhone = (value?: string | null) => {
    return (value ?? '').replace(/[\s\-()]/g, '');
  };

  const looksLikeMobile = (value?: string | null) => {
    const v = normalizePhone(value);
    if (!v) return false;
    return v.startsWith('06') || v.startsWith('+316') || v.startsWith('00316');
  };

  const getMobileValue = (contact: Contact) => {
    if (contact.mobile && contact.mobile.trim()) return contact.mobile;
    if (contact.phone && looksLikeMobile(contact.phone)) return contact.phone;
    return undefined;
  };

  const getTelephoneValue = (contact: Contact) => {
    if (contact.telephone && contact.telephone.trim()) return contact.telephone;
    if (contact.phone && !looksLikeMobile(contact.phone)) return contact.phone;
    return undefined;
  };

  // Subscribe to real-time updates from Firebase
  useEffect(() => {
    const unsubscribe = crmService.subscribeToContacts((fetched) => {
      setContacts(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const startResize = (key: ContactsColumnKey) => (e: React.PointerEvent) => {
    const col = contactsColumns.find(c => c.key === key);
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

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Weet je zeker dat je dit contact wilt verwijderen?")) {
      await crmService.deleteContact(id);
    }
  };

  const handleAddSample = async () => {
    const samples = [
      {
        firstName: 'Cees',
        lastName: 'Oddens',
        email: 'cees.oddens@example.com',
        telephone: '0612345678',
        mobile: '0612345678',
        address: 'Joop Gesinkweg 601, 1114AB, Amsterdam',
        priority: 0,
        tags: ['Installatie'],
      },
      {
        firstName: 'Sven',
        lastName: 'Nooij',
        email: 'sven@example.com',
        telephone: '053588260',
        mobile: '0642794218',
        address: 'Bunschotenlaan 17, 8244DS, Lelystad',
        priority: 3,
        tags: ['Service', 'Zakelijk'],
      },
      {
        firstName: 'Johnny',
        lastName: 'Doe',
        email: 'johnny.doe@example.com',
        telephone: '1234567789',
        address: 'Magdenburgstraat 5, 7421AA, Deventer',
        priority: 0,
        tags: [],
      },
      {
        firstName: 'Sandra',
        lastName: 'Brader',
        email: 'sandra.brader@example.com',
        mobile: '0658688851',
        address: 'Griend 23 65, 8225RW, Lelystad',
        priority: 1,
        tags: ['Particulier'],
      },
    ];
    const sample = samples[Math.floor(Math.random() * samples.length)];
    const randomName = `${sample.firstName} ${sample.lastName}`.trim();
    await crmService.addContact({
      name: randomName,
      firstName: sample.firstName,
      lastName: sample.lastName,
      email: sample.email,
      phone: sample.telephone,
      telephone: sample.telephone,
      mobile: sample.mobile,
      address: sample.address,
      priority: sample.priority,
      tags: sample.tags,
      company: 'Installatiegroep Duurzaam',
      role: 'Contact',
      status: 'Actief',
      createdByName: 'Systeem',
      updatedByName: 'Systeem',
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative space-y-4 pt-2 pb-8">
      
      {/* ── Page Header ── */}
      <div className="flex items-center gap-3 px-6 pb-2 shrink-0">
        <Target className="h-6 w-6 text-purple-700 bg-purple-100 p-1 rounded" />
        <h1 className="text-xl font-bold text-gray-900">Contactenlijst</h1>
      </div>

      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        
        {/* Top Tabs and Action Row */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-6 pb-1">
            <button className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-1 border-b-2 border-green-600">
              Alles <span className="bg-emerald-800 text-white text-[11px] px-2 py-0.5 rounded-full leading-none shrink-0 font-bold">{contacts.length}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
                onClick={handleAddSample}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-medium text-sm rounded-md shadow-sm opacity-90 hover:opacity-100 transition-opacity"
            >
              <Plus className="h-4 w-4" /> Sample Toevoegen
            </button>
            <button className="p-2 border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 flex items-center justify-between bg-white shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Columns3 className="h-4 w-4" /> Kolommen</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><AlignJustify className="h-4 w-4" /> Dichtheid</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Maximize2 className="h-4 w-4" /> Schaal</button>
            <button className="flex items-center gap-1.5 hover:text-gray-900"><Download className="h-4 w-4" /> Exporteren</button>
          </div>
          <div className="relative w-64 flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoeken..."
              className="pl-9 pr-8 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50 w-full"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-auto flex-1">
          <table
            className="w-full text-left text-sm border-collapse table-fixed"
            style={{ minWidth: tableMinWidth }}
          >
            <colgroup>
              {contactsColumns.map(col => (
                <col key={col.key} style={{ width: columnWidths[col.key] }} />
              ))}
            </colgroup>
            <thead className="sticky top-0 bg-white z-10 shadow-sm border-b border-gray-100">
              <tr className="bg-gray-50/30 font-semibold tracking-tight text-gray-500 text-[12px]">
                {contactsColumns.map(col => (
                  <th
                    key={col.key}
                    className={cn('relative select-none overflow-hidden whitespace-nowrap', col.thClassName)}
                  >
                    {col.key === 'select' ? (
                      <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4" />
                    ) : col.key === 'actions' ? null : (
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
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={contactsColumns.length} className="p-20 text-center text-gray-400 italic">
                    Laden van contacten...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                   <td colSpan={contactsColumns.length} className="p-20 text-center text-gray-400 italic">
                    Geen contacten gevonden. Klik op "+ Sample Toevoegen" om te testen!
                  </td>
                </tr>
              ) : contacts.map((row) => {
                const { firstName, lastName } = getNameParts(row);
                const tags = row.tags?.filter(Boolean) ?? [];

                return (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="p-3 pl-4 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 cursor-pointer" 
                      checked={selectedIds.includes(row.id!)}
                      onChange={() => toggleSelect(row.id!)}
                    />
                  </td>
                  <td className="p-3 text-[13px] font-bold text-emerald-800 hover:underline cursor-pointer truncate">
                    {renderValue(row.name)}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700 truncate">
                    {renderValue(firstName)}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700 truncate">
                    {renderValue(lastName)}
                  </td>
                  <td className="p-3">
                    {tags.length === 0 ? (
                      <span className="text-[13px] text-gray-400">-</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                        {tags.length > 3 ? (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            +{tags.length - 3}
                          </span>
                        ) : null}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    {renderValue(row.priority)}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700 truncate">
                    {renderValue(row.address)}
                  </td>
                  <td className="p-3 text-[13px] text-blue-600 font-medium truncate">
                    {renderValue(getMobileValue(row))}
                  </td>
                  <td className="p-3 text-[13px] text-blue-600 font-medium truncate">
                    {renderValue(getTelephoneValue(row))}
                  </td>
                  <td className="p-3 text-[13px] text-blue-600 font-medium truncate">
                    {renderValue(row.email)}
                  </td>
                  <td className="p-3 text-right sticky right-0 bg-white/90 backdrop-blur-sm group-hover:bg-gray-50/90 transition-colors z-10">
                    <div className="flex items-center justify-end gap-3 text-emerald-700">
                        <button className="hover:text-emerald-900 transition-colors"><UserCircle2 className="h-4 w-4" /></button>
                        <button className="hover:text-emerald-900 transition-colors"><Network className="h-4 w-4" /></button>
                        <button className="hover:text-emerald-900 transition-colors"><FileText className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(row.id!)} className="text-gray-300 hover:text-red-500 transition-colors ml-1 border-l pl-3 border-gray-100">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white border-t border-gray-100 p-3 shrink-0 flex items-center justify-end text-[12px] text-gray-500 font-medium">
           {contacts.length} contacten in totaal
        </div>

      </div>
    </div>
  );
}
