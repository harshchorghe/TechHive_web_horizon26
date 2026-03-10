import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { OpsState } from "@/types/opspulse";

const API_BASE = import.meta.env.VITE_OPSPULSE_API_BASE || "http://localhost:8000";
const WS_URL = (import.meta.env.VITE_OPSPULSE_WS_URL as string | undefined) || API_BASE.replace("http", "ws") + "/ws";

export function useOpsPulseLive() {
  const [state, setState] = useState<OpsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let active = true;

    const loadSnapshot = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/state`);
        const snapshot = (await response.json()) as OpsState;
        if (active) {
          setState(snapshot);
        }
      } catch {
        // WebSocket stream may still provide data even if snapshot call fails.
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSnapshot();

    const connect = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!active) {
          return;
        }
        setConnected(true);
        ws.send("subscribe");
      };

      ws.onmessage = (event) => {
        if (!active) {
          return;
        }
        try {
          const parsed = JSON.parse(event.data) as { type: string; payload: OpsState };
          if (parsed.payload) {
            setState(parsed.payload);
          }
        } catch {
          // Ignore malformed events.
        }
      };

      ws.onclose = () => {
        if (!active) {
          return;
        }
        setConnected(false);
        setTimeout(connect, 1500);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      active = false;
      if (wsRef.current && wsRef.current.readyState < 2) {
        wsRef.current.close();
      }
    };
  }, []);

  const normalized = useMemo(() => {
    if (!state) {
      return null;
    }

    const tactical = state.tactical_metrics;
    const strategic = state.strategic_metrics;

    return {
      raw: state,
      stressScore: state.stress_score,
      runwayDays: strategic.runway_days,
      netMargin: (strategic.net_profit / Math.max(1, state.sales.revenue_per_hour)) * 100,
      customerLTV: strategic.ltv,
      skuMovement: state.inventory.skus.map((s) => Math.min(100, Math.round((s.stock / Math.max(1, s.reorder_point * 2)) * 100))),
      supportWait: tactical.ticket_resolution_minutes,
      logisticsStatus: state.inventory.incoming_shipments.some((s) => s.status === "Delayed") ? "Delayed" : "On-Time",
      chartData: state.chart_data,
      events: state.events,
      isWarRoom: state.war_room_active,
    };
  }, [state]);

  const updateRole = useCallback(async (role: "Strategic" | "Tactical") => {
    try {
      await fetch(`${API_BASE}/api/v1/role/${role}`, { method: "POST" });
    } catch {
      // Streaming remains primary source of truth.
    }
  }, []);

  return {
    state,
    normalized,
    loading,
    connected,
    apiBase: API_BASE,
    updateRole,
  };
}
