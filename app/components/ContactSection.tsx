"use client";

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { ArrowRight, Github, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig, type SiteConfig } from "@/lib/data";

interface Status {
  submitting: boolean;
  info: { error: boolean; msg: string | null };
}

const fieldClasses =
  "w-full border-0 border-b-[1.5px] border-zinc-900/15 bg-transparent px-0 py-3 text-[15px] text-zinc-900 placeholder-slate-400 outline-none transition-colors duration-300 focus:border-brand-600";

// Pixel mark in the card corner: 16 cells, colored by index pattern.
const MARK_CELLS = Array.from({ length: 16 }, (_, i) => {
  const n = i + 1;
  if (n % 7 === 0) return "bg-zinc-200";
  if (n % 5 === 0) return "bg-brand-700";
  if (n % 3 === 0) return "bg-brand-500";
  return "bg-brand-200";
});

// Contact block: tilted business card with contact details + minimal form.
// `standalone` renders page-hero spacing (used on /contact); without it
// the block behaves like a regular home-page section.
const ContactSection = ({
  standalone = false,
  config = siteConfig,
}: {
  standalone?: boolean;
  config?: SiteConfig;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>({
    submitting: false,
    info: { error: false, msg: null },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus({ submitting: true, info: { error: false, msg: null } });

    emailjs
      .sendForm(
        "service_u3tca8w",
        "template_1d7txxm",
        formRef.current,
        "eduU2wX5PVs31rFZY"
      )
      .then(() => {
        formRef.current?.reset();
        setStatus({
          submitting: false,
          info: { error: false, msg: "Message sent! I'll get back to you soon." },
        });
        setTimeout(
          () =>
            setStatus({
              submitting: false,
              info: { error: false, msg: null },
            }),
          6000
        );
      })
      .catch(() => {
        setStatus({
          submitting: false,
          info: {
            error: true,
            msg: "Something went wrong. Please try again or email me directly.",
          },
        });
      });
  };

  const Heading = standalone ? "h1" : "h2";
  const githubPath = config.github.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  const details = [
    { icon: <Mail size={13} />, value: config.email, href: `mailto:${config.email}` },
    { icon: <Phone size={13} />, value: config.phoneDisplay, href: `tel:${config.phone}` },
    { icon: <MapPin size={13} />, value: config.location },
    { icon: <Github size={13} />, value: githubPath, href: config.github, external: true },
  ];

  return (
    <section
      id="contact"
      className={`scroll-mt-16 relative overflow-hidden bg-[#eceef2] ${
        standalone ? "pt-28 pb-12 lg:pt-32" : "py-10 lg:py-14"
      }`}
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-12">
        {/* Left: business card */}
        <div className="animate-slide-in-left flex justify-center" style={{ animationDelay: "100ms" }}>
          <div className="relative flex aspect-[1.75/1] w-full max-w-[500px] -rotate-2 lg:-rotate-4 flex-col justify-between overflow-hidden rounded-[18px] border border-zinc-900/10 bg-white p-5 sm:p-7 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.45),0_2px_0_rgba(15,23,42,0.04)] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] hover:rotate-0 hover:scale-[1.02]">
            {/* Pixel mark */}
            <div
              aria-hidden="true"
              className="absolute right-5 top-5 sm:right-7 sm:top-7 grid h-10 w-10 grid-cols-4 gap-0.5"
            >
              {MARK_CELLS.map((color, i) => (
                <span key={i} className={`rounded-[2px] ${color}`} />
              ))}
            </div>

            <div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                {config.name}
              </p>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500">{config.role}</p>
            </div>

            <ul className="grid gap-1 font-mono text-[11px] sm:text-xs text-slate-700">
              {details.map((d) => (
                <li key={d.value} className="flex min-w-0 items-center gap-2.5">
                  <span className="text-slate-400">{d.icon}</span>
                  {d.href ? (
                    <a
                      href={d.href}
                      {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="truncate transition-colors hover:text-brand-600"
                    >
                      {d.value}
                    </a>
                  ) : (
                    <span className="truncate">{d.value}</span>
                  )}
                </li>
              ))}
            </ul>

            {/* Green stripe along the bottom edge */}
            <span className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-brand-700 via-brand-400 to-brand-200" />
          </div>
        </div>

        {/* Right: minimal form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="animate-slide-in-right"
          style={{ animationDelay: "200ms" }}
        >
          <Heading
            className={
              standalone
                ? "mb-5 text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] text-zinc-900"
                : "mb-5 text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900"
            }
          >
            Got an idea? <span className="text-brand-600">Let&apos;s talk.</span>
          </Heading>

          <div className="grid gap-x-5 sm:grid-cols-2">
            <input
              type="text"
              name="name"
              aria-label="Your name"
              placeholder="Your name"
              className={fieldClasses}
              required
            />
            <input
              type="email"
              name="email"
              aria-label="Email address"
              placeholder="Email address"
              className={fieldClasses}
              required
            />
          </div>
          <textarea
            name="message"
            rows={2}
            aria-label="Message"
            placeholder="What's your project about?"
            className={`${fieldClasses} resize-none`}
            required
          />

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status.submitting}
              className="group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status.submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send message
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
            {status.info.msg && (
              <p
                role="status"
                className={`text-sm ${status.info.error ? "text-red-500" : "text-brand-600"}`}
              >
                {status.info.msg}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
