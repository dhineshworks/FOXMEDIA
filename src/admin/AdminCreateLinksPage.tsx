import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Copy, 
  Download, 
  Check, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import { productService } from '../services/productService';
import { adminService } from '../services/adminService';
import { exportLinksToCSV } from '../utils/csvExporter';
import type { Product, UsageType } from '../types';


export const AdminCreateLinksPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [prefix, setPrefix] = useState('SEP30');
  const [expiration, setExpiration] = useState('none');
  const [usageType, setUsageType] = useState<UsageType>('SINGLE');
  const [maxUses, setMaxUses] = useState(1);
  const [quantity, setQuantity] = useState(1);

  // Post-generation results
  const [createdSummary, setCreatedSummary] = useState<{
    count: number;
    prefix: string;
    productName: string;
  } | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const prods = await productService.getAllProducts();
        setProducts(prods);
        if (prods.length > 0) {
          setSelectedProductId(prods[0].id);
        }
      } catch (e) {
        console.error('Failed to load products', e);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleQuantitySelect = (q: number) => {
    setQuantity(q);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!selectedProductId) {
      setErrorMessage('Please select a product plan.');
      return;
    }
    if (quantity < 1 || quantity > 500) {
      setErrorMessage('Quantity must be between 1 and 500.');
      return;
    }

    setCreating(true);
    try {
      const res = await adminService.createLinks({
        productId: selectedProductId,
        prefix: prefix.trim() || 'customer',
        expiration,
        usageType,
        maxUses: usageType === 'MULTIPLE' ? maxUses : 1,
        quantity,
      });

      if (res.success) {
        const prod = products.find(p => p.id === selectedProductId);
        setCreatedSummary({
          count: res.createdCount,
          prefix: prefix.trim(),
          productName: prod?.name || 'Adobe Pro Plus',
        });
      } else {
        setErrorMessage(res.error || 'Failed to create redemption links.');
      }
    } catch {
      setErrorMessage('Unexpected failure during link generation.');
    } finally {
      setCreating(false);
    }
  };

  const handleDownloadLatestCSV = async () => {
    const allLinks = await adminService.getLinks();
    // take the most recent ones matching the quantity
    const targetLinks = allLinks.slice(0, createdSummary?.count || 1);
    exportLinksToCSV(targetLinks, window.location.origin);
  };

  const handleCopyLatestLinks = async () => {
    const allLinks = await adminService.getLinks();
    const targetLinks = allLinks.slice(0, createdSummary?.count || 1);
    const text = targetLinks
      .map(l => `${l.custom_name}: ${window.location.origin}/redeem/${l.token}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin mb-3" />
        <p className="text-zinc-400 text-xs">Loading product catalogs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/links')}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Generate Redemption Links</h1>
          <p className="text-xs text-zinc-400">
            Create single or bulk cryptographically secure tokens for Adobe and Canva subscriptions.
          </p>
        </div>
      </div>

      {/* Success Modal / State */}
      {createdSummary ? (
        <div className="rounded-3xl bg-zinc-900/90 border border-emerald-500/30 p-8 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Successfully Generated {createdSummary.count} {createdSummary.count === 1 ? 'Link' : 'Links'}!
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Prefix: <span className="font-mono text-orange-400">{createdSummary.prefix}</span> • Product: <span className="text-white font-medium">{createdSummary.productName}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 text-left text-xs space-y-2">
            <div className="flex justify-between text-zinc-400">
              <span>Naming pattern:</span>
              <span className="font-mono text-zinc-200">{createdSummary.prefix}-001 ... {createdSummary.prefix}-{String(createdSummary.count).padStart(3, '0')}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Security token:</span>
              <span className="text-emerald-400 font-medium">Unique cryptographically secure random token per link</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Status:</span>
              <span className="text-emerald-400 font-bold">ACTIVE (Ready for customer redemption)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopyLatestLinks}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 transition"
            >
              {copiedSuccess ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSuccess ? 'All Links Copied!' : 'Copy All Links'}</span>
            </button>

            <button
              onClick={handleDownloadLatestCSV}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV File</span>
            </button>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                setCreatedSummary(null);
                setQuantity(1);
              }}
              className="text-orange-400 hover:text-orange-300 font-medium"
            >
              + Generate More Links
            </button>

            <button
              onClick={() => navigate('/admin/links')}
              className="text-zinc-400 hover:text-white"
            >
              Go to Links Table →
            </button>
          </div>
        </div>
      ) : (
        /* Creation Form */
        <form onSubmit={handleSubmit} className="rounded-3xl bg-zinc-900/70 border border-zinc-800 p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Product Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Select Product Plan *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map(p => {
                const isSelected = selectedProductId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-orange-500/10 border-orange-500 text-white'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{p.name}</span>
                      <span className="text-xs font-semibold text-orange-400">₹{p.price}</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 mt-1 block">{p.duration} duration</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Name / Prefix */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Custom Name / Batch Prefix *
            </label>
            <input
              type="text"
              required
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="e.g. SEP30, customer, john, batch-001"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:outline-none focus:border-orange-500 font-mono"
            />
            <p className="text-[11px] text-zinc-400 mt-1.5">
              For bulk generation, sequential numbers will be appended (e.g. <span className="font-mono text-zinc-300">{prefix || 'link'}-001</span> to <span className="font-mono text-zinc-300">{prefix || 'link'}-{String(quantity).padStart(3, '0')}</span>).
            </p>
          </div>

          {/* Quantity Preset & Custom Input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Quantity to Generate *
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[1, 10, 50, 100].map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleQuantitySelect(q)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    quantity === q
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-950/40'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {q} {q === 1 ? 'Link' : 'Links'}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400">Custom Count:</span>
              <input
                type="number"
                min="1"
                max="500"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs font-bold text-center"
              />
            </div>
          </div>

          {/* Expiration Settings */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Expiration Duration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'No Expiration', val: 'none' },
                { label: '1 Hour', val: '1h' },
                { label: '6 Hours', val: '6h' },
                { label: '12 Hours', val: '12h' },
                { label: '1 Day', val: '1d' },
                { label: '3 Days', val: '3d' },
                { label: '7 Days', val: '7d' },
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setExpiration(opt.val)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition border text-left flex items-center justify-between ${
                    expiration === opt.val
                      ? 'bg-zinc-800 border-orange-500 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  {expiration === opt.val && <Check className="w-3 h-3 text-orange-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Usage Type */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Usage Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setUsageType('SINGLE')}
                className={`cursor-pointer p-4 rounded-2xl border transition ${
                  usageType === 'SINGLE'
                    ? 'bg-zinc-800 border-orange-500 text-white'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">Single Use</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Default</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Link becomes USED immediately upon first redemption.
                </p>
              </div>

              <div
                onClick={() => setUsageType('MULTIPLE')}
                className={`cursor-pointer p-4 rounded-2xl border transition ${
                  usageType === 'MULTIPLE'
                    ? 'bg-zinc-800 border-orange-500 text-white'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">Multiple Use</span>
                  <span className="text-[10px] uppercase font-bold text-purple-400">Multi</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Multiple redemptions allowed up to specified max uses limit.
                </p>
              </div>
            </div>

            {usageType === 'MULTIPLE' && (
              <div className="mt-3 p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-white block">Maximum Allowed Redemptions:</span>
                  <span className="text-[11px] text-zinc-400">Status changes to LIMIT_REACHED when count is met.</span>
                </div>
                <input
                  type="number"
                  min="2"
                  max="1000"
                  value={maxUses}
                  onChange={(e) => setMaxUses(Math.max(2, parseInt(e.target.value) || 2))}
                  className="w-20 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs font-bold text-center"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/links')}
              className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-950/40 transition flex items-center gap-2 disabled:opacity-50"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating {quantity} {quantity === 1 ? 'Token' : 'Tokens'}...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate {quantity} {quantity === 1 ? 'Link' : 'Links'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
