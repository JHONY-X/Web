import Link from "next/link";

export default function CandidateRegistrationUnavailablePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Trainer account registration</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The local demo registration has been removed. This trainer invitation flow is not covered
          by the documented User API. Ask the training administrator for next steps.
        </p>
        <Link href="/" className="mt-6 inline-flex font-semibold text-primary-700 hover:underline">
          Return to Rohobot
        </Link>
      </section>
    </main>
  );
}
