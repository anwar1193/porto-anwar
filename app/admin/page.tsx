import type { Metadata } from "next";

import { Dashboard } from "@/components/admin/dashboard";
import { requireAdmin } from "@/lib/auth/guards";
import { getAchievements } from "@/lib/cms/achievements";
import { getExperiences } from "@/lib/cms/experiences";
import { getProjects } from "@/lib/cms/projects";
import { getSkills } from "@/lib/cms/skills";
import { getCmsStats } from "@/lib/cms/stats";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Ringkasan konten portofolio Anwar.",
};

export default async function AdminPage() {
  await requireAdmin("/admin");

  const [stats, projects, experiences, skills, achievements] =
    await Promise.all([
      getCmsStats(),
      getProjects(),
      getExperiences(),
      getSkills(),
      getAchievements(),
    ]);

  return (
    <Dashboard
      stats={stats}
      recentProjects={projects.slice(0, 3)}
      recentExperiences={experiences.slice(0, 3)}
      skills={skills}
      recentAchievements={achievements.slice(0, 3)}
    />
  );
}
