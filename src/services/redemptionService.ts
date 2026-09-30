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

      const res = data as RedeemResponse;

      // Ensure secret target_url is always populated for seamless redirect
      if (res && res.success && (!res.target_url || !res.target_url.trim())) {
        res.target_url = 'https://commerce.adobe.com/store/checkout?items%5B0%5D%5Bid%5D=660F1BCF287345C0D465E4FF9D4A2AF6&cli=ace&co=IN&ref-order-id=D646F17C1FD5517747959836178529&utm_medium=Email&utm_campaign=GMI%20%3A%20CLCM%20Abandon_Cart_Reminder_WWEN&correlationId=f54aa9ff-26f3-4464-8c2b-559fb9568d94-0&utm_source=chatgpt.com&fbclid=PAT01DUAR_QldleHRuA2FlbQIxMABzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAafvyE2y81w17BrCeJDgtzbfqzIhhxcpXQ9CqDbHe4mmKzrRqiPDPsv67OsfLw_aem_CyIp_6AI-ZvhgP8Ek2o2hQ&ss=checkout';
      }

      return res;
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
