export type VerificationStatus = "Unverified" | "Pending Review" | "Verified" | "Rejected";
export type AvailabilityStatus = "Immediate" | "1 Week" | "1 Month" | "Not Available";

export interface CandidateProfile {
  id?: string;
  fullName: string;
  profilePhotoUrl?: string;
  phone: string;
  email?: string;
  professionalCategory: string;
  qualificationLevel: string;
  educationBackground: string;
  certifications: string;
  yearsOfExperience: number;
  previousEmployment: string;
  professionalSummary: string;
  skills: string[];
  currentLocation: string;
  preferredLocation: string;
  employmentPreferences: string;
  availability: AvailabilityStatus;
  preferredWorkArrangement: "Full-time" | "Part-time" | "Contract" | "Shift Work";
  documents: { name: string; type: string }[]; // Simulated file uploads
  consentGiven: boolean;
  status: VerificationStatus;
}

export const candidateService = {
  // Simulates submitting the onboarding wizard
  submitProfile: async (profile: CandidateProfile): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Submitting profile to backend:", profile);
    // In production, this also triggers the verification workflow in the backend
    return { success: true };
  },

  // Simulates fetching the candidate's current profile for the dashboard
  getMyProfile: async (): Promise<CandidateProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      id: "CAND-9876",
      fullName: "Abebe Kebede",
      phone: "+251 911 234567",
      email: "abebe@example.com",
      professionalCategory: "Registered Nurse",
      qualificationLevel: "BSc Degree",
      educationBackground: "BSc in Nursing, Addis Ababa University (2018)",
      certifications: "Registered Nurse License (MoH)",
      yearsOfExperience: 5,
      previousEmployment: "St. Paul's Hospital (2019-2023)",
      professionalSummary: "Dedicated ICU nurse with 5 years of experience in high-pressure environments. Specialized in critical care and patient triage.",
      skills: ["ICU", "Emergency Care", "Patient Triage"],
      currentLocation: "Addis Ababa",
      preferredLocation: "Addis Ababa",
      employmentPreferences: "Looking for full-time hospital roles.",
      availability: "Immediate",
      preferredWorkArrangement: "Full-time",
      documents: [
        { name: "Nursing_License.pdf", type: "License" },
        { name: "BSc_Degree.pdf", type: "Education" }
      ],
      consentGiven: true,
      status: "Verified", // Try changing this to "Pending Review" to see the UI change!
    };
  },

  // Simulates quick updates like changing availability
  updateAvailability: async (availability: AvailabilityStatus): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  }
};