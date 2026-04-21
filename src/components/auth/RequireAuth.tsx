import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTenant } from '@/lib/tenantContext';


export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { authUser, authReady } = useTenant();
  const location = useLocation();
  if (!authReady) return <FullPageSpinner />;
  if (!authUser) return <Navigate to="/login" replace state={{ from: location }} />;
  return <>{children}</>;
}

export function RequireGuest({ children }: { children: React.ReactNode }) {
  const { authUser, authReady } = useTenant();
  if (!authReady) return <FullPageSpinner />;
  if (authUser) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}


function FullPageSpinner() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="h-12 w-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );
}
