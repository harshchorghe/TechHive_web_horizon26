import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SalesModule from "@/pages/SalesModule";
import InventoryModule from "@/pages/InventoryModule";
import SupportModule from "@/pages/SupportModule";
import PredictiveReports from "@/pages/PredictiveReports";
import Integrations from "@/pages/Integrations";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useEffect, useMemo, useState } from "react";
import { useOpsPulseLive } from "@/hooks/useOpsPulseLive";
import { useOpsPulseSounds } from "@/hooks/useOpsPulseSounds";

function AppContent() {
  const [role, setRole] = useState<"Strategic" | "Tactical">("Strategic");
  const { state, normalized, loading, connected, updateRole } = useOpsPulseLive();
  const [isWarRoom, setIsWarRoom] = useState(false);
  const [simulationValue, setSimulationValue] = useState(1);
  const { playWarRoom } = useOpsPulseSounds();

  useEffect(() => {
    if (normalized) {
      if (normalized.isWarRoom && !isWarRoom) {
        playWarRoom();
      }
      setIsWarRoom(normalized.isWarRoom);
    }
  }, [normalized, isWarRoom, playWarRoom]);

  useEffect(() => {
    void updateRole(role);
  }, [role, updateRole]);

  useEffect(() => {
    if (isWarRoom) {
      document.body.classList.add('war-room');
    } else {
      document.body.classList.remove('war-room');
    }
  }, [isWarRoom]);

  const data = useMemo(() => {
    if (!normalized) {
      return {
        stressScore: 0,
        runwayDays: 0,
        netMargin: 0,
        customerLTV: 0,
        skuMovement: [],
        supportWait: 0,
        logisticsStatus: "On-Time",
        chartData: [],
      };
    }
    const offset = (simulationValue - 1) * 15;
    const chartData = normalized.chartData.map((p, i) => {
      // Apply offset to the most recent and future (predicted) points
      if (i >= 15) {
        return {
          ...p,
          health: Math.max(0, p.health - offset),
          predicted: p.predicted !== null ? Math.max(0, p.predicted - offset) : null
        };
      }
      return p;
    });

    return {
      ...normalized,
      stressScore: Math.min(100, normalized.stressScore + offset),
      chartData
    };
  }, [normalized, simulationValue]);

  const events = normalized?.events ?? [];

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-foreground">
      <Sidebar isWarRoom={isWarRoom} simValue={simulationValue} setSimValue={setSimulationValue} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          role={role}
          setRole={setRole}
          stressScore={data.stressScore}
          isWarRoom={isWarRoom}
          setIsWarRoom={setIsWarRoom}
          connected={connected}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {loading && (
            <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
              Connecting to OpsPulse backend stream...
            </div>
          )}
          <Switch>
            <Route path="/">
              <Home role={role} data={data} events={events} isWarRoom={isWarRoom} rawState={state} />
            </Route>
            <Route path="/sales">
              <SalesModule isWarRoom={isWarRoom} rawState={state} />
            </Route>
            <Route path="/inventory">
              <InventoryModule isWarRoom={isWarRoom} rawState={state} />
            </Route>
            <Route path="/support">
              <SupportModule isWarRoom={isWarRoom} rawState={state} />
            </Route>
            <Route path="/reports">
              <PredictiveReports isWarRoom={isWarRoom} rawState={state} role={role} />
            </Route>
            <Route path="/integrations">
              <Integrations />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      {isWarRoom && <div className="war-room-scanline" />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;