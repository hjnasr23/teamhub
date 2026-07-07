import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LockKeyhole,
  Users,
  ArrowRight,
  ArrowLeft,
  Clock,
  Lock,
  FileText,
  Flame,
  SearchX,
} from "lucide-react";

/* ════════════════════════════════════════════════════════════════════
 *  MOCK DATABASE — simulates a future DB / API layer.
 *  Each club owns a slug, branding config, and a nested posts array.
 * ════════════════════════════════════════════════════════════════════ */

interface ClubPost {
  id: string;
  title: string;
  date: string;
  isPremium: boolean;
  content: string;
}

interface Club {
  name: string;
  slug: string;
  primaryColor: string; // hex
  logoText: string;
  subscribersCount: string;
  posts: ClubPost[];
}

const CLUBS_DB: Club[] = [
  {
    name: "Raja CA",
    slug: "raja-ca",
    primaryColor: "#16A34A",
    logoText: "RCA",
    subscribersCount: "18.5K",
    posts: [
      {
        id: "rca-1",
        title: "Official Matchday Squad List — Derby Edition",
        date: "July 4, 2026",
        isPremium: false,
        content:
          "Manager Mokhtar has named a 23-man squad for tomorrow's high-stakes derby. Key highlights include the return of midfielder Rahimi after a 6-week ankle rehabilitation, and the surprise inclusion of 17-year-old academy graduate Benmoussa, who impressed during the U-21 continental tournament. The squad departs tonight from the Mohammed V training complex.",
      },
      {
        id: "rca-2",
        title: "Exclusive: Captain's Pre-Match Locker Room Speech",
        date: "July 3, 2026",
        isPremium: true,
        content:
          "Watch the full 8-minute raw footage of the captain rallying the squad before last weekend's semi-final. Includes tactical instructions from the coaching staff and the emotional moment when the team formed their huddle. This content is reserved for premium digital members.",
      },
      {
        id: "rca-3",
        title: "Tactical Breakdown: Coach's Private Set-Piece Strategy",
        date: "July 1, 2026",
        isPremium: true,
        content:
          "A detailed analysis of the new corner-kick and free-kick patterns introduced this week. Includes whiteboard breakdowns of the 3-2-5 attacking shape in transition and the pressing triggers designed to exploit the opposition's build-up weaknesses.",
      },
    ],
  },
  {
    name: "Wydad AC",
    slug: "wydad-ac",
    primaryColor: "#DC2626",
    logoText: "WAC",
    subscribersCount: "14.2K",
    posts: [
      {
        id: "wac-1",
        title: "Behind-the-Scenes: Champions League Victory Celebration",
        date: "July 4, 2026",
        isPremium: true,
        content:
          "Exclusive dressing-room footage capturing the raw emotion after the final whistle. Watch the coach's speech, the trophy lift moment, and candid player interviews recorded before the official press conference.",
      },
      {
        id: "wac-2",
        title: "Injury Update: Medical Staff's Full Assessment Report",
        date: "July 2, 2026",
        isPremium: true,
        content:
          "The club's chief medical officer provides a detailed recovery timeline for three key squad members. Includes rehabilitation milestones and projected return dates ahead of the continental group stages.",
      },
      {
        id: "wac-3",
        title: "Transfer Intel: Scouting Department's Winter Shortlist",
        date: "June 28, 2026",
        isPremium: true,
        content:
          "An insider look at the three priority targets identified by the scouting network. Positional analysis, contract situations, and the financial framework being discussed by the board.",
      },
    ],
  },
];

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
  premium: string;
  public: string;
  premiumContent: string;
  subscribeTo: string;
  subscribeToUnlock: string;
  readFullPost: string;
  clubhouseOverview: string;
  activeMembersLabel: string;
  publicPosts: string;
  premiumPosts: string;
  locked: string;
  fanPolls: string;
  votingOpen: string;
  becomeVIP: string;
  unlockAll: string;
  viewPlans: string;
  clubNotFound: string;
  clubNotFoundDesc1: string;
  clubNotFoundDesc2: string;
  backToDiscover: string;
}> = {
  en: {
    backToDirectory: "Back to Directory",
    official: "Official",
    activeMembers: "active members",
    postsPublished: "posts published",
    subscribe: "Subscribe",
    clubhouseFeed: "Clubhouse Feed",
    premium: "Premium",
    public: "Public",
    premiumContent: "🔒 Premium Content",
    subscribeTo: "Subscribe to",
    subscribeToUnlock: "Subscribe to Unlock",
    readFullPost: "Read Full Post",
    clubhouseOverview: "Clubhouse Overview",
    activeMembersLabel: "Active Members",
    publicPosts: "Public Posts",
    premiumPosts: "Premium Posts",
    locked: "locked",
    fanPolls: "Fan Polls",
    votingOpen: "VOTING OPEN",
    becomeVIP: "Become a VIP Member",
    unlockAll: "premium posts, live streams, and exclusive matchday content from",
    viewPlans: "View Membership Plans",
    clubNotFound: "Club Not Found",
    clubNotFoundDesc1: "We couldn't find a club matching",
    clubNotFoundDesc2: ". It may not exist yet or the URL is incorrect.",
    backToDiscover: "Back to Discover",
  },
  fr: {
    backToDirectory: "Retour au répertoire",
    official: "Officiel",
    activeMembers: "membres actifs",
    postsPublished: "publications",
    subscribe: "S'abonner",
    clubhouseFeed: "Fil du Clubhouse",
    premium: "Premium",
    public: "Public",
    premiumContent: "🔒 Contenu Premium",
    subscribeTo: "Abonnez-vous à",
    subscribeToUnlock: "S'abonner pour débloquer",
    readFullPost: "Lire l'article complet",
    clubhouseOverview: "Aperçu du Clubhouse",
    activeMembersLabel: "Membres Actifs",
    publicPosts: "Publications Publiques",
    premiumPosts: "Publications Premium",
    locked: "verrouillées",
    fanPolls: "Sondages Fans",
    votingOpen: "VOTE OUVERT",
    becomeVIP: "Devenez Membre VIP",
    unlockAll: "publications premium, streams en direct et contenu exclusif de",
    viewPlans: "Voir les Plans d'Adhésion",
    clubNotFound: "Club introuvable",
    clubNotFoundDesc1: "Nous n'avons pas trouvé de club correspondant à",
    clubNotFoundDesc2: ". Il n'existe peut-être pas encore ou l'URL est incorrecte.",
    backToDiscover: "Retour à la découverte",
  },
  ar: {
    backToDirectory: "العودة إلى الدليل",
    official: "رسمي",
    activeMembers: "أعضاء نشطين",
    postsPublished: "منشورات",
    subscribe: "اشترك",
    clubhouseFeed: "تغذية النادي",
    premium: "مميز",
    public: "عام",
    premiumContent: "🔒 محتوى مميز",
    subscribeTo: "اشترك في",
    subscribeToUnlock: "اشترك لفتح المحتوى",
    readFullPost: "قراءة المنشور كاملاً",
    clubhouseOverview: "نظرة عامة على النادي",
    activeMembersLabel: "الأعضاء النشطين",
    publicPosts: "المنشورات العامة",
    premiumPosts: "المنشورات المميزة",
    locked: "مقفلة",
    fanPolls: "استطلاعات المشجعين",
    votingOpen: "التصويت مفتوح",
    becomeVIP: "كن عضواً مميزاً",
    unlockAll: "منشورات مميزة وبث مباشر ومحتوى حصري من",
    viewPlans: "عرض خطط العضوية",
    clubNotFound: "النادي غير موجود",
    clubNotFoundDesc1: "لم نتمكن من العثور على نادي يطابق",
    clubNotFoundDesc2: ". قد لا يكون موجوداً بعد أو أن الرابط غير صحيح.",
    backToDiscover: "العودة إلى الاكتشاف",
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

  /* ── Look up the club from our mock database ────────────────────── */
  const club = CLUBS_DB.find((c) => c.slug === slug);

  /* ── 404: Club Not Found state ──────────────────────────────────── */
  if (!club) {
    return (
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
    );
  }

  /* ── Convenience aliases ────────────────────────────────────────── */
  const hex = club.primaryColor;
  const publicPosts = club.posts.filter((p) => !p.isPremium);
  const premiumPosts = club.posts.filter((p) => p.isPremium);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="w-full space-y-8">
      <Link 
        href={`/clubs?lang=${lang}`}
        className="mb-4 flex items-center gap-2 text-sm text-text-muted transition-all hover:text-text-dark"
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
                {club.logoText}
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

          {club.posts.map((post) => (
            <article
              key={post.id}
              className="relative overflow-hidden rounded-2xl border border-border-custom bg-neutral-bg shadow-sm transition-shadow duration-300 hover:shadow-md dark:bg-slate-900"
            >
              <div className="p-5 sm:p-6">
                {/* Post header row */}
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      post.isPremium
                        ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400"
                    }`}
                  >
                    {post.isPremium ? (
                      <>
                        <Lock className="h-3 w-3" />
                        {t.premium}
                      </>
                    ) : (
                      t.public
                    )}
                  </span>

                  <span className="flex items-center gap-1 text-[11px] text-text-muted">
                    <Clock className="h-3 w-3" />
                    {post.date}
                  </span>
                </div>

                {/* Post title */}
                <h3 className="font-display text-base font-bold text-text-dark dark:text-white sm:text-lg">
                  {post.title}
                </h3>

                {/* Post body — conditional render */}
                {post.isPremium ? (
                  /* ── LOCKED STATE ─────────────────────────────── */
                  <div className="relative mt-4">
                    {/* Blurred preview text */}
                    <p className="select-none text-sm leading-relaxed text-text-muted blur-[5px]">
                      {post.content}
                    </p>

                    {/* Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-neutral-bg/60 px-6 text-center backdrop-blur-sm dark:bg-slate-900/60">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full shadow-sm"
                        style={{ backgroundColor: `${hex}15`, border: `1px solid ${hex}30` }}
                      >
                        <LockKeyhole className="h-4 w-4" style={{ color: hex }} />
                      </div>
                      <span className="mt-3 text-xs font-extrabold uppercase tracking-wider text-text-dark dark:text-white">
                        {t.premiumContent}
                      </span>
                      <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-text-muted">
                        {t.subscribeTo} {club.name} to unlock exclusive posts,
                        videos, and tactical breakdowns.
                      </p>
                      <Link href={`/clubs/${slug}/subscribe?lang=${lang}`} className="mt-4">
                        <Button
                          size="sm"
                          className="gap-1.5 text-xs font-bold text-white shadow-sm"
                          style={{ backgroundColor: hex }}
                        >
                          {t.subscribeToUnlock}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* ── UNLOCKED STATE ───────────────────────────── */
                  <div className="mt-3">
                    <p className="text-sm leading-relaxed text-text-muted">
                      {post.content}
                    </p>
                    <div className="mt-4 border-t border-border-custom pt-3">
                      <Link href={`/clubs/${slug}/posts/${post.id}?lang=${lang}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-xs font-bold"
                          style={{ color: hex }}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          {t.readFullPost}
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
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
                  {publicPosts.length}
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-border-custom pb-3">
                <dt className="text-text-muted">{t.premiumPosts}</dt>
                <dd className="font-bold" style={{ color: hex }}>
                  {premiumPosts.length} {t.locked}
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
            <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
              Unlock all {premiumPosts.length} {t.unlockAll} {club.name}.
            </p>
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
  );
}
