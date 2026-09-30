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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden transition-transform group-hover:scale-105 shadow-md shadow-orange-500/20">
            <img 
              src="/logo.png" 
              alt="FOXMEDIA" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              {settings.business_name || 'FOXMEDIA'}
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                PRO
              </span>
            </span>
            <span className="text-[10px] text-zinc-400 -mt-1">Adobe & Canva Plans</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {isCustomerPage && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <a href="#plans" className="hover:text-white transition-colors">
              Plans & Pricing
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <Link
              to="/redeem/demo"
              className="text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
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
            className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition"
          >
            Admin Portal
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat WhatsApp</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 py-4 space-y-3">
          <a
            href="#plans"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-zinc-300 hover:text-white"
          >
            Plans & Pricing
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-zinc-300 hover:text-white"
          >
            Features & Benefits
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-zinc-300 hover:text-white"
          >
            How It Works
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-zinc-300 hover:text-white"
          >
            FAQ
          </a>
          <Link
            to="/redeem/demo"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-medium text-orange-400"
          >
            <KeyRound className="w-4 h-4" />
            Redeem License Link
          </Link>
          <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 text-white font-medium text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded-lg border border-zinc-800 text-xs text-zinc-400"
            >
              Admin Portal Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
