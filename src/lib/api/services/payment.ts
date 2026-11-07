export type PackageTier = "Basic" | "Silver" | "Gold" | "Premium";
import { daysAgo } from "@/lib/date";

export type PaymentStatus = "Pending" | "Successful" | "Failed" | "Refunded" | "Disputed";

export interface SubscriptionPackage {
  tier: PackageTier;
  priceETB: number;
  durationMonths: number;
  candidateViewLimit: number | "Unlimited";
  interviewRequestLimit: number | "Unlimited";
  annualCapacity?: string;
  discount?: string;
  costPerTrainee?: string;
  features: string[];
}

export interface Transaction {
  id: string;
  referenceNumber: string;
  employerName: string;
  packageTier: PackageTier;
  amount: number;
  date: string;
  status: PaymentStatus;
}

// Packages aligned with Programme Budget & Hospital Subscription Model (.docx)
// Base hospital contribution: 3,035 ETB per trainee
export const SUBSCRIPTION_PACKAGES: SubscriptionPackage[] = [
  {
    tier: "Basic",
    priceETB: 136575,
    durationMonths: 12,
    candidateViewLimit: 50,
    interviewRequestLimit: 50,
    annualCapacity: "50 trainees",
    discount: "10%",
    costPerTrainee: "2,731.50 ETB",
    features: [
      "50 Trainees Annual Capacity",
      "10% Discount on Hospital Share",
      "2,731.50 ETB Cost Per Trainee",
      "Standard Verification & Support",
    ],
  },
  {
    tier: "Silver",
    priceETB: 386962.5,
    durationMonths: 12,
    candidateViewLimit: 150,
    interviewRequestLimit: 150,
    annualCapacity: "150 trainees",
    discount: "15%",
    costPerTrainee: "2,579.75 ETB",
    features: [
      "150 Trainees Annual Capacity",
      "15% Discount on Hospital Share",
      "2,579.75 ETB Cost Per Trainee",
      "Priority Interview Scheduling",
      "Dedicated Onboarding Support",
    ],
  },
  {
    tier: "Gold",
    priceETB: 1214000,
    durationMonths: 12,
    candidateViewLimit: 500,
    interviewRequestLimit: 500,
    annualCapacity: "500 trainees",
    discount: "20%",
    costPerTrainee: "2,428.00 ETB",
    features: [
      "500 Trainees Annual Capacity",
      "20% Discount on Hospital Share",
      "2,428.00 ETB Cost Per Trainee",
      "Dedicated Account Manager",
      "Featured Hospital Badge",
      "Priority Placement Matching",
    ],
  },
  {
    tier: "Premium",
    priceETB: 2276.25,
    durationMonths: 12,
    candidateViewLimit: "Unlimited",
    interviewRequestLimit: "Unlimited",
    annualCapacity: "Unlimited trainees",
    discount: "25%",
    costPerTrainee: "2,276.25 ETB",
    features: [
      "Unlimited Trainees Capacity",
      "Maximum 25% Discount Rate",
      "2,276.25 ETB Per Trainee",
      "Custom Enterprise Agreement",
      "Full Training Pipeline Integration",
    ],
  },
];

export const paymentService = {
  // 1. Initiate Payment (Frontend calls this to get a checkout URL)
  initiatePayment: async (tier: PackageTier): Promise<{ checkoutUrl: string; transactionId: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In production, this returns a URL to Chapa, Telebirr, or Stripe
    return { 
      checkoutUrl: "https://mock-payment-gateway.com/checkout/session_12345", 
      transactionId: `TXN-${Date.now()}` 
    };
  },

  // 2. Verify Payment (Frontend polls this after returning from the gateway)
  // NOTE: This simulates the backend checking the payment provider's webhook/API.
  verifyPaymentStatus: async (transactionId: string): Promise<PaymentStatus> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simulate: 80% chance of success for this demo
    const isSuccess = Math.random() > 0.2; 
    return isSuccess ? "Successful" : "Failed";
  },

  // 3. Admin: Get all transactions
  getAllTransactions: async (): Promise<Transaction[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [
      { id: "1", referenceNumber: "TXN-90812", employerName: "St. Gabriel Hospital", packageTier: "Gold", amount: 3000, date: daysAgo(1), status: "Successful" },
      { id: "2", referenceNumber: "TXN-90813", employerName: "Rohobot Home Care", packageTier: "Silver", amount: 1500, date: daysAgo(2), status: "Pending" },
      { id: "3", referenceNumber: "TXN-90814", employerName: "Bethel Clinic", packageTier: "Basic", amount: 500, date: daysAgo(5), status: "Failed" },
      { id: "4", referenceNumber: "TXN-90815", employerName: "Zewditu Hospital", packageTier: "Gold", amount: 3000, date: daysAgo(8), status: "Refunded" },
    ];
  }
};