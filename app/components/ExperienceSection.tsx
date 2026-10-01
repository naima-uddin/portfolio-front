import Image from "next/image";
import Reveal from "./Reveal";
import { stagger } from "@/lib/utils";
import {
  siteConfig,
  experiences as defaultExperiences,
  type Experience,
  type SiteConfig,
} from "@/lib/data";

// Fabric lanyard drawn as one piece with the clasp: two straps come down
// from above (fading out at the top), fold into a crimped end, then a swivel
// ring and lobster clasp whose hook ends inside the card's punched slot.
const Lanyard = () => (
  <svg
    viewBox="0 55 230 197"
    className="relative z-10 mx-auto block h-[154px] w-[180px]"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="strap-l" x1="0" x2="1">
        <stop offset="0" stopColor="#d5d9de" />
        <stop offset="0.35" stopColor="#ffffff" />
        <stop offset="1" stopColor="#e4e7eb" />
      </linearGradient>
      <linearGradient id="strap-r" x1="0" x2="1">
        <stop offset="0" stopColor="#cfd3d9" />
        <stop offset="0.5" stopColor="#eceef1" />
        <stop offset="1" stopColor="#d3d7dc" />
      </linearGradient>
      <linearGradient id="metal" x1="0" x2="1">
        <stop offset="0" stopColor="#6f7680" />
        <stop offset="0.4" stopColor="#f1f3f5" />
        <stop offset="0.6" stopColor="#c9ced4" />
        <stop offset="1" stopColor="#737a84" />
      </linearGradient>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.35" stopColor="#fff" stopOpacity="1" />
      </linearGradient>
      <mask id="strap-fade">
        <rect y="55" width="230" height="197" fill="url(#fade)" />
      </mask>
      <filter id="soft" x="-30%" y="-10%" width="160%" height="120%">
        <feDropShadow dx="1" dy="1.5" stdDeviation="1.2" floodColor="#0f172a" floodOpacity="0.18" />
      </filter>
    </defs>

    <g mask="url(#strap-fade)" filter="url(#soft)">
      {/* Back strap (right), slightly darker */}
      <path d="M150 0 L172 0 L124 158 L108 158 Z" fill="url(#strap-r)" stroke="#c4c9cf" strokeWidth="0.8" />
      {/* Front strap (left) */}
      <path d="M58 0 L80 0 L122 160 L104 160 Z" fill="url(#strap-l)" stroke="#c4c9cf" strokeWidth="0.8" />
      {/* Woven edge lines */}
      <path d="M61.5 0 L106.5 158" stroke="#d9dde2" strokeWidth="0.7" />
      <path d="M76.5 0 L119.5 158" stroke="#d9dde2" strokeWidth="0.7" />
    </g>

    <g filter="url(#soft)">
      {/* Folded end of the strap */}
      <path d="M104 156 L126 156 L124 182 L106 182 Z" fill="url(#strap-l)" stroke="#c4c9cf" strokeWidth="0.8" />
      <path d="M107 160 L123 160 M107 178 L123 178" stroke="#cdd2d8" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
      {/* Metal crimp */}
      <rect x="103" y="180" width="24" height="11" rx="2" fill="url(#metal)" stroke="#5f666f" strokeWidth="0.8" />
      <path d="M106 183.5 H124 M106 187.5 H124" stroke="#8a919a" strokeWidth="0.6" />
      {/* Swivel */}
      <rect x="111" y="191" width="8" height="6" rx="1.5" fill="url(#metal)" stroke="#5f666f" strokeWidth="0.7" />
      <circle cx="115" cy="202" r="5" fill="none" stroke="url(#metal)" strokeWidth="2.6" />
      {/* Lobster clasp body */}
      <path
        d="M109 206 C103 212 103 228 109 234 L121 234 C127 228 127 212 121 206 Z"
        fill="url(#metal)"
        stroke="#5f666f"
        strokeWidth="0.9"
      />
      <rect x="121" y="214" width="4" height="7" rx="1" fill="#8a919a" />
      {/* Hook going down into the slot */}
      <path d="M115 233 L115 244 C115 251 123 251 123 245" fill="none" stroke="#6f7680" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M115 233 L115 244 C115 251 123 251 123 245" fill="none" stroke="#d5d9de" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  </svg>
);

const IdCard = ({ config }: { config: SiteConfig }) => {
  const image = config.idCardImage || config.photo;

  return (
    <div className="animate-id-swing origin-top">
      <Lanyard />
      {/* Clear plastic holder — pulled up so the clasp hook sits in the slot */}
      <div className="relative mx-auto -mt-[11px] w-[180px] rounded-xl border border-slate-300/80 bg-white/45 px-2 pb-2.5 pt-6 shadow-[0_24px_40px_-14px_rgba(15,23,42,0.35)] backdrop-blur-[2px]">
        {/* Punched slot + side holes */}
        <div className="absolute left-1/2 top-1.5 h-2.5 w-12 -translate-x-1/2 rounded-full bg-[#dfe2e7] ring-1 ring-slate-400/60 shadow-[inset_0_1px_2px_rgba(15,23,42,0.25)]" />
        <div className="absolute left-4 top-2 h-1.5 w-1.5 rounded-full bg-[#dfe2e7] ring-1 ring-slate-400/50" />
        <div className="absolute right-4 top-2 h-1.5 w-1.5 rounded-full bg-[#dfe2e7] ring-1 ring-slate-400/50" />

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md ring-1 ring-slate-900/10">
          <Image
            src={image}
            alt={config.name}
            fill
            sizes="180px"
            className="object-cover object-top"
          />
        </div>

        {/* Plastic sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/60 via-white/0 to-white/25" />
        <div className="pointer-events-none absolute inset-y-6 left-1 w-1 rounded-full bg-white/70" />
      </div>
    </div>
  );
};

const ExperienceColumn = ({
  heading,
  items,
  offset,
}: {
  heading: string;
  items: Experience[];
  // Stagger start; columns interleave (col 1 = 1, 3, 5…, col 2 = 2, 4, 6…).
  offset: number;
}) => (
  <div>
    <h3 className="reveal-item text-sm font-bold uppercase tracking-[0.12em] text-zinc-900" style={stagger(offset)}>
      {heading}
    </h3>
    <div className="mt-3 space-y-5">
      {items.map((exp, j) => (
        <div key={`${exp.company}-${exp.role}`} className="reveal-item" style={stagger(offset + 1 + j * 2)}>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-zinc-900">{exp.role}</p>
            {exp.current && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 ring-1 ring-brand-200">
                Current
              </span>
            )}
          </div>
          <p className="text-sm text-slate-700">{exp.company}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {exp.period} · {exp.type}
          </p>
          {exp.points.length > 0 && (
            <ul className="mt-1.5 space-y-0.5">
              {exp.points.map((point) => (
                <li key={point} className="flex gap-2 text-xs leading-relaxed text-slate-500">
                  <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-brand-500" />
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Current roles in the first column, past ones in the second. If every role
// falls on one side, the list is simply split in half instead.
function splitColumns(experiences: Experience[]) {
  const current = experiences.filter((e) => e.current);
  const past = experiences.filter((e) => !e.current);
  if (current.length && past.length) {
    return [
      { heading: "Currently", items: current },
      { heading: "Previously", items: past },
    ];
  }
  const half = Math.ceil(experiences.length / 2);
  return [
    { heading: "Experience", items: experiences.slice(0, half) },
    { heading: "Experience", items: experiences.slice(half) },
  ].filter((c) => c.items.length);
}

const ExperienceSection = ({
  experiences = defaultExperiences,
  config = siteConfig,
}: {
  experiences?: Experience[];
  config?: SiteConfig;
}) => {
  const columns = splitColumns(experiences);

  return (
    <section id="experience" className="scroll-mt-16 relative bg-[#eceef2] pb-8 lg:pb-10">
      {/* Same content width as the hero banner */}
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
            {/* ID card hanging from its lanyard */}
            <div className="reveal-drop origin-top">
              <IdCard config={config} />
            </div>

            <div className="lg:pl-10">
              <h2 className="reveal-item text-2xl lg:text-3xl font-bold text-zinc-900 tracking-tight" style={stagger(0)}>
                Where I&apos;ve <span className="heading-accent text-brand-600">worked</span>
              </h2>

              <div className="mt-5 grid gap-6 md:grid-cols-2 md:gap-0 md:divide-x md:divide-slate-200">
                {columns.map((col, i) => (
                  <div key={col.heading + i} className={i > 0 ? "md:pl-8" : "md:pr-8"}>
                    <ExperienceColumn heading={col.heading} items={col.items} offset={1 + i} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ExperienceSection;
