import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import PulseDashboard from "@/components/PulseDashboard";
import PredictiveStressEngine from "@/components/PredictiveStressEngine";
import RootCauseFeed from "@/components/RootCauseFeed";
import DecisionRecommendation from "@/components/DecisionRecommendation";

const generateMockData = () => {
  const stress = Math.floor(Math.random() * 40) + 40; // 40-80 range
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

export default function Home() {
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
          stressScore: isWarRoom ? Math.floor(Math.random() * 10) + 85 : newData.stressScore // Force high stress in war room
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
    <div className={`min-h-screen text-foreground p-4 md:p-6 flex flex-col gap-6 transition-colors duration-1000 ${isWarRoom ? 'bg-[#030303]' : 'bg-transparent'}`}>
      {isWarRoom && <div className="war-room-scanline" />}
      
      <Header role={role} setRole={setRole} stressScore={data.stressScore} isWarRoom={isWarRoom} setIsWarRoom={setIsWarRoom} />

      <main className="flex-1 grid grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Col / Main Col */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, filter: "blur(10px)", scale: 0.98 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)", scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <PulseDashboard role={role} data={data} isWarRoom={isWarRoom} />
            </motion.div>
          </AnimatePresence>
          
          <PredictiveStressEngine data={data.chartData} isWarRoom={isWarRoom} />
        </div>

        {/* Right Col */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          <RootCauseFeed events={events} isWarRoom={isWarRoom} />
        </div>
      </main>
      
      <AnimatePresence>
        {isWarRoom && (
          <DecisionRecommendation data={data} />
        )}
      </AnimatePresence>
    </div>
  );
}