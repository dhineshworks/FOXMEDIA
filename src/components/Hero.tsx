import React from 'react';
import { ArrowDown, MessageCircle, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';
import type { Settings } from '../types';

interface HeroProps {
  settings: Settings;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  const whatsappUrl = getWhatsAppUrl(
    settings.whatsapp_number,
    'Hi, I want to learn more about FOXMEDIA Adobe and Canva plans.'
  );

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Subtle background glow/spatial gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-600/15 via-rose-600/10 to-amber-500/10 blur-[120px] pointer-events-none rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300 text-xs font-medium mb-8 backdrop-blur-sm animate-fade-in shadow-lg shadow-orange-500/10">
          <img src="/logo.png" alt="FOXMEDIA" className="w-5 h-5 rounded-full object-cover" />
          <span>Official Digital Subscriptions & Instant Redemption</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Premium Creative Tools.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-rose-400">
            Simple Pricing.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Get powerful Adobe and Canva plans for your creative workflow.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <a
            href="#plans"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-950/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>View Plans</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-zinc-200 bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-700/80 hover:border-zinc-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Value Micro-Pillars */}
        <div className="mt-14 pt-8 border-t border-zinc-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
            <div className="text-xs">
              <span className="text-white font-medium block">Instant Delivery</span>
              <span className="text-zinc-400">Via WhatsApp & link</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="text-white font-medium block">100% Genuine</span>
              <span className="text-zinc-400">No profile switching</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-xs">
              <span className="text-white font-medium block">AI Enabled</span>
              <span className="text-zinc-400">FireFly + Magic Tools</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
            <MessageCircle className="w-4 h-4 text-sky-400 shrink-0" />
            <div className="text-xs">
              <span className="text-white font-medium block">Priority Support</span>
              <span className="text-zinc-400">{settings.support_hours || '10:30 AM – 8:30 PM'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
