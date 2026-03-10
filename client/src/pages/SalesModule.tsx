import { motion } from "framer-motion";
import { TrendingUp, ShoppingCart, DollarSign, BarChart2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function SalesModule({ isWarRoom, rawState }: any) {
  const sales = rawState?.sales;
  const support = rawState?.support;
  const chartSeries = (rawState?.chart_data ?? []).slice(-12).map((d: any) => ({
    name: d.time,
    sales: Math.round((sales?.revenue_per_hour ?? 0) * (d.health / 100)),
  }));
  const topSkus = [...(rawState?.inventory?.skus ?? [])]
    .sort((a: any, b: any) => b.velocity_per_hour - a.velocity_per_hour)
    .slice(0, 5);

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight uppercase">Sales Intelligence</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
          Performance Peak
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SalesStat title="Hourly Revenue" value={`$${Math.round(sales?.revenue_per_hour ?? 0)}`} trend={`${rawState?.stress_score ?? 0} stress`} icon={<TrendingUp />} />
        <SalesStat title="Conversion" value={`${(sales?.conversion_rate ?? 0).toFixed(2)}%`} trend={`${sales?.orders_per_hour ?? 0} orders/h`} icon={<ShoppingCart />} />
        <SalesStat title="Refund Rate" value={`${(sales?.refund_rate ?? 0).toFixed(2)}%`} trend={`${support?.ticket_volume_per_hour ?? 0} tickets/h`} icon={<BarChart2 />} isGood={true} />
        <SalesStat title="Avg Ticket" value={`$${(sales?.avg_order_value ?? 0).toFixed(2)}`} trend={`$${Math.round(sales?.cash_reserve ?? 0)} cash`} icon={<DollarSign />} />
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
              <AreaChart data={chartSeries}>
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
              {topSkus.map((sku: any) => (
                <div key={sku.sku} className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white/80">{sku.sku}</span>
                    <span className="terminal-text text-primary">{Math.round(sku.velocity_per_hour)} u/h</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary/40"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.round((sku.stock / Math.max(1, sku.reorder_point * 2)) * 100))}%` }}
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