import Reveal from "./Reveal";
import { SectionHeading } from "./AboutSection";
import { experiences as defaultExperiences, type Experience } from "@/lib/data";

const ExperienceSection = ({
  experiences = defaultExperiences,
}: {
  experiences?: Experience[];
}) => {
  return (
    <section id="experience" className="scroll-mt-16 relative bg-[#eceef2] py-14 lg:py-16 border-t border-slate-900/5">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <SectionHeading eyebrow="02 — Experience" title="Where I've worked" />
        </Reveal>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] md:left-1/2 md:-translate-x-px top-2 bottom-2 w-px bg-gradient-to-b from-brand-400/60 via-slate-900/10 to-transparent" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <Reveal key={exp.company} delay={i * 100}>
                <div
                  className={`relative flex flex-col md:flex-row gap-6 ${
                    i % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-2">
                    <span
                      className={`block w-[15px] h-[15px] rounded-full border-2 ${
                        exp.current
                          ? "bg-brand-600 border-brand-300 shadow-[0_0_0_4px_rgba(46,160,67,0.22)]"
                          : "bg-slate-300 border-slate-400"
                      }`}
                    />
                  </div>

                  {/* Card */}
                  <div className="ml-8 md:ml-0 md:w-1/2 md:px-8">
                    <div className="surface rounded-2xl p-6 hover:border-brand-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10 transition-all transition-colors duration-300">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-brand-600">
                          {exp.period}
                        </span>
                        {exp.current && (
                          <span className="px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-600 text-xs font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900">
                        {exp.role}
                      </h3>
                      <p className="text-slate-600 text-sm mt-1">
                        {exp.company} · {exp.location} · {exp.type}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {exp.points.map((point) => (
                          <li
                            key={point}
                            className="flex gap-2.5 text-sm text-slate-600 leading-relaxed"
                          >
                            <span className="text-slate-500 mt-1">▸</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Spacer for the other half */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
