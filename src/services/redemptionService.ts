import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';
import type { ValidationResponse, RedeemResponse } from '../types';

export const redemptionService = {
  /**
   * Calls Supabase RPC validate_redemption_token(p_token)
   * Only reads safe public metadata. Opening the link does NOT redeem it.
   */
  async validateToken(token: string): Promise<ValidationResponse> {
    if (!token || !token.trim()) {
      return { valid: false, status: 'INVALID', error: 'Invalid Redemption Link' };
    }

    if (!isSupabaseConfigured()) {
      return mockStore.validateToken(token);
    }

    try {
      const { data, error } = await supabase.rpc('validate_redemption_token', {
        p_token: token.trim()
      });

      if (error) {
        console.error('Supabase validate RPC error:', error);
        return {
          valid: false,
          status: 'INVALID',
          error: error.message || 'Error validating redemption link.'
        };
      }

      return data as ValidationResponse;
    } catch (e: unknown) {
      console.error('Validation request failed:', e);
      return {
        valid: false,
        status: 'INVALID',
        error: 'Network error. Please try again.'
      };
    }
  },

  /**
   * Calls Supabase RPC redeem_redemption_token(p_token)
   * Atomic, database-enforced redemption to prevent race conditions.
   */
  async redeemToken(token: string): Promise<RedeemResponse> {
    if (!token || !token.trim()) {
      return { success: false, status: 'INVALID', error: 'Invalid Redemption Link' };
    }

    if (!isSupabaseConfigured()) {
      return mockStore.redeemToken(token);
    }

    try {
      const { data, error } = await supabase.rpc('redeem_redemption_token', {
        p_token: token.trim()
      });

      if (error) {
        console.error('Supabase redeem RPC error:', error);
        return {
          success: false,
          status: 'INVALID',
          error: error.message || 'Failed to process redemption.'
        };
      }

      return data as RedeemResponse;
    } catch (e: unknown) {
      console.error('Redeem request failed:', e);
      return {
        success: false,
        status: 'INVALID',
        error: 'Network error. Please try again.'
      };
    }
  }
};
