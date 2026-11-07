"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { candidateService, CandidateProfile, AvailabilityStatus } from "@/lib/api/services/candidate";
import { User, ShieldCheck, FileText, CheckCircle2, Clock, AlertCircle, Edit3, Save, Briefcase } from "lucide-react";

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await candidateService.getMyProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAvailabilityChange = async (newStatus: AvailabilityStatus) => {
    if (!profile) return;
    setIsUpdatingAvailability(true);
    try {
      await candidateService.updateAvailability(newStatus);
      setProfile({ ...profile, availability: newStatus });
    } catch (error) {
      alert("Failed to update availability.");
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <DashboardLayout role="candidate">
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-64 bg-slate-200 rounded-xl"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="candidate">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your professional information and availability.</p>
          </div>
          <Button variant="outline" className="gap-2"><Edit3 className="w-4 h-4" /> Edit Profile</Button>
        </div>

        {/* Verification Status Banner */}
        <div className={`p-4 rounded-xl border flex items-start gap-4 ${
          profile.status === "Verified" ? "bg-emerald-50 border-emerald-200" : 
          profile.status === "Rejected" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
        }`}>
          <div className={`p-2 rounded-full ${
            profile.status === "Verified" ? "bg-emerald-100 text-emerald-600" : 
            profile.status === "Rejected" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
          }`}>
            {profile.status === "Verified" ? <CheckCircle2 className="w-5 h-5" /> : 
             profile.status === "Rejected" ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>
          <div>
            <h3 className={`font-semibold ${
              profile.status === "Verified" ? "text-emerald-900" : 
              profile.status === "Rejected" ? "text-red-900" : "text-amber-900"
            }`}>
              Profile Status: {profile.status}
            </h3>
            <p className={`text-sm mt-1 ${
              profile.status === "Verified" ? "text-emerald-700" : 
              profile.status === "Rejected" ? "text-red-700" : "text-amber-700"
            }`}>
              {profile.status === "Verified" ? "Your profile is fully verified and visible to employers." : 
               profile.status === "Rejected" ? "Your documents were rejected. Please re-upload valid credentials." : 
               "Your documents are under review by Rohobot administration. This usually takes 1-2 business days."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" /> Personal & Professional Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Full Name</p>
                  <p className="font-medium text-slate-900">{profile.fullName}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Professional Category</p>
                  <p className="font-medium text-slate-900">{profile.professionalCategory}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Qualification</p>
                  <p className="font-medium text-slate-900">{profile.qualificationLevel}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Experience</p>
                  <p className="font-medium text-slate-900">{profile.yearsOfExperience} Years</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <p className="text-slate-500 mb-1">Professional Summary</p>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">&quot;{profile.professionalSummary}&quot;</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-600" /> Employment Preferences
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Preferred Location</p>
                  <p className="font-medium text-slate-900">{profile.preferredLocation}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Work Arrangement</p>
                  <p className="font-medium text-slate-900">{profile.preferredWorkArrangement}</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <p className="text-slate-500 mb-1">Notes</p>
                  <p className="text-slate-700">{profile.employmentPreferences}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Availability & Docs */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-600" /> Current Availability
              </h3>
              <select 
                value={profile.availability}
                onChange={(e) => handleAvailabilityChange(e.target.value as AvailabilityStatus)}
                disabled={isUpdatingAvailability}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 text-sm mb-2"
              >
                <option value="Immediate">Immediate</option>
                <option value="1 Week">1 Week</option>
                <option value="1 Month">1 Month</option>
                <option value="Not Available">Not Available</option>
              </select>
              {isUpdatingAvailability && <p className="text-xs text-primary-600">Updating...</p>}
              <p className="text-xs text-slate-500 mt-2">Employers use this to filter candidates.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-3">My Documents</h3>
              <div className="space-y-2">
                {profile.documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <FileText className="w-5 h-5 text-primary-500" />
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                      <p className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">Upload New Document</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}