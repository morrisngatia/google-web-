import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  ShoppingBag, 
  Eye, 
  ToggleLeft, 
  ToggleRight, 
  Trash2, 
  Check, 
  X, 
  AlertTriangle,
  Search,
  User,
  Shield,
  Coins,
  Edit3,
  Settings,
  RefreshCw,
  CheckCircle,
  HelpCircle,
  ArrowUpRight,
  Award,
  Smartphone,
  Mail
} from "lucide-react";
import { Product } from "../data/products";
import { db } from "../lib/firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import CoinActivityFeed from "./CoinActivityFeed";
import { User as FirebaseUser } from "firebase/auth";

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

interface VendorDashboardProps {
  user?: FirebaseUser | null;
  products: Product[];
  bookings: Booking[];
  onToggleStock: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateBookingStatus: (bookingId: string, status: "Approved" | "Declined") => void;
}

export default function VendorDashboard({
  user,
  products,
  bookings,
  onToggleStock,
  onDeleteProduct,
  onUpdateBookingStatus,
}: VendorDashboardProps) {
  const [vendorTab, setVendorTab] = useState<"analytics" | "users" | "coins-feed">("analytics");
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [coinsToChange, setCoinsToChange] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form states for profile editing
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editMpesa, setEditMpesa] = useState("");
  const [editReferral, setEditReferral] = useState("");
  const [editCoins, setEditCoins] = useState("");

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setActionSuccess(null);
    try {
      const q = collection(db, "userMonetization");
      const snap = await getDocs(q);
      const fetched: any[] = [];
      snap.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });

      // Default seed data
      const mockUsers = [
        {
          id: "demo-affiliate-user",
          name: "Kendi Nyambura",
          email: "kendi@gmail.com",
          phone: "0722112233",
          isActivated: true,
          referralCode: "MOH-REF-KENDI",
          clicks: 142,
          salesCount: 14,
          earningsUSD: 8.4,
          mpesaNumber: "0722112233",
          mohCoins: 100,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
        },
        {
          id: "mock-user-jane",
          name: "Jane Wanjiru",
          email: "jane.wanjiru@gmail.com",
          phone: "0711998877",
          isActivated: false,
          referralCode: "MOH-REF-JANE",
          clicks: 34,
          salesCount: 2,
          earningsUSD: 1.2,
          mpesaNumber: "0711998877",
          mohCoins: 100,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString()
        },
        {
          id: "mock-user-olunga",
          name: "Michael Olunga",
          email: "olunga14@yahoo.com",
          phone: "0799887766",
          isActivated: false,
          referralCode: "MOH-REF-OLUNGA",
          clicks: 8,
          salesCount: 0,
          earningsUSD: 0.0,
          mpesaNumber: "0799887766",
          mohCoins: 150,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
        }
      ];

      const finalUsers = [...fetched];
      mockUsers.forEach((mock) => {
        if (!finalUsers.some((u) => u.id === mock.id)) {
          finalUsers.push(mock);
        }
      });

      setUsers(finalUsers);
    } catch (err) {
      console.error("Error loading users from Firestore:", err);
      const mockUsers = [
        {
          id: "demo-affiliate-user",
          name: "Kendi Nyambura",
          email: "kendi@gmail.com",
          phone: "0722112233",
          isActivated: true,
          referralCode: "MOH-REF-KENDI",
          clicks: 142,
          salesCount: 14,
          earningsUSD: 8.4,
          mpesaNumber: "0722112233",
          mohCoins: 100,
          createdAt: new Date().toISOString()
        },
        {
          id: "mock-user-jane",
          name: "Jane Wanjiru",
          email: "jane.wanjiru@gmail.com",
          phone: "0711998877",
          isActivated: false,
          referralCode: "MOH-REF-JANE",
          clicks: 34,
          salesCount: 2,
          earningsUSD: 1.2,
          mpesaNumber: "0711998877",
          mohCoins: 100,
          createdAt: new Date().toISOString()
        }
      ];
      setUsers(mockUsers);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setEditName(user.name || "");
    setEditEmail(user.email || "");
    setEditPhone(user.phone || "");
    setEditMpesa(user.mpesaNumber || user.phone || "");
    setEditReferral(user.referralCode || "");
    setEditCoins(String(user.mohCoins !== undefined ? user.mohCoins : 100));
    setCoinsToChange("");
    setActionSuccess(null);
    setShowDeleteConfirm(false);
  };

  const handleToggleAffiliate = async (userId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    try {
      if (!userId.startsWith("mock-") && userId !== "demo-affiliate-user") {
        const docRef = doc(db, "userMonetization", userId);
        await updateDoc(docRef, {
          isActivated: nextStatus,
          updatedAt: new Date().toISOString()
        });
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActivated: nextStatus } : u))
      );
      if (selectedUser?.id === userId) {
        setSelectedUser((prev: any) => ({ ...prev, isActivated: nextStatus }));
      }
      setActionSuccess(`Affiliate status ${nextStatus ? "ACTIVATED" : "DEACTIVATED"} successfully!`);
    } catch (err: any) {
      console.error("Failed to toggle affiliate:", err);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActivated: nextStatus } : u))
      );
      setActionSuccess(`Saved status update in local session.`);
    }
  };

  const handleAdjustCoins = async (userId: string, currentCoins: number, changeType: "add" | "sub" | "set") => {
    let amount = parseInt(coinsToChange) || 0;
    if (amount <= 0 && changeType !== "set") return;

    let newCoinsVal = currentCoins;
    if (changeType === "add") {
      newCoinsVal = currentCoins + amount;
    } else if (changeType === "sub") {
      newCoinsVal = Math.max(0, currentCoins - amount);
    } else if (changeType === "set") {
      const setVal = parseInt(editCoins);
      if (isNaN(setVal)) return;
      newCoinsVal = Math.max(0, setVal);
    }

    try {
      if (!userId.startsWith("mock-") && userId !== "demo-affiliate-user") {
        const docRef = doc(db, "userMonetization", userId);
        await updateDoc(docRef, {
          mohCoins: newCoinsVal,
          updatedAt: new Date().toISOString()
        });
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, mohCoins: newCoinsVal } : u))
      );
      if (selectedUser?.id === userId) {
        setSelectedUser((prev: any) => ({ ...prev, mohCoins: newCoinsVal }));
        setEditCoins(String(newCoinsVal));
      }
      setCoinsToChange("");
      setActionSuccess(`Moh Coins adjusted successfully to ${newCoinsVal}!`);
    } catch (err) {
      console.error("Failed to adjust coins:", err);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, mohCoins: newCoinsVal } : u))
      );
      setActionSuccess(`Adjusted coins to ${newCoinsVal} in local session.`);
    }
  };

  const handleSaveProfileEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const coinsVal = parseInt(editCoins) || 0;

    try {
      if (!selectedUser.id.startsWith("mock-") && selectedUser.id !== "demo-affiliate-user") {
        const docRef = doc(db, "userMonetization", selectedUser.id);
        await updateDoc(docRef, {
          name: editName,
          email: editEmail,
          phone: editPhone,
          mpesaNumber: editMpesa,
          referralCode: editReferral,
          mohCoins: coinsVal,
          updatedAt: new Date().toISOString()
        });
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                name: editName,
                email: editEmail,
                phone: editPhone,
                mpesaNumber: editMpesa,
                referralCode: editReferral,
                mohCoins: coinsVal
              }
            : u
        )
      );
      setSelectedUser((prev: any) => ({
        ...prev,
        name: editName,
        email: editEmail,
        phone: editPhone,
        mpesaNumber: editMpesa,
        referralCode: editReferral,
        mohCoins: coinsVal
      }));

      setActionSuccess("User profile details and coins saved successfully!");
    } catch (err) {
      console.error("Error saving edits:", err);
      setActionSuccess("Saved profile edits to local session.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      if (!userId.startsWith("mock-") && userId !== "demo-affiliate-user") {
        const docRef = doc(db, "userMonetization", userId);
        await deleteDoc(docRef);
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setSelectedUser(null);
      setShowDeleteConfirm(false);
      setActionSuccess("User account permanently deleted from ledger.");
    } catch (err) {
      console.error("Error deleting user:", err);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setSelectedUser(null);
      setShowDeleteConfirm(false);
      setActionSuccess("Removed user account locally.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.referralCode?.toLowerCase().includes(q)
    );
  });

  const [chartPeriod, setChartPeriod] = useState<"7d" | "30d" | "12m">("7d");

  // Chart data definitions
  const chartData = {
    "7d": {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [24000, 31000, 48000, 19000, 52000, 78000, 65000],
      total: "KES 317,000",
      points: "10,95 40,84 70,58 100,102 130,52 160,12 190,32"
    },
    "30d": {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      values: [120000, 195000, 154000, 245000],
      total: "KES 714,000",
      points: "20,95 80,48 140,64 200,18"
    },
    "12m": {
      labels: ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"],
      values: [480000, 610000, 890000, 1200000],
      total: "KES 3,180,000",
      points: "25,85 75,70 125,48 175,12"
    }
  };

  const activePeriod = chartData[chartPeriod];

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16 space-y-10 text-white">
      
      {/* 1. ADMIN PROFILE BANNER */}
      <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Ambient accent radial glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center space-x-4 z-10">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-accent-hover p-0.5 shadow-lg shadow-accent/10 shrink-0">
            <div className="h-full w-full rounded-2xl bg-black flex items-center justify-center">
              <Shield className="h-6 w-6 text-accent" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[9px] bg-accent/10 text-accent border border-accent/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">Chief Creative Director & Owner</span>
              <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Secure Node Active</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
              <span className="font-display tracking-tight text-white font-medium">Ngatia Morris</span>
              <span className="text-zinc-600 font-normal font-mono text-xs">/ System Admin</span>
            </h2>
            <p className="text-xs text-zinc-400 flex items-center space-x-2 mt-0.5">
              <Mail className="h-3.5 w-3.5 text-accent" />
              <span>ngatiamorris77@gmail.com</span>
            </p>
          </div>
        </div>
        
        {/* Admin quick metrics */}
        <div className="flex items-center gap-4 z-10 shrink-0 bg-black/40 border border-zinc-900/80 p-3.5 rounded-xl">
          <div className="text-left">
            <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono">System Integrity</p>
            <p className="text-xs font-extrabold font-mono text-green-400">100% ONLINE</p>
          </div>
          <div className="h-8 w-[1px] bg-zinc-900"></div>
          <div className="text-left">
            <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono">Total Coin Ledger</p>
            <p className="text-xs font-extrabold font-mono text-accent">MOH {users.reduce((acc, curr) => acc + (curr.mohCoins || 0), 0)}</p>
          </div>
        </div>
      </div>

      {/* 2. DEVELOPER INSPECTION GUARD ALERT */}
      {user?.email !== "admin@mohstylist.com" && user?.uid !== "admin-user-moh-stylist" && (
        <div className="bg-accent/10 border border-accent/20 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">DEVELOPER INSPECTION GATEWAY</h4>
              <p className="text-[11px] text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                You are currently reviewing the Partner Suite as <strong className="text-white font-mono">{user?.email || "anonymous customer node"}</strong>. In production, this workspace is restricted to <strong className="text-white font-mono">ngatiamorris77@gmail.com</strong>. Live ledger adjustments and product inventory toggles are unlocked here for inspection.
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              setActionSuccess("Admin mode override initialized.");
            }} 
            className="px-3.5 py-1.5 bg-accent text-black font-extrabold text-[10px] uppercase rounded-lg transition-all shrink-0 cursor-pointer"
          >
            Acknowledge & Continue
          </button>
        </div>
      )}

      {/* Dashboard title */}
      <div className="border-b border-zinc-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between">
        <div>
          <span className="text-[10px] text-accent font-extrabold tracking-widest uppercase font-mono">Moh Stylist Partner Suite</span>
          <h2 className="text-2xl font-bold font-display text-white mt-1 tracking-tight">VENDOR & COIN CONTROLLER</h2>
        </div>
        <div className="flex items-center space-x-2 text-xs text-zinc-400 mt-2 sm:mt-0">
          <LayoutDashboard className="h-4 w-4 text-accent" />
          <span>Manage listings, bookings, and coin transactions</span>
        </div>
      </div>

      {/* Dashboard Sub-Tabs */}
      <div className="flex border-b border-zinc-900 overflow-x-auto scrollbar-none">
        <button
          onClick={() => { setVendorTab("analytics"); setSelectedUser(null); }}
          className={`px-6 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            vendorTab === "analytics"
              ? "border-accent text-accent bg-accent/5"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          📊 Store Analytics & Inventory
        </button>
        <button
          onClick={() => { setVendorTab("users"); setSelectedUser(null); }}
          className={`px-6 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
            vendorTab === "users"
              ? "border-accent text-accent bg-accent/5"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <span>👥 User Accounts & Coins Control</span>
          <span className="bg-accent/10 text-accent text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
            {users.length}
          </span>
        </button>
        <button
          onClick={() => { setVendorTab("coins-feed"); setSelectedUser(null); }}
          className={`px-6 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap shrink-0 ${
            vendorTab === "coins-feed"
              ? "border-accent text-accent bg-accent/5"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <span>🪙 Live Coin Activity Feed</span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
          </span>
        </button>
      </div>

      {vendorTab === "analytics" && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-2 relative group hover:border-accent/30 transition-all duration-300">
              <div className="flex justify-between items-center text-zinc-500">
                <span className="text-[10px] uppercase tracking-wider font-mono">Gross Revenue</span>
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <p className="text-2xl font-bold font-mono tracking-tight text-white">{activePeriod.total}</p>
              <span className="text-[10px] text-green-400 font-medium flex items-center">
                <TrendingUp className="h-3.5 w-3.5 mr-1" /> +14.5% from previous cycle
              </span>
            </div>

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-2 relative group hover:border-accent/30 transition-all duration-300">
              <div className="flex justify-between items-center text-zinc-500">
                <span className="text-[10px] uppercase tracking-wider font-mono">Active Bookings</span>
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <p className="text-2xl font-bold font-mono tracking-tight text-white">
                {bookings.filter((b) => b.status === "Pending").length} Pending
              </p>
              <span className="text-[10px] text-zinc-400">Out of {bookings.length} total bookings</span>
            </div>

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-2 relative group hover:border-accent/30 transition-all duration-300">
              <div className="flex justify-between items-center text-zinc-500">
                <span className="text-[10px] uppercase tracking-wider font-mono">Total Listings</span>
                <ShoppingBag className="h-5 w-5 text-accent" />
              </div>
              <p className="text-2xl font-bold font-mono tracking-tight text-white">{products.length} Items</p>
              <span className="text-[10px] text-zinc-400">{products.filter((p) => p.inStock).length} currently in stock</span>
            </div>

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-2 relative group hover:border-accent/30 transition-all duration-300">
              <div className="flex justify-between items-center text-zinc-500">
                <span className="text-[10px] uppercase tracking-wider font-mono">Store Visits</span>
                <Eye className="h-5 w-5 text-accent" />
              </div>
              <p className="text-2xl font-bold font-mono tracking-tight text-white">4.8K Views</p>
              <span className="text-[10px] text-zinc-400 font-sans">Directly from Nairobi CBD queries</span>
            </div>
          </div>

          {/* Analytics Chart & Incoming bookings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Custom SVG sales chart */}
            <div className="lg:col-span-2 bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-accent font-mono">Sales Cycle Graph</h3>
                <div className="flex bg-zinc-900 rounded-lg p-1 text-[10px] space-x-1 border border-zinc-850">
                  {(["7d", "30d", "12m"] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setChartPeriod(period)}
                      className={`px-2.5 py-1 rounded-md font-bold uppercase transition-colors cursor-pointer ${
                        chartPeriod === period ? "bg-accent text-black" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Chart drawing */}
              <div className="relative pt-4">
                {/* Chart SVG */}
                <svg viewBox="0 0 200 110" className="w-full h-48 overflow-visible">
                  {/* Grid Lines */}
                  <line x1="0" y1="95" x2="200" y2="95" stroke="#1f1f1f" strokeWidth="0.5" />
                  <line x1="0" y1="65" x2="200" y2="65" stroke="#1f1f1f" strokeWidth="0.5" />
                  <line x1="0" y1="35" x2="200" y2="35" stroke="#1f1f1f" strokeWidth="0.5" strokeDasharray="2" />
                  <line x1="0" y1="5" x2="200" y2="5" stroke="#1f1f1f" strokeWidth="0.5" />

                  {/* Area Under Curve */}
                  <polygon
                    points={`10,95 ${activePeriod.points} 190,95`}
                    fill="url(#goldGradient)"
                    opacity="0.15"
                  />

                  {/* Accent Polyline */}
                  <polyline
                    fill="none"
                    stroke="var(--color-accent, #D4AF37)"
                    strokeWidth="1.5"
                    points={activePeriod.points}
                  />

                  {/* Tooltip glow anchors */}
                  {activePeriod.points.split(" ").map((pt, idx) => {
                    const [x, y] = pt.split(",");
                    return (
                      <g key={idx} className="group/dot cursor-pointer">
                        <circle cx={x} cy={y} r="3" fill="var(--color-accent, #D4AF37)" stroke="#000" strokeWidth="1" />
                        <circle cx={x} cy={y} r="6" fill="var(--color-accent, #D4AF37)" opacity="0" className="hover:opacity-30 transition-opacity animate-pulse" />
                      </g>
                    );
                  })}

                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent, #D4AF37)" />
                      <stop offset="100%" stopColor="var(--color-accent, #D4AF37)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Labels overlay */}
                <div className="flex justify-between text-[9px] font-mono text-zinc-500 pt-3 px-2">
                  {activePeriod.labels.map((lbl, idx) => (
                    <span key={idx}>{lbl}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bookings table */}
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-4 flex flex-col h-[350px] lg:h-auto">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-accent font-mono">Bespoke Bookings</h3>
              
              <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
                {bookings.length > 0 ? (
                  bookings.map((book) => (
                    <div
                      key={book.id}
                      className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-900 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{book.customerName}</h4>
                          <p className="text-[10px] text-zinc-500">{book.customerPhone} • {book.customerEmail}</p>
                        </div>
                        <span
                          className={`text-[9px] px-2.5 py-0.5 rounded font-extrabold uppercase ${
                            book.status === "Approved"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : book.status === "Declined"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-accent/10 text-accent border border-accent/20"
                          }`}
                        >
                          {book.status}
                        </span>
                      </div>

                      <div className="border-t border-zinc-850 pt-2 text-[11px] text-zinc-400 space-y-1">
                        <p>Service: <strong className="text-zinc-250 font-display font-medium">{book.serviceName}</strong></p>
                        <p>Date: <span className="font-mono text-zinc-300">{book.date}</span> @ <span className="font-mono text-zinc-300">{book.time}</span></p>
                        {book.notes && <p className="italic text-zinc-500">"Notes: {book.notes}"</p>}
                      </div>

                      {book.status === "Pending" && (
                        <div className="flex items-center gap-2 pt-1.5">
                          <button
                            onClick={() => onUpdateBookingStatus(book.id, "Approved")}
                            className="flex-1 py-1.5 bg-green-500 hover:bg-green-400 text-black font-extrabold text-[10px] uppercase tracking-wider rounded flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => onUpdateBookingStatus(book.id, "Declined")}
                            className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-[10px] uppercase tracking-wider rounded flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic text-center py-10">No salon or styling session bookings received yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Listings Manager table */}
          <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accent font-mono">Bespoke Catalog Items</h3>

            <div className="overflow-x-auto rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 border-b border-zinc-900 text-zinc-400 font-semibold uppercase tracking-wider">
                    <th className="p-4">Listing details</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (KES)</th>
                    <th className="p-4">Inventory Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-900/25 transition-colors">
                      <td className="p-4 flex items-center space-x-3">
                        <img referrerPolicy="no-referrer" src={p.image} alt={p.name} className="h-10 w-10 object-cover rounded bg-zinc-900" />
                        <span className="font-semibold text-white truncate max-w-[15rem] block font-display">{p.name}</span>
                      </td>
                      <td className="p-4 text-zinc-400">{p.brand}</td>
                      <td className="p-4">
                        <span className="bg-zinc-900 px-2 py-0.5 border border-zinc-850 rounded text-zinc-350 text-[10px] font-mono">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-zinc-200">KES {p.priceKES.toLocaleString()}</td>
                      <td className="p-4">
                        <button
                          onClick={() => onToggleStock(p.id)}
                          className="flex items-center space-x-2 text-xs font-semibold cursor-pointer"
                        >
                          {p.inStock ? (
                            <div className="flex items-center text-green-400">
                              <ToggleRight className="h-6 w-6 text-accent mr-1.5" />
                              <span>Available</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-zinc-500">
                              <ToggleLeft className="h-6 w-6 text-zinc-750 mr-1.5" />
                              <span>Sold Out</span>
                            </div>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg hover:scale-105 duration-150 cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {vendorTab === "users" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* USER SEARCH & LIST (2 cols) */}
          <div className="lg:col-span-2 bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-900">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-accent font-mono">Global User Directory Ledger</h3>
                <p className="text-[10px] text-zinc-500 font-sans">Query client registrations and adjust Moh Coin wallets or affiliate status.</p>
              </div>
              <button
                onClick={fetchUsers}
                disabled={isLoadingUsers}
                className="self-start sm:self-auto px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-xs border border-zinc-800 rounded-lg flex items-center space-x-1 cursor-pointer disabled:opacity-40"
              >
                <RefreshCw className={`h-3 w-3 ${isLoadingUsers ? "animate-spin" : ""}`} />
                <span>Reload</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search accounts by name, email, phone number, or affiliate code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-850 rounded-xl p-2.5 pl-10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-accent/50"
              />
            </div>

            {/* List Table */}
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full border-collapse text-xs text-left">
                <thead>
                  <tr className="bg-zinc-900/40 border-b border-zinc-900 text-zinc-400 uppercase tracking-wider text-[10px] font-semibold">
                    <th className="p-4">Client Endpoint</th>
                    <th className="p-4 text-center">Affiliate Node</th>
                    <th className="p-4 text-center">Moh Coins</th>
                    <th className="p-4 text-center">Referral Ledger</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {isLoadingUsers ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500 font-mono">
                        <RefreshCw className="h-5 w-5 animate-spin mx-auto text-accent mb-2" />
                        Syncing active blockchain ledger...
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr 
                        key={u.id}
                        className={`hover:bg-zinc-900/30 transition-colors cursor-pointer ${
                          selectedUser?.id === u.id ? "bg-accent/5" : ""
                        }`}
                        onClick={() => handleSelectUser(u)}
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-9 w-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-accent text-sm shrink-0 shadow-inner">
                              {(u.name || "U")[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-200">{u.name || "Moh Member"}</p>
                              <p className="text-[10px] text-zinc-500 truncate max-w-[120px] sm:max-w-none">{u.email || "No email"}</p>
                              <p className="text-[9px] font-mono text-accent/80 mt-0.5">{u.phone || "No phone"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleAffiliate(u.id, u.isActivated);
                            }}
                            className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wider border cursor-pointer ${
                              u.isActivated 
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-emerald-500/5"
                            }`}
                          >
                            {u.isActivated ? "Authorized" : "Unauthorized"}
                          </button>
                        </td>
                        <td className="p-4 text-center font-bold font-mono text-accent text-sm">
                          <div className="flex items-center justify-center space-x-1">
                            <Coins className="h-4 w-4 shrink-0 text-accent" />
                            <span>{u.mohCoins !== undefined ? u.mohCoins : 100}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="inline-block text-left text-[10px] space-y-0.5 text-zinc-400 font-mono">
                            <p>Code: <strong className="text-zinc-300">{u.referralCode || "N/A"}</strong></p>
                            <p>Clicks: <span className="text-zinc-300">{u.clicks || 0}</span> • Sales: <span className="text-zinc-300">{u.salesCount || 0}</span></p>
                            <p>Wallet: <span className="text-emerald-400">${(u.earningsUSD || 0).toFixed(2)}</span></p>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectUser(u);
                            }}
                            className="px-2.5 py-1 bg-accent text-black font-extrabold text-[9px] uppercase tracking-wider rounded-md hover:bg-accent-hover cursor-pointer shadow-sm"
                          >
                            Administer
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500 italic">
                        No registered users match your query parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* USER CONTROL CONSOLE (1 col) */}
          <div className="lg:col-span-1 space-y-6">
            {!selectedUser ? (
              <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-900 shadow-xl text-center space-y-4 flex flex-col justify-center items-center h-full min-h-[350px]">
                <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-zinc-650" />
                </div>
                <h3 className="font-semibold text-zinc-400 text-sm">Console Standby</h3>
                <p className="text-xs text-zinc-500 max-w-[200px] leading-relaxed mx-auto">
                  Select or click the <strong>Administer</strong> button on any client node to configure wallets, edit profile fields, or override referral codes.
                </p>
              </div>
            ) : (
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-850 shadow-2xl relative space-y-5">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div>
                  <span className="text-[9px] text-accent font-bold uppercase tracking-wider font-mono">Control Console</span>
                  <h3 className="text-sm font-bold text-white mt-0.5 truncate">{selectedUser.name}</h3>
                  <span className="text-[9px] font-mono text-zinc-500 select-all block mt-0.5">{selectedUser.id}</span>
                </div>

                {/* Toast status block */}
                {actionSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-lg text-xs flex items-center space-x-1.5 animate-fadeIn">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{actionSuccess}</span>
                  </div>
                )}

                {/* Section A: Coins Wallet Administration */}
                <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-850 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center space-x-1 font-mono">
                      <Coins className="h-3.5 w-3.5" />
                      <span>Coins Balance</span>
                    </span>
                    <span className="text-sm font-extrabold font-mono text-accent">
                      {selectedUser.mohCoins !== undefined ? selectedUser.mohCoins : 100} Coins
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty to adjust (e.g. 100)"
                        value={coinsToChange}
                        onChange={(e) => setCoinsToChange(e.target.value)}
                        className="flex-1 bg-black border border-zinc-800 rounded-lg p-2 text-xs text-white text-center focus:outline-none focus:border-accent/50"
                      />
                      <button
                        onClick={() => handleAdjustCoins(selectedUser.id, selectedUser.mohCoins !== undefined ? selectedUser.mohCoins : 100, "add")}
                        disabled={!coinsToChange}
                        className="px-3 py-2 bg-emerald-500 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg hover:bg-emerald-400 disabled:opacity-30 cursor-pointer"
                      >
                        Grant
                      </button>
                      <button
                        onClick={() => handleAdjustCoins(selectedUser.id, selectedUser.mohCoins !== undefined ? selectedUser.mohCoins : 100, "sub")}
                        disabled={!coinsToChange}
                        className="px-3 py-2 bg-red-500 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg hover:bg-red-400 disabled:opacity-30 cursor-pointer"
                      >
                        Deduct
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                      {[25, 100, 500].map((quickAmt) => (
                        <button
                          key={quickAmt}
                          onClick={() => {
                            setCoinsToChange(String(quickAmt));
                          }}
                          className="py-1 bg-zinc-850 hover:bg-zinc-800 text-[9px] rounded font-semibold text-zinc-350 border border-zinc-800/60 cursor-pointer"
                        >
                          +{quickAmt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section B: Detail Modification Form */}
                <form onSubmit={handleSaveProfileEdits} className="space-y-3.5 text-xs">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono block">Override Account Metadata</span>

                  <div className="space-y-1">
                    <label className="text-zinc-450 text-[10px]">Legal Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2 text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-zinc-450 text-[10px]">Email Endpoint</label>
                      <input
                        type="email"
                        required
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-zinc-450 text-[10px]">Mobile Contact</label>
                      <input
                        type="text"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2 text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-zinc-450 text-[10px]">Payout M-Pesa</label>
                      <input
                        type="text"
                        value={editMpesa}
                        onChange={(e) => setEditMpesa(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2 text-white font-mono focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-zinc-450 text-[10px]">Affiliate Code</label>
                      <input
                        type="text"
                        required
                        value={editReferral}
                        onChange={(e) => setEditReferral(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2 text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-455 text-[10px]">Absolute Coins Override</label>
                    <input
                      type="number"
                      required
                      value={editCoins}
                      onChange={(e) => setEditCoins(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2 text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleToggleAffiliate(selectedUser.id, selectedUser.isActivated)}
                      className={`px-3 py-2 border font-bold text-[10px] uppercase rounded-lg cursor-pointer transition-colors ${
                        selectedUser.isActivated
                          ? "border-accent/30 text-accent hover:bg-accent/5"
                          : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/5"
                      }`}
                    >
                      {selectedUser.isActivated ? "Deauthorize" : "Authorize"}
                    </button>

                    <button
                      type="submit"
                      className="flex-1 py-2 bg-accent hover:bg-accent-hover text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg duration-150 cursor-pointer text-center"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>

                {/* Danger zone delete */}
                <div className="border-t border-zinc-900 pt-4 space-y-2">
                  <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider font-mono block">Danger Zone</span>
                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full py-2 bg-red-950/30 hover:bg-red-900/40 border border-red-900/20 text-red-400 hover:text-red-300 font-bold text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
                    >
                      Delete Account Record
                    </button>
                  ) : (
                    <div className="bg-red-950/20 p-3 rounded-lg border border-red-900/30 text-center space-y-2.5">
                      <p className="text-[10px] text-red-400 font-medium font-sans">Are you absolutely sure? This deletes coin wallets and affiliate credentials irrevocably.</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="py-1 bg-zinc-900 text-zinc-400 rounded text-[9px] font-bold border border-zinc-850 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(selectedUser.id)}
                          className="py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[9px] font-bold cursor-pointer"
                        >
                          Confirm Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {vendorTab === "coins-feed" && (
        <CoinActivityFeed />
      )}
    </div>
  );
}
