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

const countryTranslations: Record<string, Record<string, string>> = {
  en: {
    "Morocco": "Morocco",
    "Egypt": "Egypt",
    "Algeria": "Algeria",
    "Tunisia": "Tunisia",
    "Senegal": "Senegal",
    "Nigeria": "Nigeria",
    "Ivory Coast": "Ivory Coast",
    "Cameroon": "Cameroon",
    "Ghana": "Ghana",
    "South Africa": "South Africa",
    "DR Congo": "DR Congo",
    "Mali": "Mali",
    "Angola": "Angola",
    "France": "France",
    "Spain": "Spain",
    "United Kingdom": "United Kingdom",
    "Germany": "Germany",
    "Italy": "Italy",
    "Portugal": "Portugal",
    "Netherlands": "Netherlands",
    "Belgium": "Belgium",
    "Turkey": "Turkey",
    "Croatia": "Croatia",
    "Switzerland": "Switzerland",
    "Denmark": "Denmark",
    "Saudi Arabia": "Saudi Arabia"
  },
  fr: {
    "Morocco": "Maroc",
    "Egypt": "Égypte",
    "Algeria": "Algérie",
    "Tunisia": "Tunisie",
    "Senegal": "Sénégal",
    "Nigeria": "Nigeria",
    "Ivory Coast": "Côte d'Ivoire",
    "Cameroon": "Cameroun",
    "Ghana": "Ghana",
    "South Africa": "Afrique du Sud",
    "DR Congo": "RD Congo",
    "Mali": "Mali",
    "Angola": "Angola",
    "France": "France",
    "Spain": "Espagne",
    "United Kingdom": "Royaume-Uni",
    "Germany": "Allemagne",
    "Italy": "Italie",
    "Portugal": "Portugal",
    "Netherlands": "Pays-Bas",
    "Belgium": "Belgique",
    "Turkey": "Turquie",
    "Croatia": "Croatie",
    "Switzerland": "Suisse",
    "Denmark": "Danemark",
    "Saudi Arabia": "Arabie Saoudite"
  },
  ar: {
    "Morocco": "المغرب",
    "Egypt": "مصر",
    "Algeria": "الجزائر",
    "Tunisia": "تونس",
    "Senegal": "السنغال",
    "Nigeria": "نيجيريا",
    "Ivory Coast": "ساحل العاج",
    "Cameroon": "الكاميرون",
    "Ghana": "غانا",
    "South Africa": "جنوب أفريقيا",
    "DR Congo": "جمهورية الكونغو الديمقراطية",
    "Mali": "مالي",
    "Angola": "أنغولا",
    "France": "فرنسا",
    "Spain": "إسبانيا",
    "United Kingdom": "المملكة المتحدة",
    "Germany": "ألمانيا",
    "Italy": "إيطاليا",
    "Portugal": "البرتغال",
    "Netherlands": "هولندا",
    "Belgium": "بلجيكا",
    "Turkey": "تركيا",
    "Croatia": "كرواتيا",
    "Switzerland": "سويسرا",
    "Denmark": "الدنمارك",
    "Saudi Arabia": "المملكة العربية السعودية"
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
  country?: string;
}

function ClubsDirectoryClientContent({ clubs }: { clubs: Club[] }) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const lang = searchParams.get("lang") || "en";

  const t = dict[lang] || dict.en;

  const [selectedCountry, setSelectedCountry] = React.useState("All");

  React.useEffect(() => {
    const countryParam = searchParams.get("country");
    if (countryParam) {
      setSelectedCountry(countryParam);
    } else {
      setSelectedCountry("All");
    }
  }, [searchParams]);

  const uniqueCountries = Array.from(
    new Set(clubs.map((c) => c.country || "Morocco"))
  ).filter(Boolean) as string[];

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch = searchQuery
      ? club.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCountry = selectedCountry === "All"
      ? true
      : (club.country || "Morocco") === selectedCountry;
    return matchesSearch && matchesCountry;
  });

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

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <form method="GET" className="relative flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className={`absolute ${lang === 'ar' ? 'right-3.5' : 'left-3.5'} top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted`} />
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder={t.placeholder}
                className={`w-full rounded-xl border border-border-custom bg-neutral-bg py-2.5 ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm text-text-dark dark:text-slate-100 placeholder:text-text-muted shadow-sm transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 dark:bg-slate-900`}
              />
              <input type="hidden" name="lang" value={lang} />
              {selectedCountry !== "All" && (
                <input type="hidden" name="country" value={selectedCountry} />
              )}
            </div>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              {t.searchButton}
            </button>
          </form>

          {/* Country filter dropdown */}
          <div className="w-full sm:w-48">
            <select
              value={selectedCountry}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCountry(val);
                
                // Update URL params smoothly
                const params = new URLSearchParams(window.location.search);
                if (val === "All") {
                  params.delete("country");
                } else {
                  params.set("country", val);
                }
                const newRelativePathQuery = window.location.pathname + '?' + params.toString();
                window.history.pushState(null, '', newRelativePathQuery);
              }}
              className="w-full rounded-xl border border-border-custom bg-neutral-bg dark:bg-slate-900 py-2.5 px-4 text-sm text-text-dark dark:text-white placeholder:text-text-muted shadow-sm transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 cursor-pointer"
            >
              <option value="All">
                {lang === "ar" ? "كل الدول" : lang === "fr" ? "Tous les pays" : "All Countries"}
              </option>
              {uniqueCountries.map((c) => {
                const label = countryTranslations[lang]?.[c] || c;
                return (
                  <option key={c} value={c}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
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
                      {club.city}, {countryTranslations[lang]?.[club.country || "Morocco"] || club.country || t.morocco}
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
