"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Loader2,
  XCircle,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import { createSubscriptionAction } from "@/lib/actions";

interface PayZoneSimulatorClientProps {
  clubName: string;
  clubSlug: string;
  planId: string;
  planName: string;
  price: number;
}

export default function PayZoneSimulatorClient({
  clubName,
  clubSlug,
  planId,
  planName,
  price,
}: PayZoneSimulatorClientProps) {
  const router = useRouter();

  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const tax = price * 0.20;
  const total = price + tax;

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    const limitedVal = rawVal.substring(0, 16);
    const formatted = limitedVal.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Format Expiry Date (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    const limitedVal = rawVal.substring(0, 4);
    if (limitedVal.length >= 3) {
      setExpiry(`${limitedVal.substring(0, 2)}/${limitedVal.substring(2)}`);
    } else {
      setExpiry(limitedVal);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    setCvv(rawVal.substring(0, 3));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setPaymentStatus("verifying");
    setErrorMsg(null);

    // Simulate 3D-Secure gateway delay (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      // Trigger the server action to write/update the subscription in PostgreSQL
      const res = await createSubscriptionAction(clubSlug, price);

      if (!res.success) {
        throw new Error(res.error || "Gateway verification failed.");
      }

      setPaymentStatus("success");
      
      // Delay slightly on success screen so user sees it, then redirect home
      setTimeout(() => {
        router.push(`/clubs/${clubSlug}`);
        router.refresh();
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Card authorization failed. Please check your credentials.");
      setPaymentStatus("error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 flex flex-col font-sans">
      
      {/* Header bar styled like real Moroccan payment gateway */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* PayZone Logo Branding */}
            <div className="bg-[#ea580c] text-white px-3.5 py-1.5 rounded-lg font-black tracking-widest text-sm flex items-center gap-1 shadow-sm">
              <span className="italic">PayZone</span>
              <span className="text-[10px] bg-white text-[#ea580c] px-1.5 py-0.2 rounded font-extrabold uppercase ml-1">
                Morocco
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
              Secure Checkout Engine
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase">Langue:</span>
            <select className="bg-slate-100 border border-slate-200 rounded text-xs px-2 py-1 font-semibold cursor-pointer">
              <option>Français (FR)</option>
              <option>English (EN)</option>
              <option>العربية (AR)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-4xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left column: payment form */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-md p-6 relative overflow-hidden">
          
          {/* Transition states */}
          {paymentStatus === "verifying" && (
            <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-8 text-center">
              <Loader2 className="w-12 h-12 text-[#ea580c] animate-spin mb-4" />
              <h3 className="text-lg font-extrabold text-slate-900">
                Traitement de la transaction...
              </h3>
              <p className="text-sm text-slate-500 mt-2 max-w-xs">
                Vérification du protocole 3D-Secure auprès de votre banque émettrice. Ne fermez pas cette page.
              </p>
            </div>
          )}

          {paymentStatus === "success" && (
            <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-9 h-9 text-emerald-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Paiement Accepté !
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Votre abonnement a été activé avec succès. Redirection vers TEAMHUB...
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
              Informations De Paiement
            </h2>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#ea580c] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
              <Lock className="w-3.5 h-3.5" />
              Connexion sécurisée SSL
            </div>
          </div>

          {paymentStatus === "error" && errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-left">
              <XCircle className="w-5 h-5 text-red-650 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-800">Erreur de paiement</h4>
                <p className="text-xs text-red-700 mt-1 font-medium">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Cardholder Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nom du porteur de carte
              </label>
              <input
                type="text"
                placeholder="JEAN DUPONT"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                className="w-full bg-[#f9fafb] border border-slate-200 hover:border-slate-350 focus:border-[#ea580c] rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
                required
              />
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Numéro de la carte
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full bg-[#f9fafb] border border-slate-200 hover:border-slate-350 focus:border-[#ea580c] rounded-xl pl-4 pr-12 py-3 text-sm font-mono font-semibold tracking-wider outline-none transition-all placeholder:text-slate-400"
                  required
                />
                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* Expiry & CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Date d&apos;expiration
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={handleExpiryChange}
                  className="w-full bg-[#f9fafb] border border-slate-200 hover:border-slate-350 focus:border-[#ea580c] rounded-xl px-4 py-3 text-sm font-semibold tracking-wider outline-none transition-all placeholder:text-slate-400 text-center"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 justify-center">
                  Code de sécurité (CVV)
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" title="3 chiffres au dos de la carte" />
                </label>
                <input
                  type="password"
                  placeholder="***"
                  value={cvv}
                  onChange={handleCvvChange}
                  className="w-full bg-[#f9fafb] border border-slate-200 hover:border-slate-350 focus:border-[#ea580c] rounded-xl px-4 py-3 text-sm font-semibold tracking-widest outline-none transition-all placeholder:text-slate-400 text-center"
                  required
                />
              </div>
            </div>

            {/* PayZone Actions */}
            <div className="pt-4 border-t border-slate-100 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => router.push(`/clubs/${clubSlug}/checkout?planId=${planId}`)}
                className="w-full sm:w-auto text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors py-2.5 px-4 text-center cursor-pointer"
              >
                Annuler et retourner au site
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#ea580c] hover:bg-[#d94e07] text-white font-bold text-sm py-3 px-8 rounded-xl shadow-md transition-all duration-150 active:scale-[0.99] cursor-pointer"
              >
                Confirmer le Paiement
              </button>
            </div>

          </form>
        </div>

        {/* Right column: Merchant info & amount */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">
              Détails de la commande
            </h2>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Marchand</span>
                <span className="text-sm font-extrabold text-slate-800">TEAMHUB Morocco</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Club de football</span>
                <span className="text-sm font-extrabold text-slate-800">{clubName}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Abonnement</span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 mt-1 inline-block">
                  {planName}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Montant HT</span>
                  <span>{price.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>TVA (20%)</span>
                  <span>{tax.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-3 mt-3">
                  <span className="text-xs font-bold text-slate-800">Montant Total</span>
                  <span className="text-lg font-black text-[#ea580c]">
                    {total.toFixed(2)} MAD
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Badges for Real Portal Vibe */}
          <div className="flex flex-wrap items-center justify-center gap-4 opacity-70 px-4">
            <div className="h-6 w-9 rounded bg-white flex items-center justify-center border border-slate-200 text-[9px] font-extrabold text-blue-900 italic">Visa</div>
            <div className="h-6 w-9 rounded bg-white flex items-center justify-center border border-slate-200 text-[8px] font-bold text-[#ea580c]">Master</div>
            <div className="h-6 w-9 bg-[#005c2a] rounded flex items-center justify-center border border-slate-200 text-[8px] font-bold text-white tracking-widest">CMI</div>
          </div>
        </div>

      </main>

      {/* Footer information */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <p>© 2026 PayZone Morocco. Tous droits réservés.</p>
        <p className="mt-1 text-[10px] text-slate-400">
          Ce site est protégé par les systèmes anti-fraude 3D-Secure, Verified by Visa, MasterCard Identity Check et le CMI.
        </p>
      </footer>
    </div>
  );
}
