"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { candidateService, CandidateProfile } from "@/lib/api/services/candidate";
import { User, Briefcase, UploadCloud, CheckCircle2, ShieldCheck, ChevronRight, ChevronLeft } from "lucide-react";

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Professional Info", icon: Briefcase },
  { id: 3, title: "Documents", icon: UploadCloud },
  { id: 4, title: "Consent & Submit", icon: ShieldCheck },
];

const WORK_ARRANGEMENTS: CandidateProfile["preferredWorkArrangement"][] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Shift Work",
];

function isWorkArrangement(
  value: string
): value is CandidateProfile["preferredWorkArrangement"] {
  return WORK_ARRANGEMENTS.some((arrangement) => arrangement === value);
}

export default function CandidateOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  // Form State initialized with empty data
  const [profile, setProfile] = useState<CandidateProfile>({
    fullName: "", phone: "", email: "",
    professionalCategory: "", qualificationLevel: "",
    educationBackground: "", certifications: "",
    yearsOfExperience: 0, previousEmployment: "",
    professionalSummary: "", skills: [],
    currentLocation: "", preferredLocation: "",
    employmentPreferences: "", availability: "Immediate",
    preferredWorkArrangement: "Full-time",
    documents: [], consentGiven: false, status: "Pending Review",
  });

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load candidate account details.");
        return (await response.json()) as {
          account: { name: string; email: string };
        };
      })
      .then(({ account }) => {
        if (!active) return;
        setProfile((currentProfile) => ({
          ...currentProfile,
          fullName: currentProfile.fullName || account.name,
          email: currentProfile.email || account.email,
        }));
      })
      .catch((error: unknown) => {
        if (active) console.error("Could not load candidate account details.", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateForm = <K extends keyof CandidateProfile>(field: K, value: CandidateProfile[K]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError("");
    try {
      await candidateService.submitProfile(profile);
      router.push("/candidate");
    } catch (error) {
      console.error("Candidate demo profile submission failed.", error);
      setSubmissionError("Profile submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="candidate">
      <div className="max-w-3xl mx-auto py-8">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Complete Your Profile</h1>
          <p className="text-slate-500 mt-2">Submit your credentials for Rohobot verification.</p>
        </div>

        <div role="note" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Local demo only. Do not upload real identity, license, or other sensitive documents.
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full">
            <div className="h-full bg-primary-600 rounded-full transition-all duration-300" style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }} />
          </div>
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isActive ? "border-primary-600 bg-primary-50 text-primary-600" :
                  isCompleted ? "border-primary-600 bg-primary-600 text-white" :
                  "border-slate-200 bg-white text-slate-400"
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-primary-700" : "text-slate-500"}`}>{step.title}</span>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
          
          {/* STEP 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-semibold border-b border-slate-100 pb-3">Personal Information</h2>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <Button variant="outline" size="sm">Upload Photo</Button>
                  <p className="text-xs text-slate-500 mt-2">JPG or PNG, max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input type="text" value={profile.fullName} onChange={(e) => updateForm("fullName", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                  <input type="tel" value={profile.phone} onChange={(e) => updateForm("phone", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input type="email" value={profile.email} onChange={(e) => updateForm("email", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Location (City) *</label>
                  <input type="text" value={profile.currentLocation} onChange={(e) => updateForm("currentLocation", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Work Location *</label>
                  <input type="text" value={profile.preferredLocation} onChange={(e) => updateForm("preferredLocation", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Professional Info */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-semibold border-b border-slate-100 pb-3">Professional Background</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Professional Category *</label>
                  <select value={profile.professionalCategory} onChange={(e) => updateForm("professionalCategory", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500">
                    <option value="" disabled>Select...</option>
                    <option>Registered Nurse</option>
                    <option>Midwife</option>
                    <option>Lab Technician</option>
                    <option>Physician</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Qualification Level *</label>
                  <select value={profile.qualificationLevel} onChange={(e) => updateForm("qualificationLevel", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500">
                    <option value="" disabled>Select...</option>
                    <option>Diploma</option>
                    <option>BSc Degree</option>
                    <option>MSc / MD</option>
                  </select>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Education Background *</label>
                  <input type="text" placeholder="e.g. BSc in Nursing, Addis Ababa University (2018)" value={profile.educationBackground} onChange={(e) => updateForm("educationBackground", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Previous Employment *</label>
                  <input type="text" placeholder="e.g. St. Paul's Hospital (2019-2023)" value={profile.previousEmployment} onChange={(e) => updateForm("previousEmployment", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience *</label>
                  <input type="number" min="0" value={profile.yearsOfExperience} onChange={(e) => updateForm("yearsOfExperience", parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Work Arrangement</label>
                  <select
                    value={profile.preferredWorkArrangement}
                    onChange={(e) => {
                      if (isWorkArrangement(e.target.value)) {
                        updateForm("preferredWorkArrangement", e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Shift Work</option>
                  </select>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Professional Summary *</label>
                  <textarea rows={3} value={profile.professionalSummary} onChange={(e) => updateForm("professionalSummary", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Documents */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-semibold border-b border-slate-100 pb-3">Supporting Documents</h2>
              <p className="text-sm text-slate-500 mb-4">Document upload is not connected in this local demo. Do not upload or enter real identity or license information.</p>
              
              <div className="space-y-4">
                {["Educational Certificate", "Professional License", "Identification (ID/Passport)"].map((doc, i) => (
                  <div key={i} className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">{doc} upload preview</p>
                    <p className="text-xs text-slate-500 mt-1">File transfer is not available in this demo.</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Consent & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-semibold border-b border-slate-100 pb-3">Consent & Submission</h2>
              
              <div className="rounded-lg border border-primary-200 bg-primary-50 p-4 text-sm text-primary-800">
                <p className="font-medium mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Privacy Notice</p>
                <p>This local demo does not securely collect or store professional documents. Do not submit real personal information. Production data handling, consent, and privacy terms must be implemented and reviewed before launch.</p>
              </div>

              <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input type="checkbox" checked={profile.consentGiven} onChange={(e) => updateForm("consentGiven", e.target.checked)} className="mt-1 w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
                <span className="text-sm text-slate-700">I understand this is a local demo and will not submit real personal or sensitive information.</span>
              </label>
            </div>
          )}

          {/* Navigation */}
          {submissionError && <p role="alert" className="mt-6 text-sm text-red-700">{submissionError}</p>}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting} className="gap-2">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            
            {currentStep < 4 ? (
              <Button onClick={handleNext} className="gap-2">Next Step <ChevronRight className="w-4 h-4" /></Button>
            ) : (
              <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!profile.consentGiven} className="gap-2 bg-primary-600 hover:bg-primary-700">
                Submit Demo Profile <CheckCircle2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}