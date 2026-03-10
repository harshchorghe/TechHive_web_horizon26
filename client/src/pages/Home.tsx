import ExecutiveBriefing from "@/components/ExecutiveBriefing";
import PulseDashboard from "@/components/PulseDashboard";
import PredictiveStressEngine from "@/components/PredictiveStressEngine";
import RootCauseFeed from "@/components/RootCauseFeed";
import DecisionRecommendation from "@/components/DecisionRecommendation";
import ActionROIHistory from "@/components/ActionROIHistory";
import { useState } from "react";
import { USER_ROLE_META, type UserRole } from "@/types/roles";

export default function Home({ role, userRole, data, events, isWarRoom, rawState, onExitEmergency, onEmergencyTaskApproved }: any) {
  const [actionLogs, setActionLogs] = useState<any[]>([]);
  const isBeginner = userRole === "beginner";
  const roleMeta = USER_ROLE_META[userRole as UserRole];

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
      </div>

      {/* Executive Briefing (NLG Layer) */}
      <ExecutiveBriefing data={data} rawState={rawState} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
          <PulseDashboard role={role} data={data} isWarRoom={isWarRoom} />
          {!isBeginner && (
            <PredictiveStressEngine data={data.chartData} isWarRoom={isWarRoom} predictions={rawState?.predictions ?? []} />
          )}

          {!isBeginner && <ActionROIHistory logs={actionLogs} />}

          {isBeginner && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white/70">Guided Starter View</h3>
              <p className="text-sm text-white/55 mt-2">
                Focus on dashboard health, sales trend, and support queue first. Switch role from the sidebar to unlock deep analytics.
              </p>
            </div>
          )}
        </div>

        {!isBeginner && (
          <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            <RootCauseFeed events={events} isWarRoom={isWarRoom} />
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