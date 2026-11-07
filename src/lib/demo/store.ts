import { randomUUID } from "node:crypto";

export type DemoRole = "candidate" | "employer" | "admin";
export type AccountStatus =
  | "Awaiting email verification"
  | "Awaiting training completion"
  | "Registration link sent"
  | "Pending admin approval"
  | "Pending payment"
  | "Payment submitted"
  | "Approved"
  | "Rejected";
export type EmployerPaymentStatus = "Pending" | "Approved" | "Rejected";

export interface DemoCandidateAccount {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender?: "Male" | "Female";
  criminalClearance?: string;
  policeClearanceFileName?: string;
  policeClearanceDataUrl?: string;
  email: string;
  phone: string;
  passwordSalt?: string;
  passwordHash?: string;
  invitationId?: string;
  emailVerified: boolean;
  status: AccountStatus;
  createdAt: string;
}

export interface DemoEmployerAccount {
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
  passwordSalt: string;
  passwordHash: string;
  emailVerified: boolean;
  status: AccountStatus;
  createdAt: string;
  selectedPackage?: "Basic" | "Silver" | "Gold" | "Premium";
  payment?: {
    method: string;
    transactionId: string;
    proofFileName: string;
    proofDataUrl: string;
    submittedAt: string;
    status: EmployerPaymentStatus;
    reviewNote?: string;
  };
}

export interface DemoInvitation {
  id: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
  revokedAt?: string;
  candidateId?: string;
}

export interface DemoOtp {
  id: string;
  role: "candidate" | "employer";
  accountId: string;
  email: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  consumedAt?: string;
  attempts: number;
}

export interface DemoSession {
  id: string;
  role: "candidate" | "employer";
  accountId: string;
}

export interface DemoStore {
  invitations: Map<string, DemoInvitation>;
  candidates: Map<string, DemoCandidateAccount>;
  employers: Map<string, DemoEmployerAccount>;
  otps: Map<string, DemoOtp>;
  sessions: Map<string, DemoSession>;
}

const globalDemoStore = globalThis as typeof globalThis & {
  rohobotDemoWorkflowStore?: DemoStore;
};

export const demoStore =
  globalDemoStore.rohobotDemoWorkflowStore ??
  (globalDemoStore.rohobotDemoWorkflowStore = {
    invitations: new Map(),
    candidates: new Map(),
    employers: new Map(),
    otps: new Map(),
    sessions: new Map(),
  });

export function newDemoId(): string {
  return randomUUID();
}

export function normalizeDemoEmail(email: string): string {
  return email.trim().toLowerCase();
}
