import React from 'react';
import { Sparkles, Clock, UserCheck, MessageSquare } from 'lucide-react';

export const Features: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Choose Your Plan',
      description: 'Select Adobe Pro Plus (4 Months) or Canva Pro (1 Year) tailored to your workflow.',
    },
    {
      step: '02',
      title: 'Order via WhatsApp',
      description: 'Click Buy via WhatsApp to confirm your plan directly with our team with zero checkout hassle.',
    },
    {
      step: '03',
      title: 'Receive Secure Link',
      description: 'We instantly send your cryptographically secure redemption link directly to your chat.',
    },
    {
      step: '04',
      title: 'One-Click Activation',
      description: 'Open your link, click "Redeem Now", and immediately enjoy your full creative suite.',
    },
  ];

  const highlights = [
    {
      icon: <UserCheck className="w-6 h-6 text-orange-400" />,
      title: 'No Profile Switching',
      description: 'Enjoy seamless access on your own primary account without disruptive profile switching.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      title: 'Full AI Generation Powers',
      description: 'Get thousands of monthly credits for FireFly, Generative Fill, and Canva Magic Studio.',
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-400" />,
      title: 'Guaranteed Validity',
      description: 'Transparent duration tracking with complete uptime and prompt renewal support.',
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-sky-400" />,
      title: '24/7 WhatsApp Assistance',
      description: 'Direct human support on WhatsApp whenever you need onboarding or quick help.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* How it works */}
        <div id="how-it-works" className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-orange-400">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              How Redemption Works
            </h2>
            <p className="mt-3 text-zinc-400 text-sm sm:text-base">
              From WhatsApp chat to full creative suite in less than 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition flex flex-col"
              >
                <div className="text-3xl font-black text-orange-500/30 mb-4">{item.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Value Highlights */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-orange-400">
              Why Creators Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Built for Modern Creators & Designers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 hover:border-orange-500/30 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
