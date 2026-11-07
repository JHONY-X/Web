"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { feedbackService, EmployerFeedback } from "@/lib/api/services/feedback";
import { ShieldCheck, Star, Lock, FileText, ChevronDown, Search } from "lucide-react";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<EmployerFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      const data = await feedbackService.getAllFeedback();
      setFeedbacks(data);
      setIsLoading(false);
    };
    fetchFeedback();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star key={star} className={`w-3 h-3 ${star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary-600" /> Confidential Employer Feedback
            </h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
              <Lock className="w-3 h-3" /> This data is restricted to authorized Rohobot personnel only.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-slate-800 text-white p-4 rounded-xl flex items-start gap-3 shadow-md">
          <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Access Restricted</p>
            <p className="text-xs text-slate-300 mt-1">All views of this page are logged in the system audit trail. Do not share these evaluations with candidates or other employers without approved legal basis.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading secure records...</div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="font-semibold text-slate-900">Submitted Evaluations ({feedbacks.length})</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input type="text" placeholder="Search candidate..." className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="p-5">
                  {/* Summary Row */}
                  <div 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === fb.id ? null : fb.id)}
                  >
                    <div>
                      <h3 className="font-bold text-slate-900">{fb.candidateName}</h3>
                      <p className="text-sm text-slate-500">{fb.positionTitle} • Submitted by {fb.employerName}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        fb.outcome === "Selected" ? "bg-emerald-100 text-emerald-700" :
                        fb.outcome === "Shortlisted" ? "bg-primary-100 text-primary-800" :
                        fb.outcome === "Unsuccessful" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
                      }`}>
                        {fb.outcome}
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:block">{fb.submittedAt}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === fb.id ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  {/* Expanded Evaluation */}
                  {expandedId === fb.id && (
                    <div className="mt-6 bg-slate-50 rounded-xl p-5 border border-slate-200 animate-in slide-in-from-top-2">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Professional Knowledge</p>
                          {renderStars(fb.professionalKnowledge)}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Communication</p>
                          {renderStars(fb.communicationSkills)}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Experience</p>
                          {renderStars(fb.relevantExperience)}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Overall Suitability</p>
                          {renderStars(fb.overallSuitability)}
                        </div>
                      </div>

                      {fb.additionalComments && (
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1"><FileText className="w-3 h-3" /> Comments & Recommendations</p>
                          <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200">{fb.additionalComments}</p>
                        </div>
                      )}

                      <p className="text-xs text-slate-400 mt-4 text-right">
                        Timestamp: {fb.submittedAt} • Submitted by: {fb.submittedBy}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}