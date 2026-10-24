import type { Metadata } from "next";

import { ExperienceManager } from "@/components/admin/experiences/experience-manager";
import { requireAdmin } from "@/lib/auth/guards";
import { getExperiences } from "@/lib/cms/experiences";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experiences CMS",
  description: "Kelola riwayat pengalaman dan karier.",
};

export default async function ExperiencesPage() {
  await requireAdmin("/admin/experiences");

  const experiences = await getExperiences();

  return <ExperienceManager experiences={experiences} />;
}
