import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Users, Landmark, FileText, TrendingUp, Sparkles, BookOpen, UserCheck, Play } from "lucide-react";

interface PageProps {
  params: Promise<{ clubSlug: string }>;
}

export default async function ClubAdminDashboard({ params }: PageProps) {
  const { clubSlug } = await params;
  
  const club = await prisma.club.findUnique({
    where: { slug: clubSlug },
    include: {
      subscriptions: {
        include: { user: true },
        orderBy: { createdAt: "desc" }
      },
      posts: {
        orderBy: { createdAt: "desc" },
        take: 10
      }
    }
  });

  if (!club) {
    notFound();
  }

  const activeSubscribers = club.subscriptions.filter(s => s.status === "ACTIVE");
  const totalPaidFans = activeSubscribers.length;
  // Fallback to activeSubscribersCount from club if zero subscriptions exist
  const displayFans = totalPaidFans > 0 ? totalPaidFans : club.subscribersCount;
  const totalRevenue = activeSubscribers.reduce((sum, s) => sum + s.amount, 0);
  const activePostsCount = club.posts.length;

  const metrics = [
    { 
      name: "Total Paid Fans", 
      value: displayFans.toLocaleString(), 
      change: "+New", 
      desc: "active subscriptions", 
      icon: Users, 
      color: "text-[#2563eb]",
      bg: "bg-[#2563eb]/10",
      border: "border-[#2563eb]/20"
    },
    { 
      name: "Gross Monthly Revenue", 
      value: `${totalRevenue.toLocaleString()} MAD`, 
      change: "+12%", 
      desc: "vs last month", 
      icon: Landmark, 
      color: "text-[#10b981]",
      bg: "bg-[#10b981]/10",
      border: "border-[#10b981]/20"
    },
    { 
      name: "Active Content Posts", 
      value: activePostsCount.toString(), 
      change: "Live", 
      desc: "published to fans", 
      icon: FileText, 
      color: "text-[#2563eb]",
      bg: "bg-[#2563eb]/10",
      border: "border-[#2563eb]/20"
    },
  ];

  const recentSubscribers = club.subscriptions.slice(0, 5).map(sub => ({
    name: sub.user.firstName && sub.user.lastName ? `${sub.user.firstName} ${sub.user.lastName}` : "Anonymous Fan",
    email: sub.user.email,
    paid: `${sub.amount} MAD/mo`,
    date: new Date(sub.createdAt).toLocaleDateString(),
  }));

  const premiumContent = club.posts.slice(0, 5).map(post => ({
    title: post.title,
    type: post.mediaType || "Article",
    views: Math.floor(Math.random() * 5000) + 100, // Mocked views for aesthetic
    access: post.visibility === "PREMIUM" ? "Premium Only" : "Public",
    isPremium: post.visibility === "PREMIUM"
  }));

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          {club.name} Admin Console
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Analyze fan subscriptions, view your premium content performance, and track earnings for {club.name}.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-slate-800/80 hover:border-slate-700/80 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{m.name}</span>
                <div className={`p-2 rounded-lg ${m.bg} ${m.border} border`}>
                  <Icon className={`h-4.5 w-4.5 ${m.color}`} />
                </div>
              </div>
              <div className="font-display text-3xl font-bold text-white mb-2">{m.value}</div>
              <div className={`flex items-center gap-1.5 text-xs ${m.color}`}>
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
              <BookOpen className="h-5 w-5 text-[#2563eb]" />
              Recent Posts
            </h2>
            <Link href={`/admin/${clubSlug}/posts/create`} className="text-xs text-[#2563eb] hover:text-[#1d4ed8] font-semibold bg-[#2563eb]/10 px-3 py-1.5 rounded-lg transition-colors">
              New Post
            </Link>
          </div>

          <div className="space-y-4">
            {premiumContent.length > 0 ? (
              premiumContent.map((content, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-slate-900/30 hover:bg-slate-900/60 border border-slate-850 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-10 w-10 shrink-0 border rounded-lg flex items-center justify-center text-xs font-semibold ${content.isPremium ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-[#2563eb]/10 border-[#2563eb]/20 text-[#2563eb]'}`}>
                      {content.type.toLowerCase().includes("video") || content.type.toLowerCase().includes("mp4") ? (
                        <Play className="h-4 w-4 fill-current" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate max-w-md">
                        {content.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="capitalize">{content.type.replace('video/', '')}</span>
                        <span>•</span>
                        <span>{content.views} views</span>
                        <span>•</span>
                        <span className={content.isPremium ? "text-amber-500 font-medium" : "text-[#10b981] font-medium"}>{content.access}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No posts published yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent members activity */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
          <h2 className="font-display text-lg font-bold text-white mb-6 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-[#10b981]" />
            Latest Subscribers
          </h2>

          <div className="space-y-4">
            {recentSubscribers.length > 0 ? (
              recentSubscribers.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#2563eb]/10 border border-[#2563eb]/20 flex items-center justify-center font-bold text-xs text-[#2563eb]">
                      {sub.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{sub.name}</h4>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">{sub.email}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20">
                      {sub.paid}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">{sub.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No subscribers yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
