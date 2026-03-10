import ExecutiveBriefing from "@/components/ExecutiveBriefing";
import PulseDashboard from "@/components/PulseDashboard";
import PredictiveStressEngine from "@/components/PredictiveStressEngine";
import RootCauseFeed from "@/components/RootCauseFeed";
import DecisionRecommendation from "@/components/DecisionRecommendation";
import ActionROIHistory from "@/components/ActionROIHistory";
import { AlertTriangle, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Home({ role, data, events, isWarRoom, rawState }: any) {
  const [actionLogs, setActionLogs] = useState<any[]>([]);

  const handleApprove = (issue: any) => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      title: issue.title,
      timestamp: new Date().toLocaleTimeString(),
      impact: "Crisis Averted",
      roi: (Math.random() * 500 + 100).toFixed(0),
      stressReduced: Math.floor(Math.random() * 10 + 5)
    };
    setActionLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
      {/* Executive Briefing (NLG Layer) */}
      <ExecutiveBriefing data={data} rawState={rawState} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
          <PulseDashboard role={role} data={data} isWarRoom={isWarRoom} />
          <PredictiveStressEngine data={data.chartData} isWarRoom={isWarRoom} predictions={rawState?.predictions ?? []} />

          <ActionROIHistory logs={actionLogs} />
        </div>

        <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          <RootCauseFeed events={events} isWarRoom={isWarRoom} />
        </div>
      </div>

      {isWarRoom && (
        <DecisionRecommendation
          data={data}
          playbooks={rawState?.recommendations?.playbooks ?? []}
          onApprove={handleApprove}
        />
      )}
    </div>
  );
}