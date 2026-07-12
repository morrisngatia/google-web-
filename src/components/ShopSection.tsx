import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, Star, X, Check, Calendar, ShoppingBag, MessageSquare, AlertCircle, MessageCircle } from "lucide-react";
import { Product, Review } from "../data/products";

interface ShopSectionProps {
  products: Product[];
  onAddProduct: (newProduct: Product) => void;
  onAddToCart: (product: Product) => void;
  onBookService: (product: Product, date: string, time: string, notes: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  onAddReview: (productId: string, review: Review) => void;
}

export default function ShopSection({
  products,
  onAddProduct,
  onAddToCart,
  onBookService,
  selectedProduct,
  setSelectedProduct,
  onAddReview,
}: ShopSectionProps) {
  // Search and Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | "Fashion" | "Beauty" | "Lifestyle" | "Local Brands">("All");
  const [maxPrice, setMaxPrice] = useState(20000);

  // Listing Form Modal
  const [isListingOpen, setIsListingOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newCategory, setNewCategory] = useState<"Fashion" | "Beauty" | "Lifestyle" | "Local Brands">("Fashion");
  const [newPrice, setNewPrice] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDetailed, setNewDetailed] = useState("");
  const [newImage, setNewImage] = useState("");
  const [isService, setIsService] = useState(false);
  const [newSpecs, setNewSpecs] = useState({ "Material": "", "Care": "" });

  // Booking Form State inside Detail Modal
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showFittingForm, setShowFittingForm] = useState(false);

  // Reset fitting form when product selection changes
  useEffect(() => {
    setShowFittingForm(false);
    setBookingDate("");
    setBookingTime("");
    setBookingNotes("");
    setBookingSuccess(false);
  }, [selectedProduct]);

  // Review Form State inside Detail Modal
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.brand.toLowerCase().includes(search.toLowerCase()) ||
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    const matchesPrice = p.priceKES <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleListProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice || !newDesc) return;

    const priceNum = parseFloat(newPrice) || 1000;
    const pId = `moh-${Date.now()}`;
    const defaultImg = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600";

    const productToAdd: Product = {
      id: pId,
      name: newName,
      brand: newBrand || "Guest Vendor",
      category: newCategory,
      description: newDesc,
      detailedDescription: newDetailed || newDesc,
      priceKES: priceNum,
      priceUSD: Math.round((priceNum / 130) * 100) / 100, // Conversion estimation
      rating: 5.0,
      reviews: [],
      image: newImage.trim() || defaultImg,
      inStock: true,
      isService: isService,
      specs: {
        "Material": newSpecs.Material || "Premium Sourced",
        "Care": newSpecs.Care || "Standard maintenance",
        "Listed By": newBrand || "Independent Designer"
      }
    };

    onAddProduct(productToAdd);
    setIsListingOpen(false);
    
    // Reset Form
    setNewName("");
    setNewBrand("");
    setNewPrice("");
    setNewDesc("");
    setNewDetailed("");
    setNewImage("");
    setIsService(false);
    setNewSpecs({ "Material": "", "Care": "" });
  };

  const handleBook = (e: React.FormEvent, product: Product) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime) return;

    onBookService(product, bookingDate, bookingTime, bookingNotes);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingDate("");
      setBookingTime("");
      setBookingNotes("");
      setSelectedProduct(null);
    }, 2500);
  };

  const handleReviewSubmit = (e: React.FormEvent, productId: string) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    const newRev: Review = {
      author: reviewAuthor.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toISOString().split("T")[0]
    };

    onAddReview(productId, newRev);
    
    // Reset reviews state
    setReviewAuthor("");
    setReviewRating(5);
    setReviewComment("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16 space-y-8">
      {/* Search & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fashion, beauty labs, local brands..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-850 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-xs text-zinc-400">
            <Filter className="h-4.5 w-4.5 text-amber-500/70" />
            <span className="hidden sm:inline">Price up to:</span>
            <input
              type="range"
              min="1000"
              max="20000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="accent-amber-500 w-24 sm:w-32"
            />
            <span className="font-mono text-amber-400 font-semibold">KES {maxPrice.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setIsListingOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold text-xs rounded-xl hover:scale-105 active:scale-95 duration-200 shadow-md shadow-amber-500/10 flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>List Product</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
        {(["All", "Fashion", "Beauty", "Lifestyle", "Local Brands"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              category === cat
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/10"
                : "bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900 hover:border-amber-500/30 transition-all duration-300 shadow-lg flex flex-col h-full"
            >
              {/* Product Image */}
              <div 
                onClick={() => setSelectedProduct(product)}
                className="relative aspect-[4/3] bg-zinc-900 overflow-hidden cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-65"></div>
                <div className="absolute top-3 left-3 bg-black/80 border border-amber-500/30 px-2 py-0.5 rounded-md text-[10px] text-amber-400 tracking-wider uppercase font-semibold">
                  {product.brand}
                </div>
                {product.isService && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-black px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase">
                    Service
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-xs font-bold text-red-400 uppercase tracking-widest">
                    Sold Out
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-zinc-500 tracking-widest">{product.category}</span>
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-semibold text-sm text-white hover:text-amber-400 cursor-pointer line-clamp-1 transition-colors"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{product.description}</p>
                  <div className="flex items-center space-x-1.5 text-xs text-zinc-400 pt-0.5">
                    <div className="flex items-center text-amber-400">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="ml-1 font-medium text-white">{product.rating.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span>{product.reviews.length} reviews</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                  <div>
                    <span className="block text-xs text-zinc-300 font-mono">KES {product.priceKES.toLocaleString()}</span>
                    <span className="block text-[10px] text-amber-400/80 font-mono">${product.priceUSD.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {/* Message Stylist WhatsApp Shortcut */}
                    <a
                      href={`https://wa.me/254708063447?text=${encodeURIComponent(`Hi Moh Stylist, I'm interested in the "${product.name}" (KES ${product.priceKES.toLocaleString()}). Is it currently available for styling / fitting?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                      title="Inquire on WhatsApp"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>

                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-3 py-1.5 rounded-lg border border-amber-500/40 text-[10px] font-semibold text-amber-400 hover:bg-amber-500 hover:text-black transition-colors cursor-pointer"
                    >
                      {product.isService ? "Book Session" : "View & Buy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-zinc-950 rounded-2xl border border-zinc-900 text-zinc-400 space-y-2">
          <AlertCircle className="h-10 w-10 text-amber-500/50 mx-auto" />
          <h3 className="font-semibold text-white">No products found</h3>
          <p className="text-xs max-w-md mx-auto">Try checking your spelling, selecting another category, or broadening your price filter.</p>
        </div>
      )}

      {/* VENDOR LISTING FORM MODAL */}
      {isListingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-xl bg-zinc-950 border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsListingOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 border-b border-zinc-900 pb-3">
              LIST A PRODUCT OR SERVICE
            </h3>

            <form onSubmit={handleListProduct} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Brand / Shop Name *</label>
                  <input
                    type="text"
                    required
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g., Sinya Artisans"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Product / Service Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Silk Scarf"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="Fashion">Fashion</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Local Brands">Local Brands</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Price (KES) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g., 4500"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 py-2">
                <input
                  type="checkbox"
                  id="isService"
                  checked={isService}
                  onChange={(e) => setIsService(e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-800 accent-amber-500"
                />
                <label htmlFor="isService" className="text-zinc-300 font-medium select-none cursor-pointer">
                  This is a Salon, Styling, or Event Booking Service
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Short Description *</label>
                <input
                  type="text"
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="One sentence summary of the item..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Detailed Description</label>
                <textarea
                  value={newDetailed}
                  onChange={(e) => setNewDetailed(e.target.value)}
                  placeholder="Elaborate details, materials, background, sizes..."
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500/50 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Image URL (Optional)</label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Paste an Unsplash image URL or leave blank for preset"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-900 pt-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Materials / Ingredients</label>
                  <input
                    type="text"
                    value={newSpecs.Material}
                    onChange={(e) => setNewSpecs({ ...newSpecs, Material: e.target.value })}
                    placeholder="e.g. 100% Silk / Organic Aloe"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium">Care / Maintenance Instructions</label>
                  <input
                    type="text"
                    value={newSpecs.Care}
                    onChange={(e) => setNewSpecs({ ...newSpecs, Care: e.target.value })}
                    placeholder="e.g. Dry Clean Only"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-lg hover:scale-[1.02] active:scale-95 duration-200 mt-4 cursor-pointer"
              >
                Publish Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL / DRAWER */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 overflow-y-auto py-8">
          <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-850 rounded-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => {
                setSelectedProduct(null);
                setBookingSuccess(false);
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Visual */}
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-850">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                {/* Brand and category */}
                <div className="flex items-center justify-between text-xs text-zinc-400 bg-zinc-900/50 p-3 rounded-lg border border-zinc-900">
                  <span>Vendor: <strong className="text-amber-400">{selectedProduct.brand}</strong></span>
                  <span>Category: <strong className="text-white">{selectedProduct.category}</strong></span>
                </div>
              </div>

              {/* Product Info, Buying & Bookings */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold font-display text-white">{selectedProduct.name}</h3>
                  <div className="flex items-center space-x-2 text-xs text-zinc-400 mt-1.5">
                    <div className="flex items-center text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="ml-1 font-semibold text-white">{selectedProduct.rating.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span>{selectedProduct.reviews.length} reviews</span>
                    <span>•</span>
                    <span className={selectedProduct.inStock ? "text-green-400" : "text-red-400"}>
                      {selectedProduct.inStock ? "In Stock" : "Sold Out"}
                    </span>
                  </div>
                </div>

                {/* Price block */}
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-900 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-widest block">Price</span>
                    <span className="text-xl font-bold font-mono text-white">KES {selectedProduct.priceKES.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-500 uppercase tracking-widest block">USD Equivalent</span>
                    <span className="text-sm font-semibold font-mono text-amber-400">${selectedProduct.priceUSD.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-500">Overview</h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">{selectedProduct.detailedDescription}</p>
                </div>

                {/* Specs */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-500">Specifications</h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
                    {Object.entries(selectedProduct.specs).map(([key, val]) => (
                      <div key={key} className="bg-zinc-900 p-2 rounded border border-zinc-900/50">
                        <span className="block text-zinc-500 uppercase text-[9px] font-medium">{key}</span>
                        <span className="text-zinc-200">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BUY BUTTON or BOOKING SERVICE FORM */}
                {!selectedProduct.isService ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        disabled={!selectedProduct.inStock}
                        onClick={() => {
                          onAddToCart(selectedProduct);
                          setSelectedProduct(null);
                        }}
                        className="py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-40 disabled:scale-100 cursor-pointer"
                      >
                        <ShoppingBag className="h-4.5 w-4.5" />
                        <span>Add to Styling Cart</span>
                      </button>

                      {/* Message Stylist Button */}
                      <a
                        href={`https://wa.me/254708063447?text=${encodeURIComponent(`Hi Moh Stylist, I am interested in ordering the "${selectedProduct.name}" (KES ${selectedProduct.priceKES.toLocaleString()}) from your shop. Can we discuss sizing and delivery details?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <MessageCircle className="h-4.5 w-4.5" />
                        <span>Message on WhatsApp</span>
                      </a>
                    </div>

                    {/* Booking Items Button for Couture Apparel */}
                    <button
                      onClick={() => setShowFittingForm(!showFittingForm)}
                      className="w-full py-2.5 bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-amber-400 font-semibold text-xs rounded-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Calendar className="h-4 w-4 text-amber-500" />
                      <span>{showFittingForm ? "Hide Fitting Booking Form" : "Book Custom Fitting & Sizing Session"}</span>
                    </button>

                    {/* Interactive Inline Sizing Fitting Form */}
                    {showFittingForm && (
                      <div className="border border-amber-500/20 bg-zinc-950 p-4 rounded-xl space-y-3 animate-fade-in">
                        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
                          <Calendar className="h-4 w-4 animate-pulse" />
                          <span>Book In-Studio Fitting (Utawala Suite)</span>
                        </div>

                        {bookingSuccess ? (
                          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-lg text-xs flex items-center space-x-2">
                            <Check className="h-4.5 w-4.5 text-green-400 shrink-0" />
                            <span>Fitting appointment requested! Check your Customer Dashboard.</span>
                          </div>
                        ) : (
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!bookingDate || !bookingTime) return;
                              onBookService(
                                selectedProduct,
                                bookingDate,
                                bookingTime,
                                `Bespoke Fitting & Custom Sizing Request for: ${selectedProduct.name}. Sizing details: ${bookingNotes}`
                              );
                              setBookingSuccess(true);
                              setTimeout(() => {
                                setBookingSuccess(false);
                                setShowFittingForm(false);
                                setBookingDate("");
                                setBookingTime("");
                                setBookingNotes("");
                                setSelectedProduct(null);
                              }, 2500);
                            }} 
                            className="space-y-3 text-[11px]"
                          >
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-zinc-400">Preferred Date *</label>
                                <input
                                  type="date"
                                  required
                                  value={bookingDate}
                                  onChange={(e) => setBookingDate(e.target.value)}
                                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-white focus:outline-none focus:border-amber-500/50"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-zinc-400">Preferred Time *</label>
                                <input
                                  type="time"
                                  required
                                  value={bookingTime}
                                  onChange={(e) => setBookingTime(e.target.value)}
                                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-white focus:outline-none focus:border-amber-500/50"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-zinc-400">Sizing comments / Custom requests</label>
                              <input
                                type="text"
                                value={bookingNotes}
                                onChange={(e) => setBookingNotes(e.target.value)}
                                placeholder="e.g. height, chest size, waist line, or any sleeve adjustment..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-white focus:outline-none"
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full py-2 bg-amber-400 text-black font-bold rounded hover:bg-amber-350 transition-colors cursor-pointer"
                            >
                              Confirm & Book Fitting
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border border-amber-500/20 bg-zinc-950 p-4 rounded-xl space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
                      <Calendar className="h-4 w-4" />
                      <span>Book VIP Appointment Session</span>
                    </div>

                    {bookingSuccess ? (
                      <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-lg text-xs flex items-center space-x-2">
                        <Check className="h-4.5 w-4.5 text-green-400 shrink-0" />
                        <span>Appointment request sent successfully! Check Customer Dashboard.</span>
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleBook(e, selectedProduct)} className="space-y-3 text-[11px]">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-zinc-400">Date *</label>
                            <input
                              type="date"
                              required
                              value={bookingDate}
                              onChange={(e) => setBookingDate(e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-white focus:outline-none focus:border-amber-500/50"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-zinc-400">Preferred Time *</label>
                            <input
                              type="time"
                              required
                              value={bookingTime}
                              onChange={(e) => setBookingTime(e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-white focus:outline-none focus:border-amber-500/50"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-zinc-400">Styling Custom requests / Hair Notes</label>
                          <input
                            type="text"
                            value={bookingNotes}
                            onChange={(e) => setBookingNotes(e.target.value)}
                            placeholder="e.g. allergies, hair texture, natural braid pattern..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-white focus:outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2 bg-amber-400 text-black font-semibold rounded hover:bg-amber-350 transition-colors cursor-pointer"
                        >
                          Confirm & Book Booking
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* REVIEWS SECTION */}
            <div className="border-t border-zinc-900 pt-6 space-y-6">
              <h4 className="text-md font-semibold font-display text-white flex items-center space-x-2">
                <MessageSquare className="h-4.5 w-4.5 text-amber-500" />
                <span>Product Reviews & Client Stories ({selectedProduct.reviews.length})</span>
              </h4>

              {/* Add a review form */}
              <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl space-y-3">
                <h5 className="text-xs font-semibold text-amber-400">Have you purchased or styled this? Leave a Review</h5>
                <form onSubmit={(e) => handleReviewSubmit(e, selectedProduct.id)} className="space-y-3 text-[11px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-zinc-400">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        placeholder="e.g. Wanjiku N."
                        className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white focus:outline-none focus:border-amber-500/30"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-zinc-400">Rating *</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(parseInt(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white focus:outline-none"
                      >
                        <option value={5}>5 Stars - Outstanding</option>
                        <option value={4}>4 Stars - Great quality</option>
                        <option value={3}>3 Stars - Average</option>
                        <option value={2}>2 Stars - Needs work</option>
                        <option value={1}>1 Star - Poor experience</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-400">Your Story / Comment *</label>
                    <textarea
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share how you styled this item or your experience with the beauty lab..."
                      rows={2}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-white focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded hover:scale-105 active:scale-95 duration-150 cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {selectedProduct.reviews.length > 0 ? (
                  selectedProduct.reviews.map((rev, idx) => (
                    <div key={idx} className="p-4 bg-zinc-900/20 border border-zinc-900/60 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-300">{rev.author}</span>
                        <span className="text-[10px] text-zinc-500">{rev.date}</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, rIdx) => (
                          <Star
                            key={rIdx}
                            className={`h-3 w-3 ${rIdx < rev.rating ? "fill-current" : "text-zinc-800"}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-zinc-400 italic">"{rev.comment}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic text-center py-4">No reviews yet. Be the first to share your styling experience!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
