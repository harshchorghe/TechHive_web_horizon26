import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, TrendingUp, Info, Activity, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function RootCauseFeed({ events, isWarRoom }: any) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className={`glass-panel p-5 rounded-2xl flex-1 flex flex-col relative overflow-hidden ${isWarRoom ? 'border-red-900/30' : ''}`}>
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <Activity className={`w-4 h-4 ${isWarRoom ? 'text-red-500' : 'text-primary'}`} />
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-bold">
            Nerve Timeline
          </h2>
        </div>
        <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/40 font-bold uppercase">
          Live Feed
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative -mr-2 pr-2">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent z-0" />
        
        <div className="absolute inset-0 overflow-y-auto pr-2 space-y-4 pb-20 no-scrollbar">
          <AnimatePresence>
            {events.map((event: any, i: number) => {
              if (isWarRoom && event.type === 'opportunity') return null;
              
              const isCrisis = event.type === 'crisis';
              const isExpanded = expandedId === event.id;
              
              return (
                <motion.div
                  key={`${event.id}-${i}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`group relative pl-8 pb-4 cursor-pointer`}
                  onClick={() => setExpandedId(isExpanded ? null : event.id)}
                >
                  {/* Timeline Node */}
                  <div className={`absolute left-[13px] top-1.5 w-1.5 h-1.5 rounded-full border border-black z-10 transition-colors ${isCrisis ? 'bg-red-500' : 'bg-primary'}`} />
                  
                  <div className={`p-3 rounded-xl border transition-all duration-300 ${isExpanded ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="terminal-text text-[10px] text-white/30 font-bold uppercase">{event.time}</span>
                      <ChevronDown className={`w-3 h-3 text-white/20 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                    <div className={`text-xs font-bold leading-tight ${isCrisis ? 'text-red-400' : 'text-white/80'}`}>
                      {event.message}
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">Chain Reaction Detected</div>
                            <div className="space-y-3">
                              {[
                                { label: event.title || "Cross-silo trigger", status: "Origin" },
                                { label: event.impact || "Operational impact detected", status: "Impact" },
                                { label: event.recommendedAction || "Action required", status: "Action" }
                              ].map((step, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="w-1 h-1 rounded-full bg-red-500/40" />
                                  <div className="flex-1 flex justify-between">
                                    <span className="text-[11px] text-white/60">{step.label}</span>
                                    <span className="text-[9px] font-bold text-red-500/40 uppercase">{step.status}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}