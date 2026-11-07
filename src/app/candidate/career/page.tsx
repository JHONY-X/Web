"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { careerService, TrainingResource, CandidateCertificate, SkillsGap } from "@/lib/api/services/career";
import { BookOpen, Award, Sparkles, TrendingUp, PlayCircle, FileText, CheckCircle2 } from "lucide-react";

export default function CandidateCareerPage() {
  const [resources, setResources] = useState<TrainingResource[]>([]);
  const [certificates, setCertificates] = useState<CandidateCertificate[]>([]);
  const [gaps, setGaps] = useState<SkillsGap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const [res, certs, skillGaps] = await Promise.all([
      careerService.getTrainingResources(),
      careerService.getMyCertificates(),
      careerService.getSkillsGapRecommendations()
    ]);
    setResources(res);
    setCertificates(certs);
    setGaps(skillGaps);
    setIsLoading(false);
  };

  useEffect(() => {
    let active = true;
    Promise.all([
      careerService.getTrainingResources(),
      careerService.getMyCertificates(),
      careerService.getSkillsGapRecommendations(),
    ]).then(([resources, certificates, skillsGap]) => {
      if (!active) return;
      setResources(resources);
      setCertificates(certificates);
      setGaps(skillsGap);
      setIsLoading(false);
    }).catch((error: unknown) => {
      if (!active) return;
      console.error("Failed to load career resources.", error);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    await careerService.enrollInCourse(courseId);
    await fetchData(); // Refresh certificates
    setEnrollingId(null);
  };

  if (isLoading) {
    return <DashboardLayout role="candidate"><div className="p-8 text-slate-500 animate-pulse">Analyzing your profile...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout role="candidate">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary-600" /> Career Development
          </h1>
          <p className="text-slate-500 text-sm mt-1">Grow your skills, earn certificates, and get matched with better opportunities.</p>
        </div>

        {/* AI Recommendations (Skills Gap) */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-semibold">Personalized Recommendations</h2>
          </div>
          <p className="text-primary-100 text-sm mb-6 max-w-2xl">
            Based on your profile and recent employer feedback, Rohobot recommends the following training to boost your matching score.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gaps.map((gap, i) => {
              const course = resources.find(c => c.id === gap.recommendedCourseId);
              if (!course) return null;
              return (
                <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-300 uppercase tracking-wide mb-1">Skill Gap: {gap.skillName}</p>
                  <p className="text-sm text-primary-50 mb-3">{gap.reason}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="font-medium text-white text-sm">{course.title}</p>
                      <p className="text-xs text-primary-200">{course.duration} • {course.provider}</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-white text-primary-900 hover:bg-primary-50 shrink-0"
                      onClick={() => handleEnroll(course.id)}
                      isLoading={enrollingId === course.id}
                    >
                      Enroll
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Course Catalog */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600" /> Training Library
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resources.map((course) => (
                <div key={course.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-primary-300 transition-colors flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      {course.category}
                    </span>
                    {course.isRohobotOfficial && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Official
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 mt-2">{course.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex-1">{course.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500">{course.duration}</span>
                    <Button size="sm" variant="outline" onClick={() => handleEnroll(course.id)} isLoading={enrollingId === course.id}>
                      <PlayCircle className="w-4 h-4 mr-1" /> Start
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Certificates Sidebar */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-600" /> My Certificates
            </h2>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className={`p-2 rounded-full ${cert.status === "Completed" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                    {cert.status === "Completed" ? <Award className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{cert.courseName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{cert.status} • {cert.issueDate}</p>
                  </div>
                </div>
              ))}
              {certificates.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No certificates yet. Start learning!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}