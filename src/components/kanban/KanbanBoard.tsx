import React, { useState } from 'react';
import { planningCards, currentUser } from '@/data/mockData';
import { PlanningCard, PlanningStatus } from '@/types';
import { ProjectCard } from './ProjectCard';
import { cn } from '@/lib/utils';
import { Columns3, SlidersHorizontal, BookmarkCheck, ChevronDown, LayoutGrid, Search, Plus } from 'lucide-react';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(amount);

interface ColumnConfig {
  id: PlanningStatus;
  label: string;
  borderColor: string;
  badgeColor: string;
  rotated?: boolean;
}

const INSTALLATION_COLUMNS: ColumnConfig[] = [
  { id: 'Offerte maken',      label: 'Offerte maken',      borderColor: 'border-t-green-500',  badgeColor: 'bg-green-500' },
  { id: 'Offerte verstuurd',  label: 'Offerte verstuurd',  borderColor: 'border-t-green-500',  badgeColor: 'bg-green-500' },
  { id: 'Geen opdracht',      label: 'Geen opdracht',      borderColor: 'border-t-red-500',    badgeColor: 'bg-red-500' },
  { id: 'Parkeren',           label: 'Parkeren',           borderColor: 'border-t-green-500',  badgeColor: 'bg-green-500' },
  { id: 'Montage plannen',    label: 'Montage plannen',    borderColor: 'border-t-gray-300',   badgeColor: 'bg-gray-400' },
  { id: 'Montage gepland',    label: 'Montage gepland',    borderColor: 'border-t-gray-300',   badgeColor: 'bg-gray-400' },
  { id: 'Restpunt plannen',   label: 'Restpunt plannen',   borderColor: 'border-t-gray-300',   badgeColor: 'bg-gray-400' },
  { id: 'Restpunt gepland',   label: 'Restpunt gepland',   borderColor: 'border-t-gray-300',   badgeColor: 'bg-gray-400' },
  { id: 'Oplevering controleren & Factureren', label: 'Oplevering controleren & Factureren', borderColor: 'border-t-gray-300', badgeColor: 'bg-gray-400' },
  { id: 'Project afgerond',   label: 'Project afgerond',   borderColor: 'border-t-purple-500', badgeColor: 'bg-purple-500' },
];

const SERVICE_COLUMNS: ColumnConfig[] = [
  { id: 'Service gepland',              label: 'Service gepland',              borderColor: 'border-t-green-500',  badgeColor: 'bg-green-500' },
  { id: 'Service in afwachting',        label: 'Service in afwachting',        borderColor: 'border-t-green-400',  badgeColor: 'bg-green-400', rotated: true },
  { id: 'Service afgerond',             label: 'Service afgerond',             borderColor: 'border-t-gray-300',   badgeColor: 'bg-gray-400',  rotated: true },
  { id: 'Contract actief',              label: 'Contract actief',              borderColor: 'border-t-gray-300',   badgeColor: 'bg-gray-400',  rotated: true },
  { id: 'Contract beëindigd',           label: 'Contract beëindigd',           borderColor: 'border-t-gray-300',   badgeColor: 'bg-gray-400',  rotated: true },
  { id: 'Contract afgerond (facturatie)', label: 'Contract afgerond (facturatie)', borderColor: 'border-t-gray-300', badgeColor: 'bg-gray-400', rotated: true },
  { id: 'Offerte afgekeurd',            label: 'Offerte afgekeurd',            borderColor: 'border-t-red-500',    badgeColor: 'bg-red-500',   rotated: true },
];

interface KanbanColumnProps {
  config: ColumnConfig;
  cards: PlanningCard[];
  onViewProject?: (id: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ config, cards, onViewProject }) => {
  const totalAmount = cards.reduce((sum, c) => sum + c.amount, 0);

  // Columns with 0 cards but shown as rotated thin "dividers"
  if (config.rotated && cards.length === 0) {
    return (
      <div className="flex flex-col shrink-0 w-10 bg-white border border-gray-200 rounded-xl shadow-sm relative overflow-hidden">
        <div className={cn('h-1.5 w-full shrink-0', config.borderColor.replace('border-t-', 'bg-'))} />
        <div className="flex-1 flex items-center justify-center">
          <span
            className="text-[11px] font-semibold text-gray-500 whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {config.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex flex-col w-72 shrink-0 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden',
      cards.length === 0 && 'w-10'
    )}>
      {/* Top color bar */}
      <div className={cn('h-1.5 w-full shrink-0', config.borderColor.replace('border-t-', 'bg-'))} />

      {cards.length === 0 ? (
        <div className="flex-1 flex items-center justify-center px-1">
          <span
            className="text-[11px] font-semibold text-gray-500 whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {config.label}
          </span>
        </div>
      ) : (
        <>
          {/* Column header */}
          <div className="px-3 py-2.5 border-b border-gray-100">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[12px] font-bold text-gray-800 leading-tight flex-1 min-w-0 truncate">
                {config.label}
              </h3>
              <div className="flex items-center gap-1.5 shrink-0">
                {totalAmount > 0 && (
                  <span className="text-[10px] font-semibold text-gray-600">
                    {formatCurrency(totalAmount)}
                  </span>
                )}
                <span className={cn('text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full min-w-[20px] text-center', config.badgeColor)}>
                  {cards.length}
                </span>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {cards.map(card => (
              <ProjectCard 
                key={card.id} 
                card={card} 
                onClick={() => onViewProject && onViewProject(card.id)} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface KanbanBoardProps {
  scope?: 'all' | 'mine';
  onViewProject?: (id: string) => void;
}

export function KanbanBoard({ scope = 'all', onViewProject }: KanbanBoardProps) {
  const [activeTab, setActiveTab] = useState<'Alles' | 'Installatie' | 'Service'>('Alles');
  const [typeFilter, setTypeFilter] = useState<'Installatie' | 'Service' | 'both'>('both');

  const scopedCards = scope === 'mine'
    ? planningCards.filter((c) => c.accountManager === currentUser.name)
    : planningCards;

  const getColumns = () => {
    if (typeFilter === 'Installatie') return INSTALLATION_COLUMNS;
    if (typeFilter === 'Service') return SERVICE_COLUMNS;
    return [...INSTALLATION_COLUMNS, ...SERVICE_COLUMNS];
  };

  const getCardsForColumn = (colId: PlanningStatus): PlanningCard[] =>
    scopedCards.filter(c => c.status === colId);

  const columns = getColumns();

  return (
    <div className="flex flex-col h-full">
      {/* ── Top Tab Bar ── */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        {/* Tabs */}
        <div className="flex items-end gap-0 border-b border-gray-200">
          {(['Alles'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors',
                activeTab === tab
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right: type toggles + add button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-green-600 rounded-full overflow-hidden cursor-pointer select-none">
            <button
              onClick={() => setTypeFilter(typeFilter === 'Installatie' ? 'both' : 'Installatie')}
              className={cn(
                'text-[11px] font-bold px-3 py-1 transition-colors',
                typeFilter === 'Installatie' ? 'bg-green-700 text-white' : 'bg-green-600 text-white'
              )}
            >
              Installatie
            </button>
            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 min-w-[24px] text-center">
              {scopedCards.filter(c => c.projectType === 'Installatie').length}
            </span>
          </div>

          <div className="flex items-center bg-gray-200 rounded-full overflow-hidden cursor-pointer select-none">
            <button
              onClick={() => setTypeFilter(typeFilter === 'Service' ? 'both' : 'Service')}
              className={cn(
                'text-[11px] font-bold px-3 py-1 transition-colors',
                typeFilter === 'Service' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700'
              )}
            >
              Service
            </button>
            <span className="bg-gray-300 text-gray-700 text-[10px] font-bold px-2 py-1 min-w-[24px] text-center">
              {scopedCards.filter(c => c.projectType === 'Service').length}
            </span>
          </div>

          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ChevronDown className="h-4 w-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <LayoutGrid className="h-4 w-4" />
          </button>

          <button className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors">
            <Plus className="h-3.5 w-3.5" />
            Residentieel
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 mb-3">
        <button className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 hover:text-gray-900 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <Columns3 className="h-3.5 w-3.5" />
          Kolommen
        </button>
        <button className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 hover:text-gray-900 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </button>
        <button className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 hover:text-gray-900 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <BookmarkCheck className="h-3.5 w-3.5" />
          Filtersjablonen
        </button>

        <div className="ml-auto">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Column Headers (field names) ── */}
      <div className="flex items-center gap-1 border-b border-gray-200 pb-1.5 mb-3 overflow-x-auto">
        {['Naam', 'Bedrijfsnaam', 'Contactnaam', 'Accountmanager', 'Gecreëerd door', 'Bijgewerkt door', 'Adres'].map((col) => (
          <span key={col} className="text-[11px] font-semibold text-gray-500 whitespace-nowrap px-2">
            {col}
          </span>
        ))}
      </div>

      {/* ── Kanban Board ── */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-2 h-full pb-4" style={{ minWidth: 'max-content' }}>
          {columns.map(col => (
            <KanbanColumn
              key={col.id}
              config={col}
              cards={getCardsForColumn(col.id)}
              onViewProject={onViewProject}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
