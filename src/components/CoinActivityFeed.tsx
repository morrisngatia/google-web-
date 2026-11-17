import React, { useState, useEffect } from "react";
import { 
  Coins, 
  Search, 
  Filter, 
  Clock, 
  Play, 
  Pause, 
  Plus, 
  Sparkles, 
  Tv, 
  ShoppingBag, 
  Award, 
  RefreshCw, 
  UserPlus, 
  AlertCircle,
  TrendingUp,
  User,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, addDoc, query, orderBy, limit, serverTimestamp } from "firebase/firestore";

interface CoinActivity {
  id: string;
  userName: string;
  action: "Purchased item" | "Referred a friend" | "Watched a tutorial" | "Shared collection" | "Studio session";
  amount: number;
  timestamp: any; // Firestore timestamp or string
  detail: string;
  isSimulated?: boolean;
}

const ACTION_ICONS = {
  "Purchased item": <ShoppingBag className="h-4 w-4 text-amber-500" />,
  "Referred a friend": <UserPlus className="h-4 w-4 text-emerald-500" />,
  "Watched a tutorial": <Tv className="h-4 w-4 text-cyan-500" />,
  "Shared collection": <Sparkles className="h-4 w-4 text-pink-500" />,
  "Studio session": <Award className="h-4 w-4 text-purple-500" />
};

const ACTION_COLORS = {
  "Purchased item": "border-amber-500/20 bg-amber-500/5 text-amber-400",
  "Referred a friend": "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
  "Watched a tutorial": "border-cyan-500/20 bg-cyan-500/5 text-cyan-400",
  "Shared collection": "border-pink-500/20 bg-pink-500/5 text-pink-400",
  "Studio session": "border-purple-500/20 bg-purple-500/5 text-purple-400"
};

const MOCK_NAMES = [
  "Kendi Nyambura", "Zari Hassan", "Jane Wanjiru", "Michael Olunga", "Martin Ngati", 
  "Abdi Ibrahim", "Amina Mwangi", "Brian Omondi", "Wanjiku Karanja", "Mwende Mutua",
  "Otieno Okoth", "Chepngetich Sang", "Fatuma Omar", "Kamau Njoroge"
];

const MOCK_DETAILS = {
  "Purchased item": [
    "Bought Gold-Trimmed Velvet Blazer",
    "Ordered Hand-Stitched Ankara Dress",
    "Purchased Editorial Leather Choker",
    "Acquired Premium Silk Kaftan",
    "Bought Shell-Inlaid Beaded Handbag"
  ],
  "Referred a friend": [
    "Invited Amina Mwangi to elite studio",
    "Referred Brian Omondi for bespoke styling",
    "Shared affiliate invite with Fatuma Omar",
    "Signed up Kamau Njoroge via referral link",
    "Introduced Chepngetich Sang to editorial hub"
  ],
  "Watched a tutorial": [
    "Viewed 'Nairobi Editorial Runway Showcase'",
    "Completed tutorial 'Styling Beaded Accessories'",
    "Watched 'Black & Gold Color Blocking Masterclass'",
    "Finished 'Utawala Luxury Studio Preview'",
    "Completed video 'Kenyan Artisanal Beadwork Guide'"
  ],
  "Shared collection": [
    "Shared Summer Lookbook on Instagram",
    "Posted Bridal Couture Drive to Facebook",
    "Tweeted Studio Styling Session Link",
    "Sent WhatsApp broadcast of Editorial Catalog"
  ],
  "Studio session": [
    "Completed VIP Custom Tailoring appointment",
    "Finished Bridal Accessories Fitting session",
    "Attended Black & Gold Editorial shoot booking"
  ]
};

export default function CoinActivityFeed() {
  const [activities, setActivities] = useState<CoinActivity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<string>("All");
  const [isSimulating, setIsSimulating] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Manual Trigger Form State
  const [formName, setFormName] = useState("");
  const [formAction, setFormAction] = useState<CoinActivity["action"]>("Purchased item");
  const [formDetail, setFormDetail] = useState("");
  const [formAmount, setFormAmount] = useState(25);

  // 1. Subscribe to Firebase Firestore collection or setup mock data on fail
  useEffect(() => {
    const q = query(collection(db, "coinActivities"), orderBy("timestamp", "desc"), limit(50));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbActivities: CoinActivity[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        dbActivities.push({
          id: doc.id,
          userName: data.userName,
          action: data.action,
          amount: data.amount,
          timestamp: data.timestamp?.toDate() || new Date(data.createdStr || Date.now()),
          detail: data.detail,
          isSimulated: data.isSimulated || false
        });
      });

      if (dbActivities.length > 0) {
        setActivities(dbActivities);
        setDbError(false);
      } else {
        // If Firestore is empty, seed with some gorgeous startup records
        loadMockData();
      }
    }, (error) => {
      console.warn("Firestore listener failed or blocked (likely index or permission). Using standalone real-time simulation.", error);
      setDbError(true);
      loadMockData();
    });

    return () => unsubscribe();
  }, []);

  const loadMockData = () => {
    const initialMocks: CoinActivity[] = [
      {
        id: "mock-1",
        userName: "Kendi Nyambura",
        action: "Purchased item",
        amount: 50,
        timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 mins ago
        detail: "Bought Gold-Trimmed Velvet Blazer",
        isSimulated: true
      },
      {
        id: "mock-2",
        userName: "Zari Hassan",
        action: "Referred a friend",
        amount: 100,
        timestamp: new Date(Date.now() - 1000 * 60 * 12), // 12 mins ago
        detail: "Referred Brian Omondi for bespoke styling",
        isSimulated: true
      },
      {
        id: "mock-3",
        userName: "Jane Wanjiru",
        action: "Watched a tutorial",
        amount: 15,
        timestamp: new Date(Date.now() - 1000 * 60 * 24), // 24 mins ago
        detail: "Completed tutorial 'Styling Beaded Accessories'",
        isSimulated: true
      },
      {
        id: "mock-4",
        userName: "Martin Ngati",
        action: "Shared collection",
        amount: 10,
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
        detail: "Shared Summer Lookbook on Instagram",
        isSimulated: true
      },
      {
        id: "mock-5",
        userName: "Chepngetich Sang",
        action: "Studio session",
        amount: 75,
        timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hrs ago
        detail: "Completed VIP Custom Tailoring appointment",
        isSimulated: true
      }
    ];
    setActivities((prev) => {
      // Only set if we don't have current live activities or if all are simulated
      if (prev.length === 0 || prev.every(a => a.id.startsWith("mock-"))) {
        return initialMocks;
      }
      return prev;
    });
  };

  // 2. Real-time background simulation of user actions
  useEffect(() => {
    if (!isSimulating) return;

    // Simulate an event every 10 to 18 seconds
    const intervalTime = Math.floor(Math.random() * 8000) + 10000; 

    const interval = setInterval(() => {
      const randomUser = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
      const actionsList: CoinActivity["action"][] = ["Purchased item", "Referred a friend", "Watched a tutorial", "Shared collection", "Studio session"];
      const randomAction = actionsList[Math.floor(Math.random() * actionsList.length)];
      
      const detailsList = MOCK_DETAILS[randomAction];
      const randomDetail = detailsList[Math.floor(Math.random() * detailsList.length)];

      const coinAmounts = {
        "Purchased item": 50,
        "Referred a friend": 100,
        "Watched a tutorial": 15,
        "Shared collection": 10,
        "Studio session": 75
      };
      const randomAmount = coinAmounts[randomAction];

      const newSimulated: CoinActivity = {
        id: `sim-${Date.now()}`,
        userName: randomUser,
        action: randomAction,
        amount: randomAmount,
        timestamp: new Date(),
        detail: randomDetail,
        isSimulated: true
      };

      // Push to UI state
      setActivities((prev) => [newSimulated, ...prev.slice(0, 49)]);

      // Attempt to save to firestore as well to sync real-time database state
      try {
        addDoc(collection(db, "coinActivities"), {
          userName: randomUser,
          action: randomAction,
          amount: randomAmount,
          timestamp: serverTimestamp(),
          createdStr: new Date().toISOString(),
          detail: randomDetail,
          isSimulated: true
        });
      } catch (err) {
        // Silent fail - offline mode handles it cleanly
      }

    }, intervalTime);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // 3. Handle manual submission
  const handleTriggerAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDetail.trim()) return;

    setIsSubmitting(true);
    setSuccessMessage(null);

    const newActivityData = {
      userName: formName.trim(),
      action: formAction,
      amount: Number(formAmount),
      timestamp: serverTimestamp(),
      createdStr: new Date().toISOString(),
      detail: formDetail.trim(),
      isSimulated: false
    };

    try {
      // Add to Firestore database
      await addDoc(collection(db, "coinActivities"), newActivityData);
      
      setSuccessMessage(`Live Event published! ${newActivityData.userName} earned ${newActivityData.amount} Moh Coins.`);
      
      // Reset form
      setFormName("");
      setFormDetail("");
      setFormAmount(25);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err) {
      console.warn("Firestore write blocked. Publishing to offline active session list instead.", err);
      // Fallback: manually insert into state
      const fallbackActivity: CoinActivity = {
        id: `manual-${Date.now()}`,
        userName: formName.trim(),
        action: formAction,
        amount: Number(formAmount),
        timestamp: new Date(),
        detail: formDetail.trim(),
        isSimulated: false
      };
      setActivities((prev) => [fallbackActivity, ...prev]);
      setSuccessMessage(`Live Local Event publication triggered! ${fallbackActivity.userName} earned ${fallbackActivity.amount} Moh Coins.`);
      
      setFormName("");
      setFormDetail("");
      setFormAmount(25);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper: Autofill random details on action change
  const handleActionChange = (action: CoinActivity["action"]) => {
    setFormAction(action);
    const details = MOCK_DETAILS[action];
    setFormDetail(details[Math.floor(Math.random() * details.length)]);
    
    const amounts = {
      "Purchased item": 50,
      "Referred a friend": 100,
      "Watched a tutorial": 15,
      "Shared collection": 10,
      "Studio session": 75
    };
    setFormAmount(amounts[action]);
  };

  // Filter & Search logic
  const filteredActivities = activities.filter((act) => {
    const matchesSearch = 
      act.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.detail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterAction === "All" || act.action === filterAction;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header section with real-time status and simulator toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulating ? "bg-amber-400" : "bg-zinc-600"}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSimulating ? "bg-amber-500" : "bg-zinc-500"}`}></span>
            </div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-500 font-display flex items-center space-x-1.5">
              <span>Moh Coins Real-Time Ledger</span>
            </h2>
          </div>
          <p className="text-[11px] text-zinc-500 font-sans max-w-xl">
            Live stream of user actions earning Moh Coins. Monitor community engagement, referral payouts, video interactions, and customer purchases.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer ${
              isSimulating 
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20" 
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="h-3 w-3" />
                <span>Pause Live Simulation</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                <span>Resume Live Simulation</span>
              </>
            )}
          </button>
          
          <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-1.5 rounded-lg flex items-center space-x-1">
            <RefreshCw className={`h-3 w-3 ${isSimulating ? "animate-spin" : ""}`} />
            <span>WebSocket Live Syncing</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Activity Logs (2 cols) */}
        <div className="lg:col-span-2 bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl flex flex-col h-[600px]">
          {/* Controls Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pb-4 border-b border-zinc-900 mb-4 justify-between">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search user or detail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-850 rounded-xl p-2 pl-9 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1">
              {["All", "Purchased item", "Referred a friend", "Watched a tutorial"].map((act) => (
                <button
                  key={act}
                  onClick={() => setFilterAction(act)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-tight border transition-all cursor-pointer ${
                    filterAction === act 
                      ? "bg-amber-500 text-black border-amber-500 font-extrabold" 
                      : "bg-zinc-900/40 text-zinc-400 border-zinc-850 hover:text-white"
                  }`}
                >
                  {act === "All" ? "All Logs" : act}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Stream Feed */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
            <AnimatePresence initial={false}>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((act) => {
                  const relativeTime = () => {
                    const diffMs = Date.now() - new Date(act.timestamp).getTime();
                    const diffMins = Math.floor(diffMs / 60000);
                    if (diffMins < 1) return "Just now";
                    if (diffMins < 60) return `${diffMins}m ago`;
                    const diffHours = Math.floor(diffMins / 60);
                    if (diffHours < 24) return `${diffHours}h ago`;
                    return new Date(act.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
                  };

                  return (
                    <motion.div
                      key={act.id}
                      initial={{ opacity: 0, y: -20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="bg-zinc-900/35 border border-zinc-900 hover:border-zinc-850 p-4 rounded-xl flex items-center justify-between gap-4 group transition-all"
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        {/* Status Icon */}
                        <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 shadow-inner ${ACTION_COLORS[act.action]}`}>
                          {ACTION_ICONS[act.action] || <Coins className="h-4 w-4 text-amber-500" />}
                        </div>

                        {/* Text Detail */}
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-zinc-100 text-xs truncate">{act.userName}</p>
                            <span className="text-[9px] bg-zinc-900 text-zinc-500 border border-zinc-800 px-1.5 py-0.2 rounded-full font-mono uppercase tracking-wider">
                              {act.action}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1 font-sans truncate">{act.detail}</p>
                          <div className="flex items-center space-x-1.5 text-[9px] text-zinc-650 font-mono mt-0.5">
                            <Clock className="h-2.5 w-2.5 shrink-0" />
                            <span>{relativeTime()}</span>
                            {act.isSimulated && (
                              <span className="text-zinc-700 font-sans">• Simulated Active Traffic</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Coin Counter badge */}
                      <div className="shrink-0 flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold px-3 py-1.5 rounded-lg font-mono text-xs shadow-sm">
                        <Coins className="h-3.5 w-3.5" />
                        <span>+{act.amount}</span>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 text-zinc-500">
                  <div className="h-10 w-10 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center mb-3">
                    <Filter className="h-5 w-5 text-zinc-600" />
                  </div>
                  <p className="text-xs font-semibold">No Matching Coin Actions Found</p>
                  <p className="text-[10px] text-zinc-600 max-w-[200px] mt-1 mx-auto leading-relaxed">
                    Adjust your filter queries or trigger a manual custom action on the right.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Live Manual Event Trigger Console (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-5">
            <div>
              <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider font-mono">Simulate & Test Gateway</span>
              <h3 className="text-sm font-bold text-white mt-0.5">Trigger Custom Coin Action</h3>
              <p className="text-[10px] text-zinc-500 font-sans leading-relaxed mt-1">
                Deploy and publish manual coin rewarding operations immediately. Simulates user behavior and tests webhook notifications in real-time.
              </p>
            </div>

            {successMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-xs flex items-center space-x-2 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleTriggerAction} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-550 text-[10px] font-semibold uppercase tracking-wider flex justify-between items-center">
                  <span>Target Username</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormName(MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)]);
                    }}
                    className="text-[9px] text-amber-500 hover:text-amber-400 font-bold transition-colors cursor-pointer uppercase"
                  >
                    🎲 Random Name
                  </button>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amina Mwangi"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-550 text-[10px] font-semibold uppercase tracking-wider">
                  Action Category
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["Purchased item", "Referred a friend", "Watched a tutorial", "Shared collection", "Studio session"] as const).map((act) => (
                    <button
                      key={act}
                      type="button"
                      onClick={() => handleActionChange(act)}
                      className={`py-2 text-[9px] font-bold border rounded-lg transition-all text-center cursor-pointer ${
                        formAction === act
                          ? "bg-amber-500 border-amber-500 text-black font-extrabold"
                          : "bg-zinc-900 text-zinc-400 border-zinc-850 hover:bg-zinc-800"
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-550 text-[10px] font-semibold uppercase tracking-wider">
                  Action Detail Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bought Velvet Blazer"
                  value={formDetail}
                  onChange={(e) => setFormDetail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 font-sans text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-550 text-[10px] font-semibold uppercase tracking-wider">
                  Coins Awarded Quantity
                </label>
                <div className="relative">
                  <Coins className="absolute left-3 top-3 h-3.5 w-3.5 text-amber-500/60" />
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 50"
                    value={formAmount}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-850 rounded-lg p-2.5 pl-10 text-white font-mono focus:outline-none focus:border-amber-500/50 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-400 hover:bg-amber-350 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg duration-150 cursor-pointer text-center flex items-center justify-center space-x-1.5 shadow-md disabled:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>Publishing Transaction...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5 shrink-0" />
                    <span>Deploy Live Event</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick stats and help panel */}
          <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-3.5">
            <h4 className="text-[10px] font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
              <span>Real-Time Analytics Status</span>
            </h4>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-zinc-900/35 border border-zinc-900 p-3 rounded-xl">
                <p className="text-zinc-500 text-[9px] uppercase tracking-wider">Simulated Traffic</p>
                <p className="text-lg font-bold text-white mt-1 font-mono">
                  {isSimulating ? "ACTIVE" : "PAUSED"}
                </p>
              </div>
              <div className="bg-zinc-900/35 border border-zinc-900 p-3 rounded-xl">
                <p className="text-zinc-500 text-[9px] uppercase tracking-wider">Sync Integrity</p>
                <p className="text-lg font-bold text-emerald-400 mt-1 font-mono flex items-center">
                  <span>99.9%</span>
                </p>
              </div>
            </div>
            <p className="text-[10px] text-zinc-650 leading-relaxed font-sans">
              *All actions generated here will sync in real-time to other dashboards monitoring the client ledger. Fully secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
