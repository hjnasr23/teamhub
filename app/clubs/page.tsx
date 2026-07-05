import Link from "next/link";
import { Search, Users, ArrowRight, MapPin, Trophy } from "lucide-react";

/* ════════════════════════════════════════════════════════════════════
 *  MOCK DATABASE — all registered clubs on the platform.
 *  Each entry maps directly to a future DB row / API response.
 * ════════════════════════════════════════════════════════════════════ */

interface Club {
  name: string;
  slug: string;
  city: string;
  logoInitials: string;
  primaryColor: string; // hex
  subscribersCount: string;
}

const CLUBS_DB: Club[] = [
  {
    name: "Raja CA",
    slug: "raja-ca",
    city: "Casablanca",
    logoInitials: "RCA",
    primaryColor: "#16A34A",
    subscribersCount: "18.5K",
  },
  {
    name: "Wydad AC",
    slug: "wydad-ac",
    city: "Casablanca",
    logoInitials: "WAC",
    primaryColor: "#DC2626",
    subscribersCount: "14.2K",
  },
  {
    name: "AS FAR",
    slug: "as-far",
    city: "Rabat",
    logoInitials: "FAR",
    primaryColor: "#000000",
    subscribersCount: "9.1K",
  },
  {
    name: "Ittihad Tanger",
    slug: "irt-tanger",
    city: "Tangier",
    logoInitials: "IRT",
    primaryColor: "#1E40AF",
    subscribersCount: "6.8K",
  },
  {
    name: "FUS Rabat",
    slug: "fus-rabat",
    city: "Rabat",
    logoInitials: "FUS",
    primaryColor: "#7C3AED",
    subscribersCount: "5.3K",
  },
  {
    name: "RS Berkane",
    slug: "rs-berkane",
    city: "Berkane",
    logoInitials: "RSB",
    primaryColor: "#EA580C",
    subscribersCount: "4.7K",
  },
];

/* ════════════════════════════════════════════════════════════════════
 *  PAGE COMPONENT
 * ════════════════════════════════════════════════════════════════════ */

export default function ClubsDirectoryPage() {
  return (
    <div className="w-full space-y-10">
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
              Discover Club Hubs
            </h1>
          </div>
        </div>
        <p className="max-w-lg text-sm leading-relaxed text-text-muted">
          Explore and officially subscribe to your favourite club&apos;s digital
          membership portal. Unlock exclusive content, behind-the-scenes access,
          and VIP community forums.
        </p>

        {/* Search bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search clubs by name or city..."
            className="w-full rounded-xl border border-border-custom bg-neutral-bg py-2.5 pl-10 pr-4 text-sm text-text-dark placeholder:text-text-muted shadow-sm transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 dark:bg-slate-900"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  CLUBS GRID                                                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {CLUBS_DB.length} Clubs Available
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CLUBS_DB.map((club) => (
            <Link
              key={club.slug}
              href={`/clubs/${club.slug}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-border-custom bg-neutral-bg p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900"
            >
              {/* Top row: avatar + metadata */}
              <div>
                <div className="mb-4 flex items-start justify-between">
                  {/* Geometric initial badge */}
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
                    style={{ backgroundColor: club.primaryColor }}
                  >
                    {club.logoInitials}
                  </div>

                  {/* Subscriber pill */}
                  <div className="flex items-center gap-1.5 rounded-full border border-border-custom bg-neutral-bg-alt px-2.5 py-1 text-[11px] font-medium text-text-muted">
                    <Users className="h-3 w-3" />
                    {club.subscribersCount}
                  </div>
                </div>

                {/* Club name */}
                <h3 className="font-display text-base font-bold text-text-dark dark:text-white">
                  {club.name}
                </h3>

                {/* City */}
                <span className="mt-1 flex items-center gap-1 text-xs text-text-muted">
                  <MapPin className="h-3 w-3" />
                  {club.city}, Morocco
                </span>
              </div>

              {/* Bottom CTA */}
              <div className="mt-5 flex items-center justify-between border-t border-border-custom pt-4">
                <span className="text-xs font-semibold text-emerald-600 transition-colors group-hover:text-emerald-500 dark:text-emerald-400 dark:group-hover:text-emerald-300">
                  Visit Hub
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-600 transition-transform group-hover:translate-x-1 dark:text-emerald-400" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
