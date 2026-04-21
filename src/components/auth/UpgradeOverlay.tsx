import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import { MODULE_MAP, ModuleKey } from '@/lib/modules';
import { buttonVariants } from '@/components/ui/button';

interface Props {
  module: ModuleKey;
}

export function UpgradeOverlay({ module }: Props) {
  const def = MODULE_MAP[module];
  return (
    <div className="flex items-center justify-center h-full p-6">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center">
          <Lock className="h-6 w-6 text-emerald-600" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">{def?.naam ?? module} is niet actief</h2>
        <p className="mt-2 text-sm text-gray-600">
          {def?.beschrijving ?? 'Deze module is niet inbegrepen in uw abonnement.'}
        </p>
        {def && (
          <p className="mt-3 text-sm font-medium text-gray-900">
            Vanaf &euro;{def.prijsPerGebruiker}/gebruiker per maand
          </p>
        )}
        <Link
          to={`/dashboard/instellingen/abonnement?activeer=${module}`}
          className={buttonVariants({ size: 'lg', className: 'mt-6 w-full' })}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Module activeren
        </Link>
      </div>
    </div>
  );
}
