import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';
import type { Settings } from '../types';

export const settingsService = {
  async getSettings(): Promise<Settings> {
    if (!isSupabaseConfigured()) {
      return mockStore.getSettings();
    }

    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'general')
        .single();

      if (error || !data) {
        return mockStore.getSettings();
      }

      return data as Settings;
    } catch {
      return mockStore.getSettings();
    }
  },

  async updateSettings(settings: Settings): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      mockStore.saveSettings(settings);
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 'general',
          business_name: settings.business_name,
          whatsapp_number: settings.whatsapp_number,
          support_hours: settings.support_hours,
          website_url: settings.website_url,
          adobe_target_url: settings.adobe_target_url || 'https://dhineshworks.github.io/softsync-shop/l/?id=Foxmedia',
          updated_at: new Date().toISOString()
        });


      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update settings';
      return { success: false, error: message };
    }
  }
};
