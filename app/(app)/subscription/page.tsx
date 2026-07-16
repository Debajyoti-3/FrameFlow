"use client";

import React, { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Check, 
  Sparkles, 
  Coins, 
  ShieldCheck, 
  CreditCard,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";

const plans = [
  {
    id: "Starter",
    name: "Starter Pack",
    price: 1,
    credits: 5,
    description: "Perfect for testing out FrameFlow features.",
    features: [
      "10 Premium Credits",
      "High quality image enhancements",
      "Background removal & change",

    ],
    popular: false,
    color: "bg-slate-900 text-white dark:bg-slate-800"
  },
  {
    id: "Pro",
    name: "Pro Pack",
    price: 5,
    credits: 30,
    description: "Great value for active creators and designers.",
    features: [
      "30 Premium Credits",
      "All image & video processing tools",
      "Priority customer support",
      "Save 33% per credit compared to Starter"
    ],
    popular: true,
    color: "bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white border-indigo-500 shadow-indigo-500/10 shadow-lg"
  },
  {
    id: "Pro Max",
    name: "Pro Max Pack",
    price: 10,
    credits: 70,
    description: "For professional agencies requiring high volumes.",
    features: [
      "70 Premium Credits",
      "Highest priority execution speeds",
      "Dedicated 24/7 account support",
      "Custom integrations assistance",
      "Save more per credit compared to Starter"
    ],
    popular: false,
    color: "bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
  }
];

function SubscriptionPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("John Doe"); 
  const [userEmail, setUserEmail] = useState<string>("john.doe@example.com"); 
  const router = useRouter();

  

  const handlePayment = async (planId: string, amount: number) => {
    const user = await axios.get("/api/authcheck");
    setUserName(user.data.name || "Not Mentioned");
    setUserEmail(user.data.email);
    setLoadingPlan(planId);
    try {
      // Get order details from backend (amount in paise)
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100 }), 
      });

      if (!response.ok) {
        throw new Error("Failed to initiate payment. Please try again.");
      }

      const order = await response.json();

      // Configure Razorpay Payment options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "FrameFlow",
        description: `Purchase ${planId} plan`,
        image: "/favicon.ico",
        order_id: order.id,
        handler: async (response: any) => {
          const loadingToast = toast.loading("Verifying payment... Please do not close this window.");
          try {
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            const result = await verifyResponse.json();
            if (result.success) {
              toast.success(`Payment verified! ${result.creditsAdded} credits added to your account.`, {
                id: loadingToast,
              });
              router.push("/dashboard");
              router.refresh();
            } else {
              toast.error(result.message || "Payment verification failed.", {
                id: loadingToast,
              });
            }
          } catch (err) {
            console.error("Payment verification failed:", err);
            toast.error("Failed to verify payment details.", {
              id: loadingToast,
            });
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#4F46E5", 
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled by user.");
          }
        }
      };

      //  Launch Checkout
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment handler error:", error);
      toast.error(error.message || "Something went wrong during payment initialization.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      {/* Load Razorpay SDK Script */}
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="lazyOnload"
      />

      <div className="space-y-8 max-w-6xl mx-auto py-4">
        {/* Header section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-550/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Coins className="w-3.5 h-3.5" />
            Pricing Plans
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            Get More Credits
          </h1>
          <p className="text-slate-650 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Upgrade your credit balance to process high-resolution images, remove backgrounds, and compress videos instantly.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col justify-between p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                plan.popular 
                  ? plan.color
                  : "bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold tracking-wide uppercase">
                   Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className={cn(
                    "text-sm mt-1.5",
                    plan.popular ? "text-indigo-200" : "text-slate-500 dark:text-slate-400"
                  )}>
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">₹{plan.price}</span>
                  <span className={cn(
                    "text-sm font-medium",
                    plan.popular ? "text-indigo-200" : "text-slate-500 dark:text-slate-400"
                  )}>
                    one-time
                  </span>
                </div>

                <div className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border",
                  plan.popular 
                    ? "bg-indigo-900/50 border-indigo-700/50 text-indigo-100" 
                    : "bg-slate-50 border-slate-100 text-slate-700 dark:bg-slate-800/40 dark:border-slate-700/50 dark:text-slate-350"
                )}>
                  
                  <div>
                    <div className="text-sm font-bold">{plan.credits} Credits</div>
                    <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                      ₹{(plan.price / plan.credits).toFixed(1)} / credit
                    </div>
                  </div>
                </div>

                <ul className="space-y-3.5 border-t pt-6 border-slate-200 dark:border-slate-800">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className={cn(
                        "w-4 h-4 mt-0.5 shrink-0",
                        plan.popular ? "text-indigo-300" : "text-emerald-500"
                      )} />
                      <span className="text-sm leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Button
                  className={cn(
                    "w-full py-6 font-bold text-sm tracking-wide rounded-xl cursor-pointer transition-all",
                    plan.popular
                      ? "bg-white text-indigo-950 hover:bg-slate-100 border-none"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                  )}
                  disabled={loadingPlan !== null}
                  onClick={() => handlePayment(plan.id, plan.price)}
                >
                  {loadingPlan === plan.id ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Buy {plan.credits} Credits
                    </span>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Money Back Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Secure payment 
          </div>
        </div>
      </div>
    </>
  );
}

export default SubscriptionPage;
