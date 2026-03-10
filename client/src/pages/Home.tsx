import ExecutiveBriefing from "@/components/ExecutiveBriefing";
import PulseDashboard from "@/components/PulseDashboard";
import PredictiveStressEngine from "@/components/PredictiveStressEngine";
import RootCauseFeed from "@/components/RootCauseFeed";
import DecisionRecommendation from "@/components/DecisionRecommendation";
import ActionROIHistory from "@/components/ActionROIHistory";
import { useState } from "react";
import { USER_ROLE_META, type UserRole } from "@/types/roles";
import { AlertTriangle, BarChart3, Lightbulb, Sparkles } from "lucide-react";

export default function Home({ role, userRole, data, events, isWarRoom, rawState, onExitEmergency, onEmergencyTaskApproved }: any) {
  const [actionLogs, setActionLogs] = useState<any[]>([]);
  const isBeginner = userRole === "beginner";
  const isAnalyticsLead = userRole === "analytics";
  const isCrmExpert = userRole === "crm-expert";
  const isDataAnalytics = userRole === "data-analytics";
  const roleMeta = USER_ROLE_META[userRole as UserRole];
  const chartData = data?.chartData ?? [];
  const latestPoints = chartData.slice(-8);
  const avgHealth = latestPoints.length
    ? Math.round(latestPoints.reduce((sum: number, point: any) => sum + (point.health ?? 0), 0) / latestPoints.length)
    : 0;
  const predictedPoints = chartData.filter((point: any) => point.predicted !== null).slice(-6);
  const highestPrediction = predictedPoints.length
    ? Math.max(...predictedPoints.map((point: any) => Number(point.predicted ?? 0)))
    : 0;

  const handleApprove = (issue: any) => {
    const stressReduced = 12;
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      title: issue.title,
      timestamp: new Date().toLocaleTimeString(),
      impact: "Crisis Averted",
      roi: (Math.random() * 500 + 100).toFixed(0),
      stressReduced,
    };
    setActionLogs(prev => [newLog, ...prev]);
    onEmergencyTaskApproved?.(stressReduced);
  };

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] text-white/50 uppercase tracking-[0.2em]">Current Role Experience</p>
          <h2 className="text-lg md:text-xl font-bold mt-1">{roleMeta.label}</h2>
          <p className="text-sm text-white/60 mt-1">{roleMeta.details}</p>
        </div>
        {isBeginner && (
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100">
            Beginner Mode: advanced modules are hidden for clarity.
          </div>
        )}
        {isAnalyticsLead && (
          <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
            Lead View: charts and trend intelligence are prioritized.
          </div>
        )}
      </div>

      {/* Executive Briefing (NLG Layer) */}
      <ExecutiveBriefing data={data} rawState={rawState} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
          <PulseDashboard role={role} data={data} isWarRoom={isWarRoom} />
          {!isBeginner && (
            <PredictiveStressEngine data={data.chartData} isWarRoom={isWarRoom} predictions={rawState?.predictions ?? []} />
          )}

          {(isCrmExpert || isDataAnalytics) && <ActionROIHistory logs={actionLogs} />}

          {isAnalyticsLead && (
            <div className="rounded-2xl border border-amber-300/25 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-5 md:p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-amber-100/80">Lead Analytics Layer</p>
                  <h3 className="text-xl font-bold mt-1">Strategy Charts & Risk Signals</h3>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/30 px-3 py-1 text-xs text-amber-100/90">
                  <BarChart3 className="w-3.5 h-3.5" /> Chart Priority Enabled
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-white/55">8-Point Avg Health</p>
                  <p className="text-2xl font-black mt-1">{avgHealth}%</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-white/55">Highest Predicted Stress</p>
                  <p className="text-2xl font-black mt-1">{highestPrediction.toFixed(0)}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-white/55">Active Scenario Mode</p>
                  <p className="text-2xl font-black mt-1">{role}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-8 gap-2 items-end h-24">
                {latestPoints.map((point: any, index: number) => {
                  const height = Math.max(12, Math.min(100, Number(point.health ?? 0)));
                  return (
                    <div key={`${point.time ?? index}-${index}`} className="rounded-md bg-amber-300/20 relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-300/80 to-orange-300/70" style={{ height: `${height}%` }} />
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-white/50 mt-2">Latest operational health snapshots, optimized for fast lead-level decisions.</p>
            </div>
          )}

          {isCrmExpert && (
            <div className="rounded-2xl border border-blue-300/20 bg-blue-500/5 p-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-blue-100/90">CRM Expert Workbench</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-white/55 text-xs">Workflow Throughput</p>
                  <p className="font-semibold mt-1">High Capacity</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-white/55 text-xs">Integration Status</p>
                  <p className="font-semibold mt-1">All Systems Green</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-white/55 text-xs">Automation Scripts</p>
                  <p className="font-semibold mt-1">6 Ready to Trigger</p>
                </div>
              </div>
            </div>
          )}

          {isDataAnalytics && (
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-500/5 p-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-cyan-100/90">Data Science Diagnostics</h3>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-white/55">Model Drift Risk</p>
                  <p className="mt-1 font-semibold">Low (2.1%)</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-white/55">Forecast Confidence</p>
                  <p className="mt-1 font-semibold">87.4%</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-white/55">Outlier Alerts</p>
                  <p className="mt-1 font-semibold">3 Active Clusters</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-white/55">Retrain Recommendation</p>
                  <p className="mt-1 font-semibold">In 2 Days</p>
                </div>
              </div>
            </div>
          )}

          {isBeginner && (
            <div className="rounded-2xl border border-emerald-300/25 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2 text-emerald-100">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-sm font-bold uppercase tracking-[0.15em]">Guided Starter View</h3>
              </div>
              <p className="text-sm text-white/60 mt-2">Focus on essentials first, then graduate to advanced modules as confidence grows.</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="inline-flex items-center gap-2 font-semibold"><Lightbulb className="w-4 h-4 text-emerald-300" /> Tip 1</p>
                  <p className="text-white/60 mt-1 text-xs">Start with stress score and runway before opening task modules.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="inline-flex items-center gap-2 font-semibold"><BarChart3 className="w-4 h-4 text-emerald-300" /> Tip 2</p>
                  <p className="text-white/60 mt-1 text-xs">Watch sales trend for 30 seconds to spot sudden drop patterns.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="inline-flex items-center gap-2 font-semibold"><AlertTriangle className="w-4 h-4 text-emerald-300" /> Tip 3</p>
                  <p className="text-white/60 mt-1 text-xs">If alerts spike, open Support and prioritize unresolved tickets.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isBeginner && (
          <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            <RootCauseFeed events={events} isWarRoom={isWarRoom} />
            {isAnalyticsLead && <ActionROIHistory logs={actionLogs} />}
          </div>
        )}
      </div>

      {isWarRoom && (
        <DecisionRecommendation
          data={data}
          playbooks={rawState?.recommendations?.playbooks ?? []}
          onApprove={handleApprove}
          onExitEmergency={onExitEmergency}
        />
      )}
    </div>
  );
}