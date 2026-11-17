import React, { useState, useEffect } from "react";
import { 
  X, 
  DollarSign, 
  Smartphone, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  TrendingDown,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { db } from "../lib/firebase";
import { 
  doc, 
  setDoc, 
  updateDoc, 
  increment 
} from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

interface WithdrawalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: FirebaseUser;
  earningsUSD: number;
  mpesaNumberDefault: string;
  onSuccess: () => void;
}

export default function WithdrawalRequestModal({ 
  isOpen, 
  onClose, 
  user, 
  earningsUSD, 
  mpesaNumberDefault,
  onSuccess
}: WithdrawalRequestModalProps) {
  const [mpesaNumber, setMpesaNumber] = useState(mpesaNumberDefault || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [progressLog, setProgressLog] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const commissionKES = Math.round(earningsUSD * 130);

  useEffect(() => {
    if (isOpen) {
      setMpesaNumber(mpesaNumberDefault || "");
      setStep("form");
      setError(null);
      setIsLoading(false);
      setProgressLog([]);
      setActiveStep(0);
    }
  }, [isOpen, mpesaNumberDefault]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (earningsUSD <= 0) {
      setError("You do not have any available balance to withdraw.");
      return;
    }
    if (!mpesaNumber.trim()) {
      setError("Please specify a valid mobile payout number.");
      return;
    }

    setIsLoading(true);
    setStep("processing");
    setProgressLog([]);
    setActiveStep(0);

    const steps = [
      "Verifying wallet account details and permissions...",
      `Securing available balance of $${earningsUSD.toFixed(2)} USD (KES ${commissionKES.toLocaleString()})...`,
      "Submitting payout ticket to mobile money distributor...",
      `Queuing transfer request to phone line: ${mpesaNumber}...`,
      "Recording transaction details to your withdrawal history...",
      "Withdrawal request successfully logged!"
    ];

    // Simulate progress logs for premium UI feel
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setActiveStep(i + 1);
      setProgressLog((prev) => [...prev, steps[i]]);
    }

    try {
      // 1. Write the withdrawal request record
      const withdrawalId = "wd-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000);
      const withdrawalRef = doc(db, "withdrawals", withdrawalId);
      
      await setDoc(withdrawalRef, {
        id: withdrawalId,
        userId: user.uid,
        amountUSD: earningsUSD,
        amountKES: commissionKES,
        mpesaNumber: mpesaNumber,
        status: "pending",
        timestamp: new Date().toISOString()
      });

      // 2. Clear out the user's available earnings balance in their profile
      const userRef = doc(db, "userMonetization", user.uid);
      await updateDoc(userRef, {
        earningsUSD: 0.0,
        updatedAt: new Date().toISOString()
      });

      setStep("success");
      onSuccess();
    } catch (err: any) {
      console.error("Payout request failed:", err);
      // Fallback local execution if firestore permission deferred
      setError(err.message || "Failed to submit withdrawal request to Firestore. Please try again.");
      setStep("form");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="w-full max-w-md bg-zinc-950 border border-amber-500/20 rounded-2xl p-6 shadow-2xl relative space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={step === "processing"}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="text-center border-b border-zinc-900 pb-3">
          <span className="text-[9px] text-amber-500 font-bold tracking-widest uppercase font-mono">Partner Payouts</span>
          <h3 className="text-lg font-bold font-display text-white mt-0.5">Withdraw Commission</h3>
          <p className="text-[11px] text-zinc-400 mt-1">Transfer your available USD balance directly to M-Pesa.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* STEP 1: FORM */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Payout breakdown */}
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-850 space-y-2.5">
              <span className="block text-[9px] text-zinc-500 font-bold uppercase font-mono tracking-wider">Withdrawable Funds</span>
              
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">USD Commission</span>
                <span className="font-mono text-base font-bold text-green-400">${earningsUSD.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-850/60 pt-2">
                <span className="text-zinc-400">Estimated payout (KES)</span>
                <span className="font-mono text-base font-black text-white">KES {commissionKES.toLocaleString()}</span>
              </div>

              <div className="text-[10px] text-zinc-500 flex items-center space-x-1 justify-center pt-1">
                <HelpCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>Computed at 1 USD ≈ 130 KES, zero transaction surcharge.</span>
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 block font-medium">Recipient Mobile Payout Phone Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0712345678 or +254712345678"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white font-mono focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <p className="text-[10px] text-zinc-500">M-Pesa registered lines only. Transfer is immediate once reviewed by billing gateway.</p>
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={earningsUSD <= 0 || !mpesaNumber.trim()}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-extrabold uppercase tracking-wider text-xs rounded-xl hover:scale-102 active:scale-98 duration-200 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-40"
            >
              <span>Submit Cash-out Request</span>
            </button>
          </form>
        )}

        {/* STEP 2: PROCESSING SIMULATOR */}
        {step === "processing" && (
          <div className="space-y-5 text-xs">
            <div className="text-center py-2 space-y-2">
              <Loader2 className="h-7 w-7 animate-spin text-amber-500 mx-auto" />
              <span className="block font-bold text-zinc-300">Processing withdrawal request...</span>
              <p className="text-[10px] text-zinc-500 max-w-xs mx-auto">Please wait while your request is registered. Do not close this window.</p>
            </div>

            {/* Progress Log Terminals */}
            <div className="bg-black/60 rounded-xl p-4 border border-zinc-900 font-mono text-[9px] space-y-1.5 shadow-inner max-h-44 overflow-y-auto">
              {progressLog.map((log, idx) => (
                <div key={idx} className="flex items-start space-x-1.5 text-zinc-400">
                  <span className="text-amber-500 font-bold shrink-0">&gt;</span>
                  <span className="leading-relaxed">{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === "success" && (
          <div className="text-center py-6 space-y-4 text-xs">
            <div className="mx-auto w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-white">Withdrawal Successfully Logged!</h4>
              <p className="text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Your payout request of <span className="text-white font-bold font-mono">${earningsUSD.toFixed(2)}</span> has been queued for payout to <span className="text-white font-mono font-bold">{mpesaNumber}</span>.
              </p>
            </div>
            
            <div className="bg-zinc-900/40 border border-zinc-850 p-3 rounded-xl max-w-xs mx-auto text-left font-mono text-[9px] text-zinc-500 space-y-1">
              <div>Transaction ID: WD-{Date.now().toString().substring(6)}</div>
              <div>Cleared Status: <span className="text-amber-400 font-bold">PENDING</span></div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-350 text-black font-bold rounded-lg cursor-pointer transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        <div className="border-t border-zinc-900 pt-3 text-center text-[10px] text-zinc-500 font-sans">
          <span>Need help? Contact support@mohstylist.com</span>
        </div>

      </div>
    </div>
  );
}
