import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsPlayground from "@/components/SkillsPlayground";
import FeaturedProjects from "@/components/FeaturedProjects";
import GithubContributions from "@/components/GithubContributions";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/siteContentService";

// Served as cached static HTML for instant loads. It's regenerated
// on-demand the moment the admin saves (the content/project APIs call
// revalidatePath), and hourly as a safety net — so pages are fast AND fresh.
export const revalidate = 3600;

// One-page overview: every section of the portfolio in order.
// The dedicated pages (/about, /projects, /contact) show each part on its own.
export default async function Home() {
  const content = await getSiteContent();

  return (
    <main className="bg-[#eceef2]">
      <Hero
        config={content.profile}
        intro={content.heroIntro}
        stats={content.stats}
      />
      <AboutSection
        config={content.profile}
        education={content.education}
        skills={content.skills}
        stats={content.stats}
      />
      <ExperienceSection experiences={content.experiences} />
      <SkillsPlayground extraSkills={content.marqueeSkills} />
      <FeaturedProjects />
      <GithubContributions />
      <ContactSection config={content.profile} />
      <Footer config={content.profile} />
    </main>
  );
}
