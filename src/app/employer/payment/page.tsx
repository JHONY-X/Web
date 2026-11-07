"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SignOutButton } from "@/components/layout/SignOutButton";

const PACKAGE_AMOUNTS = {
  Basic: 136_575,
  Silver: 386_962.5,
  Gold: 1_214_000,
  Premium: 2_276.25,
} as const;
const PAYMENT_METHODS = [
  "Telebirr",
  "M-Pesa",
  "Commercial Bank of Ethiopia (CBE)",
  "Dashen Bank",
  "Other Ethiopian bank",
] as const;
const MAX_FILE_BYTES = 2 * 1024 * 1024;

interface EmployerPaymentAccount {
  organizationName: string;
  packageName?: keyof typeof PACKAGE_AMOUNTS;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read receipt image."));
    reader.onerror = () => reject(new Error("Could not read receipt image."));
    reader.readAsDataURL(file);
  });
}

export default function EmployerPaymentPage() {
  const router = useRouter();
  const [account, setAccount] = useState<EmployerPaymentAccount | null>(null);
  const [method, setMethod] = useState<(typeof PAYMENT_METHODS)[number]>(PAYMENT_METHODS[0]);
  const [transactionId, setTransactionId] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/demo/employer/activation", { cache: "no-store" })
      .then(async (response) => {
        const result = (await response.json()) as { account?: EmployerPaymentAccount; error?: string };
        if (!response.ok || !result.account) throw new Error(result.error ?? "Could not load employer account.");
        if (active) {
          if (!result.account.packageName) {
            router.replace("/employer/packages");
            return;
          }
          setAccount(result.account);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          console.error("Could not load employer payment details.", error);
          setErrorMessage(error instanceof Error ? error.message : "Could not load employer account.");
        }
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [router]);

  const submitPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!account?.packageName || !proofFile) {
      setErrorMessage("Attach the payment screenshot to continue.");
      return;
    }
    if (proofFile.size > MAX_FILE_BYTES || !["image/png", "image/jpeg", "image/webp"].includes(proofFile.type)) {
      setErrorMessage("Upload a PNG, JPG, or WebP screenshot up to 2 MB.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const proofDataUrl = await readFileAsDataUrl(proofFile);
      const response = await fetch("/api/demo/employer/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: account.packageName,
          method,
          transactionId,
          proofFileName: proofFile.name,
          proofDataUrl,
        }),
      });
      const result = (await response.json()) as { success?: boolean; message?: string; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error ?? result.message ?? "Could not submit payment.");
      router.push("/employer/pending");
    } catch (error) {
      console.error("Could not submit employer payment proof.", error);
      setErrorMessage(error instanceof Error ? error.message : "Could not submit payment.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Employer subscription</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Submit payment</h1>
          {account && <p className="mt-2 text-sm text-slate-600">{account.organizationName}</p>}
        </header>
        <div role="note" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Demo only: no money is collected or verified. Upload a test screenshot only; payment proof is kept temporarily in server memory for admin review.
        </div>
        {isLoading ? <p className="py-6 text-sm text-slate-600">Loading payment details...</p> : account?.packageName && (
          <form onSubmit={submitPayment} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <section className="rounded-xl bg-primary-50 p-4">
              <p className="text-sm text-primary-800">Selected package</p>
              <p className="mt-1 text-xl font-bold text-primary-950">
                {account.packageName} Package · {PACKAGE_AMOUNTS[account.packageName].toLocaleString()} ETB
                {account.packageName === "Premium" ? " / trainee (custom deployment)" : " / year"}
              </p>
              <Link href="/employer/packages" className="mt-2 inline-flex text-sm font-semibold text-primary-800 hover:underline">Change package</Link>
            </section>
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 font-semibold text-slate-900"><CreditCard className="h-5 w-5 text-primary-700" /> Choose a payment method</h2>
              <label className="block text-sm font-medium text-slate-700">
                Payment method
                <select required value={method} onChange={(event) => setMethod(event.target.value as (typeof PAYMENT_METHODS)[number])} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5">
                  {PAYMENT_METHODS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Transaction ID
                <input required maxLength={120} value={transactionId} onChange={(event) => setTransactionId(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" />
              </label>
            </section>
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 font-semibold text-slate-900"><ReceiptText className="h-5 w-5 text-primary-700" /> Payment screenshot</h2>
              <label className="block text-sm font-medium text-slate-700">
                Receipt image
                <input required type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setProofFile(event.target.files?.[0] ?? null)} className="mt-1.5 block w-full rounded-xl border border-slate-300 p-2" />
                <span className="mt-1 block text-xs text-slate-500">PNG, JPG, or WebP up to 2 MB.</span>
              </label>
            </section>
            {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
            <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={isSubmitting}>Submit payment for admin approval</Button>
          </form>
        )}
        <div className="flex items-center justify-between">
          <Link href="/employer/packages" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:underline"><ArrowLeft className="h-4 w-4" /> Packages</Link>
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
