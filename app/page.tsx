import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Coins,
  Users,
  Trophy,
  ChevronRight,
  Play,
  Star,
  CircleDollarSign,
  Lock,
  Zap,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function MarketingPage() {
  const featuredClubs = [
    {
      id: "club-1",
      name: "Wydad AC",
      slug: "wydad-ac",
      description:
        "Join the official digital membership of the Red Castle and access exclusive locker room feeds.",
      membersCount: "145K",
      initials: "WAC",
      accentBg: "bg-red-50 dark:bg-red-950/20",
      accentText: "text-red-600 dark:text-red-400",
      accentBorder: "border-red-100 dark:border-red-900/50",
      dotColor: "bg-red-500",
    },
    {
      id: "club-2",
      name: "Raja CA",
      slug: "raja-ca",
      description:
        "Connect with the Green Eagles. Vote in player polls and read captains' training journals.",
      membersCount: "138K",
      initials: "RCA",
      accentBg: "bg-emerald-50 dark:bg-emerald-950/20",
      accentText: "text-emerald-600 dark:text-emerald-400",
      accentBorder: "border-emerald-100 dark:border-emerald-900/50",
      dotColor: "bg-emerald-500",
    },
    {
      id: "club-3",
      name: "Ittihad Tanger",
      slug: "ittihad-tanger",
      description:
        "Unlock premium video streams and behind-the-scenes diaries from the blue city's pride.",
      membersCount: "42K",
      initials: "IRT",
      accentBg: "bg-blue-50 dark:bg-blue-950/20",
      accentText: "text-blue-600 dark:text-blue-400",
      accentBorder: "border-blue-100 dark:border-blue-900/50",
      dotColor: "bg-blue-500",
    },
    {
      id: "club-4",
      name: "AS FAR Rabat",
      slug: "as-far",
      description:
        "Support the Military Club. Unlock exclusive merchandise drops and matchday forums.",
      membersCount: "89K",
      initials: "FAR",
      accentBg: "bg-amber-50 dark:bg-amber-950/20",
      accentText: "text-amber-600 dark:text-amber-400",
      accentBorder: "border-amber-100 dark:border-amber-900/50",
      dotColor: "bg-amber-500",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: Trophy,
      title: "Choose Your Club",
      description:
        "Browse our roster of official clubs and find the team that makes your heart race on match day.",
      accentBg: "bg-emerald-50 dark:bg-emerald-950/30",
      accentBorder: "border-emerald-100 dark:border-emerald-900/40",
      accentText: "text-emerald-600 dark:text-emerald-400",
      numberColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      number: "02",
      icon: CircleDollarSign,
      title: "Subscribe Securely",
      description:
        "Join officially for 50 MAD / month. Payments processed with bank-grade encryption via Stripe.",
      accentBg: "bg-sky-50 dark:bg-sky-950/30",
      accentBorder: "border-sky-100 dark:border-sky-900/40",
      accentText: "text-sky-600 dark:text-sky-400",
      numberColor: "text-sky-600 dark:text-sky-400",
    },
    {
      number: "03",
      icon: Lock,
      title: "Unlock Exclusive Access",
      description:
        "Dive into subscriber-only posts, behind-the-scenes footage, live Q&As, and members-only drops.",
      accentBg: "bg-violet-50 dark:bg-violet-950/30",
      accentBorder: "border-violet-100 dark:border-violet-900/40",
      accentText: "text-violet-600 dark:text-violet-400",
      numberColor: "text-violet-600 dark:text-violet-400",
    },
  ];

  const pricingFeatures = [
    "Access exclusive subscriber-only posts",
    "Direct forum interaction with players",
    "Official club digital badge & profile",
    "Behind-the-scenes video content",
    "Priority matchday notifications",
    "Members-only merch drops & discounts",
  ];

  return (
    <div className="min-h-screen transition-colors duration-300">
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
        <section className="pb-20 pt-12 md:pb-28 md:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            {/* Pill badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>The #1 Sports SaaS Fan Platform</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-text-dark sm:text-5xl md:text-6xl md:leading-[1.1]">
              Monetize Your Club's{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                Fan Community
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
              Exclusive content, live streams, members-only drops, and VIP
              forums — all under your own brand. Powered by{" "}
              <span className="font-semibold text-text-dark">TEAMHUB</span>.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  className="group w-full gap-2.5 bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/25 sm:w-auto"
                >
                  Create Your Club Hub
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/admin/real-madrid">
                <Button
                  size="lg"
                  variant="outline"
                  className="group w-full gap-2.5 font-semibold sm:w-auto"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Live Demo
                </Button>
              </Link>
            </div>

            {/* Quick dev links */}
            <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-2xl border border-border-custom bg-neutral-bg px-5 py-3 text-xs text-text-muted shadow-sm">
              <span className="font-semibold text-text-dark">Dev Links:</span>
              <Link
                href="/super-admin"
                className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Super Admin
              </Link>
              <span className="text-border-custom">•</span>
              <Link
                href="/admin/real-madrid"
                className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Club Dashboard
              </Link>
              <span className="text-border-custom">•</span>
              <Link
                href="/real-madrid"
                className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Fan Page
              </Link>
              <span className="text-border-custom">•</span>
              <Link
                href="/real-madrid/subscribe"
                className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Checkout
              </Link>
            </div>
          </div>

          {/* Social proof stats */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border-custom bg-border-custom shadow-sm sm:grid-cols-3">
            {[
              { value: "150+", label: "Active Sports Clubs" },
              { value: "10M+", label: "Registered Fans", highlight: true },
              { value: "$8.5M+", label: "Revenue Paid Out" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-bg px-6 py-6 text-center transition-colors"
              >
                <div
                  className={`font-display text-3xl font-extrabold tracking-tight ${
                    stat.highlight
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-text-dark"
                  }`}
                >
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-text-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/*  FEATURED CLUBS GRID                                        */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text-dark sm:text-3xl">
              Featured Clubs
            </h2>
            <p className="mt-3 text-sm text-text-muted sm:text-base">
              Explore the official hubs of Morocco's top athletic associations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredClubs.map((club) => (
              <Link
                key={club.id}
                href={`/clubs/${club.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-border-custom bg-neutral-bg p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800/50"
              >
                {/* Header: Avatar + Member count */}
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-bold ${club.accentBg} ${club.accentText} ${club.accentBorder}`}
                    >
                      {club.initials}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-muted">
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${club.dotColor}`}
                      />
                      {club.membersCount} fans
                    </div>
                  </div>

                  <h3 className="font-display text-base font-bold text-text-dark">
                    {club.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
                    {club.description}
                  </p>
                </div>

                {/* Footer CTA */}
                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  View Hub
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/*  HOW IT WORKS                                                */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text-dark sm:text-3xl">
              How It Works
            </h2>
            <p className="mt-3 text-sm text-text-muted sm:text-base">
              Three simple steps to join your favourite club's digital inner
              circle.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="group relative rounded-2xl border border-border-custom bg-neutral-bg p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Step number */}
                  <span
                    className={`font-display text-5xl font-extrabold ${step.numberColor} opacity-10 absolute right-6 top-4 select-none`}
                  >
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div
                    className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border ${step.accentBg} ${step.accentBorder} transition-transform duration-200 group-hover:scale-110`}
                  >
                    <Icon className={`h-5 w-5 ${step.accentText}`} />
                  </div>

                  <h3 className="font-display text-base font-bold text-text-dark">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {step.description}
                  </p>

                  {/* Connector line — visible on desktop between cards */}
                  {index < steps.length - 1 && (
                    <div className="pointer-events-none absolute -right-3 top-1/2 hidden h-px w-6 bg-border-custom md:block" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/*  PRICING                                                     */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text-dark sm:text-3xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-3 text-sm text-text-muted sm:text-base">
              One membership. Full access. No hidden fees — ever.
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <div className="relative overflow-hidden rounded-3xl border border-border-custom bg-neutral-bg shadow-sm transition-shadow duration-300 hover:shadow-lg">
              {/* Top accent gradient */}
              <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

              <div className="p-8 sm:p-10">
                {/* Badge */}
                <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <Zap className="h-3.5 w-3.5" />
                  Most Popular
                </div>

                {/* Plan name */}
                <h3 className="font-display text-xl font-bold text-text-dark">
                  Digital Fan Membership
                </h3>
                <p className="mt-1 text-sm text-text-muted">
                  Everything you need to stay connected to your club.
                </p>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-extrabold tracking-tight text-text-dark">
                    50
                  </span>
                  <span className="text-sm font-semibold text-text-muted">
                    MAD / month
                  </span>
                </div>
                <p className="mt-2 text-xs text-text-muted">
                  or{" "}
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    500 MAD / year
                  </span>{" "}
                  <span className="ml-1 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-400">
                    Save 17%
                  </span>
                </p>

                {/* Divider */}
                <div className="my-8 h-px bg-border-custom" />

                {/* Features */}
                <ul className="space-y-4">
                  {pricingFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-text-dark"
                    >
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href="/" className="mt-10 block">
                  <Button
                    size="lg"
                    className="group w-full gap-2 bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/25"
                  >
                    Choose Your Club to Subscribe
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/*  FEATURES / VALUE PROPS                                      */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text-dark sm:text-3xl">
              Everything Your Club Needs to Grow
            </h2>
            <p className="mt-3 text-sm text-text-muted sm:text-base">
              Scale subscription revenue, connect deeply with fans, and manage
              everything from one dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                icon: Coins,
                title: "Subscription Tiers",
                description:
                  "Create tiered fan subscriptions (Bronze, Silver, Gold VIP) with recurring payments and customized member perks.",
                accentBg: "bg-emerald-50 dark:bg-emerald-950/30",
                accentBorder:
                  "border-emerald-100 dark:border-emerald-900/40",
                accentText: "text-emerald-600 dark:text-emerald-400",
              },
              {
                icon: Shield,
                title: "Paywalled Content",
                description:
                  "Lock premium videos, live press-conferences, and interview podcasts. High quality streams for active subscribers only.",
                accentBg: "bg-sky-50 dark:bg-sky-950/30",
                accentBorder: "border-sky-100 dark:border-sky-900/40",
                accentText: "text-sky-600 dark:text-sky-400",
              },
              {
                icon: Users,
                title: "Fan Engagement Portal",
                description:
                  "Allow fans to comment on announcements, vote in matchday polls, and chat in a moderated clubhouse forum.",
                accentBg: "bg-violet-50 dark:bg-violet-950/30",
                accentBorder:
                  "border-violet-100 dark:border-violet-900/40",
                accentText: "text-violet-600 dark:text-violet-400",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-border-custom bg-neutral-bg p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    className={`mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${feature.accentBg} ${feature.accentBorder} transition-transform duration-200 group-hover:scale-110`}
                  >
                    <Icon className={`h-5 w-5 ${feature.accentText}`} />
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
