import { VerifyEmailClient } from "./verify-email-client";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; email?: string; phone?: string }>;
}) {
  const { role, email, phone } = await searchParams;
  const accountRole = role === "employer" ? "employer" : "candidate";
  return <VerifyEmailClient role={accountRole} email={email ?? ""} phone={phone ?? ""} />;
}
