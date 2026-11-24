import Link from "next/link";
import { Building2 } from "lucide-react";

export default function EmployerSignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600">
          <Building2 className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Organization registration</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Demo registration has been removed. The documented user registration API does not specify
          employer roles or organization fields, so organization signup will be enabled after that
          backend contract is confirmed.
        </p>
        <Link href="/login?role=employer" className="mt-6 inline-flex font-semibold text-primary-700 hover:underline">
          Return to employer sign in
        </Link>
      </section>
    </main>
  );
}
