"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Briefcase, UploadCloud, CheckCircle2, ChevronRight, ChevronLeft, AlertCircle, Plus, Trash2, X } from "lucide-react";

type WorkExperience = {
  jobPosition: string;
  organization: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  experienceLetter?: string;
};

export default function CandidateOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasExperience, setHasExperience] = useState(false);
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);

  const [profile, setProfile] = useState({
    // Personal
    gender: "", dateOfBirth: "",
    profilePhoto: null as File | null,
    // Professional
    professionalCategory: "", qualificationLevels: [] as string[],
    currentLocation: "", preferredLocation: "",
    availability: "Immediate", employmentPreference: "",
    // Documents
    educationCertificates: [] as File[],
    professionalLicenses: [] as File[],
    nationalIdFront: null as File | null,
    nationalIdBack: null as File | null,
    // Consent
    consentGiven: false,
  });

  const updateForm = (field: keyof typeof profile, value: (typeof profile)[keyof typeof profile]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const n = {...prev}; delete n[field]; return n; });
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!profile.gender) newErrors.gender = "Gender is required.";
      if (!profile.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required.";
      if (!profile.profilePhoto) newErrors.profilePhoto = "Profile photo is required.";
    }
    if (currentStep === 2) {
      if (!profile.professionalCategory) newErrors.professionalCategory = "Category is required.";
      if (profile.qualificationLevels.length === 0) newErrors.qualificationLevels = "Select at least one qualification.";
      if (!profile.currentLocation) newErrors.currentLocation = "Current location is required.";
      if (hasExperience && experiences.length === 0) newErrors.experience = "Please add at least one work experience.";
    }
    if (currentStep === 3) {
      if (profile.educationCertificates.length === 0) newErrors.educationCertificates = "At least one education certificate is required.";
      if (profile.professionalLicenses.length === 0) newErrors.professionalLicenses = "At least one professional license is required.";
      if (!profile.nationalIdFront) newErrors.nationalIdFront = "National ID (front) is required.";
      if (!profile.nationalIdBack) newErrors.nationalIdBack = "National ID (back) is required.";
    }
    if (currentStep === 4) {
      if (!profile.consentGiven) newErrors.consentGiven = "You must agree to submit.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep()) setCurrentStep(p => Math.min(p + 1, 4)); };
  const handleBack = () => setCurrentStep(p => Math.max(p - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    // In production: submit to API + upload files
    setIsSubmitting(false);
    alert("Profile submitted for admin approval!");
    router.push("/candidate/profile");
  };

  const addExperience = () => setExperiences([...experiences, { jobPosition: "", organization: "", employmentType: "Full-time", location: "", startDate: "", endDate: "", isPresent: false }]);
  const updateExperience = <K extends keyof WorkExperience,>(idx: number, field: K, value: WorkExperience[K]) => {
    setExperiences(prev => prev.map((exp, i) => i === idx ? { ...exp, [field]: value } : exp));
  };
  const removeExperience = (idx: number) => setExperiences(prev => prev.filter((_, i) => i !== idx));

  // File input helper
  const renderFileInput = ({ label, field, error }: { label: string, field: keyof typeof profile, error?: string }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label} *</label>
      <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition-colors ${error ? "border-red-300 bg-red-50" : "border-slate-300"}`}>
        <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
        <span className="text-xs text-slate-500">{(profile[field] as File | null)?.name || "Click to upload"}</span>
        <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => updateForm(field, e.target.files?.[0] || null)} />
      </label>
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  );

  const renderMultiFileInput = ({
    label,
    field,
    error,
  }: {
    label: string;
    field: "educationCertificates" | "professionalLicenses";
    error?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label} *</label>
      <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition-colors ${error ? "border-red-300 bg-red-50" : "border-slate-300"}`}>
        <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
        <span className="text-xs text-slate-500">Click to add one or more files</span>
        <input
          type="file"
          multiple
          className="hidden"
          accept="image/*,.pdf"
          onChange={event => {
            const files = Array.from(event.target.files ?? []);
            if (files.length > 0) {
              setProfile(previous => ({ ...previous, [field]: [...previous[field], ...files] }));
              setErrors(previous => {
                const next = { ...previous };
                delete next[field];
                return next;
              });
            }
            event.target.value = "";
          }}
        />
      </label>
      {profile[field].length > 0 && (
        <ul className="mt-2 space-y-1">
          {profile[field].map((file, index) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`} className="flex items-center justify-between gap-2 rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-700">
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => setProfile(previous => ({
                  ...previous,
                  [field]: previous[field].filter((_, fileIndex) => fileIndex !== index),
                }))}
                className="shrink-0 text-slate-500 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  );

  return (
    <DashboardLayout role="candidate">
      <div className="max-w-3xl mx-auto py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Complete Your Profile</h1>
          <p className="text-slate-500 mt-2">Fill all required details for admin verification.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {["Personal", "Professional", "Documents", "Submit"].map((title, i) => {
            const step = i + 1;
            const isActive = currentStep === step;
            const isDone = currentStep > step;
            return (
              <div key={title} className="flex flex-col items-center gap-1 flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-sm font-bold ${
                  isActive ? "border-primary-600 bg-primary-50 text-primary-600" : isDone ? "border-primary-600 bg-primary-600 text-white" : "border-slate-200 text-slate-400"
                }`}>{isDone ? <CheckCircle2 className="w-4 h-4" /> : step}</div>
                <span className={`text-xs font-medium ${isActive ? "text-primary-700" : "text-slate-500"}`}>{title}</span>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-5">
          
          {/* STEP 1: Personal */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-xl font-semibold border-b pb-3">Personal Information</h2>
              {renderFileInput({ label: "Profile Photo", field: "profilePhoto", error: errors.profilePhoto })}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Gender *</label>
                  <select value={profile.gender} onChange={e => updateForm("gender", e.target.value)} className={`w-full px-3 py-2 border rounded-lg ${errors.gender ? "border-red-500" : "border-slate-300"}`}>
                    <option value="">Select...</option><option>Male</option><option>Female</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                  <input type="date" value={profile.dateOfBirth} onChange={e => updateForm("dateOfBirth", e.target.value)} className={`w-full px-3 py-2 border rounded-lg ${errors.dateOfBirth ? "border-red-500" : "border-slate-300"}`} />
                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Professional */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-xl font-semibold border-b pb-3">Professional Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Professional Category *</label>
                  <select value={profile.professionalCategory} onChange={e => updateForm("professionalCategory", e.target.value)} className={`w-full px-3 py-2 border rounded-lg ${errors.professionalCategory ? "border-red-500" : "border-slate-300"}`}>
                    <option value="">Select...</option><option>Registered Nurse</option><option>Midwife</option><option>Lab Technician</option><option>Physician</option><option>Other</option>
                  </select>
                  {errors.professionalCategory && <p className="text-red-500 text-xs mt-1">{errors.professionalCategory}</p>}
                </div>
                <div>
                  <fieldset>
                    <legend className="block text-sm font-medium mb-1">Qualification Level * <span className="font-normal text-slate-500">(select all that apply)</span></legend>
                    <div className={`space-y-2 rounded-lg border p-3 ${errors.qualificationLevels ? "border-red-500" : "border-slate-300"}`}>
                      {["Diploma", "BSc Degree", "MSc / MD"].map(qualification => (
                        <label key={qualification} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={profile.qualificationLevels.includes(qualification)}
                            onChange={event => {
                              const qualifications = event.target.checked
                                ? [...profile.qualificationLevels, qualification]
                                : profile.qualificationLevels.filter(item => item !== qualification);
                              updateForm("qualificationLevels", qualifications);
                            }}
                          />
                          {qualification}
                        </label>
                      ))}
                    </div>
                    {errors.qualificationLevels && <p className="text-red-500 text-xs mt-1">{errors.qualificationLevels}</p>}
                  </fieldset>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Location *</label>
                  <input value={profile.currentLocation} onChange={e => updateForm("currentLocation", e.target.value)} className={`w-full px-3 py-2 border rounded-lg ${errors.currentLocation ? "border-red-500" : "border-slate-300"}`} />
                  {errors.currentLocation && <p className="text-red-500 text-xs mt-1">{errors.currentLocation}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Location (Optional)</label>
                  <input value={profile.preferredLocation} onChange={e => updateForm("preferredLocation", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Availability *</label>
                  <select value={profile.availability} onChange={e => updateForm("availability", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                    <option>Immediate</option><option>1 Week</option><option>1 Month</option><option>Not Available</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Employment Preference</label>
                  <select value={profile.employmentPreference} onChange={e => updateForm("employmentPreference", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                    <option value="">Select...</option><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Shift Work</option>
                  </select>
                </div>
              </div>

              {/* Work Experience Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Work Experience</h3>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={hasExperience} onChange={() => setHasExperience(true)} /> Yes, I have experience</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={!hasExperience} onChange={() => { setHasExperience(false); setExperiences([]); }} /> No experience</label>
                </div>

                {hasExperience && (
                  <div className="space-y-4">
                    {experiences.map((exp, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg relative">
                        <button onClick={() => removeExperience(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        <div className="grid grid-cols-2 gap-3">
                          <input placeholder="Job Position" value={exp.jobPosition} onChange={e => updateExperience(idx, "jobPosition", e.target.value)} className="px-2 py-1.5 border rounded text-sm" />
                          <input placeholder="Organization" value={exp.organization} onChange={e => updateExperience(idx, "organization", e.target.value)} className="px-2 py-1.5 border rounded text-sm" />
                          <select value={exp.employmentType} onChange={e => updateExperience(idx, "employmentType", e.target.value)} className="px-2 py-1.5 border rounded text-sm bg-white">
                            <option>Full-time</option><option>Part-time</option><option>Contract</option>
                          </select>
                          <input placeholder="Location" value={exp.location} onChange={e => updateExperience(idx, "location", e.target.value)} className="px-2 py-1.5 border rounded text-sm" />
                          <input type="date" value={exp.startDate} onChange={e => updateExperience(idx, "startDate", e.target.value)} className="px-2 py-1.5 border rounded text-sm" />
                          <div className="flex items-center gap-2">
                            <input type="date" disabled={exp.isPresent} value={exp.endDate} onChange={e => updateExperience(idx, "endDate", e.target.value)} className="px-2 py-1.5 border rounded text-sm flex-1" />
                            <label className="text-xs flex items-center gap-1 whitespace-nowrap"><input type="checkbox" checked={exp.isPresent} onChange={e => updateExperience(idx, "isPresent", e.target.checked)} /> Present</label>
                          </div>
                        </div>
                        <div className="mt-2">
                          <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                            <UploadCloud className="w-3 h-3" /> Upload Experience Letter (Optional)
                            <input type="file" className="hidden" />
                          </label>
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addExperience} className="gap-1"><Plus className="w-3 h-3" /> Add Experience</Button>
                    {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Documents */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-xl font-semibold border-b pb-3">Required Documents</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderMultiFileInput({ label: "Education Certificates", field: "educationCertificates", error: errors.educationCertificates })}
                {renderMultiFileInput({ label: "Professional Licences", field: "professionalLicenses", error: errors.professionalLicenses })}
                {renderFileInput({ label: "National ID (Front)", field: "nationalIdFront", error: errors.nationalIdFront })}
                {renderFileInput({ label: "National ID (Back)", field: "nationalIdBack", error: errors.nationalIdBack })}
              </div>
            </div>
          )}

          {/* STEP 4: Consent */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-xl font-semibold border-b pb-3">Review & Submit</h2>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <p className="font-medium mb-1">Privacy Notice</p>
                <p>Your documents will be reviewed by Rohobot admin only. Approved profiles become visible to employers.</p>
              </div>
              <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer ${errors.consentGiven ? "border-red-300 bg-red-50" : "border-slate-200 hover:bg-slate-50"}`}>
                <input type="checkbox" checked={profile.consentGiven} onChange={e => updateForm("consentGiven", e.target.checked)} className="mt-1 w-4 h-4 text-primary-600" />
                <span className="text-sm text-slate-700">I confirm all information is accurate and I consent to the collection, storage, and verification of my data.</span>
              </label>
              {errors.consentGiven && <p className="text-red-500 text-xs">{errors.consentGiven}</p>}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
            {currentStep < 4 ? (
              <Button onClick={handleNext}>Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
            ) : (
              <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!profile.consentGiven}>Submit Profile</Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}