"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { AnalyticsChart } from "@/components/admin/analytics-chart";
import { MetricCard } from "@/components/admin/metric-card";
import { ProjectManager } from "@/components/admin/project-manager";
import { RightColumn } from "@/components/admin/right-column";
import { MaterialIcon } from "@/components/material-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminProjectCategories,
  initialAdminProjects,
  type AdminProject,
} from "@/lib/content";

type ProjectDialogProps = {
  open: boolean;
  project: AdminProject | null;
  onOpenChange: (open: boolean) => void;
  onSave: (project: AdminProject) => void;
};

function ProjectDialog({
  open,
  project,
  onOpenChange,
  onSave,
}: ProjectDialogProps) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [category, setCategory] = useState(
    project?.category ?? adminProjectCategories[0] ?? "Fullstack Apps",
  );
  const [tags, setTags] = useState(project?.tags.join(", ") ?? "");

  useEffect(() => {
    if (!open) return;
    setTitle(project?.title ?? "");
    setSummary(project?.summary ?? "");
    setCategory(
      project?.category ?? adminProjectCategories[0] ?? "Fullstack Apps",
    );
    setTags(project?.tags.join(", ") ?? "");
  }, [open, project]);

  const categories = Array.from(
    new Set([
      ...adminProjectCategories,
      ...(project ? [project.category] : []),
    ]),
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    onSave({
      id: project?.id ?? `project-${Date.now()}`,
      title: title.trim(),
      summary: summary.trim(),
      category,
      tags: parsedTags.length > 0 ? parsedTags : ["General"],
      status: project?.status ?? "Draft",
      views: project?.views ?? "-",
      image: project?.image,
      icon: project?.icon ?? "deployed_code",
      tag: project?.tag ?? "NEW",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {project ? "Sunting Proyek" : "Tambah Proyek Baru"}
          </DialogTitle>
          <DialogDescription>
            {project
              ? "Perbarui metadata proyek yang tampil di showcase portofolio."
              : "Proyek baru disimpan sebagai draft dan bisa dipublikasikan dari daftar proyek."}
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="project-title">Judul proyek</Label>
            <Input
              id="project-title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="ERP Cloud Enterprise Platform"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="project-category">Kategori</Label>
              <select
                id="project-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-8 w-full cursor-pointer rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="project-tags">Tech stack</Label>
              <Input
                id="project-tags"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder="Laravel, React, PostgreSQL"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-summary">Deskripsi singkat</Label>
            <textarea
              id="project-summary"
              required
              rows={3}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="Ringkasan arsitektur dan dampak proyek."
              className="min-h-20 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">
              {project ? "Simpan perubahan" : "Tambah sebagai draft"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ExperienceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [period, setPeriod] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) return;
    setRole("");
    setOrganization("");
    setPeriod("");
    setDescription("");
  }, [open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success(`Pengalaman "${role}" dicatat sebagai demo lokal.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Catat Pengalaman</DialogTitle>
          <DialogDescription>
            Riwayat karier ini tersimpan sebagai demo lokal pada sesi ini.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="experience-role">Peran</Label>
            <Input
              id="experience-role"
              required
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="Backend Engineer"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="experience-org">Organisasi</Label>
              <Input
                id="experience-org"
                required
                value={organization}
                onChange={(event) => setOrganization(event.target.value)}
                placeholder="PT. Indonesia Hakiki Pertama"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="experience-period">Periode</Label>
              <Input
                id="experience-period"
                required
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                placeholder="Oct 2021 - Present"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="experience-description">Ringkasan peran</Label>
            <textarea
              id="experience-description"
              required
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Tanggung jawab dan pencapaian utama."
              className="min-h-20 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">Simpan pengalaman</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function Dashboard() {
  const [projects, setProjects] = useState<AdminProject[]>(
    initialAdminProjects,
  );
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProject | null>(null);

  const openCreateDialog = () => {
    setEditing(null);
    setProjectDialogOpen(true);
  };

  const openEditDialog = (project: AdminProject) => {
    setEditing(project);
    setProjectDialogOpen(true);
  };

  const handleSaveProject = (project: AdminProject) => {
    if (editing) {
      setProjects((previous) =>
        previous.map((item) => (item.id === project.id ? project : item)),
      );
      toast.success(`Proyek "${project.title}" diperbarui.`);
      return;
    }

    setProjects((previous) => [project, ...previous]);
    toast.success(`Proyek "${project.title}" ditambahkan sebagai draft.`);
  };

  const handleToggleStatus = (id: string) => {
    const target = projects.find((project) => project.id === id);
    if (!target) return;

    const nextStatus =
      target.status === "Published" ? "Draft" : "Published";

    setProjects((previous) =>
      previous.map((project) =>
        project.id === id ? { ...project, status: nextStatus } : project,
      ),
    );

    toast.success(
      nextStatus === "Published"
        ? `"${target.title}" dipublikasikan.`
        : `"${target.title}" disembunyikan dari publik.`,
    );
  };

  const handleDelete = (id: string) => {
    const target = projects.find((project) => project.id === id);
    setProjects((previous) => previous.filter((project) => project.id !== id));
    toast.success(`"${target?.title ?? "Proyek"}" dihapus dari daftar.`);
  };

  const scrollToProjects = () => {
    document
      .getElementById("portfolio-projects")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-8 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-sm sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-gradient-to-br from-primary-fixed to-secondary-fixed opacity-40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 right-48 size-48 rounded-full bg-secondary-container/20 blur-2xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex max-w-2xl flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 font-tech-tag text-tech-tag text-primary">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary-container opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-secondary-container" />
                  </span>
                  Portofolio Live • darektoa.github.io
                </span>
                <a
                  href="https://darektoa.github.io"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-tech-tag text-tech-tag text-primary transition-colors hover:text-on-surface"
                >
                  <span>Buka Web</span>
                  <MaterialIcon name="arrow_outward" size={14} />
                </a>
              </div>

              <h1 className="font-headline-section text-headline-section-mobile tracking-tight text-on-surface sm:text-headline-section">
                Halo, Anwar!{" "}
                <span className="inline-block cursor-default transition-transform hover:rotate-12">
                  👋
                </span>
              </h1>
              <p className="font-body-default text-body-default text-on-surface-variant">
                Kelola konten portofolio, pantau statistik pengunjung real-time,
                dan perbarui kurasi proyek engineering Anda dari satu panel
                terintegrasi.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setExperienceDialogOpen(true)}
                className="h-auto rounded-xl bg-surface-container-high px-4 py-2.5 font-tech-tag text-tech-tag text-on-surface shadow-sm transition-all hover:bg-surface-container-highest"
              >
                <MaterialIcon name="add_circle" size={18} className="text-primary" />
                <span>+ Catat Pengalaman</span>
              </Button>
              <Button
                type="button"
                onClick={openCreateDialog}
                className="h-auto rounded-xl bg-primary px-5 py-2.5 font-tech-tag text-tech-tag text-on-primary shadow-md transition-all hover:bg-primary-container hover:shadow-lg"
              >
                <MaterialIcon name="add_box" size={18} />
                <span>+ Tambah Proyek Baru</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Pengunjung Web"
            value="14,820"
            icon="query_stats"
            iconClassName="bg-primary-fixed text-primary"
            footer={
              <>
                <div className="inline-flex items-center gap-1 rounded-md bg-surface-container px-2 py-0.5 font-tech-tag text-tech-tag text-primary">
                  <MaterialIcon name="trending_up" size={14} />
                  <span>+12.4%</span>
                </div>
                <span className="font-tech-tag text-tech-tag text-on-surface-variant">
                  vs bulan lalu
                </span>
              </>
            }
          />

          <MetricCard
            label="Proyek Ditampilkan"
            value={
              <span>
                12{" "}
                <span className="font-body-default text-body-default font-normal text-on-surface-variant">
                  Karya
                </span>
              </span>
            }
            icon="terminal"
            iconClassName="bg-secondary-fixed text-secondary"
            footer={
              <>
                <div className="inline-flex items-center gap-1.5 rounded-md bg-surface-container px-2 py-0.5 font-tech-tag text-tech-tag text-on-surface-variant">
                  <span className="size-1.5 rounded-full bg-secondary-container" />
                  <span>3 Kategori Aktif</span>
                </div>
                <button
                  type="button"
                  onClick={scrollToProjects}
                  className="font-tech-tag text-tech-tag text-primary hover:underline"
                >
                  Kelola Arsip
                </button>
              </>
            }
          />

          <MetricCard
            label="CV Resume Diunduh"
            value={
              <span>
                284{" "}
                <span className="font-body-default text-body-default font-normal text-on-surface-variant">
                  kali
                </span>
              </span>
            }
            icon="file_download"
            iconClassName="bg-surface-container-high text-primary-container"
            footer={
              <>
                <div className="inline-flex items-center gap-1 rounded-md bg-surface-container px-2 py-0.5 font-tech-tag text-tech-tag text-primary">
                  <MaterialIcon name="arrow_upward" size={14} />
                  <span>+18%</span>
                </div>
                <span className="font-tech-tag text-tech-tag text-on-surface-variant">
                  minggu ini
                </span>
              </>
            }
          />

          <MetricCard
            label="Inquiry & Pesan Baru"
            value={
              <span>
                9{" "}
                <span className="font-body-default text-body-default font-normal text-on-surface-variant">
                  inbox
                </span>
              </span>
            }
            icon="mark_email_unread"
            iconClassName="bg-surface-container-highest text-on-surface"
            footer={
              <>
                <div className="inline-flex items-center gap-1.5 rounded-md bg-primary-fixed px-2 py-0.5 font-tech-tag text-tech-tag text-on-primary-fixed-variant">
                  <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                  <span>3 Belum Dibaca</span>
                </div>
                <span className="font-tech-tag text-tech-tag text-on-surface-variant">
                  Prioritas Tinggi
                </span>
              </>
            }
          />
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-8">
            <AnalyticsChart />
            <div id="portfolio-projects" className="scroll-mt-24">
              <ProjectManager
                projects={projects}
                onAdd={openCreateDialog}
                onEdit={openEditDialog}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            </div>
          </div>

          <RightColumn />
        </div>
      </div>

      <ProjectDialog
        open={projectDialogOpen}
        project={editing}
        onOpenChange={setProjectDialogOpen}
        onSave={handleSaveProject}
      />
      <ExperienceDialog
        open={experienceDialogOpen}
        onOpenChange={setExperienceDialogOpen}
      />
    </>
  );
}
