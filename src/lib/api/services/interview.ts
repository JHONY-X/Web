import { daysFromNow } from "@/lib/date";
import { notificationService } from "./notification";
export type InterviewStatus = "Pending" | "Accepted" | "Declined" | "Rescheduling Requested" | "Completed";

export interface InterviewRequest {
  id: string;
  candidateId: string;
  candidateName: string;
  employerName: string;
  positionTitle: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
  status: InterviewStatus;
  rescheduleReason?: string; // Candidate provides this if they want to reschedule
  proposedNewDate?: string;  // Candidate suggests this
  declineReason?: string;
}

// In-Memory database so both Employer and Candidate see the same data
let DB_INTERVIEWS: InterviewRequest[] = [
  {
    id: "INT-001",
    candidateId: "1",
    candidateName: "Abebe Kebede",
    employerName: "St. Gabriel General Hospital",
    positionTitle: "Senior ICU Nurse",
    date: "2024-12-05",
    time: "10:00 AM",
    location: "Bole Road, Addis Ababa",
    notes: "Please bring your original nursing license.",
    status: "Pending",
  },
  {
    id: "INT-002",
    candidateId: "1",
    candidateName: "Abebe Kebede",
    employerName: "Rohobot Home Care",
    positionTitle: "Home Care Nurse",
    date: "2024-12-02",
    time: "02:30 PM",
    location: "Virtual (Google Meet)",
    status: "Accepted",
  }
];

export const interviewService = {
  // ---- CANDIDATE METHODS ----
  getCandidateInterviews: async (): Promise<InterviewRequest[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [...DB_INTERVIEWS];
  },
  
respondToInterview: async (id: string, status: "Accepted" | "Declined", reason?: string): Promise<{ success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const interview = DB_INTERVIEWS.find(i => i.id === id);
  
  DB_INTERVIEWS = DB_INTERVIEWS.map(i => i.id === id ? { 
    ...i, 
    status, 
    declineReason: status === "Declined" ? reason : undefined 
  } : i);

  // 🔥 TRIGGER NOTIFICATION FOR EMPLOYER
  if (interview && status === "Accepted") {
    notificationService.pushNotification(
      "Interview Accepted",
      `${interview.candidateName} accepted your interview request for ${interview.positionTitle}.`,
      "success",
      "employer"
    );
  } else if (interview && status === "Declined") {
    notificationService.pushNotification(
      "Interview Declined",
      `${interview.candidateName} declined the interview request for ${interview.positionTitle}. Reason: ${reason}`,
      "warning",
      "employer"
    );
  }
  return { success: true };
},

  requestReschedule: async (id: string, reason: string, newDate: string): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    DB_INTERVIEWS = DB_INTERVIEWS.map(i => i.id === id ? { 
      ...i, 
      status: "Rescheduling Requested", 
      rescheduleReason: reason,
      proposedNewDate: newDate 
    } : i);
    // 🔥 TRIGGER NOTIFICATION FOR EMPLOYER
    const interview = DB_INTERVIEWS.find(i => i.id === id);
    if (interview) {
      notificationService.pushNotification(
        "Rescheduling Requested",
        `${interview.candidateName} has requested to reschedule the interview for ${interview.positionTitle}. Reason: ${reason}`,
        "info",
        "employer"
      );
    }
    return { success: true };
  },

  // ---- EMPLOYER METHODS ----
  getEmployerInterviews: async (): Promise<InterviewRequest[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    // In a real app, filter by employerId. For now, return all.
    return [...DB_INTERVIEWS];
  },

  createRequest: async (data: Omit<InterviewRequest, "id" | "status">): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    DB_INTERVIEWS.unshift({
      ...data,
      id: `INT-${Date.now()}`,
      status: "Pending"
    });
    return { success: true };
  },

  markAsCompleted: async (id: string): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    DB_INTERVIEWS = DB_INTERVIEWS.map(i => i.id === id ? { ...i, status: "Completed" } : i);
    return { success: true };
  }
};