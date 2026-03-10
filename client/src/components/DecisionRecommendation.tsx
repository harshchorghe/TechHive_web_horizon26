import { motion } from "framer-motion";
import { AlertOctagon, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { useOpsPulseSounds } from "@/hooks/useOpsPulseSounds";

const API_BASE = import.meta.env.VITE_OPSPULSE_API_BASE || "http://localhost:8000";

export default function DecisionRecommendation({ playbooks, onApprove, onExitEmergency }: any) {
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const { playSuccess } = useOpsPulseSounds();
  const requiredApprovals = 2;

  const approve = async (issue: any) => {
    if (approvedIds.includes(issue.id)) {
      return;
    }

    setApprovingId(issue.id);
    try {
      await fetch(`${API_BASE}/api/v1/playbooks/${issue.id}/approve`, { method: "POST" });
      playSuccess();
      onApprove?.(issue);
      setApprovedIds((prev) => [...prev, issue.id]);
    } finally {
      setApprovingId(null);
    }
  };

  const activePlaybooks = playbooks.length
    ? playbooks
    : [
      { id: "fallback-1", title: "Stockout Shield", risk: "Revenue leakage risk", action: "Restock now" },
      { id: "fallback-2", title: "Logistics Recovery", risk: "Late fulfillment", action: "Reroute warehouse" },
      { id: "fallback-3", title: "Support Burst", risk: "Sentiment decline", action: "Shift agents" },
    ];

  const completedCount = Math.min(approvedIds.length, requiredApprovals);
  const canExitEmergency = completedCount >= requiredApprovals;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4"
    >
      <div className="bg-[#050505] border-2 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)] rounded-3xl p-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />

        <div className="flex flex-col gap-8 relative z-10">
          <div className="flex items-center justify-between border-b border-red-500/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-500/20 p-3 rounded-xl border border-red-500/30">
                <AlertOctagon className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Emergency Decision Matrix</h2>
                <p className="text-red-400/60 text-xs font-bold uppercase tracking-widest mt-1">Critical Issues Requiring Immediate Authorization</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-red-500/40 uppercase tracking-[0.3em]">Protocol Alpha</div>
              <div className="terminal-text text-xl font-black text-red-500">CRITICAL STATE</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex flex-col gap-2 min-w-[260px] flex-1">
              <p className="text-xs text-white/70">
                Complete <span className="font-bold text-white">{requiredApprovals} approvals</span> to unlock emergency exit.
              </p>
              <div className="h-1.5 w-full max-w-sm rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${(completedCount / requiredApprovals) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-white/50">Progress: {completedCount}/{requiredApprovals} critical actions authorized</p>
            </div>
            <button
              onClick={onExitEmergency}
              disabled={!canExitEmergency}
              className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-300 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:border-white/20 disabled:bg-white/5 disabled:text-white/40"
            >
              {canExitEmergency ? "Resume Console" : "Complete Tasks to Exit"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activePlaybooks.map((issue: any) => (
              <div key={issue.id} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{issue.title}</h3>
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Risk: {issue.risk}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={approvingId === issue.id || approvedIds.includes(issue.id)}
                    onClick={() => approve(issue)}
                    className="flex flex-col items-center justify-center py-3 bg-red-600 hover:bg-red-500 disabled:bg-red-900/50 text-white rounded-xl transition-all group"
                  >
                    <CheckCircle2 className="w-4 h-4 mb-1" />
                    <span className="text-[10px] font-bold uppercase">
                      {approvingId === issue.id ? "Approving..." : approvedIds.includes(issue.id) ? "Approved" : "Approve"}
                    </span>
                  </button>
                  <button className="flex flex-col items-center justify-center py-3 bg-white/5 hover:bg-white/10 text-white/40 rounded-xl transition-all group">
                    <XCircle className="w-4 h-4 mb-1" />
                    <span className="text-[10px] font-bold uppercase">{issue.action || "Ignore"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}