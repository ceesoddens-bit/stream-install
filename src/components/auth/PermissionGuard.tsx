import React from 'react';
import { useTenant } from '@/lib/tenantContext';
import { PermissionKey } from '@/lib/permissions';

interface Props {
  permission: PermissionKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ permission, children, fallback = null }: Props) {
  const { heeftPermissie } = useTenant();
  if (!heeftPermissie(permission)) return <>{fallback}</>;
  return <>{children}</>;
}
