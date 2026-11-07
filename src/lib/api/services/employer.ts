import { auditService } from "./audit";
import type { AvailabilityStatus, CandidateProfile } from "./candidate";

type WorkArrangement = CandidateProfile["preferredWorkArrangement"];

export interface SearchCriteria {
  query: string;
  category: string;
  qualification: string;
  location: string;
  minExperience: number;
  availability: AvailabilityStatus | "";
  workArrangement: WorkArrangement | "";
}

export interface MatchReason {
  label: string;
  type: "positive" | "neutral";
}

export interface MatchedCandidate {
  id: string;
  name: string;
  role: string;
  qualification: string;
  experienceYears: number;
  location: string;
  professionalSummary: string;
  skills: string[];
  availability: AvailabilityStatus;
  workArrangement: WorkArrangement;
  isVerified: boolean;
  isActive: boolean;
  matchScore: number;
  matchReasons: MatchReason[];
  isSaved: boolean;
}

type CandidateSearchRecord = Omit<
  MatchedCandidate,
  "matchScore" | "matchReasons" | "isSaved"
>;

export interface MatchingConfig {
  immediateAvailabilityBoost: number;
  highExperienceBoost: number;
  locationMatchBoost: number;
  minExperienceWeight: number;
}

// Admin can change these values later in a settings page
export const DEFAULT_MATCHING_CONFIG: MatchingConfig = {
  immediateAvailabilityBoost: 20,
  highExperienceBoost: 15,
  locationMatchBoost: 15,
  minExperienceWeight: 1,
};

const DB_CANDIDATES: CandidateSearchRecord[] = [
  {
    id: "CAND-9876",
    name: "Abebe Kebede",
    role: "Registered Nurse",
    qualification: "BSc Degree",
    experienceYears: 5,
    location: "Addis Ababa",
    professionalSummary:
      "Dedicated ICU nurse with experience in critical care and patient triage.",
    skills: ["ICU", "Emergency Care", "Patient Triage"],
    availability: "Immediate",
    workArrangement: "Full-time",
    isVerified: true,
    isActive: true,
  },
  {
    id: "2",
    name: "Sara Mohammed",
    role: "Midwife",
    qualification: "BSc Degree",
    experienceYears: 6,
    location: "Addis Ababa",
    professionalSummary:
      "Experienced midwife focused on maternal health and safe delivery care.",
    skills: ["Maternal Health", "Antenatal Care", "Delivery Care"],
    availability: "1 Week",
    workArrangement: "Shift Work",
    isVerified: true,
    isActive: true,
  },
  {
    id: "CAND-1003",
    name: "Mekdes Tesfaye",
    role: "Lab Technician",
    qualification: "Diploma",
    experienceYears: 3,
    location: "Hawassa",
    professionalSummary:
      "Laboratory technician experienced in clinical testing and specimen handling.",
    skills: ["Clinical Laboratory", "Specimen Handling", "Quality Control"],
    availability: "1 Month",
    workArrangement: "Contract",
    isVerified: true,
    isActive: true,
  },
];

const DB_SAVED_CANDIDATES: string[] = ["2"];

export const employerService = {
  searchCandidates: async (
    criteria: SearchCriteria,
    config: MatchingConfig = DEFAULT_MATCHING_CONFIG
  ): Promise<MatchedCandidate[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const query = criteria.query.trim().toLowerCase();
    const filteredCandidates = DB_CANDIDATES.filter((candidate) => {
      if (
        !candidate.isVerified ||
        !candidate.isActive ||
        candidate.availability === "Not Available"
      ) {
        return false;
      }

      const matchesQuery =
        !query ||
        candidate.name.toLowerCase().includes(query) ||
        candidate.role.toLowerCase().includes(query) ||
        candidate.skills.some((skill) => skill.toLowerCase().includes(query)) ||
        candidate.qualification.toLowerCase().includes(query);
      const matchesCategory =
        !criteria.category || candidate.role === criteria.category;
      const matchesQualification =
        !criteria.qualification ||
        candidate.qualification
          .toLowerCase()
          .includes(criteria.qualification.toLowerCase());
      const matchesLocation =
        !criteria.location || candidate.location === criteria.location;
      const matchesExperience =
        candidate.experienceYears >= criteria.minExperience;
      const matchesAvailability =
        !criteria.availability ||
        candidate.availability === criteria.availability;
      const matchesWorkArrangement =
        !criteria.workArrangement ||
        candidate.workArrangement === criteria.workArrangement;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesQualification &&
        matchesLocation &&
        matchesExperience &&
        matchesAvailability &&
        matchesWorkArrangement
      );
    });

    const rankedCandidates = filteredCandidates
      .map((candidate): MatchedCandidate => {
        let score =
          50 + candidate.experienceYears * config.minExperienceWeight;
        const reasons: MatchReason[] = [];

        if (candidate.availability === "Immediate") {
          score += config.immediateAvailabilityBoost;
          reasons.push({
            label: "Available Immediately",
            type: "positive",
          });
        }

        if (candidate.experienceYears >= 5) {
          score += config.highExperienceBoost;
          reasons.push({ label: "5+ Years Experience", type: "positive" });
        }

        if (criteria.location && candidate.location === criteria.location) {
          score += config.locationMatchBoost;
          reasons.push({
            label: "Located in Preferred Area",
            type: "positive",
          });
        }

        if (
          criteria.qualification &&
          candidate.qualification
            .toLowerCase()
            .includes(criteria.qualification.toLowerCase())
        ) {
          reasons.push({
            label: `${candidate.qualification} qualification`,
            type: "positive",
          });
        }

        if (
          criteria.workArrangement &&
          candidate.workArrangement === criteria.workArrangement
        ) {
          reasons.push({
            label: `${candidate.workArrangement} preference`,
            type: "positive",
          });
        }

        return {
          ...candidate,
          matchScore: Math.min(score, 100),
          matchReasons: reasons,
          isSaved: DB_SAVED_CANDIDATES.includes(candidate.id),
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    const filtersUsed: string[] = [];
    if (criteria.category) filtersUsed.push(criteria.category);
    if (criteria.qualification) {
      filtersUsed.push(criteria.qualification);
    }
    if (criteria.location) filtersUsed.push(criteria.location);
    if (criteria.minExperience > 0) {
      filtersUsed.push(`${criteria.minExperience}+ yrs`);
    }
    if (criteria.availability) {
      filtersUsed.push(`${criteria.availability} availability`);
    }
    if (criteria.workArrangement) {
      filtersUsed.push(criteria.workArrangement);
    }

    await auditService.logSearch({
      employerName: "St. Gabriel Hospital",
      searchQuery: criteria.query,
      filtersUsed,
      resultsCount: rankedCandidates.length,
    });

    return rankedCandidates;
  },

  toggleSaveCandidate: async (candidateId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (DB_SAVED_CANDIDATES.includes(candidateId)) {
      DB_SAVED_CANDIDATES.splice(
        DB_SAVED_CANDIDATES.indexOf(candidateId),
        1
      );
      return false;
    }

    DB_SAVED_CANDIDATES.push(candidateId);
    return true;
  }
};