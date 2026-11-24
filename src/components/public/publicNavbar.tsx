"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/#about", label: "About Rohobot" },
  { href: "/#how-it-works", label: "Our services" },
  { href: "/candidate/career", label: "Career development" },
  { href: "/login?role=candidate", label: "For professionals" },
  { href: "/employer/register", label: "For employers" },
];

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="brand-ribbon text-white">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Rohobot home" className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-11 w-12 shrink-0 items-center justify-center rounded-lg bg-white p-0.5">
              <Image src="/rohobot-logo.png" alt="" width={546} height={457} className="h-full w-full object-contain" priority />
            </span>
            <span className="hidden truncate text-sm font-bold tracking-wide sm:inline">
              ROHOBOT HEALTHCARE CENTER
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-white/60 bg-white/10 text-white hover:bg-white hover:text-primary-800">
                Sign in
              </Button>
            </Link>
            <Link href="/employer/register">
              <Button size="sm" className="bg-white text-primary-800 hover:bg-primary-50">
                <span className="sm:hidden">Register</span>
                <span className="hidden sm:inline">Register organization</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <nav aria-label="Main navigation" className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-12 max-w-7xl items-center justify-end px-4 sm:px-6 lg:px-8">
          <div className="hidden items-center gap-7 md:flex">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b-2 border-transparent py-3 text-sm font-medium text-slate-600 transition-colors hover:border-accent-600 hover:text-primary-800"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <span className="mr-1 text-xs font-semibold text-primary-800">Explore</span>
            <button
              type="button"
              onClick={() => setIsOpen(open => !open)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-primary-50"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="space-y-1 border-t border-slate-100 px-4 py-3 md:hidden">
            {links.map(link => (
              <Link
                key={link.href}
                onClick={() => setIsOpen(false)}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-primary-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
