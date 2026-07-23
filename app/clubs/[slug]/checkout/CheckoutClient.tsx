"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
  Award,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CheckoutClientProps {
  clubName: string;
  clubLogoInitials: string;
  clubSlug: string;
  initialPlanId: string;
}

interface PlanOption {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  badge?: string;
  icon: React.ComponentType<any>;
}

export default function CheckoutClient({
  clubName,
  clubLogoInitials,
  clubSlug,
  initialPlanId,
}: CheckoutClientProps) {
  const router = useRouter();
  
  // 1. Plan Configurations
  const plans: PlanOption[] = [
    {
      id: "basic",
      name: "Supporter Membership",
      price: 10,
      description: "Essential access to community announcements, public updates, and support.",
      icon: CheckCircle2,
      features: [
        "Access to public posts and media",
        "Official fan membership badge",
        "Read team clubhouse feed",
      ],
    },
    {
      id: "premium",
      name: "Pro Supporter Membership",
      price: 50,
      description: "Unlock full training streams, tactical breakdowns, and behind-the-scenes diaries.",
      icon: Zap,
      badge: "Most Popular",
      features: [
        "Unlock all premium locked posts",
        "High-definition training streams",
        "Behind-the-scenes kit leaks",
        "Everything in Supporter tier",
      ],
    },
    {
      id: "vip",
      name: "Gold VIP Access",
      price: 150,
      description: "The ultimate inner-circle access. Vote on fan polls, attend private AMAs, and get merch discounts.",
      icon: Award,
      badge: "Best Value",
      features: [
        "Exclusive VIP Gold Badge",
        "Access to private player Q&As",
        "Voting rights on club fan polls",
        "15% discount on team merchandise",
        "Everything in Pro Supporter tier",
      ],
    },
  ];

  // 2. Component States
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    plans.some((p) => p.id === initialPlanId) ? initialPlanId : "premium"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[1];
  
  // Price Calculations (20% VAT included for local Moroccan compliance)
  const basePrice = selectedPlan.price;
  const taxAmount = basePrice * 0.20;
  const totalAmount = basePrice + taxAmount;

  // 3. Initiate PayZone Payment Redirection Flow
  const handlePayZoneCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/checkout/payzone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clubSlug,
          planId: selectedPlan.id,
          price: selectedPlan.price,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Failed to initialize PayZone transaction.");
      }

      // Smooth redirection to simulated portal URL returned by the endpoint
      router.push(resData.redirectUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during payment setup.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060b13] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-250">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-full max-w-5xl mb-4">
            <Link
              href={`/clubs/${clubSlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Clubhouse
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight text-center">
            Secure Digital Membership Checkout
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 text-center max-w-lg">
            Back your colors. Subscribe to <strong className="text-slate-800 dark:text-white">{clubName}</strong> and unlock exclusive club streams and timeline content.
          </p>
        </div>

        {error && (
          <div className="max-w-5xl mx-auto mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          
          {/* ══════════ LEFT COLUMN: PLAN SELECTOR ══════════ */}
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-5 w-1 bg-[#2563EB] rounded-full" />
              1. Choose Membership Tier
            </h2>

            <div className="space-y-4">
              {plans.map((plan) => {
                const IconComponent = plan.icon;
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => !isProcessing && setSelectedPlanId(plan.id)}
                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#2563EB] bg-[#2563EB]/5 shadow-md scale-[1.01]"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                    } ${isProcessing ? "opacity-60 pointer-events-none" : ""}`}
                  >
                    {plan.badge && (
                      <span className="absolute top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2563EB] text-white">
                        {plan.badge}
                      </span>
                    )}

                    <div className="flex gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? "bg-[#2563EB] text-white" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      
                      <div className="space-y-1 pr-16">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {plan.description}
                        </p>
                        
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-lg font-extrabold text-[#2563EB]">
                            {plan.price} MAD
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            / month
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ══════════ RIGHT COLUMN: ORDER SUMMARY & PAYMENT ══════════ */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Order Summary Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Order Summary
                </h3>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Product Crest Row */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] font-bold text-lg shadow-sm shrink-0">
                    {clubLogoInitials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {clubName}
                    </h4>
                    <p className="text-xs font-semibold text-[#2563EB]">
                      {selectedPlan.name}
                    </p>
                  </div>
                </div>

                {/* Billing Details */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Base Amount</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{basePrice.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>VAT (20%)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{taxAmount.toFixed(2)} MAD</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Total due today</span>
                    <div className="text-right">
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-450 block">
                        {totalAmount.toFixed(2)} MAD
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">
                        Billed monthly
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secure Seal */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-semibold bg-slate-50 dark:bg-slate-850/50 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  SSL Secured & Encrypted Gateway
                </div>
              </div>
            </div>

            {/* PayZone Card Selection & Pay Button */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="h-4 w-1 bg-[#2563EB] rounded-full" />
                2. Card Payment Option
              </h2>

              <form onSubmit={handlePayZoneCheckout} className="space-y-4">
                
                {/* Carte Bancaire Card Options Container */}
                <div className="border-2 border-[#2563EB] bg-[#2563EB]/5 p-4 rounded-2xl shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-[#2563EB]" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Carte Bancaire (Visa, MasterCard, CMI)
                      </span>
                    </div>
                    <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
                  </div>
                  
                  {/* Card logos badges */}
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-auto">
                      Accepted cards:
                    </span>
                    
                    {/* Visa logo placeholder */}
                    <div className="h-4 w-7 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200/50 dark:border-slate-800/50 px-1">
                      <span className="font-extrabold text-[8px] text-blue-800 italic tracking-tight">Visa</span>
                    </div>
                    {/* Mastercard logo placeholder */}
                    <div className="h-4 w-7 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200/50 dark:border-slate-800/50 px-1 flex-col gap-[1px]">
                      <div className="flex gap-[1px]">
                        <span className="font-bold text-[7px] text-red-650 tracking-tighter">MC</span>
                      </div>
                    </div>
                    {/* CMI logo placeholder */}
                    <div className="h-4 w-7 rounded bg-[#005c2a] flex items-center justify-center border border-[#005c2a] px-1">
                      <span className="font-black text-[7px] text-white tracking-widest">CMI</span>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed pl-1">
                    Moroccan secure gateway integration. Transaction fully encrypted by PayZone Morocco protocol.
                  </p>
                </div>

                {/* Royal Blue Pay Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB] disabled:opacity-75 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.99] cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redirecting to PayZone Morocco...
                    </>
                  ) : (
                    `Pay ${totalAmount.toFixed(2)} MAD / Payer`
                  )}
                </button>

                <p className="text-center text-[10px] text-slate-400">
                  By clicking payer, you authorize PayZone to handle this transaction.
                </p>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
