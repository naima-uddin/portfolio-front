"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiRedux,
  SiTailwindcss,
  SiFramer,
  SiThreedotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiFirebase,
  SiGit,
  SiGithub,
  SiPostman,
  SiFigma,
  SiReactquery,
  SiShadcnui,
  SiOpenapiinitiative,
} from "react-icons/si";
import { GiBearFace } from "react-icons/gi";
import { LuServer, LuCodeXml } from "react-icons/lu";
import { marqueeSkills as defaultExtraSkills } from "@/lib/data";

interface Tech {
  name: string;
  Icon: IconType;
  color: string;
}

const TECHS: Tech[] = [
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#111111" },
  { name: "Redux", Icon: SiRedux, color: "#764ABC" },
  { name: "Tailwind", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Framer", Icon: SiFramer, color: "#0055FF" },
  { name: "Three.js", Icon: SiThreedotjs, color: "#111111" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#339933" },
  { name: "Express", Icon: SiExpress, color: "#111111" },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
  { name: "Firebase", Icon: SiFirebase, color: "#FFCA28" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "GitHub", Icon: SiGithub, color: "#181717" },
  { name: "Postman", Icon: SiPostman, color: "#FF6C37" },
  { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
];

// Icons for skills that can be added from the dashboard's skill list.
// Keys are normalized names (lowercase, letters/digits only).
const EXTRA_ICONS: Record<string, Omit<Tech, "name">> = {
  zustand: { Icon: GiBearFace, color: "#443E38" },
  tanstackquery: { Icon: SiReactquery, color: "#FF4154" },
  reactquery: { Icon: SiReactquery, color: "#FF4154" },
  shadcnui: { Icon: SiShadcnui, color: "#111111" },
  restapi: { Icon: SiOpenapiinitiative, color: "#6BA539" },
  ssr: { Icon: LuServer, color: "#1a7f37" },
};

// Aliases so "Tailwind CSS" matches the "Tailwind" bubble, etc.
const ALIASES: Record<string, string> = {
  tailwindcss: "tailwind",
  framermotion: "framer",
  expressjs: "express",
  node: "nodejs",
};

const normalize = (name: string) => {
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return ALIASES[key] ?? key;
};

// Built-in bubbles plus any skill from the dashboard list not already shown.
function buildTechs(extra: string[]): Tech[] {
  const seen = new Set(TECHS.map((t) => normalize(t.name)));
  const list = [...TECHS];
  for (const name of extra) {
    const key = normalize(name);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    list.push({
      name,
      ...(EXTRA_ICONS[key] ?? { Icon: LuCodeXml, color: "#1a7f37" }),
    });
  }
  return list;
}

interface Body {
  x: number; // center x
  y: number; // center y
  vx: number;
  vy: number;
  dragging: boolean;
}

const GRAVITY = 0.35;
const BOUNCE = 0.55;
const FRICTION = 0.995;

// Interactive "ball pit" of tech icons: chips drop in when the section
// scrolls into view, collide with each other, and can be thrown around.
const SkillsPlayground = ({
  extraSkills = defaultExtraSkills,
}: {
  extraSkills?: string[];
}) => {
  const techs = useMemo(() => buildTechs(extraSkills), [extraSkills]);
  const containerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const [started, setStarted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    let width = 0;
    let height = 0;
    let radius = 44;
    let spawned = false;

    // Radius comes from the rendered chip so physics always matches its CSS size.
    const measure = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      const chip = chipRefs.current[0];
      radius = chip?.offsetWidth ? chip.offsetWidth / 2 : width < 640 ? 34 : 44;
    };

    // Scatter chips along the top so they rain down. Deferred until the
    // container has a real size — spawning against a 0×0 box (e.g. right
    // after a hot reload or a jump-link) pins every chip above the box.
    const spawn = () => {
      bodies.current = techs.map((_, i) => ({
        x: radius + Math.random() * (width - radius * 2),
        y: -radius - Math.random() * height * 0.8 - i * 10,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        dragging: false,
      }));
      spawned = true;
    };

    const onResize = measure;
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    // Pointer dragging
    let dragIndex = -1;
    let lastPointer = { x: 0, y: 0 };

    const toLocal = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onPointerDown = (e: PointerEvent) => {
      const p = toLocal(e);
      for (let i = bodies.current.length - 1; i >= 0; i--) {
        const b = bodies.current[i];
        if ((p.x - b.x) ** 2 + (p.y - b.y) ** 2 < radius * radius) {
          dragIndex = i;
          b.dragging = true;
          lastPointer = p;
          container.setPointerCapture(e.pointerId);
          e.preventDefault();
          break;
        }
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (dragIndex < 0) return;
      const p = toLocal(e);
      const b = bodies.current[dragIndex];
      b.vx = p.x - lastPointer.x;
      b.vy = p.y - lastPointer.y;
      b.x = p.x;
      b.y = p.y;
      lastPointer = p;
    };
    const endDrag = () => {
      if (dragIndex >= 0) {
        bodies.current[dragIndex].dragging = false;
        dragIndex = -1;
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", endDrag);
    container.addEventListener("pointercancel", endDrag);

    let raf = 0;
    const step = () => {
      if (!spawned) {
        measure();
        if (width <= radius * 2 || height <= 0) {
          raf = requestAnimationFrame(step);
          return;
        }
        spawn();
      }
      const list = bodies.current;
      for (const b of list) {
        if (!b.dragging) {
          b.vy += GRAVITY;
          b.vx *= FRICTION;
          b.x += b.vx;
          b.y += b.vy;
        }
        // Walls & floor (ceiling open so chips can rain in)
        if (b.x < radius) {
          b.x = radius;
          b.vx = Math.abs(b.vx) * BOUNCE;
        } else if (b.x > width - radius) {
          b.x = width - radius;
          b.vx = -Math.abs(b.vx) * BOUNCE;
        }
        if (b.y > height - radius) {
          b.y = height - radius;
          b.vy = -Math.abs(b.vy) * BOUNCE;
          if (Math.abs(b.vy) < 0.8) b.vy = 0;
        }
      }

      // Pairwise circle collisions (positional separation + damped bounce)
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i];
          const b = list[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.01;
          const minDist = radius * 2;
          if (dist < minDist) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = (minDist - dist) / 2;
            if (!a.dragging) {
              a.x -= nx * overlap;
              a.y -= ny * overlap;
            }
            if (!b.dragging) {
              b.x += nx * overlap;
              b.y += ny * overlap;
            }
            // Exchange velocity along the collision normal
            const relV = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (relV < 0) {
              const impulse = relV * BOUNCE;
              if (!a.dragging) {
                a.vx += nx * impulse;
                a.vy += ny * impulse;
              }
              if (!b.dragging) {
                b.vx -= nx * impulse;
                b.vy -= ny * impulse;
              }
            }
          }
        }
      }

      for (let i = 0; i < list.length; i++) {
        const chip = chipRefs.current[i];
        if (chip) {
          chip.style.transform = `translate(${list[i].x - radius}px, ${list[i].y - radius
            }px)`;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", endDrag);
      container.removeEventListener("pointercancel", endDrag);
    };
  }, [started, reducedMotion, techs]);

  return (
    <section id="skills" className="scroll-mt-16 relative bg-[#eceef2] pt-0 pb-8 lg:pb-10 overflow-hidden">
      <div className="relative mx-auto w-full max-w-7xl px-6">
        <div className="text-center mb-3">
          <h2 className="text-2xl lg:text-3xl font-bold text-zinc-900 tracking-tight">
            My <span className="text-brand-600">Skills</span>
          </h2>
          {!reducedMotion && (
            <p className="mt-1 text-xs text-slate-500 font-mono">
              ✦ grab a bubble and throw it around
            </p>
          )}
        </div>

        {reducedMotion ? (
          // Static fallback when the user prefers reduced motion
          <div className="flex flex-wrap justify-center gap-4">
            {techs.map(({ name, Icon, color }) => (
              <div
                key={name}
                className="flex items-center gap-2.5 px-5 py-3 rounded-full surface"
              >
                <Icon size={20} style={{ color }} />
                <span className="font-mono text-xs uppercase tracking-wide text-slate-700">
                  {name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={containerRef}
            className="relative h-[320px] sm:h-[170px] overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing"
          >
            {techs.map(({ name, Icon, color }, i) => (
              <div
                key={name}
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                className="absolute top-0 left-0 w-[64px] h-[64px] sm:w-[76px] sm:h-[76px] rounded-full bg-white border border-slate-900/10 flex flex-col items-center justify-center gap-1 will-change-transform"
                style={{
                  transform: "translate(-200px, -200px)",
                  boxShadow: `0 6px 18px -6px ${color}55, inset 0 0 12px ${color}12`,
                }}
              >
                <Icon className="text-lg sm:text-[22px]" style={{ color }} />
                <span className="font-mono text-[7px] sm:text-[8px] uppercase tracking-wide text-slate-600">
                  {name}
                </span>
              </div>
            ))}
          </div>
        )}
        {!reducedMotion && (
          // Soft floor the bubbles land on
          <div className="relative mx-auto h-3 rounded-full bg-gradient-to-b from-slate-300/80 to-slate-200/60 shadow-[0_6px_14px_-4px_rgba(15,23,42,0.18)]" />
        )}
      </div>
    </section>
  );
};

export default SkillsPlayground;
