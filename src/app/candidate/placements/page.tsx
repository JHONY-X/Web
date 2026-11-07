"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { placementService, PlacementRecord } from "@/lib/api/services/placement";
import { Briefcase, Building2, CheckCircle2, Clock, MapPin } from "lucide-react";

export default function CandidatePlacementsPage() {
  const [placements, setPlacements] = useState<PlacementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPlacements = async () => {
    setIsLoading(true);
    // In a real app, filter by logged-in candidate ID
    const all = await placementService.getAllPlacements();
    setPlacements(all);
    setIsLoading(false);
  };

  useEffect(() => {
    let active = true;
    placementService.getAllPlacements().then((placements) => {
      if (!active) return;
      setPlacements(placements);
      setIsLoading(false);
    }).catch((error: unknown) => {
      if (!active) return;
      console.error("Failed to load placements.", error);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const handleConfirmEmployment = async (id: string) => {
    setProcessingId(id);
    await placementService.confirmEmployment(id);
    await fetchPlacements();
    setProcessingId(null);
  };

  if (isLoading) return <DashboardLayout role="candidate"><div className="p-8 text-slate-500">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout role="candidate">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Placements</h1>
          <p className="text-slate-500 text-sm mt-1">Confirm your employment status to complete the process.</p>
        </div>

        <div className="space-y-4">
          {placements.map((placement) => (
            <div key={placement.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{placement.positionTitle}</h3>
                  <p className="text-sm text-primary-600 font-medium flex items-center gap-1 mt-1">
                    <Building2 className="w-4 h-4" /> {placement.employerName}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                  placement.stage === "Selected" ? "bg-amber-50 text-amber-700" :
                  placement.stage === "Commenced Employment" ? "bg-emerald-50 text-emerald-700" :
                  "bg-slate-100 text-slate-700"
                }`}>
                  {placement.stage}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {placement.location}</span>
                {placement.employmentStartDate && (
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Start: {placement.employmentStartDate}</span>
                )}
              </div>

              {placement.stage === "Selected" && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3">
                  <p className="text-sm text-amber-800 font-medium">You have been selected! Please confirm you have started this position.</p>
                  <Button 
                    className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700" 
                    onClick={() => handleConfirmEmployment(placement.id)}
                    isLoading={processingId === placement.id}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Employment
                  </Button>
                </div>
              )}

              {placement.stage === "Commenced Employment" && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <p className="text-sm text-emerald-800 font-medium">Employment Confirmed. Welcome to your new role!</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}