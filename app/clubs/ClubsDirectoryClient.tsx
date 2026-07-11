"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Search, Users, ArrowRight, MapPin, Trophy, Shield } from "lucide-react";
import { useSearchParams } from "next/navigation";

const isValidUrl = (url: string | null | undefined) => {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
};

const dict: Record<
  string,
  {
    title: string;
    subtitle: string;
    placeholder: string;
    searchButton: string;
    empty: string;
    button: string;
    available: string;
    morocco: string;
  }
> = {
  en: {
    title: "Discover Clubs",
    subtitle: "Explore and officially subscribe to your favourite club's digital membership portal. Unlock exclusive content, behind-the-scenes access, and VIP community forums.",
    placeholder: "Search clubs...",
    searchButton: "Search",
    empty: "No clubs found",
    button: "Join Club",
    available: "Clubs Available",
    morocco: "Morocco"
  },
  fr: {
    title: "Découvrir les Clubs",
    subtitle: "Explorez et abonnez-vous officiellement au portail d'adhésion numérique de votre club préféré. Débloquez du contenu exclusif, un accès aux coulisses et des forums communautaires VIP.",
    placeholder: "Rechercher des clubs...",
    searchButton: "Rechercher",
    empty: "Aucun club trouvé",
    button: "Rejoindre",
    available: "Clubs Disponibles",
    morocco: "Maroc"
  },
  ar: {
    title: "اكتشف الأندية",
    subtitle: "استكشف واشترك رسمياً في بوابة العضوية الرقمية لناديك المفضل. افتح المحتوى الحصري، والوصول إلى الكواليس، ومنتديات المجتمع لكبار الشخصيات.",
    placeholder: "ابحث عن الأندية...",
    searchButton: "بحث",
    empty: "لم يتم العثور على أندية",
    button: "انضم للنادي",
    available: "أندية متاحة",
    morocco: "المغرب"
  }
};

interface Club {
  id: string;
  name: string;
  slug: string;
  city: string;
  subscribersCount: number;
  primaryColor: string;
  secondaryColor: string;
  logoInitials: string;
  logoUrl: string | null;
  bannerUrl: string | null;
}

function ClubsDirectoryClientContent({ clubs }: { clubs: Club[] }) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const lang = searchParams.get("lang") || "en";

  const t = dict[lang] || dict.en;

  const filteredClubs = searchQuery
    ? clubs.filter((club) =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clubs;

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} className="pt-32 min-h-screen bg-neutral-bg px-4 md:px-8 space-y-10 w-full max-w-7xl mx-auto">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  PAGE HEADER                                               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-custom bg-neutral-bg shadow-sm">
            <Trophy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-text-dark sm:text-3xl">
              {t.title}
            </h1>
          </div>
        </div>
        <p className="max-w-lg text-sm leading-relaxed text-text-muted">
          {t.subtitle}
        </p>

        {/* Search bar Form */}
        <form method="GET" className="relative flex max-w-md gap-2">
          <div className="relative flex-1">
            <Search className={`absolute ${lang === 'ar' ? 'right-3.5' : 'left-3.5'} top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted`} />
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder={t.placeholder}
              className={`w-full rounded-xl border border-border-custom bg-neutral-bg py-2.5 ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm text-text-dark placeholder:text-text-muted shadow-sm transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 dark:bg-slate-900`}
            />
            <input type="hidden" name="lang" value={lang} />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors cursor-pointer"
          >
            {t.searchButton}
          </button>
        </form>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  CLUBS GRID                                                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {filteredClubs.length} {t.available}
          </span>
        </div>

        {filteredClubs.length === 0 ? (
          <div className="py-12 text-center text-text-muted border border-border-custom rounded-2xl bg-neutral-bg-alt">
            <Trophy className="mx-auto h-8 w-8 opacity-20 mb-3" />
            <p>{t.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredClubs.map((club) => {
              const formattedSubs = club.subscribersCount >= 1000
                ? `${(club.subscribersCount / 1000).toFixed(1)}K`
                : club.subscribersCount.toString();

              return (
                <Link
                  key={club.slug}
                  href={`/clubs/${club.slug}?lang=${lang}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border-custom bg-neutral-bg p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900"
                >
                  {/* Top row: avatar + metadata */}
                  <div>
                    <div className="mb-4 flex items-start justify-between">
                      {/* Geometric initial badge or image logo */}
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm overflow-hidden bg-slate-200"
                        style={{ backgroundColor: club.primaryColor }}
                      >
                        {isValidUrl(club.logoUrl) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={club.logoUrl!} alt={club.name} className="h-full w-full object-cover" />
                        ) : (
                          <Shield className="h-5 w-5 text-white" />
                        )}
                      </div>

                      {/* Subscriber pill */}
                      <div className="flex items-center gap-1.5 rounded-full border border-border-custom bg-neutral-bg-alt px-2.5 py-1 text-[11px] font-medium text-text-muted">
                        <Users className="h-3 w-3" />
                        {formattedSubs}
                      </div>
                    </div>

                    {/* Club name */}
                    <h3 className="font-display text-base font-bold text-text-dark dark:text-white">
                      {club.name}
                    </h3>

                    {/* City */}
                    <span className="mt-1 flex items-center gap-1 text-xs text-text-muted">
                      <MapPin className="h-3 w-3" />
                      {club.city}, {t.morocco}
                    </span>
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-5 flex items-center justify-between border-t border-border-custom pt-4">
                    <span className="text-xs font-semibold text-emerald-600 transition-colors group-hover:text-emerald-500 dark:text-emerald-400 dark:group-hover:text-emerald-300">
                      {t.button}
                    </span>
                    <ArrowRight className={`h-3.5 w-3.5 text-emerald-600 transition-transform ${lang === 'ar' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'} dark:text-emerald-400`} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default function ClubsDirectoryClient({ clubs }: { clubs: Club[] }) {
  return (
    <Suspense fallback={<div className="pt-32 min-h-screen bg-neutral-bg w-full" />}>
      <ClubsDirectoryClientContent clubs={clubs} />
    </Suspense>
  );
}
