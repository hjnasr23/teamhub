"use client";

import React, { useState } from "react";
import { ShieldCheck, ArrowRight, Building2, UserCircle2, Mail, Lock, Flag } from "lucide-react";
import { createTenantAction } from "@/lib/actions";

// Multi-language dictionary configurations
const dict = {
  en: {
    title: "Super-Admin",
    subtitle: "Workspace",
    introDesc: "Use this secure internal gateway to provision brand new Club tenants. This action automatically spins up the database architecture and seeds a Root Administrator assigned directly to the new club instance.",
    clubEntity: "Club Entity",
    officialName: "Official Name",
    urlSlug: "URL Slug",
    operatingCity: "Operating City",
    rootAdmin: "Root Administrator",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    password: "Temp Password",
    submitBtn: "Provision New Tenant",
    provisioning: "Provisioning Architecture...",
    successMsg: "Tenant provisioned successfully!",
    namePlaceholder: "e.g. Manchester City",
    slugPlaceholder: "e.g. man-city",
    cityPlaceholder: "e.g. Manchester, UK",
    firstNamePlaceholder: "John",
    lastNamePlaceholder: "Doe",
    emailPlaceholder: "admin@club.com",
  },
  fr: {
    title: "Espace",
    subtitle: "Super-Admin",
    introDesc: "Utilisez cette passerelle interne sécurisée pour approvisionner de nouveaux abonnés de club. Cette action crée automatiquement la structure de la base de données et configure un administrateur racine.",
    clubEntity: "Entité du Club",
    officialName: "Nom Officiel",
    urlSlug: "Slug de l'URL",
    operatingCity: "Ville d'opération",
    rootAdmin: "Administrateur Racine",
    firstName: "Prénom",
    lastName: "Nom de Famille",
    email: "Adresse Email",
    password: "Mot de Passe Temp",
    submitBtn: "Créer le locataire",
    provisioning: "Création de l'architecture...",
    successMsg: "Locataire créé avec succès!",
    namePlaceholder: "ex. Paris Saint-Germain",
    slugPlaceholder: "ex. psg",
    cityPlaceholder: "ex. Paris, FR",
    firstNamePlaceholder: "Jean",
    lastNamePlaceholder: "Dupont",
    emailPlaceholder: "admin@club.com",
  },
  ar: {
    title: "مساحة التحكم",
    subtitle: "للمشرف العام",
    introDesc: "استخدم هذه البوابة الداخلية الآمنة لإنشاء مستأجرين جدد للأندية. يقوم هذا الإجراء تلقائيًا ببناء هيكل قاعدة البيانات وتعيين المشرف الرئيسي مباشرة للنادي الجديد.",
    clubEntity: "كيان النادي",
    officialName: "الاسم الرسمي",
    urlSlug: "رابط النادي (Slug)",
    operatingCity: "مدينة العمليات",
    rootAdmin: "المشرف الرئيسي",
    firstName: "الاسم الأول",
    lastName: "الاسم العائلي",
    email: "البريد الإلكتروني",
    password: "كلمة المرور المؤقتة",
    submitBtn: "إنشاء النادي والمسؤول",
    provisioning: "جاري بناء الهيكل...",
    successMsg: "تم إنشاء النادي والمسؤول بنجاح!",
    namePlaceholder: "مثال: الوداد الرياضي",
    slugPlaceholder: "مثال: wac-club",
    cityPlaceholder: "مثال: الدار البيضاء، المغرب",
    firstNamePlaceholder: "حمزة",
    lastNamePlaceholder: "العلوي",
    emailPlaceholder: "admin@club.ma",
  }
};

interface ProvisionFormProps {
  lang: "en" | "fr" | "ar";
}

export default function ProvisionForm({ lang }: ProvisionFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const t = dict[lang];
  const isRTL = lang === 'ar';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await createTenantAction(formData);

    if (result.success) {
      setMessage({ type: 'success', text: `${t.successMsg} ID: ${result.data?.clubId}` });
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage({ type: 'error', text: result.error || "An unexpected error occurred." });
    }
    
    setLoading(false);
  };

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="pt-44 pb-16 min-h-screen w-full bg-slate-50 dark:bg-[#060b13] text-gray-900 dark:text-white flex items-center justify-center p-4 transition-all duration-200"
    >
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Left Intro Card */}
        <div className="col-span-1 md:col-span-5 flex flex-col space-y-6 text-start">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <ShieldCheck className="h-7 w-7 text-indigo-500 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
            {t.title} <br/> 
            <span className="text-indigo-600 dark:text-indigo-400">{t.subtitle}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-sm whitespace-normal">
            {t.introDesc}
          </p>
        </div>

        {/* Right Form Card */}
        <div className="col-span-1 md:col-span-7 bg-white dark:bg-[#0c1420] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl w-full">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {message && (
              <div className={`p-4 rounded-xl text-sm font-semibold flex items-start gap-3 ${message.type === 'error' ? 'bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-900/50' : 'bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-900/50'}`}>
                {message.type === 'success' ? <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500" /> : <Lock className="h-5 w-5 shrink-0 text-rose-500" />}
                {message.text}
              </div>
            )}

            {/* Club Details Segment */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                <Building2 className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                <h2 className="text-lg font-bold tracking-wide">{t.clubEntity}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">{t.officialName}</label>
                  <input 
                    required 
                    type="text" 
                    name="clubName" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111a2e] border border-gray-300 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors autofill:bg-gray-50 dark:autofill:bg-[#111a2e]" 
                    placeholder={t.namePlaceholder} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">{t.urlSlug}</label>
                  <input 
                    required 
                    type="text" 
                    name="clubSlug" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111a2e] border border-gray-300 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors autofill:bg-gray-50 dark:autofill:bg-[#111a2e]" 
                    placeholder={t.slugPlaceholder} 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">{t.operatingCity}</label>
                  <div className="relative">
                    <Flag className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3.5 h-4 w-4 text-gray-400`} />
                    <input 
                      required 
                      type="text" 
                      name="clubCity" 
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-gray-50 dark:bg-[#111a2e] border border-gray-300 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors autofill:bg-gray-50 dark:autofill:bg-[#111a2e]`}
                      placeholder={t.cityPlaceholder} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Root Administrator Segment */}
            <div className="space-y-5 pt-4">
              <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                <UserCircle2 className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                <h2 className="text-lg font-bold tracking-wide">{t.rootAdmin}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">{t.firstName}</label>
                  <input 
                    required 
                    type="text" 
                    name="adminFirstName" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111a2e] border border-gray-300 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors autofill:bg-gray-50 dark:autofill:bg-[#111a2e]" 
                    placeholder={t.firstNamePlaceholder} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">{t.lastName}</label>
                  <input 
                    required 
                    type="text" 
                    name="adminLastName" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111a2e] border border-gray-300 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors autofill:bg-gray-50 dark:autofill:bg-[#111a2e]" 
                    placeholder={t.lastNamePlaceholder} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">{t.email}</label>
                  <div className="relative">
                    <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3.5 h-4 w-4 text-gray-400`} />
                    <input 
                      required 
                      type="email" 
                      name="adminEmail" 
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-gray-50 dark:bg-[#111a2e] border border-gray-300 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors autofill:bg-gray-50 dark:autofill:bg-[#111a2e]`}
                      placeholder={t.emailPlaceholder} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">{t.password}</label>
                  <div className="relative">
                    <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3.5 h-4 w-4 text-gray-400`} />
                    <input 
                      required 
                      type="password" 
                      name="adminPassword" 
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-gray-50 dark:bg-[#111a2e] border border-gray-300 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors autofill:bg-gray-50 dark:autofill:bg-[#111a2e]`}
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? t.provisioning : t.submitBtn}
              {!loading && <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
