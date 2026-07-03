import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Coins, Users, Trophy, ChevronRight, Play, Star, CircleDollarSign, Lock, Zap, Check } from "lucide-react";

export default function MarketingPage() {
  const featuredClubs = [
    {
      id: "club-1",
      name: "Wydad AC",
      slug: "wydad-ac",
      description: "Join the official digital membership of the Red Castle and access exclusive locker room feeds.",
      membersCount: "145K members",
      initials: "WAC",
      color: "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50",
    },
    {
      id: "club-2",
      name: "Raja CA",
      slug: "raja-ca",
      description: "Connect with the Green Eagles. Vote in player polls and read captains' training journals.",
      membersCount: "138K members",
      initials: "RCA",
      color: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
    },
    {
      id: "club-3",
      name: "Ittihad Tanger",
      slug: "ittihad-tanger",
      description: "Unlock premium video streams and behind-the-scenes diaries from the blue city's pride.",
      membersCount: "42K members",
      initials: "IRT",
      color: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50",
    },
    {
      id: "club-4",
      name: "AS FAR Rabat",
      slug: "as-far",
      description: "Support the Military Club. Unlock exclusive merchandise drops and matchday forums.",
      membersCount: "89K members",
      initials: "FAR",
      color: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
    }
  ];

  return (
    <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 min-h-screen transition-colors duration-300">
      {/* Background radial gradient glow (Theme style adaptive) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-blue-600/5 via-emerald-600/5 to-transparent blur-3xl pointer-events-none -z-10 dark:opacity-20" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/30 text-blue-650 dark:text-blue-400 text-xs font-semibold mb-2 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400" />
            <span>The Ultimate Sports SaaS Multi-Tenant Platform</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Monetize Your Sports Club's{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent block sm:inline">
              Fan Component via Subscriptions
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Empower your club to host exclusive behind-the-scenes content, live streams, members-only merchandise drops, and VIP community forums—all under your own brand.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold group gap-2 shadow-md shadow-blue-600/15 transition-all cursor-pointer">
                Create Your Club Hub
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/admin/real-madrid">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800 shadow-sm font-semibold transition-all cursor-pointer">
                <Play className="h-4 w-4 fill-white text-white" />
                Demo Club Admin
              </Button>
            </Link>
          </div>

          {/* Quick Demos Navigation Card */}
          <div className="max-w-xl mx-auto px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 flex flex-wrap justify-center items-center gap-4 text-xs text-slate-600 dark:text-slate-400 shadow-sm transition-colors duration-300">
            <span className="font-semibold text-slate-900 dark:text-slate-200">Quick Dev Links:</span>
            <Link href="/super-admin" className="text-blue-600 hover:underline font-medium dark:text-blue-400">Super Admin</Link>
            <span>•</span>
            <Link href="/admin/real-madrid" className="text-emerald-600 hover:underline font-medium dark:text-emerald-400">Club Admin Dashboard</Link>
            <span>•</span>
            <Link href="/real-madrid" className="text-emerald-600 hover:underline font-medium dark:text-emerald-400">Fan Club Page</Link>
            <span>•</span>
            <Link href="/real-madrid/subscribe" className="text-blue-600 hover:underline font-medium dark:text-blue-400">Fan Checkout</Link>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition-colors duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800">
            <div className="py-4 sm:py-0">
              <div className="font-display text-4xl font-extrabold text-slate-900 dark:text-white mb-1.5">150+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Active Sports Clubs</div>
            </div>
            <div className="py-4 sm:py-0">
              <div className="font-display text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-1.5">10M+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Registered Fans</div>
            </div>
            <div className="py-4 sm:py-0">
              <div className="font-display text-4xl font-extrabold text-slate-900 dark:text-white mb-1.5">$8.5M+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Fan Revenue Paid Out</div>
            </div>
          </div>
        </section>

        {/* Featured Moroccan Clubs Section */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Featured Moroccan Clubs
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Explore the official hubs of Morocco's top athletic associations and support your favorite squad directly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredClubs.map((club) => (
              <div 
                key={club.id} 
                className="bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Logo Placeholder */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-xs border ${club.color}`}>
                      {club.initials}
                    </div>
                    {/* Active Members Badge */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-600 border border-slate-100 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-850">
                      <Users className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                      {club.membersCount}
                    </span>
                  </div>

                  {/* Club details */}
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mb-2">
                    {club.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {club.description}
                  </p>
                </div>

                {/* View Hub CTA Link */}
                <Link href={`/clubs/${club.slug}`} className="w-full">
                  <Button className="w-full text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors duration-200 cursor-pointer">
                    View Hub
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* How It Works – 3-Step Fan Journey                         */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-dark">
              How It Works
            </h2>
            <p className="text-text-muted text-sm sm:text-base">
              Three simple steps to join your favourite club's digital inner circle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="relative bg-neutral-bg border border-border-custom rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 text-center group">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20">
                1
              </span>
              <div className="h-12 w-12 mx-auto rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200">
                <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-display text-base font-bold text-text-dark mb-2">Choose Your Club</h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Browse our roster of official clubs and find the team that makes your heart race on match day.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-neutral-bg border border-border-custom rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 text-center group">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center justify-center h-7 w-7 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20">
                2
              </span>
              <div className="h-12 w-12 mx-auto rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200">
                <CircleDollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-display text-base font-bold text-text-dark mb-2">Subscribe Securely</h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Join officially for <span className="font-semibold text-text-dark">50 MAD / month</span>. Payments are processed with bank-grade encryption.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-neutral-bg border border-border-custom rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 text-center group">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center justify-center h-7 w-7 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20">
                3
              </span>
              <div className="h-12 w-12 mx-auto rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200">
                <Lock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-display text-base font-bold text-text-dark mb-2">Unlock Exclusive Access</h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Dive into subscriber-only posts, behind-the-scenes footage, live Q&As, and members-only merch drops.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* Simple, Transparent Pricing                                */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-dark">
              Simple, Transparent Pricing
            </h2>
            <p className="text-text-muted text-sm sm:text-base">
              One membership. Full access. No hidden fees—ever.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto">
            <div className="relative bg-neutral-bg border border-border-custom rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* Decorative top accent bar */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

              {/* Badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider">
                  <Zap className="h-3.5 w-3.5" />
                  Most Popular
                </span>
              </div>

              {/* Plan Title */}
              <h3 className="font-display text-xl font-bold text-text-dark mb-1">Digital Fan Membership</h3>
              <p className="text-text-muted text-xs sm:text-sm mb-6">Everything you need to stay connected to your club.</p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-text-dark">50</span>
                <span className="text-text-muted text-sm font-semibold">MAD / month</span>
              </div>
              <p className="text-xs text-text-muted mb-8">
                or <span className="font-semibold text-emerald-600 dark:text-emerald-400">500 MAD / year</span>{" "}
                <span className="inline-flex items-center ml-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  Save 17%
                </span>
              </p>

              {/* Divider */}
              <div className="h-px bg-border-custom mb-6" />

              {/* Feature List */}
              <ul className="space-y-3.5 mb-8">
                {[
                  "Access exclusive subscriber posts",
                  "Direct forum interaction",
                  "Official club digital badge",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-text-dark">
                    <span className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center">
                      <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/" className="block">
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/15 transition-all cursor-pointer group gap-2"
                >
                  Choose Your Club to Subscribe
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Everything Your Sports Club Needs to Grow
            </h2>
            <p className="text-slate-650 dark:text-slate-400 text-sm sm:text-base">
              Scale subscription revenue, connect deeply with fans, and manage everything from a centralized dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200">
              <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center mb-6">
                <Coins className="h-5.5 w-5.5 text-blue-650 dark:text-blue-400" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">Subscription Tiers</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Create tiered fan subscriptions (Bronze, Silver, Gold VIP) with recurring credit card payments and customized member perks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200">
              <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center mb-6">
                <Shield className="h-5.5 w-5.5 text-emerald-650 dark:text-emerald-450" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">Paywalled Media Content</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Lock premium videos, live press-conferences, and interview podcasts. Provide high quality stream viewing only to active subscribers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200">
              <div className="h-11 w-11 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center mb-6">
                <Users className="h-5.5 w-5.5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">Fan Engagement Portal</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Allow fans to comment on announcements, vote in matchday polls, and chat with other members in a moderated clubhouse forum.
              </p>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}
