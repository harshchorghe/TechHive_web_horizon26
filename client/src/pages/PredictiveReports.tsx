import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar,
} from "recharts";
import { AlertTriangle, CheckCircle2, Radar } from "lucide-react";

type ReportsProps = {
  rawState: any;
  role: "Strategic" | "Tactical";
  isWarRoom: boolean;
};

const featureList = [
  "Live stream engine",
  "Cross-vertical interaction",
  "Multi-variate stress score",
  "Three-tier alert system",
  "Dual role views",
  "War Room auto-activation",
  "Predictive pulse forecast",
  "Root cause mapping",
  "Recommendation playbooks",
];

export default function PredictiveReports({ rawState, role, isWarRoom }: ReportsProps) {
  const [mode, setMode] = useState<"Strategic" | "Tactical" | "War Room">(isWarRoom ? "War Room" : role);

  const predictions = rawState?.predictions ?? [];
  const chartData = rawState?.chart_data ?? [];
  const stress = rawState?.stress_score ?? 0;
  const alerts = rawState?.alerts ?? [];

  const scenarioBars = useMemo(() => {
    const base = Math.max(0, Math.min(100, stress));
    return [
      { name: "Conservative", value: Math.max(0, base - 12) },
      { name: "Expected", value: base },
      { name: "Worst Case", value: Math.min(100, base + 18) },
    ];
  }, [stress]);

  const completedFeatures = useMemo(() => {
    return featureList.filter((feature) => {
      if (feature === "Predictive pulse forecast") {
        return predictions.length > 0;
      }
      if (feature === "Root cause mapping") {
        return (rawState?.root_causes ?? []).length > 0;
      }
      if (feature === "Recommendation playbooks") {
        return (rawState?.recommendations?.playbooks ?? []).length > 0;
      }
      return true;
    });
  }, [predictions, rawState]);

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase">Predictive Reports</h1>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">
            Scenario intelligence and feature coverage
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
          {(["Strategic", "Tactical", "War Room"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${
                mode === m ? "bg-primary/20 text-primary" : "text-white/50 hover:text-white/80"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 glass-panel p-6 rounded-3xl min-h-[360px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Stress Projection Envelope</h2>
            <div className="text-[10px] uppercase font-bold tracking-widest text-white/40">
              Mode: <span className="text-white/70">{mode}</span>
            </div>
          </div>
          <div className="h-[280px] -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.25)" tickLine={false} axisLine={false} fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.25)" tickLine={false} axisLine={false} fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0a0a0c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                <ReferenceLine x={chartData[20]?.time} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="health" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.18} strokeWidth={2} />
                <Area type="monotone" dataKey="predicted" stroke="#ef4444" fill="#ef4444" fillOpacity={0.12} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4 glass-panel p-6 rounded-3xl min-h-[360px]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Forecast Horizon</h2>
          <div className="space-y-3">
            {predictions.map((p: any) => (
              <motion.div key={p.horizon_hours} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">+{p.horizon_hours}h</span>
                  <span className={`terminal-text text-sm font-black ${p.predicted_stress > 80 ? "text-red-400" : p.predicted_stress > 60 ? "text-amber-400" : "text-emerald-400"}`}>
                    {p.predicted_stress}
                  </span>
                </div>
                <p className="text-xs text-white/60">{p.explanation}</p>
              </motion.div>
            ))}
            {predictions.length === 0 && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-xs text-red-300">
                No forecast data is currently available from backend.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6 glass-panel p-6 rounded-3xl min-h-[280px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Scenario Delta</h2>
            <Radar className="w-4 h-4 text-white/30" />
          </div>
          <div className="h-[200px] -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scenarioBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.25)" tickLine={false} axisLine={false} fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.25)" tickLine={false} axisLine={false} fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0a0a0c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 glass-panel p-6 rounded-3xl min-h-[280px]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Frontend Feature Coverage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featureList.map((feature) => {
              const done = completedFeatures.includes(feature);
              return (
                <div key={feature} className={`p-3 rounded-xl border ${done ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"}`}>
                  <div className="flex items-center gap-2">
                    {done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    <span className="text-xs font-bold text-white/80">{feature}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">
            Critical alerts now: <span className="text-red-400">{alerts.filter((a: any) => a.type === "crisis").length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
