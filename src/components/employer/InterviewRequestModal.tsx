"use client";

import { useState } from "react";
import { X, Calendar, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { interviewService } from "@/lib/api/services/interview";
import { todayISO } from "@/lib/date";

interface InterviewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateId: string;
}

export function InterviewRequestModal({ isOpen, onClose, candidateName, candidateId }: InterviewRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    positionTitle: "",
    date: "",
    time: "",
    location: "",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.date < todayISO()) {
      alert("Interview date cannot be before today.");
      return;
    }
    setIsSubmitting(true);
    try {
      await interviewService.createRequest({
        candidateId,
        candidateName,
        employerName: "Your Organization", // Hardcoded for now, would come from Auth context
        positionTitle: formData.positionTitle,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        notes: formData.notes,
      });
      alert("Interview request sent successfully!");
      onClose();
    } catch {
      alert("Failed to send request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Request Interview</h2>
            <p className="text-sm text-slate-500 mt-1">with {candidateName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Position Title *</label>
            <div className="relative">
              <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                required
                type="text" 
                value={formData.positionTitle}
                onChange={(e) => setFormData({...formData, positionTitle: e.target.value})}
                placeholder="e.g. Senior ICU Nurse"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input 
                  required
                  type="date" 
                  min={todayISO()}
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time *</label>
              <input 
                required
                type="time" 
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location / Link *</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                required
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Physical address or Google Meet link"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes (Optional)</label>
            <textarea 
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any instructions for the candidate..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm resize-none" 
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Send Request</Button>
          </div>
        </form>
      </div>
    </div>
  );
}