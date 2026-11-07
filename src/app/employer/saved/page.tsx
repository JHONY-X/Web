"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CandidateCard } from "@/components/employer/CandidateCard";
import { employerService, MatchedCandidate } from "@/lib/api/services/employer";
import { Bookmark } from "lucide-react";

export default function SavedCandidatesPage() {
  const [savedCandidates, setSavedCandidates] = useState<MatchedCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      // Search with empty criteria to get all verified candidates, then filter by saved
      const all = await employerService.searchCandidates({
        query: "",
        category: "",
        qualification: "",
        location: "",
        minExperience: 0,
        availability: "",
        workArrangement: "",
      });
      setSavedCandidates(all.filter(c => c.isSaved));
      setIsLoading(false);
    };
    fetchSaved();
  }, []);

  return (
    <DashboardLayout role="employer">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-primary-600" /> Saved Candidates
          </h1>
          <p className="text-slate-500 text-sm mt-1">Your shortlisted professionals.</p>
        </div>

        {isLoading ? (
          <div className="text-slate-500">Loading...</div>
        ) : savedCandidates.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-xl border-dashed">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No saved candidates yet</h3>
            <p className="text-slate-500 mt-1">Click the bookmark icon on a candidate to save them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {savedCandidates.map((candidate) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                onRequestInterview={() => {}} // Add modal hookup here
                onSave={async (id) => {
                  await employerService.toggleSaveCandidate(id);
                  // Optimistically remove from UI
                  setSavedCandidates(prev => prev.filter(c => c.id !== id));
                }} 
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}