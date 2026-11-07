"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FilterPanel } from "@/components/employer/FilterPanel";
import { CandidateCard } from "@/components/employer/CandidateCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { employerService, MatchedCandidate, SearchCriteria } from "@/lib/api/services/employer";
import { InterviewRequestModal } from "@/components/employer/InterviewRequestModal";

export default function EmployerSearchPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [candidates, setCandidates] = useState<MatchedCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

    const handleToggleSave = async (id: string) => {
    await employerService.toggleSaveCandidate(id);
    // Update local state to reflect the filled bookmark icon
    setCandidates(prev => prev.map(c => 
      c.id === id ? { ...c, isSaved: !c.isSaved } : c
    ));
  };
  
  // Centralized Search Criteria State
  const [criteria, setCriteria] = useState<SearchCriteria>({
    query: "",
    category: "",
    qualification: "",
    location: "",
    minExperience: 0,
    availability: "",
    workArrangement: "",
  });

  // Interview Modal State
  const [selectedCandidate, setSelectedCandidate] = useState<MatchedCandidate | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        // Pass the full criteria object to the service
        const results = await employerService.searchCandidates(criteria);
        setCandidates(results);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API call to prevent spamming on every keystroke
    const timer = setTimeout(() => {
      fetchCandidates();
    }, 400);

    return () => clearTimeout(timer);
  }, [criteria]); // Re-run whenever criteria changes

  return (
    <DashboardLayout role="employer">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Desktop Filters */}
        <div className="hidden md:block w-72 shrink-0">
          <FilterPanel criteria={criteria} onChange={setCriteria} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Smart Candidate Matching</h1>
              <p className="text-slate-500 text-sm mt-1">Verified professionals ranked against your recruitment criteria.</p>
            </div>
            
            <Button 
              variant="outline" 
              className="md:hidden flex items-center gap-2"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Global Search Bar (Main) */}
          <div className="mb-6 relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, role, or skill..." 
              value={criteria.query}
              onChange={(e) => setCriteria({...criteria, query: e.target.value})}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900"
            />
          </div>

          {/* Mobile Filter Panel */}
          {isMobileFilterOpen && (
            <div className="md:hidden mb-6">
              <FilterPanel criteria={criteria} onChange={setCriteria} />
            </div>
          )}

          {/* Results Header */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-500">
              {isLoading ? "Calculating matches..." : (
                <>Found <span className="font-semibold text-slate-900">{candidates.length}</span> matching candidates</>
              )}
            </p>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Verified profiles only
            </div>
          </div>

          {/* Loading Skeletons */}
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 h-72 animate-pulse">
                  <div className="flex gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Results Grid */
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {candidates.map((candidate) => (
                  <CandidateCard 
                    key={candidate.id} 
                    candidate={candidate} 
                    onRequestInterview={(c) => setSelectedCandidate(c)} 
                    onSave={handleToggleSave}
                  />
                ))}
              </div>
              
              {/* Empty State */}
              {candidates.length === 0 && (
                <div className="text-center py-20 bg-white border border-slate-200 rounded-xl border-dashed">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">No candidates match your criteria</h3>
                  <p className="text-slate-500 mt-1">Try adjusting your filters, location, or minimum experience.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setCriteria({ query: "", category: "", qualification: "", location: "", minExperience: 0, availability: "", workArrangement: "" })}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Interview Modal */}
      <InterviewRequestModal 
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        candidateId={selectedCandidate?.id || ""}
        candidateName={selectedCandidate?.name || ""}
      />
    </DashboardLayout>
  );
}