import { notificationService } from "./notification";
export type RecruitmentOutcome = "Shortlisted" | "Selected" | "Unsuccessful" | "Pending";

export interface EmployerFeedback {
  id: string;
  interviewId: string;
  candidateId: string;
  candidateName: string;
  employerName: string;
  positionTitle: string;
  interviewDate: string;
  
  // Scoring (1-5)
  professionalKnowledge: number;
  communicationSkills: number;
  relevantExperience: number;
  overallSuitability: number;
  
  outcome: RecruitmentOutcome;
  additionalComments: string;
  submittedAt: string;
  submittedBy: string; // Employer representative name
}

// Strictly internal in-memory database
const DB_FEEDBACK: EmployerFeedback[] = [
  {
    id: "FB-001",
    interviewId: "INT-001",
    candidateId: "1",
    candidateName: "Abebe Kebede",
    employerName: "St. Gabriel General Hospital",
    positionTitle: "Senior ICU Nurse",
    interviewDate: "2024-11-25",
    professionalKnowledge: 5,
    communicationSkills: 4,
    relevantExperience: 5,
    overallSuitability: 4,
    outcome: "Selected",
    additionalComments: "Excellent clinical knowledge. Very calm under pressure. Recommended for hire.",
    submittedAt: "2024-11-26 09:30 AM",
    submittedBy: "Dr. Samuel Tadesse",
  }
];

export const feedbackService = {
  // ---- EMPLOYER ACTIONS ----
submitFeedback: async (feedback: Omit<EmployerFeedback, "id" | "submittedAt">): Promise<{ success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  DB_FEEDBACK.unshift({ ...feedback, id: `FB-${Date.now()}`, submittedAt: new Date().toLocaleString() });
  
  // 🔥 TRIGGER NOTIFICATION FOR ADMIN
  notificationService.pushNotification(
    "New Confidential Feedback",
    `${feedback.employerName} submitted feedback for ${feedback.candidateName}.`,
    "info",
    "admin"
  );
  return { success: true };
},

  // Employer can only see if they already submitted feedback for a specific interview
  checkIfFeedbackSubmitted: async (interviewId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return DB_FEEDBACK.some(f => f.interviewId === interviewId);
  },

  // ---- ADMIN ONLY ACTIONS ----
  // In a production environment, the backend MUST enforce that only role="admin" can call this
  getAllFeedback: async (): Promise<EmployerFeedback[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [...DB_FEEDBACK];
  }
};