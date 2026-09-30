import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the Adobe Pro Plus 4-Month plan work?',
      a: 'After purchasing via WhatsApp, you receive a private redemption link. Opening your link immediately activates your license and redirects you to the official Adobe portal with 4 months of full Creative Cloud access, 4,000 monthly AI credits, 1TB cloud storage, and FireFly generation capabilities.',
    },
    {
      q: 'Will I have to switch profiles constantly?',
      a: 'No! Our subscriptions are activated directly on your personal primary account with zero profile switching problems so you can work seamlessly without interruptions.',
    },
    {
      q: 'How do I activate the Canva Pro 1-Year plan?',
      a: 'We provide an official direct upgrade link for your existing Canva email. Once activated, your account is immediately unlocked with 100M+ assets, instant background remover, brand kits, and all AI Magic Studio features.',
    },
    {
      q: 'How does payment and delivery work?',
      a: 'To keep pricing minimal and transparent, orders are processed directly over WhatsApp with instant UPI / payment options and immediate link issuance with no waiting.',
    },
    {
      q: 'Can redemption links be shared or reused?',
      a: 'Single-use redemption links can only be redeemed once. Once claimed, the link status switches to USED in our database, strictly preventing reuse and protecting your account.',
    },
    {
      q: 'What if I need help or have trouble redeeming?',
      a: 'Our WhatsApp support desk is active daily from 10:30 AM to 8:30 PM to guide you step-by-step through any setup or questions.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-orange-400">
            Got Questions?
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-zinc-400 text-base sm:text-lg">
            Everything you need to know about our plans, links, and activation.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-zinc-900/80 border border-orange-500/40 shadow-lg shadow-orange-950/20'
                    : 'bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-white font-semibold transition"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-heading tracking-tight">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? 'bg-orange-500/10 text-orange-400' : 'bg-zinc-800/60 text-zinc-400'
                  }`}>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-orange-400' : ''
                      }`}
                    />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-zinc-300 leading-relaxed border-t border-zinc-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
