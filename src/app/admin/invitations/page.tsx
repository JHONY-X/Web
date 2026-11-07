"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Copy, Link2, MailPlus, RefreshCw, ShieldCheck, UserRound, XCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import type { DemoInvitationSummary } from "@/lib/demo/invitations";

interface InvitationListResponse {
  invitations: DemoInvitationSummary[];
}

interface InvitationCreateResponse {
  invitation: DemoInvitationSummary;
  registrationUrl: string;
}

async function getErrorMessage(response: Response, fallback: string): Promise<string> {
  const result = (await response.json()) as { error?: string };
  return result.error ?? fallback;
}

export default function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState<DemoInvitationSummary[]>([]);
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isPreRegistering, setIsPreRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");

  // Pre-register form fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "">("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const refreshInvitations = useCallback(async () => {
    const response = await fetch("/api/demo/invitations", { cache: "no-store" });
    if (!response.ok) throw new Error(await getErrorMessage(response, "Could not load invitations."));
    const result = (await response.json()) as InvitationListResponse;
    setInvitations(result.invitations);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/demo/invitations", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(await getErrorMessage(response, "Could not load invitations."));
        return (await response.json()) as InvitationListResponse;
      })
      .then((result) => {
        if (active) setInvitations(result.invitations);
      })
      .catch((error: unknown) => {
        if (active) {
          console.error("Failed to load invitations.", error);
          setErrorMessage(error instanceof Error ? error.message : "Could not load invitations.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handlePreRegisterCandidate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setNotice("");

    if (!gender) {
      setErrorMessage("Please select the candidate's gender (Male or Female).");
      return;
    }

    setIsPreRegistering(true);

    try {
      const response = await fetch("/api/demo/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "pre-register-candidate",
          firstName,
          middleName,
          lastName,
          gender,
          email,
          phone,
        }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Could not register candidate."));
      }

      setNotice(`Candidate ${firstName} ${middleName} ${lastName} registered! A verification OTP has been generated. View it in the Admin Reviews / OTP Inbox.`);
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setGender("");
      setEmail("");
      setPhone("");
      await refreshInvitations();
    } catch (error) {
      console.error("Failed to pre-register candidate.", error);
      setErrorMessage(error instanceof Error ? error.message : "Could not register candidate.");
    } finally {
      setIsPreRegistering(false);
    }
  };

  const handleCreateInvitation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreating(true);
    setErrorMessage("");
    setNotice("");
    setRegistrationUrl("");

    try {
      const response = await fetch("/api/demo/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error(await getErrorMessage(response, "Could not create invitation."));

      const result = (await response.json()) as InvitationCreateResponse;
      setRegistrationUrl(result.registrationUrl);
      setNotice("Invitation created. Copy the link and send it to the candidate using your chosen channel.");
      await refreshInvitations();
    } catch (error) {
      console.error("Failed to create invitation.", error);
      setErrorMessage(error instanceof Error ? error.message : "Could not create invitation.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(registrationUrl);
      setNotice("Registration link copied. Share it directly with the invited candidate.");
    } catch (error) {
      console.error("Could not copy invitation link.", error);
      setErrorMessage("Could not copy automatically. Select and copy the link from the field.");
    }
  };

  const handleRevoke = async (id: string) => {
    setErrorMessage("");
    setNotice("");
    try {
      const response = await fetch("/api/demo/invitations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error(await getErrorMessage(response, "Could not revoke invitation."));
      await refreshInvitations();
      setNotice("Invitation revoked.");
    } catch (error) {
      console.error("Failed to revoke invitation.", error);
      setErrorMessage(error instanceof Error ? error.message : "Could not revoke invitation.");
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Admin tools</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Candidate invitations</h1>
          <p className="mt-2 text-sm text-slate-600">
            Create a private registration link for a candidate. Send the link yourself through Telegram,
            SMS, or another approved channel.
          </p>
        </header>

        <div role="note" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Local demo only. Invitation and account records are held in server memory and reset when the
          development server restarts. Links are single-use and expire after 72 hours; delivery and
          contact verification are not connected.
        </div>

        <section className="rounded-2xl border border-primary-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pre-register New Candidate</h2>
              <p className="text-sm text-slate-500">Collect candidate names, email, and phone. Candidates verify their email with an OTP before starting training.</p>
            </div>
          </div>

          <form onSubmit={handlePreRegisterCandidate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-sm font-medium text-slate-700">
                First name
                <input required maxLength={80} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Middle name
                <input required maxLength={80} value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Middle Name" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Last name
                <input required maxLength={80} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-sm font-medium text-slate-700">
                Email address
                <input required type="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="candidate@example.com" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Phone number
                <input required type="tel" maxLength={30} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+251..." className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <div>
                <span className="block text-sm font-medium text-slate-700">Gender <span className="text-red-500">*</span></span>
                <div className="mt-2.5 flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      required
                      name="adminCandidateGender"
                      value="Male"
                      checked={gender === "Male"}
                      onChange={() => setGender("Male")}
                      className="h-4 w-4 text-primary-600"
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      required
                      name="adminCandidateGender"
                      value="Female"
                      checked={gender === "Female"}
                      onChange={() => setGender("Female")}
                      className="h-4 w-4 text-primary-600"
                    />
                    Female
                  </label>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Button type="submit" isLoading={isPreRegistering} disabled={isPreRegistering} className="gap-2">
                <UserRound className="h-4 w-4" /> Register candidate and issue OTP
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <MailPlus className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">Direct Invitation Link (Alternative)</h2>
              <p className="text-sm text-slate-500">Generate a generic registration link if needed.</p>
            </div>
          </div>

          <form onSubmit={handleCreateInvitation}>
            <div className="sm:col-span-2">
              <Button type="submit" isLoading={isCreating} disabled={isCreating} className="gap-2">
                <Link2 className="h-4 w-4" /> Generate invitation token
              </Button>
            </div>
          </form>

          {registrationUrl && (
            <div className="mt-5 rounded-xl border border-primary-200 bg-primary-50 p-4">
              <label htmlFor="candidate-invitation-link" className="text-sm font-semibold text-primary-900">
                Private candidate registration link
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  id="candidate-invitation-link"
                  readOnly
                  value={registrationUrl}
                  className="min-w-0 flex-1 rounded-lg border border-primary-200 bg-white px-3 py-2 text-sm text-slate-800"
                />
                <Button type="button" variant="outline" className="gap-2" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" /> Copy link
                </Button>
              </div>
            </div>
          )}

          {errorMessage && <p role="alert" className="mt-4 text-sm text-red-700">{errorMessage}</p>}
          {notice && <p role="status" className="mt-4 text-sm text-primary-800">{notice}</p>}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-slate-900">Invitation history</h2>
              <p className="text-sm text-slate-500">Only pending invitations can be revoked.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                setIsLoading(true);
                refreshInvitations()
                  .catch((error: unknown) => {
                    console.error("Failed to refresh invitations.", error);
                    setErrorMessage(error instanceof Error ? error.message : "Could not refresh invitations.");
                  })
                  .finally(() => setIsLoading(false));
              }}
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>

          {isLoading ? (
            <p className="py-8 text-center text-sm text-slate-500">Loading invitations…</p>
          ) : invitations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center">
              <UserRound className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm text-slate-600">No invitations yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {invitations.map((invitation) => (
                <li key={invitation.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">Candidate invitation</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Link2 className="h-3 w-3" />
                      Expires {new Date(invitation.expiresAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      invitation.status === "Pending"
                        ? "bg-amber-100 text-amber-800"
                        : invitation.status === "Used"
                          ? "bg-primary-100 text-primary-800"
                          : "bg-slate-100 text-slate-600"
                    }`}>
                      {invitation.status}
                    </span>
                    {invitation.status === "Pending" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-red-700 hover:bg-red-50"
                        onClick={() => handleRevoke(invitation.id)}
                      >
                        <XCircle className="h-4 w-4" /> Revoke
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="flex items-start gap-2 text-xs text-slate-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          For production, invitations must be persisted in an approved database, delivered by an approved
          messaging provider, and paired with verified candidate contact details and real authentication.
        </p>
      </div>
    </DashboardLayout>
  );
}
