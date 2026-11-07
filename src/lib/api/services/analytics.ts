// src/lib/api/services/analytics.ts
import { adminService } from "./admin";
import { placementService } from "./placement";
import { declineMonitoringService } from "./decline-monitoring";

export interface DashboardFilters {
  category?: string;
  location?: string;
}

const CANDIDATE_COUNTS = [
  { category: "Nursing", location: "Addis Ababa", value: 400 },
  { category: "Nursing", location: "Adama", value: 100 },
  { category: "Nursing", location: "Hawassa", value: 90 },
  { category: "Nursing", location: "Other", value: 60 },
  { category: "Midwifery", location: "Addis Ababa", value: 180 },
  { category: "Midwifery", location: "Adama", value: 50 },
  { category: "Midwifery", location: "Hawassa", value: 45 },
  { category: "Midwifery", location: "Other", value: 45 },
  { category: "Lab Tech", location: "Addis Ababa", value: 100 },
  { category: "Lab Tech", location: "Adama", value: 40 },
  { category: "Lab Tech", location: "Hawassa", value: 30 },
  { category: "Lab Tech", location: "Other", value: 10 },
  { category: "Physician", location: "Addis Ababa", value: 40 },
  { category: "Physician", location: "Adama", value: 20 },
  { category: "Physician", location: "Hawassa", value: 15 },
  { category: "Physician", location: "Other", value: 23 },
];

const SAMPLE_CANDIDATE_TOTAL = CANDIDATE_COUNTS.reduce(
  (total, candidate) => total + candidate.value,
  0
);

export interface AggregatedMetrics {
  // Candidates
  totalCandidates: number;
  verifiedCandidates: number;
  pendingVerifications: number;
  unavailableCandidates: number;
  genderSplit: { male: number; female: number };
  categorySplit: { name: string; value: number }[];
  locationSplit: { name: string; value: number }[];
  
  // Employers
  totalEmployers: number;
  verifiedEmployers: number;
  activeSubscriptions: { gold: number; silver: number; basic: number };
  
  // Financials
  totalRevenue: number;
  
  // Recruitment Activity
  interviewsSent: number;
  interviewsAccepted: number;
  interviewsDeclined: number;
  interviewsCompleted: number;
  
  // Placements
  placementsCommenced: number;
  
  // Risk
  flaggedCandidates: number;
}

export const analyticsService = {
  getDashboardMetrics: async (filters: DashboardFilters): Promise<AggregatedMetrics> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // In a real app, the backend aggregates this via SQL. 
    // For this demo, we will pull from our existing mock services.
    const verifications = await adminService.getVerifications();
    const transactions = await adminService.getTransactions();
    const placements = await placementService.getAllPlacements();
    const declines = await declineMonitoringService.getDeclineRecords();

    // --- CANDIDATE METRICS ---
    const candidateVerifications = verifications.filter(v => v.type === "Candidate");
    const matchingCandidates = CANDIDATE_COUNTS.filter(
      (candidate) =>
        (!filters.category || candidate.category === filters.category) &&
        (!filters.location || candidate.location === filters.location)
    );
    const totalCandidates = matchingCandidates.reduce(
      (total, candidate) => total + candidate.value,
      0
    );
    const sampleRatio = totalCandidates / SAMPLE_CANDIDATE_TOTAL;
    const pendingVerifications = Math.round(
      candidateVerifications.filter((verification) => verification.status === "Pending").length *
        sampleRatio
    );
    const verifiedCandidates = Math.round(1200 * sampleRatio);
    const unavailableCandidates = Math.round(45 * sampleRatio);

    // --- EMPLOYER METRICS ---
    const employerVerifications = verifications.filter(v => v.type === "Employer");
    const totalEmployers = 86;
    const verifiedEmployers = employerVerifications.filter(v => v.status === "Approved").length + 80;

    // --- FINANCIAL ---
    const totalRevenue = transactions.filter(t => t.status === "Successful").reduce((sum, t) => sum + t.amount, 0);

    // --- PLACEMENTS ---
    const placementsCommenced = placements.filter(p => p.stage === "Commenced Employment").length;
    
    // --- RISK ---
    const flaggedCandidates = declines.filter(d => d.flagStatus === "Flagged").length;

    return {
      totalCandidates,
      verifiedCandidates,
      pendingVerifications,
      unavailableCandidates,
      genderSplit: {
        male: Math.round(480 * sampleRatio),
        female: totalCandidates - Math.round(480 * sampleRatio),
      },
      categorySplit: CANDIDATE_COUNTS.filter(
        (candidate) => !filters.location || candidate.location === filters.location
      )
        .filter((candidate) => !filters.category || candidate.category === filters.category)
        .reduce<{ name: string; value: number }[]>((categories, candidate) => {
          const currentCategory = categories.find((item) => item.name === candidate.category);
          if (currentCategory) currentCategory.value += candidate.value;
          else categories.push({ name: candidate.category, value: candidate.value });
          return categories;
        }, []),
      locationSplit: CANDIDATE_COUNTS.filter(
        (candidate) => !filters.category || candidate.category === filters.category
      )
        .filter((candidate) => !filters.location || candidate.location === filters.location)
        .reduce<{ name: string; value: number }[]>((locations, candidate) => {
          const currentLocation = locations.find((item) => item.name === candidate.location);
          if (currentLocation) currentLocation.value += candidate.value;
          else locations.push({ name: candidate.location, value: candidate.value });
          return locations;
        }, []),
      totalEmployers: totalEmployers + employerVerifications.filter(v => v.status === "Pending").length,
      verifiedEmployers,
      activeSubscriptions: { gold: 12, silver: 24, basic: 50 },
      totalRevenue,
      interviewsSent: 145,
      interviewsAccepted: 98,
      interviewsDeclined: 32,
      interviewsCompleted: 85,
      placementsCommenced,
      flaggedCandidates,
    };
  }
};