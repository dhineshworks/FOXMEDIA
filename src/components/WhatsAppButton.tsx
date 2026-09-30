import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';

interface WhatsAppButtonProps {
  phoneNumber: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber }) => {
  const whatsappUrl = getWhatsAppUrl(
    phoneNumber,
    'Hi! I would like to get an Adobe or Canva subscription.'
  );

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-950/60 transition-all duration-300 hover:scale-105 active:scale-95 group border border-emerald-400/30"
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="text-xs font-semibold tracking-wide hidden sm:inline-block">
        WhatsApp Support
      </span>
    </a>
  );
};
