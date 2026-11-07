"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { HeartPulse, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface InvitationInspection {
  valid: boolean;
  message: string;
  candidate?: {
    firstName: string;
    middleName: string;
    lastName: string;
    gender?: "Male" | "Female";
    email: string;
    phone: string;
  };
}

const MAX_FILE_BYTES = 2 * 1024 * 1024;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => (typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read file.")));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export default function CandidateInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [invitation, setInvitation] = useState<InvitationInspection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "">("");
  const [criminalClearance, setCriminalClearance] = useState("");
  const [clearanceFile, setClearanceFile] = useState<File | null>(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/demo/invitation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ action: "inspect", token }),
    })
      .then(async (response) => {
        const result = (await response.json()) as InvitationInspection;
        if (!response.ok) throw new Error("Could not check this invitation.");
        return result;
      })
      .then((result) => {
        if (active) {
          setInvitation(result);
          if (result.candidate) {
            setFirstName(result.candidate.firstName);
            setMiddleName(result.candidate.middleName);
            setLastName(result.candidate.lastName);
            if (result.candidate.gender) {
              setGender(result.candidate.gender);
            }
            setEmail(result.candidate.email);
            setPhone(result.candidate.phone);
          }
        }
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error("Could not inspect candidate invitation.", error);
        setInvitation({ valid: false, message: "Could not check this invitation. Try again later." });
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    if (!gender) {
      setErrorMessage("Please select your gender (Male or Female).");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    if (!criminalClearance.trim()) {
      setErrorMessage("Please enter your police clearance certificate details.");
      return;
    }

    if (clearanceFile && (clearanceFile.size > MAX_FILE_BYTES || !["application/pdf", "image/png", "image/jpeg", "image/webp"].includes(clearanceFile.type))) {
      setErrorMessage("Upload an official stamped certificate file (PNG, JPG, or PDF) up to 2 MB.");
      return;
    }

    setIsSubmitting(true);
    try {
      let policeClearanceDataUrl: string | undefined = undefined;
      let policeClearanceFileName: string | undefined = undefined;
      if (clearanceFile) {
        policeClearanceDataUrl = await readFileAsDataUrl(clearanceFile);
        policeClearanceFileName = clearanceFile.name;
      }

      const response = await fetch("/api/demo/invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          token,
          registration: {
            gender,
            criminalClearance,
            policeClearanceFileName,
            policeClearanceDataUrl,
            password,
          },
        }),
      });
      const result = (await response.json()) as { success?: boolean; message?: string; error?: string };
      if (!response.ok || !result.success) {
        throw new Error(result.message ?? result.error ?? "Registration failed. Request a new invitation.");
      }

      router.replace(`/login?role=candidate&verified=1`);
    } catch (error) {
      console.error("Candidate registration failed.", error);
      setErrorMessage(error instanceof Error ? error.message : "Registration failed. Try again.");
      setIsSubmitting(false);
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
            <span className="text-lg font-bold text-primary-900">Rohobot</span>
          </Link>
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-7 shadow-lg sm:p-10">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Official candidate invitation</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Create your candidate account</h1>

          {isLoading ? (
            <p role="status" className="mt-6 text-sm text-slate-600">Checking your invitation...</p>
          ) : !invitation?.valid ? (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p role="alert" className="text-sm text-amber-900">{invitation?.message}</p>
              <Link href="/login" className="mt-4 inline-flex text-sm font-semibold text-primary-700 hover:underline">
                Go to candidate sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <p role="status" className="rounded-xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-900">
                Training completed! Please review your details, provide your police criminal clearance, and create your password to activate your account.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="text-sm font-medium text-slate-700">
                  First name
                  <input readOnly disabled maxLength={80} autoComplete="given-name" value={firstName} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-slate-700 cursor-not-allowed" />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Middle name
                  <input readOnly disabled maxLength={80} autoComplete="additional-name" value={middleName} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-slate-700 cursor-not-allowed" />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Last name
                  <input readOnly disabled maxLength={80} autoComplete="family-name" value={lastName} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-slate-700 cursor-not-allowed" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Email address
                  <input readOnly disabled type="email" maxLength={254} autoComplete="email" value={email} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-slate-700 cursor-not-allowed" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Phone number
                  <input readOnly disabled type="tel" maxLength={30} autoComplete="tel" value={phone} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-slate-700 cursor-not-allowed" />
                </label>
              </div>
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-slate-700">Gender <span className="text-red-500">*</span></legend>
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={gender === "Male"}
                      onChange={() => setGender("Male")}
                      required
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={gender === "Female"}
                      onChange={() => setGender("Female")}
                      required
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    Female
                  </label>
                </div>
              </fieldset>
              <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800">
                    Police Clearance Certificate (No Criminal History with Official Stamp) <span className="text-red-500">*</span>
                  </label>
                  <p className="mt-1 text-xs text-slate-500">
                    Candidate must provide proof of no criminal history issued by the police station bearing an official government stamp.
                  </p>
                </div>

                <label className="block text-sm font-medium text-slate-700">
                  Certificate number &amp; Issuing police station <span className="text-red-500">*</span>
                  <input
                    required
                    maxLength={200}
                    placeholder="e.g. Cert # POL-98214 - Bole Police Station, Addis Ababa (Stamped)"
                    value={criminalClearance}
                    onChange={(event) => setCriminalClearance(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Attach official stamped certificate document (PDF, PNG, JPG)
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,application/pdf"
                    onChange={(event) => setClearanceFile(event.target.files?.[0] ?? null)}
                    className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white p-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
                  />
                  <span className="mt-1 block text-xs text-slate-500">
                    Must clearly display the official police station stamp and signature. Maximum 2 MB.
                  </span>
                </label>
              </div>
              <label className="block text-sm font-medium text-slate-700">
                Create password
                <input required type="password" minLength={12} maxLength={128} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Confirm password
                <input required type="password" minLength={12} maxLength={128} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" />
              </label>
              <div role="note" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                Local demo only. Registration is simulated; do not enter real sensitive credentials.
              </div>
              {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
              <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={isSubmitting}>
                Complete registration and sign in
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
