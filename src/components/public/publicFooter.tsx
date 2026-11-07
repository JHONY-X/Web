import Link from "next/link";
import { HeartPulse } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold text-primary-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary-700"><HeartPulse className="h-5 w-5" /></span>
              Rohobot
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
              Home-based healthcare and professional connections, designed for care teams and healthcare professionals in Ethiopia.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">Explore</h2>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
              <li><Link href="/#how-it-works" className="hover:text-accent-700">How it works</Link></li>
              <li><Link href="/candidate/career" className="hover:text-accent-700">Career development</Link></li>
              <li><Link href="/employer/register" className="hover:text-accent-700">For employers</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">Account &amp; support</h2>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
              <li><Link href="/login" className="hover:text-accent-700">Sign in</Link></li>
              <li><Link href="/privacy" className="hover:text-accent-700">Privacy &amp; data protection</Link></li>
              <li><Link href="/employer/register" className="hover:text-accent-700">Register an organization</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Rohobot Home-Based Health Care Service PLC. All rights reserved.</p>
          <p>Addis Ababa, Ethiopia</p>
        </div>
      </div>
    </footer>
  );
}
