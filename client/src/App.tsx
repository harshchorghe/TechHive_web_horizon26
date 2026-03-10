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
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useState, useEffect } from "react";

const generateMockData = () => {
  const stress = Math.floor(Math.random() * 40) + 40; 
  return {
    stressScore: stress,
    runwayDays: 120 + Math.floor(Math.random() * 10 - 5),
    netMargin: 24.5 + (Math.random() * 1 - 0.5),
    customerLTV: 1240 + Math.floor(Math.random() * 50 - 25),
    skuMovement: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
    supportWait: Math.floor(Math.random() * 10) + 2,
    logisticsStatus: Math.random() > 0.85 ? 'Delayed' : 'On-Time',
    chartData: Array.from({ length: 30 }, (_, i) => ({
      time: `T-${30-i}`,
      health: 80 + Math.random() * 15 - 7.5,
      predicted: i > 20 ? 75 - (i-20)*6 : null
    })),
    events: [
      { 
        id: Math.random().toString(36).substring(7), 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), 
        type: Math.random() > 0.7 ? 'crisis' : Math.random() > 0.4 ? 'opportunity' : 'anomaly', 
        message: `System Event: ${['Load Spiked', 'Route Adjusted', 'Cart Abandoned', 'Conversion Peak'][Math.floor(Math.random()*4)]}` 
      }
    ]
  };
};

function AppContent() {
  const [role, setRole] = useState<"Strategic" | "Tactical">("Strategic");
  const [isWarRoom, setIsWarRoom] = useState(false);
  const [data, setData] = useState(generateMockData());
  const [events, setEvents] = useState(data.events);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = generateMockData();
        setEvents(e => [newData.events[0], ...e].slice(0, 15));
        return {
          ...newData,
          stressScore: isWarRoom ? Math.floor(Math.random() * 10) + 85 : newData.stressScore
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isWarRoom]);

  useEffect(() => {
    if (isWarRoom) {
      document.body.classList.add('war-room');
    } else {
      document.body.classList.remove('war-room');
    }
  }, [isWarRoom]);

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-foreground">
      <Sidebar isWarRoom={isWarRoom} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          role={role} 
          setRole={setRole} 
          stressScore={data.stressScore} 
          isWarRoom={isWarRoom} 
          setIsWarRoom={setIsWarRoom} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <Switch>
            <Route path="/">
              <Home role={role} data={data} events={events} isWarRoom={isWarRoom} />
            </Route>
            <Route path="/sales">
              <SalesModule isWarRoom={isWarRoom} />
            </Route>
            <Route path="/inventory">
              <InventoryModule isWarRoom={isWarRoom} />
            </Route>
            <Route path="/support">
              <SupportModule isWarRoom={isWarRoom} />
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