"use client";

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
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CheckSquare,
  FileText,
} from "lucide-react";
import { FeedbackFormModal } from "@/components/employer/FeedbackFormModal";
import type { FeedbackInterviewData } from "@/components/employer/FeedbackFormModal";
import { feedbackService } from "@/lib/api/services/feedback";

export default function EmployerInterviewsPage() {
  const [interviews, setInterviews] = useState<InterviewRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackModalData, setFeedbackModalData] =
    useState<FeedbackInterviewData | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchInterviews = async () => {
    setIsLoading(true);
    const data = await interviewService.getEmployerInterviews();
    setInterviews(data);
    setIsLoading(false);
  };

  useEffect(() => {
    let active = true;
    interviewService.getEmployerInterviews().then((data) => {
      if (!active) return;
      setInterviews(data);
      setIsLoading(false);
    }).catch((error: unknown) => {
      if (!active) return;
      console.error("Failed to load employer interviews.", error);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const handleComplete = async (id: string) => {
    if (!confirm("Mark this interview as completed?")) return;
    setProcessingId(id);
    await interviewService.markAsCompleted(id);
    await fetchInterviews();
    setProcessingId(null);
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
          <h1 className="text-2xl font-bold text-slate-900">
            Interview Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track your interview requests and candidate responses.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6"
            >
              <div className="flex-1 space-y-4">
                <div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      interview.status === "Pending"
                        ? "bg-amber-100 text-amber-700"
                        : interview.status === "Accepted"
                          ? "bg-emerald-100 text-emerald-700"
                          : interview.status === "Rescheduling Requested"
                            ? "bg-primary-100 text-primary-800"
                            : interview.status === "Completed"
                              ? "bg-slate-800 text-white"
                              : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {interview.status}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">
                    {interview.positionTitle}
                  </h2>
                  <p className="text-sm text-primary-600 font-medium flex items-center gap-1 mt-1">
                    <User className="w-4 h-4" /> {interview.candidateName}
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

                {/* Candidate Reschedule Request Alert */}
                {interview.status === "Rescheduling Requested" && (
                  <div className="flex flex-col gap-2 rounded-lg border border-primary-200 bg-primary-50 p-4">
                    <div className="flex items-center gap-2 font-semibold text-primary-900">
                      <AlertCircle className="w-4 h-4" /> Candidate Requested
                      Reschedule
                    </div>
                    <p className="text-sm text-primary-800">
                      <strong>Reason:</strong> {interview.rescheduleReason}
                    </p>
                    <p className="text-sm text-primary-800">
                      <strong>Proposed Date:</strong>{" "}
                      {interview.proposedNewDate}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        className="bg-accent-600 text-white hover:bg-accent-700"
                      >
                        Approve New Time
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white">
                        Decline & Keep Original
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="md:w-48 flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                {interview.status === "Pending" && (
                  <div className="text-center p-3 rounded-lg bg-amber-50 text-amber-700">
                    <Clock className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-sm font-medium">Awaiting Candidate</p>
                  </div>
                )}
                {interview.status === "Accepted" && (
                  <>
                    <div className="text-center p-3 rounded-lg bg-emerald-50 text-emerald-700 mb-2">
                      <CheckCircle2 className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm font-medium">Accepted</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleComplete(interview.id)}
                      isLoading={processingId === interview.id}
                      className="w-full"
                    >
                      <CheckSquare className="w-4 h-4 mr-2" /> Mark Completed
                    </Button>
                  </>
                )}
                {interview.status === "Completed" && (
                  <div className="space-y-2">
                    <div className="text-center p-3 rounded-lg bg-slate-100 text-slate-700">
                      <CheckSquare className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm font-medium">Completed</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        setFeedbackModalData({
                          interviewId: interview.id,
                          candidateId: interview.candidateId,
                          candidateName: interview.candidateName,
                          employerName: interview.employerName,
                          positionTitle: interview.positionTitle,
                          interviewDate: interview.date,
                        })
                      }
                    >
                      <FileText className="w-4 h-4 mr-2" /> Submit Feedback
                    </Button>
                  </div>
                )}
                {feedbackModalData && (
                  <FeedbackFormModal
                    isOpen={!!feedbackModalData}
                    onClose={() => setFeedbackModalData(null)}
                    interviewData={feedbackModalData}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
