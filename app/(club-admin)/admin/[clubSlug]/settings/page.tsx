import { Button } from "@/components/ui/button";
import { Settings, Sliders, Palette, Landmark, ShieldCheck } from "lucide-react";

interface PageProps {
  params: Promise<{ clubSlug: string }>;
}

export const generateStaticParams = () => {
  return [{ clubSlug: 'default' }];
};

export default async function ClubSettingsPage({ params }: PageProps) {
  const { clubSlug } = await params;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Club Hub Settings
        </h1>
        <p className="text-sm text-slate-400">
          Customize your fan portal branding, set billing thresholds, and update payout credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Branding & Theme Customizer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customizer Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
            <h2 className="font-display text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Palette className="h-5 w-5 text-emerald-400" />
              Tenant Portal Branding
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      defaultValue="#10b981"
                      className="h-10 w-12 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs text-slate-300 font-mono font-semibold">#10b981 (Emerald)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Secondary Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      defaultValue="#6366f1"
                      className="h-10 w-12 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs text-slate-300 font-mono font-semibold">#6366f1 (Indigo)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Portal Header Crest (Logo Upload)
                </label>
                <div className="border border-dashed border-slate-800 bg-slate-900/10 rounded-xl p-8 text-center hover:border-emerald-500/50 hover:bg-slate-900/20 transition-all cursor-pointer">
                  <span className="text-xs text-slate-400 block mb-1">
                    Drag and drop your club crest here or <span className="text-emerald-400 underline font-semibold">browse files</span>
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    Supports PNG, JPG, WebP up to 2MB (Recommended dimensions 400x400)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Portal Announcement Welcome Text
                </label>
                <textarea
                  rows={3}
                  defaultValue="Welcome to the Official Real Madrid Fan Clubhouse. Subscribe to watch live stream replays, read captain journals and access members-only matchday forums!"
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-850">
                <Button type="button" className="font-semibold">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Pricing Config Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
            <h2 className="font-display text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Sliders className="h-5 w-5 text-indigo-400" />
              Subscription Tier Configurations
            </h2>

            <form className="space-y-6">
              <div className="space-y-4">
                {/* Bronze */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-900/40 border border-slate-850 rounded-xl gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Bronze Fan</h3>
                    <span className="text-[10px] text-slate-500">Access to standard forums and polls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-semibold">$</span>
                    <input
                      type="number"
                      defaultValue="4.99"
                      step="0.01"
                      className="w-20 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-slate-500">/mo</span>
                  </div>
                </div>

                {/* Silver */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-900/40 border border-slate-850 rounded-xl gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Silver Star</h3>
                    <span className="text-[10px] text-slate-500">Bronze perks + exclusive articles and podcasts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-semibold">$</span>
                    <input
                      type="number"
                      defaultValue="14.99"
                      step="0.01"
                      className="w-20 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-slate-500">/mo</span>
                  </div>
                </div>

                {/* Gold */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-900/40 border border-slate-850 rounded-xl gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Gold VIP</h3>
                    <span className="text-[10px] text-slate-500">Silver perks + dressing room video and live streams</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-semibold">$</span>
                    <input
                      type="number"
                      defaultValue="24.99"
                      step="0.01"
                      className="w-20 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-slate-500">/mo</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-850">
                <Button type="button" className="font-semibold">
                  Update Prices
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar credentials panel */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
            <h2 className="font-display text-base font-bold text-white mb-4 flex items-center gap-2">
              <Landmark className="h-4.5 w-4.5 text-indigo-400" />
              Stripe Accounts
            </h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Your fan subscriptions are processed and distributed to your bank account via Stripe Connect.
            </p>

            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mb-6 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white">Verification Complete</h4>
                <span className="text-[10px] text-emerald-400 block mt-1">
                  Transfers enabled. Funds deposit every 7 days.
                </span>
              </div>
            </div>

            <Button variant="secondary" size="sm" className="w-full text-xs font-semibold">
              View Stripe Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
