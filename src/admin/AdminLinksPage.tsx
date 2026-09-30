import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Copy, 
  Download, 
  Search, 
  Filter, 
  Check, 
  Trash2, 
  Power, 
  ExternalLink, 
  Loader2, 
  Eye, 
  X
} from 'lucide-react';

import { adminService } from '../services/adminService';
import { exportLinksToCSV } from '../utils/csvExporter';
import { formatDate } from '../utils/dateUtils';
import type { RedemptionLink, LinkStatus } from '../types';

export const AdminLinksPage: React.FC = () => {
  const [links, setLinks] = useState<RedemptionLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [selectedLink, setSelectedLink] = useState<RedemptionLink | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const data = await adminService.getLinks();
      setLinks(data);
    } catch (e) {
      console.error('Failed to load links', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      const matchesSearch = 
        link.custom_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (link.product?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || link.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [links, searchQuery, statusFilter]);

  const handleCopyLink = (link: RedemptionLink) => {
    const slug = link.custom_name ? encodeURIComponent(link.custom_name) : link.token;
    const url = `${window.location.origin}/l/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllLinks = () => {
    if (filteredLinks.length === 0) return;
    const text = filteredLinks
      .map(l => {
        const slug = l.custom_name ? encodeURIComponent(l.custom_name) : l.token;
        return `${l.custom_name}: ${window.location.origin}/l/${slug} [${l.status}]`;
      })
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };


  const handleExportCSV = () => {
    exportLinksToCSV(filteredLinks, window.location.origin);
  };

  const handleToggleStatus = async (link: RedemptionLink) => {
    const newStatus: LinkStatus = link.status === 'DISABLED' ? 'ACTIVE' : 'DISABLED';
    const res = await adminService.updateLinkStatus(link.id, newStatus);
    if (res.success) {
      setLinks(prev => prev.map(l => l.id === link.id ? { ...l, status: newStatus } : l));
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this redemption link?')) return;
    setDeletingId(id);
    const res = await adminService.deleteLink(id);
    if (res.success) {
      setLinks(prev => prev.filter(l => l.id !== id));
      if (selectedLink?.id === id) setSelectedLink(null);
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Redemption Links</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage single and multi-use redemption tokens for Adobe & Canva subscriptions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyAllLinks}
            disabled={filteredLinks.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition disabled:opacity-50"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'All Copied!' : 'Copy All Links'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={filteredLinks.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          <Link
            to="/admin/links/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-950/40 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Links</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search custom name, token, product..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-700/80 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-zinc-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          {['ALL', 'ACTIVE', 'USED', 'EXPIRED', 'DISABLED', 'LIMIT_REACHED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                statusFilter === st
                  ? 'bg-orange-500 text-white font-bold'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Links Table */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-8 h-8 text-orange-400 animate-spin mx-auto mb-2" />
            <p className="text-zinc-400 text-xs">Loading redemption links from database...</p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="p-16 text-center text-zinc-500 text-xs sm:text-sm">
            No redemption links match your search or filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Custom Name</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Redeem URL</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Uses</th>
                  <th className="py-3 px-4">Created At</th>
                  <th className="py-3 px-4">Expires At</th>
                  <th className="py-3 px-4">Used At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredLinks.map((link) => {
                  const redeemUrl = `${window.location.origin}/redeem/${link.token}`;
                  const isCopied = copiedId === link.id;

                  return (
                    <tr key={link.id} className="hover:bg-zinc-800/30 transition">
                      <td className="py-3 px-4 font-mono font-medium text-white whitespace-nowrap">
                        {link.custom_name}
                      </td>
                      <td className="py-3 px-4 text-zinc-300 whitespace-nowrap">
                        {link.product?.name || 'Adobe Pro Plus'}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-400 max-w-[160px] truncate">
                        <a
                          href={redeemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-orange-400 flex items-center gap-1"
                        >
                          <span className="truncate">{link.token}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            link.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : link.status === 'USED'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : link.status === 'EXPIRED'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : link.status === 'DISABLED'
                              ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                              : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          }`}
                        >
                          {link.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                        {link.usage_type === 'SINGLE'
                          ? `${link.current_uses}/1 (Single)`
                          : `${link.current_uses}/${link.max_uses} (Multi)`}
                      </td>
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                        {formatDate(link.created_at)}
                      </td>
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                        {formatDate(link.expires_at)}
                      </td>
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                        {formatDate(link.used_at)}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy Link */}
                          <button
                            onClick={() => handleCopyLink(link)}
                            className={`p-1.5 rounded-lg border transition ${
                              isCopied
                                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700'
                            }`}
                            title="Copy redemption link"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          {/* Quick details */}
                          <button
                            onClick={() => setSelectedLink(link)}
                            className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
                            title="View details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Enable / Disable */}
                          <button
                            onClick={() => handleToggleStatus(link)}
                            className={`p-1.5 rounded-lg border transition ${
                              link.status === 'DISABLED'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-rose-400'
                            }`}
                            title={link.status === 'DISABLED' ? 'Enable link' : 'Disable link'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            disabled={deletingId === link.id}
                            className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-500 hover:text-rose-400 hover:border-rose-900 transition"
                            title="Delete link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedLink && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-white text-base">Redemption Link Details</h3>
              <button
                onClick={() => setSelectedLink(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-zinc-800/60">
                <span className="text-zinc-500">Custom Name / Batch</span>
                <span className="text-white font-mono font-medium">{selectedLink.custom_name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800/60">
                <span className="text-zinc-500">Product</span>
                <span className="text-white font-medium">{selectedLink.product?.name || 'Adobe Pro Plus'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800/60">
                <span className="text-zinc-500">Status</span>
                <span className="text-emerald-400 font-bold">{selectedLink.status}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800/60">
                <span className="text-zinc-500">Usage Type</span>
                <span className="text-zinc-300">{selectedLink.usage_type} ({selectedLink.current_uses} / {selectedLink.max_uses})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800/60">
                <span className="text-zinc-500">Created At</span>
                <span className="text-zinc-300">{formatDate(selectedLink.created_at)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800/60">
                <span className="text-zinc-500">Expires At</span>
                <span className="text-zinc-300">{formatDate(selectedLink.expires_at)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800/60">
                <span className="text-zinc-500">Used At</span>
                <span className="text-zinc-300">{formatDate(selectedLink.used_at)}</span>
              </div>

              <div>
                <span className="text-zinc-500 block mb-1">Full Public URL:</span>
                <div className="p-3 bg-zinc-950 rounded-xl font-mono text-[11px] text-zinc-300 break-all border border-zinc-800 flex items-center justify-between gap-2">
                  <span>{`${window.location.origin}/redeem/${selectedLink.token}`}</span>
                  <button
                    onClick={() => handleCopyLink(selectedLink)}
                    className="p-1 rounded bg-zinc-800 text-zinc-300 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedLink(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
