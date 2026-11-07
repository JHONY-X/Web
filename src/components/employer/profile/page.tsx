"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { organizationService, OrganizationProfile } from "@/lib/api/services/organization";
import { Building2, ShieldCheck, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await organizationService.getOrganizationProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading || !profile) {
    return (
      <DashboardLayout role="employer">
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-64 bg-slate-200 rounded-xl"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="employer">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Organization Profile</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your company details and verification status.</p>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </div>

        {/* Verification Status Banner */}
        <div className={`p-4 rounded-xl border flex items-start gap-4 ${
          profile.status === "Active" ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"
        }`}>
          <div className={`p-2 rounded-full ${
            profile.status === "Active" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
          }`}>
            {profile.status === "Active" ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>
          <div>
            <h3 className={`font-semibold ${
              profile.status === "Active" ? "text-emerald-900" : "text-amber-900"
            }`}>
              Account Status: {profile.status}
            </h3>
            <p className={`text-sm mt-1 ${
              profile.status === "Active" ? "text-emerald-700" : "text-amber-700"
            }`}>
              {profile.status === "Active" 
                ? "Your organization is fully verified. You can now search for candidates and request interviews." 
                : "Your documents are currently under review by Rohobot administration. This usually takes 1-2 business days."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-600" /> Organization Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Organization Name</p>
                  <p className="font-medium text-slate-900">{profile.name}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Type</p>
                  <p className="font-medium text-slate-900">{profile.type}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Location</p>
                  <p className="font-medium text-slate-900">{profile.location}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Contact Email</p>
                  <p className="font-medium text-slate-900">{profile.contactEmail}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Phone Number</p>
                  <p className="font-medium text-slate-900">{profile.contactPhone}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary-600" /> Authorized Representative
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Full Name</p>
                  <p className="font-medium text-slate-900">{profile.representativeName}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Phone</p>
                  <p className="font-medium text-slate-900">{profile.representativePhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Documents & Subscription */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-3">Uploaded Documents</h3>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <FileText className="w-8 h-8 text-primary-500" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-slate-900 truncate">{profile.licenseDocumentName}</p>
                  <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-3">Subscription</h3>
              <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-sm font-medium text-primary-900">{profile.subscriptionTier} Package</p>
                <p className="text-xs text-primary-700 mt-1">Active until Dec 31, 2024</p>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">Manage Subscription</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}