export interface FlaggedCandidate {
  id: string;
  name: string;
  role: string;
  declineCount: number;
  lastDeclineDate: string;
  declineHistory: { employer: string; reason: string; date: string }[];
  flagStatus: "None" | "Flagged" | "Cleared" | "Investigated";
  adminNotes?: string;
}

const DECLINE_THRESHOLD = 3;

// Mock Database
let DB_FLAGGED: FlaggedCandidate[] = [
  {
    id: "C-102",
    name: "Elena Tesfaye",
    role: "Physician",
    declineCount: 4, // Exceeds threshold
    lastDeclineDate: "2024-11-20",
    declineHistory: [
      { employer: "St. Gabriel Hospital", reason: "Accepted another offer", date: "2024-11-20" },
      { employer: "Bethel Clinic", reason: "Location too far", date: "2024-11-15" },
      { employer: "Rohobot Home Care", reason: "Night shift conflict", date: "2024-11-10" },
      { employer: "Zewditu Hospital", reason: "Salary expectations", date: "2024-10-28" },
    ],
    flagStatus: "Flagged", // System automatically flagged this
  },
  {
    id: "C-105",
    name: "Dawit Abebe",
    role: "Registered Nurse",
    declineCount: 2,
    lastDeclineDate: "2024-11-18",
    declineHistory: [
      { employer: "St. Gabriel Hospital", reason: "Not available immediately", date: "2024-11-18" },
      { employer: "Bethel Clinic", reason: "Accepted another offer", date: "2024-11-05" },
    ],
    flagStatus: "None", // Below threshold
  }
];

export const declineMonitoringService = {
  // Admin fetches all candidates with declines
  getDeclineRecords: async (): Promise<FlaggedCandidate[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return DB_FLAGGED.map((candidate) => ({
      ...candidate,
      flagStatus:
        candidate.flagStatus === "Cleared" || candidate.flagStatus === "Investigated"
          ? candidate.flagStatus
          : candidate.declineCount > DECLINE_THRESHOLD
            ? "Flagged"
            : "None",
    }));
  },

  // Admin action to clear a flag after investigation
  clearFlag: async (id: string, notes: string): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    DB_FLAGGED = DB_FLAGGED.map(c => c.id === id ? { 
      ...c, 
      flagStatus: "Cleared", 
      adminNotes: notes 
    } : c);
    return { success: true };
  },

  // Admin action to annotate a flag (keep flagged but add notes)
  annotateFlag: async (id: string, notes: string): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    DB_FLAGGED = DB_FLAGGED.map(c => c.id === id ? { 
      ...c, 
      flagStatus: "Investigated", 
      adminNotes: notes 
    } : c);
    return { success: true };
  }
};