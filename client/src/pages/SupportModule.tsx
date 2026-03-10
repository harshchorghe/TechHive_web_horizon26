import { motion } from "framer-motion";
import { Headphones, MessageSquare, ThumbsUp, ThumbsDown, BarChart2 } from "lucide-react";

export default function SupportModule({ isWarRoom }: any) {
  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight uppercase">Support Hub</h1>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Agents</span>
            <span className="text-sm font-black terminal-text">12 / 14</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Avg Response</span>
            <span className="text-sm font-black terminal-text">2m 42s</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 glass-panel p-6 rounded-3xl flex flex-col gap-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Live Sentiment Analysis</h2>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-red-400 flex items-center gap-1"><ThumbsDown className="w-3 h-3" /> Negative</span>
                <span className="text-emerald-400 flex items-center gap-1">Positive <ThumbsUp className="w-3 h-3" /></span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div 
                  className="absolute inset-y-0 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500"
                  initial={{ width: "65%" }}
                  animate={{ width: "74%" }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 5 }}
                />
                <div className="absolute top-1/2 left-[74%] -translate-y-1/2 w-1 h-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10" />
              </div>
              <div className="text-center">
                <span className="terminal-text text-2xl font-black text-emerald-400">74%</span>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Global Satisfaction</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Ticket Volume vs Speed</h2>
            <div className="space-y-4">
              {[
                { label: "Billing", count: 42, speed: "1.2m" },
                { label: "Technical", count: 28, speed: "4.5m" },
                { label: "Logistics", count: 114, speed: "12.8m", critical: true },
                { label: "General", count: 15, speed: "0.8m" },
              ].map((cat, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className={`text-xs font-bold ${cat.critical ? 'text-red-400' : 'text-white/60'}`}>{cat.label}</span>
                  <div className="flex items-center gap-4">
                    <span className="terminal-text text-xs text-white/40">{cat.count} tickets</span>
                    <span className={`terminal-text text-xs font-black ${cat.critical ? 'text-red-400' : 'text-primary'}`}>{cat.speed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 glass-panel p-6 rounded-3xl min-h-[500px]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-8">Live Ticket Stream</h2>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">JD</div>
                    <div>
                      <div className="text-xs font-bold">John Doe <span className="text-white/20 ml-2">#TIC-9284</span></div>
                      <div className="text-[10px] text-white/40 font-mono">T-Minus 4m 20s</div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">Active</div>
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-4">"My shipment #402 has been stuck in 'Processing' for 48 hours. I need this for a project deadline tomorrow..."</p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-primary/20 text-primary text-[10px] font-bold rounded-lg hover:bg-primary/30 transition-all">Claim Ticket</button>
                  <button className="px-3 py-1.5 bg-white/5 text-white/40 text-[10px] font-bold rounded-lg hover:bg-white/10 transition-all">Escalate</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}