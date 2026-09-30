import React from 'react';
import { Sparkles, UserCheck, MessageSquare, Zap } from 'lucide-react';

export const Features: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Select Subscription',
      description: 'Choose Adobe Creative Cloud (4 Months) or Canva Pro (1 Year) tailored to your workflow.',
    },
    {
      step: '02',
      title: 'Order via WhatsApp',
      description: 'Click to start a direct WhatsApp chat with our verification desk with zero checkout friction.',
    },
    {
      step: '03',
      title: 'Get Personal Link',
      description: 'We generate and deliver your private, single-use redemption link directly into your chat.',
    },
    {
      step: '04',
      title: 'Instant Activation',
      description: 'Open your link to automatically activate your genuine subscription on your own account.',
    },
  ];

  const highlights = [
    {
      icon: <UserCheck className="w-6 h-6 text-orange-400" />,
      title: 'No Profile Switching',
      description: 'Keep your own primary account. No shared logins, annoying password changes, or team switching.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      title: 'Full Generative AI Access',
      description: 'Unlimited access to FireFly, Generative Fill, Generative Expand, and Canva Magic Studio.',
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      title: '1TB Adobe Cloud Storage',
      description: 'Sync your Photoshop, Premiere Pro, and Illustrator projects directly to Adobe Creative Cloud.',
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-sky-400" />,
      title: 'Dedicated Human Support',
      description: 'Live WhatsApp help desk for fast onboarding, renewal guidance, and priority assistance.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* How it works */}
        <div id="how-it-works" className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-orange-400">
              Simple 4-Step Process
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
              How Redemption Works
            </h2>
            <p className="mt-4 text-zinc-400 text-base sm:text-lg">
              From WhatsApp chat to official license activation in less than 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="relative p-6 sm:p-7 rounded-3xl glass-card flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                      {item.step}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-orange-500/40 group-hover:bg-orange-400 transition" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Highlights */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-orange-400">
              Why Creators Choose FOXMEDIA
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
              Built for Designers, Editors & Studios
            </h2>
            <p className="mt-4 text-zinc-400 text-base sm:text-lg">
              Everything you need to produce top-tier content without enterprise costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl glass-card flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5 group-hover:border-orange-500/40 group-hover:scale-105 transition-all duration-300 shadow-md">
                    {item.icon}
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
