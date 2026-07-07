import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import {
  Users,
  ArrowRight,
  ArrowLeft,
  Clock,
  FileText,
  Flame,
  SearchX,
  Image as ImageIcon,
  Video,
  Lock
} from "lucide-react";
import { getSession } from "@/lib/actions";

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

/* ════════════════════════════════════════════════════════════════════
 *  PAGE COMPONENT
 * ════════════════════════════════════════════════════════════════════ */

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export default async function ClubPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const lang = resolvedSearchParams.lang || "en";
  const t = clubDetailTranslations[lang] || clubDetailTranslations.en;
  const isRTL = lang === "ar";

  /* ── Look up the club from the database ────────────────────── */
  const club = await prisma.club.findUnique({ 
    where: { slug: slug }, 
    include: { posts: { orderBy: { createdAt: 'desc' } } } 
  });

  /* ── Check Fan Subscription State ───────────────────────────────── */
  const session = await getSession();
  let hasActiveSubscription = false;
  if (session && club) {
    const activeSub = await prisma.subscription.findFirst({
      where: {
        fanId: session.userId,
        clubId: club.id,
        status: "ACTIVE"
      }
    });
    if (activeSub) hasActiveSubscription = true;
  }

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

  /* ── Convenience aliases ────────────────────────────────────────── */
  const hex = club.primaryColor;

  return (
    <main 
      className="pt-32 min-h-screen bg-neutral-bg text-text-dark px-4 md:px-8 transition-colors duration-200"
      style={{ '--primary-color': club.primaryColor, '--secondary-color': club.secondaryColor } as React.CSSProperties}
    >
      <div dir={isRTL ? "rtl" : "ltr"} className="w-full space-y-8 pb-12 max-w-6xl mx-auto">
        <Link 
          href={`/clubs?lang=${lang}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-text-muted transition-all hover:text-text-dark"
        >
          <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
          {t.backToDirectory}
        </Link>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/*  PROFILE HEADER CARD                                       */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden rounded-2xl border border-border-custom bg-neutral-bg shadow-sm dark:bg-slate-900">
          {/* Decorative banner strip — uses the club's hex colour */}
          <div className="h-32 sm:h-40" style={{ background: `linear-gradient(135deg, ${hex}, ${hex}cc, ${hex}88)` }}>
            <div className="absolute inset-0 h-32 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px] sm:h-40" />
          </div>

          {/* Profile info row */}
          <div className="relative px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
              {/* Crest avatar — floats above the banner edge */}
              <div className="-mt-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-[3px] border-neutral-bg shadow-md sm:-mt-12 sm:h-24 sm:w-24 dark:border-slate-900"
                  style={{ backgroundColor: hex }}>
                <span className="font-display text-xl font-black text-white sm:text-2xl">
                  {club.logoInitials || "CLUB"}
                </span>
              </div>

              {/* Club metadata */}
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-text-dark dark:text-white sm:text-3xl">
                    {club.name}
                  </h1>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
                    style={{ backgroundColor: hex }}
                  >
                    <Flame className="h-3 w-3" />
                    {t.official}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <strong className="text-text-dark dark:text-white">{club.subscribersCount}</strong>{" "}
                    {t.activeMembers}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    <strong className="text-text-dark dark:text-white">{club.posts.length}</strong>{" "}
                    {t.postsPublished}
                  </span>
                </div>
              </div>

              {/* CTA button */}
              <Link href={`/clubs/${slug}/subscribe?lang=${lang}`} className="w-full shrink-0 sm:w-auto">
                <Button
                  className="group w-full gap-2 text-sm font-bold text-white shadow-md sm:w-auto"
                  style={{ backgroundColor: hex }}
                >
                  {t.subscribe}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/*  CONTENT WALL — data-driven post feed                      */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main feed column */}
          <div className="space-y-5 lg:col-span-2">
            <h2 className="font-display text-lg font-bold text-text-dark dark:text-white">
              {t.clubhouseFeed}
            </h2>

            {club.posts.map((post) => {
              const isLocked = post.visibility === 'PREMIUM' && !hasActiveSubscription;

              return (
              <article
                key={post.id}
                className="relative overflow-hidden rounded-2xl border border-border-custom bg-neutral-bg shadow-sm transition-shadow duration-300 hover:shadow-md dark:bg-slate-900"
              >
                <div className="p-5 sm:p-6">
                  {/* Post header row */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        post.visibility === 'PREMIUM'
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

                    <span className="flex items-center gap-1 text-[11px] text-text-muted">
                      <Clock className="h-3 w-3" />
                      {new Date(post.createdAt).toLocaleDateString(lang)}
                    </span>
                  </div>

                  {/* Post title */}
                  <h3 className="font-display text-base font-bold text-text-dark dark:text-white sm:text-lg">
                    {post.title}
                  </h3>

                  {/* Post Content */}
                  {isLocked ? (
                    <div className="relative mt-4">
                      {/* Blurred preview text */}
                      <p className="select-none text-sm leading-relaxed text-text-muted blur-[5px] max-h-24 overflow-hidden">
                        {post.content}
                      </p>

                      {/* Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-neutral-bg/60 px-6 text-center backdrop-blur-sm dark:bg-slate-900/60 z-10">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full shadow-sm"
                          style={{ backgroundColor: `var(--primary-color)`, color: '#fff' }}
                        >
                          <Lock className="h-4 w-4" />
                        </div>
                        <span className="mt-3 text-xs font-extrabold uppercase tracking-wider text-text-dark dark:text-white">
                          Premium Content
                        </span>
                        <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-text-muted">
                          Subscribe to {club.name} to unlock exclusive posts and media.
                        </p>
                        <Link href={`/clubs/${slug}/subscribe?lang=${lang}`} className="mt-4">
                          <Button
                            size="sm"
                            className="gap-1.5 text-xs font-bold text-white shadow-sm"
                            style={{ backgroundColor: 'var(--primary-color)' }}
                          >
                            Subscribe to Unlock
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Post Media (Image/Video) */}
                      {post.mediaUrl && (
                        <div className="mt-4 overflow-hidden rounded-xl bg-neutral-bg-alt/50 dark:bg-slate-950/50">
                          {post.mediaType === 'video' ? (
                            <video src={post.mediaUrl} controls className="w-full max-h-[400px] object-cover" />
                          ) : (
                            <img src={post.mediaUrl} alt={post.title} className="w-full max-h-[400px] object-cover" />
                          )}
                        </div>
                      )}

                      {/* Post body */}
                      <div className="mt-4">
                        <p className="text-sm leading-relaxed text-text-muted whitespace-pre-wrap">
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
              <div className="rounded-2xl border border-dashed border-border-custom p-8 text-center text-text-muted">
                No posts available for this club yet.
              </div>
            )}
          </div>

          {/* ── Sidebar stats panel ─────────────────────────────────── */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border-custom bg-neutral-bg p-6 shadow-sm dark:bg-slate-900">
              <h3 className="mb-5 font-display text-xs font-bold uppercase tracking-wider text-text-dark dark:text-white">
                {t.clubhouseOverview}
              </h3>
              <dl className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-border-custom pb-3">
                  <dt className="text-text-muted">{t.activeMembersLabel}</dt>
                  <dd className="font-bold text-text-dark dark:text-white">
                    {club.subscribersCount}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-b border-border-custom pb-3">
                  <dt className="text-text-muted">{t.publicPosts}</dt>
                  <dd className="font-bold text-text-dark dark:text-white">
                    {club.posts.length}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-text-muted">{t.fanPolls}</dt>
                  <dd>
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
                      style={{ backgroundColor: hex }}
                    >
                      {t.votingOpen}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Subscription prompt card */}
            <div
              className="rounded-2xl border p-6 text-center shadow-sm"
              style={{
                backgroundColor: `${hex}08`,
                borderColor: `${hex}20`,
              }}
            >
              <h4 className="font-display text-sm font-bold text-text-dark dark:text-white">
                {t.becomeVIP}
              </h4>
              <Link href={`/clubs/${slug}/subscribe?lang=${lang}`} className="mt-4 block">
                <Button
                  className="w-full gap-2 text-xs font-bold text-white shadow-md"
                  style={{ backgroundColor: hex }}
                >
                  {t.viewPlans}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
