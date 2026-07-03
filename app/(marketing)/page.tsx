import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Coins, Users, Trophy, ChevronRight, Play, Star } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="relative min-h-screen bg-brand-bg bg-grid-pattern text-slate-100 flex flex-col justify-between">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-accent-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Trophy className="h-5 w-5 text-white animate-pulse-slow" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              TEAM<span className="text-emerald-500">HUB</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link href="#features" className="hover:text-slate-100 transition-colors">Features</Link>
            <Link href="#explore" className="hover:text-slate-100 transition-colors">Explore</Link>
            <Link href="#pricing" className="hover:text-slate-100 transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel-light border border-slate-800 text-emerald-400 text-xs font-semibold mb-8 animate-bounce">
            <Star className="h-3 w-3 fill-emerald-400" />
            <span>The Ultimate Sports SaaS Multi-Tenant Platform</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
            Monetize Your Sports Club's{" "}
            <span className="text-gradient-emerald">Fanbase via Subscriptions</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Empower your club to host exclusive behind-the-scenes content, live streams, members-only merchandise drops, and VIP community forums—all under your own brand.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 font-semibold group gap-2">
                Create Your Club Hub
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/admin/real-madrid">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
                <Play className="h-4 w-4 fill-slate-100 text-slate-100" />
                Demo Club Admin
              </Button>
            </Link>
          </div>

          {/* Quick Demos Navigation */}
          <div className="max-w-xl mx-auto px-4 py-3 rounded-2xl glass-panel border border-slate-800 flex flex-wrap justify-center items-center gap-4 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Quick Dev Links:</span>
            <Link href="/super-admin" className="text-indigo-400 hover:underline">Super Admin</Link>
            <span>•</span>
            <Link href="/admin/real-madrid" className="text-emerald-400 hover:underline">Club Admin Dashboard</Link>
            <span>•</span>
            <Link href="/real-madrid" className="text-emerald-400 hover:underline">Fan Club Page</Link>
            <span>•</span>
            <Link href="/real-madrid/subscribe" className="text-indigo-400 hover:underline">Fan Checkout</Link>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="border-y border-slate-900 bg-slate-950/40 py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="font-display text-4xl font-extrabold text-white mb-2">150+</div>
              <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Active Sports Clubs</div>
            </div>
            <div>
              <div className="font-display text-4xl font-extrabold text-emerald-500 mb-2">10M+</div>
              <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Registered Fans</div>
            </div>
            <div>
              <div className="font-display text-4xl font-extrabold text-white mb-2">$8.5M+</div>
              <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Fan Revenue Paid Out</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything Your Sports Club Needs to Grow
            </h2>
            <p className="text-slate-400">
              Scale subscription revenue, connect deeply with fans, and manage everything from a centralized dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel p-8 rounded-2xl glass-card-hover">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
                <Coins className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Subscription Tiers</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Create tiered fan subscriptions (Bronze, Silver, Gold VIP) with recurring credit card payments and customized member perks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-8 rounded-2xl glass-card-hover">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Paywalled Media Content</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Lock premium videos, live press-conferences, and interview podcasts. Provide high quality stream viewing only to active subscribers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-8 rounded-2xl glass-card-hover">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Fan Engagement Portal</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Allow fans to comment on announcements, vote in matchday polls, and chat with other members in a moderated clubhouse forum.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950/80 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm tracking-tight text-slate-300">
              TEAM<span className="text-emerald-500">HUB</span>
            </span>
            <span className="text-xs text-slate-600">© 2026 TEAMHUB Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
