"use client";

import { use } from "react";
import { Trophy, Check, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ clubSlug: string }>;
}

export default function FanSubscribePage({ params }: PageProps) {
  const { clubSlug } = use(params);
  
  const clubDisplayName = clubSlug
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

  const tiers = [
    {
      name: "Bronze Fan",
      price: "$4.99",
      perks: ["Access to matchday announcement feeds", "Vote in official club player-of-the-month polls", "Basic clubhouse badges"],
      color: "border-slate-800",
    },
    {
      name: "Silver Star",
      price: "$14.99",
      perks: ["All Bronze Fan benefits", "Read captain's weekly training logs & diaries", "Listen to premium podcasts with signings", "Standard badge upgrades"],
      color: "border-indigo-500 bg-indigo-950/5",
      popular: true,
    },
    {
      name: "Gold VIP",
      price: "$24.99",
      perks: ["All Silver Star benefits", "Watch behind-the-scenes celebrations & interviews", "Live stream replays and press conference feeds", "Early VIP merchandise drops access", "Gold profile badge"],
      color: "border-amber-500 bg-amber-500/5",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Support {clubDisplayName} & Unlock VIP Access
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Subscribe to a recurring tier directly backing our players, staff, and youth academy.
        </p>
      </div>

      {/* Split layout: Left (Tiers selection), Right (Mock payment gateway) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tiers List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((t, idx) => (
              <div
                key={idx}
                className={`glass-panel border p-5 rounded-2xl flex flex-col justify-between relative ${t.color} cursor-pointer hover:scale-[1.01] transition-transform`}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-bold text-[9px] uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-500 shadow-md">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="font-display text-sm font-extrabold text-white mb-2">{t.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold text-white">{t.price}</span>
                    <span className="text-[10px] text-slate-500">/mo</span>
                  </div>

                  <ul className="space-y-2 text-[10px] text-slate-400">
                    {t.perks.map((p, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5 leading-normal">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Credit Card payment checkout */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-400" />
              Direct Checkout
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Payments are fully secured and processed via Stripe. Cancel at any time.
            </p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">
                  Selected Tier
                </label>
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs font-semibold text-white flex justify-between items-center">
                  <span>Silver Star membership</span>
                  <span className="text-emerald-400">$14.99/mo</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-3 py-2 bg-slate-900/40 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-3 pr-9 py-2 bg-slate-900/40 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full px-3 py-2 bg-slate-900/40 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">
                    CVC Code
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 bg-slate-900/40 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <Button type="button" className="w-full font-semibold mt-4 gap-1.5 shadow-md">
                <Lock className="h-3.5 w-3.5" />
                Pay $14.99 / month
              </Button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
