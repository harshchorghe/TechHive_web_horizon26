import { motion } from "framer-motion";
import { Activity, ShieldAlert, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Header({ role, setRole, stressScore, isWarRoom, setIsWarRoom }: any) {
  const isHighStress = stressScore > 75;
  const stressColor = isHighStress ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : stressScore > 50 ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" : "text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]";
  
  return (
    <header className="glass-panel p-4 md:px-6 rounded-2xl flex flex-col md:flex-row items-center justify-between z-10 relative max-w-7xl mx-auto w-full gap-4 md:gap-0">
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isWarRoom ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-primary/20 text-primary'}`}>
            <Zap className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight tracking-[-0.03em]">OpsPulse</h1>
        </div>
        
        {/* System Heartbeat SVG */}
        <div className="hidden lg:flex items-center h-8 w-32 ml-4 overflow-hidden mask-image-linear">
          <svg viewBox="0 0 100 20" className="w-full h-full stroke-primary fill-none opacity-80" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 4px rgba(59,130,246,0.5))" }}>
            <motion.path
              d="M0,10 L20,10 L25,3 L30,17 L35,10 L100,10"
              animate={{ x: [-100, 100] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-6 md:gap-8 w-full md:w-auto justify-between md:justify-end">
        {/* Role Switcher */}
        <div className="flex items-center gap-1 bg-black/40 p-1.5 rounded-xl border border-white/5 backdrop-blur-md">
          <button 
            onClick={() => setRole("Strategic")}
            className={`px-4 py-1.5 text-sm rounded-lg transition-all font-medium ${role === 'Strategic' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
          >
            Strategic Owner
          </button>
          <button 
            onClick={() => setRole("Tactical")}
            className={`px-4 py-1.5 text-sm rounded-lg transition-all font-medium ${role === 'Tactical' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
          >
            Tactical Ops
          </button>
        </div>

        <div className="flex items-center gap-6">
          {/* Stress Meter */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-xs text-muted-foreground uppercase tracking-widest font-bold">Stress</div>
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors duration-500 bg-black/40 backdrop-blur-md ${isHighStress ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/10'}`}>
              <span className={`terminal-text font-bold text-lg ${stressColor} transition-colors duration-500`}>{stressScore}</span>
              {isHighStress && <motion.div className="absolute inset-0 rounded-full border-2 border-red-500" animate={{ scale: [1, 1.4], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }} />}
            </div>
          </div>

          {/* War Room Toggle */}
          <div className="flex items-center gap-3 pl-6 border-l border-white/10 h-10">
            <ShieldAlert className={`w-5 h-5 transition-colors duration-500 ${isWarRoom ? 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'text-white/30'}`} />
            <Switch 
              checked={isWarRoom} 
              onCheckedChange={setIsWarRoom} 
              className={isWarRoom ? "!bg-red-600 border-red-500" : "bg-white/10"}
            />
          </div>
        </div>
      </div>
    </header>
  );
}