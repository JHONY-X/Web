"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Building2, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/Button";

const ORGANIZATION_TYPES = ["Hospital", "Clinic", "Home-Based Care", "Other"] as const;
const MAX_FILE_BYTES = 2 * 1024 * 1024;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read the business license file."));
    };
    reader.onerror = () => reject(new Error("Could not read the business license file."));
    reader.readAsDataURL(file);
  });
}

export default function EmployerRegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [city, setCity] = useState("");
  const [subcity, setSubcity] = useState("");
  const [hrEmail, setHrEmail] = useState("");
  const [organizationPhone, setOrganizationPhone] = useState("");
  const [representativeEmail, setRepresentativeEmail] = useState("");
  const [representativePhone, setRepresentativePhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    if (password !== confirmPassword) {
      setErrorMessage("The passwords do not match.");
      return;
    }
    if (!licenseFile || licenseFile.size > MAX_FILE_BYTES) {
      setErrorMessage("Attach the organization business license (maximum 2 MB).");
      return;
    }
    setIsSubmitting(true);

    try {
      const businessLicenseDataUrl = await readFileAsDataUrl(licenseFile);
      const response = await fetch("/api/demo/employers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName,
          organizationType,
          city,
          subcity,
          hrEmail,
          organizationPhone,
          representativeEmail,
          representativePhone,
          password,
          businessLicenseFileName: licenseFile.name,
          businessLicenseDataUrl,
        }),
      });
      const result = (await response.json()) as { success?: boolean; message?: string; error?: string };
      if (!response.ok || !result.success) {
        throw new Error(result.message ?? result.error ?? "Could not register the organization.");
      }

      window.location.assign(
        `/verify-email?role=employer&email=${encodeURIComponent(representativeEmail.trim().toLowerCase())}`
      );
    } catch (error) {
      console.error("Employer demo registration failed.", error);
      setErrorMessage(error instanceof Error ? error.message : "Could not register the organization.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="brand-ribbon h-1.5 w-full" aria-hidden="true" />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-700 text-white"><HeartPulse className="h-5 w-5" /></span>
            <span className="text-lg font-bold text-primary-900">Rohobot</span>
          </Link>
          <Link href="/login" className="ml-auto text-sm font-semibold text-primary-700 hover:underline">Sign in</Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700"><Building2 className="h-6 w-6" /></div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Register your organization</h1>
          <p className="mt-2 text-sm text-slate-600">Create an employer account, verify the authorized representative&apos;s email, then choose a package and submit payment proof.</p>
        </div>

        <div role="note" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Local demo only. Business-license files are held temporarily in server memory; do not upload real licenses or sensitive documents. The OTP is simulated and must be obtained from the admin demo inbox.
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-3 font-semibold text-slate-900">Organization details</h2>
            <label className="block text-sm font-medium text-slate-700">
              Organization name
              <input required maxLength={160} value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" autoComplete="organization" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Organization type
                <select required value={organizationType} onChange={(event) => setOrganizationType(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5">
                  <option value="">Select type</option>
                  {ORGANIZATION_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                City
                <input required maxLength={100} value={city} onChange={(event) => setCity(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" autoComplete="address-level2" />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700">
              Subcity
              <input required maxLength={100} value={subcity} onChange={(event) => setSubcity(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" />
            </label>
          </section>

          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-3 font-semibold text-slate-900">Contact details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                HR email
                <input required type="email" maxLength={254} value={hrEmail} onChange={(event) => setHrEmail(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" autoComplete="email" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Organization phone
                <input required type="tel" maxLength={30} value={organizationPhone} onChange={(event) => setOrganizationPhone(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" autoComplete="tel" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Authorized representative email (OTP recipient)
                <input required type="email" maxLength={254} value={representativeEmail} onChange={(event) => setRepresentativeEmail(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Representative phone
                <input required type="tel" maxLength={30} value={representativePhone} onChange={(event) => setRepresentativePhone(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" />
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-3 font-semibold text-slate-900">Business license and sign-in</h2>
            <label className="block text-sm font-medium text-slate-700">
              Business license
              <input required type="file" accept=".pdf,image/png,image/jpeg,image/webp" onChange={(event) => setLicenseFile(event.target.files?.[0] ?? null)} className="mt-1.5 block w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
              <span className="mt-1 block text-xs text-slate-500">PDF, PNG, JPG, or WebP, up to 2 MB.</span>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Password
                <input required type="password" minLength={12} maxLength={128} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Confirm password
                <input required type="password" minLength={12} maxLength={128} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" />
              </label>
            </div>
          </section>

          {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
          <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={isSubmitting}>
            Register and verify authorized representative
          </Button>
        </form>
      </section>
    </main>
  );
}
