export interface TrainingResource {
  id: string;
  title: string;
  provider: string;
  duration: string;
  category: string;
  description: string;
  isRohobotOfficial: boolean;
}

export interface CandidateCertificate {
  id: string;
  courseName: string;
  issueDate: string;
  certificateUrl: string; // Mock URL
  status: "Completed" | "In Progress";
}

export interface SkillsGap {
  skillName: string;
  reason: string; // e.g., "2 employers noted low communication scores"
  recommendedCourseId: string;
}

// Mock Database
const DB_COURSES: TrainingResource[] = [
  { id: "CRS-01", title: "Advanced ICU & Critical Care", provider: "Rohobot Academy", duration: "4 Weeks", category: "Clinical Skills", description: "Master high-pressure critical care protocols and ventilator management.", isRohobotOfficial: true },
  { id: "CRS-02", title: "Effective Patient Communication", provider: "Rohobot Academy", duration: "1 Week", category: "Soft Skills", description: "Improve empathy, de-escalation, and patient-family communication.", isRohobotOfficial: true },
  { id: "CRS-03", title: "Maternal Health & Safe Delivery", provider: "Ethiopian Midwives Assoc.", duration: "3 Weeks", category: "Clinical Skills", description: "Updated protocols for prenatal and postpartum care.", isRohobotOfficial: false },
  { id: "CRS-04", title: "Leadership for Head Nurses", provider: "Rohobot Academy", duration: "2 Weeks", category: "Management", description: "Transition from clinical to leadership roles.", isRohobotOfficial: true },
];

const DB_CERTIFICATES: CandidateCertificate[] = [
  { id: "CERT-01", courseName: "Basic Life Support (BLS)", issueDate: "2023-05-10", certificateUrl: "#", status: "Completed" },
  { id: "CERT-02", courseName: "Advanced Patient Communication", issueDate: "2024-01-15", certificateUrl: "#", status: "Completed" },
];

export const careerService = {
  // 1. Get all resources
  getTrainingResources: async (): Promise<TrainingResource[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [...DB_COURSES];
  },

  // 2. Get candidate's certificates
  getMyCertificates: async (): Promise<CandidateCertificate[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [...DB_CERTIFICATES];
  },

  // 3. Enroll in a course (mock)
  enrollInCourse: async (courseId: string): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const course = DB_COURSES.find(c => c.id === courseId);
    if (course) {
      DB_CERTIFICATES.unshift({
        id: `CERT-${Date.now()}`,
        courseName: course.title,
        issueDate: new Date().toISOString().split("T")[0],
        certificateUrl: "#",
        status: "In Progress",
      });
    }
    return { success: true };
  },

  // 4. THE SKILLS GAP ENGINE
  // In a real app, this would call an AI endpoint. We simulate it by analyzing mock feedback.
  getSkillsGapRecommendations: async (): Promise<SkillsGap[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Simulated logic: We pretend the employer feedback for this candidate showed low communication.
    return [
      {
        skillName: "Patient Communication",
        reason: "Recent employer feedback indicated a need for stronger patient-family communication.",
        recommendedCourseId: "CRS-02"
      },
      {
        skillName: "Critical Care Protocols",
        reason: "Your target role (Senior ICU Nurse) requires updated ventilator management skills.",
        recommendedCourseId: "CRS-01"
      }
    ];
  }
};