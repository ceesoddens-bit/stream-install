import React, { useMemo, useState } from 'react';
import { Columns3, Download, Search, SlidersHorizontal, Clock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type TimeEntry = {
  id: string;
  datum: string;
  medewerker: string;
  klantProject: string;
  omschrijving: string;
  uren: string;
};

const timeEntries: TimeEntry[] = [
  {
    id: 'te-1',
    datum: '26-03-2026',
    medewerker: 'Sven',
    klantProject: 'Centrada — Installatie',
    omschrijving: 'Voorbereiding werkbon',
    uren: '01:15',
  },
  {
    id: 'te-2',
    datum: '26-03-2026',
    medewerker: 'Cees',
    klantProject: 'OpusFlow — Support',
    omschrijving: 'Afstemming klant',
    uren: '00:45',
  },
  {
    id: 'te-3',
    datum: '25-03-2026',
    medewerker: 'Sandra',
    klantProject: 'Fam. van den Brink — Warmtepomp',
    omschrijving: 'Inmeten en check onderdelen',
    uren: '02:30',
  },
];

export function TimeTrackingTab() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return timeEntries;
    return timeEntries.filter((e) => {
      const haystack = [e.datum, e.medewerker, e.klantProject, e.omschrijving].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative space-y-4 pt-2 pb-8">
      <div className="flex items-center gap-3 px-6 pb-2 shrink-0">
        <div className="bg-sky-100 p-2 rounded-lg">
          <Clock className="h-5 w-5 text-sky-700" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Urenregistratie</h2>
      </div>

      <div className="bg-white mx-6 rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 shrink-0 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            Overzicht van geregistreerde uren
            <span className="bg-gray-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">{filtered.length}</span>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-emerald-900 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Registratie Aanmaken
          </button>
        </div>

        <div className="px-4 py-2 flex items-center justify-between bg-white shrink-0 border-b border-gray-100 gap-3">
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            <button type="button" className="flex items-center gap-1.5 hover:text-gray-900">
              <Columns3 className="h-4 w-4" /> Kolommen
            </button>
            <button type="button" className="flex items-center gap-1.5 hover:text-gray-900">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <button type="button" className="flex items-center gap-1.5 hover:text-gray-900">
              <Download className="h-4 w-4" /> Exporteren
            </button>
          </div>

          <div className="relative w-64 flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Zoeken..."
              className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50 w-full"
            />
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm border-collapse min-w-[900px]">
            <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-gray-100/60">
              <tr className="border-b border-gray-200">
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-36">Datum</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-40">Medewerker</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase">Klant / Project</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase">Omschrijving</th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase w-28 text-right">Uren</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => (
                <tr
                  key={entry.id}
                  className={cn(
                    'border-b border-gray-100 hover:bg-gray-50/80 transition-colors',
                    i % 2 === 1 && 'bg-gray-50/40'
                  )}
                >
                  <td className="p-3 text-gray-700 whitespace-nowrap">{entry.datum}</td>
                  <td className="p-3 text-gray-700">{entry.medewerker}</td>
                  <td className="p-3 text-emerald-700 font-semibold hover:underline">{entry.klantProject}</td>
                  <td className="p-3 text-gray-700">{entry.omschrijving}</td>
                  <td className="p-3 text-gray-900 font-semibold text-right">{entry.uren}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

