"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card"; // We will build this next
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function CandidateOverviewPage() {
  const [candidateName, setCandidateName] = useState("candidate");

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load candidate account.");
        return (await response.json()) as { account: { name: string } };
      })
      .then(({ account }) => {
        if (active) setCandidateName(account.name);
      })
      .catch((error: unknown) => {
        if (active) console.error("Could not load candidate account.", error);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardLayout role="candidate">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, {candidateName}
          </h1>
          <p className="text-slate-500 mt-1">
            Complete your candidate profile and review your recruitment activity.
          </p>
        </div>

        <div role="note" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Local demo account: activity and dashboard figures below are sample data.
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 flex items-start gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Profile Completion
              </p>
              <p className="text-2xl font-bold text-slate-900">75%</p>
              <p className="text-xs text-amber-600 mt-1">Missing: Documents</p>
            </div>
          </Card>

          <Card className="p-5 flex items-start gap-4">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Upcoming Interviews
              </p>
              <p className="text-2xl font-bold text-slate-900">2</p>
              <p className="text-xs text-primary-600 mt-1">
                Next: Tomorrow, 10 AM
              </p>
            </div>
          </Card>

          <Card className="p-5 flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Verification Status
              </p>
              <p className="text-2xl font-bold text-slate-900">Pending</p>
              <p className="text-xs text-slate-500 mt-1">
                Under review by Rohobot
              </p>
            </div>
          </Card>
        </div>
        <div className="flex justify-end">
          <Link href="/candidate/onboarding">
            <Button className="gap-2">
              Complete Onboarding Wizard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Action Center */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Action Required
            </h2>
            <div className="space-y-4">
              <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium text-amber-900">
                    Upload Professional License
                  </p>
                  <p className="text-sm text-amber-700">
                    Required to complete verification.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="bg-white">
                  Upload
                </Button>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900">
                    Update Availability
                  </p>
                  <p className="text-sm text-slate-500">
                    Keep your status current for employers.
                  </p>
                </div>
                <Button variant="secondary" size="sm">
                  Update
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Interview Invitation
                    </p>
                    <p className="text-xs text-slate-500">
                      St. Gabriel General Hospital
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                    Pending
                  </span>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-primary-600">
              View All Activity <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
