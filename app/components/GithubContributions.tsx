import { Github, Star, Users, FolderGit2, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import { siteConfig } from "@/lib/data";

const username = siteConfig.github.split("/").filter(Boolean).pop() ?? "";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface GithubData {
  followers: number;
  repos: number;
  stars: number;
  totalContributions: number;
  days: ContributionDay[];
}

// Heatmap cell colors by contribution level (dark → bright emerald)
const LEVEL_COLORS = [
  "rgba(255,255,255,0.06)",
  "rgba(52,211,153,0.25)",
  "rgba(52,211,153,0.45)",
  "rgba(52,211,153,0.7)",
  "#34d399",
];

async function getGithubData(): Promise<GithubData | null> {
  try {
    const revalidate = { next: { revalidate: 3600 } };
    const [userRes, contribRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, revalidate),
      fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
        revalidate
      ),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        revalidate
      ),
    ]);
    if (!userRes.ok || !contribRes.ok) return null;

    const user = await userRes.json();
    const contrib = await contribRes.json();
    let stars = 0;
    if (reposRes.ok) {
      const repos: { stargazers_count?: number }[] = await reposRes.json();
      stars = repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);
    }

    return {
      followers: user.followers ?? 0,
      repos: user.public_repos ?? 0,
      stars,
      totalContributions: contrib.total?.lastYear ?? 0,
      days: contrib.contributions ?? [],
    };
  } catch (error) {
    console.error("GithubContributions: failed to fetch —", error);
    return null;
  }
}

// GitHub activity section: contribution heatmap + profile stats.
const GithubContributions = async () => {
  const data = await getGithubData();

  // Group days into columns of 7 (weeks) for the heatmap grid
  const weeks: ContributionDay[][] = [];
  if (data) {
    for (let i = 0; i < data.days.length; i += 7) {
      weeks.push(data.days.slice(i, i + 7));
    }
  }

  const stats = data
    ? [
        {
          icon: <Users size={18} />,
          label: "Followers",
          value: data.followers,
        },
        {
          icon: <FolderGit2 size={18} />,
          label: "Repositories",
          value: data.repos,
        },
        { icon: <Star size={18} />, label: "GitHub Stars", value: data.stars },
      ]
    : [];

  return (
    <section className="relative bg-[#0a0a0f] py-28 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="font-mono text-sm text-emerald-400 mb-3">GitHub</p>
              <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">
                Code &amp; <span className="text-gradient">Contributions</span>
              </h2>
              <p className="mt-4 text-zinc-400">
                Contribution activity on GitHub
              </p>
            </div>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-zinc-200 text-sm font-medium hover:bg-white/10 transition-all duration-300"
            >
              <Github size={17} />@{username}
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </Reveal>

        {data ? (
          <>
            {/* Heatmap */}
            <Reveal>
              <div className="glass rounded-3xl p-6 sm:p-8">
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-[3px] w-max">
                    {weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-[3px]">
                        {week.map((day) => (
                          <div
                            key={day.date}
                            title={`${day.count} contributions on ${day.date}`}
                            className="w-[10px] h-[10px] rounded-[2px]"
                            style={{
                              backgroundColor: LEVEL_COLORS[day.level] ?? LEVEL_COLORS[0],
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-5 border-t border-white/5">
                  <p className="text-sm text-zinc-300">
                    <span className="font-bold text-emerald-300">
                      {data.totalContributions.toLocaleString()}
                    </span>{" "}
                    contributions in the last year
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    Less
                    {LEVEL_COLORS.map((color) => (
                      <span
                        key={color}
                        className="w-[10px] h-[10px] rounded-[2px] inline-block"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    More
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 80}>
                  <div className="glass rounded-2xl p-6 flex items-center gap-4 hover:border-emerald-400/25 transition-colors duration-300">
                    <div className="w-11 h-11 rounded-xl bg-emerald-400/10 text-emerald-300 flex items-center justify-center flex-shrink-0">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {stat.value.toLocaleString()}
                      </p>
                      <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          // Fallback when GitHub APIs are unreachable at render time
          <Reveal>
            <div className="glass rounded-3xl p-10 text-center">
              <p className="text-zinc-400">
                Couldn&apos;t load GitHub activity right now — check out my
                profile directly.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default GithubContributions;
