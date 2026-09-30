import React, { useEffect, useState } from 'react';
import { 
  Save, 
  CheckCircle2, 
  Loader2, 
  Database 
} from 'lucide-react';

import { settingsService } from '../services/settingsService';
import { isSupabaseConfigured } from '../lib/supabase';
import type { Settings } from '../types';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    id: 'general',
    business_name: 'FOXMEDIA',
    whatsapp_number: '9865488886',
    support_hours: '10:30 AM – 8:30 PM',
    website_url: window.location.origin
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (e) {
        console.error('Failed to load settings', e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    try {
      const res = await settingsService.updateSettings(settings);
      if (res.success) {
        setSuccessMessage('Business settings saved successfully.');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (e) {
      console.error('Failed to save settings', e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin mb-3" />
        <p className="text-zinc-400 text-xs">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Platform Settings</h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Configure business details, direct WhatsApp order routing, and support operational hours.
        </p>
      </div>

      {/* Supabase Integration Card */}
      <div className="rounded-3xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-orange-400" />
            <h2 className="text-sm font-bold text-white">Database & Serverless Connection</h2>
          </div>
          {isSupabaseConfigured() ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected to Live Supabase
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Local Preview Mode Active
            </span>
          )}
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          {isSupabaseConfigured()
            ? 'All products, redemption links, and atomic RPC functions are executed directly on your live Supabase PostgreSQL instance using Row Level Security (RLS).'
            : 'You are currently testing in local preview mode. To connect your live Supabase project, execute the schema in supabase/schema.sql in your Supabase SQL Editor and add VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY to your environment variables.'}
        </p>

        <div className="pt-2 text-xs text-zinc-400">
          <span className="text-zinc-500">Security Rule: </span>
          <span className="text-emerald-400 font-medium">
            Zero Backend Servers • No Service Role Key Exposed • 100% RLS Protected
          </span>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="rounded-3xl bg-zinc-900/70 border border-zinc-800 p-6 sm:p-8 space-y-5">
        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">
              Business / Brand Name
            </label>
            <input
              type="text"
              required
              value={settings.business_name}
              onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">
              WhatsApp Order Phone Number
            </label>
            <input
              type="text"
              required
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              placeholder="e.g. 9865488886"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-orange-500"
            />
            <span className="text-[10px] text-zinc-400 mt-1 block">
              10-digit number. Country code (+91) is automatically formatted.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">
              Support Hours
            </label>
            <input
              type="text"
              required
              value={settings.support_hours}
              onChange={(e) => setSettings({ ...settings, support_hours: e.target.value })}
              placeholder="10:30 AM – 8:30 PM"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">
              Website URL
            </label>
            <input
              type="text"
              required
              value={settings.website_url}
              onChange={(e) => setSettings({ ...settings, website_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-950/40 transition flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
