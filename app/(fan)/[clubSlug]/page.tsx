import Link from "next/link";
import { Lock, Play, FileText, LockKeyhole, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ clubSlug: string }>;
}

export default async function FanClubPage({ params }: PageProps) {
  const { clubSlug } = await params;
  
  // Format the slug for display
  const clubDisplayName = clubSlug
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

  const posts = [
    {
      id: "post-1",
      title: "Exclusive: Dressing Room Celebrations after Finals!",
      excerpt: "Behind the scenes access to the champagne popping, speeches by the coach, and private singing. Find out what the captain said to the team in confidence...",
      type: "Video",
      access: "Gold VIP",
      locked: true,
      time: "2 hours ago",
    },
    {
      id: "post-2",
      title: "Official Announcement: Medical Statement regarding Midfielder",
      excerpt: "The medical department has released the diagnosis and projected recovery time for our starting midfielder following yesterday's scan results...",
      type: "Article",
      access: "Free",
      locked: false,
      time: "5 hours ago",
    },
    {
      id: "post-3",
      title: "Tactical Analysis: Deconstructing our 4-0 Derby Victory",
      excerpt: "In-depth whiteboard session analysis of the wingback pressing patterns, offensive overloading tactics, and defensive transitions that secured our derby win...",
      type: "Article",
      access: "Silver Star",
      locked: true,
      time: "Yesterday",
    },
    {
      id: "post-4",
      title: "Clubhouse Podcast Ep. 42: Chatting with our new signee",
      excerpt: "We sit down with our recently announced forward to talk about moving cities, adjusting to the clubhouse culture, and expectations for the upcoming fixture...",
      type: "Podcast",
      access: "Silver Star",
      locked: true,
      time: "3 days ago",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Club Hero Crest Banner */}
      <section className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden border border-slate-800/80">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <Star className="h-3 w-3 fill-emerald-400" />
            <span>Official Fan Portal</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Welcome to the <span className="text-gradient-emerald">{clubDisplayName}</span> Clubhouse
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
            Get closer to the action. Subscribe to one of our fan VIP memberships to unlock training logs, player diaries, and live post-match board discussions.
          </p>

          <Link href={`/${clubSlug}/subscribe`}>
            <Button className="bg-emerald-600 hover:bg-emerald-500 font-semibold gap-2">
              Explore Subscription Tiers
              <ChevronRight className="h-4.5 w-4.5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Feed Area */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Posts Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-display text-xl font-bold text-white mb-4">Latest Clubhouse Content</h2>

          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="glass-panel rounded-2xl border border-slate-800 p-6 relative overflow-hidden transition-all duration-300 hover:border-slate-700">
                {/* Upper Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{post.time}</span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    post.access === "Free"
                      ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                      : post.access === "Silver Star"
                      ? "bg-indigo-500/5 text-indigo-400 border-indigo-500/10"
                      : "bg-amber-500/5 text-amber-400 border-amber-500/10"
                  }`}>
                    {post.access === "Free" ? "Public" : `${post.access} Exclusive`}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2">
                  {post.locked && <Lock className="h-4 w-4 text-amber-500 shrink-0" />}
                  {post.title}
                </h3>

                {/* Excerpt with blur overlay if locked */}
                <div className="relative">
                  <p className={`text-xs text-slate-400 leading-relaxed ${post.locked ? "select-none blur-[2px]" : ""}`}>
                    {post.excerpt}
                  </p>
                  
                  {post.locked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/20 backdrop-blur-[2px] rounded-xl border border-slate-900/40 p-4 text-center">
                      <LockKeyhole className="h-7 w-7 text-amber-400 mb-2 animate-bounce" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider mb-2">
                        Locked Post
                      </span>
                      <Link href={`/${clubSlug}/subscribe`}>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-[10px] h-8 px-4 font-semibold shadow-md shadow-emerald-950/20">
                          Upgrade to {post.access}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Action Footer if unlocked */}
                {!post.locked && (
                  <div className="mt-4 pt-4 border-t border-slate-850 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Format: {post.type}</span>
                    <Link href={`/${clubSlug}/posts/${post.id}`}>
                      <Button variant="ghost" size="sm" className="text-emerald-400 text-xs font-semibold gap-1 hover:bg-emerald-500/5 hover:text-emerald-300">
                        {post.type === "Video" ? (
                          <>
                            <Play className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
                            Watch Video
                          </>
                        ) : (
                          <>
                            <FileText className="h-3.5 w-3.5" />
                            Read Article
                          </>
                        )}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Club Stats / Tier list */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4">
              Clubhouse Status
            </h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span>Active VIP Members</span>
                <span className="text-white font-semibold">14.2K</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span>Premium Media posts</span>
                <span className="text-white font-semibold">120+</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span>Next match poll status</span>
                <span className="text-emerald-400 font-bold">VOTING ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
