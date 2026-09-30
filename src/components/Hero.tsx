import React from 'react';
import { ArrowDown, MessageCircle, ShieldCheck, Zap, CheckCircle2, Sparkles } from 'lucide-react';
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
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Dynamic Spatial Ambient Lighting Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-orange-600/20 via-amber-500/15 to-rose-600/10 blur-[140px] pointer-events-none rounded-full -z-10 animate-ambient-glow" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-orange-500/10 blur-[120px] pointer-events-none rounded-full -z-10" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-rose-500/10 blur-[130px] pointer-events-none rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Floating Trust Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-orange-500/30 bg-zinc-900/80 text-orange-300 text-xs font-semibold mb-8 backdrop-blur-md shadow-lg shadow-orange-950/20 hover:border-orange-500/50 transition">
          <div className="w-5 h-5 rounded-full overflow-hidden shadow-sm">
            <img src="/logo.png" alt="FOXMEDIA" className="w-full h-full object-cover" />
          </div>
          <span className="text-zinc-200">Official Creative Cloud Subscriptions</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold">Instant Delivery</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
          Premium Creative Tools.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-rose-400">
            Unbeatable Pricing.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-7 text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Get official <strong className="text-white font-semibold">Adobe Creative Cloud</strong> and <strong className="text-white font-semibold">Canva Pro</strong> licenses on your personal account. Zero profile switching issues.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
          <a
            href="#plans"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-950/50 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] border border-orange-400/30"
          >
            <span>Explore Plans</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-zinc-200 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-500 shadow-lg shadow-black/40 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] backdrop-blur-md"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Weightless Glassmorphism Live Highlights Banner */}
        <div className="mt-12 max-w-3xl mx-auto p-4 rounded-2xl glass-card flex flex-wrap items-center justify-around gap-4 text-xs font-semibold text-zinc-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>4,000 Monthly FireFly AI Credits</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-700" />
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>1TB Fast Cloud Storage</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-700" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Personal Account Linked</span>
          </div>
        </div>

        {/* Value Micro-Pillars */}
        <div className="mt-14 pt-8 border-t border-zinc-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm hover:border-orange-500/30 transition">
            <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" />
            <div className="text-xs">
              <span className="text-white font-semibold block text-sm">Instant Delivery</span>
              <span className="text-zinc-400">Direct WhatsApp checkout</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm hover:border-emerald-500/30 transition">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="text-white font-semibold block text-sm">100% Genuine</span>
              <span className="text-zinc-400">No profile switching</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm hover:border-amber-500/30 transition">
            <Zap className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <span className="text-white font-semibold block text-sm">AI Generative</span>
              <span className="text-zinc-400">FireFly + Magic Studio</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm hover:border-sky-500/30 transition">
            <MessageCircle className="w-5 h-5 text-sky-400 shrink-0" />
            <div className="text-xs">
              <span className="text-white font-semibold block text-sm">Human Support</span>
              <span className="text-zinc-400">{settings.support_hours || '10:30 AM – 8:30 PM'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
