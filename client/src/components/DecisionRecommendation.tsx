import { motion } from "framer-motion";
import { AlertOctagon, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { useOpsPulseSounds } from "@/hooks/useOpsPulseSounds";

const API_BASE = import.meta.env.VITE_OPSPULSE_API_BASE || "http://localhost:8000";

export default function DecisionRecommendation({ playbooks, onApprove }: any) {
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const { playSuccess } = useOpsPulseSounds();

  const approve = async (issue: any) => {
    setApprovingId(issue.id);
    try {
      await fetch(`${API_BASE}/api/v1/playbooks/${issue.id}/approve`, { method: "POST" });
      playSuccess();
      onApprove?.(issue);
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activePlaybooks.map((issue: any) => (
              <div key={issue.id} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{issue.title}</h3>
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Risk: {issue.risk}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={approvingId === issue.id}
                    onClick={() => approve(issue)}
                    className="flex flex-col items-center justify-center py-3 bg-red-600 hover:bg-red-500 disabled:bg-red-900/50 text-white rounded-xl transition-all group"
                  >
                    <CheckCircle2 className="w-4 h-4 mb-1" />
                    <span className="text-[10px] font-bold uppercase">
                      {approvingId === issue.id ? "Approving..." : "Approve"}
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