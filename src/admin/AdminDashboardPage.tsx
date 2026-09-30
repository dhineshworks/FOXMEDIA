import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Link2, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  ArrowUpRight, 
  Copy, 
  Loader2, 
  TrendingUp, 
  Check 
} from 'lucide-react';

import { adminService } from '../services/adminService';
import { formatDate } from '../utils/dateUtils';
import type { RedemptionLink, RedemptionRecord } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    used: number;
    expired: number;
    limitReached: number;
    recentLinks: RedemptionLink[];
    recentRedemptions: RedemptionRecord[];
  }>({
    total: 0,
    active: 0,
    used: 0,
    expired: 0,
    limitReached: 0,
    recentLinks: [],
    recentRedemptions: [],
  });
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (e) {
        console.error('Error fetching dashboard stats', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleCopy = (token: string) => {
    const url = `${window.location.origin}/redeem/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin mb-3" />
        <p className="text-zinc-400 text-sm">Loading admin metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Overview</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time status of Adobe 4-month and Canva license links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/links/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-950/40 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate Links</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Links */}
        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Generated</span>
            <Link2 className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.total}</div>
          <div className="text-[11px] text-zinc-400 mt-2">All time generated tokens</div>
        </div>

        {/* Active Links */}
        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Active & Ready</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{stats.active}</div>
          <div className="text-[11px] text-zinc-400 mt-2">Awaiting customer redemption</div>
        </div>

        {/* Used Links */}
        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Redeemed</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{stats.used}</div>
          <div className="text-[11px] text-zinc-400 mt-2">Successfully claimed licenses</div>
        </div>

        {/* Expired Links */}
        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Expired / Limit</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400">
            {stats.expired + stats.limitReached}
          </div>
          <div className="text-[11px] text-zinc-400 mt-2">Time-expired or limit reached</div>
        </div>
      </div>

      {/* Recent Links Table Preview */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Recent Redemption Links</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Most recent token generations</p>
          </div>
          <Link
            to="/admin/links"
            className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 font-medium"
          >
            <span>View all links</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentLinks.length === 0 ? (
          <div className="p-10 text-center text-zinc-400 text-xs sm:text-sm">
            No redemption links created yet. Click "Generate Links" to create your first link.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-950/60 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Custom Name</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs">
                {stats.recentLinks.map((link) => {
                  const isCopied = copiedToken === link.token;
                  return (
                    <tr key={link.id} className="hover:bg-zinc-800/30 transition">
                      <td className="py-3 px-4 font-mono font-medium text-white">
                        {link.custom_name}
                      </td>
                      <td className="py-3 px-4 text-zinc-300">
                        {link.product?.name || 'Adobe Pro Plus (4 Month)'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            link.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : link.status === 'USED'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : link.status === 'EXPIRED'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {link.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400">{formatDate(link.created_at)}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleCopy(link.token)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                            isCopied
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Redemptions Audit Log */}
      {stats.recentRedemptions && stats.recentRedemptions.length > 0 && (
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5">
          <h2 className="text-base font-bold text-white mb-1">Live Redemption Audit Stream</h2>
          <p className="text-xs text-zinc-400 mb-4">Real-time log of customer redemption timestamps</p>
          <div className="space-y-2.5">
            {stats.recentRedemptions.map((rec) => (
              <div
                key={rec.id}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-white font-medium">{rec.custom_name || 'Redemption'}</span>
                    <span className="text-zinc-400 ml-2">({rec.product_name || 'Adobe Pro Plus'})</span>
                  </div>
                </div>
                <span className="text-zinc-400">{formatDate(rec.redeemed_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
