"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { analyticsService, AggregatedMetrics, DashboardFilters } from "@/lib/api/services/analytics";
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  Download,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#3e7451", "#588b65", "#e74770", "#e6a14f"];

export default function AdminMasterDashboard() {
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  
  // Filter State
  const [filters, setFilters] = useState<DashboardFilters>({
    category: "",
    location: "",
  });

  useEffect(() => {
    let active = true;

    analyticsService
      .getDashboardMetrics(filters)
      .then((data) => {
        if (!active) return;
        setMetrics(data);
        setLoadError("");
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error("Failed to load dashboard metrics.", error);
        setLoadError("Dashboard data could not be loaded. Please try again.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filters]);

  const updateFilters = (nextFilters: DashboardFilters) => {
    setIsLoading(true);
    setLoadError("");
    setFilters(nextFilters);
  };

  const retryLoading = () => {
    setIsLoading(true);
    setLoadError("");
    setFilters((currentFilters) => ({ ...currentFilters }));
  };

  const handleExportCSV = () => {
    if (!metrics) return;
    
    // Create CSV string
    const csvRows = [
      ["Metric", "Value"],
      ["Total Candidates", metrics.totalCandidates],
      ["Verified Candidates", metrics.verifiedCandidates],
      ["Pending Verifications", metrics.pendingVerifications],
      ["Total Employers", metrics.totalEmployers],
      ["Verified Employers", metrics.verifiedEmployers],
      ["Total Revenue (ETB)", metrics.totalRevenue],
      ["Interviews Sent", metrics.interviewsSent],
      ["Interviews Completed", metrics.interviewsCompleted],
      ["Placements Commenced", metrics.placementsCommenced],
      ["Flagged Candidates", metrics.flaggedCandidates],
    ];

    const csvContent = `\uFEFF${csvRows.map((row) => row.join(",")).join("\n")}`;
    const downloadUrl = URL.createObjectURL(
      new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    );
    const link = document.createElement("a");
    link.setAttribute("href", downloadUrl);
    link.setAttribute("download", `rohobot_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
  };

  if (loadError && !metrics) {
    return (
      <DashboardLayout role="admin">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-semibold text-red-900">Unable to load dashboard</h1>
          <p role="alert" className="mt-2 text-sm text-red-800">{loadError}</p>
          <Button className="mt-4" onClick={retryLoading}>Try again</Button>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading || !metrics) {
    return (
      <DashboardLayout role="admin">
        <div className="space-y-6 animate-pulse">
          <div className="h-10 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Demonstration dashboard: the current metrics use local sample data and are not operational reports.
        </div>
        {loadError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {loadError}
          </div>
        )}
        
        {/* Header & Controls */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Executive Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Platform performance, financials, and operational metrics.</p>
            <p className="text-xs text-slate-500 mt-1">
              Category and location filters apply to candidate metrics; other totals remain platform-wide.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select 
              value={filters.category}
              onChange={(e) => updateFilters({...filters, category: e.target.value})}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="">All Categories</option>
              <option value="Nursing">Nursing</option>
              <option value="Midwifery">Midwifery</option>
              <option value="Lab Tech">Lab Tech</option>
              <option value="Physician">Physician</option>
            </select>

            {/* Location Filter */}
            <select 
              value={filters.location}
              onChange={(e) => updateFilters({...filters, location: e.target.value})}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="">All Locations</option>
              <option value="Addis Ababa">Addis Ababa</option>
              <option value="Adama">Adama</option>
              <option value="Hawassa">Hawassa</option>
            </select>

            <Button variant="outline" onClick={handleExportCSV} className="gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>
        </div>

        {/* High-Level KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-lg bg-primary-50 text-primary-700"><Users className="w-5 h-5" /></div>
              <span className="text-xs font-medium text-primary-700 bg-primary-50 px-2 py-1 rounded-full">Sample</span>
            </div>
            <p className="text-sm text-slate-500 mt-4">Total Candidates</p>
            <p className="text-3xl font-bold text-slate-900">{metrics.totalCandidates.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">{metrics.verifiedCandidates.toLocaleString()} verified</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-lg bg-accent-50 text-accent-700"><Building2 className="w-5 h-5" /></div>
            </div>
            <p className="text-sm text-slate-500 mt-4">Registered Employers</p>
            <p className="text-3xl font-bold text-slate-900">{metrics.totalEmployers}</p>
            <p className="text-xs text-slate-400 mt-1">{metrics.verifiedEmployers} verified organizations</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
            </div>
            <p className="text-sm text-slate-500 mt-4">Total Revenue (ETB)</p>
            <p className="text-3xl font-bold text-slate-900">{metrics.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">From active subscriptions</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>
            </div>
            <p className="text-sm text-slate-500 mt-4">Action Required</p>
            <p className="text-3xl font-bold text-slate-900">{metrics.pendingVerifications + metrics.flaggedCandidates}</p>
            <p className="text-xs text-slate-400 mt-1">{metrics.pendingVerifications} verifications, {metrics.flaggedCandidates} flags</p>
          </div>
        </div>

        {/* Recruitment Funnel & Subscriptions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recruitment Funnel */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-600" /> Recruitment Activity
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Interviews Sent</p>
                <p className="text-xl font-bold text-slate-900">{metrics.interviewsSent}</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs text-emerald-600 mb-1">Accepted</p>
                <p className="text-xl font-bold text-emerald-700">{metrics.interviewsAccepted}</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-600 mb-1">Declined</p>
                <p className="text-xl font-bold text-red-700">{metrics.interviewsDeclined}</p>
              </div>
              <div className="text-center p-3 bg-primary-50 rounded-lg">
                <p className="text-xs text-primary-600 mb-1">Completed</p>
                <p className="text-xl font-bold text-primary-700">{metrics.interviewsCompleted}</p>
              </div>
            </div>
            
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: "Sent", value: metrics.interviewsSent },
                  { name: "Accepted", value: metrics.interviewsAccepted },
                  { name: "Completed", value: metrics.interviewsCompleted },
                  { name: "Placed", value: metrics.placementsCommenced },
                ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" fill="#3e7451" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subscription Breakdown */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Subscriptions</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 font-medium">Gold</span>
                  <span className="text-slate-900 font-bold">{metrics.activeSubscriptions.gold}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(metrics.activeSubscriptions.gold / (metrics.activeSubscriptions.gold + metrics.activeSubscriptions.silver + metrics.activeSubscriptions.basic)) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 font-medium">Silver</span>
                  <span className="text-slate-900 font-bold">{metrics.activeSubscriptions.silver}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-400 h-2 rounded-full" style={{ width: `${(metrics.activeSubscriptions.silver / (metrics.activeSubscriptions.gold + metrics.activeSubscriptions.silver + metrics.activeSubscriptions.basic)) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 font-medium">Basic</span>
                  <span className="text-slate-900 font-bold">{metrics.activeSubscriptions.basic}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-primary-300 h-2 rounded-full" style={{ width: `${(metrics.activeSubscriptions.basic / (metrics.activeSubscriptions.gold + metrics.activeSubscriptions.silver + metrics.activeSubscriptions.basic)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demographics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Category Split */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Professionals by Category</h2>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={metrics.categorySplit} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                    {metrics.categorySplit.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Location Split */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Geographic Distribution</h2>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.locationSplit} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" fill="#588b65" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}