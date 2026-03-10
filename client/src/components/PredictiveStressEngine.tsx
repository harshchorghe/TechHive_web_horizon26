import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts";
import { Zap } from "lucide-react";
import { useMemo, useState } from "react";

export default function PredictiveStressEngine({ data, isWarRoom, predictions }: any) {
  const [horizon, setHorizon] = useState(12);
  const selected = useMemo(
    () => predictions?.find((p: any) => p.horizon_hours === horizon),
    [predictions, horizon],
  );

  return (
    <div className={`glass-panel p-6 rounded-2xl flex-1 min-h-[450px] flex flex-col relative overflow-hidden transition-colors duration-1000 ${isWarRoom ? 'border-red-500/30 bg-red-950/20 shadow-[0_0_50px_rgba(239,68,68,0.05)]' : ''}`}>
      {isWarRoom && (
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      )}
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isWarRoom ? 'bg-red-400' : 'bg-primary'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isWarRoom ? 'bg-red-500' : 'bg-primary'}`}></span>
          </span>
          Predictive Health Engine (T-Minus)
        </h2>
        
        {isWarRoom && (
          <div className="flex items-center gap-2 text-red-500 border border-red-500/30 bg-red-500/10 px-3 py-1 rounded-md">
            <Zap className="w-4 h-4" />
            <span className="text-xs terminal-text font-bold animate-pulse">CATASTROPHIC DIVERGENCE DETECTED</span>
          </div>
        )}
      </div>

      <div className="mb-6 flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-2">
          {[6, 12, 24].map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                horizon === h
                  ? "border-primary/60 bg-primary/20 text-primary"
                  : "border-white/10 bg-white/5 text-white/50 hover:text-white/80"
              }`}
            >
              +{h}h
            </button>
          ))}
        </div>
        <div className="text-xs text-white/60 max-w-xl text-right">
          {selected?.explanation || "Forecast calibrating from live velocity signals."}
        </div>
      </div>

      <div className="flex-1 relative z-10 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHealthWar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.3)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              tick={{fontFamily: 'JetBrains Mono'}}
              dy={10}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              tick={{fontFamily: 'JetBrains Mono'}}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(10,10,12,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
              itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: '13px' }}
              labelStyle={{ fontFamily: 'Inter', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
            />
            <ReferenceLine 
              x={data[20]?.time} 
              stroke={isWarRoom ? "#ef4444" : "rgba(255,255,255,0.3)"} 
              strokeDasharray="4 4" 
              label={{ position: 'top', value: 'NOW', fill: isWarRoom ? '#ef4444' : 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
            />
            
            <Area 
              type="monotone" 
              dataKey="health" 
              stroke={isWarRoom ? "#ef4444" : "hsl(var(--primary))"} 
              strokeWidth={2}
              fillOpacity={1} 
              fill={isWarRoom ? "url(#colorHealthWar)" : "url(#colorHealth)"} 
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              stroke="#ef4444" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1} 
              fill="url(#colorPredicted)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}