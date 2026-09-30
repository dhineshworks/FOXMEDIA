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
  ArrowRight, 
  Check, 
  ExternalLink,
  User,
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

  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [validation, setValidation] = useState<ValidationResponse | null>(null);
  const [redeemResult, setRedeemResult] = useState<RedeemResponse | null>(null);
  const [inputToken, setInputToken] = useState(initialToken);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);




  // Fetch token validation on load or when token parameter changes
  useEffect(() => {
    let isMounted = true;
    const activeCode = initialToken || (inputToken && inputToken !== 'demo' ? inputToken : '');

    async function loadTokenInfo() {
      if (!activeCode || activeCode === 'demo') {
        setLoading(false);
        setValidation(null);
        return;
      }

      setLoading(true);
      try {
        const res = await redemptionService.validateToken(activeCode);
        if (isMounted) {
          setValidation(res);
        }
      } catch (e) {
        console.error('Validation error', e);
        if (isMounted) {
          setValidation({
            valid: false,
            status: 'INVALID',
            error: 'Something went wrong. Please try again.',
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTokenInfo();

    return () => {
      isMounted = false;
    };
  }, [initialToken]);

  // Execute atomic redemption ONLY when user explicitly clicks "Redeem Now"
  const handleRedeem = async () => {
    const activeCode = initialToken || inputToken.trim();
    if (!activeCode) return;

    setRedeeming(true);
    try {
      const res = await redemptionService.redeemToken(activeCode);
      setRedeemResult(res);
      if (res.success) {
        // Mark local state as redeemed
        setValidation(prev => prev ? { ...prev, valid: false, status: 'USED' } : null);

        // If target_url exists, initiate redirect countdown
        if (res.target_url) {
          setRedirectCountdown(3);
        }
      }
    } catch (err) {
      console.error('Redeem failure', err);
      setRedeemResult({
        success: false,
        status: 'INVALID',
        error: 'Something went wrong. Please try again.',
      });
    } finally {
      setRedeeming(false);
    }
  };

  // Countdown and redirect effect
  useEffect(() => {
    if (redirectCountdown === null) return;
    if (redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (redirectCountdown === 0 && redeemResult?.target_url) {
      window.location.href = redeemResult.target_url;
    }
  }, [redirectCountdown, redeemResult]);

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
        {(!initialToken || initialToken === 'demo') && !validation && (
          <div className="mb-8 p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Redeem Your Adobe Subscription</h1>
            <p className="text-xs sm:text-sm text-zinc-400 mb-6">
              Enter your customer name or redemption code to activate your license.
            </p>

            <form onSubmit={handleManualSearch} className="flex gap-2">
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="e.g. Foxmedia or r_8Fj29KxP7mQ2Ls91"
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

        {/* Loading State */}
        {loading && (
          <div className="p-12 rounded-3xl bg-zinc-900/60 border border-zinc-800 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-orange-400 animate-spin mb-4" />
            <p className="text-zinc-200 font-medium text-base">Verifying custom redemption link...</p>
            <p className="text-zinc-400 text-xs mt-1">Authenticating with Adobe license database</p>
          </div>
        )}

        {/* Redemption Completed Successfully State (Cloaked Redirect) */}
        {!loading && redeemResult?.success && (
          <div className="rounded-3xl bg-zinc-900/90 border border-emerald-500/40 p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">
              License Activated
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 mb-2">
              Redemption Successful!
            </h2>
            <p className="text-zinc-300 text-sm mb-6">
              Your Adobe subscription is ready. Redirecting to your official setup portal...
            </p>

            {/* Countdown Banner */}
            {redirectCountdown !== null && (
              <div className="mb-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                  <span>Redirecting in <strong>{redirectCountdown}</strong> seconds...</span>
                </span>
                {redeemResult.target_url && (
                  <a
                    href={redeemResult.target_url}
                    className="font-bold underline hover:text-white"
                  >
                    Click to proceed now →
                  </a>
                )}
              </div>
            )}

            {/* Product Badge */}
            <div className="bg-zinc-950/80 rounded-2xl border border-zinc-800 p-5 text-left mb-6 space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-zinc-800/80 pb-3">
                <span className="text-zinc-400">Product Plan</span>
                <span className="text-white font-semibold">{redeemResult.product_name || 'Adobe Pro Plus'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-zinc-800/80 pb-3">
                <span className="text-zinc-400">Duration</span>
                <span className="text-orange-400 font-semibold">{redeemResult.duration || '4 Month'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Activated On</span>
                <span className="text-zinc-300">{formatDate(redeemResult.redeemed_at)}</span>
              </div>
            </div>

            {/* Direct Action Button */}
            {redeemResult.target_url && (
              <a
                href={redeemResult.target_url}
                className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-950/40 flex items-center justify-center gap-2 transition"
              >
                <span>Proceed to Adobe Setup</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        )}

        {/* Ready to Redeem State (Valid token, not redeemed yet) */}
        {!loading && !redeemResult?.success && validation?.valid && (
          <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-8 shadow-2xl">
            {/* Header info */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white leading-tight">
                    {validation.product_name}
                  </h1>
                  <span className="text-xs text-orange-400 font-semibold">
                    {validation.product_duration} Subscription
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Status: Ready
              </div>
            </div>

            {/* Customer Name Banner */}
            {validation.custom_name && (
              <div className="flex items-center justify-between text-xs text-zinc-300 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 mb-5">
                <span className="flex items-center gap-2 text-zinc-400">
                  <User className="w-4 h-4 text-orange-400" />
                  Reserved for:
                </span>
                <span className="font-bold text-white font-mono">{validation.custom_name}</span>
              </div>
            )}

            <p className="text-zinc-300 text-sm mb-6 leading-relaxed">
              {validation.product_description || 'Click the button below to redeem and link your 4-month Adobe license.'}
            </p>

            {/* Plan features snapshot */}
            {validation.product_features && validation.product_features.length > 0 && (
              <div className="bg-zinc-950/60 rounded-2xl border border-zinc-800/80 p-4 mb-6">
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 block mb-3">
                  Included Benefits:
                </span>
                <div className="space-y-2">
                  {validation.product_features.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Redeem Now Button */}
            <button
              onClick={handleRedeem}
              disabled={redeeming}
              className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
            >
              {redeeming ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Activating Your Adobe License...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Redeem Now</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-zinc-400 mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>One-click secure activation • Master destination link is protected</span>
            </p>
          </div>
        )}

        {/* Error / Inactive States */}
        {!loading && !validation?.valid && initialToken && initialToken !== 'demo' && (
          <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-8 text-center shadow-2xl">
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
