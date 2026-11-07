"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  FileText,
  Calendar,
  Settings,
  Search,
  Bookmark,
  ShieldCheck,
  CreditCard,
  History,
  AlertTriangle,
  Briefcase,
  TrendingUp,
  GraduationCap,
  MessageSquareText,
  Building2,
  UserPlus,
} from "lucide-react";
import { NotificationCenter } from "./NotificationCenter";
import { SignOutButton } from "./SignOutButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "candidate" | "employer" | "admin";
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = {
    candidate: [
      { name: "Overview", href: "/candidate", icon: LayoutDashboard },
      { name: "My Profile", href: "/candidate/profile", icon: User },
      { name: "Interviews", href: "/candidate/interviews", icon: Calendar },
      { name: "My Placements", href: "/candidate/placements", icon: Briefcase },
      { name: "Career Development", href: "/candidate/career", icon: GraduationCap },
    ],
    employer: [
      { name: "Overview", href: "/employer", icon: LayoutDashboard },
      { name: "Search Talent", href: "/employer/search", icon: Search },
      { name: "Saved Talent", href: "/employer/saved", icon: Bookmark },
      { name: "Organization", href: "/employer/profile", icon: Building2 },
      { name: "Placements", href: "/employer/placements", icon: Briefcase },
      { name: "Interviews", href: "/employer/interviews", icon: Calendar },
      { name: "Subscription", href: "/employer/subscription", icon: FileText },
    ],
    admin: [
      { name: "Overview", href: "/admin", icon: LayoutDashboard },
      { name: "Candidate Invitations", href: "/admin/invitations", icon: UserPlus },
      { name: "Workflow Reviews", href: "/admin/reviews", icon: ShieldCheck },
      { name: "Verifications", href: "/admin/verifications", icon: ShieldCheck },
      { name: "Decline Monitoring", href: "/admin/decline-monitoring", icon: AlertTriangle },
      { name: "Confidential Feedback", href: "/admin/feedback", icon: MessageSquareText },
      { name: "Finance & Payments", href: "/admin/finance", icon: CreditCard },
      { name: "Placement Funnel", href: "/admin/placements", icon: TrendingUp },
      { name: "Training Impact", href: "/admin/training", icon: GraduationCap },
      { name: "Audit Logs", href: "/admin/audit", icon: History },
    ],
  };

  const currentNav = navItems[role] || [];
  const roleTitle = {
    candidate: "Professional",
    employer: "Employer",
    admin: "Rohobot Admin",
  }[role];
  const roleInitials = {
    candidate: "HP",
    employer: "HR",
    admin: "RA",
  }[role];

  return (
    <div className="relative min-h-screen flex bg-[var(--color-background)]">
      <div className="brand-ribbon fixed inset-x-0 top-0 z-30 h-1" aria-hidden="true" />
      {/* Desktop Sidebar */}
      <aside className="fixed z-20 hidden h-full w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link
            href="/"
            className="text-xl font-bold text-primary-700 flex items-center gap-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-600 text-sm font-bold text-white shadow-sm">
              RH
            </span>
            Rohobot
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {roleTitle} portal
          </div>
          {currentNav.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-primary-600" : "text-slate-400"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Topbar */}
        <header className="sticky top-1 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMobileMenuOpen}
              className="rounded-md p-2 text-slate-600 hover:bg-primary-50 hover:text-primary-800"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Replaced static bell with the functional NotificationCenter */}
            <NotificationCenter role={role} />
            
            <div
              aria-label={`${roleTitle} account`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-200 bg-primary-100 text-xs font-bold text-primary-800"
            >
              {roleInitials}
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav aria-label={`${roleTitle} navigation`} className="border-b border-slate-200 bg-white p-4 md:hidden">
            {currentNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  pathname === item.href
                    ? "bg-primary-50 text-primary-800"
                    : "text-slate-600 hover:bg-primary-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}