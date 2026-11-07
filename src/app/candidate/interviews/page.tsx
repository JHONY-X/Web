"use client";
import { daysFromNow } from "@/lib/date";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import {
  interviewService,
  InterviewRequest,
} from "@/lib/api/services/interview";
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Check,
  X,
  FileText,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function CandidateInterviewsPage() {
  const [interviews, setInterviews] = useState<InterviewRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  // decline modal state
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  // Reschedule Modal State
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [proposedDate, setProposedDate] = useState("");

  const fetchInterviews = async () => {
    setIsLoading(true);
    const data = await interviewService.getCandidateInterviews();
    setInterviews(data);
    setIsLoading(false);
  };

  useEffect(() => {
    let active = true;
    interviewService.getCandidateInterviews().then((data) => {
      if (!active) return;
      setInterviews(data);
      setIsLoading(false);
    }).catch((error: unknown) => {
      if (!active) return;
      console.error("Failed to load candidate interviews.", error);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const handleRespond = async (id: string, status: "Accepted" | "Declined") => {
    setProcessingId(id);
    await interviewService.respondToInterview(id, status);
    await fetchInterviews();
    setProcessingId(null);
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleId || !rescheduleReason || !proposedDate) return;
    setProcessingId(rescheduleId);
    await interviewService.requestReschedule(
      rescheduleId,
      rescheduleReason,
      proposedDate,
    );
    await fetchInterviews();
    setRescheduleId(null);
    setRescheduleReason("");
    setProposedDate("");
    setProcessingId(null);
  };

  if (isLoading) {
    return (
      <DashboardLayout role="candidate">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-40 bg-slate-200 rounded-xl"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="candidate">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Interviews</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your interview invitations and schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6"
            >
              {/* Left: Job Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        interview.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : interview.status === "Accepted"
                            ? "bg-emerald-100 text-emerald-700"
                            : interview.status === "Rescheduling Requested"
                              ? "bg-primary-100 text-primary-800"
                              : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {interview.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {interview.positionTitle}
                  </h2>
                  <p className="text-sm text-primary-600 font-medium flex items-center gap-1 mt-1">
                    <Building2 className="w-4 h-4" /> {interview.employerName}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />{" "}
                    {interview.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />{" "}
                    {interview.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />{" "}
                    {interview.location}
                  </div>
                </div>

                {interview.notes && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex gap-2 items-start">
                    <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                    <p className="text-sm text-slate-600">{interview.notes}</p>
                  </div>
                )}

                {/* Show reschedule reason if applicable */}
                {interview.status === "Rescheduling Requested" && (
                  <div className="flex items-start gap-2 rounded-lg border border-primary-100 bg-primary-50 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 text-primary-600" />
                    <div>
                      <p className="text-xs font-semibold text-primary-900">
                        Reschedule Pending
                      </p>
                      <p className="mt-1 text-xs text-primary-800">
                        Reason: {interview.rescheduleReason}
                      </p>
                      <p className="text-xs text-primary-800">
                        Proposed Date: {interview.proposedNewDate}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Actions */}
              <div className="md:w-48 flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                {interview.status === "Pending" && (
                  <>
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleRespond(interview.id, "Accepted")}
                      isLoading={processingId === interview.id}
                    >
                      <Check className="w-4 h-4 mr-2" /> Accept
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setDeclineId(interview.id)} // Open modal instead of direct action
                    >
                      <X className="w-4 h-4 mr-2" /> Decline
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-slate-600"
                      onClick={() => setRescheduleId(interview.id)}
                      disabled={processingId === interview.id}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" /> Reschedule
                    </Button>
                  </>
                )}

                {interview.status === "Accepted" && (
                  <div className="text-center p-3 rounded-lg bg-emerald-50 text-emerald-700">
                    <CheckCircle2 className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-sm font-medium">Confirmed</p>
                  </div>
                )}

                {interview.status === "Declined" && (
                  <div className="text-center p-3 rounded-lg bg-slate-50 text-slate-600">
                    <XCircle className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-sm font-medium">Declined</p>
                  </div>
                )}

                {interview.status === "Rescheduling Requested" && (
                  <div className="rounded-lg bg-primary-50 p-3 text-center text-primary-800">
                    <RefreshCw className="w-6 h-6 mx-auto mb-1 animate-spin-slow" />
                    <p className="text-sm font-medium">Awaiting Employer</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                Request Reschedule
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Provide a reason and a proposed alternative time.
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Reason for Rescheduling *
                </label>
                <textarea
                  rows={3}
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                  placeholder="e.g. I have an emergency shift at my current job."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Proposed New Date *
                </label>
                <input
                  type="date"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <Button variant="outline" onClick={() => setRescheduleId(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleRescheduleSubmit}
                disabled={
                  !rescheduleReason ||
                  !proposedDate ||
                  processingId === rescheduleId
                }
                isLoading={processingId === rescheduleId}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      )}
            {/* Decline Modal */}
      {declineId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Decline Invitation</h2>
              <p className="text-sm text-slate-500 mt-1">Please provide a reason. This is required by Rohobot policy to ensure fair matching.</p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Declining *</label>
              <textarea 
                rows={3} 
                value={declineReason} 
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                placeholder="e.g. Accepted another offer, salary expectations, location too far..."
              />
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <Button variant="outline" onClick={() => setDeclineId(null)}>Cancel</Button>
              <Button 
                variant="danger"
                onClick={async () => {
                  if (!declineId || !declineReason) return;
                  await interviewService.respondToInterview(declineId, "Declined", declineReason);
                  setDeclineId(null);
                  setDeclineReason("");
                  fetchInterviews();
                }} 
                disabled={!declineReason}
              >
                Confirm Decline
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
