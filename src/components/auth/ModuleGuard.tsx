import React from 'react';
import { useTenant } from '@/lib/tenantContext';
import { ModuleKey } from '@/lib/modules';
import { UpgradeOverlay } from './UpgradeOverlay';

interface Props {
  module: ModuleKey;
  children: React.ReactNode;
}

export function ModuleGuard({ module, children }: Props) {
  const { heeftToegang } = useTenant();
  if (heeftToegang(module)) return <>{children}</>;
  return <UpgradeOverlay module={module} />;
}
