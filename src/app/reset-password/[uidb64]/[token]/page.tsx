"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { userService } from "@/lib/api/services/user";

type LinkState = "checking" | "valid" | "invalid";

export default function ResetPasswordPage() {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const [linkState, setLinkState] = useState<LinkState>("checking");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    userService.confirmPasswordResetLink(uidb64, token)
      .then(() => {
        if (active) setLinkState("valid");
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : "This reset link is invalid or expired.");
        setLinkState("invalid");
      });
    return () => {
      active = false;
    };
  }, [uidb64, token]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (password !== passwordAgain) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.resetPassword({
        password_1: password,
        password_2: passwordAgain,
        uidb64,
        token,
      });
      setMessage("Your password has been reset. You can now sign in.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not reset your password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Choose a new password</h1>
        {linkState === "checking" ? (
          <p role="status" className="mt-4 text-sm text-slate-600">Checking reset link...</p>
        ) : linkState === "invalid" ? (
          <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>
        ) : message ? (
          <p role="status" className="mt-4 text-sm text-emerald-800">{message}</p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              New password
              <input required type="password" minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Confirm new password
              <input required type="password" minLength={8} autoComplete="new-password" value={passwordAgain} onChange={(event) => setPasswordAgain(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" />
            </label>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={isSubmitting}>
              Update password
            </Button>
          </form>
        )}
        {message && (
          <Link href="/login" className="mt-5 inline-flex text-sm font-semibold text-primary-700 hover:underline">
            Go to sign in
          </Link>
        )}
      </section>
    </main>
  );
}
