import { getPlatformSettings } from "@/lib/super-admin-actions";
import SettingsClient from "@/components/admin/SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getPlatformSettings();

  return <SettingsClient initialSettings={settings} />;
}
