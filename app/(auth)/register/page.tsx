import Link from 'next/link';

// 1. Local Text Dictionary supporting Arabic, French, and English
const dict = {
  en: {
    title: "Create an Account",
    subtitle: "Start your sports fan subscription portal",
    fullName: "Full Name",
    fullNamePlaceholder: "Coach Carter",
    email: "Email Address",
    emailPlaceholder: "fan@teamhub.ma",
    password: "Password",
    passwordPlaceholder: "••••••••",
    submitBtn: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign In",
    tagline: ",Fuel the game\n.monetize the passion",
    marketingText: "Join the platform built for modern sports teams. Launch subscription plans, deliver exclusive content, and interact with fans like never before."
  },
  fr: {
    title: "Créer un Compte",
    subtitle: "Démarrez votre portail d'abonnement de fans",
    fullName: "Nom Complet",
    fullNamePlaceholder: "Coach Carter",
    email: "Adresse Email",
    emailPlaceholder: "fan@teamhub.ma",
    password: "Mot de passe",
    passwordPlaceholder: "••••••••",
    submitBtn: "Créer le Compte",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    signIn: "Se connecter",
    tagline: "Propulsez le jeu,\nmonétisez la passion.",
    marketingText: "Rejoignez la plateforme conçue pour les équipes sportives modernes. Lancez des abonnements, proposez du contenu exclusif et interagissez avec vos supporters."
  },
  ar: {
    title: "إنشاء حساب",
    subtitle: "ابدأ بوابة الاشتراك الرياضي الخاصة بالمعجبين",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "الكابتن كارتر",
    email: "البريد الإلكتروني",
    emailPlaceholder: "fan@teamhub.ma",
    password: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    submitBtn: "إنشاء الحساب",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    signIn: "تسجيل الدخول",
    tagline: "أشعل اللعبة،\nواستثمر الشغف.",
    marketingText: "انضم إلى المنصة المصممة للفرق الرياضية الحديثة. أطلق خطط الاشتراك، وقدم محتوى حصريًا، وتفاعل مع المعجبين بشكل لم يسبق له مثيل."
  }
};

type Props = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const lang = (resolvedParams.lang === 'ar' || resolvedParams.lang === 'fr') ? resolvedParams.lang : 'en';
  const t = dict[lang];
  const isRTL = lang === 'ar';

  return (
    <main 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen w-full bg-[#060b13] text-white pt-36 pb-16 px-4 sm:px-6 md:px-12 flex items-center justify-center transition-all duration-200"
    >
      {/* Structural Fluid Grid Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Fully Flexible Form (Columns 1 to 6) */}
        <div className="col-span-1 md:col-span-6 w-full flex flex-col justify-center">
          <div className="bg-[#0c1420] border border-gray-800 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl w-full">
            
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                {t.title}
              </h1>
              <p className="text-sm text-gray-400">
                {t.subtitle}
              </p>
            </div>

            <form className="space-y-5">
              {/* Full Name */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  {t.fullName}
                </label>
                <input 
                  type="text" 
                  placeholder={t.fullNamePlaceholder}
                  className="w-full px-4 py-3 bg-[#111a2e] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  {t.email}
                </label>
                <input 
                  type="email" 
                  placeholder={t.emailPlaceholder}
                  className="w-full px-4 py-3 bg-[#111a2e] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  {t.password}
                </label>
                <input 
                  type="password" 
                  placeholder={t.passwordPlaceholder}
                  className="w-full px-4 py-3 bg-[#111a2e] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
                  required
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-[#060b13] font-bold rounded-xl text-center text-sm transition-all shadow-lg shadow-emerald-500/10"
              >
                {t.submitBtn}
              </button>
            </form>

            {/* Bottom Link Redirect */}
            <div className="mt-6 text-center text-sm text-gray-400">
              {t.alreadyHaveAccount}{' '}
              <Link 
                href={`/login?lang=${lang}`} 
                className="text-emerald-400 hover:underline font-medium"
              >
                {t.signIn}
              </Link>
            </div>

          </div>
        </div>

        {/* Right Side: Localized Marketing Tagline (Columns 7 to 12) */}
        <div className={`hidden md:flex col-span-1 md:col-span-6 flex-col justify-center text-start px-8 ${isRTL ? 'border-r border-gray-800/60' : 'border-l border-gray-800/60'}`}>
          <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight whitespace-pre-line mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
              {t.tagline}
            </span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-lg">
            {t.marketingText}
          </p>
        </div>

      </div>
    </main>
  );
}