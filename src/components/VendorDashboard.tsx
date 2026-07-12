import React, { useState } from "react";
import { LayoutDashboard, TrendingUp, DollarSign, Calendar, ShoppingBag, Eye, ToggleLeft, ToggleRight, Trash2, Check, X, AlertTriangle } from "lucide-react";
import { Product } from "../data/products";

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
  products: Product[];
  bookings: Booking[];
  onToggleStock: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateBookingStatus: (bookingId: string, status: "Approved" | "Declined") => void;
}

export default function VendorDashboard({
  products,
  bookings,
  onToggleStock,
  onDeleteProduct,
  onUpdateBookingStatus,
}: VendorDashboardProps) {
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
      {/* Dashboard title */}
      <div className="border-b border-zinc-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between">
        <div>
          <span className="text-xs text-amber-500 font-bold tracking-widest uppercase">Moh Stylist Partner Suite</span>
          <h2 className="text-3xl font-bold font-display text-white mt-1">VENDOR PORTAL</h2>
        </div>
        <div className="flex items-center space-x-2 text-xs text-zinc-400 mt-2 sm:mt-0">
          <LayoutDashboard className="h-4.5 w-4.5 text-amber-500" />
          <span>Manage listings, inventory, and incoming salon bookings</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs uppercase tracking-wider">Gross Revenue</span>
            <DollarSign className="h-5 w-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono tracking-tight text-white">{activePeriod.total}</p>
          <span className="text-[10px] text-green-400 font-medium flex items-center">
            <TrendingUp className="h-3.5 w-3.5 mr-1" /> +14.5% from previous cycle
          </span>
        </div>

        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs uppercase tracking-wider">Active Bookings</span>
            <Calendar className="h-5 w-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono tracking-tight text-white">
            {bookings.filter((b) => b.status === "Pending").length} Pending
          </p>
          <span className="text-[10px] text-zinc-400">Out of {bookings.length} total bookings</span>
        </div>

        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs uppercase tracking-wider">Total Listings</span>
            <ShoppingBag className="h-5 w-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono tracking-tight text-white">{products.length} Items</p>
          <span className="text-[10px] text-zinc-400">{products.filter((p) => p.inStock).length} currently in stock</span>
        </div>

        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-xs uppercase tracking-wider">Store Visits</span>
            <Eye className="h-5 w-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono tracking-tight text-white">4.8K Views</p>
          <span className="text-[10px] text-zinc-400">Directly from Nairobi search filters</span>
        </div>
      </div>

      {/* Analytics Chart & Incoming bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Custom SVG sales chart */}
        <div className="lg:col-span-2 bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-500 font-display">Sales Analytics Chart</h3>
            <div className="flex bg-zinc-900 rounded-lg p-1 text-[10px] space-x-1 border border-zinc-850">
              {(["7d", "30d", "12m"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-2.5 py-1 rounded-md font-bold uppercase transition-colors cursor-pointer ${
                    chartPeriod === period ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white"
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

              {/* Gold Polyline */}
              <polyline
                fill="none"
                stroke="#d4af37"
                strokeWidth="1.5"
                points={activePeriod.points}
              />

              {/* Tooltip glow anchors */}
              {activePeriod.points.split(" ").map((pt, idx) => {
                const [x, y] = pt.split(",");
                return (
                  <g key={idx} className="group/dot cursor-pointer">
                    <circle cx={x} cy={y} r="3" fill="#d4af37" stroke="#000" strokeWidth="1" />
                    <circle cx={x} cy={y} r="6" fill="#d4af37" opacity="0" className="hover:opacity-30 transition-opacity" />
                  </g>
                );
              })}

              {/* Gradient definitions */}
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
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
        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-4 flex flex-col h-[300px] sm:h-[350px] lg:h-auto">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-500 font-display">Appointment Bookings</h3>
          
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

                  <div className="border-t border-zinc-850 pt-2 text-[11px] text-zinc-400 space-y-1">
                    <p>Service: <strong className="text-zinc-200">{book.serviceName}</strong></p>
                    <p>Date: <span className="font-mono text-zinc-300">{book.date}</span> @ <span className="font-mono text-zinc-300">{book.time}</span></p>
                    {book.notes && <p className="italic text-zinc-500">"Notes: {book.notes}"</p>}
                  </div>

                  {book.status === "Pending" && (
                    <div className="flex items-center gap-2 pt-1.5">
                      <button
                        onClick={() => onUpdateBookingStatus(book.id, "Approved")}
                        className="flex-1 py-1.5 bg-green-500 hover:bg-green-400 text-black font-semibold text-[10px] rounded flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Check className="h-3 w-3" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => onUpdateBookingStatus(book.id, "Declined")}
                        className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-[10px] rounded flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
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
        <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-500 font-display">Manage Product Inventory</h3>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-900 text-zinc-400 font-semibold uppercase tracking-wider">
                <th className="p-4">Product details</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price (KES)</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-900/25 transition-colors">
                  <td className="p-4 flex items-center space-x-3 font-sans">
                    <img src={p.image} alt={p.name} className="h-10 w-10 object-cover rounded bg-zinc-900" />
                    <span className="font-semibold text-white truncate max-w-[15rem] block">{p.name}</span>
                  </td>
                  <td className="p-4 text-zinc-400">{p.brand}</td>
                  <td className="p-4">
                    <span className="bg-zinc-900 px-2 py-0.5 border border-zinc-850 rounded text-zinc-300 text-[10px] font-mono">
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
                          <ToggleRight className="h-6 w-6 text-green-400 mr-1.5" />
                          <span>In Stock</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-400">
                          <ToggleLeft className="h-6 w-6 text-zinc-600 mr-1.5" />
                          <span>Out of Stock</span>
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
    </div>
  );
}
