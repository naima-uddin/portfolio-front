"use client";

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import {
  ArrowDownRight,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { siteConfig, type SiteConfig } from "@/lib/data";

interface Status {
  submitting: boolean;
  info: { error: boolean; msg: string | null };
}

const inputClasses =
  "w-full bg-slate-900/5 border border-slate-900/10 rounded-xl px-4 py-3 text-zinc-800 placeholder-slate-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15 transition-all duration-300";

// Rotating circular text badge (weblance-style accent)
const CIRCLE_TEXT = "LET'S WORK TOGETHER • LET'S WORK TOGETHER • ";

// Weblance-style contact block: pitch content + gradient-border form.
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
  const nameRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>({
    submitting: false,
    info: { error: false, msg: null },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    // Combine first + last name into the single "name" field the
    // EmailJS template expects.
    const data = new FormData(formRef.current);
    if (nameRef.current) {
      nameRef.current.value = `${data.get("fname") ?? ""} ${
        data.get("lname") ?? ""
      }`.trim();
    }

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

  return (
    <section
      id="contact"
      className={`relative overflow-hidden ${
        standalone
          ? "pt-32 pb-16"
          : "bg-[#eceef2] py-14 lg:py-16"
      }`}
    >
      {standalone && (
        <>
          <div className="absolute inset-0 bg-grid" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] glow-emerald" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#eceef2]" />
        </>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Left: pitch content (weblance-style) */}
          <div
            className="animate-slide-in-left"
            style={{ animationDelay: "150ms" }}
          >
            <p className="font-mono text-sm font-semibold text-brand-600 mb-4">
              Contact Me Today!
            </p>
            <Heading className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 tracking-tight leading-[1.08]">
              Let&apos;s work together create something{" "}
              <span className="text-gradient">amazing</span>
            </Heading>
            <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
              Whether you have a project in mind or just want to connect, feel
              free to reach out and let&apos;s start the conversation.
            </p>

            {/* Rotating circular badge */}
            <div className="relative w-36 h-36 mt-10 hidden sm:block">
              <div className="absolute inset-0 animate-spin-slow">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <path
                      id="circlePath"
                      d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                    />
                  </defs>
                  <text className="fill-zinc-500 text-[8.2px] font-mono tracking-[0.18em]">
                    <textPath href="#circlePath">{CIRCLE_TEXT}</textPath>
                  </text>
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
                  <ArrowDownRight size={22} />
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div className="mt-10 space-y-3">
              {[
                {
                  icon: <Mail size={17} />,
                  value: config.email,
                  href: `mailto:${config.email}`,
                },
                {
                  icon: <Phone size={17} />,
                  value: config.phoneDisplay,
                  href: `tel:${config.phone}`,
                },
                {
                  icon: <MapPin size={17} />,
                  value: config.location,
                },
              ].map((item) =>
                item.href ? (
                  <a
                    key={item.value}
                    href={item.href}
                    className="flex items-center gap-3 text-sm text-slate-600 hover:text-brand-600 transition-colors w-fit"
                  >
                    <span className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </span>
                    {item.value}
                  </a>
                ) : (
                  <p
                    key={item.value}
                    className="flex items-center gap-3 text-sm text-slate-600"
                  >
                    <span className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </span>
                    {item.value}
                  </p>
                )
              )}
            </div>

            {/* Socials + availability */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <div className="flex gap-2">
                <a
                  href={config.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-10 h-10 rounded-xl bg-slate-900/5 text-slate-700 flex items-center justify-center hover:bg-brand-700/10 hover:text-brand-600 transition-all"
                >
                  <Github size={17} />
                </a>
                <a
                  href={config.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-xl bg-slate-900/5 text-slate-700 flex items-center justify-center hover:bg-brand-700/10 hover:text-brand-600 transition-all"
                >
                  <Linkedin size={17} />
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-600 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-600" />
                </span>
                <p className="text-sm text-slate-600">{config.availability}</p>
              </div>
            </div>
          </div>

          {/* Right: gradient-border form card */}
          <div
            className="animate-slide-in-right"
            style={{ animationDelay: "300ms" }}
          >
            <div className="gradient-border gradient-border-always surface rounded-3xl p-8 sm:p-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                Get in Touch
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Fill out the form below to connect with me. I&apos;ll get back
                to you soon to discuss your project or answer any questions.
              </p>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* Combined full name for the EmailJS template */}
                <input type="hidden" name="name" ref={nameRef} />

                <div className="grid sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="fname"
                    aria-label="First name"
                    placeholder="First Name*"
                    className={inputClasses}
                    required
                  />
                  <input
                    type="text"
                    name="lname"
                    aria-label="Last name"
                    placeholder="Last Name*"
                    className={inputClasses}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <input
                    type="tel"
                    name="phone"
                    aria-label="Phone number"
                    placeholder="Phone Number"
                    className={inputClasses}
                  />
                  <input
                    type="email"
                    name="email"
                    aria-label="Email address"
                    placeholder="Email Address*"
                    className={inputClasses}
                    required
                  />
                </div>

                <textarea
                  name="message"
                  rows={5}
                  aria-label="Message"
                  placeholder="Any Message..."
                  className={`${inputClasses} resize-none`}
                  required
                />

                <button
                  type="submit"
                  disabled={status.submitting}
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-all duration-300 hover:shadow-lg shadow-brand-600/25 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status.submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Submit Message
                      <Send
                        size={17}
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                      />
                    </>
                  )}
                </button>

                {status.info.msg && (
                  <p
                    role="status"
                    className={`text-sm ${
                      status.info.error ? "text-red-400" : "text-brand-600"
                    }`}
                  >
                    {status.info.msg}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
