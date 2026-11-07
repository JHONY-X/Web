"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, GraduationCap, Link2, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";

interface ReviewQueue {
  otps: {
    id: string;
    role: "candidate" | "employer";
    email: string;
    code: string;
    createdAt: string;
    expiresAt: string;
  }[];
  trainingCandidates: {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    status: string;
  }[];
  candidates: {
    id: string;
    name: string;
    email: string;
    phone: string;
    criminalClearance?: string;
    policeClearanceFileName?: string;
    policeClearanceDataUrl?: string;
    createdAt: string;
    status: string;
  }[];
  employers: {
    id: string;
    organizationName: string;
    organizationType: string;
    city: string;
    subcity: string;
    hrEmail: string;
    organizationPhone: string;
    representativeEmail: string;
    representativePhone: string;
    businessLicenseFileName: string;
    businessLicenseDataUrl: string;
    createdAt: string;
  }[];
  payments: {
    employerId: string;
    organizationName: string;
    packageName: string;
    amount: number;
    method: string;
    transactionId: string;
    proofFileName: string;
    proofDataUrl: string;
    submittedAt: string;
  }[];
}

async function errorFromResponse(response: Response, fallback: string): Promise<string> {
  const result = (await response.json()) as { error?: string };
  return result.error ?? fallback;
}

export default function AdminWorkflowReviewsPage() {
  const [queue, setQueue] = useState<ReviewQueue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [isReviewing, setIsReviewing] = useState<string | null>(null);

  const loadQueue = useCallback(async () => {
    const response = await fetch("/api/demo/reviews", { cache: "no-store" });
    if (!response.ok) throw new Error(await errorFromResponse(response, "Could not load workflow reviews."));
    setQueue((await response.json()) as ReviewQueue);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/demo/reviews", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(await errorFromResponse(response, "Could not load workflow reviews."));
        return (await response.json()) as ReviewQueue;
      })
      .then((result) => { if (active) setQueue(result); })
      .catch((error: unknown) => {
        if (active) {
          console.error("Could not load admin workflow reviews.", error);
          setErrorMessage(error instanceof Error ? error.message : "Could not load workflow reviews.");
        }
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const completeTraining = async (candidateId: string) => {
    setIsReviewing(candidateId);
    setErrorMessage("");
    setNotice("");
    try {
      const response = await fetch("/api/demo/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete-training", id: candidateId }),
      });
      const result = (await response.json()) as { success?: boolean; message?: string; error?: string; registrationUrl?: string };
      if (!response.ok || !result.success) {
        throw new Error(result.error ?? result.message ?? "Could not complete training.");
      }
      await loadQueue();
      setNotice(
        result.registrationUrl
          ? `Training completed! Registration link generated: ${result.registrationUrl}`
          : "Training completed and registration link sent to candidate!"
      );
    } catch (error) {
      console.error("Could not complete candidate training.", error);
      setErrorMessage(error instanceof Error ? error.message : "Could not complete candidate training.");
    } finally {
      setIsReviewing(null);
    }
  };

  const review = async (action: "candidate" | "payment", id: string, approved: boolean) => {
    setIsReviewing(id);
    setErrorMessage("");
    setNotice("");
    try {
      const response = await fetch("/api/demo/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id, approved }),
      });
      if (!response.ok) throw new Error(await errorFromResponse(response, "Could not complete review."));
      await loadQueue();
      setNotice(approved ? "Review approved." : "Review rejected.");
    } catch (error) {
      console.error("Could not complete admin review.", error);
      setErrorMessage(error instanceof Error ? error.message : "Could not complete review.");
    } finally {
      setIsReviewing(null);
    }
  };

  const copyOtp = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setNotice("Simulated OTP copied. In the demo, share it with the account holder manually.");
    } catch (error) {
      console.error("Could not copy demo OTP.", error);
      setErrorMessage("Could not copy OTP automatically. Select and copy the displayed code.");
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Admin tools</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Workflow reviews</h1>
          <p className="mt-2 text-sm text-slate-600">View demo OTPs, approve candidate accounts, and review employer payment submissions.</p>
        </header>

        <div role="note" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Local demo only. OTP codes and proof files are visible here for testing and held in server memory. This is not a real email, payment, document-security, or approval service.
        </div>
        {errorMessage && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{errorMessage}</p>}
        {notice && <p role="status" className="rounded-xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-800">{notice}</p>}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 font-semibold text-slate-900"><ShieldCheck className="h-5 w-5 text-primary-700" /> Simulated OTP inbox</h2>
              <p className="mt-1 text-sm text-slate-500">Share the six-digit test code with the user outside the app.</p>
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => {
              setIsLoading(true);
              loadQueue().catch((error: unknown) => {
                console.error("Could not refresh review queue.", error);
                setErrorMessage(error instanceof Error ? error.message : "Could not refresh.");
              }).finally(() => setIsLoading(false));
            }}><RefreshCw className="h-4 w-4" /> Refresh</Button>
          </div>
          {isLoading ? <p className="py-6 text-sm text-slate-500">Loading...</p> : queue?.otps.length ? (
            <ul className="divide-y divide-slate-100">
              {queue.otps.map((otp) => (
                <li key={otp.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="font-medium capitalize text-slate-900">{otp.role} verification</p><p className="text-sm text-slate-600">{otp.email}</p><p className="text-xs text-slate-500">Expires {new Date(otp.expiresAt).toLocaleString()}</p></div>
                  <div className="flex items-center gap-3"><code className="rounded-lg bg-slate-100 px-3 py-2 font-mono text-lg font-bold tracking-widest">{otp.code}</code><Button type="button" variant="outline" size="sm" onClick={() => copyOtp(otp.code)}>Copy</Button></div>
                </li>
              ))}
            </ul>
          ) : <p className="py-6 text-sm text-slate-500">No active OTP requests.</p>}
        </section>

        <section className="rounded-2xl border border-primary-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-2 flex items-center gap-2 font-bold text-slate-900">
            <GraduationCap className="h-5 w-5 text-primary-700" />
            Candidates In Training (Awaiting Training Completion)
          </h2>
          <p className="mb-4 text-xs text-slate-500">
            These candidates have completed email verification via OTP and are currently undergoing training. Once training finishes, click &quot;Complete Training &amp; Send Link&quot; to automatically generate their registration link.
          </p>
          {queue?.trainingCandidates?.length ? (
            queue.trainingCandidates.map((candidate) => (
              <div key={candidate.id} className="flex flex-col gap-4 border-t border-slate-100 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{candidate.name}</p>
                  <p className="text-sm text-slate-600">{candidate.email} · {candidate.phone}</p>
                  <p className="text-xs text-amber-700 font-medium">Status: In Training · Registered {new Date(candidate.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    className="gap-1.5"
                    disabled={isReviewing !== null}
                    isLoading={isReviewing === candidate.id}
                    onClick={() => completeTraining(candidate.id)}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Complete Training &amp; Send Link
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="py-6 text-sm text-slate-500">No candidates currently awaiting training completion.</p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900"><ClipboardList className="h-5 w-5 text-primary-700" /> Candidate accounts awaiting approval</h2>
          {queue?.candidates.length ? queue.candidates.map((candidate) => (
            <div key={candidate.id} className="flex flex-col gap-4 border-t border-slate-100 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{candidate.name}</p>
                <p className="text-sm text-slate-600">{candidate.email} · {candidate.phone}</p>
                <p className="text-xs text-slate-500">Status: {candidate.status} · Registered {new Date(candidate.createdAt).toLocaleString()}</p>
                {candidate.criminalClearance && (
                  <p className="mt-1 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Police Clearance (Stamped):</span> {candidate.criminalClearance}
                  </p>
                )}
                {candidate.policeClearanceDataUrl && (
                  <a
                    href={candidate.policeClearanceDataUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-xs font-semibold text-primary-700 hover:underline"
                  >
                    View Official Stamped Certificate ({candidate.policeClearanceFileName ?? "document"})
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" className="gap-1" disabled={isReviewing !== null} isLoading={isReviewing === candidate.id} onClick={() => review("candidate", candidate.id, true)}><CheckCircle2 className="h-4 w-4" /> Approve</Button>
                <Button type="button" size="sm" variant="outline" className="gap-1 text-red-700" disabled={isReviewing !== null} onClick={() => review("candidate", candidate.id, false)}><XCircle className="h-4 w-4" /> Reject</Button>
              </div>
            </div>
          )) : <p className="py-6 text-sm text-slate-500">No verified candidate accounts are waiting for approval.</p>}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-4 font-semibold text-slate-900">Verified employer registrations</h2>
          {queue?.employers.length ? queue.employers.map((employer) => (
            <div key={employer.id} className="flex flex-col gap-3 border-t border-slate-100 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-semibold text-slate-900">{employer.organizationName}</p><p className="text-sm text-slate-600">{employer.organizationType} · {employer.city}, {employer.subcity}</p><p className="text-xs text-slate-500">Representative: {employer.representativeEmail} · HR: {employer.hrEmail}</p></div>
              {employer.businessLicenseDataUrl ? <a href={employer.businessLicenseDataUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary-700 hover:underline">Review {employer.businessLicenseFileName}</a> : <span className="text-xs text-slate-500">No license available</span>}
            </div>
          )) : <p className="py-6 text-sm text-slate-500">No verified employer registrations.</p>}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-4 font-semibold text-slate-900">Employer payment proof awaiting review</h2>
          {queue?.payments.length ? queue.payments.map((payment) => (
            <div key={payment.employerId} className="space-y-4 border-t border-slate-100 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div><p className="font-semibold text-slate-900">{payment.organizationName} · {payment.packageName}</p><p className="text-sm text-slate-600">{payment.amount.toLocaleString()} ETB via {payment.method}</p><p className="text-sm text-slate-600">Transaction: {payment.transactionId}</p><p className="text-xs text-slate-500">Submitted {new Date(payment.submittedAt).toLocaleString()}</p></div>
                <div className="flex gap-2">
                  <Button type="button" size="sm" className="gap-1" disabled={isReviewing !== null} isLoading={isReviewing === payment.employerId} onClick={() => review("payment", payment.employerId, true)}><CheckCircle2 className="h-4 w-4" /> Approve</Button>
                  <Button type="button" size="sm" variant="outline" className="gap-1 text-red-700" disabled={isReviewing !== null} onClick={() => review("payment", payment.employerId, false)}><XCircle className="h-4 w-4" /> Reject</Button>
                </div>
              </div>
              {payment.proofDataUrl && <a href={payment.proofDataUrl} target="_blank" rel="noreferrer" className="inline-flex text-sm font-semibold text-primary-700 hover:underline">View receipt image: {payment.proofFileName}</a>}
            </div>
          )) : <p className="py-6 text-sm text-slate-500">No employer payment proofs are waiting for review.</p>}
        </section>
      </div>
    </DashboardLayout>
  );
}
