"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { adminService, Transaction } from "@/lib/api/services/admin";
import { CreditCard, TrendingUp, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminFinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setIsLoading(true);
    const data = await adminService.getTransactions();
    setTransactions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    let active = true;
    adminService.getTransactions().then((data) => {
      if (!active) return;
      setTransactions(data);
      setIsLoading(false);
    }).catch((error: unknown) => {
      if (!active) return;
      console.error("Failed to load transactions.", error);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const handleRefund = async (id: string) => {
    if (!confirm("Are you sure you want to refund this transaction?")) return;
    setProcessingId(id);
    await adminService.refundTransaction(id);
    await fetchTransactions();
    setProcessingId(null);
  };

  const handleManualActivate = async (id: string) => {
    if (!confirm("Manually verify this pending payment? This will activate the employer's account.")) return;
    setProcessingId(id);
    await adminService.approvePendingPayment(id);
    await fetchTransactions();
    setProcessingId(null);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor revenue and manage transactions.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">
                {transactions.filter(t => t.status === "Successful").reduce((sum, t) => sum + t.amount, 0)} ETB
              </p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-lg"><CreditCard className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-slate-500">Successful Transactions</p>
              <p className="text-2xl font-bold text-slate-900">{transactions.filter(t => t.status === "Successful").length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><AlertCircle className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-slate-500">Pending Payments</p>
              <p className="text-2xl font-bold text-slate-900">{transactions.filter(t => t.status === "Pending").length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-semibold text-slate-900">Transaction History</h2>
          </div>
          
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">Loading...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-white border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Reference</th>
                  <th className="px-6 py-3 font-medium">Employer</th>
                  <th className="px-6 py-3 font-medium">Package</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{txn.referenceNumber}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{txn.employerName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${txn.packageTier === "Gold" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-700"}`}>
                        {txn.packageTier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{txn.amount} ETB</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        txn.status === "Successful" ? "bg-emerald-50 text-emerald-700" :
                        txn.status === "Pending" ? "bg-amber-50 text-amber-700" :
                        txn.status === "Refunded" ? "bg-slate-100 text-slate-700" : "bg-red-50 text-red-700"
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {txn.status === "Successful" && (
                        <Button 
                          variant="outline" size="sm" 
                          className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleRefund(txn.id)}
                          isLoading={processingId === txn.id}
                        >
                          <RotateCcw className="w-3 h-3 mr-1" /> Refund
                        </Button>
                      )}
                      {txn.status === "Pending" && (
                        <Button 
                          variant="outline" size="sm" 
                          className="h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          onClick={() => handleManualActivate(txn.id)}
                          isLoading={processingId === txn.id}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Verify
                        </Button>
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