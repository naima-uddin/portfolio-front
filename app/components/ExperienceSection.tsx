import Reveal from "./Reveal";
import { SectionHeading } from "./AboutSection";
import { experiences as defaultExperiences, type Experience } from "@/lib/data";

const ExperienceSection = ({
  experiences = defaultExperiences,
}: {
  experiences?: Experience[];
}) => {
  return (
    <section className="relative bg-[#0a0a0f] py-28 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <SectionHeading eyebrow="02 — Experience" title="Where I've worked" />
        </Reveal>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] md:left-1/2 md:-translate-x-px top-2 bottom-2 w-px bg-gradient-to-b from-emerald-400/50 via-white/10 to-transparent" />

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
                          ? "bg-emerald-400 border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.6)]"
                          : "bg-zinc-700 border-zinc-600"
                      }`}
                    />
                  </div>

                  {/* Card */}
                  <div className="ml-8 md:ml-0 md:w-1/2 md:px-8">
                    <div className="glass rounded-2xl p-6 hover:border-emerald-400/25 transition-colors duration-300">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-emerald-300">
                          {exp.period}
                        </span>
                        {exp.current && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {exp.role}
                      </h3>
                      <p className="text-zinc-400 text-sm mt-1">
                        {exp.company} · {exp.location} · {exp.type}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {exp.points.map((point) => (
                          <li
                            key={point}
                            className="flex gap-2.5 text-sm text-zinc-400 leading-relaxed"
                          >
                            <span className="text-emerald-400/70 mt-1">▸</span>
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
