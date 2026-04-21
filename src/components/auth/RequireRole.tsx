import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTenant } from '@/lib/tenantContext';
import { Rol } from '@/lib/tenantTypes';

interface Props {
  roles: Rol[];
  fallback?: string;
  children: React.ReactNode;
}

export function RequireRole({ roles, fallback = '/', children }: Props) {
  const { role, loading } = useTenant();
  if (loading) return null;
  if (!role || !roles.includes(role)) return <Navigate to={fallback} replace />;
  return <>{children}</>;
}
