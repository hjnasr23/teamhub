import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LockKeyhole,
  Play,
  FileText,
  Users,
  Calendar,
  ArrowRight,
  Clock,
  Lock,
  ChevronRight,
  MapPin,
  Flame,
  Award,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CLUB_DATA: Record<
  string,
  {
    name: string;
    initials: string;
    subscribers: string;
    bannerGradient: string;
    brandColor: string;
    brandHoverColor: string;
    brandTextColor: string;
    brandBorderColor: string;
    brandBgLight: string;
    brandShadow: string;
    founded: string;
    city: string;
    stadium: string;
  }
> = {
  "wydad-ac": {
    name: "Wydad AC",
    initials: "WAC",
    subscribers: "14.2K",
    bannerGradient: "from-red-700 via-red-900 to-neutral-bg-alt dark:to-slate-950",
    brandColor: "bg-red-650",
    brandHoverColor: "hover:bg-red-600",
    brandTextColor: "text-red-600 dark:text-red-400",
    brandBorderColor: "border-red-500/20 dark:border-red-900/40",
    brandBgLight: "bg-red-50 dark:bg-red-950/20",
    brandShadow: "shadow-red-500/10 dark:shadow-red-550/5",
    founded: "1937",
    city: "Casablanca",
    stadium: "Stade Mohamed V",
  },
  "raja-ca": {
    name: "Raja CA",
    initials: "RCA",
    subscribers: "18.5K",
    bannerGradient: "from-emerald-700 via-emerald-900 to-neutral-bg-alt dark:to-slate-950",
    brandColor: "bg-emerald-650",
    brandHoverColor: "hover:bg-emerald-600",
    brandTextColor: "text-emerald-600 dark:text-emerald-400",
    brandBorderColor: "border-emerald-500/20 dark:border-emerald-900/40",
    brandBgLight: "bg-emerald-50 dark:bg-emerald-950/20",
    brandShadow: "shadow-emerald-500/10 dark:shadow-emerald-550/5",
    founded: "1949",
    city: "Casablanca",
    stadium: "Stade Mohamed V",
  },
  default: {
    name: "Club Athletic",
    initials: "ATH",
    subscribers: "5.4K",
    bannerGradient: "from-slate-700 via-slate-900 to-neutral-bg-alt dark:to-slate-950",
    brandColor: "bg-slate-800",
    brandHoverColor: "hover:bg-slate-700",
    brandTextColor: "text-slate-800 dark:text-slate-350",
    brandBorderColor: "border-slate-500/20",
    brandBgLight: "bg-slate-50 dark:bg-slate-800/40",
    brandShadow: "shadow-slate-500/10",
    founded: "2024",
    city: "Rabat",
    stadium: "Prince Moulay Abdellah Stadium",
  },
};

export default async function ClubPage({ params }: PageProps) {
  const { slug } = await params;
  const club = CLUB_DATA[slug] || CLUB_DATA.default;

  const feedPosts = [
    {
      id: "post-1",
      title: "Official Matchday Squad Announcement",
      time: "2 hours ago",
      type: "Announcement",
      readTime: "3 min read",
      isLocked: false,
      excerpt:
        "The manager has selected the 22-man squad traveling for tomorrow's crucial derby fixture. The list includes the return of our starting playmaker after recovering from training injury.",
      content: (
        <div className="mt-4 rounded-xl border border-border-custom bg-neutral-bg-alt p-4">
          <div className="flex items-center justify-between border-b border-border-custom pb-2.5">
            <span className="text-xs font-semibold text-text-dark">Lineup Roster</span>
            <span className="text-[10px] text-text-muted">Updated today</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-semibold text-text-dark">Goalkeepers:</span>
              <p className="text-text-muted">1. Zniti (C), 12. Hada</p>
            </div>
            <div>
              <span className="font-semibold text-text-dark">Defenders:</span>
              <p className="text-text-muted">3. Madkour, 5. Harkass, 24. Hadhoudi</p>
            </div>
            <div className="col-span-2 mt-2">
              <span className="font-semibold text-text-dark">Midfielders & Forwards:</span>
              <p className="text-text-muted">8. Zrida, 10. Bouzok, 17. Khabba, 21. Rahimi</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "post-2",
      title: "Exclusive: Pre-Match Locker Room Video Interview",
      time: "5 hours ago",
      type: "Video Access",
      readTime: "8 min stream",
      isLocked: true,
      excerpt:
        "Listen to the captain's raw motivation speech inside the locker room and his exclusive response to the pre-game press criticism. Get an inside look at the tactical board notes before walkout.",
      previewBlur: true,
    },
    {
      id: "post-3",
      title: "Tactical Breakdown Analysis & Coach's Private Strategy Notes",
      time: "Yesterday",
      type: "Tactical Analysis",
      readTime: "12 min read",
      isLocked: true,
      excerpt:
        "An in-depth whiteboard strategy breakdown deconstructing our transition pressing patterns, set-piece triggers, and the blueprint targeted to exploit the opponent's wingback vulnerabilities.",
      previewBlur: true,
    },
  ];

  return (
    <div className="w-full">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  HEADER BANNER SECTION                                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl border border-border-custom bg-neutral-bg shadow-sm">
        {/* Cover Graphic / Gradient mesh */}
        <div
          className={`h-48 w-full bg-gradient-to-tr ${club.bannerGradient} opacity-90 sm:h-64`}
        >
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg via-transparent to-transparent opacity-95 dark:from-slate-900" />
        </div>

        {/* Profile Branding overlay */}
        <div className="relative px-6 pb-8 pt-0 sm:px-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:gap-6">
            {/* Crest Logo Avatar (floats halfway up the banner border line) */}
            <div
              className={`-mt-12 flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-neutral-bg bg-neutral-bg font-display text-2xl font-black shadow-lg sm:-mt-16 sm:h-28 sm:w-28 dark:border-slate-900`}
            >
              <div
                className={`flex h-full w-full items-center justify-center rounded-xl text-white ${club.brandColor} ${club.brandShadow}`}
              >
                {club.initials}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold tracking-tight text-text-dark dark:text-white sm:text-3xl">
                  {club.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <Flame className="h-3 w-3" />
                  Official Hub
                </span>
              </div>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-text-muted" />
                  <strong>{club.subscribers}</strong> Active Members
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-text-muted" />
                  {club.city}, Morocco
                </span>
                <span className="flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-text-muted" />
                  Est. {club.founded}
                </span>
              </div>
            </div>

            {/* CTA Tier Subscribe */}
            <Link href={`/clubs/${slug}/subscribe`} className="w-full sm:w-auto">
              <Button
                className={`group w-full gap-2 text-xs font-bold text-white shadow-md ${club.brandColor} ${club.brandHoverColor} ${club.brandShadow}`}
              >
                Become VIP Member
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  CONTENT WALL FEED & INFO SECTION                           */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Posts feed (Patreon style) */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-text-dark dark:text-white">
              Clubhouse Feed
            </h2>
            <span className="text-xs text-text-muted">Showing latest updates</span>
          </div>

          <div className="space-y-5">
            {feedPosts.map((post) => (
              <div
                key={post.id}
                className="relative rounded-2xl border border-border-custom bg-neutral-bg p-5 shadow-sm transition-all hover:border-border-custom/80 dark:bg-slate-900"
              >
                {/* Meta header */}
                <div className="flex items-center justify-between border-b border-border-custom pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        post.isLocked
                          ? "bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                      }`}
                    >
                      {post.isLocked ? "Premium" : "Public"}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-text-muted">
                      <Clock className="h-3 w-3" />
                      {post.time}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-text-muted">
                    {post.readTime}
                  </span>
                </div>

                {/* Post Info */}
                <div className="mt-4">
                  <h3 className="flex items-start gap-2 font-display text-base font-bold text-text-dark dark:text-white">
                    {post.isLocked && (
                      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    )}
                    {post.title}
                  </h3>

                  {/* Excerpt with potential blur if locked */}
                  <p
                    className={`mt-2 text-xs leading-relaxed text-text-muted ${
                      post.isLocked ? "select-none blur-[2px]" : ""
                    }`}
                  >
                    {post.excerpt}
                  </p>

                  {/* Render content structure */}
                  {post.content}

                  {/* Locked CTA overlay container */}
                  {post.isLocked && (
                    <div className="absolute inset-x-0 bottom-0 top-[60px] flex flex-col items-center justify-center rounded-b-2xl bg-neutral-bg/40 px-6 py-4 text-center backdrop-blur-[3px] dark:bg-slate-900/40">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 border border-amber-200 shadow-sm dark:bg-amber-950/30 dark:border-amber-900/40">
                        <LockKeyhole className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <span className="mt-2 text-xs font-extrabold uppercase tracking-wider text-text-dark dark:text-white">
                        Premium Member Locked Post
                      </span>
                      <p className="mt-1 max-w-xs text-[10px] text-text-muted leading-relaxed">
                        Join the dynamic digital membership of {club.name} to
                        instantly unlock videos, live feed, and tactical journals.
                      </p>
                      <Link href={`/clubs/${slug}/subscribe`} className="mt-4">
                        <Button
                          size="sm"
                          className={`gap-2 text-[10px] font-bold text-white shadow-sm h-8 px-4 ${club.brandColor} ${club.brandHoverColor} ${club.brandShadow}`}
                        >
                          Subscribe to Unlock
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Bottom details for unlocked post */}
                  {!post.isLocked && (
                    <div className="mt-5 flex items-center justify-between border-t border-border-custom pt-3.5">
                      <span className="text-[11px] font-medium text-text-muted">
                        Format: <span className="font-semibold text-text-dark dark:text-white">{post.type}</span>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-1.5 text-xs font-bold ${club.brandTextColor} hover:bg-neutral-bg-alt`}
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        Access Post
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Club Status/Details */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border-custom bg-neutral-bg p-6 shadow-sm dark:bg-slate-900">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-text-dark dark:text-white mb-4">
              Clubhouse Status
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b border-border-custom pb-2.5">
                <span className="text-text-muted">Active VIP Members</span>
                <span className="font-bold text-text-dark dark:text-white">
                  {club.subscribers}
                </span>
              </div>
              <div className="flex justify-between border-b border-border-custom pb-2.5">
                <span className="text-text-muted">Premium Posts</span>
                <span className="font-bold text-text-dark dark:text-white">120+</span>
              </div>
              <div className="flex justify-between border-b border-border-custom pb-2.5">
                <span className="text-text-muted">Stadium Location</span>
                <span className="font-semibold text-text-dark dark:text-white truncate max-w-[150px]">
                  {club.stadium}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Fan Voting Status</span>
                <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                  ACTIVE POLLS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
