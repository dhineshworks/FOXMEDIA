import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';
import type { Settings } from '../types';

interface FooterProps {
  settings: Settings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const whatsappUrl = getWhatsAppUrl(
    settings.whatsapp_number,
    'Hi, I have a question about FOXMEDIA plans.'
  );

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-12 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-md shadow-orange-500/20">
                <img 
                  src="/logo.png" 
                  alt="FOXMEDIA" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                {settings.business_name || 'FOXMEDIA'}
              </span>
            </Link>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-md leading-relaxed">
              Premium digital tool subscriptions for designers, video editors, and agencies. 
              Enjoy official Adobe Creative Cloud and Canva Pro licenses with instant activation.
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                Support: {settings.support_hours || '10:30 AM – 8:30 PM'}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Delivery
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-wider font-semibold mb-4">
              Products
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#plans" className="hover:text-white transition">
                  Adobe Pro Plus (4 Month)
                </a>
              </li>
              <li>
                <a href="#plans" className="hover:text-white transition">
                  Canva Pro (1 Year)
                </a>
              </li>
              <li>
                <Link to="/redeem/demo" className="text-orange-400 hover:text-orange-300 transition">
                  Redeem License Key
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Admin */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-wider font-semibold mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  +91 {settings.whatsapp_number}
                </a>
              </li>
              <li className="pt-3 border-t border-zinc-900">
                <Link
                  to="/admin"
                  className="text-xs text-zinc-400 hover:text-zinc-200 transition"
                >
                  Admin Portal Login →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Legal */}
        <div className="pt-8 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} {settings.business_name || 'FOXMEDIA'}. All rights reserved.</p>
          <p className="text-center sm:text-right text-[11px] text-zinc-400 max-w-xl">
            Disclaimer: All product names, logos, and brands are property of their respective owners (Adobe Inc., Canva Pty Ltd). 
            FOXMEDIA is an independent subscription provider.
          </p>
        </div>
      </div>
    </footer>
  );
};
