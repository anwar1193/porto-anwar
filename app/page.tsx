import { AchievementsSection } from "@/components/landing/achievements-section";
import { CtaSection } from "@/components/landing/cta-section";
import { ExperiencesSection } from "@/components/landing/experiences-section";
import { Hero } from "@/components/landing/hero";
import { ProjectsSection } from "@/components/landing/projects-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { SkillsSection } from "@/components/landing/skills-section";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <SiteHeader />

      <main className="w-full flex-grow bg-surface pt-20">
        <div className="relative flex w-full flex-col overflow-hidden">
          <div className="pointer-events-none absolute right-1/4 top-0 size-96 rounded-full bg-secondary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-32 top-[30%] size-[32rem] rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[20%] right-10 size-[28rem] rounded-full bg-secondary-fixed-dim/15 blur-3xl" />

          <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-space-3xl px-margin py-space-xl md:px-margin-md lg:px-margin-lg">
            <Hero />
            <ProjectsSection />
            <AchievementsSection />
            <ExperiencesSection />
            <SkillsSection />
            <CtaSection />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
