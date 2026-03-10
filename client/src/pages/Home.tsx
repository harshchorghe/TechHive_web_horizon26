import { motion } from "framer-motion";
import PulseDashboard from "@/components/PulseDashboard";
import PredictiveStressEngine from "@/components/PredictiveStressEngine";
import RootCauseFeed from "@/components/RootCauseFeed";
import DecisionRecommendation from "@/components/DecisionRecommendation";
import { AlertTriangle, Sparkles } from "lucide-react";

export default function Home({ role, data, events, isWarRoom, rawState }: any) {
  const topRisk = rawState?.alerts?.[0];

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
      {/* Executive Briefing */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel p-6 rounded-2xl border-primary/20 bg-primary/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-[100px] -mr-16 -mt-16" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Executive Briefing</h2>
              <p className="text-sm text-white/60 leading-relaxed max-w-3xl mt-1">
                Welcome back. System stress is <span className="text-white font-mono">{data.stressScore}/100</span>. 
                Revenue velocity is <span className="text-emerald-400 font-mono">${rawState?.sales?.revenue_per_hour?.toFixed?.(0) ?? 0}/h</span>, and
                runway is <span className="text-amber-400 font-mono">{data.runwayDays} days</span>.
                {topRisk ? ` Top priority: ${topRisk.title.toLowerCase()}.` : ""}
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all">
            Full Analysis →
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
          <PulseDashboard role={role} data={data} isWarRoom={isWarRoom} />
          <PredictiveStressEngine data={data.chartData} isWarRoom={isWarRoom} predictions={rawState?.predictions ?? []} />
        </div>

        <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          <RootCauseFeed events={events} isWarRoom={isWarRoom} />
        </div>
      </div>

      {isWarRoom && <DecisionRecommendation data={data} playbooks={rawState?.recommendations?.playbooks ?? []} />}
    </div>
  );
}