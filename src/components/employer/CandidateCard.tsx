import {
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  BookmarkPlus,
  CalendarPlus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MatchedCandidate } from "@/lib/api/services/employer";

interface CandidateCardProps {
  candidate: MatchedCandidate;
  onRequestInterview: (candidate: MatchedCandidate) => void;
  onSave?: (id: string) => void;
}

export function CandidateCard({
  candidate,
  onRequestInterview,
  onSave,
}: CandidateCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden">
      {/* Match Score Ribbon */}
      <div className="absolute top-0 right-0 bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 border-b border-l border-primary-100">
        <Sparkles className="w-3 h-3" />
        {candidate.matchScore}% Match
      </div>

      <div className="flex justify-between items-start mb-4 mt-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
            {candidate.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-lg flex items-center gap-2">
              {candidate.name}
              {candidate.isVerified && (
                <span title="Verified Professional">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </span>
              )}
            </h3>
            <p className="text-sm text-primary-600 font-medium">
              {candidate.role}
            </p>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <p className="text-sm text-slate-600 mb-4 line-clamp-2 italic">
        &quot;{candidate.professionalSummary}&quot;
      </p>

      <div className="space-y-2 mb-4 flex-1">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <GraduationCap className="w-4 h-4 text-slate-400" />
          {candidate.qualification}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Briefcase className="w-4 h-4 text-slate-400" />
          {candidate.experienceYears} Years Experience
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="w-4 h-4 text-slate-400" />
          {candidate.location}
        </div>
      </div>

      {/* Match Reasons (Explainable AI) */}
      {candidate.matchReasons.length > 0 && (
        <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
            Why this match?
          </p>
          <div className="flex flex-wrap gap-2">
            {candidate.matchReasons.map((reason, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-1 rounded-md font-medium ${
                  reason.type === "positive"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {reason.label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {candidate.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            candidate.availability === "Immediate"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {candidate.availability}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onSave?.(candidate.id)}
            className={`p-2 transition-colors ${candidate.isSaved ? "text-primary-600" : "text-slate-400 hover:text-primary-600"}`}
            title={candidate.isSaved ? "Remove from saved" : "Save Candidate"}
          >
            <BookmarkPlus
              className={`w-5 h-5 ${candidate.isSaved ? "fill-primary-600" : ""}`}
            />
          </button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => onRequestInterview(candidate)}
          >
            <CalendarPlus className="w-4 h-4" />
            Interview
          </Button>
        </div>
      </div>
    </div>
  );
}
