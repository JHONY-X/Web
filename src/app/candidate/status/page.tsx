import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { SignOutButton } from "@/components/layout/SignOutButton";

export default function CandidatePendingStatusPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <ClipboardCheck className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">Account pending admin approval</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Your email has been verified. A Rohobot admin must approve your candidate account before you can access recruitment features.
        </p>
        <p role="note" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          This is a local demo. After admin approval, sign out and sign in again to test the candidate workspace.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <SignOutButton />
          <Link href="/" className="text-sm font-semibold text-primary-700 hover:underline">Home</Link>
        </div>
      </section>
    </main>
  );
}
