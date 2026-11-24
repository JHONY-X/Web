"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { HeartPulse, ShieldCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { userService } from "@/lib/api/services/user";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[var(--color-background)]" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const [isSigningIn, setIsSigningIn] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [roleOverride, setRoleOverride] = useState<"candidate" | "employer" | null>(null);
  const requestedRole = searchParams.get("role");
  const selectedRole = roleOverride ?? (
    requestedRole === "employer" || requestedRole === "candidate" ? requestedRole : "candidate"
  );
  const verifiedNotice = searchParams.get("verified") === "1"
    ? "Your email is verified. Sign in with the email and password you registered with."
    : "";

  const handleAccountSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSigningIn(selectedRole);
    setErrorMessage("");

    try {
      await userService.login({ email_address: email, password }, selectedRole);
      window.location.assign(selectedRole === "employer" ? "/employer" : "/candidate");
    } catch (error) {
      console.error("Account sign-in failed.", error);
      setErrorMessage(error instanceof Error ? error.message : "Sign-in failed. Please try again.");
      setIsSigningIn(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-background)]">
      <div className="brand-ribbon h-1.5 w-full" aria-hidden="true" />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Rohobot home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-700 text-white">
              <HeartPulse className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-primary-900">Rohobot</span>
          </Link>
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-primary-800 to-primary-900 p-10 text-white md:flex">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium">
                <ShieldCheck className="h-4 w-4" />
                A trusted healthcare network
              </span>
              <h1 className="mt-8 text-3xl font-bold leading-tight">
                Where compassionate care meets opportunity.
              </h1>
              <p className="mt-4 leading-relaxed text-primary-100">
                Access healthcare careers, professional development, and employer connections.
              </p>
            </div>
            <p className="text-sm text-primary-100/80">Rohobot Home-Based Health Care Service PLC</p>
          </div>

          <div className="p-7 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-700">Welcome</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Sign in to Rohobot</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Candidates must register with a valid backend invitation. Organization registration is being connected separately.
            </p>

            <>
              <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="group" aria-label="Account type">
                {(["candidate", "employer"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    aria-pressed={selectedRole === role}
                    onClick={() => { setRoleOverride(role); setErrorMessage(""); }}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize ${selectedRole === role ? "bg-white text-primary-800 shadow-sm" : "text-slate-600"}`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <form onSubmit={handleAccountSignIn} className="mt-4 space-y-4">
                {verifiedNotice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{verifiedNotice}</p>}
                <label className="block text-sm font-medium text-slate-700">
                  Email address
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900"
                    placeholder={selectedRole === "candidate" ? "Email used during invitation registration" : "Authorized representative email"}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Password
                  <input
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900"
                    placeholder="Your password"
                  />
                </label>
                <Button type="submit" className="w-full" isLoading={isSigningIn === selectedRole}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Sign in as {selectedRole}
                </Button>
              </form>
              <Link href="/forgot-password" className="mt-3 inline-flex text-sm font-semibold text-primary-700 hover:underline">
                Forgot your password?
              </Link>
              {selectedRole === "employer" && (
                <p className="mt-4 text-sm text-slate-600">
                  New employer? <Link href="/employer/register" className="font-semibold text-primary-700 hover:underline">Register your organization</Link>
                </p>
              )}
              {selectedRole === "candidate" && (
                <p className="mt-4 text-sm text-slate-600">Need an account? Ask a Rohobot official for your candidate invitation link.</p>
              )}
              {errorMessage && (
                <p role="alert" className="mt-4 text-sm text-red-700">{errorMessage}</p>
              )}
            </>

            <Link href="/" className="mt-6 inline-flex text-sm font-semibold text-primary-700 hover:text-primary-900">
              Return to Rohobot home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
