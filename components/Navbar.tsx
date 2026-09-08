"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "./Icons";
import { NotificationCenter } from "./NotificationCenter";

const links = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/intake", label: "Intake Wizard", icon: "⚡" },
  { href: "/orders", label: "CPOE Orders", icon: "🚀" },
  { href: "/dashboard", label: "Triage Queue", icon: "🔴" },
  { href: "/records", label: "Patient Vault", icon: "📂" },
  { href: "/care-team", label: "Care Team", icon: "🩺" },
  { href: "/doctors", label: "Clinicians", icon: "👩‍⚕️" },
  { href: "/appointments", label: "Appointments", icon: "📅" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      const isDark =
        localStorage.getItem("clinix-theme") === "dark" ||
        (!("clinix-theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {
      console.error("Theme toggle error", e);
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("clinix-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("clinix-theme", "light");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl transition-colors">
      {/* Top Accent Gradient Border */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-teal-400" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 font-black text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/20 group-hover:scale-105 transition-all">
            <span className="text-base tracking-tighter">Cx</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Clinix<span className="text-blue-600 dark:text-blue-400">OS</span>
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
              Clinical Workstation
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Pills */}
        <nav className="hidden items-center gap-1 lg:flex bg-slate-100/70 dark:bg-slate-900/70 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-800/60">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
                }`}
              >
                <span className="text-xs">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Controls */}
        <div className="flex items-center gap-2">
          {/* Notification Center */}
          <NotificationCenter />

          {/* Dark / Light Mode Switcher */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex h-9 items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-200/80 dark:hover:bg-slate-800 transition cursor-pointer"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span>{darkMode ? "☀️" : "🌙"}</span>
            <span className="hidden sm:inline text-[11px] uppercase tracking-wider">{darkMode ? "Light" : "Dark"}</span>
          </button>

          {/* Intake SOAP Primary CTA */}
          <Link
            href="/intake"
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>⚡</span> Clinical Intake
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-900"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {open && (
        <nav className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 lg:hidden animate-fadein">
          <div className="grid grid-cols-2 gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition ${
                  pathname === link.href
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <Link
            href="/intake"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-center text-xs font-bold text-white shadow-md"
          >
            ⚡ Start Clinical Intake Wizard
          </Link>
        </nav>
      )}
    </header>
  );
}
