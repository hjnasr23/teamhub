import React from "react";
import Link from "next/link";
import { Users, Landmark, Coins, TrendingUp, Sparkles, BookOpen, UserCheck, Play } from "lucide-react";

interface PageProps {
  params: Promise<{ clubSlug: string }>;
}

export default async function ClubAdminDashboard({ params }: PageProps) {
  const { clubSlug } = await params;
  
  const clubDisplayName = clubSlug
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");

  const metrics = [
    { name: "Active Subscribers", value: "14,290", change: "+5.1%", desc: "vs last month", icon: Users, color: "text-emerald-400" },
    { name: "Gross Monthly Revenue", value: "$42,500", change: "+7.8%", desc: "vs last month", icon: Landmark, color: "text-emerald-400" },
    { name: "Average Sub Price", value: "$12.99", change: "+0.5%", desc: "vs last month", icon: Coins, color: "text-indigo-400" },
    { name: "Payout Pending (Stripe)", value: "$8,245", change: "Payout in 3 days", desc: "Automatic transfer", icon: Sparkles, color: "text-amber-400" },
  ];

  const recentSubscribers = [
    { name: "Alex Morgan", email: "alex@example.com", tier: "Gold VIP", paid: "$24.99/mo", date: "2 mins ago" },
    { name: "James Rodriguez", email: "james@example.com", tier: "Silver Star", paid: "$14.99/mo", date: "15 mins ago" },
    { name: "Cristiano Jr", email: "cr7jr@example.com", tier: "Bronze Fan", paid: "$4.99/mo", date: "1 hour ago" },
    { name: "Luka Modric", email: "luka@example.com", tier: "Gold VIP", paid: "$24.99/mo", date: "3 hours ago" },
  ];

  const premiumContent = [
    { title: "Exclusive: Dressing Room Celebrations after Finals!", type: "Video", views: "14.5K", revenue: "$4,500", access: "Gold VIP" },
    { title: "Tactical Breakdown: How We Beat Our Rivals 4-0", type: "Article", views: "9.2K", revenue: "$2,800", access: "Silver Star" },
    { title: "Podcast: Interview with Captain regarding Transfer rumors", type: "Audio", views: "8.1K", revenue: "$2,100", access: "All Members" },
    { title: "Pre-Match Training Live Stream Replay", type: "Video", views: "6.8K", revenue: "$1,500", access: "Gold VIP" },
  ];

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          {clubDisplayName} Management Panel
        </h1>
        <p className="text-sm text-slate-400">
          Analyze fan subscriptions, view your premium content performance, and track Stripe earnings.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{m.name}</span>
                <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${m.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="font-display text-3xl font-bold text-white mb-2">{m.value}</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="font-bold">{m.change}</span>
                <span className="text-slate-500 font-medium">{m.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content list */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              Monetized Content Performance
            </h2>
            <Link href="#" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold">
              Post Content
            </Link>
          </div>

          <div className="space-y-4">
            {premiumContent.map((content, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-slate-900/30 hover:bg-slate-900/60 border border-slate-850 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 shrink-0 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-xs font-semibold text-emerald-400">
                    {content.type === "Video" ? (
                      <Play className="h-4 w-4 fill-emerald-400" />
                    ) : content.type === "Audio" ? (
                      "🎙️"
                    ) : (
                      "📄"
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate max-w-md">
                      {content.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>{content.type}</span>
                      <span>•</span>
                      <span>{content.views} views</span>
                      <span>•</span>
                      <span className="text-indigo-400 font-medium">{content.access}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-emerald-400">{content.revenue}</div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Net Profit
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent members activity */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
          <h2 className="font-display text-lg font-bold text-white mb-6 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-indigo-400" />
            Recent Subscribers
          </h2>

          <div className="space-y-4">
            {recentSubscribers.map((sub, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400">
                    {sub.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{sub.name}</h4>
                    <span className="text-[10px] text-slate-500 block">{sub.email}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    sub.tier === "Gold VIP"
                      ? "bg-amber-500/5 text-amber-400 border-amber-500/10"
                      : sub.tier === "Silver Star"
                      ? "bg-slate-300/5 text-slate-300 border-slate-300/10"
                      : "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                  }`}>
                    {sub.tier}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">{sub.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
