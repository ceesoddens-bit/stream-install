import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

export function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/registreren';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Stream Install</span>
        </Link>
        <div className="flex items-center gap-4">
          {!isLoginPage && (
            <Link
              to="/login"
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Inloggen
            </Link>
          )}
          {!isRegisterPage && (
            <Button
              type="button"
              onClick={() => navigate('/registreren')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-sm"
            >
              Start Nu
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
