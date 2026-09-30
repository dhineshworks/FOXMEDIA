import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Menu, X, KeyRound } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';
import type { Settings } from '../types';

interface NavbarProps {
  settings: Settings;
}

export const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isCustomerPage = !location.pathname.startsWith('/admin');
  const whatsappUrl = getWhatsAppUrl(
    settings.whatsapp_number,
    'Hi, I have a question about FOXMEDIA creative plans.'
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-orange-500/25 border border-orange-500/30">
            <img 
              src="/logo.png" 
              alt="FOXMEDIA" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-xl tracking-tight text-white flex items-center gap-1.5 leading-none">
              {settings.business_name || 'FOXMEDIA'}
              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
                PRO
              </span>
            </span>
            <span className="text-[11px] font-medium text-zinc-400 mt-1">Creative Cloud & Canva</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {isCustomerPage && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-300">
            <a href="#plans" className="hover:text-orange-400 transition-colors">
              Plans & Pricing
            </a>
            <a href="#features" className="hover:text-orange-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-orange-400 transition-colors">
              How It Works
            </a>
            <a href="#faq" className="hover:text-orange-400 transition-colors">
              FAQ
            </a>
            <Link
              to="/redeem"
              className="text-orange-400 hover:text-orange-300 flex items-center gap-1.5 transition-colors font-bold px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Redeem Link
            </Link>
          </nav>
        )}

        {/* CTA Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/admin"
            className="text-xs font-semibold text-zinc-400 hover:text-white px-3.5 py-2 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 transition"
          >
            Admin Portal
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Us</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl px-5 py-5 space-y-3.5 animate-in slide-in-from-top-2 duration-200">
          <a
            href="#plans"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-zinc-200 hover:text-orange-400"
          >
            Plans & Pricing
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-zinc-200 hover:text-orange-400"
          >
            Features & Benefits
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-zinc-200 hover:text-orange-400"
          >
            How It Works
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-zinc-200 hover:text-orange-400"
          >
            FAQ
          </a>
          <Link
            to="/redeem"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-bold text-orange-400"
          >
            <KeyRound className="w-4 h-4" />
            Redeem License Link
          </Link>
          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-sm text-center flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl border border-zinc-800 text-zinc-400 text-xs font-semibold text-center hover:text-white"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
