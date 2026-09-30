import React from 'react';
import { Check, MessageCircle, Star, ShieldCheck } from 'lucide-react';
import { getWhatsAppUrl, getProductWhatsAppMessage } from '../utils/whatsapp';
import type { Product, Settings } from '../types';

interface ProductsProps {
  products: Product[];
  settings: Settings;
}

export const Products: React.FC<ProductsProps> = ({ products, settings }) => {
  return (
    <section id="plans" className="py-20 bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-orange-400 mb-3">
            Choose Your Subscription
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transparent Pricing. Zero Hidden Fees.
          </p>
          <p className="mt-4 text-base text-zinc-400">
            Official licenses and direct redemption links. Purchase easily via WhatsApp with instant customer assistance.
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
                className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 ${
                  isAdobe
                    ? 'bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-orange-500/40 shadow-2xl shadow-orange-950/20 hover:border-orange-500/70 hover:scale-[1.01]'
                    : 'bg-zinc-900/60 border border-zinc-800 shadow-xl hover:border-zinc-700 hover:scale-[1.01]'
                }`}
              >
                {/* Popular Badge for Adobe */}
                {isAdobe && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-orange-400 px-2.5 py-1 rounded-lg bg-orange-400/10 border border-orange-400/20">
                      {product.duration}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Verified License
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mt-4">{product.name}</h3>
                  <p className="text-sm text-zinc-400 mt-1 min-h-[40px]">{product.description}</p>
                </div>

                {/* Pricing */}
                <div className="mb-8 pb-6 border-b border-zinc-800 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-zinc-400 font-medium">/ {product.duration}</span>
                </div>

                {/* Features List */}
                <div className="space-y-3.5 mb-8 flex-1">
                  <div className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
                    Included with this plan:
                  </div>
                  {product.features && product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Buy Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 px-6 rounded-xl font-bold text-center flex items-center justify-center gap-2.5 transition-all duration-200 ${
                    isAdobe
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-950/40 hover:scale-[1.01]'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/30 hover:scale-[1.01]'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Buy via WhatsApp</span>
                </a>

                <p className="text-center text-[11px] text-zinc-400 mt-3">
                  Instant activation link delivered via WhatsApp • Safe & verified
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
