"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Coins,
  Users,
  Trophy,
  ChevronRight,
  CircleDollarSign,
  Lock,
  Check,
  ArrowRight,
  Zap,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────
 *  i18n Dictionary — en / fr / ar
 * ──────────────────────────────────────────────────────────────────── */

const dictionary: Record<string, {
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  ctaButton: string;
  statClubs: string;
  statSupporters: string;
  statPosts: string;
  statRevenue: string;
  statCurrency: string;
  statPeriod: string;
  teamsTitle: string;
  teamsSubtitle: string;
  teamsEmpty: string;
  teamsJoin: string;
  teamsHubLabel: string;
  fansSuffix: string;
  stepsTitle: string;
  stepsSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  pricingTitle: string;
  pricingSubtitle: string;
  monthlyTitle: string;
  monthlyDesc: string;
  monthlyUnit: string;
  monthlyCta: string;
  annualBadge: string;
  annualTitle: string;
  annualDesc: string;
  annualUnit: string;
  annualOldPrice: string;
  annualCta: string;
  featuresTitle: string;
  featuresSubtitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  pricingFeatures: string[];
}> = {
  en: {
    heroTitle: "Get Closer to Your ",
    heroHighlight: "Favorite Club",
    heroSubtitle: "Unlock the ultimate fan experience. Connect directly with players, stream exclusive VIP content, and join a passionate community of supporters.",
    ctaButton: "Discover Our Clubs",
    statClubs: "Official Clubs",
    statSupporters: "Registered Supporters",
    statPosts: "Premium Publications",
    statRevenue: "Average Club Revenue",
    statCurrency: "MAD",
    statPeriod: "/ mo",
    teamsTitle: "Meet the Teams",
    teamsSubtitle: "Find your colors and join the digital revolution.",
    teamsEmpty: "No active clubs registered yet",
    teamsJoin: "Join Club",
    teamsHubLabel: "Official digital hub",
    fansSuffix: "fans",
    stepsTitle: "Your VIP Experience",
    stepsSubtitle: "Three simple steps to unlock the inner sanctum of your club.",
    step1Title: "Discover Your Tribe",
    step1Desc: "Browse through our official roster of top-tier Moroccan clubs and find the community that matches your passion.",
    step2Title: "Join Officially",
    step2Desc: "Subscribe to secure your digital membership badge. Your support directly funds your favorite club's growth.",
    step3Title: "Unlock Locker Room Secrets",
    step3Desc: "Gain instant VIP access to exclusive streams, post-match breakdowns, and private player AMAs.",
    pricingTitle: "Choose Your Access Level",
    pricingSubtitle: "One membership tier. Flexible billing. Cancel anytime.",
    monthlyTitle: "Monthly Access",
    monthlyDesc: "Perfect for staying connected to player streams and exclusive forums season by season.",
    monthlyUnit: "MAD / month",
    monthlyCta: "Get Monthly Access",
    annualBadge: "Save 25% Annually",
    annualTitle: "Annual Premium Access",
    annualDesc: "The ultimate commitment for die-hard supporters. Secure structural discounts while backing your colors all year.",
    annualUnit: "MAD / year",
    annualOldPrice: "600 MAD / year",
    annualCta: "Get Annual Access",
    featuresTitle: "Everything You Love About the Game",
    featuresSubtitle: "Immerse yourself completely in your club's ecosystem, from breaking news to direct interactions.",
    feature1Title: "Support Your Team",
    feature1Desc: "Your subscription directly fuels your club's success, helping fund academy growth and key signings.",
    feature2Title: "Premium Content",
    feature2Desc: "Say goodbye to generic news. Unlock high-quality training footage, player documentaries, and press conferences.",
    feature3Title: "Join the Conversation",
    feature3Desc: "Debate tactics, rate player performances, and mingle with thousands of other passionate supporters in real-time.",
    pricingFeatures: [
      "Full access to exclusive subscriber-only posts",
      "Direct clubhouse forum interaction with players",
      "Official verified digital membership badge",
      "High-definition behind-the-scenes video content",
      "Priority VIP matchday notifications",
      "Members-only merch drops & flash discounts",
    ],
  },
  fr: {
    heroTitle: "Rapprochez-vous de votre ",
    heroHighlight: "Club Préféré",
    heroSubtitle: "Débloquez l'expérience ultime de supporter. Connectez-vous directement avec les joueurs, streamez du contenu VIP exclusif et rejoignez une communauté passionnée.",
    ctaButton: "Découvrir nos Clubs",
    statClubs: "Clubs Officiels",
    statSupporters: "Supporters Inscrits",
    statPosts: "Publications Premium",
    statRevenue: "Revenu Moyen par Club",
    statCurrency: "MAD",
    statPeriod: "/ mois",
    teamsTitle: "Découvrez les Équipes",
    teamsSubtitle: "Trouvez vos couleurs et rejoignez la révolution digitale.",
    teamsEmpty: "Aucun club actif enregistré pour le moment",
    teamsJoin: "Rejoindre le Club",
    teamsHubLabel: "Hub numérique officiel",
    fansSuffix: "fans",
    stepsTitle: "Votre Expérience VIP",
    stepsSubtitle: "Trois étapes simples pour accéder au cercle privé de votre club.",
    step1Title: "Découvrez Votre Tribu",
    step1Desc: "Parcourez notre liste officielle de clubs marocains de premier plan et trouvez la communauté qui correspond à votre passion.",
    step2Title: "Rejoignez Officiellement",
    step2Desc: "Abonnez-vous pour obtenir votre badge numérique officiel. Votre soutien finance directement la croissance de votre club.",
    step3Title: "Accédez aux Coulisses",
    step3Desc: "Obtenez un accès VIP instantané aux streams exclusifs, aux analyses d'après-match et aux AMA privés avec les joueurs.",
    pricingTitle: "Choisissez Votre Niveau d'Accès",
    pricingSubtitle: "Un seul abonnement. Facturation flexible. Annulez à tout moment.",
    monthlyTitle: "Accès Mensuel",
    monthlyDesc: "Idéal pour rester connecté aux streams des joueurs et aux forums exclusifs saison après saison.",
    monthlyUnit: "MAD / mois",
    monthlyCta: "Accès Mensuel",
    annualBadge: "Économisez 25% par an",
    annualTitle: "Accès Premium Annuel",
    annualDesc: "L'engagement ultime pour les supporters inconditionnels. Bénéficiez de réductions structurelles en soutenant vos couleurs toute l'année.",
    annualUnit: "MAD / an",
    annualOldPrice: "600 MAD / an",
    annualCta: "Accès Annuel",
    featuresTitle: "Tout Ce Que Vous Aimez dans le Sport",
    featuresSubtitle: "Plongez complètement dans l'écosystème de votre club, des dernières nouvelles aux interactions directes.",
    feature1Title: "Soutenez Votre Équipe",
    feature1Desc: "Votre abonnement alimente directement le succès de votre club, finançant la croissance de l'académie et les transferts clés.",
    feature2Title: "Contenu Premium",
    feature2Desc: "Dites adieu aux actualités génériques. Accédez à des séquences d'entraînement, des documentaires de joueurs et des conférences de presse en haute qualité.",
    feature3Title: "Rejoignez la Conversation",
    feature3Desc: "Débattez des tactiques, notez les performances des joueurs et échangez avec des milliers de supporters passionnés en temps réel.",
    pricingFeatures: [
      "Accès complet aux publications réservées aux abonnés",
      "Interaction directe dans le forum du clubhouse",
      "Badge numérique officiel vérifié",
      "Contenu vidéo haute définition des coulisses",
      "Notifications prioritaires VIP les jours de match",
      "Drops merch exclusifs & réductions flash",
    ],
  },
  ar: {
    heroTitle: "اقترب أكثر من ",
    heroHighlight: "ناديك المفضل",
    heroSubtitle: "افتح تجربة المشجع المثالية. تواصل مباشرة مع اللاعبين، شاهد محتوى VIP حصري، وانضم إلى مجتمع من المشجعين المتحمسين.",
    ctaButton: "اكتشف أنديتنا",
    statClubs: "الأندية الرسمية",
    statSupporters: "المشجعون المسجلون",
    statPosts: "المنشورات المميزة",
    statRevenue: "متوسط إيرادات النادي",
    statCurrency: "درهم",
    statPeriod: "/ شهر",
    teamsTitle: "تعرف على الفرق",
    teamsSubtitle: "اعثر على ألوانك وانضم إلى الثورة الرقمية.",
    teamsEmpty: "لا توجد أندية نشطة مسجلة بعد",
    teamsJoin: "انضم للنادي",
    teamsHubLabel: "المركز الرقمي الرسمي",
    fansSuffix: "مشجع",
    stepsTitle: "تجربتك الحصرية",
    stepsSubtitle: "ثلاث خطوات بسيطة لفتح الدائرة الداخلية لناديك.",
    step1Title: "اكتشف قبيلتك",
    step1Desc: "تصفح قائمتنا الرسمية من أفضل الأندية المغربية وابحث عن المجتمع الذي يناسب شغفك.",
    step2Title: "انضم رسمياً",
    step2Desc: "اشترك للحصول على شارتك الرقمية الرسمية. دعمك يمول مباشرة نمو ناديك المفضل.",
    step3Title: "اكشف أسرار غرفة الملابس",
    step3Desc: "احصل على وصول VIP فوري إلى البثوث الحصرية وتحليلات ما بعد المباراة وجلسات AMA الخاصة مع اللاعبين.",
    pricingTitle: "اختر مستوى وصولك",
    pricingSubtitle: "اشتراك واحد. فوترة مرنة. إلغاء في أي وقت.",
    monthlyTitle: "الوصول الشهري",
    monthlyDesc: "مثالي للبقاء على اتصال ببثوث اللاعبين والمنتديات الحصرية موسماً بعد موسم.",
    monthlyUnit: "درهم / شهر",
    monthlyCta: "اشتراك شهري",
    annualBadge: "وفّر 25% سنوياً",
    annualTitle: "الوصول السنوي المميز",
    annualDesc: "الالتزام الأقصى للمشجعين الأوفياء. احصل على خصومات هيكلية مع دعم ألوانك طوال العام.",
    annualUnit: "درهم / سنة",
    annualOldPrice: "600 درهم / سنة",
    annualCta: "اشتراك سنوي",
    featuresTitle: "كل ما تحبه في اللعبة",
    featuresSubtitle: "انغمس بالكامل في نظام ناديك، من الأخبار العاجلة إلى التفاعلات المباشرة.",
    feature1Title: "ادعم فريقك",
    feature1Desc: "اشتراكك يغذي مباشرة نجاح ناديك، ويساعد في تمويل نمو الأكاديمية والتعاقدات الرئيسية.",
    feature2Title: "محتوى مميز",
    feature2Desc: "ودّع الأخبار العامة. افتح لقطات تدريب عالية الجودة ووثائقيات اللاعبين والمؤتمرات الصحفية.",
    feature3Title: "انضم إلى الحوار",
    feature3Desc: "ناقش التكتيكات، قيّم أداء اللاعبين، وتفاعل مع آلاف المشجعين المتحمسين في الوقت الفعلي.",
    pricingFeatures: [
      "وصول كامل للمنشورات الحصرية للمشتركين",
      "تفاعل مباشر في منتدى النادي مع اللاعبين",
      "شارة عضوية رقمية رسمية موثقة",
      "محتوى فيديو عالي الدقة من الكواليس",
      "إشعارات VIP ذات أولوية في أيام المباريات",
      "عروض حصرية على المنتجات وخصومات فلاش",
    ],
  },
};

function MarketingPageContent() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "en";
  const t = dictionary[lang] || dictionary.en;

  // Fallback estimates (original mockup data) used while loading or if database connection fails
  const FALLBACKS = {
    clubs: 3,
    supporters: 14290,
    posts: 42,
    revenue: 237417
  };

  // Active React states for dynamic data and animated counter effect
  const [mounted, setMounted] = React.useState(false);
  const [clubsCount, setClubsCount] = React.useState(0);
  const [supportersCount, setSupportersCount] = React.useState(0);
  const [postsCount, setPostsCount] = React.useState(0);
  const [revenueCount, setRevenueCount] = React.useState(0);
  const [clubs, setClubs] = React.useState<any[]>([]);

  React.useEffect(() => {
    setMounted(true);
    let active = true;

    // Fetch dynamic database counts and clubs list from Next.js API Route
    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error(`API stats fetch failed: status ${res.status}`);
        return res.json();
      })
      .then((res) => {
        if (!active) return;

        const targets = {
          clubs: typeof res?.data?.clubs === "number" ? res.data.clubs : (typeof res?.fallback?.clubs === "number" ? res.fallback.clubs : FALLBACKS.clubs),
          supporters: typeof res?.data?.supporters === "number" ? res.data.supporters : (typeof res?.fallback?.supporters === "number" ? res.fallback.supporters : FALLBACKS.supporters),
          posts: typeof res?.data?.posts === "number" ? res.data.posts : (typeof res?.fallback?.posts === "number" ? res.fallback.posts : FALLBACKS.posts),
          revenue: typeof res?.data?.revenue === "number" ? res.data.revenue : (typeof res?.fallback?.revenue === "number" ? res.fallback.revenue : FALLBACKS.revenue)
        };

        if (res?.data?.clubsList) {
          setClubs(res.data.clubsList);
        } else if (res?.fallback?.clubsList) {
          setClubs(res.fallback.clubsList);
        }

        startAnimation(targets);
      })
      .catch((err) => {
        console.error("Failed to load live database stats, using empty fallback list:", err);
        if (!active) return;
        setClubs([]); // Ensure no mock data is shown on error/empty database
        startAnimation(FALLBACKS);
      });

    const startAnimation = (targets: typeof FALLBACKS) => {
      let startTimestamp: number | null = null;
      const duration = 2000; // Animation duration in ms (2 seconds)

      const animate = (timestamp: number) => {
        if (!active) return;
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function: easeOutExpo for smooth slowing down
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        setClubsCount(Math.floor(easeProgress * targets.clubs));
        setSupportersCount(Math.floor(easeProgress * targets.supporters));
        setPostsCount(Math.floor(easeProgress * targets.posts));
        setRevenueCount(Math.floor(easeProgress * targets.revenue));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    return () => {
      active = false;
    };
  }, []);

  // Format statistics for modern, clean display with required suffixes
  const formattedTotalClubs = `${clubsCount}+`;
  const formattedTotalFans = new Intl.NumberFormat("en-US", { notation: "compact" }).format(supportersCount) + "+";
  const formattedTotalPosts = `${postsCount}+`;
  const formattedAvgRevenue = new Intl.NumberFormat("en-US").format(revenueCount);

  const steps = [
    {
      number: "01",
      icon: Trophy,
      title: t.step1Title,
      description: t.step1Desc,
      accentBg: "bg-emerald-50 dark:bg-emerald-950/30",
      accentBorder: "border-emerald-100 dark:border-emerald-900/40",
      accentText: "text-emerald-600 dark:text-emerald-400",
      numberColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      number: "02",
      icon: CircleDollarSign,
      title: t.step2Title,
      description: t.step2Desc,
      accentBg: "bg-sky-50 dark:bg-sky-950/30",
      accentBorder: "border-sky-100 dark:border-sky-900/40",
      accentText: "text-sky-600 dark:text-sky-400",
      numberColor: "text-sky-600 dark:text-sky-400",
    },
    {
      number: "03",
      icon: Lock,
      title: t.step3Title,
      description: t.step3Desc,
      accentBg: "bg-violet-50 dark:bg-violet-950/30",
      accentBorder: "border-violet-100 dark:border-violet-900/40",
      accentText: "text-violet-600 dark:text-violet-400",
      numberColor: "text-violet-600 dark:text-violet-400",
    },
  ];

  // RTL support for Arabic
  const isRTL = lang === "ar";

  return (
    <div className="min-h-screen transition-colors duration-300" dir={isRTL ? "rtl" : "ltr"}>
      {/* Subtle radial glow — adapts to theme */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-40 dark:opacity-20"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 h-[600px] w-full max-w-5xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/40 via-transparent to-transparent dark:from-emerald-900/20" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ──────────────────────────────────────────────────────────── */}
        {/*  HERO SECTION                                               */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="pb-20 pt-28 md:pb-28 md:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* Headline */}
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-text-dark sm:text-5xl md:text-6xl md:leading-[1.1]">
              {t.heroTitle}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                {t.heroHighlight}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
              {t.heroSubtitle}
            </p>

            {/* Single CTA Button */}
            <div className="mt-10 flex justify-center">
              <Link href={`/clubs?lang=${lang}`}>
                <Button
                  size="lg"
                  className="group gap-2.5 bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/25 px-8"
                >
                  {t.ctaButton}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Dynamic Statistics Grid (4 columns) */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border-custom bg-border-custom shadow-sm sm:grid-cols-4">
            <div className="bg-neutral-bg px-6 py-6 text-center transition-colors">
              <div className="font-display text-3xl font-extrabold tracking-tight text-text-dark">
                {mounted ? formattedTotalClubs : "0+"}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-text-muted">
                {t.statClubs}
              </div>
            </div>
            <div className="bg-neutral-bg px-6 py-6 text-center transition-colors">
              <div className="font-display text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                {mounted ? formattedTotalFans : "0+"}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-text-muted">
                {t.statSupporters}
              </div>
            </div>
            <div className="bg-neutral-bg px-6 py-6 text-center transition-colors">
              <div className="font-display text-3xl font-extrabold tracking-tight text-text-dark">
                {mounted ? formattedTotalPosts : "0+"}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-text-muted">
                {t.statPosts}
              </div>
            </div>
            <div className="bg-neutral-bg px-6 py-6 text-center transition-colors">
              <div className="flex items-baseline justify-center gap-1.5 font-display text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                {!isRTL && <span className="text-lg font-bold uppercase">{t.statCurrency}</span>}
                {mounted ? formattedAvgRevenue : "0"}
                {isRTL && <span className="text-lg font-bold uppercase">{t.statCurrency}</span>}
                <span className="text-sm font-bold opacity-80">{t.statPeriod}</span>
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-text-muted">
                {t.statRevenue}
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/*  DYNAMIC FEATURED CLUBS (SCROLLING MARQUEE)                  */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text-dark sm:text-3xl">
              {t.teamsTitle}
            </h2>
            <p className="mt-3 text-sm text-text-muted sm:text-base">
              {t.teamsSubtitle}
            </p>
          </div>

          {!mounted || clubs.length === 0 ? (
            <div className="rounded-2xl border border-border-custom bg-neutral-bg-alt py-12 text-center text-text-muted">
              <Shield className="mx-auto mb-3 h-8 w-8 opacity-20" />
              <p className="text-sm font-medium">{t.teamsEmpty}</p>
            </div>
          ) : (
            <div className="w-full relative bg-neutral-bg-alt border border-border-custom py-8 rounded-2xl shadow-sm">
              <div className="flex overflow-x-auto gap-6 px-6 pb-4 snap-x snap-mandatory scroll-smooth">
                {clubs.map((club) => (
                  <Link
                    key={club.id}
                    href={`/clubs/${club.slug}?lang=${lang}`}
                    className="flex w-[280px] md:w-[320px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-border-custom bg-neutral-bg p-6 shadow-sm transition-all duration-300 hover:border-emerald-500 hover:shadow-md hover:-translate-y-1"
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-bold overflow-hidden bg-slate-100 dark:bg-slate-800"
                          style={{
                            borderColor: club.primaryColor + "33",
                          }}
                        >
                          {club.logoUrl || club.logo ? (
                            <Image
                              src={club.logoUrl || club.logo}
                              alt={`${club.name} logo`}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div
                              className="flex h-full w-full items-center justify-center font-bold"
                              style={{
                                color: club.primaryColor,
                                backgroundColor: club.primaryColor + "10",
                              }}
                            >
                              {club.logoInitials}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-muted">
                          <span
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: club.primaryColor }}
                          />
                          {new Intl.NumberFormat("en-US", { notation: "compact" }).format(club.subscribersCount)} {t.fansSuffix}
                        </div>
                      </div>
                      <h3 className="font-display text-base font-bold text-text-dark truncate">
                        {club.name}
                      </h3>
                      <p className="mt-1.5 text-xs text-text-muted whitespace-normal line-clamp-2">
                        {club.city || "Morocco"} • {t.teamsHubLabel}
                      </p>
                    </div>
                    <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {t.teamsJoin}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/*  HOW IT WORKS                                                */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text-dark sm:text-3xl">
              {t.stepsTitle}
            </h2>
            <p className="mt-3 text-sm text-text-muted sm:text-base">
              {t.stepsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative group">
                  <div
                    className="relative overflow-hidden flex flex-col items-start p-6 rounded-2xl border border-border-custom bg-neutral-bg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <span className="absolute bottom-4 right-4 text-6xl md:text-7xl font-extrabold text-slate-800/10 dark:text-slate-200/5 select-none font-display">
                      {step.number}
                    </span>
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 mb-6">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-base font-bold text-text-dark">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="pointer-events-none absolute -right-3 top-1/2 hidden h-px w-6 bg-border-custom md:block" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/*  PRICING (Twin Cards)                                        */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text-dark sm:text-3xl">
              {t.pricingTitle}
            </h2>
            <p className="mt-3 text-sm text-text-muted sm:text-base">
              {t.pricingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Monthly Card */}
            <div className="relative overflow-hidden rounded-3xl border border-border-custom bg-neutral-bg shadow-sm transition-shadow duration-300 hover:shadow-md flex flex-col">
              <div className="h-1 bg-neutral-300 dark:bg-slate-700" />
              <div className="p-8 sm:p-10 flex-1 flex flex-col">
                <h3 className="font-display text-xl font-bold text-text-dark">
                  {t.monthlyTitle}
                </h3>
                <p className="mt-1.5 text-sm text-text-muted">
                  {t.monthlyDesc}
                </p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-extrabold tracking-tight text-text-dark">
                    50
                  </span>
                  <span className="text-sm font-semibold text-text-muted">
                    {t.monthlyUnit}
                  </span>
                </div>
                <div className="my-8 h-px bg-border-custom" />
                <ul className="space-y-4 flex-1">
                  {t.pricingFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-text-dark">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={`/clubs?lang=${lang}`} className="mt-10 block">
                  <Button variant="outline" size="lg" className="w-full gap-2 font-semibold">
                    {t.monthlyCta}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Annual Card */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-neutral-bg shadow-sm transition-shadow duration-300 hover:shadow-lg flex flex-col dark:border-emerald-800/40">
              <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />
              <div className="p-8 sm:p-10 flex-1 flex flex-col">
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <Zap className="h-3.5 w-3.5" />
                  {t.annualBadge}
                </div>
                <h3 className="font-display text-xl font-bold text-text-dark">
                  {t.annualTitle}
                </h3>
                <p className="mt-1.5 text-sm text-text-muted">
                  {t.annualDesc}
                </p>
                <div className="mt-6 flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-5xl font-extrabold tracking-tight text-text-dark">
                      450
                    </span>
                    <span className="text-sm font-semibold text-text-muted">
                      {t.annualUnit}
                    </span>
                  </div>
                  <span className="text-sm text-text-muted mt-1 line-through opacity-70">
                    {t.annualOldPrice}
                  </span>
                </div>
                <div className="my-8 h-px bg-border-custom" />
                <ul className="space-y-4 flex-1">
                  {t.pricingFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-text-dark">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={`/clubs?lang=${lang}`} className="mt-10 block">
                  <Button size="lg" className="group w-full gap-2 bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/25">
                    {t.annualCta}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/*  FEATURES / VALUE PROPS (Fan Focused)                        */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="w-full bg-neutral-bg py-16 md:py-24 transition-colors duration-200">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-text-dark sm:text-4xl">
              {t.featuresTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-text-muted">
              {t.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                icon: Coins,
                title: t.feature1Title,
                description: t.feature1Desc,
              },
              {
                icon: Shield,
                title: t.feature2Title,
                description: t.feature2Desc,
              },
              {
                icon: Users,
                title: t.feature3Title,
                description: t.feature3Desc,
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 bg-neutral-bg-alt border border-border-custom rounded-2xl shadow-sm"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 mb-6 transition-colors duration-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-text-dark">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function MarketingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-bg-alt" />}>
      <MarketingPageContent />
    </Suspense>
  );
}
