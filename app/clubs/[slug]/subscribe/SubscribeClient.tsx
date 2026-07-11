"use client";

import React, { useState } from "react";
import { ShieldCheck, CreditCard, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSubscriptionAction } from "@/lib/actions";

interface SubscribeClientProps {
  clubName: string;
  clubLogoInitials: string;
  planName: string;
  price: number;
  billingCycle: string;
  clubSlug: string;
}

export default function SubscribeClient({
  clubName,
  clubLogoInitials,
  planName,
  price,
  billingCycle,
  clubSlug,
}: SubscribeClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"card" | "paypal">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const taxAmount = price * 0.20; // Example 20% VAT
  const totalAmount = price + taxAmount;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      const res = await createSubscriptionAction(clubSlug, price);
      if (!res.success) {
        setError(res.error || "Failed to create subscription.");
        setIsProcessing(false);
        return;
      }
      setIsProcessing(false);
      alert("Subscription activated successfully!");
      router.push(`/clubs/${clubSlug}`);
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred during subscription processing.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060b13] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">
            Become a Member
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            Securely subscribe to unlock {clubName}'s exclusive premium content.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* ── Left Column: Order Summary ── */}
            <div className="bg-gray-50 dark:bg-slate-800/50 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] font-bold text-xl shadow-sm">
                  {clubLogoInitials}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {clubName}
                  </h2>
                  <p className="text-sm font-medium text-[#2563EB]">
                    {planName}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  <span>Exclusive premium content access</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  <span>Direct interaction with the club</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  <span>Cancel anytime</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>{price.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400">
                  <span>VAT (20%)</span>
                  <span>{taxAmount.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-slate-700 pt-4 mt-4">
                  <span className="text-base font-bold text-gray-900 dark:text-white">Total due today</span>
                  <span className="text-2xl font-extrabold text-[#10B981]">
                    {totalAmount.toFixed(2)} <span className="text-sm font-medium text-gray-500">MAD/{billingCycle}</span>
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-slate-500 font-medium bg-gray-100 dark:bg-slate-800/50 py-3 rounded-lg border border-gray-200 dark:border-slate-700">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                Secure SSL Encrypted Transaction
              </div>
            </div>

            {/* ── Right Column: Payment Hub Selector ── */}
            <div className="p-8 lg:p-10">
              
              {/* Tab Switcher */}
              <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-xl mb-8">
                <button
                  onClick={() => setActiveTab("card")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    activeTab === "card"
                      ? "bg-white dark:bg-slate-700 text-[#2563EB] shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                      : "text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Credit/Debit Card
                </button>
                <button
                  onClick={() => setActiveTab("paypal")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    activeTab === "paypal"
                      ? "bg-white dark:bg-slate-700 text-[#2563EB] shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                      : "text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zM11.636 4.31H7.81L6.096 15.087h3.332c3.488 0 5.864-1.22 6.536-4.664.298-1.52.176-2.61-.433-3.3-.61-.69-1.745-1.015-3.895-1.015z" />
                  </svg>
                  PayPal
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleCheckout} className="space-y-6">
                
                {/* ── Stripe Card Selector Mockup ── */}
                {activeTab === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                        Card Information
                      </label>
                      <div className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-[#2563EB] focus-within:border-transparent transition-all">
                        {/* Placeholder for @stripe/react-stripe-js CardElement */}
                        <div className="h-6 flex items-center text-sm text-gray-400 select-none">
                          <Lock className="w-4 h-4 mr-2" />
                          <span>0000 0000 0000 0000</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-3 text-sm text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                          required={activeTab === "card"}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength={4}
                          className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-3 text-sm text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                          required={activeTab === "card"}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── PayPal Container Mockup ── */}
                {activeTab === "paypal" && (
                  <div className="py-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-4 text-center px-6">
                      Clicking below will securely redirect you to PayPal to authorize the transaction.
                    </p>
                    {/* Placeholder for window.paypal.Buttons() */}
                    <div className="w-full max-w-[250px] h-12 bg-[#FFC439] rounded-full flex items-center justify-center opacity-80 cursor-not-allowed">
                      <span className="font-bold text-[#003087] italic">PayPal</span>
                    </div>
                  </div>
                )}

                {/* Checkout Action Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB] disabled:opacity-70 disabled:cursor-not-allowed shadow-md transition-all duration-200"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing secure payment...
                    </>
                  ) : (
                    `Subscribe & Pay ${totalAmount.toFixed(2)} MAD`
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  By confirming, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
