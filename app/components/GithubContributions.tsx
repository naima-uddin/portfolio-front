import {
  Github,
  ArrowUpRight,
  Flame,
  Trophy,
  CalendarCheck,
  Zap,
} from "lucide-react";
import Reveal from "./Reveal";
import { stagger } from "@/lib/utils";
import { siteConfig } from "@/lib/data";

const username = siteConfig.github.split("/").filter(Boolean).pop() ?? "";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface GithubData {
  totalContributions: number;
  days: ContributionDay[];
}

// Heatmap cell colors by contribution level (GitHub dark-mode greens)
const LEVEL_COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

async function getGithubData(): Promise<GithubData | null> {
  try {
    const revalidate = { next: { revalidate: 3600 } };
    const contribRes = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      revalidate
    );
    if (!contribRes.ok) return null;

    const contrib = await contribRes.json();

    return {
      totalContributions: contrib.total?.lastYear ?? 0,
      days: contrib.contributions ?? [],
    };
  } catch (error) {
    console.error("GithubContributions: failed to fetch —", error);
    return null;
  }
}

// Streaks, active days and best day derived from the daily counts
function getInsights(days: ContributionDay[]) {
  let longest = 0;
  let run = 0;
  let active = 0;
  let best: ContributionDay | null = null;
  for (const day of days) {
    if (day.count > 0) {
      run += 1;
      active += 1;
      longest = Math.max(longest, run);
      if (!best || day.count > best.count) best = day;
    } else {
      run = 0;
    }
  }

  // Current streak: count back from today; an empty "today" doesn't break it yet
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current += 1;
    else if (i === days.length - 1) continue;
    else break;
  }

  return { longest, current, active, best };
}

function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

// GitHub activity section: terminal-style panel with heatmap and streaks.
const GithubContributions = async () => {
  const data = await getGithubData();

  // Group days into columns of 7 (weeks) for the heatmap grid
  const weeks: ContributionDay[][] = [];
  if (data) {
    for (let i = 0; i < data.days.length; i += 7) {
      weeks.push(data.days.slice(i, i + 7));
    }
  }

  // Month label above the first week that starts in a new month
  const monthLabels = weeks.map((week, wi) => {
    const month = new Date(`${week[0].date}T00:00:00`).getMonth();
    const prev = wi > 0 ? new Date(`${weeks[wi - 1][0].date}T00:00:00`).getMonth() : -1;
    return month !== prev && wi < weeks.length - 2 ? MONTHS[month] : "";
  });
  // Drop a label that would collide with the next one (e.g. a partial first month).
  monthLabels.forEach((label, i) => {
    if (!label) return;
    const next = monthLabels.findIndex((l, j) => j > i && l);
    if (next !== -1 && next - i < 3) monthLabels[i] = "";
  });

  const insights = data ? getInsights(data.days) : null;

  const highlights = insights
    ? [
        {
          icon: <Flame size={14} />,
          label: "Current streak",
          value: `${insights.current}`,
          unit: insights.current === 1 ? "day" : "days",
        },
        {
          icon: <Trophy size={14} />,
          label: "Longest streak",
          value: `${insights.longest}`,
          unit: insights.longest === 1 ? "day" : "days",
        },
        {
          icon: <CalendarCheck size={14} />,
          label: "Active days",
          value: `${insights.active}`,
          unit: "/ 365",
        },
        {
          icon: <Zap size={14} />,
          label: "Best day",
          value: `${insights.best?.count ?? 0}`,
          unit: insights.best ? `on ${formatDate(insights.best.date)}` : "",
        },
      ]
    : [];

  return (
    <section className="relative bg-[#eceef2] py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
            <div className="reveal-item" style={stagger(0)}>
              <h2 className="text-2xl lg:text-3xl font-bold text-zinc-900 tracking-tight">
                Code &amp; <span className="heading-accent text-brand-600">contributions</span>
              </h2>
              <p className="mt-1 text-xs text-slate-500 font-mono">
                {"// consistency isn't a goal — it's the default."}
              </p>
            </div>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              style={stagger(1)}
              className="reveal-item group inline-flex items-center gap-2 border border-zinc-900 px-5 py-2.5 font-mono text-sm font-bold text-zinc-900 transition-colors duration-300 hover:border-brand-600 hover:bg-brand-600 hover:text-white"
            >
              <Github size={16} />
              @{username}
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </Reveal>

        {data && insights ? (
          <Reveal>
            <div className="gradient-border gradient-border-always relative overflow-hidden rounded-2xl bg-[#0d1117] shadow-2xl shadow-brand-900/20">
              {/* Ambient glow + dot grid */}
              <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-brand-500/20 blur-[100px]" />
              <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-[100px]" />
              <div className="pointer-events-none absolute inset-0 bg-grid-dark" />

              {/* Window chrome */}
              <div className="relative flex items-center gap-3 border-b border-[#30363d] bg-[#161b22]/80 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <p className="flex-1 truncate text-center font-mono text-xs text-zinc-400">
                  ~/github/{username} — activity
                </p>
                <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] text-brand-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
                  </span>
                  live
                </span>
              </div>

              <div className="relative p-4 sm:p-5">
                {/* Command + headline number */}
                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                  <div className="reveal-item" style={stagger(0)}>
                    <p className="font-mono text-[11px] sm:text-xs text-zinc-500">
                      <span className="text-brand-400">❯</span> git log --author=
                      <span className="text-amber-300">&quot;{username}&quot;</span> --since=
                      <span className="text-amber-300">&quot;1 year ago&quot;</span>
                      <span className="typewriter-caret ml-1 h-3.5 align-middle !bg-brand-400" />
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-end gap-x-3">
                      <span className="text-shimmer text-4xl sm:text-5xl font-black tracking-tight leading-none">
                        {data.totalContributions.toLocaleString()}
                      </span>
                      <span className="pb-0.5 text-sm text-zinc-400">
                        contributions in the last year
                      </span>
                    </div>
                  </div>
                  <span style={stagger(1)} className="reveal-item inline-flex items-center gap-2 rounded-md border border-brand-500/40 bg-brand-500/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand-400">
                    <Flame size={13} />
                    Always shipping
                  </span>
                </div>

                {/* Heatmap */}
                {/* RTL scroller starts at the right edge, so on narrow screens the
                    latest weeks show first; mr-auto keeps it left-aligned when it fits. */}
                <div className="mt-4 overflow-x-auto pb-1 [direction:rtl] [scrollbar-width:thin]">
                  <div className="mr-auto w-max [direction:ltr]">
                    <div className="mb-1 flex gap-[3px] font-mono text-[10px] text-zinc-500">
                      {monthLabels.map((label, i) => (
                        <span key={i} className="w-[10px] overflow-visible whitespace-nowrap">
                          {label}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-[3px]">
                      {weeks.map((week, wi) => (
                        <div key={wi} className="reveal-cell flex flex-col gap-[3px]" style={stagger(wi)}>
                          {week.map((day) => (
                            <div
                              key={day.date}
                              title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                              className="h-[10px] w-[10px] rounded-[2px] outline -outline-offset-1 outline-white/[0.04] transition-transform duration-150 hover:scale-150 hover:outline-white/40"
                              style={{
                                backgroundColor: LEVEL_COLORS[day.level] ?? LEVEL_COLORS[0],
                                boxShadow:
                                  day.level >= 3
                                    ? `0 0 ${day.level === 4 ? 8 : 4}px ${LEVEL_COLORS[day.level]}99`
                                    : undefined,
                              }}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Streak highlights + legend */}
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#30363d] pt-3">
                  {highlights.map((h, i) => (
                    <div
                      key={h.label}
                      style={stagger(10 + i)}
                      className="reveal-item group inline-flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#161b22]/70 px-3 py-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/60 hover:shadow-md hover:shadow-brand-500/10"
                    >
                      <span className="text-brand-400 transition-transform duration-300 group-hover:scale-125">
                        {h.icon}
                      </span>
                      <span className="text-base font-bold text-white">{h.value}</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                        {h.label}
                        {h.unit && <span className="normal-case tracking-normal"> · {h.unit}</span>}
                      </span>
                    </div>
                  ))}
                  <div className="ml-auto hidden md:flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
                    less
                    {LEVEL_COLORS.map((color) => (
                      <span
                        key={color}
                        className="inline-block h-[10px] w-[10px] rounded-[2px] outline -outline-offset-1 outline-white/[0.06]"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    more
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ) : (
          // Fallback when GitHub APIs are unreachable at render time
          <Reveal>
            <div className="rounded-2xl border border-[#30363d] bg-[#0d1117] p-10 text-center">
              <p className="font-mono text-sm text-zinc-400">
                <span className="text-brand-400">❯</span> couldn&apos;t reach GitHub right now —{" "}
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 underline underline-offset-4 hover:text-brand-300"
                >
                  view the profile directly
                </a>
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default GithubContributions;
