"use client";

import React, { useState } from "react";
import {
  Users,
  Landmark,
  FileText,
  BookOpen,
  UserCheck,
  Play,
  ArrowRight,
  DollarSign,
  Upload,
  Plus,
  Video,
  Image as ImageIcon,
  MoreVertical,
  X
} from "lucide-react";
import { createClubPostAction, requestPayoutAction, updateClubPostAction, deleteClubPostAction } from "@/lib/club-admin-actions";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

function formatDate(dateInput: any) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
}

interface ClubDashboardClientProps {
  clubId: string;
  clubSlug: string;
  clubName: string;
  clubPrimaryColor: string;
  metrics: {
    totalMembers: number;
    premiumMembers: number;
    grossRevenue: number;
  };
  recentSubscribers: any[];
  recentPosts: any[];
  payoutRequests: any[];
  commissionRate: number;
}

export default function ClubDashboardClient({
  clubId,
  clubSlug,
  clubName,
  clubPrimaryColor,
  metrics,
  recentSubscribers,
  recentPosts,
  payoutRequests,
  commissionRate,
}: ClubDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "posts" | "payouts">("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [activePostDropdown, setActivePostDropdown] = useState<string | null>(null);
  const router = useRouter();

  const handleDeletePost = async (postId: string) => {
    setActivePostDropdown(null);
    if (!confirm("Are you sure you want to permanently delete this post? This action cannot be undone.")) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await deleteClubPostAction(clubId, postId);
      if (res.success) {
        alert("Post deleted successfully!");
        router.refresh();
      } else {
        alert(res.error || "Failed to delete post.");
      }
    } catch (err: any) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    setIsSubmitting(true);
    try {
      const form = e.target as HTMLFormElement;
      const title = (form.elements.namedItem("editTitle") as HTMLInputElement).value;
      const content = (form.elements.namedItem("editContent") as HTMLTextAreaElement).value;
      const visibility = (form.elements.namedItem("editVisibility") as HTMLSelectElement).value as "PUBLIC" | "PREMIUM";

      const res = await updateClubPostAction(clubId, editingPost.id, {
        title,
        content,
        visibility
      });

      if (res.success) {
        alert("Post updated successfully!");
        setEditingPost(null);
        router.refresh();
      } else {
        alert(res.error || "Failed to update post.");
      }
    } catch (err: any) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculations for payouts
  const grossRev = metrics.grossRevenue;
  const platformCut = grossRev * commissionRate;
  const availableBal = grossRev - platformCut;
  const totalWithdrawn = payoutRequests
    .filter(p => p.status === "APPROVED" || p.status === "PROCESSING")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingWithdrawals = payoutRequests
    .filter(p => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);
  const remainingBal = Math.max(0, availableBal - totalWithdrawn - pendingWithdrawals);

  // Handle Post Creation
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.target as HTMLFormElement;
      const title = (form.elements.namedItem("title") as HTMLInputElement).value;
      const content = (form.elements.namedItem("content") as HTMLTextAreaElement).value;
      const visibility = (form.elements.namedItem("visibility") as HTMLSelectElement).value as "PUBLIC" | "PREMIUM";
      const mediaFile = (form.elements.namedItem("mediaFile") as HTMLInputElement).files?.[0];

      let mediaUrl = "";
      let mediaType = "text";

      if (mediaFile) {
        if (mediaFile.size > 50 * 1024 * 1024) {
          alert("Video size cannot exceed 50MB. Please compress your video.");
          setIsSubmitting(false);
          return;
        }

        // Determine media type
        if (mediaFile.type.startsWith("image/")) {
          mediaType = "image";
        } else if (mediaFile.type.startsWith("video/")) {
          mediaType = "video";
        }

        const fileExtension = mediaFile.name.split('.').pop() || "bin";
        const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
        const filePath = `posts/${uniqueFilename}`;

        // Direct client-side upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("club-media")
          .upload(filePath, mediaFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: mediaFile.type || "application/octet-stream"
          });

        if (uploadError) {
          alert("Media upload failed: " + uploadError.message);
          setIsSubmitting(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("club-media")
          .getPublicUrl(filePath);

        mediaUrl = publicUrl;
      }

      const res = await createClubPostAction(clubId, {
        title,
        content,
        visibility,
        mediaType,
        mediaUrl
      });

      if (res.success) {
        form.reset();
        alert("Post published successfully!");
        router.refresh();
      } else {
        alert(res.error || "Failed to publish post");
      }
    } catch (err: any) {
      console.error(err);
      alert("An error occurred while publishing the post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Payout request
  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(payoutAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestPayoutAction(clubId, amount);
      if (res.success) {
        alert("Payout request submitted successfully!");
        setPayoutAmount("");
        router.refresh();
      } else {
        alert(res.error || "Failed to submit request");
      }
    } catch (err: any) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            {clubName} Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1">
            Manage your fan community, content feeds, and direct earnings.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg w-fit transition-colors">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer ${activeTab === "overview"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer ${activeTab === "posts"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
          >
            Posts CMS
          </button>
          <button
            onClick={() => setActiveTab("payouts")}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer ${activeTab === "payouts"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
          >
            Payouts
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Members</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
              <Users className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {metrics.totalMembers.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">All active subscriptions</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Premium Members</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
              <UserCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {metrics.premiumMembers.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">Paying tier members</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2 bg-orange-50 dark:bg-orange-950/40 rounded-lg">
              <Landmark className="h-4.5 w-4.5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {metrics.grossRevenue.toLocaleString()} MAD
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">Direct billing gross volume</div>
        </div>
      </div>

      {/* Dynamic Content Views */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Content */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Recent Posts
              </h2>
              <button
                onClick={() => setActiveTab("posts")}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Manage Posts
              </button>
            </div>

            <div className="space-y-4">
              {recentPosts.length > 0 ? (
                recentPosts.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 border border-slate-200 dark:border-slate-850 rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-10 w-10 shrink-0 border rounded-lg flex items-center justify-center text-xs font-semibold ${post.visibility === "PREMIUM"
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                        }`}>
                        {post.mediaType === "video" ? (
                          <Play className="h-4 w-4 fill-current" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-md">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className="capitalize">{post.mediaType || "Text"}</span>
                          <span>•</span>
                          <span className={post.visibility === "PREMIUM" ? "text-amber-500 font-medium" : "text-emerald-500 font-medium"}>
                            {post.visibility === "PREMIUM" ? "Premium Access" : "Public"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No posts published yet.
                </div>
              )}
            </div>
          </div>

          {/* Latest Subscribers */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Latest Subscribers
            </h2>

            <div className="space-y-4">
              {recentSubscribers.length > 0 ? (
                recentSubscribers.slice(0, 5).map((sub) => {
                  const subName = sub.user.firstName && sub.user.lastName
                    ? `${sub.user.firstName} ${sub.user.lastName}`
                    : "Anonymous Fan";
                  return (
                    <div key={sub.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-xs text-blue-500">
                          {subName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">{subName}</h4>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">{sub.user.email}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                          {sub.amount} MAD/mo
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-1">
                          {formatDate(sub.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No subscribers yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "posts" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Post Creation CMS Form */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-500" />
              Publish New Update
            </h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Title</label>
                <input
                  required
                  name="title"
                  type="text"
                  placeholder="e.g., Matchday Lineups Confirmed"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Content</label>
                <textarea
                  required
                  name="content"
                  rows={4}
                  placeholder="What's happening behind closed doors?"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Visibility Level</label>
                <select
                  name="visibility"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="PUBLIC">Public (All Users)</option>
                  <option value="PREMIUM">Premium (Paid Supporters Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Media Attachment (Optional)</label>
                <input
                  type="file"
                  name="mediaFile"
                  accept="image/*,video/*"
                  className="w-full text-slate-600 dark:text-slate-300 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold tracking-wide uppercase shadow-md transition-colors cursor-pointer"
              >
                {isSubmitting ? "Publishing..." : "Publish Post"}
              </button>
            </form>
          </div>

          {/* Posts list */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-6">Published Posts CMS</h2>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <div key={post.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl flex items-start gap-4 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all">
                    <div className={`h-10 w-10 shrink-0 border rounded-lg flex items-center justify-center text-xs font-semibold ${post.visibility === "PREMIUM"
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                      }`}>
                      {post.mediaType === "video" ? <Video className="h-4 w-4" /> : post.mediaType === "image" ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{post.title}</h4>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${post.visibility === "PREMIUM"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            }`}>
                            {post.visibility}
                          </span>
                          {!post.mediaUrl && (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-medium border shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700">
                              Text Only
                            </span>
                          )}
                        </div>

                        {/* Actions Menu */}
                        <div className="relative shrink-0">
                          <button
                            onClick={() => setActivePostDropdown(activePostDropdown === post.id ? null : post.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-605 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {activePostDropdown === post.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActivePostDropdown(null)} />
                              <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1.5 z-20 text-left animate-in fade-in slide-in-from-top-1 duration-100">
                                <button
                                  onClick={() => {
                                    setEditingPost(post);
                                    setActivePostDropdown(null);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer text-xs"
                                >
                                  Edit Post Content
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  className="w-full px-4 py-2 hover:bg-red-50 dark:hover:bg-red-955/20 text-red-650 dark:text-red-400 flex items-center gap-2 cursor-pointer text-xs font-semibold"
                                >
                                  Delete Post
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{post.content}</p>

                      {/* Media Display Logic */}
                      {post.mediaUrl ? (
                        <div className="mt-3 relative rounded-lg overflow-hidden max-w-md border border-slate-200 dark:border-slate-800 bg-black/5 dark:bg-black/20">
                          {post.mediaType === "video" || post.mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                            <video src={post.mediaUrl} controls className="w-full h-auto max-h-60 object-contain" />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={post.mediaUrl} alt={post.title} className="w-full h-auto max-h-60 object-contain" />
                          )}
                        </div>
                      ) : null}

                      <div className="text-[10px] text-slate-500 mt-2">
                        Published {formatDate(post.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No posts published yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "payouts" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Financial summary & Request form */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              Request Withdrawal
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Total Gross Income</span>
                <span className="font-semibold text-slate-900 dark:text-white">{grossRev.toLocaleString()} MAD</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Platform Commission (10%)</span>
                <span className="font-semibold text-rose-600 dark:text-rose-450">-{platformCut.toLocaleString()} MAD</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Net Platform Earnings</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-450">{availableBal.toLocaleString()} MAD</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Withdrawn / Processing</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">-{totalWithdrawn.toLocaleString()} MAD</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Pending Approvals</span>
                <span className="font-semibold text-amber-600 dark:text-amber-500">-{pendingWithdrawals.toLocaleString()} MAD</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold">
                <span className="text-slate-900 dark:text-white">Available Balance</span>
                <span className="text-blue-600 dark:text-blue-400">{remainingBal.toLocaleString()} MAD</span>
              </div>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Withdrawal Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-600 text-xs font-bold">MAD</span>
                  <input
                    required
                    name="amount"
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    max={remainingBal}
                    placeholder="Enter amount to withdraw"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || remainingBal <= 0}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold tracking-wide uppercase shadow-md transition-colors cursor-pointer"
              >
                {isSubmitting ? "Requesting..." : "Request Payout Withdrawal"}
              </button>
            </form>
          </div>

          {/* Payout log */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-6">Payout Request History</h2>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {payoutRequests.length > 0 ? (
                payoutRequests.map((payout) => (
                  <div key={payout.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl flex items-center justify-between hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{payout.amount.toLocaleString()} MAD</h4>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Requested {formatDate(payout.createdAt)}
                      </span>
                    </div>

                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${payout.status === "APPROVED"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : payout.status === "PROCESSING"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      }`}>
                      {payout.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No payout history registered yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <form onSubmit={handleEditPostSubmit}>
              <div className="p-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Edit Post Content</h4>
                  <button type="button" onClick={() => setEditingPost(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Title</label>
                    <input
                      required
                      type="text"
                      name="editTitle"
                      defaultValue={editingPost.title}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Content</label>
                    <textarea
                      required
                      rows={4}
                      name="editContent"
                      defaultValue={editingPost.content}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Visibility Level</label>
                    <select
                      name="editVisibility"
                      defaultValue={editingPost.visibility}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="PUBLIC">Public (All Users)</option>
                      <option value="PREMIUM">Premium (Paid Supporters Only)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
