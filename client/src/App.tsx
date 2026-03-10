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
import AiAnalytics from "@/pages/AiAnalytics";
import Landing from "@/pages/Landing";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import RoleSelector from "@/pages/RoleSelector";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useOpsPulseLive } from "@/hooks/useOpsPulseLive";
import { useOpsPulseSounds } from "@/hooks/useOpsPulseSounds";
import { ROLE_ALLOWED_PATHS, type OpsMode, type UserRole } from "@/types/roles";

const AUTH_KEY = "opspulse-authenticated";
const USER_ROLE_KEY = "opspulse-user-role";

function AppContent() {
  const [location, setLocation] = useLocation();
  const [role, setRole] = useState<OpsMode>("Strategic");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem(AUTH_KEY) === "true";
  });
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const storedRole = window.localStorage.getItem(USER_ROLE_KEY);
    return (storedRole as UserRole | null) ?? null;
  });
  const { state, normalized, loading, connected, updateRole } = useOpsPulseLive();
  const [isWarRoom, setIsWarRoom] = useState(false);
  const [warRoomDismissed, setWarRoomDismissed] = useState(false);
  const [simulationValue, setSimulationValue] = useState(1);
  const { playWarRoom } = useOpsPulseSounds();

  const allowedPaths = userRole ? ROLE_ALLOWED_PATHS[userRole] : [];

  useEffect(() => {
    window.localStorage.setItem(AUTH_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (userRole) {
      window.localStorage.setItem(USER_ROLE_KEY, userRole);
    } else {
      window.localStorage.removeItem(USER_ROLE_KEY);
    }
  }, [userRole]);

  useEffect(() => {
    const publicRoutes = ["/", "/signin", "/signup"];

    if (!isAuthenticated) {
      if (!publicRoutes.includes(location)) {
        setLocation("/signin");
      }
      return;
    }

    if (!userRole && location !== "/role-selector") {
      setLocation("/role-selector");
      return;
    }

    if (isAuthenticated && ["/signin", "/signup"].includes(location)) {
      setLocation(userRole ? "/dashboard" : "/role-selector");
      return;
    }

    if (userRole && location !== "/role-selector" && !allowedPaths.includes(location)) {
      setLocation("/dashboard");
    }
  }, [allowedPaths, isAuthenticated, location, setLocation, userRole]);

  useEffect(() => {
    if (normalized) {
      if (normalized.isWarRoom && !isWarRoom && !warRoomDismissed) {
        playWarRoom();
      }

      if (!normalized.isWarRoom && warRoomDismissed) {
        setWarRoomDismissed(false);
      }

      if (!warRoomDismissed) {
        setIsWarRoom(normalized.isWarRoom);
      }
    }
  }, [normalized, isWarRoom, playWarRoom, warRoomDismissed]);

  const handleWarRoomToggle = (nextValue: boolean) => {
    setIsWarRoom(nextValue);

    if (!nextValue && normalized?.isWarRoom) {
      setWarRoomDismissed(true);
      return;
    }

    if (nextValue) {
      setWarRoomDismissed(false);
    }
  };

  const handleEmergencyExit = () => {
    setSimulationValue(1);
    handleWarRoomToggle(false);
  };

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

  const handleSignIn = (_payload: { email: string; password: string }) => {
    setIsAuthenticated(true);
    setLocation(userRole ? "/dashboard" : "/role-selector");
  };

  const handleSignUp = (_payload: { fullName: string; email: string; password: string }) => {
    setIsAuthenticated(true);
    setUserRole(null);
    setLocation("/role-selector");
  };

  if (location === "/") {
    return <Landing />;
  }

  if (location === "/signin") {
    return <SignIn onSubmit={handleSignIn} />;
  }

  if (location === "/signup") {
    return <SignUp onSubmit={handleSignUp} />;
  }

  if (location === "/role-selector") {
    return (
      <RoleSelector
        value={userRole}
        onChange={setUserRole}
        onContinue={() => {
          if (userRole) {
            setLocation("/dashboard");
          }
        }}
      />
    );
  }

  if (!isAuthenticated || !userRole) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-foreground">
      <Sidebar
        isWarRoom={isWarRoom}
        simValue={simulationValue}
        setSimValue={setSimulationValue}
        onExitWarRoom={handleEmergencyExit}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenRoleSetup={() => setLocation("/role-selector")}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          role={role}
          setRole={setRole}
          stressScore={data.stressScore}
          isWarRoom={isWarRoom}
          setIsWarRoom={handleWarRoomToggle}
          connected={connected}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {loading && (
            <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
              Connecting to OpsPulse backend stream...
            </div>
          )}
          <Switch>
            {allowedPaths.includes("/dashboard") && (
              <Route path="/dashboard">
                <Home
                  role={role}
                  userRole={userRole}
                  data={data}
                  events={events}
                  isWarRoom={isWarRoom}
                  rawState={state}
                  onExitEmergency={handleEmergencyExit}
                />
              </Route>
            )}
            {allowedPaths.includes("/sales") && (
              <Route path="/sales">
                <SalesModule isWarRoom={isWarRoom} rawState={state} />
              </Route>
            )}
            {allowedPaths.includes("/inventory") && (
              <Route path="/inventory">
                <InventoryModule isWarRoom={isWarRoom} rawState={state} />
              </Route>
            )}
            {allowedPaths.includes("/support") && (
              <Route path="/support">
                <SupportModule isWarRoom={isWarRoom} rawState={state} />
              </Route>
            )}
            {allowedPaths.includes("/reports") && (
              <Route path="/reports">
                <PredictiveReports isWarRoom={isWarRoom} rawState={state} role={role} />
              </Route>
            )}
            {allowedPaths.includes("/integrations") && (
              <Route path="/integrations">
                <Integrations />
              </Route>
            )}
            {allowedPaths.includes("/ai-analytics") && (
              <Route path="/ai-analytics">
                <AiAnalytics isWarRoom={isWarRoom} rawState={state} data={data} />
              </Route>
            )}
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