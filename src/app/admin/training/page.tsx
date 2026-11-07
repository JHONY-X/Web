"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { careerService, TrainingResource } from "@/lib/api/services/career";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { GraduationCap, Users, Award } from "lucide-react";

// Mock Analytics Data
const enrollmentData = [
  { course: "ICU & Critical Care", enrolled: 45, completed: 38 },
  { course: "Patient Communication", enrolled: 62, completed: 58 },
  { course: "Maternal Health", enrolled: 30, completed: 25 },
  { course: "Leadership", enrolled: 18, completed: 12 },
];

const COLORS = ["#0d9488", "#14b8a6", "#5eead4", "#ccfbf1"];

const outcomesData = [
  { name: "Employed within 30 days", value: 78 },
  { name: "Employed within 90 days", value: 15 },
  { name: "Still Seeking", value: 7 },
];

export default function AdminTrainingPage() {
  const [resources, setResources] = useState<TrainingResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await careerService.getTrainingResources();
      setResources(data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary-600" /> Training & Career Impact
          </h1>
          <p className="text-slate-500 text-sm mt-1">Measure how career development programs drive employment outcomes.</p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-lg"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-slate-500">Total Course Enrollments</p>
              <p className="text-2xl font-bold text-slate-900">155</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Award className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-slate-500">Certificates Issued</p>
              <p className="text-2xl font-bold text-slate-900">133</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><GraduationCap className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-slate-500">Completion Rate</p>
              <p className="text-2xl font-bold text-slate-900">85%</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Course Completion Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Course Enrollment vs Completion</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="course" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  <Bar dataKey="enrolled" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Enrolled" />
                  <Bar dataKey="completed" fill="#0d9488" radius={[4, 4, 0, 0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Employment Outcome Pie */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Employment Outcomes post-Training</h2>
            <div className="h-[300px] w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie data={outcomesData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {outcomesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {outcomesData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}