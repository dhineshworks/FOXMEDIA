import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { settingsService } from '../services/settingsService';
import type { Settings } from '../types';

export const CustomerLayout: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    id: 'general',
    business_name: 'FOXMEDIA',
    whatsapp_number: '9865488886',
    support_hours: '10:30 AM – 8:30 PM',
    website_url: window.location.origin
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      <Navbar settings={settings} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer settings={settings} />
      <WhatsAppButton phoneNumber={settings.whatsapp_number} />
    </div>
  );
};
