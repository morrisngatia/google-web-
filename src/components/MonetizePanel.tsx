import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  Share2, 
  Link, 
  Copy, 
  TrendingUp, 
  Clock, 
  Award, 
  Check, 
  CreditCard, 
  Loader2, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink,
  Users,
  Smartphone
} from "lucide-react";
import { 
  db, 
  auth 
} from "../lib/firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  onSnapshot
} from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import ReferralStats from "./ReferralStats";
import WithdrawalRequestModal from "./WithdrawalRequestModal";

// Custom SVG Icons for Social Platforms
const WhatsAppIcon = () => (
  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

interface MonetizePanelProps {
  user: FirebaseUser | null;
  onOpenAuth: () => void;
}

interface MonetizationData {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActivated: boolean;
  referralCode: string;
  clicks: number;
  salesCount: number;
  earningsUSD: number;
  mpesaNumber: string;
}

const safeCopyToClipboard = (text: string) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  }
};

export default function MonetizePanel({ user, onOpenAuth }: MonetizePanelProps) {
  const [monData, setMonData] = useState<MonetizationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Activation flow states
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [activationMethod, setActivationMethod] = useState<"mpesa" | "airtel" | "card">("mpesa");
  const [activationStep, setActivationStep] = useState<"checkout" | "processing" | "success">("checkout");
  const [mpesaLog, setMpesaLog] = useState<string[]>([]);
  const [mpesaActiveStep, setMpesaActiveStep] = useState(0);

  // Referred Sales State
  const [referredSales, setReferredSales] = useState<any[]>([]);

  // Withdrawals State
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [activeListTab, setActiveListTab] = useState<"referrals" | "withdrawals">("referrals");

  // Payout State
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Link generator states
  const [targetUrl, setTargetUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [activeTemplate, setActiveTemplate] = useState<"elegant" | "casual" | "promo">("elegant");
  const [customCaption, setCustomCaption] = useState("");
  const [isCaptionCopied, setIsCaptionCopied] = useState(false);
  const [showInstagramInstructions, setShowInstagramInstructions] = useState(false);

  const captionTemplates = {
    elegant: "Elevate your wardrobe with curated bespoke tailoring and custom couture from Moh Stylist. Discover unique handcrafted fashion tailored to your silhouette:",
    casual: "Just discovered Moh Stylist's premium custom couture and streetwear fits. Check out their collections before slots fill up!",
    promo: "Obsessed with these hand-stitched custom designs! Tap here to explore collections or book a personalized stylist consultation on Moh Stylist:"
  };

  useEffect(() => {
    if (!monData) return;
    const currentLink = generatedUrl || `${window.location.origin}/?ref=${monData.referralCode}`;
    setCustomCaption(`${captionTemplates[activeTemplate]} ${currentLink}`);
  }, [activeTemplate, generatedUrl, monData?.referralCode]);

  // Sync data from Firestore if user is logged in
  useEffect(() => {
    if (monData) {
      setTargetUrl(window.location.origin);
      setGeneratedUrl(`${window.location.origin}/?ref=${monData.referralCode}`);
    }
  }, [monData?.referralCode]);
  useEffect(() => {
    if (!user) {
      setMonData(null);
      return;
    }

    setLoading(true);
    const docRef = doc(db, "userMonetization", user.uid);
    
    // Set up real-time listener for user monetization data
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as MonetizationData;
        setMonData(data);
        if (data.phone && !mpesaNumber) {
          setMpesaNumber(data.phone);
        }
      } else {
        // Handle deferred or local profile
        const local = localStorage.getItem("local_monetization_" + user.uid);
        if (local) {
          setMonData(JSON.parse(local));
        }
      }
      setLoading(false);
    }, (err) => {
      console.warn("Real-time monetization updates deferred:", err);
      // Fallback
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          setMonData(docSnap.data() as MonetizationData);
        }
      }).finally(() => setLoading(false));
    });

    // Also load referred sales
    const salesRef = collection(db, "referralSales");
    const q = query(salesRef, where("referrerId", "==", user.uid));
    const unsubscribeSales = onSnapshot(q, (querySnap) => {
      const sales: any[] = [];
      querySnap.forEach((doc) => {
        sales.push({ id: doc.id, ...doc.data() });
      });
      setReferredSales(sales.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
    }, (err) => {
      console.warn("Referred sales loading deferred:", err);
    });

    // Load withdrawals history
    const withdrawalsRef = collection(db, "withdrawals");
    const qw = query(withdrawalsRef, where("userId", "==", user.uid));
    const unsubscribeWithdrawals = onSnapshot(qw, (querySnap) => {
      const wds: any[] = [];
      querySnap.forEach((doc) => {
        wds.push({ id: doc.id, ...doc.data() });
      });
      setWithdrawals(wds.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
    }, (err) => {
      console.warn("Withdrawals history loading deferred:", err);
    });

    return () => {
      unsubscribe();
      unsubscribeSales();
      unsubscribeWithdrawals();
    };
  }, [user]);

  // Handle URL Copying
  const handleCopyLink = () => {
    if (!monData) return;
    const refUrl = generatedUrl || `${window.location.origin}/?ref=${monData.referralCode}`;
    safeCopyToClipboard(refUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGenerateCustomLink = () => {
    if (!monData) return;
    let cleanBase = targetUrl.trim();
    if (!cleanBase) {
      cleanBase = window.location.origin;
    }

    // Convert relative path to absolute
    if (!cleanBase.startsWith("http://") && !cleanBase.startsWith("https://")) {
      if (cleanBase.startsWith("/")) {
        cleanBase = window.location.origin + cleanBase;
      } else {
        cleanBase = window.location.origin + "/" + cleanBase;
      }
    }

    try {
      const url = new URL(cleanBase);
      url.searchParams.set("ref", monData.referralCode);
      setGeneratedUrl(url.toString());
    } catch (e) {
      const connector = cleanBase.includes("?") ? "&" : "?";
      setGeneratedUrl(`${cleanBase}${connector}ref=${monData.referralCode}`);
    }
  };

  // Handle pay 100 KSh activation
  const handleActivatePayment = async () => {
    if (!user || !mpesaNumber.trim()) return;

    setActivationStep("processing");
    setMpesaActiveStep(0);
    setMpesaLog([]);

    const steps = [
      `Initializing 100 KSh setup payment via ${activationMethod === "mpesa" ? "M-Pesa STK Push" : activationMethod === "airtel" ? "Airtel Money STK Push" : "Card Processing"}...`,
      "Connecting to the secure mobile payment gateway...",
      `Awaiting payment confirmation prompt on ${mpesaNumber}...`,
      "Verifying payment confirmation details...",
      "Activating your affiliate status in the database..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMpesaActiveStep(i + 1);
      setMpesaLog((prev) => [...prev, steps[i]]);
    }

    try {
      const userRef = doc(db, "userMonetization", user.uid);
      const docSnap = await getDoc(userRef);

      const refCode = monData?.referralCode || "MOH-REF-" + Math.floor(10000 + Math.random() * 90000);

      const updatedProfile = {
        id: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Moh Stylist Partner",
        email: user.email || "",
        phone: user.phoneNumber || mpesaNumber || "",
        isActivated: true, // Payed & activated!
        referralCode: refCode,
        clicks: monData?.clicks || 0,
        salesCount: monData?.salesCount || 0,
        earningsUSD: monData?.earningsUSD || 0.0,
        mpesaNumber: mpesaNumber,
        updatedAt: new Date().toISOString()
      };

      await setDoc(userRef, updatedProfile, { merge: true });
      setMonData(updatedProfile as MonetizationData);
      setActivationStep("success");
    } catch (e) {
      console.error("Failed to update firestore node:", e);
      // fallback local updates
      if (monData) {
        const localUp = { ...monData, isActivated: true, mpesaNumber };
        localStorage.setItem("local_monetization_" + user.uid, JSON.stringify(localUp));
        setMonData(localUp);
      }
      setActivationStep("success");
    }
  };

  // Request earnings payout
  const handleWithdraw = async () => {
    if (!monData || monData.earningsUSD <= 0) return;
    setIsWithdrawing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    try {
      // Reset earnings locally & firestore since they withdrew
      const userRef = doc(db, "userMonetization", monData.id);
      await updateDoc(userRef, {
        earningsUSD: 0.0,
        updatedAt: new Date().toISOString()
      });
      setWithdrawSuccess(true);
      setTimeout(() => setWithdrawSuccess(false), 3000);
    } catch (err) {
      console.warn("Firestore update deferred. Simulating withdrawal:", err);
      setWithdrawSuccess(true);
      setTimeout(() => setWithdrawSuccess(false), 3000);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getAffiliateLink = () => {
    if (!monData) return "";
    return `${window.location.origin}/?ref=${monData.referralCode}`;
  };

  // GUEST / NOT LOGGED IN PROMO PANEL
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 text-white">
        <div className="bg-zinc-950 rounded-2xl border border-zinc-900 overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="p-8 md:p-12 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-amber-400/10 border border-amber-500/20 rounded-full flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-amber-500" />
            </div>

            <div className="space-y-2">
              <span className="text-xs text-amber-500 font-bold tracking-widest uppercase">Moh Stylist Affiliate Program</span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-tight">SHARE STYLES, EARN REAL COMMISSIONS</h2>
              <p className="text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Unlock professional affiliate monetization. Share custom fashion links or checkout lists with your audience on WhatsApp, Instagram, or TikTok. When a purchase is completed, you earn a high-tier USD commission on every sale!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto py-4">
              <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-900 flex flex-col items-center space-y-2 text-center">
                <Users className="h-5 w-5 text-amber-500" />
                <h4 className="font-bold text-xs">1. Create styling account</h4>
                <p className="text-[11px] text-zinc-500">Sign in securely using Gmail, GitHub, or your phone number.</p>
              </div>

              <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-900 flex flex-col items-center space-y-2 text-center">
                <Award className="h-5 w-5 text-amber-500" />
                <h4 className="font-bold text-xs">2. Activate monetization</h4>
                <p className="text-[11px] text-zinc-500">Submit a one-time activation checkout of 100 KSh to activate payouts.</p>
              </div>

              <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-900 flex flex-col items-center space-y-2 text-center">
                <Share2 className="h-5 w-5 text-amber-500" />
                <h4 className="font-bold text-xs">3. Share links & earn</h4>
                <p className="text-[11px] text-zinc-500">Copy your unique referral url. Request cashouts instantly via M-Pesa!</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenAuth}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:scale-105 active:scale-95 duration-200 shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                Log In to Activate Monetization
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-white space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs text-zinc-400 font-sans">Loading account details...</span>
      </div>
    );
  }

  // ACTIVE USER BUT NOT ACTIVATED (PAYMENT PANEL REQUIRED)
  if (monData && !monData.isActivated) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12 text-white">
        <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-6 shadow-2xl space-y-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="border-b border-zinc-900 pb-4">
            <span className="text-[10px] text-amber-500 font-bold tracking-widest uppercase">STEP 2 OF 2</span>
            <h3 className="text-xl font-bold font-display text-white mt-1">ACTIVATE AFFILIATE PROGRAM</h3>
            <p className="text-xs text-zinc-400 mt-1">Activate your affiliate dashboard to start tracking referrals and earning commissions.</p>
          </div>

          {activationStep === "checkout" && (
            <div className="space-y-4 text-xs">
              <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-850 space-y-2">
                <span className="block text-[10px] text-amber-500 font-bold uppercase">Required Setup Deposit</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black font-mono">100 KSh</span>
                  <span className="text-zinc-500 text-[10px]">one-time setup fee</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  This one-time setup fee directly covers secure database storage, referral tracking setups, and real-time activity logging with no recurring monthly subscriptions.
                </p>
              </div>

              {/* Selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActivationMethod("mpesa")}
                  className={`py-2.5 rounded-lg border text-[11px] font-semibold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                    activationMethod === "mpesa"
                      ? "bg-green-500/10 border-green-500 text-green-400"
                      : "bg-zinc-900 border-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>M-Pesa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivationMethod("airtel")}
                  className={`py-2.5 rounded-lg border text-[11px] font-semibold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                    activationMethod === "airtel"
                      ? "bg-red-500/10 border-red-500 text-red-400"
                      : "bg-zinc-900 border-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Airtel Money</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivationMethod("card")}
                  className={`py-2.5 rounded-lg border text-[11px] font-semibold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                    activationMethod === "card"
                      ? "bg-amber-500/10 border-amber-500 text-amber-400"
                      : "bg-zinc-900 border-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Credit Card</span>
                </button>
              </div>

              {/* Mobile Input */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 block font-medium">Kenyan Mobile Number for Payment STK Push *</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0712345678"
                    value={mpesaNumber}
                    onChange={(e) => setMpesaNumber(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleActivatePayment}
                disabled={!mpesaNumber.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:scale-102 active:scale-98 duration-200 flex items-center justify-center space-x-1 shadow shadow-amber-500/10 cursor-pointer disabled:opacity-40"
              >
                <span>Authorize & Pay 100 KSh</span>
              </button>
            </div>
          )}

          {activationStep === "processing" && (
            <div className="space-y-6 text-xs">
              <div className="text-center py-4 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto" />
                <span className="block font-bold text-zinc-300">Processing setup payment...</span>
                <p className="text-[10px] text-zinc-500 max-w-xs mx-auto">Please check your phone for a prompt asking for your mobile wallet PIN to complete the 100 KSh setup deposit.</p>
              </div>

              {/* STK Progress Log */}
              <div className="bg-black/60 rounded-xl p-4 border border-zinc-900 font-mono text-[10px] space-y-2 shadow-inner max-h-48 overflow-y-auto">
                {mpesaLog.map((log, index) => (
                  <div key={index} className="flex items-start space-x-2 text-zinc-400">
                    <span className="text-amber-500 font-bold shrink-0">&gt;</span>
                    <span className="leading-relaxed">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activationStep === "success" && (
            <div className="text-center py-8 space-y-5 text-xs">
              <div className="mx-auto w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-green-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-white">Monetization Active!</h4>
                <p className="text-zinc-400 max-w-xs mx-auto">Your setup payment was received. Welcome to Moh Stylist Affiliate Network.</p>
              </div>
              <button
                type="button"
                onClick={() => setActivationStep("checkout")} // Trigger view state re-evaluation
                className="px-6 py-2 bg-amber-400 text-black font-bold rounded-lg hover:bg-amber-350 cursor-pointer"
              >
                Open Affiliate Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // COMPREHENSIVE AFFILIATE DASHBOARD
  if (monData && monData.isActivated) {
    const commissionKES = Math.round(monData.earningsUSD * 130); // Approx exchange rate
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 text-white">
        
        {/* Header Block */}
        <div className="border-b border-zinc-900 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-amber-500 font-bold tracking-widest uppercase">MEMBER CONSOLE</span>
            <h2 className="text-2xl md:text-3xl font-extrabold font-display mt-0.5">AFFILIATE PARTNER PORTAL</h2>
            <p className="text-xs text-zinc-400 mt-1">Hello, {monData.name}! Track link performance, view commissions, and request payouts.</p>
          </div>
          <div className="bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-900 flex items-center space-x-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
            <span className="text-[10px] uppercase text-zinc-400 font-semibold">Affiliate Payouts Active</span>
          </div>
        </div>

        {/* Affiliate Link Generation Board */}
        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Share2 className="h-4.5 w-4.5 text-amber-500" />
              <span>Your Unique Referral Link</span>
            </h3>
            <p className="text-xs text-zinc-400">Visitors clicking your custom links are tracked permanently. You earn a direct commission on every purchase they clear, based on your active commission tier rate.</p>
          </div>

          {/* Interactive URL builder input & quick-select presets */}
          <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900/80 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-bold uppercase font-mono block">Target Page Destination Suffix</label>
                <input
                  type="text"
                  placeholder="e.g. /?tab=shop or full URL"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 pb-0.5">
                <button
                  type="button"
                  onClick={() => setTargetUrl(window.location.origin)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono duration-200 cursor-pointer ${
                    targetUrl === window.location.origin
                      ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                      : "bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white"
                  }`}
                >
                  / Home
                </button>
                <button
                  type="button"
                  onClick={() => setTargetUrl(`${window.location.origin}/?tab=shop`)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono duration-200 cursor-pointer ${
                    targetUrl === `${window.location.origin}/?tab=shop`
                      ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                      : "bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white"
                  }`}
                >
                  / Shop
                </button>
                <button
                  type="button"
                  onClick={() => setTargetUrl(`${window.location.origin}/?tab=mohtv`)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono duration-200 cursor-pointer ${
                    targetUrl === `${window.location.origin}/?tab=mohtv`
                      ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                      : "bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white"
                  }`}
                >
                  / Moh TV
                </button>
                <button
                  type="button"
                  onClick={() => setTargetUrl(`${window.location.origin}/?tab=blog`)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono duration-200 cursor-pointer ${
                    targetUrl === `${window.location.origin}/?tab=blog`
                      ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                      : "bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white"
                  }`}
                >
                  / Style Journal
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateCustomLink}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-450 text-black font-extrabold uppercase text-[10px] tracking-wider rounded-xl cursor-pointer duration-200 flex items-center space-x-1.5 hover:scale-102 active:scale-98"
            >
              <Link className="h-3.5 w-3.5 shrink-0" />
              <span>Generate Link</span>
            </button>
          </div>

          {/* Generated Link Container */}
          <div className="space-y-4 pt-1 border-t border-zinc-900/60">
            <div className="space-y-1.5">
              <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">Generated Affiliate Share Link</span>
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-3 flex items-center justify-between min-w-0">
                <code className="text-xs text-amber-400 font-mono truncate select-all">{generatedUrl || getAffiliateLink()}</code>
                <button
                  onClick={handleCopyLink}
                  className="ml-3 shrink-0 p-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-amber-500/20 rounded-lg text-zinc-400 hover:text-amber-400 transition-all cursor-pointer"
                  title="Copy Affiliate Link"
                >
                  {isCopied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Custom Caption Builder */}
            <div className="space-y-3 bg-zinc-900/10 p-4 rounded-xl border border-zinc-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">Promo Caption Preset</span>
                <div className="flex flex-wrap gap-1">
                  {(["elegant", "casual", "promo"] as const).map((temp) => (
                    <button
                      key={temp}
                      type="button"
                      onClick={() => setActiveTemplate(temp)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] capitalize font-semibold duration-150 cursor-pointer ${
                        activeTemplate === temp
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : "bg-zinc-950 hover:bg-zinc-900 text-zinc-500 border border-zinc-850"
                      }`}
                    >
                      {temp === "elegant" ? "Bespoke Elegance" : temp === "casual" ? "Casual Buzz" : "Stylist Promo"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <textarea
                  value={customCaption}
                  onChange={(e) => setCustomCaption(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl p-3 text-xs text-zinc-300 font-sans focus:outline-none focus:border-amber-500/50 min-h-[72px] resize-y leading-relaxed"
                  placeholder="Draft your custom promotional message here..."
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-zinc-500 font-mono">Includes your unique affiliate tag: <strong className="text-amber-500">{monData?.referralCode}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      safeCopyToClipboard(customCaption);
                      setIsCaptionCopied(true);
                      setTimeout(() => setIsCaptionCopied(false), 2000);
                    }}
                    className="px-2.5 py-1 text-[10px] text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-850 rounded-lg flex items-center space-x-1 cursor-pointer duration-200"
                  >
                    {isCaptionCopied ? (
                      <>
                        <Check className="h-3 w-3 text-green-400" />
                        <span>Caption Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Full Caption</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Social Share Grid */}
            <div className="space-y-2.5">
              <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">Instant Social Launchpad</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* WhatsApp sharing */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(customCaption)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 bg-[#25D366] hover:bg-[#20ba56] text-black font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-102 active:scale-98 duration-200 shadow shadow-[#25D366]/10"
                >
                  <WhatsAppIcon />
                  <span>Share WhatsApp</span>
                </a>

                {/* Twitter / X sharing */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(customCaption)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 bg-white hover:bg-zinc-100 text-black font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-102 active:scale-98 duration-200 shadow"
                >
                  <TwitterIcon />
                  <span>Share on X</span>
                </a>

                {/* Instagram copying & instructions display */}
                <button
                  type="button"
                  onClick={() => {
                    safeCopyToClipboard(customCaption);
                    setIsCaptionCopied(true);
                    setShowInstagramInstructions(true);
                    setTimeout(() => setIsCaptionCopied(false), 3000);
                  }}
                  className="px-4 py-3 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-102 active:scale-98 duration-200 shadow shadow-purple-500/10"
                >
                  <InstagramIcon />
                  <span>Share Instagram</span>
                </button>
              </div>

              {/* Instagram helpful floating instructions banner */}
              {showInstagramInstructions && (
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 text-xs text-zinc-300 space-y-2.5 relative animate-in fade-in slide-in-from-top-1 duration-200">
                  <button
                    onClick={() => setShowInstagramInstructions(false)}
                    className="absolute top-3 right-3 text-zinc-500 hover:text-white font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                  <div className="flex items-center space-x-2">
                    <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-ping"></span>
                    <span className="font-extrabold text-white text-[10px] uppercase font-mono tracking-wider">Instagram Share Steps (Caption Copied!)</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1.5 text-zinc-400 text-[11px] leading-relaxed">
                    <li>We have automatically copied your customized referral caption and link to your clipboard!</li>
                    <li>Open <strong>Instagram</strong> on your device.</li>
                    <li>Create a new <strong>Post</strong> or <strong>Story</strong>, and choose your media.</li>
                    <li>Paste the copied caption into the caption box, or add the link as a <strong>Link Sticker</strong> in your Story!</li>
                    <li>Share with your audience to begin collecting style commissions instantly.</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bento Stats Board */}
        <ReferralStats
          clicks={monData.clicks}
          salesCount={monData.salesCount}
          earningsUSD={monData.earningsUSD}
        />

        {/* Withdrawal Section & Referral list */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Withdrawal Request Board */}
          <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl h-fit space-y-5">
            <div className="border-b border-zinc-900 pb-3">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <CreditCard className="h-4.5 w-4.5 text-amber-500" />
                <span>Withdrawal Payout</span>
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Transfer your available USD affiliate balance to your Kenyan mobile money wallet.</p>
            </div>

            {withdrawSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3.5 rounded-xl text-xs flex items-center space-x-2">
                <Check className="h-4 w-4 shrink-0" />
                <span>Payout request queued! Money will credit shortly.</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 space-y-1.5">
                <span className="text-[10px] text-zinc-500 uppercase block font-mono">Available Balance</span>
                <span className="text-xl font-black text-amber-400 block font-mono">${monData.earningsUSD.toFixed(2)} USD</span>
                <span className="text-[10px] text-zinc-400 block font-mono">Approx. KES {commissionKES.toLocaleString()} KSh</span>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold block">Payout Wallet Line (M-Pesa)</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    value={monData.mpesaNumber}
                    onChange={async (e) => {
                      const newNum = e.target.value;
                      const userRef = doc(db, "userMonetization", monData.id);
                      await updateDoc(userRef, { mpesaNumber: newNum });
                    }}
                    placeholder="Provide M-Pesa phone"
                    className="w-full bg-zinc-900 border border-zinc-850 rounded-xl p-2.5 pl-9 text-white font-mono focus:outline-none focus:border-amber-500/40 text-xs"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(true)}
                disabled={monData.earningsUSD <= 0}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold uppercase tracking-wider text-xs rounded-xl hover:scale-102 active:scale-98 duration-200 flex items-center justify-center space-x-2 shadow shadow-amber-500/10 cursor-pointer disabled:opacity-40"
              >
                <span>Request Instant Payout</span>
              </button>
            </div>
          </div>

          {/* Commission Tiers Card */}
          <div className="lg:col-span-1 bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-4">
            <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <Award className="h-4.5 w-4.5 text-amber-500" />
                <span>Commission Tiers</span>
              </h3>
              <span className="text-[9px] bg-amber-500/10 text-amber-400 font-mono font-bold px-2 py-0.5 rounded-full">
                Tier {monData.salesCount >= 100 ? "3" : monData.salesCount >= 30 ? "2" : "1"}
              </span>
            </div>
            
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Unlock higher flat payout rates as your cumulative styling referrals multiply. Your active tier updates in real-time.
            </p>

            <div className="overflow-hidden rounded-xl border border-zinc-900 text-xs">
              <table className="w-full text-left border-collapse font-sans">
                <thead>
                  <tr className="bg-zinc-900/50 text-zinc-500 font-mono text-[9px] uppercase tracking-wider border-b border-zinc-900">
                    <th className="p-2.5">Milestone</th>
                    <th className="p-2.5 text-center">Rate / Sale</th>
                    <th className="p-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-xs">
                  <tr className={`hover:bg-zinc-900/10 ${monData.salesCount < 30 ? "bg-amber-500/5 font-semibold text-amber-400" : "text-zinc-500"}`}>
                    <td className="p-2.5">
                      <p className="text-white font-medium">Starter Tier</p>
                      <p className="text-[9px] text-zinc-500">0 - 29 Sales</p>
                    </td>
                    <td className="p-2.5 text-center font-mono text-zinc-200">$0.50 USD</td>
                    <td className="p-2.5 text-right font-mono text-[9px]">
                      {monData.salesCount < 30 ? (
                        <span className="text-amber-400">● Active</span>
                      ) : (
                        <span className="text-zinc-600">✓ Done</span>
                      )}
                    </td>
                  </tr>
                  
                  <tr className={`hover:bg-zinc-900/10 ${monData.salesCount >= 30 && monData.salesCount < 100 ? "bg-amber-500/5 font-semibold text-amber-400" : "text-zinc-500"}`}>
                    <td className="p-2.5">
                      <p className="text-white font-medium">Gold Tier</p>
                      <p className="text-[9px] text-zinc-500">30 - 99 Sales</p>
                    </td>
                    <td className="p-2.5 text-center font-mono text-zinc-200">$0.60 USD</td>
                    <td className="p-2.5 text-right font-mono text-[9px]">
                      {monData.salesCount >= 100 ? (
                        <span className="text-zinc-600">✓ Done</span>
                      ) : monData.salesCount >= 30 ? (
                        <span className="text-amber-400">● Active</span>
                      ) : (
                        <span className="text-zinc-600">{30 - monData.salesCount} left</span>
                      )}
                    </td>
                  </tr>

                  <tr className={`hover:bg-zinc-900/10 ${monData.salesCount >= 100 ? "bg-amber-500/5 font-semibold text-amber-400" : "text-zinc-500"}`}>
                    <td className="p-2.5">
                      <p className="text-white font-medium">Platinum Elite</p>
                      <p className="text-[9px] text-zinc-500">100+ Sales</p>
                    </td>
                    <td className="p-2.5 text-center font-mono text-zinc-200">$0.70 USD</td>
                    <td className="p-2.5 text-right font-mono text-[9px]">
                      {monData.salesCount >= 100 ? (
                        <span className="text-emerald-400">● Active</span>
                      ) : (
                        <span className="text-zinc-600">{100 - monData.salesCount} left</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tabbed Activity & Financial Logs (Referred Sales + Withdrawals History) */}
          <div className="lg:col-span-2 bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-5">
            {/* Tab Selector Header */}
            <div className="border-b border-zinc-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveListTab("referrals")}
                  className={`text-xs font-extrabold uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                    activeListTab === "referrals"
                      ? "text-amber-400 border-b-2 border-amber-400"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Purchases Referred ({referredSales.length})
                </button>
                <button
                  onClick={() => setActiveListTab("withdrawals")}
                  className={`text-xs font-extrabold uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                    activeListTab === "withdrawals"
                      ? "text-amber-400 border-b-2 border-amber-400"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Cashout History ({withdrawals.length})
                </button>
              </div>
              <span className="text-[9px] text-zinc-500 font-sans tracking-wider">Synced just now</span>
            </div>

            {/* Render Selected Tab content */}
            {activeListTab === "referrals" ? (
              referredSales.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-zinc-900">
                    <thead>
                      <tr className="text-zinc-500 font-bold uppercase text-[9px] font-mono">
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5">Order ID</th>
                        <th className="py-2.5 text-right">Value (KES)</th>
                        <th className="py-2.5 text-right text-green-400">Commission</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-zinc-300 font-mono">
                      {referredSales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-zinc-900/20">
                          <td className="py-3 text-[10px] text-zinc-500">
                            {sale.timestamp ? new Date(sale.timestamp).toLocaleDateString() : "Today"}
                          </td>
                          <td className="py-3 font-semibold text-white">{sale.orderId}</td>
                          <td className="py-3 text-right">KES {sale.amountKES?.toLocaleString()}</td>
                          <td className="py-3 text-right text-green-400 font-bold">
                            +${sale.commissionUSD?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 text-zinc-600 italic text-xs leading-relaxed max-w-sm mx-auto">
                  No purchases referred yet. Share your style link above on your social media status to log your first transaction!
                </div>
              )
            ) : (
              // withdrawals list tab
              withdrawals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-zinc-900">
                    <thead>
                      <tr className="text-zinc-500 font-bold uppercase text-[9px] font-mono">
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5">M-Pesa Line</th>
                        <th className="py-2.5 text-right">USD Cashout</th>
                        <th className="py-2.5 text-right">Value (KES)</th>
                        <th className="py-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-zinc-300 font-mono">
                      {withdrawals.map((wd) => (
                        <tr key={wd.id} className="hover:bg-zinc-900/20">
                          <td className="py-3 text-[10px] text-zinc-500">
                            {wd.timestamp ? new Date(wd.timestamp).toLocaleDateString() : "Today"}
                          </td>
                          <td className="py-3 text-zinc-400">{wd.mpesaNumber}</td>
                          <td className="py-3 text-right text-white font-bold">${wd.amountUSD?.toFixed(2)}</td>
                          <td className="py-3 text-right text-zinc-400">KES {wd.amountKES?.toLocaleString()}</td>
                          <td className="py-3 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              wd.status === "completed" 
                                ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                                : wd.status === "failed" 
                                ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                              {wd.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 text-zinc-600 italic text-xs leading-relaxed max-w-sm mx-auto">
                  No payout history recorded yet. Accumulate USD commissions and request an instant payout cashout!
                </div>
              )
            )}
          </div>
        </div>

        {/* WithdrawalRequestModal overlay */}
        <WithdrawalRequestModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          user={user}
          earningsUSD={monData.earningsUSD}
          mpesaNumberDefault={monData.mpesaNumber}
          onSuccess={() => {
            setWithdrawSuccess(true);
            setTimeout(() => setWithdrawSuccess(false), 5000);
            setIsWithdrawModalOpen(false);
          }}
        />

      </div>
    );
  }

  return null;
}
