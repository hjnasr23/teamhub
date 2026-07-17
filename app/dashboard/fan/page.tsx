import { redirect } from "next/navigation";

export default function OldFanDashboardRedirect() {
  redirect("/settings");
}
