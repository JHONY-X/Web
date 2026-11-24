export interface CandidateInvitationRequest {
  full_name: string;
  email_address: string;
}

export const invitationService = {
  createCandidateInvitation: async (invitation: CandidateInvitationRequest): Promise<void> => {
    const response = await fetch("/api/invitations/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invitation),
      cache: "no-store",
    });

    if (response.ok) return;

    const result = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(result?.error ?? "The invitation request failed.");
  },
};
