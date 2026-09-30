import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';
import { generateBulkTokens, formatSequentialName } from '../utils/tokenGenerator';
import { calculateExpirationDate } from '../utils/dateUtils';
import type { RedemptionLink, CreateLinkParams, RedemptionRecord } from '../types';

export const adminService = {
  async getLinks(): Promise<RedemptionLink[]> {
    if (!isSupabaseConfigured()) {
      return mockStore.getLinks();
    }

    try {
      const { data, error } = await supabase
        .from('redemption_links')
        .select(`
          *,
          product:products (
            id,
            name,
            slug,
            duration,
            price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as RedemptionLink[]) || [];
    } catch (e) {
      console.error('Failed to fetch redemption links from Supabase:', e);
      return mockStore.getLinks();
    }
  },

  async createLinks(params: CreateLinkParams): Promise<{ success: boolean; createdCount: number; error?: string }> {
    const { productId, prefix, targetUrl, expiration, usageType, maxUses = 1, quantity } = params;
    const expiresAt = calculateExpirationDate(expiration);
    const tokens = generateBulkTokens(quantity);

    const linksToInsert = tokens.map((token, index) => {
      const customName = formatSequentialName(prefix, index + 1, quantity);
      return {
        product_id: productId,
        custom_name: customName,
        token: token,
        target_url: targetUrl?.trim() || null,
        usage_type: usageType,
        max_uses: usageType === 'SINGLE' ? 1 : maxUses,
        current_uses: 0,
        expires_at: expiresAt,
        status: 'ACTIVE' as const,
        created_at: new Date().toISOString(),
        used_at: null,
      };
    });


    if (!isSupabaseConfigured()) {
      const newLinks: RedemptionLink[] = linksToInsert.map((item, i) => ({
        ...item,
        id: `mock-link-${Date.now()}-${i}`,
      }));
      mockStore.saveLinks(newLinks);
      return { success: true, createdCount: quantity };
    }

    try {
      // Direct insert via authenticated Supabase client (enforced by RLS for admin)
      const { error } = await supabase
        .from('redemption_links')
        .insert(linksToInsert);

      if (error) throw error;
      return { success: true, createdCount: quantity };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create links';
      return { success: false, createdCount: 0, error: message };
    }
  },

  async updateLinkStatus(id: string, status: RedemptionLink['status']): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      mockStore.updateLinkStatus(id, status);
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('redemption_links')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update link status';
      return { success: false, error: message };
    }
  },

  async deleteLink(id: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      mockStore.deleteLink(id);
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('redemption_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete link';
      return { success: false, error: message };
    }
  },

  async getDashboardStats() {
    const links = await this.getLinks();
    const redemptions = await this.getRedemptions();

    const total = links.length;
    const active = links.filter(l => l.status === 'ACTIVE').length;
    const used = links.filter(l => l.status === 'USED').length;
    const expired = links.filter(l => l.status === 'EXPIRED').length;
    const limitReached = links.filter(l => l.status === 'LIMIT_REACHED').length;
    const disabled = links.filter(l => l.status === 'DISABLED').length;

    return {
      total,
      active,
      used,
      expired,
      limitReached,
      disabled,
      recentLinks: links.slice(0, 5),
      recentRedemptions: redemptions.slice(0, 5)
    };
  },

  async getRedemptions(): Promise<RedemptionRecord[]> {
    if (!isSupabaseConfigured()) {
      return mockStore.getRedemptions();
    }

    try {
      const { data, error } = await supabase
        .from('redemptions')
        .select(`
          *,
          link:redemption_links (
            custom_name,
            product:products (
              name
            )
          )
        `)
        .order('redeemed_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []).map(r => ({
        id: r.id,
        redemption_link_id: r.redemption_link_id,
        redemption_number: r.redemption_number,
        redeemed_at: r.redeemed_at,
        ip_hash: r.ip_hash,
        custom_name: r.link?.custom_name,
        product_name: r.link?.product?.name
      }));
    } catch (e) {
      console.error('Failed to fetch redemptions:', e);
      return mockStore.getRedemptions();
    }
  }
};
