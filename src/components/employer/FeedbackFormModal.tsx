"use client";

import { useState } from "react";
import { X, Star, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { feedbackService, RecruitmentOutcome, EmployerFeedback } from "@/lib/api/services/feedback";

export interface FeedbackInterviewData {
  interviewId: string;
  candidateId: string;
  candidateName: string;
  employerName: string;
  positionTitle: string;
  interviewDate: string;
}

interface FeedbackFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewData: FeedbackInterviewData;
}

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

function StarRating({ value, onChange, label }: StarRatingProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">{label} *</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-1 transition-colors ${star <= value ? "text-amber-400" : "text-slate-300 hover:text-amber-200"}`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function FeedbackFormModal({ isOpen, onClose, interviewData }: FeedbackFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    professionalKnowledge: 0,
    communicationSkills: 0,
    relevantExperience: 0,
    overallSuitability: 0,
    outcome: "Pending" as RecruitmentOutcome,
    additionalComments: "",
    submittedBy: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await feedbackService.submitFeedback({
        ...formData,
        ...interviewData,
      } as Omit<EmployerFeedback, "id" | "submittedAt">);
      alert("Confidential feedback submitted. Thank you!");
      onClose();
    } catch (error) {
      alert("Failed to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Submit Interview Feedback</h2>
            <p className="text-sm text-slate-500 mt-1">{interviewData.candidateName} • {interviewData.positionTitle}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confidentiality Warning */}
        <div className="bg-amber-50 border-b border-amber-100 p-4 flex items-start gap-3 shrink-0">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>Confidential Document:</strong> This feedback will be stored securely and is only accessible to authorized Rohobot administrative personnel. It will not be visible to the candidate or other employers.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Ratings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <StarRating 
              label="Professional Knowledge" 
              value={formData.professionalKnowledge} 
              onChange={(v) => setFormData({...formData, professionalKnowledge: v})} 
            />
            <StarRating 
              label="Communication Skills" 
              value={formData.communicationSkills} 
              onChange={(v) => setFormData({...formData, communicationSkills: v})} 
            />
            <StarRating 
              label="Relevant Experience" 
              value={formData.relevantExperience} 
              onChange={(v) => setFormData({...formData, relevantExperience: v})} 
            />
            <StarRating 
              label="Overall Suitability" 
              value={formData.overallSuitability} 
              onChange={(v) => setFormData({...formData, overallSuitability: v})} 
            />
          </div>

          <hr className="border-slate-100" />

          {/* Outcome */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Recruitment Outcome *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["Shortlisted", "Selected", "Unsuccessful", "Pending"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({...formData, outcome: status as RecruitmentOutcome})}
                  className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all ${
                    formData.outcome === status 
                      ? "bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500" 
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Comments */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Additional Comments & Recommendations</label>
            <textarea 
              rows={3}
              value={formData.additionalComments}
              onChange={(e) => setFormData({...formData, additionalComments: e.target.value})}
              placeholder="Provide specific observations that will help Rohobot improve candidate training and matching..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm resize-none"
            />
          </div>

          {/* Submitter Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your Name (Authorized Representative) *</label>
            <input 
              required
              type="text" 
              value={formData.submittedBy}
              onChange={(e) => setFormData({...formData, submittedBy: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm" 
              placeholder="e.g. Dr. Samuel Tadesse"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              type="submit" 
              isLoading={isSubmitting}
              disabled={!formData.professionalKnowledge || !formData.communicationSkills || !formData.relevantExperience || !formData.overallSuitability || !formData.submittedBy}
            >
              Submit Confidential Feedback
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}