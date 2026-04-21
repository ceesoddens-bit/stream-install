import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardShell from './App';
import { TenantProvider } from './lib/tenantContext';
import { RequireAuth, RequireGuest } from './components/auth/RequireAuth';
import { RequireRole } from './components/auth/RequireRole';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegistrationWizard } from './pages/RegistrationWizard';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AcceptInvitePage } from './pages/AcceptInvitePage';
import { PortalPage } from './pages/PortalPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TenantProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <RequireGuest>
                <LoginPage />
              </RequireGuest>
            }
          />
          <Route
            path="/registreren"
            element={<RegistrationWizard />}
          />
          <Route path="/wachtwoord-vergeten" element={<ForgotPasswordPage />} />
          <Route path="/invite/:token" element={<AcceptInvitePage />} />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <RequireRole roles={['owner', 'admin', 'manager', 'technician', 'sales', 'finance']}>
                  <DashboardShell />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/:viewId/*"
            element={
              <RequireAuth>
                <RequireRole roles={['owner', 'admin', 'manager', 'technician', 'sales', 'finance']}>
                  <DashboardShell />
                </RequireRole>
              </RequireAuth>
            }
          />

          <Route
            path="/portaal/*"
            element={
              <RequireAuth>
                <RequireRole roles={['customer']} fallback="/dashboard">
                  <PortalPage />
                </RequireRole>
              </RequireAuth>
            }
          />

          <Route
            path="/portal/:tenantId/:contactId"
            element={<PortalPage />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TenantProvider>
    </BrowserRouter>
  </StrictMode>
);
