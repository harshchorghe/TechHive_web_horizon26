import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, TrendingUp, Info, Activity } from "lucide-react";

export default function RootCauseFeed({ events, isWarRoom }: any) {
  return (
    <div className={`glass-panel p-5 rounded-2xl flex-1 flex flex-col relative overflow-hidden ${isWarRoom ? 'border-red-900/30' : ''}`}>
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <Activity className={`w-4 h-4 ${isWarRoom ? 'text-red-500' : 'text-primary'}`} />
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-bold">
          Root Cause Nerve
        </h2>
      </div>
      
      <div className="flex-1 overflow-hidden relative -mr-2 pr-2">
        {/* Glow line indicating nerve feed */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/10 to-transparent z-0" />
        
        <div className="absolute inset-0 overflow-y-auto pr-2 space-y-4 pb-20 no-scrollbar">
          <AnimatePresence>
            {events.map((event: any, i: number) => {
              // In War Room, hide purely good news
              if (isWarRoom && event.type === 'opportunity') return null;
              
              const isCrisis = event.type === 'crisis';
              const isOpp = event.type === 'opportunity';
              
              return (
                <motion.div
                  key={`${event.id}-${i}`}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`p-4 rounded-xl border text-sm relative z-10 backdrop-blur-md
                    ${isCrisis ? 'bg-red-500/10 border-red-500/30 shadow-[0_4px_20px_rgba(239,68,68,0.15)]' : 
                      isOpp ? 'bg-emerald-500/10 border-emerald-500/30' : 
                      'bg-white/5 border-white/10'} hover:bg-white/10 transition-colors`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 p-1.5 rounded-md ${isCrisis ? 'bg-red-500/20' : isOpp ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
                      {isCrisis ? <AlertTriangle className="w-4 h-4 text-red-400" /> :
                       isOpp ? <TrendingUp className="w-4 h-4 text-emerald-400" /> :
                       <Info className="w-4 h-4 text-white/60" />}
                    </div>
                    <div className="flex-1">
                      <div className="terminal-text text-xs text-white/40 mb-1.5 tracking-wider">{event.time}</div>
                      <div className={`font-medium ${isCrisis ? 'text-red-100' : isOpp ? 'text-emerald-100' : 'text-white/90'}`}>
                        {event.message}
                      </div>
                      
                      {isCrisis && (
                        <div className="mt-3">
                          <button className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-1.5 rounded-lg transition-colors border border-red-500/30 font-medium">
                            Auto-Resolve →
                          </button>
                        </div>
                      )}
                    </div>
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