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
    <div className="bg-black text-white space-y-[40px] pb-[40px]">
      
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center bg-black border-b border-zinc-900 px-6 py-[40px]">
        {/* Subtle texture grids and glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-950 via-black to-black z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:5rem_5rem] z-0 opacity-40"></div>
        
        {/* Soft, low-contrast premium focus glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] z-0"></div>

        <div className="relative z-10 max-w-4xl text-center space-y-8 px-4 flex flex-col items-center justify-center" id="hero-content">
          
          {/* Centered Logo */}
          <div className="space-y-4 text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-display text-white select-none">
              MOH <span className="text-accent">STYLIST</span>
            </h1>
            {/* Tagline in Accent */}
            <p className="text-lg md:text-2xl font-medium tracking-widest text-accent font-display uppercase">
              “Style. Shop. Shine.”
            </p>
          </div>

          <p className="font-sans text-[16px] font-normal leading-[24px] text-zinc-400 max-w-2xl mx-auto">
            Where cosmopolitan elegance meets the warmth of authentic Kenyan crafts. Explore couture outerwear, premium skincare, signature local brassware, and professional styling bookings curated for the bold.
          </p>

          {/* Clean Call-to-Action Button */}
          <div className="pt-4">
            <button
              id="cta-start-shopping"
              onClick={onShopNow}
              className="px-8 py-3.5 bg-white text-black font-sans font-semibold tracking-wider hover:bg-accent hover:text-black transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer uppercase text-xs"
            >
              <span>Explore Collection</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Brand Values / Nairobi Pride - 12-column grid layout */}
      <section className="max-w-7xl mx-auto px-6 py-[40px]" id="brand-values">
        <div className="grid grid-cols-12 gap-8">
          
          <div className="col-span-12 md:col-span-4 p-8 bg-zinc-950 border border-zinc-900 hover:border-accent/20 transition-all space-y-4">
            <div className="h-10 w-10 border border-accent/20 flex items-center justify-center bg-zinc-950">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-[20px] font-semibold text-white tracking-wide font-sans leading-[24px]">Cosmopolitan Aesthetics</h3>
            <p className="font-sans text-[16px] font-normal leading-[24px] text-zinc-400">
              Minimalist luxury structured silhouettes in black, gold, and white tailored to elevate Nairobi's diverse urban styles.
            </p>
          </div>

          <div className="col-span-12 md:col-span-4 p-8 bg-zinc-950 border border-zinc-900 hover:border-accent/20 transition-all space-y-4">
            <div className="h-10 w-10 border border-accent/20 flex items-center justify-center bg-zinc-950">
              <ShieldCheck className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-[20px] font-semibold text-white tracking-wide font-sans leading-[24px]">Authentic Local Crafts</h3>
            <p className="font-sans text-[16px] font-normal leading-[24px] text-zinc-400">
              We empower local Jua Kali metal-smiths, Taita weavers, and Nairobi beauty labs to list and sell direct-to-consumer.
            </p>
          </div>

          <div className="col-span-12 md:col-span-4 p-8 bg-zinc-950 border border-zinc-900 hover:border-accent/20 transition-all space-y-4">
            <div className="h-10 w-10 border border-accent/20 flex items-center justify-center bg-zinc-950">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-[20px] font-semibold text-white tracking-wide font-sans leading-[24px]">Bespoke Bookings</h3>
            <p className="font-sans text-[16px] font-normal leading-[24px] text-zinc-400">
              Book VIP silk presses, makeup treatments, or wardrobe audits directly with elite stylists at our Nairobi studio.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Curated Collections - 12-column grid layout with clean cards */}
      <section className="max-w-7xl mx-auto px-6 py-[40px] space-y-8" id="curated-collection">
        
        {/* Section Header with Dividers */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-zinc-900 pb-6">
          <div>
            <span className="text-xs text-accent font-semibold tracking-widest uppercase block mb-1">Curated Gems</span>
            <h2 className="text-[32px] font-bold font-display text-white leading-normal uppercase">THE SIGNATURE SELECTION</h2>
          </div>
          <button 
            onClick={onShopNow}
            className="text-accent hover:text-white text-xs font-semibold tracking-widest uppercase flex items-center space-x-1.5 group mt-4 sm:mt-0 cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 12-Column Grid of neat cards */}
        <div className="grid grid-cols-12 gap-8">
          {featuredProducts.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="col-span-12 sm:col-span-6 lg:col-span-3 group bg-zinc-950 border border-zinc-900 hover:border-accent/30 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image Container with precise referrers */}
              <div 
                className="relative aspect-[3/4] bg-zinc-900 overflow-hidden cursor-pointer" 
                onClick={() => onSelectProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-3 left-3 bg-black/95 border border-accent/20 px-2.5 py-0.5 text-[9px] text-accent tracking-widest uppercase font-semibold">
                  {product.brand}
                </div>
                {product.isService && (
                  <div className="absolute top-3 right-3 bg-white text-black px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase">
                    Service
                  </div>
                )}
              </div>

              {/* Product Info with neat cards */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase text-zinc-500 tracking-widest block">{product.category}</span>
                  <h3 
                    onClick={() => onSelectProduct(product)}
                    className="font-semibold text-sm text-white hover:text-accent cursor-pointer line-clamp-1 transition-colors font-sans"
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
                    <div className="flex items-center text-accent">
                      <Star className="h-3 w-3 fill-current mr-1" />
                      <span className="font-semibold text-white text-[11px]">{product.rating.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span className="text-[11px]">{product.reviews.length} reviews</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-900">
                  <div>
                    <span className="block text-xs text-white font-mono font-medium">KES {product.priceKES.toLocaleString()}</span>
                    <span className="block text-[10px] text-accent font-mono font-bold">${product.priceUSD.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="px-3.5 py-1.5 border border-accent/30 text-[10px] font-bold uppercase tracking-wider text-accent hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"
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
