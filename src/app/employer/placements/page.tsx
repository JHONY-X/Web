"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { placementService, PlacementRecord } from "@/lib/api/services/placement";
import { Briefcase, MapPin, Calendar, CheckCircle2, User, Building2, Clock } from "lucide-react";

export default function EmployerPlacementsPage() {
  const [placements, setPlacements] = useState<PlacementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Selection Modal State
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");

  const fetchPlacements = async () => {
    setIsLoading(true);
    const data = await placementService.getEmployerPlacements();
    setPlacements(data);
    setIsLoading(false);
  };

  useEffect(() => {
    let active = true;
    placementService.getEmployerPlacements().then((placements) => {
      if (!active) return;
      setPlacements(placements);
      setIsLoading(false);
    }).catch((error: unknown) => {
      if (!active) return;
      console.error("Failed to load employer placements.", error);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const handleConfirmSelection = async () => {
    if (!selectingId || !startDate) return;
    setProcessingId(selectingId);
    await placementService.confirmSelection(selectingId, startDate);
    setSelectingId(null);
    setStartDate("");
    await fetchPlacements();
    setProcessingId(null);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Matched": return "bg-primary-50 text-primary-800";
      case "Interviewed": return "bg-accent-50 text-accent-800";
      case "Selected": return "bg-amber-50 text-amber-700";
      case "Offer Accepted": return "bg-accent-100 text-accent-900";
      case "Commenced Employment": return "bg-emerald-50 text-emerald-700";
      case "Discontinued": return "bg-red-50 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="employer">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-40 bg-slate-200 rounded-xl"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="employer">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary-600" /> Placement Tracking
          </h1>
          <p className="text-slate-500 text-sm mt-1">Confirm your hiring decisions to finalize the employment record.</p>
        </div>

        <div className="space-y-4">
          {placements.map((placement) => (
            <div key={placement.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{placement.candidateName}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4" /> {placement.employerName} • {placement.positionTitle}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getStageColor(placement.stage)}`}>
                  {placement.stage}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm bg-slate-50 p-3 rounded-lg mb-4 border border-slate-100">
                <div>
                  <p className="text-slate-500 text-xs">Interview Date</p>
                  <p className="font-medium text-slate-900">{placement.interviewDate || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Location</p>
                  <p className="font-medium text-slate-900 flex items-center gap-1"><MapPin className="w-3 h-3" /> {placement.location}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Start Date</p>
                  <p className="font-medium text-slate-900">{placement.employmentStartDate || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Follow-up</p>
                  <p className="font-medium text-slate-900">{placement.followUpDate || "-"}</p>
                </div>
              </div>

              {/* Action Area based on Stage */}
              <div className="flex justify-end gap-2">
                {placement.stage === "Interviewed" && (
                  <Button 
                    onClick={() => setSelectingId(placement.id)} 
                    className="gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Confirm Hire
                  </Button>
                )}
                {placement.stage === "Selected" && (
                  <div className="w-full sm:w-auto p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Awaiting candidate confirmation.
                  </div>
                )}
                {placement.stage === "Offer Accepted" && (
                  <div className="flex w-full items-center gap-2 rounded-lg border border-accent-200 bg-accent-50 p-3 text-sm text-accent-800 sm:w-auto">
                    <CheckCircle2 className="w-4 h-4" /> Candidate accepted. Awaiting start date.
                  </div>
                )}
                {placement.stage === "Commenced Employment" && (
                  <div className="w-full sm:w-auto p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Employment active. Follow-up scheduled.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Hire Modal */}
      {selectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Confirm Hiring Decision</h2>
              <p className="text-sm text-slate-500 mt-1">This will notify the candidate and Rohobot admin.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employment Start Date *</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <Button variant="outline" onClick={() => setSelectingId(null)}>Cancel</Button>
              <Button 
                onClick={handleConfirmSelection} 
                disabled={!startDate}
                isLoading={processingId === selectingId}
              >
                Confirm Hire
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}