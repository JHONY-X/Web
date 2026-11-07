import { timestampAgo } from "@/lib/date";

export interface SearchAuditLog {
  id: string;
  employerName: string;
  searchQuery: string;
  filtersUsed: string[];
  timestamp: string;
  resultsCount: number;
}

const DB_AUDIT_LOGS: SearchAuditLog[] = [
  { id: "LOG-001", employerName: "St. Gabriel Hospital", searchQuery: "ICU Nurse", filtersUsed: ["Addis Ababa", "Min 5 yrs"], timestamp: timestampAgo(0, "10:23 AM"), resultsCount: 12 },
  { id: "LOG-002", employerName: "Rohobot Home Care", searchQuery: "Midwife", filtersUsed: ["Immediate Availability"], timestamp: timestampAgo(0, "09:15 AM"), resultsCount: 5 },
  { id: "LOG-003", employerName: "Bethel Clinic", searchQuery: "Lab Tech", filtersUsed: ["Hawassa"], timestamp: timestampAgo(1, "04:45 PM"), resultsCount: 3 },
];

export const auditService = {
  // In production, the backend logs this automatically during the search API call.
  // We will simulate fetching the logs for the Admin.
  getSearchAudits: async (): Promise<SearchAuditLog[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [...DB_AUDIT_LOGS];
  },

  // This function would be called by your API route when an employer searches
  logSearch: async (log: Omit<SearchAuditLog, "id" | "timestamp">) => {
    console.log("Audit Logged:", log);
  }
};