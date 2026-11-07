import { notificationService } from "./notification";
export type PlacementStage = 
  | "Matched" 
  | "Interviewed" 
  | "Selected" 
  | "Offer Accepted" 
  | "Commenced Employment" 
  | "Discontinued";

export interface PlacementRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  employerName: string;
  positionTitle: string;
  location: string;
  
  // Funnel Tracking
  stage: PlacementStage;
  
  // Dates
  interviewDate?: string;
  selectionDate?: string;
  offerAcceptedDate?: string;
  employmentStartDate?: string;
  followUpDate?: string;
  
  // Confirmations
  employerConfirmed: boolean;
  candidateConfirmed: boolean;
  
  // Issues
  unsuccessfulReason?: string;
  discontinuationReason?: string;
  
  lastUpdated: string;
}

// In-memory database
let DB_PLACEMENTS: PlacementRecord[] = [
  {
    id: "PLC-001",
    candidateId: "1",
    candidateName: "Abebe Kebede",
    employerName: "St. Gabriel General Hospital",
    positionTitle: "Senior ICU Nurse",
    location: "Addis Ababa",
    stage: "Commenced Employment",
    interviewDate: "2024-11-25",
    selectionDate: "2024-11-28",
    offerAcceptedDate: "2024-11-30",
    employmentStartDate: "2024-12-05",
    followUpDate: "2025-03-05", // 90 days follow-up
    employerConfirmed: true,
    candidateConfirmed: true,
    lastUpdated: "2024-12-05",
  },
  {
    id: "PLC-002",
    candidateId: "2",
    candidateName: "Sara Mohammed",
    employerName: "Rohobot Home Care",
    positionTitle: "Home Care Midwife",
    location: "Adama",
    stage: "Selected",
    interviewDate: "2024-11-20",
    selectionDate: "2024-11-27",
    employerConfirmed: true,
    candidateConfirmed: false,
    lastUpdated: "2024-11-27",
  },
  {
    id: "PLC-003",
    candidateId: "4",
    candidateName: "Elena Tesfaye",
    employerName: "Bethel Clinic",
    positionTitle: "General Practitioner",
    location: "Addis Ababa",
    stage: "Interviewed",
    interviewDate: "2024-11-22",
    employerConfirmed: false,
    candidateConfirmed: false,
    unsuccessfulReason: "Candidate lacked specific pediatric experience.",
    lastUpdated: "2024-11-22",
  }
];

export const placementService = {
  // EMPLOYER: Get placements for their organization
  getEmployerPlacements: async (): Promise<PlacementRecord[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [...DB_PLACEMENTS];
  },

  // EMPLOYER: Confirm they have selected/started the candidate
confirmSelection: async (id: string, startDate: string): Promise<{ success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const placement = DB_PLACEMENTS.find(p => p.id === id);
  
  DB_PLACEMENTS = DB_PLACEMENTS.map(p => p.id === id ? { ...p, stage: "Selected", employmentStartDate: startDate, employerConfirmed: true } : p);

  // 🔥 TRIGGER NOTIFICATION FOR CANDIDATE
  if (placement) {
    notificationService.pushNotification(
      "You have been selected!",
      `${placement.employerName} has selected you for the ${placement.positionTitle} role. Please confirm your employment.`,
      "success",
      "candidate"
    );
  }
  return { success: true };
},

  // CANDIDATE: Confirm they accepted the offer / started employment
confirmEmployment: async (id: string): Promise<{ success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const placement = DB_PLACEMENTS.find(p => p.id === id);
  
  DB_PLACEMENTS = DB_PLACEMENTS.map(p => p.id === id ? { ...p, stage: "Commenced Employment", candidateConfirmed: true } : p);

  // 🔥 TRIGGER NOTIFICATION FOR EMPLOYER & ADMIN
  if (placement) {
    notificationService.pushNotification(
      "Employment Commenced",
      `${placement.candidateName} has confirmed they started the ${placement.positionTitle} role.`,
      "success",
      "employer"
    );
    notificationService.pushNotification(
      "Placement Successful",
      `Candidate ${placement.candidateName} has commenced employment at ${placement.employerName}.`,
      "success",
      "admin"
    );
  }
  return { success: true };
},

  // ADMIN: Get full funnel
  getAllPlacements: async (): Promise<PlacementRecord[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [...DB_PLACEMENTS];
  }
};