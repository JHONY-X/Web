"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { adminService, AdminVerificationItem } from "@/lib/api/services/admin";
import { ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<AdminVerificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchVerifications = async () => {
    setIsLoading(true);
    const data = await adminService.getVerifications();
    setVerifications(data);
    setIsLoading(false);
  };

  useEffect(() => {
    let active = true;
    adminService.getVerifications().then((data) => {
      if (!active) return;
      setVerifications(data);
      setIsLoading(false);
    }).catch((error: unknown) => {
      if (!active) return;
      console.error("Failed to load verification requests.", error);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const handleAction = async (id: string, status: "Approved" | "Rejected") => {
    setProcessingId(id);
    try {
      await adminService.updateVerificationStatus(id, status);
      // Re-fetch to show updated data
      await fetchVerifications();
    } catch (error) {
      alert("Action failed.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary-600" /> Verification Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">Review and approve candidate credentials and employer registrations.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 animate-pulse">Loading verifications...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Role/Category</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {verifications.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded px-2 py-1 text-xs font-medium ${item.type === "Employer" ? "bg-accent-50 text-accent-800" : "bg-primary-50 text-primary-800"}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.roleOrCategory}</td>
                    <td className="px-6 py-4 text-slate-500">{item.submittedDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.status === "Approved" ? "bg-emerald-50 text-emerald-700" :
                        item.status === "Rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status === "Pending" ? (
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" variant="outline" 
                            className="h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            onClick={() => handleAction(item.id, "Approved")}
                            isLoading={processingId === item.id}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                          </Button>
                          <Button 
                            size="sm" variant="outline" 
                            className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleAction(item.id, "Rejected")}
                            isLoading={processingId === item.id}
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Reviewed</span>
                      )}
                    </td>
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