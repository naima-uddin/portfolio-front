import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Download,
  GraduationCap,
  Github,
  Languages,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsPlayground from "@/components/SkillsPlayground";
import GithubContributions from "@/components/GithubContributions";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/siteContentService";

// Cached static HTML; revalidated on-demand when the admin saves, hourly otherwise.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About — Naima Uddin",
  description:
    "Frontend Developer at A2IT LTD with 2+ years of MERN stack experience. BSc in CSE from Daffodil International University.",
};

export default async function About() {
  const content = await getSiteContent();
  const {
    profile: siteConfig,
    education,
    stats,
    languages: languageFacts,
    aboutBio,
    experiences,
  } = content;

  return (
    <main className="bg-[#0a0a0f] min-h-screen">
      {/* Intro */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] glow-emerald" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_340px] gap-14 items-start">
            <div>
              <p className="animate-slide-down font-mono text-sm text-emerald-400 mb-4">
                About me
              </p>
              <h1
                className="animate-slide-up text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]"
                style={{ animationDelay: "100ms" }}
              >
                Turning ideas into{" "}
                <span className="text-gradient">fast, clean</span> web
                experiences.
              </h1>

              <div
                className="animate-slide-up mt-8 space-y-5 text-lg text-zinc-400 leading-relaxed max-w-2xl"
                style={{ animationDelay: "250ms" }}
              >
                {aboutBio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <div
                className="animate-slide-up mt-9 flex flex-wrap gap-4"
                style={{ animationDelay: "400ms" }}
              >
                <a
                  href={siteConfig.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-400 text-zinc-950 font-semibold hover:bg-emerald-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(52,211,153,0.35)]"
                >
                  <Download size={18} />
                  Download Resume
                </a>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass text-zinc-200 font-medium hover:bg-white/10 transition-all duration-300"
                >
                  Let&apos;s connect
                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </div>

            {/* Profile card */}
            <div
              className="animate-scale-in mx-auto lg:mx-0"
              style={{ animationDelay: "300ms" }}
            >
              <div className="glass rounded-3xl p-6 w-full max-w-sm">
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={siteConfig.photo}
                    alt={siteConfig.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="340px"
                  />
                </div>
                <div className="space-y-3 text-sm">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-center gap-3 text-zinc-400 hover:text-emerald-300 transition-colors"
                  >
                    <Mail size={16} className="text-emerald-400" />
                    {siteConfig.email}
                  </a>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="flex items-center gap-3 text-zinc-400 hover:text-emerald-300 transition-colors"
                  >
                    <Phone size={16} className="text-emerald-400" />
                    {siteConfig.phoneDisplay}
                  </a>
                  <p className="flex items-center gap-3 text-zinc-400">
                    <MapPin size={16} className="text-emerald-400" />
                    {siteConfig.location}
                  </p>
                </div>
                <div className="flex gap-2 mt-6 pt-5 border-t border-white/10">
                  <a
                    href={siteConfig.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-zinc-300 text-sm hover:bg-white/10 hover:text-emerald-300 transition-all"
                  >
                    <Github size={16} />
                    GitHub
                  </a>
                  <a
                    href={siteConfig.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-zinc-300 text-sm hover:bg-white/10 hover:text-emerald-300 transition-all"
                  >
                    <Linkedin size={16} />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Stats (awrs-style counters) */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80}>
                <div className="glass rounded-2xl p-6 h-full text-center hover:border-emerald-400/25 transition-colors duration-300">
                  <p className="text-3xl sm:text-4xl font-bold text-gradient">
                    {stat.value}
                  </p>
                  <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mt-2">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Facts bento: location, languages, quote */}
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Reveal>
              <div className="glass rounded-2xl p-6 h-full hover:border-emerald-400/25 transition-colors duration-300">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-300 flex items-center justify-center mb-4">
                  <MapPin size={18} />
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                  Location
                </p>
                <p className="text-sm font-medium text-zinc-200 mt-1.5">
                  {siteConfig.location}
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="glass rounded-2xl p-6 h-full hover:border-emerald-400/25 transition-colors duration-300">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-300 flex items-center justify-center mb-4">
                  <Languages size={18} />
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                  Languages
                </p>
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {languageFacts.map((lang) => (
                    <span
                      key={lang.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300"
                    >
                      {lang.name}
                      <span className="text-[10px] font-mono uppercase text-emerald-300">
                        {lang.level}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="glass rounded-2xl p-6 h-full flex flex-col justify-center hover:border-emerald-400/25 transition-colors duration-300 sm:col-span-2 lg:col-span-1">
                <p className="text-lg text-zinc-200 font-medium leading-relaxed">
                  &ldquo;First, solve the problem. Then, write the code.&rdquo;
                </p>
                <p className="text-xs font-mono text-zinc-500 mt-3">
                  — John Johnson
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Experience (shared with home) */}
      <ExperienceSection experiences={experiences} />

      {/* Education */}
      <section className="relative bg-[#0a0a0f] py-28 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl">
              <p className="font-mono text-sm text-emerald-400 mb-3">
                Education
              </p>
              <h2 className="text-3xl font-bold text-white tracking-tight mb-8">
                Where I studied
              </h2>
              <div className="glass rounded-2xl p-7 hover:border-emerald-400/25 transition-colors duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-400/10 text-emerald-300 flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {education.degree}
                    </h3>
                    <p className="text-zinc-400 mt-1">
                      {education.institution}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3 text-sm">
                      <span className="font-mono text-emerald-300">
                        {education.period}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs font-medium">
                        {education.result}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium">
                        Graduate
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Skills playground */}
      <SkillsPlayground />

      {/* GitHub activity */}
      <GithubContributions />

      <Footer config={siteConfig} />
    </main>
  );
}
