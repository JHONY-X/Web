import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CandidateRegistrationCompletePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-700">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">Registration complete</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Your candidate demo account is ready. Sign in with the invited email address and the password you just created.
          After signing in, continue completing your professional profile.
        </p>
        <p role="note" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          This local demo account is temporary and will be removed when the development server restarts.
        </p>
        <Link href="/login" className="mt-6 inline-flex">
          <Button>Go to candidate sign in</Button>
        </Link>
      </div>
    </main>
  );
}
