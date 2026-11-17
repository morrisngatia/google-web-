import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ShoppingBag, User, BookOpen, Tv, LayoutDashboard, Phone, MapPin, Menu, X, ArrowUpRight, Mail, Check, Send, Instagram, Facebook, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Import components
import HomeSection from "./components/HomeSection";
import ShopSection from "./components/ShopSection";
import MohTVSection from "./components/MohTVSection";
import BlogSection from "./components/BlogSection";
import VendorDashboard from "./components/VendorDashboard";
import CustomerAccount from "./components/CustomerAccount";
import ContactSection from "./components/ContactSection";
import AIConcierge from "./components/AIConcierge";
import WhatsAppSection from "./components/WhatsAppSection";
import AuthModal from "./components/AuthModal";
import MonetizePanel from "./components/MonetizePanel";
import ApiLoginGateway from "./components/ApiLoginGateway";

// Firebase imports
import { auth } from "./lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

// Import data lists
import { PRODUCTS, Product, Review } from "./data/products";
import { BLOG_POSTS, BlogPost } from "./data/blog";
import { MOH_TV_VIDEOS, MohTVVideo } from "./data/mohtv";

const ACCENT_PRESETS = [
  { name: "Nairobi Gold", key: "gold", color: "#D4AF37", hover: "#B8901C", light: "rgba(212, 175, 55, 0.15)" },
  { name: "Crimson Velvet", key: "crimson", color: "#E0115F", hover: "#C00E4E", light: "rgba(224, 17, 95, 0.15)" },
  { name: "Savannah Emerald", key: "emerald", color: "#10B981", hover: "#059669", light: "rgba(16, 185, 129, 0.15)" },
  { name: "Minimal Ivory", key: "ivory", color: "#F5F5F7", hover: "#E5E5EA", light: "rgba(245, 245, 247, 0.15)" },
  { name: "Nairobi Sapphire", key: "sapphire", color: "#0F52BA", hover: "#0C4397", light: "rgba(15, 82, 186, 0.15)" }
];

export default function App() {
  const [activeAccent, setActiveAccent] = useState<string>(() => {
    return localStorage.getItem("moh_accent_key") || "gold";
  });

  useEffect(() => {
    const preset = ACCENT_PRESETS.find(p => p.key === activeAccent) || ACCENT_PRESETS[0];
    document.documentElement.style.setProperty("--accent-color", preset.color);
    document.documentElement.style.setProperty("--accent-hover-color", preset.hover);
    document.documentElement.style.setProperty("--accent-light-color", preset.light);
    localStorage.setItem("moh_accent_key", activeAccent);
  }, [activeAccent]);

  const [activeTab, setActiveTab] = useState<"home" | "shop" | "mohtv" | "blog" | "dashboard" | "account" | "contact" | "whatsapp" | "monetize">("home");
  const [user, setUser] = useState<FirebaseUser | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("moh_stylist_logged_in_user");
      if (stored) {
        try {
          return JSON.parse(stored) as FirebaseUser;
        } catch {
          return null;
        }
      }
    }
    return null;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core application states (stateful copies of database models)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [mohtvVideos, setMohtvVideos] = useState<MohTVVideo[]>(MOH_TV_VIDEOS);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("moh_wishlist_ids");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("moh_wishlist_ids", JSON.stringify(next));
      return next;
    });
  };
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [accountKey, setAccountKey] = useState<number>(0);
  const isMounted = useRef(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 1000);
    return () => clearTimeout(timer);
  };

  const [bookings, setBookings] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("moh_appointments");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // Fallback to default
        }
      }
    }
    return [
      {
        id: "b-1",
        customerName: "Zari Hassan",
        customerEmail: "zari@hassan.com",
        customerPhone: "0711223344",
        serviceName: "VIP Hair Styling & Makeover Booking",
        date: "2026-07-15",
        time: "10:30",
        notes: "Slight chamomile skin allergy",
        status: "Pending" as const
      },
      {
        id: "b-2",
        customerName: "Michael Olunga",
        customerEmail: "olunga@harambee.co.ke",
        customerPhone: "0722334455",
        serviceName: "Personal Styling & Wardrobe Audit Consultation",
        date: "2026-07-16",
        time: "14:00",
        notes: "Prefers virtual consult via Zoom",
        status: "Approved" as const
      }
    ];
  });

  const [profile, setProfile] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("moh_client_profile");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // Fallback
        }
      }
    }
    return {
      name: "Jane Wanjiru",
      email: "wanjirujane7@gmail.com",
      phone: "0712345678",
      address: "Kilimani, Wood Avenue Apartments, Suite 4C"
    };
  });

  const [orders, setOrders] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("moh_order_logs");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // Fallback
        }
      }
    }
    return [
      {
        id: "ord-9382",
        items: [{ name: "Hand-Beaded Golden Brass Collar Choker", quantity: 1, priceKES: 6200 }],
        totalKES: 6200,
        date: "2026-07-09",
        paymentMethod: "M-Pesa Mobile Money",
        status: "Completed"
      }
    ];
  });

  // Setup mount flag to avoid toast on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      isMounted.current = true;
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;
    localStorage.setItem("moh_client_profile", JSON.stringify(profile));
    triggerToast("Profile Saved");
  }, [profile]);

  useEffect(() => {
    if (!isMounted.current) return;
    localStorage.setItem("moh_appointments", JSON.stringify(bookings));
    triggerToast("Appointments Saved");
  }, [bookings]);

  useEffect(() => {
    if (!isMounted.current) return;
    localStorage.setItem("moh_order_logs", JSON.stringify(orders));
    triggerToast("Orders Saved");
  }, [orders]);

  const handleClearAllData = () => {
    localStorage.clear();
    
    setProfile({
      name: "Jane Wanjiru",
      email: "wanjirujane7@gmail.com",
      phone: "0712345678",
      address: "Kilimani, Wood Avenue Apartments, Suite 4C"
    });
    
    setBookings([
      {
        id: "b-1",
        customerName: "Zari Hassan",
        customerEmail: "zari@hassan.com",
        customerPhone: "0711223344",
        serviceName: "VIP Hair Styling & Makeover Booking",
        date: "2026-07-15",
        time: "10:30",
        notes: "Slight chamomile skin allergy",
        status: "Pending" as const
      },
      {
        id: "b-2",
        customerName: "Michael Olunga",
        customerEmail: "olunga@harambee.co.ke",
        customerPhone: "0722334455",
        serviceName: "Personal Styling & Wardrobe Audit Consultation",
        date: "2026-07-16",
        time: "14:00",
        notes: "Prefers virtual consult via Zoom",
        status: "Approved" as const
      }
    ]);

    setOrders([
      {
        id: "ord-9382",
        items: [{ name: "Hand-Beaded Golden Brass Collar Choker", quantity: 1, priceKES: 6200 }],
        totalKES: 6200,
        date: "2026-07-09",
        paymentMethod: "M-Pesa Mobile Money",
        status: "Completed"
      }
    ]);

    setWishlist([]);
    setAccountKey((prev) => prev + 1);
    triggerToast("All Data Reset");
  };

  // Modals selected details states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Newsletter signup state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    // Simulate adding to marketing list
    console.log(`Email ${newsletterEmail} added to the marketing list successfully.`);
    setNewsletterSuccess(true);
    setNewsletterEmail("");
    setTimeout(() => {
      setNewsletterSuccess(false);
    }, 5000);
  };

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Switch to shopping cart view
    setActiveTab("account");
  };

  const handleUpdateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => setCart([]);

  // Vendor Listing Handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleToggleStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const onDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Booking handlers
  const handleBookService = (product: Product, date: string, time: string, notes: string) => {
    const newBook = {
      id: `b-${Date.now()}`,
      customerName: profile.name,
      customerEmail: profile.email,
      customerPhone: profile.phone,
      serviceName: product.name,
      date: date,
      time: time,
      notes: notes,
      status: "Pending" as const
    };
    setBookings((prev) => [newBook, ...prev]);
  };

  const handleUpdateBookingStatus = (bookingId: string, status: "Approved" | "Declined") => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: status } : b))
    );
  };

  // Reviews handlers
  const handleAddReview = (productId: string, review: Review) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [review, ...p.reviews];
          // Recalculate average score
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvg = Math.round((totalRating / updatedReviews.length) * 10) / 10;
          return {
            ...p,
            reviews: updatedReviews,
            rating: newAvg
          };
        }
        return p;
      })
    );
  };

  // Blog and Video likes/comments handlers
  const handleLikePost = (postId: string) => {
    setBlogPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
    // Sync current visual detail modal
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
    }
  };

  const handleAddComment = (postId: string, author: string, text: string) => {
    const newComment = {
      author,
      text,
      date: "Just now"
    };
    setBlogPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
    );
    // Sync current visual detail modal
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => (prev ? { ...prev, comments: [...prev.comments, newComment] } : null));
    }
  };

  const handleLikeVideo = (videoId: string) => {
    setMohtvVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, likes: v.likes + 1 } : v))
    );
  };

  const handleAddVideoComment = (videoId: string, author: string, text: string) => {
    const newComment = {
      author,
      text,
      date: "Just now"
    };
    setMohtvVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, comments: [...v.comments, newComment] } : v))
    );
  };

  // Auth observer and referral parameter hooks
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        localStorage.setItem("moh_stylist_logged_in_user", JSON.stringify({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          phoneNumber: firebaseUser.phoneNumber,
          photoURL: firebaseUser.photoURL
        }));
        // Sync profile fields if auth email/phone are present
        setProfile((prev) => ({
          ...prev,
          name: firebaseUser.displayName || prev.name,
          email: firebaseUser.email || prev.email,
          phone: firebaseUser.phoneNumber || prev.phone
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await auth.signOut();
    localStorage.removeItem("moh_stylist_logged_in_user");
    setUser(null);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("moh_referrer_id", ref);
      
      // Increment clicks on referrers record
      const recordClick = async () => {
        try {
          const { db } = await import("./lib/firebase");
          const { collection, query, where, getDocs, doc, updateDoc, increment } = await import("firebase/firestore");
          
          const q = query(collection(db, "userMonetization"), where("referralCode", "==", ref));
          const querySnap = await getDocs(q);
          if (!querySnap.empty) {
            const referrerDoc = querySnap.docs[0];
            const referrerRef = doc(db, "userMonetization", referrerDoc.id);
            await updateDoc(referrerRef, {
              clicks: increment(1)
            });
            console.log("Registered referral click for:", referrerDoc.id);
          }
        } catch (e) {
          console.warn("Deferred referral click registration:", e);
        }
      };
      recordClick();
    }
  }, []);

  const handleAddOrder = async (order: typeof orders[0]) => {
    setOrders((prev) => [order, ...prev]);

    // Log referral sales
    const refCode = localStorage.getItem("moh_referrer_id");
    if (refCode) {
      try {
        const { db } = await import("./lib/firebase");
        const { collection, query, where, getDocs, addDoc, doc, updateDoc, increment } = await import("firebase/firestore");

        const q = query(collection(db, "userMonetization"), where("referralCode", "==", refCode));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          const referrerDoc = querySnap.docs[0];
          const referrerId = referrerDoc.id;

          // Write referral sale entry
          await addDoc(collection(db, "referralSales"), {
            id: `sale-${Date.now()}`,
            referrerId: referrerId,
            orderId: order.id,
            amountKES: order.totalKES,
            amountUSD: Math.round((order.totalKES / 130) * 100) / 100,
            commissionUSD: 0.50, // 0.5 USD per referred sale!
            timestamp: new Date().toISOString()
          });

          // Credit referrer balance
          const referrerRef = doc(db, "userMonetization", referrerId);
          await updateDoc(referrerRef, {
            salesCount: increment(1),
            earningsUSD: increment(0.50)
          });

          console.log(`Successfully credited referral sales node: ${referrerId}`);
          
          // Clear referrer ID after successfully completed sale
          localStorage.removeItem("moh_referrer_id");
        }
      } catch (err) {
        console.warn("Deferred referral order registration:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans text-zinc-100 flex flex-col justify-between selection:bg-accent selection:text-black">
      {/* Upper announcements */}
      <div 
        className="text-black py-2 px-6 text-center text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-1.5 shadow-md flex-wrap gap-y-1 transition-colors duration-350"
        style={{ backgroundColor: "var(--accent-color)" }}
      >
        <Sparkles className="h-3.5 w-3.5 animate-pulse shrink-0" />
        <span>We are officially LIVE on our custom domain:</span>
        <a href="https://www.mohstylist.ke" target="_blank" rel="noopener noreferrer" className="bg-black px-2 py-0.5 rounded font-extrabold hover:text-white transition-colors tracking-normal mx-1 font-mono uppercase border border-white/10 text-[9px] hover:scale-105 active:scale-95 duration-200" style={{ color: "var(--accent-color)" }}>
          www.mohstylist.ke
        </a>
        <span>• Hand-stitched premium Nairobi luxury directly from downtown CBD</span>
        <Sparkles className="h-3.5 w-3.5 animate-pulse shrink-0" />
      </div>

      {/* Main header block */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b shadow-lg px-6 py-4" style={{ borderColor: "var(--accent-light-color)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo and Tagline */}
          <div 
            onClick={() => setActiveTab("home")}
            className="flex flex-col cursor-pointer hover:opacity-90 duration-150"
          >
            <span className="text-xl md:text-2xl font-bold font-display tracking-tight text-white">
              MOH <span className="transition-colors duration-300" style={{ color: "var(--accent-color)" }}>STYLIST</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase mt-0.5">Style. Shop. Shine.</span>
          </div>

          {/* Desktop Navigation Link items */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold tracking-wider text-zinc-400">
            <button
              onClick={() => setActiveTab("home")}
              className="hover:text-white transition-colors uppercase cursor-pointer pb-1"
              style={activeTab === "home" ? { color: "var(--accent-color)", borderBottom: "2px solid var(--accent-color)" } : {}}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab("shop")}
              className="hover:text-white transition-colors uppercase cursor-pointer pb-1"
              style={activeTab === "shop" ? { color: "var(--accent-color)", borderBottom: "2px solid var(--accent-color)" } : {}}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab("mohtv")}
              className="hover:text-white transition-colors uppercase cursor-pointer pb-1"
              style={activeTab === "mohtv" ? { color: "var(--accent-color)", borderBottom: "2px solid var(--accent-color)" } : {}}
            >
              Moh TV
            </button>
            <button
              onClick={() => setActiveTab("blog")}
              className="hover:text-white transition-colors uppercase cursor-pointer pb-1"
              style={activeTab === "blog" ? { color: "var(--accent-color)", borderBottom: "2px solid var(--accent-color)" } : {}}
            >
              Style Journal
            </button>
            <button
              onClick={() => setActiveTab("monetize")}
              className="hover:text-white transition-colors uppercase cursor-pointer font-bold pb-1"
              style={activeTab === "monetize" ? { color: "var(--accent-color)", borderBottom: "2px solid var(--accent-color)" } : { color: "var(--accent-color)" }}
            >
              Monetize & Earn
            </button>
            <button
              onClick={() => setActiveTab("whatsapp")}
              className="hover:text-white transition-colors uppercase cursor-pointer pb-1"
              style={activeTab === "whatsapp" ? { color: "var(--accent-color)", borderBottom: "2px solid var(--accent-color)" } : {}}
            >
              VIP Order Desk
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className="hover:text-white transition-colors uppercase cursor-pointer pb-1"
              style={activeTab === "contact" ? { color: "var(--accent-color)", borderBottom: "2px solid var(--accent-color)" } : {}}
            >
              Contact
            </button>
          </nav>

          {/* User utility icons and badges */}
          <div className="flex items-center space-x-3 text-xs">
            {/* Customizable Accent Palette Dots */}
            <div className="hidden sm:flex items-center space-x-1.5 mr-1 bg-zinc-950 border border-zinc-900/80 px-2.5 py-1.5 rounded-full" title="Customize Accent Color">
              <span className="text-[8px] font-mono font-bold uppercase text-zinc-500 mr-1 tracking-wider">Accent:</span>
              {ACCENT_PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => setActiveAccent(preset.key)}
                  className={`h-3 w-3 rounded-full transition-all duration-350 relative flex items-center justify-center cursor-pointer hover:scale-125 ${
                    activeAccent === preset.key ? "ring-1 ring-white scale-110" : "opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={`Set accent to ${preset.name}`}
                >
                  {activeAccent === preset.key && (
                    <span className="h-1 w-1 bg-black rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Vendor Portal */}
            <button
              onClick={() => setActiveTab("dashboard")}
              className="px-3 py-1.5 rounded-xl border font-semibold flex items-center space-x-1.5 duration-200 cursor-pointer text-[11px] uppercase tracking-wider bg-zinc-950"
              style={activeTab === "dashboard" ? { backgroundColor: "var(--accent-color)", borderColor: "var(--accent-color)", color: "#000000" } : { borderColor: "#1f1f1f", color: "#a1a1aa" }}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Partner Suite</span>
            </button>

            {/* Shopping Cart Badges */}
            <button
              onClick={() => setActiveTab("account")}
              className="p-2 rounded-xl relative border duration-200 cursor-pointer bg-zinc-950"
              style={activeTab === "account" ? { color: "var(--accent-color)", borderColor: "var(--accent-color)", backgroundColor: "var(--accent-light-color)" } : { borderColor: "#1f1f1f", color: "#a1a1aa" }}
              title="Shopping Cart"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 text-black border border-black rounded-full flex items-center justify-center text-[9px] font-extrabold animate-bounce" style={{ backgroundColor: "var(--accent-color)" }}>
                  {cart.reduce((s, c) => s + c.quantity, 0)}
                </span>
              )}
            </button>

            {/* Secure client Profile / Login Panel */}
            {user ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab("account")}
                  className="px-3 py-1.5 rounded-xl border duration-200 cursor-pointer text-xs font-bold flex items-center space-x-1.5 bg-zinc-950"
                  style={activeTab === "account" ? { color: "var(--accent-color)", borderColor: "var(--accent-color)", backgroundColor: "var(--accent-light-color)" } : { borderColor: "#1f1f1f", color: "#e4e4e7" }}
                  title="View Account"
                >
                  <User className="h-4.5 w-4.5 shrink-0" style={{ color: "var(--accent-color)" }} />
                  <span className="max-w-[80px] truncate hidden md:inline">{user.displayName || "Client"}</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="p-2 border border-red-500/20 hover:border-red-500 text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-xl cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-1.5 rounded-xl border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-bold duration-205 text-xs cursor-pointer shadow-md shadow-amber-500/5"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-zinc-850 bg-zinc-950 text-zinc-400"
            >
              {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Link list menu overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-zinc-900 flex flex-col space-y-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 pb-2">
            <button
              onClick={() => {
                setActiveTab("home");
                setIsMobileMenuOpen(false);
              }}
              className="hover:text-amber-400 text-left py-1"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveTab("shop");
                setIsMobileMenuOpen(false);
              }}
              className="hover:text-amber-400 text-left py-1"
            >
              Marketplace
            </button>
            <button
              onClick={() => {
                setActiveTab("mohtv");
                setIsMobileMenuOpen(false);
              }}
              className="hover:text-amber-400 text-left py-1"
            >
              Moh TV
            </button>
            <button
              onClick={() => {
                setActiveTab("blog");
                setIsMobileMenuOpen(false);
              }}
              className="hover:text-amber-400 text-left py-1"
            >
              Style Journal
            </button>
            <button
              onClick={() => {
                setActiveTab("monetize");
                setIsMobileMenuOpen(false);
              }}
              className="hover:text-amber-500 text-left py-1 text-amber-500 font-bold"
            >
              Monetize & Earn
            </button>
            <button
              onClick={() => {
                setActiveTab("whatsapp");
                setIsMobileMenuOpen(false);
              }}
              className="hover:text-amber-400 text-left py-1 text-emerald-400 font-bold"
            >
              VIP Order Desk
            </button>
            <button
              onClick={() => {
                setActiveTab("contact");
                setIsMobileMenuOpen(false);
              }}
              className="hover:text-amber-400 text-left py-1"
            >
              Contact
            </button>
          </div>
        )}
      </header>

      {/* Main page content tabs routing panel */}
      <main className="flex-1 bg-black pt-8">
        {activeTab === "home" && (
          <HomeSection
            onShopNow={() => setActiveTab("shop")}
            featuredProducts={products}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setActiveTab("shop");
            }}
          />
        )}

        {activeTab === "shop" && (
          <ShopSection
            products={products}
            onAddProduct={handleAddProduct}
            onAddToCart={handleAddToCart}
            onBookService={handleBookService}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            onAddReview={handleAddReview}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeTab === "mohtv" && (
          <MohTVSection
            videos={mohtvVideos}
            onLikeVideo={handleLikeVideo}
            onAddVideoComment={handleAddVideoComment}
          />
        )}

        {activeTab === "blog" && (
          <BlogSection
            posts={blogPosts}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            selectedPost={selectedPost}
            setSelectedPost={setSelectedPost}
          />
        )}

        {activeTab === "dashboard" && (
          user ? (
            <VendorDashboard
              user={user}
              products={products}
              bookings={bookings}
              onToggleStock={handleToggleStock}
              onDeleteProduct={onDeleteProduct}
              onUpdateBookingStatus={handleUpdateBookingStatus}
            />
          ) : (
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs text-accent font-bold tracking-widest uppercase">PARTNER SUITE AUTHENTICATION</span>
                <h2 className="text-2xl font-bold text-white font-display uppercase">Authorized Partner Login</h2>
              </div>
              <ApiLoginGateway role="partner" onAuthSuccess={(firebaseUser) => setUser(firebaseUser)} />
            </div>
          )
        )}

        {activeTab === "account" && (
          user ? (
            <CustomerAccount
              key={accountKey}
              user={user}
              cart={cart}
              onUpdateCartQty={handleUpdateCartQty}
              onRemoveCartItem={handleRemoveCartItem}
              onClearCart={handleClearCart}
              bookings={bookings}
              profile={profile}
              onUpdateProfile={setProfile}
              orders={orders}
              onAddOrder={handleAddOrder}
              products={products}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onTriggerToast={triggerToast}
              onClearAllData={handleClearAllData}
            />
          ) : (
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs text-accent font-bold tracking-widest uppercase">CLIENT PORTAL GATEWAY</span>
                <h2 className="text-2xl font-bold text-white font-display uppercase">Sign in to your client account</h2>
              </div>
              <ApiLoginGateway role="client" onAuthSuccess={(firebaseUser) => setUser(firebaseUser)} />
            </div>
          )
        )}

        {activeTab === "whatsapp" && (
          <WhatsAppSection
            products={products}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setActiveTab("shop");
            }}
          />
        )}

        {activeTab === "monetize" && (
          user ? (
            <MonetizePanel
              user={user}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          ) : (
            <div className="space-y-6">
              <MonetizePanel
                user={user}
                onOpenAuth={() => {}}
              />
              <div className="max-w-4xl mx-auto px-6 pb-12">
                <div className="border-t border-zinc-900 pt-8 text-center space-y-2">
                  <span className="text-xs text-accent font-bold tracking-widest uppercase font-mono">AFFILIATE PORTAL ACCESS</span>
                  <h3 className="text-xl font-bold text-white font-display uppercase">Initialize your affiliate secure session</h3>
                </div>
                <ApiLoginGateway role="affiliate" onAuthSuccess={(firebaseUser) => setUser(firebaseUser)} />
              </div>
            </div>
          )
        )}

        {activeTab === "contact" && <ContactSection />}
      </main>

      {/* FLOATING AI STYLIST & CONCIERGE DRAWER */}
      <AIConcierge />

      {/* AUTHENTICATION OVERLAY PANEL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(firebaseUser) => setUser(firebaseUser)}
      />

      {/* Premium brand footer */}
      <footer className="bg-black border-t border-zinc-900 py-[40px] px-6 lg:px-[40px] text-zinc-500 text-xs font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Column (4 columns) */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <h3 className="text-base font-bold tracking-widest text-white uppercase font-display">
              MOH <span className="text-[#D4AF37]">STYLIST</span>
            </h3>
            <p className="text-[13px] leading-[20px] text-zinc-400">
              Nairobi's premier fashion editorial hub and local boutique marketplace. We believe in authenticity, precision, and carrying the beauty of Kenyan crafts to the world.
            </p>
            <p className="text-[11px] text-[#D4AF37] font-semibold tracking-wider font-mono">“Style. Shop. Shine.”</p>
          </div>

          {/* Discover Marketplace (2 columns) */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-2 space-y-3">
            <h4 className="text-[10px] font-bold tracking-widest text-white uppercase border-b border-zinc-900 pb-2">Discover</h4>
            <div className="flex flex-col space-y-2 text-[12px]">
              <button onClick={() => setActiveTab("whatsapp")} className="text-left hover:text-[#D4AF37] text-emerald-500 font-bold transition-colors cursor-pointer">WhatsApp Desk</button>
              <button onClick={() => setActiveTab("shop")} className="text-left hover:text-[#D4AF37] transition-colors cursor-pointer">Fashion Apparel</button>
              <button onClick={() => setActiveTab("shop")} className="text-left hover:text-[#D4AF37] transition-colors cursor-pointer">Skincare Labs</button>
              <button onClick={() => setActiveTab("shop")} className="text-left hover:text-[#D4AF37] transition-colors cursor-pointer">Sisal Kiondos</button>
              <button onClick={() => setActiveTab("shop")} className="text-left hover:text-[#D4AF37] transition-colors cursor-pointer">Artisan Brass</button>
            </div>
          </div>

          {/* Bespoke Studio Services (2 columns) */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-2 space-y-3">
            <h4 className="text-[10px] font-bold tracking-widest text-white uppercase border-b border-zinc-900 pb-2">Services</h4>
            <div className="flex flex-col space-y-2 text-[12px]">
              <button onClick={() => setActiveTab("shop")} className="text-left hover:text-[#D4AF37] transition-colors cursor-pointer">Hair Makeovers</button>
              <button onClick={() => setActiveTab("shop")} className="text-left hover:text-[#D4AF37] transition-colors cursor-pointer">Makeup Treatments</button>
              <button onClick={() => setActiveTab("shop")} className="text-left hover:text-[#D4AF37] transition-colors cursor-pointer">Wardrobe Audits</button>
              <button onClick={() => setActiveTab("contact")} className="text-left hover:text-[#D4AF37] transition-colors cursor-pointer">Studio Bookings</button>
            </div>
          </div>

          {/* Newsletter (4 columns) */}
          <div className="col-span-12 lg:col-span-4 space-y-3">
            <h4 className="text-[10px] font-bold tracking-widest text-white uppercase border-b border-zinc-900 pb-2">Newsletter</h4>
            <p className="text-[12px] leading-[18px] text-zinc-400">
              Subscribe to the Moh Stylist club for early alerts on new runway apparel, tutorial releases, and Utawala studio styling events.
            </p>
            {newsletterSuccess ? (
              <div className="bg-zinc-950 border border-[#D4AF37]/30 text-[#D4AF37] p-3 rounded-none text-[11px] space-y-1">
                <div className="flex items-center space-x-1.5 font-bold">
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />
                  <span>Subscribed Successfully!</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-850 focus:border-[#D4AF37] rounded-none p-2.5 pr-10 text-xs text-white focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 p-1.5 bg-white text-black hover:bg-[#D4AF37] transition-all cursor-pointer"
                    title="Sign up"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Copyright subbar */}
        <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-600 uppercase tracking-wider">
          <p>© 2026 Moh Stylist. Official Domain: <a href="https://www.mohstylist.ke" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-white font-semibold underline ml-1">www.mohstylist.ke</a>.</p>
          <div className="flex space-x-4">
            <span className="hover:text-zinc-400 cursor-pointer">Security Policy</span>
            <span>•</span>
            <span className="hover:text-zinc-400 cursor-pointer">M-Pesa Terms</span>
            <span>•</span>
            <span className="hover:text-zinc-400 cursor-pointer">Vendor guidelines</span>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 bg-black border border-[#D4AF37]/50 text-white px-4 py-3 rounded-lg shadow-[0_0_25px_rgba(212,175,55,0.2)] flex items-center space-x-3 backdrop-blur-md"
          >
            <div className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#D4AF37]">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
