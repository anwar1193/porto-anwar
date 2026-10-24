import type { Metadata } from "next";

import { SkillManager } from "@/components/admin/skills/skill-manager";
import { requireAdmin } from "@/lib/auth/guards";
import { getSkills } from "@/lib/cms/skills";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skills CMS",
  description: "Kelola skill dan tech stack portofolio.",
};

export default async function SkillsPage() {
  await requireAdmin("/admin/skills");

  const skills = await getSkills();

  return <SkillManager skills={skills} />;
}
