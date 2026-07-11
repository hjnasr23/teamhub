"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Users,
  ArrowRight,
  ArrowLeft,
  Clock,
  FileText,
  SearchX,
  Lock,
  Shield,
  Check,
  Plus
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { followClubAction } from "@/lib/actions";
import Footer from "@/components/Footer";

const isValidUrl = (url: string | null | undefined) => {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
};

const isColorLight = (hexColor: string | null | undefined) => {
  if (!hexColor) return false;
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 0.2126 + g * 0.7152 + b * 0.0722);
  return brightness > 128;
};

/* ════════════════════════════════════════════════════════════════════
 *  i18n Dictionary — en / fr / ar
 * ════════════════════════════════════════════════════════════════════ */

const clubDetailTranslations: Record<string, {
  backToDirectory: string;
  official: string;
  activeMembers: string;
  postsPublished: string;
  subscribe: string;
  clubhouseFeed: string;
  public: string;
  readFullPost: string;
  clubhouseOverview: string;
  activeMembersLabel: string;
  publicPosts: string;
  fanPolls: string;
  votingOpen: string;
  becomeVIP: string;
  viewPlans: string;
  clubNotFound: string;
  clubNotFoundDesc1: string;
  clubNotFoundDesc2: string;
  backToDiscover: string;
  mediaAttached: string;
}> = {
  en: {
    backToDirectory: "Back to Directory",
    official: "Official",
    activeMembers: "active members",
    postsPublished: "posts published",
    subscribe: "Subscribe",
    clubhouseFeed: "Clubhouse Feed",
    public: "Public",
    readFullPost: "Read Full Post",
    clubhouseOverview: "Clubhouse Overview",
    activeMembersLabel: "Active Members",
    publicPosts: "Public Posts",
    fanPolls: "Fan Polls",
    votingOpen: "VOTING OPEN",
    becomeVIP: "Become a VIP Member",
    viewPlans: "View Membership Plans",
    clubNotFound: "Club Not Found",
    clubNotFoundDesc1: "We couldn't find a club matching",
    clubNotFoundDesc2: ". It may not exist yet or the URL is incorrect.",
    backToDiscover: "Back to Discover",
    mediaAttached: "Media Attached",
  },
  fr: {
    backToDirectory: "Retour au répertoire",
    official: "Officiel",
    activeMembers: "membres actifs",
    postsPublished: "publications",
    subscribe: "S'abonner",
    clubhouseFeed: "Fil du Clubhouse",
    public: "Public",
    readFullPost: "Lire l'article complet",
    clubhouseOverview: "Aperçu du Clubhouse",
    activeMembersLabel: "Membres Actifs",
    publicPosts: "Publications Publiques",
    fanPolls: "Sondages Fans",
    votingOpen: "VOTE OUVERT",
    becomeVIP: "Devenez Membre VIP",
    viewPlans: "Voir les Plans d'Adhésion",
    clubNotFound: "Club introuvable",
    clubNotFoundDesc1: "Nous n'avons pas trouvé de club correspondant à",
    clubNotFoundDesc2: ". Il n'existe peut-être pas encore ou l'URL est incorrecte.",
    backToDiscover: "Retour à la découverte",
    mediaAttached: "Média Joint",
  },
  ar: {
    backToDirectory: "العودة إلى الدليل",
    official: "رسمي",
    activeMembers: "أعضاء نشطين",
    postsPublished: "منشورات",
    subscribe: "اشترك",
    clubhouseFeed: "تغذية النادي",
    public: "عام",
    readFullPost: "قراءة المنشور كاملاً",
    clubhouseOverview: "نظرة عامة على النادي",
    activeMembersLabel: "الأعضاء النشطين",
    publicPosts: "المنشورات العامة",
    fanPolls: "استطلاعات المشجعين",
    votingOpen: "التصويت مفتوح",
    becomeVIP: "كن عضواً مميزاً",
    viewPlans: "عرض خطط العضوية",
    clubNotFound: "النادي غير موجود",
    clubNotFoundDesc1: "لم نتمكن من العثور على نادي يطابق",
    clubNotFoundDesc2: ". قد لا يكون موجوداً بعد أو أن الرابط غير صحيح.",
    backToDiscover: "العودة إلى الاكتشاف",
    mediaAttached: "مرفق وسائط",
  },
};

interface Post {
  id: string;
  title: string;
  content: string;
  visibility: 'PUBLIC' | 'PREMIUM';
  createdAt: Date | string;
  mediaUrl?: string | null;
  mediaType?: string | null;
}

interface Club {
  id: string;
  slug: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logoInitials: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  subscribersCount: number;
  posts: Post[];
}

function ClubPageClientContent({
  club,
  hasActiveSubscription,
  isFollowing = false,
  slug,
  isAdmin = false,
  isGuest = true
}: {
  club: Club | null;
  hasActiveSubscription: boolean;
  isFollowing?: boolean;
  slug: string;
  isAdmin?: boolean;
  isGuest?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "en";
  const t = clubDetailTranslations[lang] || clubDetailTranslations.en;
  const isRTL = lang === "ar";

  const [mounted, setMounted] = React.useState(false);
  const [isFollowingState, setIsFollowingState] = React.useState(isFollowing);
  const [isFollowingPending, setIsFollowingPending] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setIsFollowingState(isFollowing);
  }, [isFollowing]);

  React.useEffect(() => {
    const planId = searchParams.get("planId");
    const follow = searchParams.get("follow");

    if (follow === "true" && !isGuest && !isAdmin) {
      followClubAction(slug).then((res) => {
        if (res.success) {
          setIsFollowingState(true);
          router.replace(`/clubs/${slug}?lang=${lang}`);
          router.refresh();
        }
      });
      return;
    }

    if (planId && !isGuest && !hasActiveSubscription && !isAdmin) {
      router.push(`/clubs/${slug}/subscribe?planId=${planId}&lang=${lang}`);
    }
  }, [searchParams, isGuest, hasActiveSubscription, isAdmin, slug, lang, router]);

  const handlePlanSelect = (planId: string) => {
    if (isGuest) {
      router.push(`/signup?callbackUrl=${encodeURIComponent(`/portal/${slug}`)}&planId=${planId}`);
    } else {
      router.push(`/clubs/${slug}/subscribe?planId=${planId}&lang=${lang}`);
    }
  };

  const handleSubscribeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isGuest) {
      router.push(`/signup?callbackUrl=${encodeURIComponent(`/portal/${slug}?follow=true`)}`);
      return;
    }

    setIsFollowingPending(true);
    try {
      const res = await followClubAction(slug);
      if (res.success) {
        setIsFollowingState(true);
        router.refresh();
      } else {
        alert(res.error || "Failed to follow club");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFollowingPending(false);
    }
  };

  /* ── 404: Club Not Found state ──────────────────────────────────── */
  if (!club) {
    return (
      <main className="pt-32 min-h-screen bg-neutral-bg text-text-dark px-4 md:px-8 transition-colors duration-200">
        <div dir={isRTL ? "rtl" : "ltr"} className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border-custom bg-neutral-bg shadow-sm">
            <SearchX className="h-7 w-7 text-text-muted" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold text-text-dark">
            {t.clubNotFound}
          </h1>
          <p className="mt-2 max-w-sm text-sm text-text-muted">
            {t.clubNotFoundDesc1}{" "}
            <code className="rounded-md border border-border-custom bg-neutral-bg-alt px-1.5 py-0.5 text-xs font-semibold text-text-dark">
              {slug}
            </code>
            {t.clubNotFoundDesc2}
          </p>
          <Link href={`/clubs?lang=${lang}`} className="mt-6">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              {t.backToDiscover}
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const hex = club.primaryColor;
  const primary = club.primaryColor;
  const secondary = club.secondaryColor || primary;
  const isSolid = !secondary || secondary === primary;

  const heroBackgroundStyle = {
    background: isSolid
      ? primary
      : `linear-gradient(135deg, ${primary}, ${secondary})`,
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat"
  };

  const isPrimaryLight = isColorLight(primary);
  const logoTextColor = isPrimaryLight ? "text-slate-900" : "text-white";
  const btnTextColor = isPrimaryLight ? "text-slate-950" : "text-white";
  const badgeTextColor = isPrimaryLight ? "text-slate-950" : "text-white";

  return (
    <main
      className="w-full min-h-screen flex flex-col m-0 p-0 overflow-x-hidden text-text-dark transition-colors duration-200 relative bg-no-repeat bg-cover bg-fixed"
      style={heroBackgroundStyle}
    >
      {/* Background Decorative patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      {/* 1. THE BACKGROUND AREA: 40vh Header Hero bg */}
      <div
        className="relative w-full h-[40vh] min-h-[260px] overflow-hidden pt-20"
      >
        {isValidUrl(club.bannerUrl) ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={club.bannerUrl!} alt={club.name} className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-slate-950/25" />
          </>
        ) : null}
      </div>

      <div dir={isRTL ? "rtl" : "ltr"} className="w-full max-w-5xl mx-auto px-4 md:px-6 flex-grow pb-12 relative z-10 space-y-8">

        {/* 2. FLOATING AVATAR/HERO CARD: -80px Overlap Profile Block */}
        <section className="relative -mt-20 md:-mt-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl p-6 md:p-8 transition-colors">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Logo Avatar */}
              <div className="h-24 w-24 md:h-28 md:w-28 rounded-2xl overflow-hidden shrink-0 bg-slate-100/50 dark:bg-slate-800/50 border-[4px] border-white/50 dark:border-slate-900/50 shadow-lg flex items-center justify-center"
                style={{ backgroundColor: hex }}>
                {isValidUrl(club.logoUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={club.logoUrl!} alt={club.name} className="h-full w-full object-cover" />
                ) : (
                  <span className={`font-display text-xl font-black md:text-2xl ${logoTextColor}`}>
                    {club.logoInitials || "CLUB"}
                  </span>
                )}
              </div>

              {/* Identity Info */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    {club.name}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 bg-white/40 dark:bg-slate-950/40 border border-slate-200/20 dark:border-slate-800/20 px-2.5 py-1 rounded-lg">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <strong className="text-slate-700 dark:text-slate-200">{club.subscribersCount}</strong>{" "}
                    {t.activeMembers}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/40 dark:bg-slate-950/40 border border-slate-200/20 dark:border-slate-800/20 px-2.5 py-1 rounded-lg">
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    <strong className="text-slate-700 dark:text-slate-200">{club.posts.length}</strong>{" "}
                    {t.postsPublished}
                  </span>
                </div>
              </div>
            </div>

            {/* Subscribe / Follow Action */}
            {!isAdmin && (
              <Button
                onClick={handleSubscribeClick}
                disabled={isFollowingPending}
                className={`group px-6 py-2.5 h-11 gap-2 text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer rounded-xl shrink-0 ${isFollowingState
                    ? "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    : btnTextColor
                  }`}
                style={isFollowingState ? undefined : { backgroundColor: hex }}
              >
                {isFollowingState ? (
                  <>
                    {isRTL ? "متابع" : lang === "fr" ? "Suivi" : "Following"}
                    <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  </>
                ) : (
                  <>
                    {isRTL ? "متابعة" : lang === "fr" ? "Suivre" : "Follow"}
                    <Plus className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                  </>
                )}
              </Button>
            )}
          </div>
        </section>

        {/* 3. CLUBHOUSE FEED: Wide Layout */}
        <section className="w-full space-y-6">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: hex }} />
            {t.clubhouseFeed}
          </h2>

          <div className="space-y-6">
            {club.posts.map((post) => {
              const isLocked = post.visibility === 'PREMIUM' && !hasActiveSubscription;

              return (
                <article
                  key={post.id}
                  onClick={() => {
                    if (isLocked) {
                      router.push(`/clubs/${slug}/subscribe?lang=${lang}`);
                    }
                  }}
                  className={`relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-sm transition-all duration-300 ${isLocked ? "cursor-pointer hover:shadow-md hover:border-amber-400/80 dark:hover:border-amber-600/80" : ""
                    } hover:translate-y-[-2px]`}
                >
                  <div className="p-5 sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${post.visibility === 'PREMIUM'
                        ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400"
                        }`}
                      >
                        {post.visibility === 'PREMIUM' ? (
                          <><Lock className="h-3 w-3" /> Premium</>
                        ) : (
                          t.public
                        )}
                      </span>

                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString(lang)}
                      </span>
                    </div>

                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                      {post.title}
                    </h3>

                    {isLocked ? (
                      <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold select-none">
                        <Lock className="h-3.5 w-3.5 animate-pulse" />
                        <span>{lang === "ar" ? "اضغط لفتح المحتوى المميز" : lang === "fr" ? "Cliquez pour débloquer le contenu premium" : "Click to unlock premium content"}</span>
                      </div>
                    ) : (
                      <>
                        {post.mediaUrl && (
                          <div className="mt-4 overflow-hidden rounded-xl bg-slate-100/40 dark:bg-slate-950/40 border border-slate-200/20 dark:border-slate-800/20">
                            {post.mediaType === 'video' ? (
                              <video src={post.mediaUrl} controls className="w-full max-h-[400px] object-cover" />
                            ) : (
                              <img src={post.mediaUrl} alt={post.title} className="w-full max-h-[400px] object-cover" />
                            )}
                          </div>
                        )}

                        <div className="mt-4">
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                            {post.content}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              );
            })}

            {club.posts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200/50 dark:border-slate-800/50 p-8 text-center text-slate-400 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                No posts available for this club yet.
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer forceShow={true} />
    </main>
  );
}

export default function ClubPageClient({
  club,
  hasActiveSubscription,
  isFollowing = false,
  slug,
  isAdmin = false,
  isGuest = true
}: {
  club: Club | null;
  hasActiveSubscription: boolean;
  isFollowing?: boolean;
  slug: string;
  isAdmin?: boolean;
  isGuest?: boolean;
}) {
  return (
    <Suspense fallback={<div className="pt-32 min-h-screen bg-neutral-bg w-full" />}>
      <ClubPageClientContent
        club={club}
        hasActiveSubscription={hasActiveSubscription}
        isFollowing={isFollowing}
        slug={slug}
        isAdmin={isAdmin}
        isGuest={isGuest}
      />
    </Suspense>
  );
}
