import Link from "next/link";
import { ArrowRight, GraduationCap, MapPin, Briefcase } from "lucide-react";
import Reveal from "./Reveal";
import {
  siteConfig,
  education as defaultEducation,
  skills as defaultSkills,
  type SiteConfig,
  type Education,
  type Skills,
} from "@/lib/data";

const SectionHeading = ({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) => (
  <div className="mb-14">
    <p className="font-mono text-sm text-emerald-400 mb-3">{eyebrow}</p>
    <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">
      {title}
    </h2>
  </div>
);

const AboutSection = ({
  config = siteConfig,
  education = defaultEducation,
  skills = defaultSkills,
}: {
  config?: SiteConfig;
  education?: Education;
  skills?: Skills;
}) => {
  return (
    <section id="about" className="scroll-mt-16 relative bg-[#0a0a0f] py-28">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <SectionHeading eyebrow="01 — About" title="Who I am" />
        </Reveal>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10">
          {/* Bio */}
          <Reveal>
            <div className="space-y-5 text-lg text-zinc-400 leading-relaxed">
              <p>{config.summary}</p>
              <p>
                I&apos;ve built production systems ranging from{" "}
                <span className="text-zinc-200">
                  government approval platforms
                </span>{" "}
                and <span className="text-zinc-200">trading dashboards</span>{" "}
                to <span className="text-zinc-200">learning platforms</span>{" "}
                with video streaming — always with a strong problem-solving
                mindset and clean code practices.
              </p>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-emerald-300 font-medium hover:text-emerald-200 transition-colors"
              >
                More about me
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>

          {/* Quick facts bento */}
          <div className="grid gap-4">
            {[
              {
                icon: <Briefcase size={18} />,
                label: "Currently",
                value: `${config.role.split("·")[0].trim()} @ ${config.company}`,
              },
              {
                icon: <GraduationCap size={18} />,
                label: "Education",
                value: `${education.degree.replace(
                  "Computer Science & Engineering",
                  "CSE"
                )}, DIU · ${education.result}`,
              },
              {
                icon: <MapPin size={18} />,
                label: "Based in",
                value: config.location,
              },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 100}>
                <div className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-emerald-400/25 transition-colors duration-300">
                  <div className="w-11 h-11 rounded-xl bg-emerald-400/10 text-emerald-300 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-zinc-200 mt-0.5">
                      {item.value}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(
            [
              ["Frontend", skills.frontend],
              ["Backend", skills.backend],
              ["Database", skills.database],
              ["Tools", skills.tools],
            ] as [string, string[]][]
          ).map(([group, list], i) => (
            <Reveal key={group} delay={i * 100}>
              <div className="glass rounded-2xl p-6 h-full hover:border-emerald-400/25 transition-colors duration-300">
                <h3 className="font-mono text-sm text-emerald-400 mb-4">
                  {group}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {list.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
export { SectionHeading };
