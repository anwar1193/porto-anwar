import type { Metadata } from "next";

import { ProjectManager } from "@/components/admin/projects/project-manager";
import { requireAdmin } from "@/lib/auth/guards";
import { getProjects } from "@/lib/cms/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects CMS",
  description: "Kelola showcase proyek portofolio.",
};

export default async function ProjectsPage() {
  await requireAdmin("/admin/projects");

  const projects = await getProjects();

  return <ProjectManager projects={projects} />;
}
