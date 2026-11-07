import { Clock3 } from "lucide-react";
import { SignOutButton } from "@/components/layout/SignOutButton";

export default function EmployerPendingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700"><Clock3 className="h-8 w-8" /></div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">Payment awaiting admin review</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">Your payment proof and transaction ID have been submitted. Recruitment features remain locked until a Rohobot admin reviews the submission.</p>
        <p role="note" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Local demo only. No payment is processed or verified. After approval, sign out and sign in again to open the employer workspace.</p>
        <div className="mt-6 flex justify-center"><SignOutButton /></div>
      </section>
    </main>
  );
}
