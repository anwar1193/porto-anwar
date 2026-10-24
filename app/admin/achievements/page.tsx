import type { Metadata } from "next";

import { AchievementManager } from "@/components/admin/achievements/achievement-manager";
import { requireAdmin } from "@/lib/auth/guards";
import { getAchievements } from "@/lib/cms/achievements";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Achievements CMS",
  description: "Kelola sertifikat dan penghargaan portofolio.",
};

export default async function AchievementsPage() {
  await requireAdmin("/admin/achievements");

  const achievements = await getAchievements();

  return <AchievementManager achievements={achievements} />;
}
