import { motion } from "framer-motion";
import { TrendingUp, ShoppingCart, DollarSign, ArrowUpRight, BarChart2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: 'Mon', sales: 4000, refunds: 240, growth: 12 },
  { name: 'Tue', sales: 3000, refunds: 139, growth: 8 },
  { name: 'Wed', sales: 2000, refunds: 980, growth: -5 },
  { name: 'Thu', sales: 2780, refunds: 390, growth: 15 },
  { name: 'Fri', sales: 1890, refunds: 480, growth: 10 },
  { name: 'Sat', sales: 2390, refunds: 380, growth: 18 },
  { name: 'Sun', sales: 3490, refunds: 430, growth: 22 },
];

export default function SalesModule({ isWarRoom }: any) {
  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight uppercase">Sales Intelligence</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
          Performance Peak
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SalesStat title="Daily Volume" value="$42,842" trend="+12.4%" icon={<TrendingUp />} />
        <SalesStat title="Conversion" value="4.82%" trend="+0.4%" icon={<ShoppingCart />} />
        <SalesStat title="Refund Rate" value="1.2%" trend="-0.2%" icon={<BarChart2 />} isGood={true} />
        <SalesStat title="Avg Ticket" value="$142.00" trend="+$4.20" icon={<DollarSign />} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 glass-panel p-6 rounded-3xl min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Sales Velocity per Channel</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-white/40 uppercase">Direct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-white/40 uppercase">Marketplace</span>
              </div>
            </div>
          </div>
          <div className="flex-1 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl flex-1">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Top 5 Revenue SKUs</h2>
            <div className="space-y-4">
              {[
                { name: "Pro Headset X1", rev: "$24,200", velocity: 94 },
                { name: "Obsidian Mouse", rev: "$18,400", velocity: 82 },
                { name: "Mechanical K1", rev: "$12,100", velocity: 64 },
                { name: "Tactical Pad", rev: "$8,900", velocity: 45 },
                { name: "Custom Cable", rev: "$4,200", velocity: 32 },
              ].map((sku, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white/80">{sku.name}</span>
                    <span className="terminal-text text-primary">{sku.rev}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary/40"
                      initial={{ width: 0 }}
                      animate={{ width: `${sku.velocity}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SalesStat({ title, value, trend, icon, isGood }: any) {
  return (
    <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
      <div className="p-3 bg-white/5 rounded-xl text-white/40">{icon}</div>
      <div>
        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{title}</div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black terminal-text">{value}</span>
          <span className={`text-[10px] font-bold ${trend.startsWith('+') ? (isGood ? 'text-emerald-400' : 'text-emerald-400') : (isGood ? 'text-red-400' : 'text-red-400')}`}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}