"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { userService } from "@/lib/api/services/user";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [emailAddress, setEmailAddress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);
    try {
      await userService.requestPasswordReset(emailAddress);
      setMessage("If the account is eligible, the backend will send password reset instructions.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not request a password reset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
        <p className="mt-2 text-sm text-slate-600">Enter your account email to request reset instructions.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Email address
            <input
              type="email"
              maxLength={50}
              required
              autoComplete="email"
              value={emailAddress}
              onChange={(event) => setEmailAddress(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          {message && <p role="status" className="text-sm text-emerald-800">{message}</p>}
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={isSubmitting}>
            Send reset instructions
          </Button>
        </form>
        <Link href="/login" className="mt-5 inline-flex text-sm font-semibold text-primary-700 hover:underline">
          Return to sign in
        </Link>
      </section>
    </main>
  );
}
