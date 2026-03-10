import { motion } from "framer-motion";
import { AlertOctagon, ArrowRight, Zap } from "lucide-react";

export default function DecisionRecommendation({ data }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] md:w-full max-w-3xl"
    >
      <div className="bg-black/80 backdrop-blur-2xl border border-red-500/50 shadow-[0_20px_50px_rgba(239,68,68,0.2)] rounded-3xl p-6 md:p-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
        
        {/* Glow effect behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-500/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
          <div className="bg-red-500/20 p-4 rounded-2xl border border-red-500/30 flex-shrink-0">
            <AlertOctagon className="w-10 h-10 text-red-500 animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-red-500 text-white">Critical</span>
              <span className="text-red-400 text-sm font-mono tracking-wider">00:48:12 REMAINING</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">Predicted Stockout on Hero SKU</h3>
            <p className="text-red-200/80 text-sm md:text-base leading-relaxed">System projects complete inventory depletion in 48 hours leading to $42k revenue loss and 240 delayed shipments.</p>
            
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button className="flex-1 group relative bg-red-600 hover:bg-red-500 text-white px-6 py-4 rounded-xl font-bold transition-all overflow-hidden flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <Zap className="w-5 h-5 fill-white/20" />
                <span>Air Freight Resupply ($1.2k)</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="sm:w-40 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center group cursor-help hover:bg-white/10 transition-colors">
                <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1 font-bold">Simulated Impact</div>
                <div className="terminal-text text-2xl font-bold text-emerald-400 flex items-baseline gap-1 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                  -24 <span className="text-xs font-sans text-emerald-400/50">pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
}