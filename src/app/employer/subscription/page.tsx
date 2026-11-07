"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { paymentService, SUBSCRIPTION_PACKAGES, PackageTier, PaymentStatus } from "@/lib/api/services/payment";
import { CheckCircle2, ShieldCheck, CreditCard, Loader2, AlertTriangle, Receipt } from "lucide-react";

export default function EmployerSubscriptionPage() {
  const [selectedTier, setSelectedTier] = useState<PackageTier | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  // This function simulates the redirect to the payment gateway and the webhook return
  const handleSubscribe = async (tier: PackageTier) => {
    setSelectedTier(tier);
    setIsProcessing(true);
    setPaymentStatus("Pending");

    try {
      // 1. Get checkout URL from backend
      const { transactionId } = await paymentService.initiatePayment(tier);
      
      // 2. Simulate redirecting to gateway and returning
      // In a real app: window.location.href = checkoutUrl;
      
      // 3. Poll the backend to verify the actual status (NOT relying on UI)
      const verifiedStatus = await paymentService.verifyPaymentStatus(transactionId);
      setPaymentStatus(verifiedStatus);
      
    } catch (error) {
      setPaymentStatus("Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout role="employer">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Subscription & Billing</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your recruitment package and view transaction history.</p>
        </div>

        {/* Current Status Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-emerald-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-emerald-900">Active Subscription: Gold Package</h3>
            <p className="text-sm text-emerald-700 mt-1">Valid until Dec 31, 2026. You have Unlimited candidate views.</p>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBSCRIPTION_PACKAGES.map((pkg) => (
            <div 
              key={pkg.tier} 
              className={`relative bg-white border rounded-2xl p-6 flex flex-col transition-all ${
                selectedTier === pkg.tier ? "border-primary-500 ring-2 ring-primary-500 shadow-md" : "border-slate-200 shadow-sm hover:border-primary-200"
              }`}
            >
              {pkg.tier === "Silver" && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Recommended
                </div>
              )}
              {pkg.tier === "Gold" && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">{pkg.tier}</h3>
                  {pkg.discount && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      {pkg.discount} off
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-extrabold text-slate-900">{pkg.priceETB.toLocaleString()}</span>
                  <span className="text-xs text-slate-500 ml-1">{pkg.tier === "Premium" ? "ETB / trainee" : "ETB / yr"}</span>
                </div>
                {pkg.costPerTrainee && (
                  <p className="mt-1 text-xs text-slate-500">{pkg.costPerTrainee} / trainee</p>
                )}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant={pkg.tier === "Gold" || pkg.tier === "Silver" ? "primary" : "outline"} 
                className="w-full text-xs"
                onClick={() => handleSubscribe(pkg.tier)}
                disabled={isProcessing}
              >
                {isProcessing && selectedTier === pkg.tier ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                Select {pkg.tier}
              </Button>
            </div>
          ))}
        </div>

        {/* Payment Gateway Simulation Result */}
        {paymentStatus && (
          <div className={`p-6 rounded-xl border flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 ${
            paymentStatus === "Successful" ? "bg-emerald-50 border-emerald-200" :
            paymentStatus === "Pending" ? "bg-amber-50 border-amber-200" :
            "bg-red-50 border-red-200"
          }`}>
            {paymentStatus === "Successful" ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> :
             paymentStatus === "Pending" ? <Loader2 className="w-6 h-6 text-amber-600 animate-spin" /> :
             <AlertTriangle className="w-6 h-6 text-red-600" />}
            
            <div>
              <h3 className={`font-semibold ${
                paymentStatus === "Successful" ? "text-emerald-900" :
                paymentStatus === "Pending" ? "text-amber-900" : "text-red-900"
              }`}>
                Payment Status: {paymentStatus}
              </h3>
              <p className={`text-sm mt-1 ${
                paymentStatus === "Successful" ? "text-emerald-700" :
                paymentStatus === "Pending" ? "text-amber-700" : "text-red-700"
              }`}>
                {paymentStatus === "Successful" 
                  ? "Your payment has been verified by the gateway. Your account is now active." 
                  : paymentStatus === "Pending"
                  ? "Waiting for the payment provider to confirm your transaction. This page will update automatically."
                  : "The transaction was declined or failed. Please try again or contact support."}
              </p>
              {paymentStatus === "Successful" && (
                <Button variant="outline" size="sm" className="mt-3 bg-white">
                  <Receipt className="w-4 h-4 mr-2" /> Download Receipt
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}