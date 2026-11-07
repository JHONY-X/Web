"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SignOutButton } from "@/components/layout/SignOutButton";

const PACKAGES = [
  {
    name: "Basic",
    amount: 136_575,
    formattedAmount: "136,575 ETB",
    period: "/ year",
    capacity: "50 trainees",
    discount: "10% discount",
    perTrainee: "2,731.50 ETB / trainee",
    detail: "Ideal for community hospitals with up to 50 annual trainees",
  },
  {
    name: "Silver",
    amount: 386_962.5,
    formattedAmount: "386,962.50 ETB",
    period: "/ year",
    capacity: "150 trainees",
    discount: "15% discount",
    perTrainee: "2,579.75 ETB / trainee",
    detail: "For regional hospitals with mid-scale training pipelines",
    popular: true,
  },
  {
    name: "Gold",
    amount: 1_214_000,
    formattedAmount: "1,214,000 ETB",
    period: "/ year",
    capacity: "500 trainees",
    discount: "20% discount",
    perTrainee: "2,428.00 ETB / trainee",
    detail: "For referral and teaching hospitals with high volume recruitment",
  },
  {
    name: "Premium",
    amount: 2_276.25,
    formattedAmount: "2,276.25 ETB",
    period: "/ trainee",
    capacity: "Unlimited trainees",
    discount: "25% discount",
    perTrainee: "Custom / high volume deployment",
    detail: "Custom enterprise agreement with maximum 25% discount per trainee",
  },
] as const;

interface EmployerAccount {
  organizationName: string;
  status: string;
  packageName?: (typeof PACKAGES)[number]["name"];
  paymentStatus?: string;
  reviewNote?: string;
}

export default function EmployerPackagesPage() {
  const router = useRouter();
  const [account, setAccount] = useState<EmployerAccount | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<(typeof PACKAGES)[number]["name"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/demo/employer/activation", { cache: "no-store" })
      .then(async (response) => {
        const result = (await response.json()) as { account?: EmployerAccount; error?: string };
        if (!response.ok || !result.account) throw new Error(result.error ?? "Could not load employer account.");
        if (active) {
          setAccount(result.account);
          setSelectedPackage(result.account.packageName ?? null);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          console.error("Could not load employer package options.", error);
          setErrorMessage(error instanceof Error ? error.message : "Could not load employer account.");
        }
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const continueToPayment = async () => {
    if (!selectedPackage) {
      setErrorMessage("Choose a package to continue.");
      return;
    }
    setIsSelecting(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/demo/employer/activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageName: selectedPackage }),
      });
      const result = (await response.json()) as { success?: boolean; message?: string; error?: string };
      if (!response.ok || !result.success) throw new Error(result.message ?? result.error ?? "Could not select package.");
      router.push("/employer/payment");
    } catch (error) {
      console.error("Could not select employer package.", error);
      setErrorMessage(error instanceof Error ? error.message : "Could not select package.");
      setIsSelecting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700"><Building2 className="h-6 w-6" /></span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Hospital &amp; Healthcare Subscription</p>
            <h1 className="text-2xl font-bold text-slate-900">Choose Training &amp; Placement Package</h1>
            {account && <p className="text-sm text-slate-600">{account.organizationName}</p>}
          </div>
        </header>

        <div role="note" className="rounded-xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-950">
          <p className="font-semibold">Hospital Training &amp; Job Matching Programme Budget</p>
          <p className="mt-1 text-xs text-primary-800">
            Base hospital contribution: 3,035 ETB per trainee. Subsidized volume discounts apply according to your selected hospital package tier.
          </p>
        </div>
        {account?.paymentStatus === "Rejected" && (
          <p role="status" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Your previous payment proof was not approved{account.reviewNote ? `: ${account.reviewNote}` : "."} Select a package and submit new proof.
          </p>
        )}
        {errorMessage && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{errorMessage}</p>}

        {isLoading ? <p className="py-8 text-sm text-slate-600">Loading packages...</p> : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Available packages">
              {PACKAGES.map((item) => (
                <label
                  key={item.name}
                  className={`relative flex flex-col justify-between cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                    selectedPackage === item.name
                      ? "border-primary-600 ring-2 ring-primary-500 shadow-md"
                      : "border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="package"
                    value={item.name}
                    checked={selectedPackage === item.name}
                    onChange={() => setSelectedPackage(item.name)}
                    className="sr-only"
                  />
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-lg font-bold text-slate-900">{item.name}</span>
                      {selectedPackage === item.name && (
                        <CheckCircle2 className="h-5 w-5 text-primary-700" aria-label="Selected" />
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                        {item.discount}
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="text-xl font-extrabold text-primary-900 leading-tight">
                        {item.formattedAmount}
                      </p>
                      <p className="text-xs text-slate-500">{item.period}</p>
                    </div>

                    <div className="mt-3 border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
                      <p><span className="font-semibold text-slate-800">Capacity:</span> {item.capacity}</p>
                      <p><span className="font-semibold text-slate-800">Rate:</span> {item.perTrainee}</p>
                    </div>

                    <p className="mt-3 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2">{item.detail}</p>
                  </div>

                  <div className="mt-4 pt-2">
                    <span
                      className={`block text-center rounded-xl py-2 text-xs font-semibold ${
                        selectedPackage === item.name
                          ? "bg-primary-700 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {selectedPackage === item.name ? "Selected" : "Choose " + item.name}
                    </span>
                  </div>
                </label>
              ))}
            </section>
            <div className="pt-2">
              <Button type="button" className="w-full sm:w-auto" disabled={!selectedPackage || isSelecting} isLoading={isSelecting} onClick={continueToPayment}>
                Continue to payment
              </Button>
            </div>
          </>
        )}
        <div className="flex justify-end"><SignOutButton /></div>
      </div>
    </main>
  );
}
