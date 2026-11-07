"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { declineMonitoringService, FlaggedCandidate } from "@/lib/api/services/decline-monitoring";
import { AlertTriangle, ShieldCheck, FileText, ChevronDown, CheckCircle2, MessageSquare } from "lucide-react";

export default function AdminDeclineMonitoringPage() {
  const [records, setRecords] = useState<FlaggedCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Admin Action State
  const [actionModalId, setActionModalId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionType, setActionType] = useState<"clear" | "annotate">("clear");

  const fetchRecords = async () => {
    setIsLoading(true);
    const data = await declineMonitoringService.getDeclineRecords();
    setRecords(data);
    setIsLoading(false);
  };

  useEffect(() => {
    let active = true;
    declineMonitoringService.getDeclineRecords().then((data) => {
      if (!active) return;
      setRecords(data);
      setIsLoading(false);
    }).catch((error: unknown) => {
      if (!active) return;
      console.error("Failed to load decline records.", error);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const handleAction = async () => {
    if (!actionModalId || !adminNotes) return;
    if (actionType === "clear") {
      await declineMonitoringService.clearFlag(actionModalId, adminNotes);
    } else {
      await declineMonitoringService.annotateFlag(actionModalId, adminNotes);
    }
    setActionModalId(null);
    setAdminNotes("");
    await fetchRecords();
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" /> Decline Monitoring
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review candidates who have exceeded the decline threshold. <span className="font-medium text-slate-700">Note: Flags indicate review, not automatic disqualification.</span>
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading records...</div>
        ) : (
          <div className="space-y-4">
            {records.map((candidate) => (
              <div 
                key={candidate.id} 
                className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all ${
                  candidate.flagStatus === "Flagged" ? "border-red-300 ring-1 ring-red-100" : "border-slate-200"
                }`}
              >
                {/* Summary Row */}
                <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      candidate.flagStatus === "Flagged" ? "bg-red-100 text-red-700" : 
                      candidate.flagStatus === "Cleared" ? "bg-emerald-100 text-emerald-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        {candidate.name}
                        {candidate.flagStatus === "Flagged" && (
                          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Flagged
                          </span>
                        )}
                        {candidate.flagStatus === "Cleared" && (
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Cleared
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-slate-500">{candidate.role} • {candidate.declineCount} Qualifying Declines</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setExpandedId(expandedId === candidate.id ? null : candidate.id)}
                    className="gap-2 text-slate-600"
                  >
                    View History <ChevronDown className={`w-4 h-4 transition-transform ${expandedId === candidate.id ? "rotate-180" : ""}`} />
                  </Button>
                </div>

                {/* Expanded History */}
                {expandedId === candidate.id && (
                  <div className="border-t border-slate-100 bg-slate-50 p-5 space-y-4 animate-in slide-in-from-top-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Decline History
                    </h4>
                    <div className="space-y-3">
                      {candidate.declineHistory.map((history, i) => (
                        <div key={i} className="flex justify-between items-start bg-white p-3 rounded-lg border border-slate-200 text-sm">
                          <div>
                            <p className="font-medium text-slate-900">{history.employer}</p>
                            <p className="text-slate-500 text-xs mt-0.5">Reason: {history.reason}</p>
                          </div>
                          <span className="text-xs text-slate-400">{history.date}</span>
                        </div>
                      ))}
                    </div>

                    {/* Admin Notes Display */}
                    {candidate.adminNotes && (
                      <div className="rounded-lg border border-primary-100 bg-primary-50 p-3 text-sm text-primary-800">
                        <p className="font-medium mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Admin Notes:</p>
                        {candidate.adminNotes}
                      </div>
                    )}

                    {/* Admin Actions */}
                    {candidate.flagStatus === "Flagged" && (
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => { setActionModalId(candidate.id); setActionType("clear"); }}
                        >
                          <ShieldCheck className="w-4 h-4 mr-1" /> Clear Flag
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => { setActionModalId(candidate.id); setActionType("annotate"); }}
                        >
                          <FileText className="w-4 h-4 mr-1" /> Add Note / Investigate
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Action Modal */}
      {actionModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {actionType === "clear" ? "Clear Candidate Flag" : "Add Investigation Note"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">Provide a justification for the audit trail.</p>
            </div>
            <div className="p-6">
              <textarea 
                rows={4} 
                value={adminNotes} 
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                placeholder={actionType === "clear" ? "e.g. Candidate provided valid medical reasons. Flag cleared." : "e.g. Contacted candidate, awaiting response."}
              />
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <Button variant="outline" onClick={() => setActionModalId(null)}>Cancel</Button>
              <Button 
                onClick={handleAction} 
                disabled={!adminNotes}
                variant={actionType === "clear" ? "primary" : "outline"}
              >
                Save Action
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}