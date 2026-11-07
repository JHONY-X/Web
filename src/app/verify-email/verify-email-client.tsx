"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeartPulse, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function VerifyEmailClient({
  role,
  email,
}: {
  role: "candidate" | "employer";
  email: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const requestOtp = async () => {
    setIsRequesting(true);
    setNotice("");
    setErrorMessage("");
    try {
      const response = await fetch("/api/demo/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", role, email }),
      });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Could not create an OTP.");
      setNotice(result.message ?? "OTP requested.");
    } catch (error) {
      console.error("Could not request verification OTP.", error);
      setErrorMessage(error instanceof Error ? error.message : "Could not create an OTP.");
    } finally {
      setIsRequesting(false);
    }
  };

  const verifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVerifying(true);
    setErrorMessage("");
    setNotice("");
    try {
      const response = await fetch("/api/demo/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", role, email, code }),
      });
      const result = (await response.json()) as { success?: boolean; message?: string; error?: string };
      if (!response.ok || !result.success) throw new Error(result.message ?? result.error ?? "OTP verification failed.");
      setIsVerified(true);
      setNotice(result.message ?? "Email verified.");
      router.replace(`/login?role=${role}&verified=1`);
    } catch (error) {
      console.error("Could not verify account email.", error);
      setErrorMessage(error instanceof Error ? error.message : "OTP verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-background)]">
      <div className="brand-ribbon h-1.5 w-full" aria-hidden="true" />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Rohobot home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-700 text-white"><HeartPulse className="h-5 w-5" /></span>
            <span className="text-lg font-bold text-primary-900">Rohobot</span>
          </Link>
        </div>
      </header>
      <section className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-lg sm:p-10">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700"><MailCheck className="h-6 w-6" /></div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">{role} email verification</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Verify your email address</h1>
          <p className="mt-3 text-sm text-slate-600">Email to verify: <strong>{email || "Not provided"}</strong></p>
          <div role="note" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            This local demo does not send email. Request a code, then ask the admin to share the simulated OTP from Admin → Workflow reviews.
          </div>
          {!isVerified ? (
            <>
              <Button type="button" className="mt-5 w-full" isLoading={isRequesting} disabled={isRequesting || !email} onClick={requestOtp}>
                Request verification code
              </Button>
              <form onSubmit={verifyOtp} className="mt-5 space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Six-digit OTP
                  <input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 tracking-[0.3em]" />
                </label>
                <Button type="submit" className="w-full" isLoading={isVerifying} disabled={isVerifying || code.length !== 6}>
                  Verify email
                </Button>
              </form>
            </>
          ) : (
            <Link href={`/login?role=${role}`} className="mt-5 inline-flex w-full">
              <Button className="w-full">Continue to sign in</Button>
            </Link>
          )}
          {notice && <p role="status" className="mt-4 text-sm text-primary-800">{notice}</p>}
          {errorMessage && <p role="alert" className="mt-4 text-sm text-red-700">{errorMessage}</p>}
          <p className="mt-6 text-xs text-slate-500">OTP expires after 10 minutes and is limited to five attempts.</p>
        </div>
      </section>
    </main>
  );
}
