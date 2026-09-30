import React from 'react';
import { Check, MessageCircle, Star, ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { getWhatsAppUrl, getProductWhatsAppMessage } from '../utils/whatsapp';
import type { Product, Settings } from '../types';

interface ProductsProps {
  products: Product[];
  settings: Settings;
}

export const Products: React.FC<ProductsProps> = ({ products, settings }) => {
  return (
    <section id="plans" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background spatial lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-orange-600/10 blur-[150px] pointer-events-none rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Subscriptions</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight">
            Transparent Pricing. Zero Hidden Fees.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
            Genuine digital licenses delivered with complete setup assistance. Order directly via WhatsApp for immediate activation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {products.map((product) => {
            const isAdobe = product.name.toLowerCase().includes('adobe');
            const message = getProductWhatsAppMessage(product.name, product.duration, product.price);
            const whatsappUrl = getWhatsAppUrl(settings.whatsapp_number, message);

            return (
              <div
                key={product.id}
                className={`relative flex flex-col rounded-3xl p-8 sm:p-10 transition-all duration-300 ${
                  isAdobe
                    ? 'glass-card-glow border-2 border-orange-500/50'
                    : 'glass-card hover:border-emerald-500/40'
                }`}
              >
                {/* Popular Badge for Adobe */}
                {isAdobe ? (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-orange-950/60 flex items-center gap-1.5 border border-amber-300/30">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>🔥 Most Popular Choice</span>
                  </div>
                ) : (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Best Value</span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg ${
                        isAdobe
                          ? 'text-orange-400 bg-orange-400/10 border border-orange-400/20'
                          : 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'
                      }`}
                    >
                      {product.duration} Access
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Official License
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-4 tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-2 min-h-[40px] leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Pricing Block */}
                <div className="mb-8 pb-6 border-b border-zinc-800/80 flex items-baseline gap-2">
                  <span className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-zinc-400 font-semibold">/ {product.duration}</span>
                </div>

                {/* Features List */}
                <div className="space-y-3.5 mb-10 flex-1">
                  <div className="text-xs uppercase tracking-wider font-bold text-zinc-300">
                    Included with this plan:
                  </div>
                  {product.features &&
                    product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isAdobe
                              ? 'bg-orange-500/10 border border-orange-500/30 text-orange-400'
                              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                </div>

                {/* Buy Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-center flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl ${
                    isAdobe
                      ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-950/50 hover:scale-[1.02] active:scale-[0.98] border border-orange-400/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/20'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Buy via WhatsApp</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
                </a>

                <p className="text-[11px] text-zinc-500 text-center mt-3">
                  Instant human confirmation • No waiting • Safe payment
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
