"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadClubAsset, updateClubSettingsAction } from "@/lib/media-actions";

export default function ClubSettingsForm({
  t,
  clubId,
  initialDescription,
  initialPrimaryColor,
  initialSecondaryColor,
  initialLogoUrl,
  initialBannerUrl
}: {
  t: any;
  clubId: string;
  initialDescription: string | null;
  initialPrimaryColor: string;
  initialSecondaryColor: string;
  initialLogoUrl: string | null;
  initialBannerUrl: string | null;
}) {
  const [description, setDescription] = useState(initialDescription || "");
  const [primaryColor, setPrimaryColor] = useState(initialPrimaryColor);
  const [secondaryColor, setSecondaryColor] = useState(initialSecondaryColor);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialLogoUrl);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(initialBannerUrl);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      setLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerFile(e.target.files[0]);
      setBannerPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      let finalLogoUrl = initialLogoUrl || undefined;
      let finalBannerUrl = initialBannerUrl || undefined;

      if (logoFile) {
        const formData = new FormData();
        formData.append("file", logoFile);
        const res = await uploadClubAsset(formData, "branding");
        if (!res.success) throw new Error(res.error || "Failed to upload logo");
        finalLogoUrl = res.mediaUrl;
      }

      if (bannerFile) {
        const formData = new FormData();
        formData.append("file", bannerFile);
        const res = await uploadClubAsset(formData, "branding");
        if (!res.success) throw new Error(res.error || "Failed to upload banner");
        finalBannerUrl = res.mediaUrl;
      }

      const res = await updateClubSettingsAction({
        clubId,
        description,
        primaryColor,
        secondaryColor,
        logoUrl: finalLogoUrl,
        bannerUrl: finalBannerUrl
      });

      if (!res.success) throw new Error(res.error || "Failed to save settings");
      setMessage(t.successMsg || "Settings saved successfully!");

    } catch (err: any) {
      setMessage("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-3 text-sm rounded-lg ${message.startsWith("Error") ? "bg-rose-50 text-rose-500 border border-rose-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"}`}>
          {message}
        </div>
      )}

      {/* Media Uploads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{t.clubLogo}</label>
          <div 
            onClick={() => logoInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-[#111a2e] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/50 h-32 relative overflow-hidden"
          >
            {logoPreview ? (
              <img src={logoPreview} alt="Logo Preview" className="h-full object-contain" />
            ) : (
              <div className="text-emerald-500 flex flex-col items-center">
                <UploadCloud className="h-6 w-6 mb-2" />
                <span className="text-xs font-semibold">{t.uploadLogo}</span>
              </div>
            )}
          </div>
          <input type="file" ref={logoInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{t.bannerImage}</label>
          <div 
            onClick={() => bannerInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-[#111a2e] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/50 h-32 relative overflow-hidden"
          >
            {bannerPreview ? (
              <img src={bannerPreview} alt="Banner Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="text-emerald-500 flex flex-col items-center">
                <UploadCloud className="h-6 w-6 mb-2" />
                <span className="text-xs font-semibold">{t.uploadBanner}</span>
              </div>
            )}
          </div>
          <input type="file" ref={bannerInputRef} onChange={handleBannerChange} accept="image/*" className="hidden" />
        </div>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{t.primaryColor}</label>
          <div className="flex gap-3 items-center">
            <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10 w-10 p-1 rounded border border-gray-300 dark:border-gray-800" />
            <input 
              type="text" 
              value={primaryColor} 
              onChange={(e) => setPrimaryColor(e.target.value)} 
              className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-[#111a2e] border border-gray-300 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors uppercase" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{t.secondaryColor}</label>
          <div className="flex gap-3 items-center">
            <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-10 w-10 p-1 rounded border border-gray-300 dark:border-gray-800" />
            <input 
              type="text" 
              value={secondaryColor} 
              onChange={(e) => setSecondaryColor(e.target.value)} 
              className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-[#111a2e] border border-gray-300 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors uppercase" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{t.clubDescription}</label>
        <textarea 
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.descPlaceholder} 
          className="w-full resize-none px-4 py-3 bg-gray-50 dark:bg-[#111a2e] border border-gray-300 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors autofill:bg-gray-50 dark:autofill:bg-[#111a2e]"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="gap-2 bg-emerald-500 text-white font-bold hover:bg-emerald-600 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? t.saving : t.saveSettings}
        </Button>
      </div>
    </form>
  );
}
