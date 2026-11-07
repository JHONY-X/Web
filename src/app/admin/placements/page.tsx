"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { placementService, PlacementRecord } from "@/lib/api/services/placement";
import { Briefcase, TrendingUp, Users, CheckCircle2, ArrowRight } from "lucide-react";

export default function AdminPlacementsPage() {
  const [placements, setPlacements] = useState<PlacementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await placementService.getAllPlacements();
      setPlacements(data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  // Calculate Funnel Metrics
  const totalMatched = placements.length;
  const totalInterviewed = placements.filter(p => ["Interviewed", "Selected", "Offer Accepted", "Commenced Employment"].includes(p.stage)).length;
  const totalSelected = placements.filter(p => ["Selected", "Offer Accepted", "Commenced Employment"].includes(p.stage)).length;
  const totalCommenced = placements.filter(p => p.stage === "Commenced Employment").length;

  const funnelSteps = [
    { label: "Matched", value: totalMatched, color: "bg-primary-600" },
    { label: "Interviewed", value: totalInterviewed, color: "bg-accent-500" },
    { label: "Selected", value: totalSelected, color: "bg-amber-500" },
    { label: "Commenced", value: totalCommenced, color: "bg-emerald-500" },
  ];

  if (isLoading) return <DashboardLayout role="admin"><div className="p-8 text-slate-500">Loading analytics...</div></DashboardLayout>;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary-600" /> Placement & Employment Tracking
          </h1>
          <p className="text-slate-500 text-sm mt-1">Monitor the true effectiveness of the Rohobot matching engine.</p>
        </div>

        {/* Funnel Visualization */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Recruitment Funnel</h2>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {funnelSteps.map((step, index) => (
              <div key={step.label} className="flex-1 w-full relative">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                  <div className={`w-10 h-10 rounded-full ${step.color} text-white flex items-center justify-center mx-auto mb-3`}>
                    <span className="font-bold">{step.value}</span>
                  </div>
                  <p className="font-semibold text-slate-800">{step.label}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {index === 0 ? "Total database" : `${Math.round((step.value / funnelSteps[0].value) * 100)}% conversion`}
                  </p>
                </div>
                {index < funnelSteps.length - 1 && (
                  <ArrowRight className="hidden sm:block w-5 h-5 text-slate-300 absolute -right-3 top-1/2 -translate-y-1/2 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-semibold text-slate-900">Placement History</h2>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Candidate</th>
                <th className="px-6 py-3 font-medium">Employer</th>
                <th className="px-6 py-3 font-medium">Position</th>
                <th className="px-6 py-3 font-medium">Stage</th>
                <th className="px-6 py-3 font-medium">Start Date</th>
                <th className="px-6 py-3 font-medium">Confirmed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {placements.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{p.candidateName}</td>
                  <td className="px-6 py-4 text-slate-600">{p.employerName}</td>
                  <td className="px-6 py-4 text-slate-600">{p.positionTitle}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.stage === "Commenced Employment" ? "bg-emerald-50 text-emerald-700" :
                      p.stage === "Selected" ? "bg-amber-50 text-amber-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {p.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{p.employmentStartDate || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded border ${p.employerConfirmed ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                        Employer
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded border ${p.candidateConfirmed ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                        Candidate
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}