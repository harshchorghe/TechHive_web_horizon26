import { TrendingUp, DollarSign, Users, Package, Clock, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function PulseDashboard({ role, data, isWarRoom }: any) {
  if (role === "Strategic") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ImpactCard title="Runway" value={`${data.runwayDays} Days`} icon={<TrendingUp />} trend="-2 days" isWarRoom={isWarRoom} />
        <ImpactCard title="Net Margin" value={`${data.netMargin.toFixed(1)}%`} icon={<DollarSign />} trend="+0.5%" isWarRoom={isWarRoom} isGood={true} />
        <ImpactCard title="Customer LTV" value={`$${data.customerLTV}`} icon={<Users />} trend="-$12" isWarRoom={isWarRoom} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <VelocityChart title="SKU Movement" data={data.skuMovement} icon={<Package />} isWarRoom={isWarRoom} />
      <VelocityChart title="Support Wait" value={`${data.supportWait}m`} icon={<Clock />} isWarRoom={isWarRoom} isBad={data.supportWait > 8} />
      <VelocityChart title="Logistics" value={data.logisticsStatus} icon={<Truck />} isWarRoom={isWarRoom} isBad={data.logisticsStatus === 'Delayed'} />
    </div>
  );
}

function ImpactCard({ title, value, icon, trend, isWarRoom, isGood }: any) {
  const isNegative = trend.startsWith('-');
  const hideInWarRoom = isWarRoom && isGood; // Hide good news in war room
  
  if (hideInWarRoom) {
    return (
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-center border-dashed border-white/10 opacity-30">
        <span className="text-xs uppercase tracking-widest text-muted-foreground terminal-text">Data Suppressed</span>
      </div>
    );
  }

  return (
    <div className={`glass-panel p-6 rounded-2xl flex flex-col gap-6 relative overflow-hidden group transition-colors ${isWarRoom ? 'border-red-900/50 bg-red-950/10' : ''}`}>
      <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex items-center justify-between text-muted-foreground z-10">
        <span className="uppercase tracking-widest text-xs font-bold text-white/60">{title}</span>
        <div className="p-2 bg-white/5 rounded-lg text-white/80">
          {icon}
        </div>
      </div>
      <div className="text-4xl md:text-5xl font-black terminal-text z-10 tracking-tighter">
        {value}
      </div>
      <div className={`text-sm font-medium z-10 flex items-center gap-2 ${isNegative ? 'text-red-400' : 'text-emerald-400'}`}>
        <span className="px-2 py-0.5 rounded bg-current/10 terminal-text">{trend}</span> 
        <span className="text-white/40 font-sans">vs last week</span>
      </div>
    </div>
  );
}

function VelocityChart({ title, value, data, icon, isWarRoom, isBad }: any) {
  const hideInWarRoom = isWarRoom && !isBad && !data;

  if (hideInWarRoom) {
    return (
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-center border-dashed border-white/10 opacity-30">
        <span className="text-xs uppercase tracking-widest text-muted-foreground terminal-text">Nominal</span>
      </div>
    );
  }

  return (
    <div className={`glass-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden min-h-[160px] ${isWarRoom && isBad ? 'border-red-500/30 bg-red-500/5 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]' : ''}`}>
      <div className="flex items-center justify-between text-muted-foreground mb-4 z-10">
        <span className="uppercase tracking-widest text-xs font-bold text-white/60">{title}</span>
        <div className={`p-2 rounded-lg ${isWarRoom && isBad ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/80'}`}>
          {icon}
        </div>
      </div>
      {value ? (
        <div className={`text-3xl font-black terminal-text z-10 tracking-tighter ${isWarRoom && isBad ? 'text-red-400' : ''}`}>{value}</div>
      ) : (
        <div className="flex items-end gap-1.5 h-16 z-10">
          {data?.map((d: number, i: number) => (
            <motion.div 
              key={i} 
              className={`flex-1 rounded-sm ${isWarRoom ? 'bg-red-500/40' : 'bg-primary/40'} hover:bg-primary transition-colors`} 
              initial={{ height: 0 }}
              animate={{ height: `${d}%` }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}