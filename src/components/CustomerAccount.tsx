import React, { useState } from "react";
import { User, ShoppingBag, CreditCard, ShieldCheck, Mail, MapPin, Phone, Trash2, CheckCircle2, ChevronRight, Lock, Loader2, Play, Plus, Minus, X, Truck, Search, Clock, FolderOpen } from "lucide-react";
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
  cart: CartItem[];
  onUpdateCartQty: (productId: string, qty: number) => void;
  onRemoveCartItem: (productId: string) => void;
  onClearCart: () => void;
  bookings: Booking[];
  profile: { name: string; email: string; phone: string; address: string };
  onUpdateProfile: (profile: { name: string; email: string; phone: string; address: string }) => void;
  orders: Order[];
  onAddOrder: (order: Order) => void;
}

export default function CustomerAccount({
  cart,
  onUpdateCartQty,
  onRemoveCartItem,
  onClearCart,
  bookings,
  profile,
  onUpdateProfile,
  orders,
  onAddOrder,
}: CustomerAccountProps) {
  // Navigation tabs within Account
  const [activeSubTab, setActiveSubTab] = useState<"cart" | "profile" | "history" | "bookings" | "tracking" | "drive">("cart");

  // Profile Form States
  const [profName, setProfName] = useState(profile.name);
  const [profEmail, setProfEmail] = useState(profile.email);
  const [profPhone, setProfPhone] = useState(profile.phone);
  const [profAddress, setProfAddress] = useState(profile.address);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Checkout Wizard States
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"form" | "payment" | "mpesa-processing" | "success">("form");
  const [payMethod, setPayMethod] = useState<"mpesa" | "airtel" | "card" | "paypal">("mpesa");
  const [isDepositOnly, setIsDepositOnly] = useState(false);

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
  const [trackOrderIdInput, setTrackOrderIdInput] = useState("");
  const [searchedOrderId, setSearchedOrderId] = useState("");
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
  } | null>(null);
  const [trackingError, setTrackingError] = useState("");

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
      return;
    }

    setSearchedOrderId(trimmedId);
    setTrackingError("");

    if (trimmedId.toUpperCase() === "MOH-TRK-98210") {
      setTrackingResult({
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
      });
      return;
    }

    // Look for real orders in customer history
    const matchedOrder = orders.find(o => o.id.toLowerCase() === trimmedId.toLowerCase());
    if (matchedOrder) {
      setTrackingResult({
        orderId: matchedOrder.id,
        items: matchedOrder.items.map(i => ({ name: i.name, quantity: i.quantity })),
        totalKES: matchedOrder.totalKES,
        date: matchedOrder.date,
        status: "Dispatched",
        statusUpdateDate: `${matchedOrder.date} @ 4:15 PM`,
        courierName: "Kenyan Express Postal / Rider Services",
        courierPhone: "0708063447",
        milestones: [
          { step: 1, title: "Order Confirmed", description: `Payment processed via ${matchedOrder.paymentMethod}.`, time: `${matchedOrder.date} @ 11:30 AM`, completed: true },
          { step: 2, title: "Quality Check & Tailoring", description: "Specs verified by Moh Stylist design lab.", time: `${matchedOrder.date} @ 2:00 PM`, completed: true },
          { step: 3, title: "Dispatched from Utawala Studio", description: "Package was handed over to express delivery partner.", time: `${matchedOrder.date} @ 4:15 PM`, completed: true },
          { step: 4, title: "Out for Delivery & Hand-over", description: "Rider is being assigned for direct delivery.", time: "Estimated next morning", completed: false }
        ]
      });
      return;
    }

    // If nothing found
    setTrackingError("No order matching this ID was found. If you recently checked out, please double-check the Order ID or click one of our quick tracking templates below.");
    setTrackingResult(null);
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

    onAddOrder(completedOrder);
    onClearCart();
    setCheckoutStep("success");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16 space-y-10 text-white">
      {/* Account Title */}
      <div className="border-b border-zinc-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between">
        <div>
          <span className="text-xs text-amber-500 font-bold tracking-widest uppercase">Moh Stylist Client Portal</span>
          <h2 className="text-3xl font-bold font-display text-white mt-1">SECURE PORTAL</h2>
        </div>
        <div className="flex items-center space-x-2 text-xs text-zinc-400 mt-2 sm:mt-0">
          <User className="h-4.5 w-4.5 text-amber-500" />
          <span>Review your shopping cart, order logs, profile settings, and bookings</span>
        </div>
      </div>

      {/* Account layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation panel */}
        <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-4 space-y-2 h-fit shadow-xl">
          <button
            onClick={() => setActiveSubTab("cart")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors cursor-pointer ${
              activeSubTab === "cart" ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span>Shopping Cart ({cart.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("profile")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors cursor-pointer ${
              activeSubTab === "profile" ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            <User className="h-4.5 w-4.5" />
            <span>Client Profile</span>
          </button>

          <button
            onClick={() => setActiveSubTab("bookings")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors cursor-pointer ${
              activeSubTab === "bookings" ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            <CheckCircle2 className="h-4.5 w-4.5" />
            <span>Your Appointments ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("history")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors cursor-pointer ${
              activeSubTab === "history" ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            <CreditCard className="h-4.5 w-4.5" />
            <span>Receipts & Order Logs ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("tracking")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors cursor-pointer ${
              activeSubTab === "tracking" ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Truck className="h-4.5 w-4.5" />
            <span>Order Tracking</span>
          </button>

          <button
            onClick={() => setActiveSubTab("drive")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors cursor-pointer ${
              activeSubTab === "drive" ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            <FolderOpen className="h-4.5 w-4.5" />
            <span>Couture Design Drive</span>
          </button>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3">
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => setPayMethod("mpesa")}
                        className={`py-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                          payMethod === "mpesa"
                            ? "bg-green-500/10 border-green-500 text-green-400"
                            : "bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white"
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
                            : "bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white"
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
                            : "bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white"
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
                            : "bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span className="text-[10px] italic font-bold text-blue-400">PayPal</span>
                        <span>PayPal Express</span>
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
                          <span>Awaiting Safaricom API callback payload...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 4: Success confirmation */}
                {checkoutStep === "success" && (
                  <div className="text-center py-10 space-y-4 text-xs">
                    <div className="h-14 w-14 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="h-8 w-8 text-green-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-md font-bold text-white uppercase tracking-wide">Payment Authorized!</h4>
                      <p className="text-zinc-400">Thank you for shopping at Moh Stylist, your order has been received.</p>
                    </div>
                    <p className="text-[10px] text-amber-400 font-semibold font-mono">Simulated Receipt No: TKD98H28S2 | Status: Processing</p>

                    <button
                      onClick={() => setIsCheckingOut(false)}
                      className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:text-white text-zinc-400 cursor-pointer"
                    >
                      Close Checkout
                    </button>
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
            <CoutureDrive profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
}
