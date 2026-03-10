import { motion } from "framer-motion";
import { Search, Command, Zap, CheckCircle2, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Header({ role, setRole, stressScore, isWarRoom, setIsWarRoom }: any) {
  const isHighStress = stressScore > 75;
  const stressColor = isHighStress ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : stressScore > 50 ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" : "text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]";
  
  return (
    <header className="h-16 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md px-6 flex items-center justify-between z-40 sticky top-0">
      <div className="flex items-center gap-6 flex-1">
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 w-full max-w-sm group focus-within:border-primary/50 transition-colors">
          <Search className="w-4 h-4 text-white/20 group-focus-within:text-primary/50 transition-colors" />
          <input 
            type="text" 
            placeholder="Search for SKU, ticket, or event..." 
            className="bg-transparent border-none outline-none text-xs text-white/80 placeholder:text-white/20 flex-1"
          />
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
            <Command className="w-3 h-3 text-white/40" />
            <span className="text-[10px] font-bold text-white/40">K</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">All Systems Synced</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Role Switcher */}
        <div className="hidden lg:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 backdrop-blur-md">
          <button 
            onClick={() => setRole("Strategic")}
            className={`px-4 py-1.5 text-[11px] uppercase tracking-wider rounded-lg transition-all font-bold ${role === 'Strategic' ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/60'}`}
          >
            Strategic
          </button>
          <button 
            onClick={() => setRole("Tactical")}
            className={`px-4 py-1.5 text-[11px] uppercase tracking-wider rounded-lg transition-all font-bold ${role === 'Tactical' ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/60'}`}
          >
            Tactical
          </button>
        </div>

        {/* Global Stress Gauge */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Stress Level</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-white/20 hover:text-white/40 transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#0a0a0c] border-white/10 text-xs text-white/60 p-3 max-w-xs">
                  Stress is a weighted metric combining burn rate, supply chain health, and support volume.
                </TooltipContent>
              </Tooltip>
            </div>
            <span className={`terminal-text font-black text-xl leading-none ${stressColor}`}>{stressScore}</span>
          </div>
          
          <div className="h-8 w-px bg-white/5 mx-2" />

          <div className="flex items-center gap-3">
            <Zap className={`w-4 h-4 transition-colors duration-500 ${isWarRoom ? 'text-red-500 animate-pulse' : 'text-white/20'}`} />
            <Switch 
              checked={isWarRoom} 
              onCheckedChange={setIsWarRoom} 
              className={isWarRoom ? "!bg-red-600 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]" : "bg-white/10"}
            />
          </div>
        </div>
      </div>
    </header>
  );
}