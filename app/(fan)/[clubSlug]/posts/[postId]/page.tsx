import Link from "next/link";
import { ArrowLeft, Lock, Trophy, Calendar, Eye, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    clubSlug: string;
    postId: string;
  }>;
}

export default async function FanPostDetailsPage({ params }: PageProps) {
  const { clubSlug, postId } = await params;

  // Mock post resolver based on ID
  const postsDatabase: Record<
    string,
    { title: string; type: string; access: string; text: string; date: string }
  > = {
    "post-1": {
      title: "Exclusive: Dressing Room Celebrations after Finals!",
      type: "Video",
      access: "Gold VIP",
      date: "July 01, 2026",
      text: "This is a premium post content. Behind the scenes celebrational access is reserved for Gold VIP members.",
    },
    "post-2": {
      title: "Official Announcement: Medical Statement regarding Midfielder",
      type: "Article",
      access: "Free",
      date: "July 02, 2026",
      text: "The medical department has confirmed our midfielder sustained a minor hamstring strain during yesterday's training session. Following scans this morning, he has already begun rehabilitation work. The recovery period is estimated at 10-14 days depending on response to therapy. He will likely miss the upcoming two home fixtures but is expected to return for the away derby.",
    },
    "post-3": {
      title: "Tactical Analysis: Deconstructing our 4-0 Derby Victory",
      type: "Article",
      access: "Silver Star",
      date: "June 30, 2026",
      text: "This is a premium post content. Hardcore tactical board breakdowns are reserved for Silver Star members.",
    },
    "post-4": {
      title: "Clubhouse Podcast Ep. 42: Chatting with our new signee",
      type: "Podcast",
      access: "Silver Star",
      date: "June 28, 2026",
      text: "This is a premium podcast recording. Full high quality audio feed is reserved for Silver Star members.",
    },
  };

  const post = postsDatabase[postId] || postsDatabase["post-2"];
  const isPremium = post.access !== "Free";

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href={`/${clubSlug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Clubhouse Feed
        </Link>
      </div>

      {/* Post main container */}
      <article className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 space-y-6">
        {/* Badges / Meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-b border-slate-850 pb-4 justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              1,245 Views
            </span>
          </div>

          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
            post.access === "Free"
              ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
              : "bg-indigo-500/5 text-indigo-400 border-indigo-500/10"
          }`}>
            {post.access === "Free" ? "Public Access" : `${post.access} Exclusive`}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
          {post.title}
        </h1>

        {/* Dynamic content render: Locked vs Unlocked */}
        {isPremium ? (
          <div className="space-y-6">
            {/* Blurry mock paragraphs */}
            <div className="space-y-3 blur-[3px] select-none pointer-events-none opacity-40">
              <p className="text-xs text-slate-350 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.
              </p>
              <p className="text-xs text-slate-350 leading-relaxed">
                Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam.
              </p>
            </div>

            {/* Lock Dialog overlay card */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-4 max-w-md mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-indigo-500/5 rounded-full blur-2xl -z-10" />
              <div className="h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mx-auto text-indigo-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Exclusive Clubhouse Media
                </h3>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  This {post.type.toLowerCase()} is reserved exclusively for fans subscribed to the{" "}
                  <span className="text-indigo-400 font-bold">{post.access}</span> tier. Upgrading supports the club directly.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Link href={`/${clubSlug}/subscribe`}>
                  <Button className="w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 gap-1.5 shadow-md shadow-emerald-950/20">
                    Upgrade to {post.access} <ArrowRight className="h-4.5 w-4.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-normal">
            <p>{post.text}</p>
            <p>
              Our staff will continue monitoring his symptoms closely and provide progress updates relative to his scheduled physical therapy milestones next week.
            </p>
          </div>
        )}
      </article>
    </div>
  );
}
