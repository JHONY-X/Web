import { daysAgo } from "@/lib/date";
import { notificationService } from "./notification";
export type VerificationStatus = "Pending" | "Approved" | "Rejected";
export type EntityType = "Candidate" | "Employer";

export interface AdminVerificationItem {
  id: string;
  name: string;
  type: EntityType;
  roleOrCategory: string;
  submittedDate: string;
  status: VerificationStatus;
}

export interface Transaction {
  id: string;
  referenceNumber: string;
  employerName: string;
  packageTier: "Basic" | "Silver" | "Gold";
  amount: number;
  date: string;
  status: "Successful" | "Pending" | "Failed" | "Refunded";
}

export interface AuditLog {
  id: string;
  employerName: string;
  searchQuery: string;
  filtersUsed: string;
  timestamp: string;
  resultsCount: number;
}

// --- IN-MEMORY DATABASE ---
let DB_VERIFICATIONS: AdminVerificationItem[] = [
  { id: "V-001", name: "Abebe Kebede", type: "Candidate", roleOrCategory: "Registered Nurse", submittedDate: "2023-11-01", status: "Pending" },
  { id: "V-002", name: "St. Gabriel Hospital", type: "Employer", roleOrCategory: "Hospital", submittedDate: "2023-11-02", status: "Pending" },
  { id: "V-003", name: "Sara Mohammed", type: "Candidate", roleOrCategory: "Midwife", submittedDate: "2023-10-28", status: "Approved" },
];

let DB_TRANSACTIONS: Transaction[] = [
  { id: "1", referenceNumber: "TXN-90812", employerName: "St. Gabriel Hospital", packageTier: "Gold", amount: 3000, date: "2023-11-01", status: "Successful" },
  { id: "2", referenceNumber: "TXN-90813", employerName: "Rohobot Home Care", packageTier: "Silver", amount: 1500, date: "2023-11-02", status: "Pending" },
  { id: "3", referenceNumber: "TXN-90814", employerName: "Bethel Clinic", packageTier: "Basic", amount: 500, date: "2023-10-28", status: "Failed" },
];

const DB_AUDIT_LOGS: AuditLog[] = [
  { id: "LOG-001", employerName: "St. Gabriel Hospital", searchQuery: "ICU Nurse", filtersUsed: "Addis Ababa, 5+ yrs", timestamp: "2023-11-04 10:23 AM", resultsCount: 12 },
  { id: "LOG-002", employerName: "Rohobot Home Care", searchQuery: "Midwife", filtersUsed: "Immediate Availability", timestamp: "2023-11-04 09:15 AM", resultsCount: 5 },
];

export const adminService = {
  // 1. VERIFICATIONS
  getVerifications: async (): Promise<AdminVerificationItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...DB_VERIFICATIONS];
  },
updateVerificationStatus: async (id: string, status: "Approved" | "Rejected"): Promise<{ success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const entity = DB_VERIFICATIONS.find(v => v.id === id);
  DB_VERIFICATIONS = DB_VERIFICATIONS.map(item => item.id === id ? { ...item, status } : item);

  // 🔥 TRIGGER NOTIFICATION
  if (entity) {
    const targetRole = entity.type === "Candidate" ? "candidate" : "employer";
    notificationService.pushNotification(
      status === "Approved" ? "Profile Verified!" : "Verification Rejected",
      status === "Approved" 
        ? `Your profile has been successfully verified. You are now visible to ${targetRole === "candidate" ? "employers" : "candidates"}.` 
        : `Your profile verification was rejected. Please check your documents.`,
      status === "Approved" ? "success" : "error",
      targetRole
    );
  }
  return { success: true };
},

  // 2. TRANSACTIONS
  getTransactions: async (): Promise<Transaction[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...DB_TRANSACTIONS];
  },
  refundTransaction: async (id: string): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    DB_TRANSACTIONS = DB_TRANSACTIONS.map(txn => txn.id === id ? { ...txn, status: "Refunded" } : txn);
    return { success: true };
  },
  // Exceptional activation: Manually verify a pending payment
  approvePendingPayment: async (id: string): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    DB_TRANSACTIONS = DB_TRANSACTIONS.map(txn => txn.id === id ? { ...txn, status: "Successful" } : txn);
    return { success: true };
  },

  // 3. AUDIT LOGS
  getAuditLogs: async (): Promise<AuditLog[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...DB_AUDIT_LOGS];
  }
};