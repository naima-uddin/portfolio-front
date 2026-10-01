"use client";

import { useEffect, useRef, useState } from "react";
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
} from "react-icons/si";

interface Tech {
  name: string;
  Icon: IconType;
  color: string;
}

const TECHS: Tech[] = [
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#FFFFFF" },
  { name: "Redux", Icon: SiRedux, color: "#764ABC" },
  { name: "Tailwind", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Framer", Icon: SiFramer, color: "#0055FF" },
  { name: "Three.js", Icon: SiThreedotjs, color: "#FFFFFF" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#339933" },
  { name: "Express", Icon: SiExpress, color: "#FFFFFF" },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
  { name: "Firebase", Icon: SiFirebase, color: "#FFCA28" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "GitHub", Icon: SiGithub, color: "#FFFFFF" },
  { name: "Postman", Icon: SiPostman, color: "#FF6C37" },
  { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
];

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
const SkillsPlayground = () => {
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

    let width = container.clientWidth;
    let height = container.clientHeight;
    const radius = width < 640 ? 34 : 44;

    // Scatter chips along the top so they rain down
    bodies.current = TECHS.map((_, i) => ({
      x: radius + Math.random() * (width - radius * 2),
      y: -radius - Math.random() * height * 0.8 - i * 10,
      vx: (Math.random() - 0.5) * 2,
      vy: 0,
      dragging: false,
    }));

    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
    };
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
  }, [started, reducedMotion]);

  return (
    <section className="relative bg-[#0a0a0f] py-28 border-t border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-[0.25em]">
            Tech Stack
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            My <span className="text-shimmer">Skills</span>
          </h2>
          {!reducedMotion && (
            <p className="mt-4 text-sm text-zinc-500 font-mono">
              ✦ grab a bubble and throw it around
            </p>
          )}
        </div>

        {reducedMotion ? (
          // Static fallback when the user prefers reduced motion
          <div className="flex flex-wrap justify-center gap-4">
            {TECHS.map(({ name, Icon, color }) => (
              <div
                key={name}
                className="flex items-center gap-2.5 px-5 py-3 rounded-full glass"
              >
                <Icon size={20} style={{ color }} />
                <span className="font-mono text-xs uppercase tracking-wide text-zinc-300">
                  {name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={containerRef}
            className="relative h-[280px] sm:h-[320px] overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing"
          >
            {TECHS.map(({ name, Icon, color }, i) => (
              <div
                key={name}
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                className="absolute top-0 left-0 w-[68px] h-[68px] sm:w-[88px] sm:h-[88px] rounded-full glass flex flex-col items-center justify-center gap-1 will-change-transform"
                style={{
                  transform: "translate(-200px, -200px)",
                  boxShadow: `0 0 24px ${color}22, inset 0 0 12px ${color}11`,
                }}
              >
                <Icon className="text-xl sm:text-[26px]" style={{ color }} />
                <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wide text-zinc-400">
                  {name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsPlayground;
