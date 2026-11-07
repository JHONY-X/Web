export type OrganizationType = "Hospital" | "Clinic" | "Home-Based Care" | "Other";
export type SubscriptionTier = "Basic" | "Silver" | "Gold";

export interface OrganizationProfile {
  id?: string;
  name: string;
  type: OrganizationType | "";
  location: string;
  contactEmail: string;
  contactPhone: string;
  representativeName: string;
  representativePhone: string;
  staffingCategories: string[];
  // In a real app, these would be file objects or URLs from the backend
  licenseDocumentName?: string;
  subscriptionTier: SubscriptionTier | "";
  status: "Draft" | "Pending Verification" | "Active" | "Rejected";
}

export const organizationService = {
  // Simulates saving the registration data
  registerOrganization: async (data: OrganizationProfile) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Submitting to backend:", data);
    // Return a mock success response
    return { success: true, organizationId: "ORG-12345" };
  },
  
  // Simulates fetching the current organization's profile
  getOrganizationProfile: async (): Promise<OrganizationProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      id: "ORG-12345",
      name: "St. Gabriel General Hospital",
      type: "Hospital",
      location: "Addis Ababa, Bole",
      contactEmail: "hr@stgabriel.com",
      contactPhone: "+251 911 234567",
      representativeName: "Dr. Samuel Tadesse",
      representativePhone: "+251 922 345678",
      staffingCategories: ["Registered Nurse", "Physician", "Lab Technician"],
      licenseDocumentName: "business_license_2024.pdf",
      subscriptionTier: "Gold",
      status: "Active",
    };
  }
};