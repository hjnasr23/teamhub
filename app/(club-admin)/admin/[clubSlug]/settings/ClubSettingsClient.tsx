"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Sliders, Palette, Landmark, ShieldCheck, Upload } from "lucide-react";
import { uploadClubLogoAction } from "@/lib/club-admin-actions";
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
    city: string;
    country?: string | null;
    visibility?: string | null;
  };
}

export default function ClubSettingsClient({ club }: ClubSettingsClientProps) {
  const [bgType, setBgType] = useState<"solid" | "gradient">(
    club.primaryColor === club.secondaryColor ? "solid" : "gradient"
  );
  const [primaryColor, setPrimaryColor] = useState(club.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(club.secondaryColor);
  const [description, setDescription] = useState(club.description || "");
  const [city, setCity] = useState(club.city || "");
  const [country, setCountry] = useState((club as any).country || "Morocco");
  const [logoUrlInput, setLogoUrlInput] = useState(club.logoUrl || "");
  const [visibility, setVisibility] = useState(club.visibility || "PRIVATE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      formData.append("primaryColor", primaryColor);
      formData.append("secondaryColor", bgType === "solid" ? primaryColor : secondaryColor);
      formData.append("description", description);
      formData.append("city", city);
      formData.append("country", country);
      formData.append("logoUrl", logoUrlInput);
      formData.append("visibility", visibility);

      const res = await uploadClubLogoAction(club.slug, formData);

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
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
          Club Hub Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1">
          Customize your fan portal branding, set billing thresholds, and update payout credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Branding & Theme Customizer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customizer Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Palette className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              Tenant Portal Branding
            </h2>

            <form onSubmit={handleSaveBranding} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Background Type
                </label>
                <div className="flex gap-6 mt-1">
                  <label className="inline-flex items-center text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="bgType"
                      value="solid"
                      checked={bgType === "solid"}
                      onChange={() => {
                        setBgType("solid");
                        setSecondaryColor(primaryColor);
                      }}
                      className="mr-2 h-4 w-4 border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    Solid (Single Color)
                  </label>
                  <label className="inline-flex items-center text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="bgType"
                      value="gradient"
                      checked={bgType === "gradient"}
                      onChange={() => setBgType("gradient")}
                      className="mr-2 h-4 w-4 border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    Gradient (Two Colors)
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => {
                        setPrimaryColor(e.target.value);
                        if (bgType === "solid") {
                          setSecondaryColor(e.target.value);
                        }
                      }}
                      className="h-10 w-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-mono font-semibold">{primaryColor}</span>
                  </div>
                </div>

                {bgType === "gradient" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Secondary Accent Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="h-10 w-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-mono font-semibold">{secondaryColor}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Casablanca, Rabat"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="Morocco">Morocco</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ivory Coast">Ivory Coast</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Ghana">Ghana</option>
                    <option value="South Africa">South Africa</option>
                    <option value="DR Congo">DR Congo</option>
                    <option value="Mali">Mali</option>
                    <option value="Angola">Angola</option>
                    <option value="France">France</option>
                    <option value="Spain">Spain</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Italy">Italy</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Club Logo URL
                </label>
                <input
                  type="text"
                  value={logoUrlInput}
                  onChange={(e) => setLogoUrlInput(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all mb-4"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Portal Header Crest (Logo File Upload)
                </label>
                <div className="flex items-center gap-4">
                  {club.logoUrl && (
                    <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={club.logoUrl} alt="Club Crest Logo" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    name="logoFile"
                    accept="image/*"
                    className="text-slate-600 dark:text-slate-300 text-xs w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Portal Cover Image
                </label>
                <div className="flex items-center gap-4">
                  {club.bannerUrl && (
                    <div className="h-12 w-24 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={club.bannerUrl} alt="Club Banner" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    name="coverFile"
                    accept="image/*"
                    className="text-slate-600 dark:text-slate-300 text-xs w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Portal Announcement Welcome Text
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Welcome message for your fans..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Club Visibility Status
                </label>
                <select
                  name="visibility"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all mb-4 cursor-pointer"
                >
                  <option value="PRIVATE">Private (Invisible to public directory)</option>
                  <option value="PUBLIC">Public (Published on main directory)</option>
                </select>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button type="submit" disabled={isSubmitting} className="font-semibold cursor-pointer">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar credentials panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Landmark className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
              Stripe Accounts
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Your fan subscriptions are processed and distributed to your bank account via Stripe Connect.
            </p>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-xl mb-6 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500 dark:text-emerald-450 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-emerald-400">Verification Complete</h4>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-500 block mt-1">
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
