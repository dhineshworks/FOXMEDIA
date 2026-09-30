import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the Adobe Pro Plus 4-Month plan work?',
      a: 'After purchasing via WhatsApp, you receive a direct redemption link. When you click "Redeem Now", your Adobe Creative Cloud access is activated with 4 months of full access, 4000 monthly AI credits, 1TB cloud storage, and FireFly generation capabilities.',
    },
    {
      q: 'Will I have to switch profiles constantly?',
      a: 'No! Our plans are configured without cumbersome profile switching problems so you can work seamlessly without interruptions.',
    },
    {
      q: 'How do I activate the Canva Pro 1-Year plan?',
      a: 'We provide an official invite or redemption link for your existing Canva email. Once redeemed, your account is immediately upgraded with 100M+ assets, background remover, and all premium brand kit tools.',
    },
    {
      q: 'How does payment and delivery work?',
      a: 'To keep pricing minimal and transparent, orders are processed directly over WhatsApp with instant UPI / payment options and immediate link issuance with no waiting.',
    },
    {
      q: 'Can redemption links be shared or reused?',
      a: 'Single-use redemption links can only be redeemed once. Once redeemed, the status immediately switches to USED. If you need batch subscriptions for your agency or team, our admin portal provides bulk links.',
    },
    {
      q: 'What if I need help or have trouble redeeming?',
      a: 'Our WhatsApp support team is active daily from 10:30 AM to 8:30 PM to guide you step-by-step through any setup or questions.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-widest font-semibold text-orange-400">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-zinc-400 text-sm">
            Everything you need to know about our plans, links, and activation.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-zinc-800 rounded-2xl bg-zinc-900/30 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-white font-medium hover:text-orange-300 transition"
                  aria-expanded={isOpen}
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-orange-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/50">
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
