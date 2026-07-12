import React, { useState } from "react";
import { Sparkles, ShoppingBag, User, BookOpen, Tv, LayoutDashboard, Phone, MapPin, Menu, X, ArrowUpRight, Mail, Check, Send, Instagram, Facebook } from "lucide-react";

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

// Import data lists
import { PRODUCTS, Product, Review } from "./data/products";
import { BLOG_POSTS, BlogPost } from "./data/blog";
import { MOH_TV_VIDEOS, MohTVVideo } from "./data/mohtv";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "shop" | "mohtv" | "blog" | "dashboard" | "account" | "contact" | "whatsapp">("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core application states (stateful copies of database models)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [mohtvVideos, setMohtvVideos] = useState<MohTVVideo[]>(MOH_TV_VIDEOS);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  
  const [bookings, setBookings] = useState([
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

  const [profile, setProfile] = useState({
    name: "Jane Wanjiru",
    email: "wanjirujane7@gmail.com",
    phone: "0712345678",
    address: "Kilimani, Wood Avenue Apartments, Suite 4C"
  });

  const [orders, setOrders] = useState([
    {
      id: "ord-9382",
      items: [{ name: "Hand-Beaded Golden Brass Collar Choker", quantity: 1, priceKES: 6200 }],
      totalKES: 6200,
      date: "2026-07-09",
      paymentMethod: "M-Pesa Mobile Money",
      status: "Completed"
    }
  ]);

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

  const handleAddOrder = (order: typeof orders[0]) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <div className="min-h-screen bg-black font-sans text-zinc-100 flex flex-col justify-between selection:bg-amber-400 selection:text-black">
      {/* Upper announcements */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black py-2 px-6 text-center text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-1.5 shadow-md">
        <Sparkles className="h-3.5 w-3.5 animate-pulse shrink-0" />
        <span>Style. Shop. Shine. • Hand-stitched premium Nairobi luxury directly from downtown CBD</span>
        <Sparkles className="h-3.5 w-3.5 animate-pulse shrink-0" />
      </div>

      {/* Main header block */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-amber-500/10 shadow-lg px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo and Tagline */}
          <div 
            onClick={() => setActiveTab("home")}
            className="flex flex-col cursor-pointer hover:opacity-90 duration-150"
          >
            <span className="text-xl md:text-2xl font-bold font-display tracking-tight text-white">
              MOH <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">STYLIST</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase mt-0.5">Style. Shop. Shine.</span>
          </div>

          {/* Desktop Navigation Link items */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold tracking-wider text-zinc-400">
            <button
              onClick={() => setActiveTab("home")}
              className={`hover:text-amber-400 transition-colors uppercase cursor-pointer ${activeTab === "home" ? "text-amber-400 border-b-2 border-amber-400 pb-1" : ""}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab("shop")}
              className={`hover:text-amber-400 transition-colors uppercase cursor-pointer ${activeTab === "shop" ? "text-amber-400 border-b-2 border-amber-400 pb-1" : ""}`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab("mohtv")}
              className={`hover:text-amber-400 transition-colors uppercase cursor-pointer ${activeTab === "mohtv" ? "text-amber-400 border-b-2 border-amber-400 pb-1" : ""}`}
            >
              Moh TV
            </button>
            <button
              onClick={() => setActiveTab("blog")}
              className={`hover:text-amber-400 transition-colors uppercase cursor-pointer ${activeTab === "blog" ? "text-amber-400 border-b-2 border-amber-400 pb-1" : ""}`}
            >
              Style Journal
            </button>
            <button
              onClick={() => setActiveTab("whatsapp")}
              className={`hover:text-amber-400 transition-colors uppercase cursor-pointer ${activeTab === "whatsapp" ? "text-amber-400 border-b-2 border-amber-400 pb-1" : ""}`}
            >
              WhatsApp Order
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`hover:text-amber-400 transition-colors uppercase cursor-pointer ${activeTab === "contact" ? "text-amber-400 border-b-2 border-amber-400 pb-1" : ""}`}
            >
              Contact
            </button>
          </nav>

          {/* User utility icons and badges */}
          <div className="flex items-center space-x-3 text-xs">
            {/* Vendor Portal */}
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-1.5 rounded-xl border font-semibold flex items-center space-x-1.5 duration-200 cursor-pointer text-[11px] uppercase tracking-wider ${
                activeTab === "dashboard"
                  ? "bg-amber-400 border-amber-400 text-black shadow-md shadow-amber-400/20"
                  : "border-zinc-850 hover:border-amber-500/30 text-zinc-400 hover:text-white bg-zinc-950"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Partner Suite</span>
            </button>

            {/* Shopping Cart Badges */}
            <button
              onClick={() => setActiveTab("account")}
              className={`p-2 rounded-xl relative border duration-200 cursor-pointer ${
                activeTab === "account"
                  ? "bg-amber-500/10 border-amber-400 text-amber-400"
                  : "border-zinc-850 hover:border-amber-500/20 text-zinc-400 hover:text-white bg-zinc-950"
              }`}
              title="Shopping Cart"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 bg-amber-400 text-black border border-black rounded-full flex items-center justify-center text-[9px] font-extrabold animate-bounce">
                  {cart.reduce((s, c) => s + c.quantity, 0)}
                </span>
              )}
            </button>

            {/* Secure client Profile */}
            <button
              onClick={() => setActiveTab("account")}
              className={`p-2 rounded-xl border duration-200 cursor-pointer hidden sm:block ${
                activeTab === "account"
                  ? "bg-amber-500/10 border-amber-400 text-amber-400"
                  : "border-zinc-850 hover:border-amber-500/20 text-zinc-400 hover:text-white bg-zinc-950"
              }`}
              title="Customer Account"
            >
              <User className="h-4.5 w-4.5" />
            </button>

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
                setActiveTab("whatsapp");
                setIsMobileMenuOpen(false);
              }}
              className="hover:text-amber-400 text-left py-1 text-emerald-400 font-bold"
            >
              WhatsApp Order
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
          <VendorDashboard
            products={products}
            bookings={bookings}
            onToggleStock={handleToggleStock}
            onDeleteProduct={onDeleteProduct}
            onUpdateBookingStatus={handleUpdateBookingStatus}
          />
        )}

        {activeTab === "account" && (
          <CustomerAccount
            cart={cart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveCartItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            bookings={bookings}
            profile={profile}
            onUpdateProfile={setProfile}
            orders={orders}
            onAddOrder={handleAddOrder}
          />
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

        {activeTab === "contact" && <ContactSection />}
      </main>

      {/* FLOATING AI STYLIST & CONCIERGE DRAWER */}
      <AIConcierge />

      {/* Premium brand footer */}
      <footer className="bg-black border-t border-zinc-900 pt-16 pb-8 px-6 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-display">MOH STYLIST</h3>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              Nairobi's premier black, gold, and white fashion editorial hub and local boutique marketplace. We believe in authenticity, precision, and carrying the beauty of Kenyan crafts to the world.
            </p>
            <p className="text-[10px] text-amber-500/80 font-semibold font-mono">Tagline: “Style. Shop. Shine.”</p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-widest text-zinc-300 uppercase">Discover Marketplace</h4>
            <div className="flex flex-col space-y-2">
              <button onClick={() => setActiveTab("whatsapp")} className="text-left hover:text-emerald-400 text-emerald-500 font-bold transition-colors">WhatsApp Order Desk</button>
              <button onClick={() => setActiveTab("shop")} className="text-left hover:text-amber-400 transition-colors">Fashion Apparel</button>
              <button onClick={() => setActiveTab("shop")} className="text-left hover:text-amber-400 transition-colors">Skincare & Beauty Labs</button>
              <button onClick={() => setActiveTab("shop")} className="text-left hover:text-amber-400 transition-colors">Woven Sisal Kiondos</button>
              <button onClick={() => setActiveTab("shop")} className="text-left hover:text-amber-400 transition-colors">Hammered Jua Kali Brass</button>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-widest text-zinc-300 uppercase">Bespoke Studio Services</h4>
            <div className="flex flex-col space-y-2">
              <button onClick={() => setActiveTab("shop")} className="text-left hover:text-amber-400 transition-colors">VIP Hair Styling Makeovers</button>
              <button onClick={() => setActiveTab("shop")} className="text-left hover:text-amber-400 transition-colors">Professional Makeup Sessions</button>
              <button onClick={() => setActiveTab("shop")} className="text-left hover:text-amber-400 transition-colors">Wardrobe Audits directly with Moh</button>
              <button onClick={() => setActiveTab("contact")} className="text-left hover:text-amber-400 transition-colors">Utawala Studio Bookings</button>
            </div>
          </div>

          {/* Contacts info panel */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-widest text-zinc-300 uppercase">Contact & Location</h4>
            <div className="space-y-2 text-[11px] text-zinc-400">
              <div className="flex items-center space-x-2">
                <Phone className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <div className="flex flex-col font-mono">
                  <a href="tel:0708063447" className="hover:text-amber-400">0708063447 (Hotline 1)</a>
                  <a href="tel:0726313043" className="hover:text-amber-400">0726313043 (Hotline 2)</a>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <a href="mailto:infomorrisngatia@gmail.com" className="hover:text-amber-400">infomorrisngatia@gmail.com</a>
              </div>
              <div className="flex items-center space-x-2">
                <Instagram className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <a href="https://www.instagram.com/its_lamoh?igsh=dXZ1eTdhNmh1dzl3" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 font-mono">@its_lamoh</a>
              </div>
              <div className="flex items-center space-x-2">
                <Facebook className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <a href="https://www.facebook.com/profile.php?id=61584217887777" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400">Moh Stylist Facebook</a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>Near Utawala Shopping Mall, 1st Floor Suite, Utawala, Nairobi</span>
              </div>
            </div>
          </div>

          {/* Newsletter signup column */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-widest text-zinc-300 uppercase">Newsletter</h4>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              Subscribe to the Moh Stylist club for early alerts on new runway apparel, tutorial releases, and Utawala studio styling events.
            </p>
            {newsletterSuccess ? (
              <div className="bg-amber-400/10 border border-amber-500/20 text-amber-400 p-3 rounded-xl text-[11px] space-y-1">
                <div className="flex items-center space-x-1.5 font-bold">
                  <Check className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <span>Subscribed Successfully!</span>
                </div>
                <p className="text-zinc-500 text-[10px]">Your email has been added to our marketing dispatch list.</p>
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
                    className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-800 focus:border-amber-500/40 rounded-xl p-2.5 pr-10 text-xs text-white focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 p-1.5 bg-amber-400 hover:bg-amber-350 text-black rounded-lg transition-all duration-200 cursor-pointer"
                    title="Sign up"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-[9px] text-zinc-600 font-mono">Simulates marketing ledger subscription.</p>
              </form>
            )}
          </div>
        </div>

        {/* copyright */}
        <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-600">
          <p>© 2026 Moh Stylist Marketplace. All rights reserved. Built for Nairobi's bold.</p>
          <div className="flex space-x-4">
            <span className="hover:text-zinc-400 cursor-pointer">Security Policy</span>
            <span>•</span>
            <span className="hover:text-zinc-400 cursor-pointer">M-Pesa Terms</span>
            <span>•</span>
            <span className="hover:text-zinc-400 cursor-pointer">Vendor guidelines</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
