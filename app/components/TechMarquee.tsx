import { marqueeSkills as defaultMarquee } from "@/lib/data";

// Two infinite scrolling tech strips moving in opposite directions.
// Each list is duplicated so the -50% translate loops seamlessly.
const Row = ({
  reverse = false,
  skills,
}: {
  reverse?: boolean;
  skills: string[];
}) => {
  const base = reverse ? [...skills].reverse() : skills;
  const items = [...base, ...base];

  return (
    <div
      className={`flex w-max gap-10 ${
        reverse ? "animate-marquee-reverse" : "animate-marquee"
      }`}
    >
      {items.map((skill, i) => (
        <span
          key={i}
          className="flex items-center gap-10 font-mono text-sm text-slate-500 whitespace-nowrap hover:text-brand-600 transition-colors"
        >
          {skill}
          <span className="text-slate-500 text-xs">◆</span>
        </span>
      ))}
    </div>
  );
};

const TechMarquee = ({
  marqueeSkills = defaultMarquee,
}: {
  marqueeSkills?: string[];
}) => {
  return (
    <div className="relative bg-[#eceef2] border-y border-slate-900/5 py-6 overflow-hidden marquee-paused space-y-5">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[#eceef2] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[#eceef2] to-transparent" />

      <Row skills={marqueeSkills} />
      <Row reverse skills={marqueeSkills} />
    </div>
  );
};

export default TechMarquee;
