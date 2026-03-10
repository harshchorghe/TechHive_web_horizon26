import { motion } from "framer-motion";
import { Package, Truck, AlertCircle, Calendar } from "lucide-react";

export default function InventoryModule({ isWarRoom }: any) {
  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight uppercase">Inventory Command</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">Export Manifest</button>
          <button className="px-4 py-2 bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-bold hover:bg-primary/30 transition-all">Bulk Reorder</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Stock Heatmap Mock */}
        <div className="col-span-12 lg:col-span-8 glass-panel p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Regional Stock Heatmap</h2>
            <div className="flex gap-2">
              <div className="w-24 h-2 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full" />
              <span className="text-[10px] font-bold text-white/40 uppercase">Critical &rarr; Optimal</span>
            </div>
          </div>
          <div className="grid grid-cols-8 md:grid-cols-12 gap-2">
            {Array.from({ length: 96 }).map((_, i) => {
              const status = Math.random();
              const color = status > 0.8 ? 'bg-emerald-500/40 border-emerald-500/50' : status > 0.4 ? 'bg-amber-500/40 border-amber-500/50' : 'bg-red-500/40 border-red-500/50';
              return (
                <Tooltip key={i} text={`SKU-8${i} Status: ${status > 0.4 ? 'Optimal' : 'CRITICAL'}`}>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.005 }}
                    className={`aspect-square rounded-sm border ${color} hover:scale-125 hover:z-10 transition-all cursor-crosshair`}
                  />
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Logistics Timeline */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl flex-1">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Incoming Shipments
            </h2>
            <div className="space-y-6">
              {[
                { id: "LOG-928", status: "In Transit", eta: "4h 20m", item: "SKU-402 (200 units)", color: "text-primary" },
                { id: "LOG-929", status: "Delayed", eta: "48h", item: "SKU-108 (500 units)", color: "text-red-400" },
                { id: "LOG-930", status: "Processing", eta: "72h", item: "SKU-205 (1000 units)", color: "text-white/40" },
              ].map((shipment, i) => (
                <div key={i} className="relative pl-6 border-l border-white/5">
                  <div className={`absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-current ${shipment.color}`} />
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{shipment.id}</span>
                    <span className={`terminal-text text-xs font-bold ${shipment.color}`}>{shipment.eta}</span>
                  </div>
                  <div className="text-xs font-bold mb-1">{shipment.item}</div>
                  <div className="text-[10px] text-white/40 uppercase font-bold">{shipment.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tooltip({ children, text }: any) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#0a0a0c] border border-white/10 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {text}
      </div>
    </div>
  );
}