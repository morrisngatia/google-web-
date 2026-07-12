import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Heart, Star } from "lucide-react";
import { Product } from "../data/products";

interface HomeSectionProps {
  onShopNow: () => void;
  featuredProducts: Product[];
  onSelectProduct: (p: Product) => void;
}

export default function HomeSection({ onShopNow, featuredProducts, onSelectProduct }: HomeSectionProps) {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white px-6">
        {/* Abstract background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/60 via-black to-black z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3710_1px,transparent_1px),linear-gradient(to_bottom,#d4af3710_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 opacity-30"></div>
        
        {/* Soft elegant glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl z-0"></div>

        <div className="relative z-10 max-w-4xl text-center space-y-8 px-4" id="hero-content">
          {/* Accent Badge */}
          <div className="inline-flex items-center space-x-2 bg-zinc-900/80 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-amber-400">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Nairobi's Premium Marketplace</span>
          </div>

          {/* Tagline & Logo */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight font-display text-white">
              MOH <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">STYLIST</span>
            </h1>
            <p className="text-xl md:text-3xl font-light italic tracking-wide text-zinc-300 font-display">
              “Style. Shop. Shine.”
            </p>
          </div>

          <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Where cosmopolitan elegance meets the warmth of authentic Kenyan crafts. Explore couture outerwear, high-end skincare, signature local brass, and professional styling bookings curated for the bold.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="cta-start-shopping"
              onClick={onShopNow}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-semibold tracking-wide hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/20 transition-all duration-300 flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <span>Start Shopping</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Decorative Bottom Bar */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black to-transparent z-10"></div>
      </section>

      {/* Brand Values / Nairobi Pride */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-zinc-950/60 border border-amber-500/10 hover:border-amber-500/20 transition-all space-y-4 shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-wide">Cosmopolitan Aesthetics</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Designed in black, gold, and white. Minimalist luxury structured silhouettes tailored to elevate Nairobi's diverse urban styles.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-zinc-950/60 border border-amber-500/10 hover:border-amber-500/20 transition-all space-y-4 shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-wide">100% Authentic Local Brands</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We empower local Jua Kali metal-smiths, Taita and Kamba weaving cooperatives, and Nairobi beauty labs to list and sell directly.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-zinc-950/60 border border-amber-500/10 hover:border-amber-500/20 transition-all space-y-4 shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Heart className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-wide">Bespoke Professional Bookings</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Book VIP silk presses, makeup treatments, or wardrobe audits directly with elite stylists at our Utawala Studio near Utawala Shopping Mall.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Curated Collections */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-zinc-900 pb-4">
          <div>
            <span className="text-xs text-amber-500 font-bold tracking-widest uppercase">Curated Gems</span>
            <h2 className="text-3xl font-bold font-display text-white mt-1">THE SIGNATURE COLLECTION</h2>
          </div>
          <button 
            onClick={onShopNow}
            className="text-amber-400 hover:text-amber-300 text-xs font-semibold tracking-wider flex items-center space-x-1 group mt-2 sm:mt-0"
          >
            <span>View All Products</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="group rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900 hover:border-amber-500/30 transition-all duration-300 shadow-lg flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] bg-zinc-900 overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
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
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-zinc-500 tracking-widest">{product.category}</span>
                  <h3 
                    onClick={() => onSelectProduct(product)}
                    className="font-semibold text-sm text-white font-sans hover:text-amber-400 cursor-pointer line-clamp-1 transition-colors"
                  >
                    {product.name}
                  </h3>
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
                    <span className="block text-xs text-zinc-500 font-mono">KES {product.priceKES.toLocaleString()}</span>
                    <span className="block text-[10px] text-amber-400/80 font-mono">${product.priceUSD.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="px-3 py-1.5 rounded-lg border border-amber-500/40 text-[10px] font-semibold text-amber-400 hover:bg-amber-500 hover:text-black transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
