import React from 'react';
import { ExternalLink, User, Mail, Phone, RefreshCw } from 'lucide-react';
import { PlanningCard, ProductTag } from '@/types';
import { cn } from '@/lib/utils';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(amount);

const getProductTagStyle = (tag: ProductTag): string => {
  switch (tag) {
    case 'Zonnepanelen':    return 'bg-yellow-400 text-yellow-900';
    case 'Warmtepomp':      return 'bg-orange-500 text-white';
    case 'CV-ketel':        return 'bg-orange-500 text-white';
    case 'Airco':           return 'bg-blue-500 text-white';
    case 'Energie opslag':  return 'bg-green-600 text-white';
    case 'Isolatie':        return 'bg-teal-500 text-white';
    case 'Installatie E':   return 'bg-red-600 text-white';
    case 'Installatie W':   return 'bg-pink-500 text-white';
    default:                return 'bg-gray-500 text-white';
  }
};

interface ProjectCardProps {
  card: PlanningCard;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ card, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow mb-3 overflow-hidden cursor-pointer"
    >
      {/* Top badge row */}
      <div className="px-3 pt-3 pb-2 flex items-center gap-1.5 flex-wrap">
        {/* Project type */}
        <span
          className={cn(
            'text-[10px] font-bold px-2 py-0.5 rounded-sm',
            card.projectType === 'Installatie'
              ? 'bg-green-500 text-white'
              : 'bg-orange-400 text-white'
          )}
        >
          {card.projectType}
        </span>

        {/* Client type */}
        <span
          className={cn(
            'text-[10px] font-semibold px-2 py-0.5 rounded-sm border',
            card.clientType === 'Residentieel'
              ? 'border-green-400 text-green-700 bg-green-50'
              : 'border-gray-300 text-gray-600 bg-gray-50'
          )}
        >
          {card.clientType}
        </span>

        {/* Account manager */}
        <span className="text-[10px] text-gray-500 ml-1 truncate">{card.accountManager}</span>

        {/* Sync icon */}
        <RefreshCw className="h-3 w-3 text-gray-400 ml-auto shrink-0" />
      </div>

      {/* Content */}
      <div className="px-3 pb-2 flex gap-2">
        <div className="flex-1 min-w-0">
          {/* Project ref */}
          <p className="text-[11px] font-semibold text-gray-800 leading-tight truncate">
            {card.projectRef}
          </p>
          {/* Client name */}
          <p className="text-[11px] text-gray-600 leading-tight mt-0.5">
            {card.clientName}
          </p>
          {/* Address */}
          <p className="text-[10px] text-gray-500 leading-tight mt-0.5 truncate">
            {card.address}
          </p>

          {/* Amount */}
          {card.amount > 0 && (
            <p className="text-[11px] font-semibold text-gray-800 mt-2">
              {formatCurrency(card.amount)}
            </p>
          )}

          {/* Product tags */}
          {card.productTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {card.productTags.map(tag => (
                <span
                  key={tag}
                  className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-sm', getProductTagStyle(tag))}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Optional image */}
        {card.imageUrl && (
          <div className="shrink-0 w-16 h-16 rounded overflow-hidden border border-gray-100 bg-gray-100 mt-1">
            <img
              src={card.imageUrl}
              alt="project"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="border-t border-gray-100 px-3 py-1.5 flex items-center gap-3">
        <button className="text-gray-400 hover:text-green-600 transition-colors">
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
        <button className="text-gray-400 hover:text-green-600 transition-colors">
          <User className="h-3.5 w-3.5" />
        </button>
        <button className="text-gray-400 hover:text-green-600 transition-colors">
          <Mail className="h-3.5 w-3.5" />
        </button>
        <button className="text-gray-400 hover:text-green-600 transition-colors">
          <Phone className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
