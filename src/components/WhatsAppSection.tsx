import React, { useState } from "react";
import { MessageCircle, Send, CheckCircle2, ShoppingCart, Scissors, Calendar, ShieldCheck, MapPin, Sparkles, Clipboard } from "lucide-react";
import { Product } from "../data/products";

interface WhatsAppSectionProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

type InquiryType = "product_order" | "bespoke_tailoring" | "styling_session" | "general";

export default function WhatsAppSection({ products, onSelectProduct }: WhatsAppSectionProps) {
  const [inquiryType, setInquiryType] = useState<InquiryType>("product_order");
  
  // Form fields
  const [clientName, setClientName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [sizePreference, setSizePreference] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [customMeasurements, setCustomMeasurements] = useState({
    chest: "",
    waist: "",
    height: "",
    notes: ""
  });
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [consultationDate, setConsultationDate] = useState("");
  const [customRequest, setCustomRequest] = useState("");
  
  const [copied, setCopied] = useState(false);

  // Retrieve details for selected product
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Generate pre-filled text
  const generateWhatsAppMessage = (): string => {
    const greeting = `Hello Moh Stylist Team, I would like to make an inquiry/order:`;
    
    if (inquiryType === "product_order" && selectedProduct) {
      let msg = `✨ *MOH STYLIST MARKETPLACE ORDER* ✨\n\n`;
      msg += `👤 *Client Name:* ${clientName || "[Your Name]"}\n`;
      msg += `📦 *Product:* ${selectedProduct.name} (${selectedProduct.brand})\n`;
      msg += `🏷️ *Size:* ${sizePreference}\n`;
      msg += `🔢 *Quantity:* ${quantity}\n`;
      msg += `💰 *Subtotal:* KES ${(selectedProduct.priceKES * quantity).toLocaleString()} / $${(selectedProduct.priceUSD * quantity).toFixed(2)}\n`;
      if (sizePreference === "Custom Tailored") {
        msg += `📐 *Custom Measurements:*\n`;
        if (customMeasurements.chest) msg += `  - Chest: ${customMeasurements.chest} inches\n`;
        if (customMeasurements.waist) msg += `  - Waist: ${customMeasurements.waist} inches\n`;
        if (customMeasurements.height) msg += `  - Height/Inseam: ${customMeasurements.height} inches\n`;
      }
      if (customMeasurements.notes) {
        msg += `📝 *Order Notes:* ${customMeasurements.notes}\n`;
      }
      msg += `📍 *Delivery Location:* ${deliveryLocation || "[Specify Nairobi / Town]"}\n\n`;
      msg += `Please confirm availability and Lipa na M-Pesa or Airtel Money details. Thank you!`;
      return msg;
    }
    
    if (inquiryType === "bespoke_tailoring") {
      let msg = `✨ *BESPOKE CUSTOM TAILORING REQUEST* ✨\n\n`;
      msg += `👤 *Client Name:* ${clientName || "[Your Name]"}\n`;
      msg += `🧵 *Request Type:* Bespoke custom hand-stitched wear\n`;
      msg += `🎨 *Design details:* ${customRequest || "[Describe style, color, fabrics desired]"}\n`;
      msg += `📐 *Measurements (Inches):*\n`;
      msg += `  - Chest: ${customMeasurements.chest || "Not provided"}\n`;
      msg += `  - Waist: ${customMeasurements.waist || "Not provided"}\n`;
      msg += `  - Height: ${customMeasurements.height || "Not provided"}\n`;
      if (customMeasurements.notes) {
        msg += `📝 *Style Notes/Inspirations:* ${customMeasurements.notes}\n`;
      }
      msg += `📍 *Location:* ${deliveryLocation || "[Your Location]"}\n\n`;
      msg += `Please let me know if I need to visit your Utawala studio or schedule a virtual measurement.`;
      return msg;
    }

    if (inquiryType === "styling_session") {
      let msg = `✨ *STYLING SESSION BOOKING INQUIRY* ✨\n\n`;
      msg += `👤 *Client Name:* ${clientName || "[Your Name]"}\n`;
      msg += `📅 *Preferred Date:* ${consultationDate || "[Select preferred date]"}\n`;
      msg += `💬 *Consultation Type:* ${customRequest || "Bespoke Style Makeover"}\n`;
      msg += `📍 *Venue:* Utawala Studio Styling Suite (Near Utawala Shopping Mall)\n\n`;
      msg += `I would like to book this styling slot. Please let me know if it is available!`;
      return msg;
    }

    // General inquiry
    let msg = `✨ *MOH STYLIST GENERAL ENQUIRY* ✨\n\n`;
    msg += `👤 *Client Name:* ${clientName || "[Your Name]"}\n`;
    msg += `💬 *Message:* ${customRequest || "Hi Moh, I'd love to learn more about your upcoming Nairobi runway designs."}\n`;
    return msg;
  };

  const formattedMsg = generateWhatsAppMessage();
  const encodedMsg = encodeURIComponent(formattedMsg);
  // Phone number 0708063447 in Kenyan international format (without + or lead zeros)
  const waLink = `https://wa.me/254708063447?text=${encodedMsg}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickFillOrder = (productId: string, productName: string) => {
    setInquiryType("product_order");
    setSelectedProductId(productId);
    setCustomRequest("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 animate-fade-in" id="whatsapp-order-hub">
      {/* Visual Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-amber-500/20 p-8 md:p-12 mb-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-mono tracking-widest uppercase">
            <MessageCircle className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>VIP WhatsApp Order Desk</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-display">
            Fast WhatsApp Ordering & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Bespoke Couture</span>
          </h1>
          
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Skip the checkout queues entirely. Build a tailored dispatch ticket or bespoke sizing query below, then instantly forward it to our primary stylist desk at <span className="text-amber-400 font-bold">0708063447</span>. Let's customize your next runway look.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Panel: The Generator Form */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
          <h2 className="text-lg font-bold tracking-tight text-zinc-100 flex items-center space-x-2">
            <Scissors className="h-4.5 w-4.5 text-amber-400" />
            <span>Customize Your Order Dispatch</span>
          </h2>

          {/* Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-zinc-900 rounded-xl">
            <button
              onClick={() => setInquiryType("product_order")}
              className={`py-2 px-2.5 rounded-lg text-[11px] font-semibold tracking-wider uppercase transition-all cursor-pointer text-center ${
                inquiryType === "product_order"
                  ? "bg-amber-400 text-black shadow-md font-bold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
              }`}
            >
              Store Order
            </button>
            <button
              onClick={() => setInquiryType("bespoke_tailoring")}
              className={`py-2 px-2.5 rounded-lg text-[11px] font-semibold tracking-wider uppercase transition-all cursor-pointer text-center ${
                inquiryType === "bespoke_tailoring"
                  ? "bg-amber-400 text-black shadow-md font-bold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
              }`}
            >
              Bespoke Fit
            </button>
            <button
              onClick={() => setInquiryType("styling_session")}
              className={`py-2 px-2.5 rounded-lg text-[11px] font-semibold tracking-wider uppercase transition-all cursor-pointer text-center ${
                inquiryType === "styling_session"
                  ? "bg-amber-400 text-black shadow-md font-bold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
              }`}
            >
              Styling Suite
            </button>
            <button
              onClick={() => setInquiryType("general")}
              className={`py-2 px-2.5 rounded-lg text-[11px] font-semibold tracking-wider uppercase transition-all cursor-pointer text-center ${
                inquiryType === "general"
                  ? "bg-amber-400 text-black shadow-md font-bold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
              }`}
            >
              General Chat
            </button>
          </div>

          {/* Form Container */}
          <div className="space-y-4">
            {/* Common field: Name */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
                Your Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name e.g., Morris Ngatia"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors"
              />
            </div>

            {/* PRODUCT ORDER FIELD PANEL */}
            {inquiryType === "product_order" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Product */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
                      Select Apparel / Item
                    </label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — KES {p.priceKES.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Size Preference */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
                      Preferred Sizing
                    </label>
                    <select
                      value={sizePreference}
                      onChange={(e) => setSizePreference(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors"
                    >
                      <option value="XS">XS (Extra Small)</option>
                      <option value="S">S (Small)</option>
                      <option value="M">M (Medium)</option>
                      <option value="L">L (Large)</option>
                      <option value="XL">XL (Extra Large)</option>
                      <option value="XXL">XXL (Double Extra Large)</option>
                      <option value="Custom Tailored">Custom Tailored (Input Measurements below)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Quantity */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Delivery Location */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
                      Delivery Location / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Kilimani, Nairobi or Thika Road"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Sizing inputs if Custom Tailored is selected */}
                {sizePreference === "Custom Tailored" && (
                  <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-4 space-y-3">
                    <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase block">
                      📐 Sizing Blueprint (Inches)
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[9px] text-zinc-500 font-bold mb-1">Chest</label>
                        <input
                          type="text"
                          placeholder="e.g. 38"
                          value={customMeasurements.chest}
                          onChange={(e) => setCustomMeasurements({...customMeasurements, chest: e.target.value})}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-zinc-500 font-bold mb-1">Waist</label>
                        <input
                          type="text"
                          placeholder="e.g. 32"
                          value={customMeasurements.waist}
                          onChange={(e) => setCustomMeasurements({...customMeasurements, waist: e.target.value})}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-zinc-500 font-bold mb-1">Height</label>
                        <input
                          type="text"
                          placeholder="e.g. 70"
                          value={customMeasurements.height}
                          onChange={(e) => setCustomMeasurements({...customMeasurements, height: e.target.value})}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
                    Order customization requests / Additional notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g., Make the lining gold instead of red, or deliver by Friday afternoon..."
                    value={customMeasurements.notes}
                    onChange={(e) => setCustomMeasurements({...customMeasurements, notes: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors resize-none"
                  />
                </div>
              </>
            )}

            {/* BESPOKE TAILORING FIELD PANEL */}
            {inquiryType === "bespoke_tailoring" && (
              <>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
                    Describe your bespoke vision / suit ideas
                  </label>
                  <textarea
                    rows={4}
                    placeholder="I want a custom double-breasted suit incorporating dark green velvet and premium gold satin linings..."
                    value={customRequest}
                    onChange={(e) => setCustomRequest(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-4 space-y-3">
                  <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase block">
                    📐 Measurements Blueprint (Inches) - Optional
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[9px] text-zinc-500 font-bold mb-1">Chest</label>
                      <input
                        type="text"
                        placeholder="e.g. 40"
                        value={customMeasurements.chest}
                        onChange={(e) => setCustomMeasurements({...customMeasurements, chest: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-500 font-bold mb-1">Waist</label>
                      <input
                        type="text"
                        placeholder="e.g. 34"
                        value={customMeasurements.waist}
                        onChange={(e) => setCustomMeasurements({...customMeasurements, waist: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-500 font-bold mb-1">Height / Inseam</label>
                      <input
                        type="text"
                        placeholder="e.g. 72"
                        value={customMeasurements.height}
                        onChange={(e) => setCustomMeasurements({...customMeasurements, height: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
                      Your Location / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Nairobi, Kenya"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
                      Additional Style/Fabric Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., cotton blends, linens, or wools"
                      value={customMeasurements.notes}
                      onChange={(e) => setCustomMeasurements({...customMeasurements, notes: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            {/* STYLING SESSION FIELD PANEL */}
            {inquiryType === "styling_session" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={consultationDate}
                      onChange={(e) => setConsultationDate(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
                      Session Theme / Focus
                    </label>
                    <select
                      value={customRequest}
                      onChange={(e) => setCustomRequest(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors"
                    >
                      <option value="Bespoke Suit Sizing Appointment">Bespoke Suit Sizing Appointment</option>
                      <option value="Runway Showroom Fitment & Viewing">Runway Showroom Fitment & Viewing</option>
                      <option value="Personal Style Transformation Suite">Personal Style Transformation Suite</option>
                      <option value="Utawala Studio Event Access">Utawala Studio Event Access</option>
                    </select>
                  </div>
                </div>
                <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-850">
                  <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase block mb-1">
                    📍 Workshop Location
                  </span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Moh Stylist Premium Studio Suite, Utawala, near Utawala Shopping Mall Area, Nairobi. Fits are curated directly with Moh.
                  </p>
                </div>
              </>
            )}

            {/* GENERAL ENQUIRY FIELD PANEL */}
            {inquiryType === "general" && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
                  Your Query or Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Ask us anything! e.g., details on upcoming drops, sizing, or styling collaborations..."
                  value={customRequest}
                  onChange={(e) => setCustomRequest(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none transition-colors resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Message Preview and Primary Action */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Dynamic Preview Box */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Window bar */}
            <div className="bg-zinc-900 px-5 py-3.5 border-b border-zinc-850 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                  WhatsApp Draft Ticket
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="text-zinc-400 hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-800"
                title="Copy Message Text"
              >
                <Clipboard className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Simulated Chat Bubble */}
            <div className="p-5 flex-1 min-h-[220px] max-h-[360px] overflow-y-auto bg-zinc-900/20 font-mono text-[11px] leading-relaxed text-zinc-300 select-text whitespace-pre-wrap">
              {formattedMsg}
            </div>

            {/* Dispatch Footer with Click-to-Send */}
            <div className="p-5 bg-zinc-900/80 border-t border-zinc-900 space-y-4">
              {copied && (
                <div className="text-[10px] text-emerald-400 flex items-center justify-center space-x-1 py-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Message text copied to clipboard!</span>
                </div>
              )}

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                id="submit-whatsapp-order"
                className="w-full flex items-center justify-center space-x-2.5 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold tracking-wider text-xs uppercase shadow-lg shadow-emerald-950/40 hover:shadow-emerald-500/10 transition-all text-center cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>Dispatch to +254708063447</span>
              </a>

              <div className="flex items-center justify-center space-x-1.5 text-[9px] text-zinc-500 font-mono uppercase tracking-wider text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500/70" />
                <span>M-Pesa & Airtel Money Till Numbers Available on chat</span>
              </div>
            </div>
          </div>

          {/* Quick-Fill catalog options */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Quick Order Shortcuts</span>
            </h3>
            
            <p className="text-[11px] text-zinc-500">
              Select any of our premium catalog items to instantly load and configure them inside the order template.
            </p>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {products.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => quickFillOrder(p.id, p.name)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-zinc-900 hover:border-amber-500/20 bg-zinc-900/20 hover:bg-zinc-900 text-left transition-all group"
                >
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-zinc-300 group-hover:text-amber-400 transition-colors">
                      {p.name}
                    </p>
                    <p className="text-[9px] text-zinc-500 font-mono uppercase">
                      By {p.brand}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 group-hover:bg-amber-400/10 group-hover:text-amber-400 px-2 py-0.5 rounded transition-all shrink-0">
                    KES {p.priceKES.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-950/40 p-4 border border-zinc-900 rounded-xl space-y-1">
              <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase block">
                🚚 Nationwide Delivery
              </span>
              <p className="text-[9px] text-zinc-500 leading-relaxed">
                Nairobi wide courier within 4 hours. Countrywide via G4S, Fargo, or Easy Coach parcels.
              </p>
            </div>
            <div className="bg-zinc-950/40 p-4 border border-zinc-900 rounded-xl space-y-1">
              <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase block">
                ✂️ Bespoke Adjustments
              </span>
              <p className="text-[9px] text-zinc-500 leading-relaxed">
                Free tailoring sizing checks and minor fits adjustments at our Utawala Studio near the Shopping Mall.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
