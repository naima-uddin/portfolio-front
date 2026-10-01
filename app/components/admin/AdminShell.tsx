"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  FolderKanban,
  LogOut,
  Menu,
  Plus,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const navItems = [
  { href: "/admin", label: "Projects", icon: FolderKanban },
  { href: "/admin/projects/new", label: "New Project", icon: Plus },
  { href: "/admin/content", label: "Site Content", icon: SlidersHorizontal },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    // Project list + project edit pages, but not "new".
    return (
      pathname === "/admin" ||
      (pathname.startsWith("/admin/projects/") &&
        pathname !== "/admin/projects/new")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    router.push("/naimaslogin");
    router.refresh();
  };

  const current = navItems.find((item) => isActive(pathname, item.href));

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <Link href="/admin" className="flex items-center gap-3 px-6 h-16 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 p-1.5">
          <Image
            width={36}
            height={36}
            src="/assets/logo/Logo.svg"
            alt="Naima logo"
            className="w-full h-full object-contain brightness-0 invert"
          />
        </div>
        <div className="leading-tight">
          <p className="font-mono text-sm text-zinc-200">
            naima<span className="text-emerald-400">.dev</span>
          </p>
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
            Admin
          </p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
        <p className="px-3 mb-2 text-[11px] uppercase tracking-wider text-zinc-600">
          Manage
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-emerald-400/10 text-emerald-300"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink size={18} />
          View site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64 bg-[#0d0d14] border-r border-white/5">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-[#0d0d14] border-r border-white/5 animate-fade-in">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-3 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <X size={18} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 h-16 flex items-center gap-3 px-4 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded-lg text-zinc-300 hover:bg-white/5"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-medium text-zinc-200">
            {current?.label ?? "Dashboard"}
          </span>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
