import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CustomerLayout } from './layouts/CustomerLayout';
import { HomePage } from './pages/HomePage';
import { RedeemPage } from './pages/RedeemPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminDashboardPage } from './admin/AdminDashboardPage';
import { AdminLinksPage } from './admin/AdminLinksPage';
import { AdminCreateLinksPage } from './admin/AdminCreateLinksPage';
import { AdminProductsPage } from './admin/AdminProductsPage';
import { AdminSettingsPage } from './admin/AdminSettingsPage';
import { AdminProtectedRoute } from './admin/AdminProtectedRoute';
import { settingsService } from './services/settingsService';
import type { Settings } from './types';

export function App() {
  const [settings, setSettings] = useState<Settings>({
    id: 'general',
    business_name: 'FOXMEDIA',
    whatsapp_number: '9865488886',
    support_hours: '10:30 AM – 8:30 PM',
    website_url: window.location.origin
  });

  useEffect(() => {
    settingsService.getSettings().then(setSettings);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Facing Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage settings={settings} />} />
          <Route path="redeem" element={<RedeemPage />} />
          <Route path="redeem/:token" element={<RedeemPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="links" element={<AdminLinksPage />} />
            <Route path="links/create" element={<AdminCreateLinksPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
