import { VerifyEmailClient } from "./verify-email-client";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; email?: string }>;
}) {
  const { role, email } = await searchParams;
  const accountRole = role === "employer" ? "employer" : "candidate";
  return <VerifyEmailClient role={accountRole} email={email ?? ""} />;
}
