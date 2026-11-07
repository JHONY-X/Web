"use client";

import Link from "next/link";
import { useState } from "react";
import { HeartPulse, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/candidate/career", label: "Career development" },
  { href: "/login?role=candidate", label: "For professionals" },
  { href: "/employer/register", label: "For employers" },
];

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="brand-ribbon text-white">
        <div className="mx-auto flex min-h-11 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Rohobot home" className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/95 text-primary-700">
              <HeartPulse className="h-4 w-4" />
            </span>
            <span className="truncate text-xs font-bold tracking-wide sm:text-sm">
              ROHOBOT <span className="font-medium text-white/85">· Home-Based Healthcare &amp; Job Creation</span>
            </span>
          </Link>
          <Link href="/login?role=employer" className="hidden shrink-0 rounded-full border border-white/40 px-3 py-1 text-xs font-semibold transition-colors hover:bg-white/15 sm:inline-flex">
            Employer portal
          </Link>
        </div>
      </div>

      <nav aria-label="Main navigation" className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[62px] items-center justify-between gap-4">
            <Link href="/" className="flex shrink-0 items-center gap-2 text-sm font-bold text-primary-900 md:hidden" aria-label="Rohobot home">
              <HeartPulse className="h-5 w-5 text-primary-700" />
              Rohobot
            </Link>

            <div className="hidden items-center gap-7 md:flex">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="border-b-2 border-transparent py-5 text-sm font-medium text-slate-600 transition-colors hover:border-accent-600 hover:text-primary-800">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link href="/employer/register"><Button size="sm">Register organization</Button></Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Link href="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-primary-50"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="space-y-1 border-t border-slate-100 py-3 md:hidden">
              {links.map((link) => (
                <Link key={link.href} onClick={() => setIsOpen(false)} href={link.href} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-primary-50">
                  {link.label}
                </Link>
              ))}
              <Link onClick={() => setIsOpen(false)} href="/login?role=employer" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-primary-800 hover:bg-primary-50">
                Employer portal
              </Link>
              <Link onClick={() => setIsOpen(false)} href="/employer/register" className="block px-3 pt-2">
                <Button className="w-full">Register organization</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
