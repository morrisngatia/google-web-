import React, { useState, useEffect } from "react";
import { User, ShoppingBag, CreditCard, ShieldCheck, Mail, MapPin, Phone, Trash2, CheckCircle2, ChevronRight, Lock, Loader2, Play, Plus, Minus, X, Truck, Search, Clock, FolderOpen, Coins, Gift, RefreshCw, Sparkles, Copy, Check, Heart } from "lucide-react";
import { Product } from "../data/products";
import CoutureDrive from "./CoutureDrive";

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  items: { name: string; quantity: number; priceKES: number }[];
  totalKES: number;
  date: string;
  paymentMethod: string;
  status: string;
}

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  date: string;
  time: string;
  notes: string;
  status: "Pending" | "Approved" | "Declined";
}

interface CustomerAccountProps {
  key?: any;
  user?: any;
  cart: CartItem[];
  onUpdateCartQty: (productId: string, qty: number) => void;
  onRemoveCartItem: (productId: string) => void;
  onClearCart: () => void;
  bookings: Booking[];
  profile: { name: string; email: string; phone: string; address: string };
  onUpdateProfile: (profile: { name: string; email: string; phone: string; address: string }) => void;
  orders: Order[];
  onAddOrder: (order: Order) => void;
  products?: Product[];
  wishlist?: string[];
  onToggleWishlist?: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  onTriggerToast?: (msg: string) => void;
  onClearAllData?: () => void;
}

export default function CustomerAccount({
  user,
  cart,
  onUpdateCartQty,
  onRemoveCartItem,
  onClearCart,
  bookings,
  profile,
  onUpdateProfile,
  orders,
  onAddOrder,
  products = [],
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  onTriggerToast,
  onClearAllData,
}: CustomerAccountProps) {
  // Navigation tabs within Account (including Moh Coin, Wishlist)
  const [activeSubTab, setActiveSubTab] = useState<"cart" | "profile" | "history" | "bookings" | "tracking" | "drive" | "coin" | "wishlist">("cart");

  // Moh Coins State Management
  const [mohCoins, setMohCoins] = useState<number>(() => {
    const cached = localStorage.getItem("moh_coins_balance");
    return cached ? parseInt(cached, 10) : 100;
  });
  const [lastClaimDate, setLastClaimDate] = useState<string>(() => {
    return localStorage.getItem("moh_coins_last_claim_date") || "";
  });
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralEarnings, setReferralEarnings] = useState<number>(0);
  const [isFetchingCoins, setIsFetchingCoins] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync / retrieve real-time coins balance and affiliate states from Firestore
  useEffect(() => {
    const cached = localStorage.getItem("moh_coins_balance");
    if (cached) {
      setMohCoins(parseInt(cached, 10));
    }

    if (!user) return;
    
    const fetchWallet = async () => {
      setIsFetchingCoins(true);
      try {
        const { db } = await import("../lib/firebase");
        const { doc, getDoc, setDoc, serverTimestamp } = await import("firebase/firestore");
        const userRef = doc(db, "userMonetization", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data) {
            const coinsVal = data.mohCoins !== undefined ? data.mohCoins : 100;
            setMohCoins(coinsVal);
            localStorage.setItem("moh_coins_balance", coinsVal.toString());
            setReferralCode(data.referralCode || "");
            setReferralEarnings(data.earningsUSD || 0);
          }
        } else {
          // Initialize userMonetization document for new user
          const initialCode = "MOH-REF-" + Math.floor(10000 + Math.random() * 90000);
          const initialCoins = cached ? parseInt(cached, 10) : 100;
          await setDoc(userRef, {
            mohCoins: initialCoins,
            referralCode: initialCode,
            earningsUSD: 0,
            createdAt: serverTimestamp()
          });
          setReferralCode(initialCode);
          setMohCoins(initialCoins);
          localStorage.setItem("moh_coins_balance", initialCoins.toString());
        }
      } catch (e) {
        console.warn("Deferred fetching wallet from Firestore:", e);
      } finally {
        setIsFetchingCoins(false);
      }
    };
    
    fetchWallet();
  }, [user]);

  const [claimSuccess, setClaimSuccess] = useState(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const lastClaim = localStorage.getItem("moh_coins_last_claim_date") || "";
    return lastClaim === todayStr;
  });

  // Persist mohCoins balance to localStorage on state changes
  useEffect(() => {
    localStorage.setItem("moh_coins_balance", mohCoins.toString());
  }, [mohCoins]);

  const handleClaimDailyCoins = async () => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (lastClaimDate === todayStr) {
      if (onTriggerToast) {
        onTriggerToast("Already Claimed Today!");
      }
      return;
    }

    setClaimLoading(true);
    // Simulate premium visual load feedback for 400ms
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const updatedCoins = mohCoins + 10;
    setMohCoins(updatedCoins);
    localStorage.setItem("moh_coins_balance", updatedCoins.toString());
    setLastClaimDate(todayStr);
    localStorage.setItem("moh_coins_last_claim_date", todayStr);

    if (user) {
      try {
        const { db } = await import("../lib/firebase");
        const { doc, updateDoc, increment, collection, addDoc, serverTimestamp } = await import("firebase/firestore");
        
        const userRef = doc(db, "userMonetization", user.uid);
        await updateDoc(userRef, {
          mohCoins: increment(10)
        });
        
        // Record Coin Activity
        await addDoc(collection(db, "coinActivities"), {
          userName: profile.name || "A Nairobi Icon",
          action: "Watched a tutorial", // Watched a tutorial reward
          amount: 10,
          timestamp: serverTimestamp(),
          detail: "Claimed Daily Loyalty check-in bonus"
        });
      } catch (e) {
        console.warn("Firebase sync deferred:", e);
      }
    }
    
    setClaimSuccess(true);
    setClaimLoading(false);
    if (onTriggerToast) {
      onTriggerToast("Claimed 10 MOH Coins!");
    }
  };

  const handleRedeemCoins = async (coinsCost: number, valueKES: number, rewardTitle: string) => {
    if (mohCoins < coinsCost) {
      if (onTriggerToast) {
        onTriggerToast("Insufficient Coins Balance!");
      } else {
        alert("You need more Moh Coins to redeem this reward!");
      }
      return;
    }
    
    setIsFetchingCoins(true);
    try {
      if (user) {
        const { db } = await import("../lib/firebase");
        const { doc, updateDoc, increment, collection, addDoc, serverTimestamp } = await import("firebase/firestore");
        
        const userRef = doc(db, "userMonetization", user.uid);
        await updateDoc(userRef, {
          mohCoins: increment(-coinsCost)
        });
        
        // Record Coin Activity
        await addDoc(collection(db, "coinActivities"), {
          userName: profile.name || "A Nairobi Icon",
          action: "Purchased item",
          amount: -coinsCost,
          timestamp: serverTimestamp(),
          detail: `Redeemed ${coinsCost} Moh Coins for: ${rewardTitle}`
        });
      }
      
      // Update local state
      const nextCoins = mohCoins - coinsCost;
      setMohCoins(nextCoins);
      localStorage.setItem("moh_coins_balance", nextCoins.toString());
      
      // Generate custom voucher code
      const voucherCode = `MOH-${rewardTitle.replace(/\s+/g, "").substring(0, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setRedeemSuccessMsg(`Successfully redeemed! Use voucher code: ${voucherCode} at checkout for your reward!`);
      setTimeout(() => setRedeemSuccessMsg(null), 10000);
      
      if (onTriggerToast) {
        onTriggerToast("Voucher Redeemed!");
      }
    } catch (e) {
      console.warn("Failed to redeem coins, using offline fallback:", e);
      // Fallback
      const nextCoins = mohCoins - coinsCost;
      setMohCoins(nextCoins);
      localStorage.setItem("moh_coins_balance", nextCoins.toString());
      
      const voucherCode = `MOH-${rewardTitle.replace(/\s+/g, "").substring(0, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setRedeemSuccessMsg(`Successfully redeemed offline! Use voucher code: ${voucherCode} at checkout!`);
      setTimeout(() => setRedeemSuccessMsg(null), 10000);
      
      if (onTriggerToast) {
        onTriggerToast("Voucher Redeemed!");
      }
    } finally {
      setIsFetchingCoins(false);
    }
  };

  // Profile Form States
  const [profName, setProfName] = useState(profile.name);
  const [profEmail, setProfEmail] = useState(profile.email);
  const [profPhone, setProfPhone] = useState(profile.phone);
  const [profAddress, setProfAddress] = useState(profile.address);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Checkout Wizard States
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"form" | "payment" | "mpesa-processing" | "success">("form");
  const [payMethod, setPayMethod] = useState<"mpesa" | "airtel" | "card" | "paypal" | "crypto">("mpesa");
  const [isDepositOnly, setIsDepositOnly] = useState(false);
  const [cryptoProvider, setCryptoProvider] = useState<"binance" | "bybit">("binance");
  const [cryptoTxId, setCryptoTxId] = useState("");

  // Checkout Form
  const [checkoutName, setCheckoutName] = useState(profile.name);
  const [checkoutPhone, setCheckoutPhone] = useState(profile.phone);
  const [checkoutAddress, setCheckoutAddress] = useState(profile.address);

  // M-Pesa STK Simulator Log
  const [mpesaLog, setMpesaLog] = useState<string[]>([]);
  const [mpesaActiveStep, setMpesaActiveStep] = useState(0);

  // Card Inputs
  const [cardNo, setCardNo] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Order Tracking States
  const [trackOrderIdInput, setTrackOrderIdInput] = useState(() => {
    return localStorage.getItem("moh_track_order_id_input") || "";
  });
  const [searchedOrderId, setSearchedOrderId] = useState(() => {
    return localStorage.getItem("moh_searched_order_id") || "";
  });
  const [trackingResult, setTrackingResult] = useState<{
    orderId: string;
    items: { name: string; quantity: number }[];
    totalKES: number;
    date: string;
    status: "Confirmed" | "Dispatched" | "Out for Delivery" | "Delivered";
    statusUpdateDate: string;
    courierName: string;
    courierPhone: string;
    milestones: { step: number; title: string; description: string; time: string; completed: boolean }[];
  } | null>(() => {
    const cached = localStorage.getItem("moh_tracking_result");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // Fallback
      }
    }
    return null;
  });
  const [trackingError, setTrackingError] = useState("");

  // Dedicated "Track Order" Modal States
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [modalTrackId, setModalTrackId] = useState("");
  const [modalTrackingResult, setModalTrackingResult] = useState<any>(null);
  const [modalTrackingError, setModalTrackingError] = useState("");

  // Core tracking data resolver function
  const getTrackingData = (orderId: string) => {
    const trimmedId = orderId.trim();
    if (!trimmedId) {
      return { error: "Please enter a valid Order ID." };
    }

    if (trimmedId.toUpperCase() === "MOH-TRK-98210") {
      return {
        result: {
          orderId: "MOH-TRK-98210",
          items: [
            { name: "Artisan Hand-Beaded Safari Loafers", quantity: 1 },
            { name: "Oudh Safari Concentrated Extrait de Parfum", quantity: 1 }
          ],
          totalKES: 19300,
          date: "2026-07-11",
          status: "Out for Delivery",
          statusUpdateDate: "July 12, 2026 @ 10:45 AM",
          courierName: "Juma (Moh Express Courier)",
          courierPhone: "0726313043",
          milestones: [
            { step: 1, title: "Order Confirmed", description: "Payment verified. Sizing specs checked and approved.", time: "July 11, 2026 @ 2:30 PM", completed: true },
            { step: 2, title: "Dispatched from Studio", description: "Package sealed and dispatched from Utawala HQ.", time: "July 12, 2026 @ 8:15 AM", completed: true },
            { step: 3, title: "Out for Delivery", description: "Rider Juma is en route to delivery destination.", time: "July 12, 2026 @ 10:45 AM", completed: true },
            { step: 4, title: "Delivered & Signed", description: "Awaiting delivery confirmation hand-over.", time: "Estimated within 2 hours", completed: false }
          ]
        }
      };
    }

    // Look for real orders in customer history
    const matchedOrder = orders.find(o => o.id.toLowerCase() === trimmedId.toLowerCase());
    if (matchedOrder) {
      const isDelivered = matchedOrder.status === "Delivered" || matchedOrder.status?.toLowerCase() === "delivered";
      return {
        result: {
          orderId: matchedOrder.id,
          items: matchedOrder.items.map(i => ({ name: i.name, quantity: i.quantity })),
          totalKES: matchedOrder.totalKES,
          date: matchedOrder.date,
          status: isDelivered ? "Delivered" : "Dispatched",
          statusUpdateDate: `${matchedOrder.date} @ 4:15 PM`,
          courierName: "Kenyan Express Postal / Rider Services",
          courierPhone: "0708063447",
          milestones: [
            { step: 1, title: "Order Confirmed", description: `Payment processed via ${matchedOrder.paymentMethod}.`, time: `${matchedOrder.date} @ 11:30 AM`, completed: true },
            { step: 2, title: "Quality Check & Tailoring", description: "Specs verified by Moh Stylist design lab.", time: `${matchedOrder.date} @ 2:00 PM`, completed: true },
            { step: 3, title: "Dispatched from Utawala Studio", description: "Package was handed over to express delivery partner.", time: `${matchedOrder.date} @ 4:15 PM`, completed: true },
            { step: 4, title: "Out for Delivery & Hand-over", description: "Rider is being assigned for direct delivery.", time: isDelivered ? `${matchedOrder.date} @ 5:30 PM` : "Estimated next morning", completed: isDelivered }
          ]
        }
      };
    }

    return { error: "No order matching this ID was found. If you recently checked out, please double-check the Order ID or click one of our quick tracking templates below." };
  };

  // Helper to open Tracking Modal from anywhere with standard/last/custom tracking number
  const openTrackModal = (initialId?: string) => {
    const savedId = initialId || localStorage.getItem("moh_track_order_id_input") || localStorage.getItem("moh_searched_order_id");
    let targetId = (savedId || "").trim();

    if (!targetId) {
      if (orders && orders.length > 0) {
        targetId = orders[orders.length - 1].id;
      } else {
        targetId = "MOH-TRK-98210";
      }
    }

    setModalTrackId(targetId);
    const res = getTrackingData(targetId);
    if (res.result) {
      setModalTrackingResult(res.result);
      setModalTrackingError("");
    } else {
      setModalTrackingResult(null);
      setModalTrackingError(res.error || "No order found");
    }
    setIsTrackModalOpen(true);
  };

  const totalKES = cart.reduce((acc, curr) => acc + curr.product.priceKES * curr.quantity, 0);
  const totalUSD = cart.reduce((acc, curr) => acc + curr.product.priceUSD * curr.quantity, 0);

  const checkoutKES = isDepositOnly ? Math.round(totalKES * 0.5) : totalKES;
  const checkoutUSD = isDepositOnly ? Math.round(totalUSD * 0.5 * 100) / 100 : totalUSD;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: profName,
      email: profEmail,
      phone: profPhone,
      address: profAddress,
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2000);
  };

  const handleTrackOrder = (orderId: string) => {
    const trimmedId = orderId.trim();
    if (!trimmedId) {
      setTrackingError("Please enter a valid Order ID.");
      setTrackingResult(null);
      localStorage.setItem("moh_track_order_id_input", "");
      localStorage.setItem("moh_searched_order_id", "");
      localStorage.removeItem("moh_tracking_result");
      if (onTriggerToast) onTriggerToast("Tracking Cleared");
      return;
    }

    setSearchedOrderId(trimmedId);
    setTrackingError("");
    localStorage.setItem("moh_track_order_id_input", trimmedId);
    localStorage.setItem("moh_searched_order_id", trimmedId);

    const res = getTrackingData(trimmedId);
    if (res.result) {
      setTrackingResult(res.result);
      localStorage.setItem("moh_tracking_result", JSON.stringify(res.result));
      if (onTriggerToast) onTriggerToast("Tracking Updated!");
    } else {
      setTrackingError(res.error || "No order found");
      setTrackingResult(null);
      localStorage.removeItem("moh_tracking_result");
      if (onTriggerToast) onTriggerToast("Tracking Saved");
    }
  };

  const startCheckout = () => {
    setCheckoutName(profile.name);
    setCheckoutPhone(profile.phone);
    setCheckoutAddress(profile.address);
    setIsCheckingOut(true);
    setCheckoutStep("form");
  };

  const handleCheckoutFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep("payment");
  };

  const awardLoyaltyPoints = async (orderId: string, amountKES: number) => {
    const pointsEarned = Math.floor(amountKES / 100);
    if (pointsEarned > 0 && user) {
      try {
        const { db } = await import("../lib/firebase");
        const { doc, updateDoc, increment, collection, addDoc, serverTimestamp } = await import("firebase/firestore");
        const userRef = doc(db, "userMonetization", user.uid);
        await updateDoc(userRef, {
          mohCoins: increment(pointsEarned)
        });
        
        // Record Coin Activity
        await addDoc(collection(db, "coinActivities"), {
          userName: profile.name || "A Nairobi Icon",
          action: "Made a purchase",
          amount: pointsEarned,
          timestamp: serverTimestamp(),
          detail: `Earned ${pointsEarned} Moh Coins for Order: ${orderId}`
        });
        
        setMohCoins(prev => prev + pointsEarned);
      } catch (err) {
        console.warn("Failed to award coins in DB, updating local state:", err);
        setMohCoins(prev => prev + pointsEarned);
      }
    }
  };

  const handleMpesaPay = async () => {
    setCheckoutStep("mpesa-processing");
    setMpesaActiveStep(0);
    setMpesaLog([]);

    const steps = [
      `Initiating Safaricom M-Pesa STK Push to ${checkoutPhone}...`,
      "STK push packet generated. Handshake complete with Safaricom G2 API.",
      "STK prompt dispatched to customer handset. Awaiting customer entry of M-Pesa PIN...",
      "PIN entered! Processing secure transfer on Safaricom ledger network...",
      `Transaction verified successfully! KES ${checkoutKES.toLocaleString()} deposited. Receipt ID: TKD98H28S2.`
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setMpesaActiveStep(i + 1);
      setMpesaLog((prev) => [...prev, steps[i]]);
    }

    // Complete order
    const completedOrder: Order = {
      id: `ord-${Date.now()}`,
      items: cart.map((c) => ({
        name: c.product.name,
        quantity: c.quantity,
        priceKES: c.product.priceKES,
      })),
      totalKES: checkoutKES,
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "M-Pesa Mobile Money",
      status: isDepositOnly ? "Deposit Paid (50%)" : "Completed",
    };

    await awardLoyaltyPoints(completedOrder.id, checkoutKES);
    onAddOrder(completedOrder);
    onClearCart();
    setCheckoutStep("success");
  };

  const handleAirtelPay = async () => {
    setCheckoutStep("mpesa-processing");
    setMpesaActiveStep(0);
    setMpesaLog([]);

    const steps = [
      `Initiating Airtel Money STK Push to ${checkoutPhone}...`,
      "Airtel money transaction packet generated. Handshake complete with Airtel secure gateway.",
      "Airtel PIN prompt dispatched to customer handset. Please enter your Airtel Money PIN...",
      "PIN verified! Processing transfer on Airtel Money ledger...",
      `Transaction verified successfully! KES ${checkoutKES.toLocaleString()} deposited. Reference ID: ART` + Math.floor(100000 + Math.random() * 900000) + "."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setMpesaActiveStep(i + 1);
      setMpesaLog((prev) => [...prev, steps[i]]);
    }

    // Complete order
    const completedOrder: Order = {
      id: `ord-${Date.now()}`,
      items: cart.map((c) => ({
        name: c.product.name,
        quantity: c.quantity,
        priceKES: c.product.priceKES,
      })),
      totalKES: checkoutKES,
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "Airtel Money Mobile Money",
      status: isDepositOnly ? "Deposit Paid (50%)" : "Completed",
    };

    await awardLoyaltyPoints(completedOrder.id, checkoutKES);
    onAddOrder(completedOrder);
    onClearCart();
    setCheckoutStep("success");
  };

  const handleCardPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep("mpesa-processing");
    setMpesaLog(["Connecting with secured Visa/Mastercard processing network...", "Verifying card authenticity...", `Processing KES ${checkoutKES.toLocaleString()} secure debit...`, "Payment authorized successfully by bank system!"]);
    
    for (let i = 0; i < 4; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMpesaActiveStep(i + 1);
    }

    const completedOrder: Order = {
      id: `ord-${Date.now()}`,
      items: cart.map((c) => ({
        name: c.product.name,
        quantity: c.quantity,
        priceKES: c.product.priceKES,
      })),
      totalKES: checkoutKES,
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "Visa / Mastercard",
      status: isDepositOnly ? "Deposit Paid (50%)" : "Completed",
    };

    await awardLoyaltyPoints(completedOrder.id, checkoutKES);
    onAddOrder(completedOrder);
    onClearCart();
    setCheckoutStep("success");
  };

  const handleCryptoPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cryptoTxId.trim()) return;

    setCheckoutStep("mpesa-processing");
    setMpesaActiveStep(0);
    setMpesaLog([]);

    const steps = [
      `Connecting to ${cryptoProvider === "binance" ? "Binance Pay Network" : "Bybit Wallet Network"}...`,
      `Searching Transaction Hash / Pay ID "${cryptoTxId.trim()}" on-chain...`,
      `Verifying deposit value of $${checkoutUSD.toFixed(2)} USDT (KES ${checkoutKES.toLocaleString()})...`,
      "Transaction confirmed on the distributed ledger. Block state validated.",
      `Payment of $${checkoutUSD.toFixed(2)} USDT successfully matched and approved!`
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setMpesaActiveStep(i + 1);
      setMpesaLog((prev) => [...prev, steps[i]]);
    }

    const completedOrder: Order = {
      id: `ord-${Date.now()}`,
      items: cart.map((c) => ({
        name: c.product.name,
        quantity: c.quantity,
        priceKES: c.product.priceKES,
      })),
      totalKES: checkoutKES,
      date: new Date().toISOString().split("T")[0],
      paymentMethod: `${cryptoProvider === "binance" ? "Binance Pay" : "Bybit Wallet"} (USDT Crypto)`,
      status: isDepositOnly ? "Deposit Paid (50%)" : "Completed",
    };

    await awardLoyaltyPoints(completedOrder.id, checkoutKES);
    onAddOrder(completedOrder);
    onClearCart();
    setCheckoutStep("success");
    setCryptoTxId("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16 space-y-10 text-white">
      {/* Account Title */}
      <div className="border-b border-zinc-900 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs text-accent font-bold tracking-widest uppercase">Moh Stylist Client Portal</span>
          <h2 className="text-3xl font-bold font-display text-white mt-1">SECURE PORTAL</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-2 md:mt-0">
          <button
            onClick={() => openTrackModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 border border-amber-500/30 hover:border-amber-500/60 rounded-xl text-xs font-semibold text-amber-400 transition-all cursor-pointer shadow-lg shadow-amber-500/5 hover:-translate-y-0.5 duration-200"
            id="track-order-header-btn"
          >
            <Truck className="h-4 w-4 text-amber-500 animate-pulse" />
            <span>Track Bespoke Order</span>
          </button>
          
          <div className="flex items-center space-x-2 text-xs text-zinc-400">
            <User className="h-4.5 w-4.5 text-accent" />
            <span>Review your shopping cart, order logs, profile settings, and bookings</span>
          </div>
        </div>
      </div>

      {/* Account layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation panel */}
        <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-4 space-y-2 h-fit shadow-xl">
          <button
            onClick={() => setActiveSubTab("cart")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors cursor-pointer ${
              activeSubTab === "cart" ? "bg-accent text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span>Shopping Cart ({cart.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("wishlist")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors cursor-pointer ${
              activeSubTab === "wishlist" ? "bg-accent text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Heart className="h-4.5 w-4.5" />
            <span>My Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("coin")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors cursor-pointer ${
              activeSubTab === "coin" ? "bg-accent text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Coins className="h-4.5 w-4.5" />
            <span>Moh Coins Wallet</span>
          </button>

          <button
            onClick={() => setActiveSubTab("profile")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors cursor-pointer ${
              activeSubTab === "profile" ? "bg-accent text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <User className="h-4.5 w-4.5" />
            <span>Client Profile</span>
          </button>

          <button
            onClick={() => setActiveSubTab("bookings")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors cursor-pointer ${
              activeSubTab === "bookings" ? "bg-accent text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <CheckCircle2 className="h-4.5 w-4.5" />
            <span>Your Appointments ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("history")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors cursor-pointer ${
              activeSubTab === "history" ? "bg-accent text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <CreditCard className="h-4.5 w-4.5" />
            <span>Receipts & Order Logs ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("tracking")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors cursor-pointer ${
              activeSubTab === "tracking" ? "bg-accent text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Truck className="h-4.5 w-4.5" />
            <span>Order Tracking</span>
          </button>

          <button
            onClick={() => setActiveSubTab("drive")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors cursor-pointer ${
              activeSubTab === "drive" ? "bg-accent text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <FolderOpen className="h-4.5 w-4.5" />
            <span>Couture Design Drive</span>
          </button>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3">
          {/* MOH COIN LOYALTY WALLET */}
          {activeSubTab === "coin" && (
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-900 pb-5 gap-4">
                <div>
                  <h3 className="text-md font-semibold uppercase tracking-wider text-accent font-display">Moh Coins Loyalty Wallet</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Your luxury styling and marketplace rewards console.</p>
                </div>
                <div className="flex items-center space-x-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-850">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-zinc-400">LEDGER SYNCED</span>
                </div>
              </div>

              {/* Coins Balance Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-accent/20 p-6 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Visual Glow */}
                <div className="absolute -right-12 -bottom-12 h-44 w-44 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-2xl text-accent">
                    <Coins className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 uppercase tracking-widest font-mono font-bold">Available Balance</span>
                    {isFetchingCoins ? (
                      <div className="flex items-center space-x-2 mt-1">
                        <Loader2 className="h-5 w-5 animate-spin text-accent" />
                        <span className="text-zinc-500 text-xs">Querying database ledger...</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-4xl font-black font-mono text-white tracking-tight">{mohCoins}</span>
                        <span className="text-sm font-extrabold text-accent">MOH</span>
                      </div>
                    )}
                    <span className="text-[10px] text-zinc-500 font-medium block mt-1">Estimated conversion value: <span className="text-zinc-300 font-bold">KES {(mohCoins * 5).toLocaleString()}</span> (1 MOH = 5 KES)</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={handleClaimDailyCoins}
                    disabled={claimLoading}
                    className="px-4 py-2.5 bg-accent hover:bg-accent-hover text-black rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 duration-200 shadow-md shadow-accent/5 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {claimLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : claimSuccess ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    <span>{claimSuccess ? "Claimed +10 MOH" : "Claim Daily 10 MOH"}</span>
                  </button>

                  <button
                    onClick={() => {
                      const refUrl = `${window.location.origin}/?ref=${referralCode || "LAMOH77"}`;
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(refUrl);
                      } else {
                        const textArea = document.createElement("textarea");
                        textArea.value = refUrl;
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
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold border border-zinc-800 transition-all hover:scale-105 active:scale-95 duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {copiedLink ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedLink ? "Link Copied!" : "Referral Link"}</span>
                  </button>
                </div>
              </div>

              {redeemSuccessMsg && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold font-sans flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{redeemSuccessMsg}</span>
                </div>
              )}

              {/* Earn Tasks Grid */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Earn More Moh Coins</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/10 space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-accent">Affiliate Referrals</span>
                    <h5 className="text-xs font-bold text-white">Refer styling clients</h5>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">Earn 100 Moh Coins and commissions instantly when someone signs up using your code.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/10 space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-accent">Creative Drive</span>
                    <h5 className="text-xs font-bold text-white">Purchase items</h5>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">Get 1 Moh Coin for every 100 KES spent on couture outerwear, skincare, or bookings.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/10 space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-accent">Video Tutorials</span>
                    <h5 className="text-xs font-bold text-white">Watch Moh TV runway tutorials</h5>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">Earn 15 Moh Coins for every runway showcase or makeup masterclass video tutorial completed.</p>
                  </div>
                </div>
              </div>

              {/* Spend Coins Vouchers Shop */}
              <div className="space-y-4">
                <div className="border-t border-zinc-900 pt-6">
                  <h4 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Redeem Moh Coins for Luxury Vouchers</h4>
                  <p className="text-[11px] text-zinc-500 mt-1">Convert your coins into instant discounts, shopping vouchers, or VIP experiences.</p>
                </div>

                <div className="divide-y divide-zinc-900">
                  <div className="py-4 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white">KES 500 Discount Voucher</h5>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Applicable on any physical boutique purchase or booking.</p>
                    </div>
                    <button
                      onClick={() => handleRedeemCoins(100, 500, "KES 500 Discount")}
                      disabled={mohCoins < 100}
                      className="px-3.5 py-1.5 rounded-lg border font-bold text-[11px] uppercase tracking-wide duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-zinc-950 text-accent border-accent/20 hover:border-accent hover:bg-accent/5"
                    >
                      Redeem 100 Coins
                    </button>
                  </div>

                  <div className="py-4 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white">KES 1,200 Discount Voucher</h5>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Applicable on premium couture outerwear and blazers.</p>
                    </div>
                    <button
                      onClick={() => handleRedeemCoins(200, 1200, "KES 1200 Discount")}
                      disabled={mohCoins < 200}
                      className="px-3.5 py-1.5 rounded-lg border font-bold text-[11px] uppercase tracking-wide duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-zinc-950 text-accent border-accent/20 hover:border-accent hover:bg-accent/5"
                    >
                      Redeem 200 Coins
                    </button>
                  </div>

                  <div className="py-4 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white">Free Bespoke VIP Fitting & Makeover</h5>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Complimentary 1-hour styling appointment and bespoke measurement taking.</p>
                    </div>
                    <button
                      onClick={() => handleRedeemCoins(500, 4500, "Free VIP Studio Session")}
                      disabled={mohCoins < 500}
                      className="px-3.5 py-1.5 rounded-lg border font-bold text-[11px] uppercase tracking-wide duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-zinc-950 text-accent border-accent/20 hover:border-accent hover:bg-accent/5"
                    >
                      Redeem 500 Coins
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WISHLIST VIEW */}
          {activeSubTab === "wishlist" && (
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <div>
                  <h3 className="text-lg font-semibold uppercase tracking-wider text-accent font-display">My Wishlist</h3>
                  <p className="text-xs text-zinc-400 mt-1">Manage and save your favorite styling and couture apparel pieces</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold">
                  {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
                </span>
              </div>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products
                    .filter((p) => wishlist.includes(p.id))
                    .map((product) => (
                      <div
                        key={product.id}
                        className="group bg-zinc-900/40 border border-zinc-900 hover:border-accent/30 transition-all duration-300 rounded-xl overflow-hidden flex flex-col h-full"
                      >
                        {/* Product Image */}
                        <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-500"
                          />
                          <button
                            onClick={() => onToggleWishlist && onToggleWishlist(product.id)}
                            className="absolute top-3 right-3 p-2 rounded-full bg-black/85 hover:bg-black border border-zinc-800 hover:border-accent text-accent transition-all cursor-pointer z-10"
                            title="Remove from Wishlist"
                          >
                            <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300" />
                          </button>
                          <div className="absolute top-3 left-3 bg-black/95 border border-accent/20 px-2 py-0.5 text-[8px] text-accent tracking-widest uppercase font-semibold">
                            {product.brand}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <span className="text-[8px] uppercase text-zinc-500 tracking-widest block">{product.category}</span>
                            <h4 className="font-semibold text-xs text-white line-clamp-1 mt-0.5">{product.name}</h4>
                            <div className="flex items-baseline space-x-1.5 mt-1">
                              <span className="text-xs text-white font-mono font-bold">KES {product.priceKES.toLocaleString()}</span>
                              <span className="text-[9px] text-accent font-mono">${product.priceUSD.toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 pt-2 border-t border-zinc-900/60">
                            {onAddToCart && !product.isService && product.inStock ? (
                              <button
                                onClick={() => onAddToCart(product)}
                                className="flex-1 py-1.5 bg-accent hover:bg-accent-hover text-black text-[10px] font-bold uppercase tracking-wider transition-all duration-200 rounded flex items-center justify-center space-x-1 cursor-pointer"
                              >
                                <ShoppingBag className="h-3.5 w-3.5" />
                                <span>Add to Cart</span>
                              </button>
                            ) : (
                              <div className="flex-1 text-center py-1.5 bg-zinc-900 text-zinc-500 text-[9px] font-semibold uppercase tracking-wider border border-zinc-850 rounded">
                                {product.isService ? "Service Only" : "Sold Out"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">Your Wishlist is Empty</h4>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">Save your highly coveted couture apparel and styling services by clicking the heart button on product cards.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CART VIEW */}
          {activeSubTab === "cart" && (
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-6">
              <h3 className="text-md font-semibold uppercase tracking-wider text-amber-500 font-display">Client Shopping Cart</h3>

              {cart.length > 0 ? (
                <div className="space-y-6">
                  <div className="divide-y divide-zinc-900 overflow-hidden">
                    {cart.map((item) => (
                      <div key={item.product.id} className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-14 w-14 object-cover rounded bg-zinc-900 shrink-0"
                          />
                          <div>
                            <span className="text-[10px] text-zinc-500 font-mono block uppercase">{item.product.category}</span>
                            <h4 className="font-semibold text-xs text-white max-w-[15rem] truncate">{item.product.name}</h4>
                            <span className="text-[10px] text-zinc-500 block font-mono">KES {item.product.priceKES.toLocaleString()} / item</span>
                          </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center bg-zinc-900 rounded-lg p-1 border border-zinc-850">
                            <button
                              onClick={() => onUpdateCartQty(item.product.id, item.quantity - 1)}
                              className="p-1 hover:text-amber-400 cursor-pointer"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2.5 text-xs font-semibold font-mono">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateCartQty(item.product.id, item.quantity + 1)}
                              className="p-1 hover:text-amber-400 cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="block text-xs font-bold text-zinc-200 font-mono">KES {(item.product.priceKES * item.quantity).toLocaleString()}</span>
                            <span className="block text-[10px] text-amber-500/85 font-mono">${(item.product.priceUSD * item.quantity).toFixed(2)}</span>
                          </div>

                          <button
                            onClick={() => onRemoveCartItem(item.product.id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary card */}
                  <div className="p-6 bg-zinc-900/40 rounded-xl border border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-zinc-500 uppercase tracking-widest block">Total Checkout Price</span>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold font-mono text-white">KES {totalKES.toLocaleString()}</span>
                        <span className="text-xs font-semibold font-mono text-amber-400">${totalUSD.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={startCheckout}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold text-xs rounded-xl hover:scale-105 active:scale-95 duration-200 shadow-md shadow-amber-500/10 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Lock className="h-4 w-4" />
                      <span>Secure Checkout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-zinc-500 italic text-xs">Your styling cart is empty. Explore our marketplace and select items to add!</div>
              )}
            </div>
          )}

          {/* SECURE CHECKOUT PROCESS MODAL */}
          {isCheckingOut && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 overflow-y-auto">
              <div className="w-full max-w-xl bg-zinc-950 border border-amber-500/20 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
                <button
                  onClick={() => setIsCheckingOut(false)}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                >
                  <X className="h-5.5 w-5.5" />
                </button>

                <h3 className="text-lg font-bold font-display text-amber-500 border-b border-zinc-900 pb-3 uppercase tracking-wider flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-amber-500" />
                  <span>Secure Marketplace Checkout</span>
                </h3>

                {/* STEP 1: Address and personal details */}
                {checkoutStep === "form" && (
                  <form onSubmit={handleCheckoutFormSubmit} className="space-y-4 text-xs">
                    <h4 className="font-semibold text-zinc-300">1. Delivery / Client Details</h4>
                    
                    <div className="space-y-1">
                      <label className="text-zinc-400">Recipient Name *</label>
                      <input
                        type="text"
                        required
                        value={checkoutName}
                        onChange={(e) => setCheckoutName(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-zinc-400">Kenyan Mobile Number (M-Pesa push) *</label>
                        <input
                          type="text"
                          required
                          value={checkoutPhone}
                          onChange={(e) => setCheckoutPhone(e.target.value)}
                          placeholder="e.g. 0708063447"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-zinc-400">Delivery Address / Office Location *</label>
                        <input
                          type="text"
                          required
                          value={checkoutAddress}
                          onChange={(e) => setCheckoutAddress(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-lg hover:scale-105 active:scale-95 duration-200 cursor-pointer"
                    >
                      Continue to Payment options
                    </button>
                  </form>
                )}

                {/* STEP 2: Choose Payment & checkout */}
                {checkoutStep === "payment" && (
                  <div className="space-y-6">
                    <h4 className="font-semibold text-zinc-300 text-xs flex items-center justify-between">
                      <span>2. Complete Payment Plan</span>
                      <span className="text-amber-400 font-mono">KES {checkoutKES.toLocaleString()}</span>
                    </h4>

                    {/* Pay Full vs Pay 50% Deposit Selection */}
                    <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-850 space-y-3">
                      <span className="block text-[10px] text-amber-500 font-bold uppercase tracking-wider">Choose Payment Structure</span>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setIsDepositOnly(false)}
                          className={`p-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                            !isDepositOnly
                              ? "bg-amber-400/10 border-amber-500 text-amber-400"
                              : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white"
                          }`}
                        >
                          <span className="font-bold">Full Payment</span>
                          <span className="text-[10px] font-mono opacity-85">KES {totalKES.toLocaleString()}</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setIsDepositOnly(true)}
                          className={`p-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                            isDepositOnly
                              ? "bg-amber-400/10 border-amber-500 text-amber-400"
                              : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white"
                          }`}
                        >
                          <span className="font-bold">Pay 50% Deposit</span>
                          <span className="text-[10px] font-mono opacity-85">KES {Math.round(totalKES * 0.5).toLocaleString()}</span>
                        </button>
                      </div>
                      <p className="text-[9px] text-zinc-400 text-center">
                        {isDepositOnly 
                          ? "🛡️ Book with a 50% deposit now. Clear the remaining balance during styling fitting or courier receipt!" 
                          : "🚀 Pay in full today. Speeds up instant dispatch, custom packaging, and VIP priority scheduling."}
                      </p>
                    </div>

                    {/* Selector */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <button
                        onClick={() => setPayMethod("mpesa")}
                        className={`py-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                          payMethod === "mpesa"
                            ? "bg-green-500/10 border-green-500 text-green-400"
                            : "bg-zinc-900 border-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                        <span>M-Pesa Pay</span>
                      </button>

                      <button
                        onClick={() => setPayMethod("airtel")}
                        className={`py-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                          payMethod === "airtel"
                            ? "bg-red-500/10 border-red-500 text-red-400"
                            : "bg-zinc-900 border-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                        <span>Airtel Money</span>
                      </button>

                      <button
                        onClick={() => setPayMethod("card")}
                        className={`py-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                          payMethod === "card"
                            ? "bg-amber-500/10 border-amber-500 text-amber-400"
                            : "bg-zinc-900 border-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <CreditCard className="h-4.5 w-4.5" />
                        <span>Credit Card</span>
                      </button>

                      <button
                        onClick={() => setPayMethod("paypal")}
                        className={`py-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                          payMethod === "paypal"
                            ? "bg-blue-500/10 border-blue-500 text-blue-400"
                            : "bg-zinc-900 border-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span className="text-[10px] italic font-bold text-blue-400">PayPal</span>
                        <span>PayPal Express</span>
                      </button>

                      <button
                        onClick={() => setPayMethod("crypto")}
                        className={`py-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                          payMethod === "crypto"
                            ? "bg-yellow-500/10 border-yellow-500 text-yellow-400"
                            : "bg-zinc-900 border-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                        <span>Crypto Pay</span>
                      </button>
                    </div>

                    {/* PAYMENT METHOD DETAILED FORMS */}
                    {payMethod === "mpesa" && (
                      <div className="space-y-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 text-xs">
                        <div className="flex items-center space-x-2 text-green-400 font-semibold mb-1">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Simulated Safaricom Lipa na M-Pesa</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          We will initiate a simulated STK Push transaction of <strong>KES {checkoutKES.toLocaleString()}</strong> directly to <strong>{checkoutPhone}</strong>. Have your phone handy to accept.
                        </p>
                        <button
                          onClick={handleMpesaPay}
                          className="w-full py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <span>Initiate M-Pesa STK Push (KES {checkoutKES.toLocaleString()})</span>
                        </button>
                      </div>
                    )}

                    {payMethod === "airtel" && (
                      <div className="space-y-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 text-xs">
                        <div className="flex items-center space-x-2 text-red-400 font-semibold mb-1">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Simulated Airtel Money Payment</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          We will initiate a simulated Airtel Money STK Push transaction of <strong>KES {checkoutKES.toLocaleString()}</strong> directly to <strong>{checkoutPhone}</strong>. Please have your handset ready.
                        </p>
                        <button
                          onClick={handleAirtelPay}
                          className="w-full py-3 bg-red-500 text-black font-semibold rounded-lg hover:bg-red-400 duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <span>Initiate Airtel Money STK Push (KES {checkoutKES.toLocaleString()})</span>
                        </button>
                      </div>
                    )}

                    {payMethod === "card" && (
                      <form onSubmit={handleCardPay} className="space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 text-xs">
                        <div className="space-y-1">
                          <label className="text-zinc-400">Cardholder Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., Jane Wanjiru"
                            className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-zinc-400">Card Number</label>
                          <input
                            type="text"
                            required
                            value={cardNo}
                            onChange={(e) => setCardNo(e.target.value)}
                            placeholder="4000 1234 5678 9010"
                            className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-zinc-400">Expiry MM/YY</label>
                            <input
                              type="text"
                              required
                              value={cardExp}
                              onChange={(e) => setCardExp(e.target.value)}
                              placeholder="09/28"
                              className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-zinc-400">CVV</label>
                            <input
                              type="password"
                              required
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="***"
                              maxLength={3}
                              className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-lg hover:brightness-110 duration-250 cursor-pointer"
                        >
                          Debit KES {checkoutKES.toLocaleString()} Card
                        </button>
                      </form>
                    )}

                    {payMethod === "paypal" && (
                      <div className="space-y-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 text-xs text-center">
                        <div className="text-blue-400 font-bold italic text-base">PayPal EXPRESS</div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed max-w-sm mx-auto">
                          Sign in to your PayPal account to finalize this transaction in US Dollars (<strong>${checkoutUSD.toFixed(2)}</strong> equivalent).
                        </p>
                        <button
                          onClick={handleMpesaPay} // reuse same completion animation
                          className="w-full py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg duration-200 cursor-pointer"
                        >
                          Checkout with PayPal Express (${checkoutUSD.toFixed(2)})
                        </button>
                      </div>
                    )}

                    {payMethod === "crypto" && (
                      <div className="space-y-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-amber-400 font-semibold text-xs uppercase tracking-wider">🔒 Secure Crypto Gateway</span>
                          <span className="text-zinc-500 font-mono text-[10px]">1 USDT ≈ 1 USD</span>
                        </div>

                        {/* Wallet Provider Selector */}
                        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-lg border border-zinc-900">
                          <button
                            type="button"
                            onClick={() => setCryptoProvider("binance")}
                            className={`py-2 rounded-md font-semibold text-[11px] transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                              cryptoProvider === "binance"
                                ? "bg-amber-400 text-black font-bold shadow"
                                : "text-zinc-400 hover:text-white"
                            }`}
                          >
                            <span>Binance Pay</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCryptoProvider("bybit")}
                            className={`py-2 rounded-md font-semibold text-[11px] transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                              cryptoProvider === "bybit"
                                ? "bg-amber-400 text-black font-bold shadow"
                                : "text-zinc-400 hover:text-white"
                            }`}
                          >
                            <span>Bybit Wallet</span>
                          </button>
                        </div>

                        {cryptoProvider === "binance" ? (
                          <div className="space-y-3 bg-zinc-950/60 p-4 rounded-lg border border-zinc-900">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-zinc-400 font-medium">Total Crypto Due:</span>
                              <span className="text-amber-400 font-mono font-bold text-sm">${checkoutUSD.toFixed(2)} USDT</span>
                            </div>
                            <div className="text-center py-2 space-y-2">
                              {/* QR Code Container */}
                              <div className="mx-auto w-32 h-32 bg-white p-2 rounded-lg flex items-center justify-center border border-zinc-800 shadow-inner">
                                <img
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=binance://pay?address=0x71C7656EC7ab88b098defB751B7401B5f6d8976F&amount=${checkoutUSD}`}
                                  alt="Binance Pay QR Code"
                                  className="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <p className="text-[10px] text-zinc-500">Scan using Binance App or transfer to the address below</p>
                            </div>

                            <div className="space-y-1">
                              <span className="block text-[9px] text-zinc-500 uppercase font-mono">Binance Smart Chain (BSC BEP-20) Address</span>
                              <div className="flex items-center space-x-2 bg-zinc-900 p-2 rounded border border-zinc-850">
                                <code className="text-[10px] text-amber-400 truncate flex-1 select-all">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</code>
                                <button
                                  type="button"
                                  onClick={() => navigator.clipboard.writeText("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")}
                                  className="text-amber-500 hover:text-amber-400 text-[10px] font-mono cursor-pointer bg-zinc-950 px-2 py-1 rounded"
                                >
                                  Copy
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 bg-zinc-950/60 p-4 rounded-lg border border-zinc-900">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-zinc-400 font-medium">Total Crypto Due:</span>
                              <span className="text-amber-400 font-mono font-bold text-sm">${checkoutUSD.toFixed(2)} USDT</span>
                            </div>
                            <div className="text-center py-2 space-y-2">
                              {/* QR Code Container */}
                              <div className="mx-auto w-32 h-32 bg-white p-2 rounded-lg flex items-center justify-center border border-zinc-800 shadow-inner">
                                <img
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bybit://pay?address=0x89205A21397959c67e12e352512F2012B543Dce3&amount=${checkoutUSD}`}
                                  alt="Bybit QR Code"
                                  className="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <p className="text-[10px] text-zinc-500">Scan using Bybit App or transfer to the address below</p>
                            </div>

                            <div className="space-y-1">
                              <span className="block text-[9px] text-zinc-500 uppercase font-mono">TRON Network (TRC-20) Address</span>
                              <div className="flex items-center space-x-2 bg-zinc-900 p-2 rounded border border-zinc-850">
                                <code className="text-[10px] text-amber-400 truncate flex-1 select-all">0x89205A21397959c67e12e352512F2012B543Dce3</code>
                                <button
                                  type="button"
                                  onClick={() => navigator.clipboard.writeText("0x89205A21397959c67e12e352512F2012B543Dce3")}
                                  className="text-amber-500 hover:text-amber-400 text-[10px] font-mono cursor-pointer bg-zinc-950 px-2 py-1 rounded"
                                >
                                  Copy
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Verification Field */}
                        <form onSubmit={handleCryptoPay} className="space-y-3 pt-2">
                          <div className="space-y-1">
                            <label className="text-[10px] text-zinc-400 uppercase font-mono block">Transaction Hash (TxHash) / Pay ID</label>
                            <input
                              type="text"
                              required
                              value={cryptoTxId}
                              onChange={(e) => setCryptoTxId(e.target.value)}
                              placeholder="e.g. 0x3d9a7c... or Binance Order ID"
                              className="w-full bg-zinc-900 border border-zinc-850 rounded p-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-lg hover:brightness-110 transition-all duration-200 cursor-pointer text-xs"
                          >
                            Verify and Confirm Crypto Payment (${checkoutUSD.toFixed(2)} USDT)
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: M-Pesa processing terminal log */}
                {checkoutStep === "mpesa-processing" && (
                  <div className="space-y-6 text-xs font-mono py-4">
                    <h4 className="font-semibold text-zinc-300 font-sans">Payment Transaction Terminal</h4>

                    {/* Terminal Window */}
                    <div className="bg-black p-4 rounded-xl border border-zinc-900 min-h-[10rem] flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        {mpesaLog.map((log, lIdx) => (
                          <div key={lIdx} className="flex items-start space-x-2 text-zinc-300">
                            <span className="text-green-500 font-bold shrink-0">&gt;</span>
                            <span className="text-[11px]">{log}</span>
                          </div>
                        ))}
                      </div>

                      {mpesaActiveStep < 5 && (
                        <div className="flex items-center space-x-2 text-zinc-500 italic text-[11px] pt-2">
                          <Loader2 className="h-4.5 w-4.5 text-amber-500 animate-spin" />
                          <span>
                            {payMethod === "mpesa" && "Awaiting Safaricom M-Pesa API callback payload..."}
                            {payMethod === "airtel" && "Awaiting Airtel Money secure API callback..."}
                            {payMethod === "card" && "Awaiting card processing bank authorization response..."}
                            {payMethod === "paypal" && "Awaiting PayPal transaction clearing gateway..."}
                            {payMethod === "crypto" && "Awaiting decentralized block confirmation validation..."}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 4: Success confirmation */}
                {checkoutStep === "success" && (
                  <div className="text-center py-10 space-y-5 text-xs">
                    <div className="h-14 w-14 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="h-8 w-8 text-green-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-md font-bold text-white uppercase tracking-wide">Payment Authorized!</h4>
                      <p className="text-zinc-400">Thank you for shopping at Moh Stylist, your order has been received.</p>
                    </div>

                    {Math.floor(checkoutKES / 100) > 0 && (
                      <div className="bg-amber-400/5 border border-amber-500/15 text-amber-400 px-4 py-3 rounded-2xl max-w-sm mx-auto space-y-1 text-center">
                        <div className="flex items-center justify-center space-x-1.5 font-bold uppercase tracking-wider text-[10px]">
                          <Coins className="h-3.5 w-3.5 animate-pulse text-[#D4AF37]" />
                          <span>Loyalty points earned!</span>
                        </div>
                        <p className="text-[11px] text-zinc-300 font-sans">
                          You received <span className="font-bold text-amber-400">+{Math.floor(checkoutKES / 100)} Moh Coins</span> from this order! Visit your Wallet to redeem coins for bespoke vouchers.
                        </p>
                      </div>
                    )}

                    <p className="text-[10px] text-amber-400/80 font-semibold font-mono">Simulated Receipt No: TKD98H28S2 | Status: Processing</p>

                    <div>
                      <button
                        onClick={() => setIsCheckingOut(false)}
                        className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:text-white text-zinc-400 cursor-pointer hover:bg-zinc-850 duration-150"
                      >
                        Close Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeSubTab === "profile" && (
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-6">
              <h3 className="text-md font-semibold uppercase tracking-wider text-amber-500 font-display">Client Profile Details</h3>

              {profileSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-lg text-xs flex items-center space-x-2">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                  <span>Profile details updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-400">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={profName}
                      onChange={(e) => setProfName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-400">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={profEmail}
                      onChange={(e) => setProfEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-400">Kenyan Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={profPhone}
                      onChange={(e) => setProfPhone(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-400">Default Shipping Address *</label>
                    <input
                      type="text"
                      required
                      value={profAddress}
                      onChange={(e) => setProfAddress(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-lg hover:scale-105 active:scale-95 duration-200 cursor-pointer"
                >
                  Save Profile Settings
                </button>
              </form>
            </div>
          )}

          {/* APPOINTMENTS TAB */}
          {activeSubTab === "bookings" && (
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-6">
              <h3 className="text-md font-semibold uppercase tracking-wider text-amber-500 font-display">Your Studio Appointments</h3>

              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((book) => (
                    <div
                      key={book.id}
                      className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{book.serviceName}</h4>
                          <span className="text-[10px] text-zinc-500">Scheduled for {book.customerName}</span>
                        </div>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                            book.status === "Approved"
                              ? "bg-green-500/10 text-green-400"
                              : book.status === "Declined"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-amber-400/10 text-amber-400"
                          }`}
                        >
                          {book.status}
                        </span>
                      </div>

                      <div className="border-t border-zinc-850 pt-2 text-[11px] text-zinc-400 space-y-1 font-mono">
                        <p>Date: {book.date} @ {book.time}</p>
                        <p>Location: Moh Stylist Studio, Near Utawala Shopping Mall, Nairobi</p>
                        {book.notes && <p className="italic text-zinc-500">"My Notes: {book.notes}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic text-center py-10">No appointment bookings placed yet. Check our 'Beauty' category to book styling sessions!</p>
              )}
            </div>
          )}

          {/* HISTORY ORDER RECEIPTS TAB */}
          {activeSubTab === "history" && (
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-6">
              <h3 className="text-md font-semibold uppercase tracking-wider text-amber-500 font-display">Receipts & Order Logs</h3>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-zinc-500 font-mono block uppercase">{ord.date}</span>
                          <h4 className="font-semibold text-white">{ord.id}</h4>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 rounded font-bold uppercase font-mono">
                          {ord.status}
                        </span>
                      </div>

                      <div className="border-t border-zinc-850 pt-2 text-[11px] text-zinc-400 space-y-1">
                        {ord.items.map((it, itIdx) => (
                          <div key={itIdx} className="flex justify-between font-mono">
                            <span>{it.name} (x{it.quantity})</span>
                            <span>KES {it.priceKES.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-zinc-850 pt-2 flex justify-between font-bold text-zinc-200">
                        <span>Total Paid ({ord.paymentMethod})</span>
                        <span className="font-mono text-amber-400">KES {ord.totalKES.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic text-center py-10 font-sans">You haven't checked out any orders yet.</p>
              )}
            </div>
          )}

          {/* ORDER TRACKING TAB */}
          {activeSubTab === "tracking" && (
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-md font-semibold uppercase tracking-wider text-amber-500 font-display">Couture Dispatch & Tracking</h3>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">Locate and monitor your bespoke orders en route from our Utawala styling studio directly to your doorstep.</p>
                </div>
                <Truck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              </div>

              {/* Search Box Form */}
              <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900 space-y-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleTrackOrder(trackOrderIdInput);
                  }}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      value={trackOrderIdInput}
                      onChange={(e) => setTrackOrderIdInput(e.target.value)}
                      placeholder="Enter Order ID (e.g., ord-... or MOH-TRK-98210)"
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/40 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold text-xs rounded-xl hover:brightness-110 active:scale-95 duration-200 flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Track Order</span>
                  </button>
                </form>

                {/* Tracking Presets */}
                <div className="text-[11px] space-y-2">
                  <span className="text-zinc-500 block font-semibold">Quick Track References:</span>
                  <div className="flex flex-wrap gap-2">
                    {/* Real orders if any */}
                    {orders.map((ord) => (
                      <button
                        key={ord.id}
                        onClick={() => {
                          setTrackOrderIdInput(ord.id);
                          handleTrackOrder(ord.id);
                        }}
                        className="px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-amber-500/20 rounded-lg text-zinc-400 hover:text-amber-400 font-mono duration-150 transition-all flex items-center space-x-1 cursor-pointer animate-fade-in"
                      >
                        <span className="h-1 w-1 bg-amber-500 rounded-full"></span>
                        <span>{ord.id}</span>
                      </button>
                    ))}
                    {/* Preloaded high-fidelity demo preset */}
                    <button
                      onClick={() => {
                        setTrackOrderIdInput("MOH-TRK-98210");
                        handleTrackOrder("MOH-TRK-98210");
                      }}
                      className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg font-mono duration-150 transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-ping"></span>
                      <span>MOH-TRK-98210 (Interactive Demo)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Dedicated "Track Order" Live Modal HUD Launcher Card */}
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="text-left space-y-1 md:max-w-md">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center space-x-1.5 font-display">
                    <span className="h-2 w-2 bg-amber-500 rounded-full animate-ping"></span>
                    <span>Live Dispatch Tracking HUD</span>
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Access our premium interactive status suite. This real-time tracker loads the active order ID from your secure cache and highlights step-by-step milestones: <span className="text-zinc-300 font-semibold font-mono">Ordered, Processing, In Transit, Delivered</span>.
                  </p>
                </div>
                <button
                  onClick={() => openTrackModal(trackOrderIdInput)}
                  className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-[11px] uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 duration-200 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-amber-500/10"
                  id="open-live-track-hud-btn"
                >
                  <Truck className="h-4 w-4 shrink-0" />
                  <span>Launch Live Progress HUD</span>
                </button>
              </div>

              {/* Error Box */}
              {trackingError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs space-y-1">
                  <span className="font-semibold block text-red-400">Tracking Failed</span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{trackingError}</p>
                </div>
              )}

              {/* Tracking Live Result Container */}
              {trackingResult && (
                <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-850 pb-3">
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-mono">Order Reference</span>
                        <h4 className="text-sm font-bold text-white font-mono">{trackingResult.orderId}</h4>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-sans">Current Dispatch Status</span>
                        <span className="inline-block px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-bold uppercase text-[10px] tracking-wide mt-0.5 animate-pulse">
                          {trackingResult.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] pt-1">
                      <div>
                        <span className="text-zinc-500 block">Order Date</span>
                        <span className="font-semibold text-zinc-300 font-mono">{trackingResult.date}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Total Price</span>
                        <span className="font-semibold text-zinc-300 font-mono">KES {trackingResult.totalKES.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Couture Courier</span>
                        <span className="font-semibold text-zinc-300">{trackingResult.courierName}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Courier Hotline</span>
                        <a href={`tel:${trackingResult.courierPhone}`} className="font-semibold text-amber-400 hover:underline font-mono">
                          {trackingResult.courierPhone}
                        </a>
                      </div>
                    </div>

                    {/* Ordered Items Preview */}
                    <div className="border-t border-zinc-850 pt-3">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">Package Contents</span>
                      <div className="flex flex-wrap gap-2">
                        {trackingResult.items.map((it, idx) => (
                          <div key={idx} className="bg-zinc-950 px-2 py-1 rounded border border-zinc-900 text-[10px] text-zinc-400 font-mono">
                            {it.name} (x{it.quantity})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Timeline / Stepper */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Shipment Timeline</h4>

                    <div className="relative pl-6 space-y-6">
                      {/* Vertical connector line */}
                      <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-zinc-850"></div>

                      {trackingResult.milestones.map((ms, idx) => {
                        const isCompleted = ms.completed;
                        const isLastCompleted = isCompleted && (idx === trackingResult.milestones.length - 1 || !trackingResult.milestones[idx + 1].completed);

                        return (
                          <div key={ms.step} className="relative flex items-start space-x-4">
                            {/* Milestone circular badge marker */}
                            <div className="absolute -left-6 mt-1 flex items-center justify-center">
                              {isLastCompleted ? (
                                <div className="h-5.5 w-5.5 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center">
                                  <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
                                </div>
                              ) : isCompleted ? (
                                <div className="h-5.5 w-5.5 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                                </div>
                              ) : (
                                <div className="h-5.5 w-5.5 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                                  <div className="h-1.5 w-1.5 rounded-full bg-zinc-700"></div>
                                </div>
                              )}
                            </div>

                            {/* Milestone detail */}
                            <div className={`flex-1 p-3.5 rounded-xl border transition-all duration-300 ${
                              isLastCompleted 
                                ? "bg-amber-500/5 border-amber-500/30" 
                                : isCompleted 
                                ? "bg-zinc-900/20 border-zinc-900" 
                                : "bg-zinc-950/20 border-transparent opacity-50"
                            }`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <h5 className={`font-semibold text-xs ${
                                  isLastCompleted ? "text-amber-400" : isCompleted ? "text-white" : "text-zinc-500"
                                }`}>
                                  {ms.title}
                                </h5>
                                <span className="text-[9px] text-zinc-500 font-mono flex items-center space-x-1 shrink-0">
                                  <Clock className="h-3 w-3" />
                                  <span>{ms.time}</span>
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{ms.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COUTURE DRIVE TAB */}
          {activeSubTab === "drive" && (
            <CoutureDrive profile={profile} onTriggerToast={onTriggerToast} />
          )}
        </div>
      </div>

      {onClearAllData && (
        <div className="mt-12 pt-6 border-t border-zinc-900/60 flex flex-col items-center justify-center space-y-2">
          <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-600 uppercase">ADMINISTRATIVE TESTING CONTROLS</span>
          <button
            onClick={onClearAllData}
            className="px-5 py-2.5 bg-red-950/10 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 text-[10px] font-mono font-bold uppercase tracking-wider transition-all rounded-lg cursor-pointer"
            id="clear-all-data-btn"
          >
            Clear All Data & Reset Defaults
          </button>
        </div>
      )}

      {/* DEDICATED TRACK ORDER LIVE STATUS MODAL */}
      {isTrackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm px-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-zinc-950 border border-amber-500/25 rounded-2xl p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-6 text-xs animate-fade-in">
            {/* Close Button */}
            <button
              onClick={() => setIsTrackModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-850 p-1.5 rounded-full border border-zinc-800 transition-colors cursor-pointer"
              title="Close live tracker"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Title & Badge */}
            <div className="border-b border-zinc-900 pb-3">
              <span className="text-[9px] font-mono font-bold tracking-widest text-amber-500 uppercase">REAL-TIME PORTAL HUD</span>
              <h3 className="text-md font-bold font-display text-white uppercase tracking-wider flex items-center space-x-2 mt-0.5">
                <Truck className="h-5 w-5 text-amber-500 animate-bounce" />
                <span>Bespoke Couture Dispatch Tracker</span>
              </h3>
            </div>

            {/* In-Modal Tracking Quick Switcher */}
            <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 space-y-3">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold font-mono">Query Custom Tracking ID</span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const trimmedId = modalTrackId.trim();
                  if (!trimmedId) {
                    setModalTrackingError("Please enter a valid Order ID.");
                    setModalTrackingResult(null);
                    return;
                  }
                  
                  localStorage.setItem("moh_track_order_id_input", trimmedId);
                  localStorage.setItem("moh_searched_order_id", trimmedId);
                  
                  setTrackOrderIdInput(trimmedId);
                  setSearchedOrderId(trimmedId);

                  const res = getTrackingData(trimmedId);
                  if (res.result) {
                    setModalTrackingResult(res.result);
                    setModalTrackingError("");
                    setTrackingResult(res.result);
                    localStorage.setItem("moh_tracking_result", JSON.stringify(res.result));
                    if (onTriggerToast) onTriggerToast("Tracking Synced!");
                  } else {
                    setModalTrackingResult(null);
                    setModalTrackingError(res.error || "No order found");
                    setTrackingResult(null);
                    localStorage.removeItem("moh_tracking_result");
                    if (onTriggerToast) onTriggerToast("Tracking Saved");
                  }
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={modalTrackId}
                    onChange={(e) => setModalTrackId(e.target.value)}
                    placeholder="Enter Order ID (e.g., MOH-TRK-98210)"
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/40 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs rounded-lg hover:brightness-110 active:scale-95 duration-150 cursor-pointer"
                >
                  Query Status
                </button>
              </form>

              {/* Quick References inside Modal */}
              <div className="flex flex-wrap gap-1.5 items-center pt-1">
                <span className="text-[9px] text-zinc-500 font-bold uppercase font-mono mr-1">Stored presets:</span>
                {orders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => {
                      setModalTrackId(ord.id);
                      setTrackOrderIdInput(ord.id);
                      setSearchedOrderId(ord.id);
                      localStorage.setItem("moh_track_order_id_input", ord.id);
                      localStorage.setItem("moh_searched_order_id", ord.id);
                      const res = getTrackingData(ord.id);
                      if (res.result) {
                        setModalTrackingResult(res.result);
                        setModalTrackingError("");
                        setTrackingResult(res.result);
                        localStorage.setItem("moh_tracking_result", JSON.stringify(res.result));
                      }
                    }}
                    className={`px-2 py-0.5 border text-[9px] font-mono rounded duration-150 transition-all cursor-pointer ${
                      modalTrackId.toLowerCase() === ord.id.toLowerCase()
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                        : "bg-zinc-950 hover:bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {ord.id}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setModalTrackId("MOH-TRK-98210");
                    setTrackOrderIdInput("MOH-TRK-98210");
                    setSearchedOrderId("MOH-TRK-98210");
                    localStorage.setItem("moh_track_order_id_input", "MOH-TRK-98210");
                    localStorage.setItem("moh_searched_order_id", "MOH-TRK-98210");
                    const res = getTrackingData("MOH-TRK-98210");
                    if (res.result) {
                      setModalTrackingResult(res.result);
                      setModalTrackingError("");
                      setTrackingResult(res.result);
                      localStorage.setItem("moh_tracking_result", JSON.stringify(res.result));
                    }
                  }}
                  className={`px-2 py-0.5 border text-[9px] font-mono rounded duration-150 transition-all cursor-pointer ${
                    modalTrackId.toUpperCase() === "MOH-TRK-98210"
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                      : "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 text-amber-400"
                  }`}
                >
                  Demo Tracker
                </button>
              </div>
            </div>

            {/* Error Message */}
            {modalTrackingError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl space-y-1">
                <span className="font-semibold block text-red-400 uppercase font-mono text-[10px]">No Tracking Context Found</span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{modalTrackingError}</p>
              </div>
            )}

            {/* Tracking Result View */}
            {modalTrackingResult && (
              <div className="space-y-6">
                
                {/* Visual Stepper / Progress Bar */}
                <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl space-y-5">
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">Delivery Status Pipeline</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider font-mono">
                      {modalTrackingResult.status}
                    </span>
                  </div>

                  {/* Horizontal visual stepper track */}
                  <div className="relative py-4 px-2">
                    {/* Background track line */}
                    <div className="absolute top-1/2 left-4 right-4 h-1 bg-zinc-900 -translate-y-1/2 rounded-full"></div>
                    {/* Animated gold progress line */}
                    <div 
                      className="absolute top-1/2 left-4 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 -translate-y-1/2 rounded-full duration-700 transition-all shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                      style={{ 
                        width: `${
                          modalTrackingResult.status === "Delivered" || modalTrackingResult.status?.toLowerCase() === "delivered" ? "100" :
                          modalTrackingResult.status === "Out for Delivery" ? "66.6" :
                          modalTrackingResult.status === "Dispatched" ? "33.3" : "0"
                        }%` 
                      }}
                    ></div>

                    {/* Milestone nodes */}
                    <div className="relative flex justify-between">
                      {[
                        { stepNum: 1, label: "Ordered", matchKeywords: ["ordered", "confirmed", "paid"] },
                        { stepNum: 2, label: "Processing", matchKeywords: ["processing", "tailoring", "quality", "check"] },
                        { stepNum: 3, label: "In Transit", matchKeywords: ["dispatched", "transit", "out for delivery", "shipping"] },
                        { stepNum: 4, label: "Delivered", matchKeywords: ["delivered", "signed", "completed"] }
                      ].map((item, idx) => {
                        // Figure out step states
                        const currentStatusStr = (modalTrackingResult.status || "").toLowerCase();
                        let activeStepNum = 1;
                        if (currentStatusStr.includes("delivered") || currentStatusStr.includes("signed") || currentStatusStr.includes("completed")) {
                          activeStepNum = 4;
                        } else if (currentStatusStr.includes("transit") || currentStatusStr.includes("out for delivery") || currentStatusStr.includes("dispatched") || currentStatusStr.includes("shipping")) {
                          activeStepNum = 3;
                        } else if (currentStatusStr.includes("processing") || currentStatusStr.includes("tailor") || currentStatusStr.includes("quality")) {
                          activeStepNum = 2;
                        }

                        const isCompleted = item.stepNum < activeStepNum;
                        const isActive = item.stepNum === activeStepNum;
                        const isPending = item.stepNum > activeStepNum;

                        return (
                          <div key={idx} className="flex flex-col items-center z-10">
                            {/* Circle badge */}
                            <div 
                              className={`h-8 w-8 rounded-full flex items-center justify-center font-bold font-mono text-xs duration-300 transition-all ${
                                isActive 
                                  ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.6)] scale-110 border border-amber-400" 
                                  : isCompleted 
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                                  : "bg-zinc-950 text-zinc-600 border border-zinc-850"
                              }`}
                            >
                              {isCompleted ? "✓" : item.stepNum}
                            </div>
                            {/* Text label */}
                            <span className={`text-[10px] font-bold mt-2.5 font-display tracking-wide uppercase ${
                              isActive ? "text-amber-500" : isCompleted ? "text-zinc-300" : "text-zinc-600"
                            }`}>
                              {item.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Tracking Metadata Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Package Summary */}
                  <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900 space-y-3">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold font-mono">Reference Details</span>
                    <div className="space-y-1.5 font-mono">
                      <p className="text-zinc-400 flex justify-between"><span>Tracking ID:</span> <span className="text-white font-bold">{modalTrackingResult.orderId}</span></p>
                      <p className="text-zinc-400 flex justify-between"><span>Ordered Date:</span> <span className="text-zinc-300">{modalTrackingResult.date}</span></p>
                      <p className="text-zinc-400 flex justify-between"><span>Amount Paid:</span> <span className="text-amber-400">KES {modalTrackingResult.totalKES.toLocaleString()}</span></p>
                    </div>

                    <div className="border-t border-zinc-850 pt-2">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold font-mono mb-1.5">Deliverable Contents</span>
                      <div className="flex flex-wrap gap-1.5">
                        {modalTrackingResult.items.map((it: any, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 rounded text-[9px] text-zinc-400 font-mono">
                            {it.name} (x{it.quantity})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Courier Partner Card */}
                  <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold font-mono">Delivery Agent Assignee</span>
                      <h4 className="text-xs font-semibold text-white mt-1.5 flex items-center space-x-1.5">
                        <span className="h-1.5 w-1.5 bg-green-500 rounded-full"></span>
                        <span>{modalTrackingResult.courierName}</span>
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-1 leading-normal">Our dedicated courier partner will handle direct contactless drops or tailor fitting check-ups during hand-over.</p>
                    </div>

                    <div className="pt-2 border-t border-zinc-850 flex items-center justify-between">
                      <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase">Direct Agent Line:</span>
                      <a 
                        href={`tel:${modalTrackingResult.courierPhone}`}
                        className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded text-[10px] text-amber-400 font-bold font-mono duration-150 transition-all shrink-0"
                      >
                        📞 {modalTrackingResult.courierPhone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Chronological Milestone Timeline Logs */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">Detailed Milestone Logs</h4>
                  
                  <div className="relative pl-6 space-y-5">
                    {/* Vertical guideline */}
                    <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-zinc-900"></div>

                    {modalTrackingResult.milestones.map((ms: any, idx: number) => {
                      const isCompleted = ms.completed;
                      const isLastCompleted = isCompleted && (idx === modalTrackingResult.milestones.length - 1 || !modalTrackingResult.milestones[idx + 1].completed);

                      return (
                        <div key={ms.step} className="relative flex items-start space-x-3">
                          {/* Circle status indicator */}
                          <div className="absolute -left-6 mt-1.5 flex items-center justify-center">
                            {isLastCompleted ? (
                              <div className="h-5 w-5 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></div>
                              </div>
                            ) : isCompleted ? (
                              <div className="h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
                              </div>
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-zinc-950 border border-zinc-850 flex items-center justify-center">
                                <div className="h-1 w-1 rounded-full bg-zinc-800"></div>
                              </div>
                            )}
                          </div>

                          {/* Milestone Information Detail Card */}
                          <div className={`flex-1 p-3 rounded-xl border transition-all duration-300 ${
                            isLastCompleted 
                              ? "bg-amber-500/5 border-amber-500/25" 
                              : isCompleted 
                              ? "bg-zinc-900/20 border-zinc-900" 
                              : "bg-zinc-950/20 border-transparent opacity-40"
                          }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <h5 className={`font-semibold text-[11px] ${
                                isLastCompleted ? "text-amber-400" : isCompleted ? "text-zinc-200" : "text-zinc-500"
                              }`}>
                                {ms.title}
                              </h5>
                              <span className="text-[9px] text-zinc-500 font-mono flex items-center space-x-1 shrink-0">
                                <Clock className="h-3 w-3" />
                                <span>{ms.time}</span>
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{ms.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* Modal Actions Footer */}
            <div className="border-t border-zinc-900 pt-4 flex items-center justify-end">
              <button
                onClick={() => setIsTrackModalOpen(false)}
                className="px-4.5 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 font-bold text-xs rounded-xl border border-zinc-800 transition-colors duration-150 cursor-pointer"
              >
                Close Tracking HUD
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
