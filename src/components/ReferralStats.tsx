import React from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Award,
  ArrowUpRight,
  Sparkles,
  Percent
} from "lucide-react";

interface ReferralStatsProps {
  clicks: number;
  salesCount: number;
  earningsUSD: number;
}

export default function ReferralStats({ clicks, salesCount, earningsUSD }: ReferralStatsProps) {
  // Calculate conversion rate
  const conversionRate = clicks > 0 ? ((salesCount / clicks) * 100).toFixed(1) : "0.0";
  const commissionKES = Math.round(earningsUSD * 130);

  // Milestone check based on salesCount
  const getMilestoneInfo = () => {
    if (salesCount >= 100) {
      return { level: "Platinum Partner", progress: 100, next: "Max Tier Achieved" };
    } else if (salesCount >= 30) {
      return { level: "Gold Partner", progress: Math.min(((salesCount - 30) / 70) * 100, 100), next: "100 sales for Platinum" };
    } else if (salesCount >= 10) {
      return { level: "Silver Partner", progress: Math.min(((salesCount - 10) / 20) * 100, 100), next: "30 sales for Gold" };
    } else {
      return { level: "Bronze Partner", progress: Math.min((salesCount / 10) * 100, 100), next: "10 sales for Silver" };
    }
  };

  const getCommissionRate = (sales: number) => {
    if (sales >= 100) return 0.85;
    if (sales >= 30) return 0.70;
    if (sales >= 10) return 0.60;
    return 0.50;
  };

  const milestone = getMilestoneInfo();
  const currentRate = getCommissionRate(salesCount);

  return (
    <div id="referral-stats-container" className="space-y-6">
      {/* Bento Grid Stats Card Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Clicks card */}
        <div 
          id="stats-clicks-card" 
          className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 hover:border-amber-500/20 duration-300 flex items-center justify-between shadow-lg group relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 duration-500"></div>
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold tracking-wider block">Total Clicks</span>
            <div className="flex items-baseline space-x-1">
              <h4 className="text-2xl font-black font-mono text-white group-hover:text-blue-400 duration-300">{clicks}</h4>
              <span className="text-[10px] text-zinc-600 font-mono">visits</span>
            </div>
            <span className="text-[9px] text-zinc-500 block leading-tight">Unique traffic through your links</span>
          </div>
          <div className="h-10 w-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5 text-blue-400 group-hover:scale-110 duration-300" />
          </div>
        </div>

        {/* Total Sales referred card */}
        <div 
          id="stats-sales-card" 
          className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 hover:border-amber-500/20 duration-300 flex items-center justify-between shadow-lg group relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 duration-500"></div>
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold tracking-wider block">Referred Sales</span>
            <div className="flex items-baseline space-x-1">
              <h4 className="text-2xl font-black font-mono text-white group-hover:text-emerald-400 duration-300">{salesCount}</h4>
              <span className="text-[10px] text-zinc-600 font-mono">orders</span>
            </div>
            <span className="text-[9px] text-zinc-500 block leading-tight">Paid checkouts driven by you</span>
          </div>
          <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
            <ShoppingBag className="h-5 w-5 text-emerald-400 group-hover:scale-110 duration-300" />
          </div>
        </div>

        {/* Conversion rate card */}
        <div 
          id="stats-conversion-card" 
          className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 hover:border-amber-500/20 duration-300 flex items-center justify-between shadow-lg group relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 duration-500"></div>
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold tracking-wider block">Conversion Rate</span>
            <div className="flex items-baseline space-x-0.5">
              <h4 className="text-2xl font-black font-mono text-white group-hover:text-purple-400 duration-300">{conversionRate}</h4>
              <span className="text-xs font-bold text-zinc-400">%</span>
            </div>
            <span className="text-[9px] text-zinc-500 block leading-tight">Referred traffic converting to sales</span>
          </div>
          <div className="h-10 w-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
            <Percent className="h-4 w-4 text-purple-400 group-hover:scale-110 duration-300" />
          </div>
        </div>

        {/* Total Commission Earned card */}
        <div 
          id="stats-commission-card" 
          className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 hover:border-amber-500/20 duration-300 flex items-center justify-between shadow-lg relative overflow-hidden group"
        >
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 duration-500"></div>
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold tracking-wider block text-amber-500">Earned Commission</span>
            <div className="flex items-baseline space-x-1">
              <h4 className="text-2xl font-black font-mono text-amber-400 group-hover:scale-102 duration-300">${earningsUSD.toFixed(2)}</h4>
              <span className="text-[10px] text-zinc-400 font-mono uppercase">USD</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono font-bold block">≈ KES {commissionKES.toLocaleString()} KSh</span>
          </div>
          <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign className="h-5 w-5 text-amber-500 group-hover:rotate-12 duration-300" />
          </div>
        </div>

      </div>

      {/* Commission Tiers & Milestone Levels Panel */}
      <div id="stats-milestone-panel" className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-md space-y-6">
        <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
          <Award className="h-5 w-5 text-amber-500" />
          <div>
            <h4 className="text-sm font-extrabold uppercase text-white tracking-wider">Commission Tiers & Milestone Levels</h4>
            <p className="text-[11px] text-zinc-500">Earn higher commission rates per sale as you drive more referred style orders.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Milestone level & Progress */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900 space-y-3">
              <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono block">Your Current Status</span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">Level: <span className="text-amber-400 font-mono">{milestone.level}</span></span>
                <span className="text-xs font-bold text-zinc-300 font-mono">${currentRate.toFixed(2)} / sale</span>
              </div>
              
              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>Progress: {milestone.next}</span>
                  <span>{Math.round(milestone.progress)}%</span>
                </div>
                <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-850">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${milestone.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-900/10 p-3.5 rounded-xl border border-zinc-900/60">
              💡 <strong>How it works:</strong> All registered style partners start at the Bronze tier earning $0.50 per sale. Once your referred checkouts hit the respective milestones, your account is automatically upgraded to the next tier and all future commissions are calculated at your new unlocked higher rate!
            </div>
          </div>

          {/* Commission Tiers Table */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden border border-zinc-900 rounded-xl bg-zinc-900/20">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-zinc-900/50 text-zinc-400 font-bold uppercase text-[9px] font-mono border-b border-zinc-900">
                    <th className="px-3 py-2">Tier Level</th>
                    <th className="px-3 py-2 text-center">Milestone</th>
                    <th className="px-3 py-2 text-right">Rate / Sale</th>
                    <th className="px-3 py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300 font-mono text-[11px]">
                  {[
                    { name: "Bronze", range: "0 - 9 Sales", rate: "$0.50 USD", minSales: 0 },
                    { name: "Silver", range: "10 - 29 Sales", rate: "$0.60 USD", minSales: 10 },
                    { name: "Gold", range: "30 - 99 Sales", rate: "$0.70 USD", minSales: 30 },
                    { name: "Platinum", range: "100+ Sales", rate: "$0.85 USD", minSales: 100 }
                  ].map((tier) => {
                    const isCurrent = currentRate === parseFloat(tier.rate.replace("$", ""));
                    const isUnlocked = salesCount >= tier.minSales;
                    return (
                      <tr key={tier.name} className={`hover:bg-zinc-900/40 ${isCurrent ? "bg-amber-500/5" : ""}`}>
                        <td className="px-3 py-2.5 font-bold">
                          <span className={isCurrent ? "text-amber-400" : "text-zinc-300"}>{tier.name}</span>
                        </td>
                        <td className="px-3 py-2.5 text-center text-zinc-400">{tier.range}</td>
                        <td className="px-3 py-2.5 text-right text-white font-bold">{tier.rate}</td>
                        <td className="px-3 py-2.5 text-right">
                          {isCurrent ? (
                            <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold uppercase tracking-wider">Current</span>
                          ) : isUnlocked ? (
                            <span className="text-[9px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20 font-bold uppercase tracking-wider">Unlocked</span>
                          ) : (
                            <span className="text-[9px] bg-zinc-950 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-900 font-bold uppercase tracking-wider">Locked</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
