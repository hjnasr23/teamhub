"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Sliders, Palette, Landmark, ShieldCheck, Upload } from "lucide-react";
import { updateClubBrandingAction } from "@/lib/club-admin-actions";
import { uploadClubAsset } from "@/lib/media-actions";
import { useRouter } from "next/navigation";

interface ClubSettingsClientProps {
  club: {
    id: string;
    slug: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    description: string | null;
  };
}

export default function ClubSettingsClient({ club }: ClubSettingsClientProps) {
  const [primaryColor, setPrimaryColor] = useState(club.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(club.secondaryColor);
  const [description, setDescription] = useState(club.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.target as HTMLFormElement;
      const logoFile = (form.elements.namedItem("logoFile") as HTMLInputElement).files?.[0];
      const coverFile = (form.elements.namedItem("coverFile") as HTMLInputElement).files?.[0];

      let logoUrl = undefined;
      let bannerUrl = undefined;

      if (logoFile) {
        const formData = new FormData();
        formData.append("file", logoFile);
        const res = await uploadClubAsset(formData, "logos");
        if (res.success) {
          logoUrl = res.mediaUrl;
        } else {
          alert("Logo upload failed: " + res.error);
          setIsSubmitting(false);
          return;
        }
      }

      if (coverFile) {
        const formData = new FormData();
        formData.append("file", coverFile);
        const res = await uploadClubAsset(formData, "banners");
        if (res.success) {
          bannerUrl = res.mediaUrl;
        } else {
          alert("Cover upload failed: " + res.error);
          setIsSubmitting(false);
          return;
        }
      }

      const res = await updateClubBrandingAction(club.id, {
        primaryColor,
        secondaryColor,
        logoUrl,
        bannerUrl,
        description,
      });

      if (res.success) {
        alert("Visual identity updated successfully!");
        router.refresh();
      } else {
        alert(res.error || "Failed to update branding settings");
      }
    } catch (err: any) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Club Hub Settings
        </h1>
        <p className="text-sm text-slate-400">
          Customize your fan portal branding, set billing thresholds, and update payout credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Branding & Theme Customizer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customizer Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 bg-slate-950/40">
            <h2 className="font-display text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Palette className="h-5 w-5 text-emerald-400" />
              Tenant Portal Branding
            </h2>

            <form onSubmit={handleSaveBranding} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-10 w-12 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs text-slate-300 font-mono font-semibold">{primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Secondary Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="h-10 w-12 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs text-slate-300 font-mono font-semibold">{secondaryColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Portal Header Crest (Logo)
                </label>
                <div className="flex items-center gap-4">
                  {club.logoUrl && (
                    <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-slate-800 border border-slate-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={club.logoUrl} alt="Club Crest Logo" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    name="logoFile"
                    accept="image/*"
                    className="text-slate-300 text-xs w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Portal Cover Image
                </label>
                <div className="flex items-center gap-4">
                  {club.bannerUrl && (
                    <div className="h-12 w-24 rounded-lg overflow-hidden shrink-0 bg-slate-800 border border-slate-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={club.bannerUrl} alt="Club Banner" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    name="coverFile"
                    accept="image/*"
                    className="text-slate-300 text-xs w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Portal Announcement Welcome Text
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Welcome message for your fans..."
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-850">
                <Button type="submit" disabled={isSubmitting} className="font-semibold">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar credentials panel */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 bg-slate-950/40">
            <h2 className="font-display text-base font-bold text-white mb-4 flex items-center gap-2">
              <Landmark className="h-4.5 w-4.5 text-indigo-400" />
              Stripe Accounts
            </h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Your fan subscriptions are processed and distributed to your bank account via Stripe Connect.
            </p>

            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mb-6 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white">Verification Complete</h4>
                <span className="text-[10px] text-emerald-400 block mt-1">
                  Transfers enabled. Funds deposit every 7 days.
                </span>
              </div>
            </div>

            <Button variant="secondary" size="sm" className="w-full text-xs font-semibold cursor-default">
              View Stripe Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
