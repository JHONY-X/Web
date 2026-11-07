"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminService, AuditLog } from "@/lib/api/services/admin";
import { History, Search } from "lucide-react";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await adminService.getAuditLogs();
      setLogs(data);
      setIsLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-primary-600" /> Search Audit Logs
          </h1>
          <p className="text-slate-500 text-sm mt-1">Monitor employer search behavior.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">Loading logs...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Employer</th>
                  <th className="px-6 py-3 font-medium">Search Query</th>
                  <th className="px-6 py-3 font-medium">Filters</th>
                  <th className="px-6 py-3 font-medium">Results</th>
                  <th className="px-6 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{log.employerName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 font-mono text-xs">
                        <Search className="w-3 h-3" /> {log.searchQuery || "All"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">{log.filtersUsed}</td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">{log.resultsCount} matches</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}