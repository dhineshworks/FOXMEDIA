import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  KeyRound, 
  Loader2, 
  Sparkles, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

import { redemptionService } from '../services/redemptionService';
import { formatDate } from '../utils/dateUtils';
import type { ValidationResponse, RedeemResponse } from '../types';

export const RedeemPage: React.FC = () => {
  const { token: pathToken } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  
  // Support both /redeem/:token, /l/:token AND query param /l/?id=Foxmedia or /redeem?id=Foxmedia
  const queryToken = searchParams.get('id') || searchParams.get('token');
  const initialToken = pathToken && pathToken !== 'demo' ? pathToken : queryToken || '';

  const [loading, setLoading] = useState(Boolean(initialToken));
  const [validation, setValidation] = useState<ValidationResponse | null>(null);
  const [redeemResult, setRedeemResult] = useState<RedeemResponse | null>(null);
  const [inputToken, setInputToken] = useState(initialToken);

  // Auto-redeem effect: as soon as the user opens the link, atomically redeem and redirect!
  useEffect(() => {
    let isMounted = true;
    const activeCode = initialToken || (inputToken && inputToken !== 'demo' ? inputToken : '');

    if (!activeCode || activeCode === 'demo') {
      setLoading(false);
      setValidation(null);
      return;
    }

    async function autoRedeemAndRedirect() {
      setLoading(true);
      try {
        // Atomic database redemption: marks link USED immediately so it cannot be reused
        const res = await redemptionService.redeemToken(activeCode);
        
        if (!isMounted) return;

        if (res.success && res.target_url) {
          setRedeemResult(res);
          // Redirect immediately to secret Adobe checkout URL
          window.location.replace(res.target_url);
        } else {
          // If already used, expired, or invalid
          setLoading(false);
          setValidation({
            valid: false,
            status: (res.status as ValidationResponse['status']) || 'INVALID',
            error: res.error || (res.status === 'USED' ? 'This redemption link has already been used and cannot be claimed again.' : 'Invalid link.'),
            used_at: (res as unknown as { used_at?: string }).used_at
          });
        }
      } catch (err) {
        console.error('Auto redeem error:', err);
        if (isMounted) {
          setLoading(false);
          setValidation({
            valid: false,
            status: 'INVALID',
            error: 'Unable to process redemption. Please try again.',
          });
        }
      }
    }

    autoRedeemAndRedirect();

    return () => {
      isMounted = false;
    };
  }, [initialToken]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputToken.trim()) {
      window.location.href = `/l/${encodeURIComponent(inputToken.trim())}`;
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-xl">
        {/* Token search input if visiting /redeem or /l directly without code */}
        {(!initialToken || initialToken === 'demo') && !validation && !loading && (
          <div className="mb-8 p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 text-center shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Redeem Your Adobe Subscription</h1>
            <p className="text-xs sm:text-sm text-zinc-400 mb-6">
              Enter your customer name or link alias to activate your single-use Adobe license.
            </p>

            <form onSubmit={handleManualSearch} className="flex gap-2">
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="e.g. Foxmedia or customer-001"
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 font-mono"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm transition"
              >
                Lookup
              </button>
            </form>
          </div>
        )}

        {/* Loading State: Activating & Redirecting */}
        {loading && (
          <div className="p-12 rounded-3xl bg-zinc-900/80 border border-zinc-800 text-center flex flex-col items-center justify-center shadow-2xl backdrop-blur-md">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
              </div>
              <Sparkles className="w-5 h-5 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Activating Your Adobe Subscription</h2>
            <p className="text-zinc-300 text-sm max-w-sm">
              Securing single-use license and connecting to official Adobe setup portal...
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Redirecting automatically in seconds</span>
            </div>
          </div>
        )}

        {/* Fallback button if browser popup blocker holds redirection */}
        {!loading && redeemResult?.success && redeemResult.target_url && (
          <div className="rounded-3xl bg-zinc-900/90 border border-emerald-500/40 p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">
              License Activated
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-2 mb-2">
              Redemption Successful!
            </h2>
            <p className="text-zinc-300 text-sm mb-6">
              Your single-use link has been claimed. Click below if you are not redirected automatically.
            </p>

            <a
              href={redeemResult.target_url}
              className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-950/40 flex items-center justify-center gap-2 transition"
            >
              <span>Continue to Adobe Checkout</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        )}

        {/* Error / Single-Use Already Redeemed State */}
        {!loading && !validation?.valid && initialToken && initialToken !== 'demo' && (
          <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-8 text-center shadow-2xl">
            {/* Status-specific icon */}
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-lg bg-zinc-800/80 text-zinc-400">
              {validation?.status === 'USED' && <CheckCircle2 className="w-8 h-8 text-amber-400" />}
              {validation?.status === 'EXPIRED' && <Clock className="w-8 h-8 text-rose-400" />}
              {validation?.status === 'DISABLED' && <ShieldAlert className="w-8 h-8 text-rose-400" />}
              {validation?.status === 'LIMIT_REACHED' && <AlertCircle className="w-8 h-8 text-orange-400" />}
              {(!validation?.status || validation?.status === 'INVALID') && (
                <AlertCircle className="w-8 h-8 text-rose-400" />
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-2">
              {validation?.status === 'USED' && 'Link Already Used'}
              {validation?.status === 'EXPIRED' && 'Link Expired'}
              {validation?.status === 'DISABLED' && 'Link Disabled'}
              {validation?.status === 'LIMIT_REACHED' && 'Usage Limit Reached'}
              {(!validation?.status || validation?.status === 'INVALID') && 'Invalid Redemption Link'}
            </h2>

            {/* Error Message */}
            <p className="text-zinc-400 text-sm max-w-sm mx-auto mb-6">
              {validation?.error ||
                (validation?.status === 'USED' && 'This redemption link has already been used and cannot be claimed again.') ||
                (validation?.status === 'EXPIRED' && 'This redemption link has expired.') ||
                (validation?.status === 'DISABLED' && 'This redemption link has been disabled.') ||
                (validation?.status === 'LIMIT_REACHED' && 'This link has reached its maximum usage limit.') ||
                'The redemption token you entered does not exist or has been removed.'}
            </p>

            {validation?.used_at && (
              <div className="text-xs text-zinc-400 bg-zinc-950 p-3 rounded-xl border border-zinc-800 mb-6">
                Originally redeemed on {formatDate(validation.used_at)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/redeem"
                className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm transition"
              >
                Try Another Code
              </Link>
              <Link
                to="/"
                className="flex-1 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm transition"
              >
                Get New Plan
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
