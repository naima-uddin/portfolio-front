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
import { stagger } from "@/lib/utils";
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
    <main className="bg-[#eceef2] min-h-screen">
      {/* Intro */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] glow-emerald" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#eceef2]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_340px] gap-14 items-start">
            <div>
              <p className="animate-slide-down font-mono text-sm font-semibold text-brand-600 mb-4">
                About me
              </p>
              <h1
                className="animate-slide-up text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 tracking-tight leading-[1.1]"
                style={{ animationDelay: "100ms" }}
              >
                Turning ideas into{" "}
                <span className="heading-accent heading-accent-load text-gradient">fast, clean</span> web
                experiences.
              </h1>

              <div
                className="animate-slide-up mt-8 space-y-5 text-lg text-slate-600 leading-relaxed max-w-2xl"
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
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-all duration-300 hover:shadow-lg shadow-brand-600/25"
                >
                  <Download size={18} />
                  Download Resume
                </a>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full surface text-zinc-800 font-medium hover:bg-brand-700/10 transition-all duration-300"
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
              <div className="surface rounded-3xl p-6 w-full max-w-sm">
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
                    className="flex items-center gap-3 text-slate-600 hover:text-brand-600 transition-colors"
                  >
                    <Mail size={16} className="text-slate-500" />
                    {siteConfig.email}
                  </a>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="flex items-center gap-3 text-slate-600 hover:text-brand-600 transition-colors"
                  >
                    <Phone size={16} className="text-slate-500" />
                    {siteConfig.phoneDisplay}
                  </a>
                  <p className="flex items-center gap-3 text-slate-600">
                    <MapPin size={16} className="text-slate-500" />
                    {siteConfig.location}
                  </p>
                </div>
                <div className="flex gap-2 mt-6 pt-5 border-t border-slate-900/10">
                  <a
                    href={siteConfig.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900/5 text-slate-700 text-sm hover:bg-brand-700/10 hover:text-brand-600 transition-all"
                  >
                    <Github size={16} />
                    GitHub
                  </a>
                  <a
                    href={siteConfig.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900/5 text-slate-700 text-sm hover:bg-brand-700/10 hover:text-brand-600 transition-all"
                  >
                    <Linkedin size={16} />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Stats (awrs-style counters) */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80}>
                <div className="surface rounded-2xl p-6 h-full text-center hover:border-brand-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300">
                  <p className="text-3xl sm:text-4xl font-bold text-gradient">
                    {stat.value}
                  </p>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mt-2">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Facts bento: location, languages, quote */}
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Reveal>
              <div className="surface rounded-2xl p-6 h-full hover:border-brand-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                  <MapPin size={18} />
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  Location
                </p>
                <p className="text-sm font-medium text-zinc-800 mt-1.5">
                  {siteConfig.location}
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="surface rounded-2xl p-6 h-full hover:border-brand-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                  <Languages size={18} />
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  Languages
                </p>
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {languageFacts.map((lang) => (
                    <span
                      key={lang.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-xs text-slate-700"
                    >
                      {lang.name}
                      <span className="text-[10px] font-mono uppercase text-brand-600">
                        {lang.level}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="surface rounded-2xl p-6 h-full flex flex-col justify-center hover:border-brand-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                <p className="text-lg text-zinc-800 font-medium leading-relaxed">
                  &ldquo;First, solve the problem. Then, write the code.&rdquo;
                </p>
                <p className="text-xs font-mono text-slate-500 mt-3">
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
      <section className="relative bg-[#eceef2] py-14 lg:py-16 border-t border-slate-900/5">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl">
              <h2
                className="reveal-item text-2xl lg:text-3xl font-bold text-zinc-900 tracking-tight mb-6"
                style={stagger(0)}
              >
                Where I <span className="heading-accent text-brand-600">studied</span>
              </h2>
              <div style={stagger(1)} className="reveal-item surface rounded-2xl p-7 hover:border-brand-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">
                      {education.degree}
                    </h3>
                    <p className="text-slate-600 mt-1">
                      {education.institution}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3 text-sm">
                      <span className="font-mono text-brand-600">
                        {education.period}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-600 text-xs font-medium">
                        {education.result}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-700 text-xs font-medium">
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
