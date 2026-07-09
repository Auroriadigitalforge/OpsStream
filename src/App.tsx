import React, { useState, useEffect } from 'react';
import { GateTelemetry, AIAnalysisResult } from './types';
import { Header } from './components/Header';
import { GateControlPanel } from './components/GateControlPanel';
import { GateGrid } from './components/GateGrid';
import { AnalysisPanel } from './components/AnalysisPanel';
import { MultilingualPACard } from './components/MultilingualPACard';
import { AlertCircle } from 'lucide-react';

const INITIAL_GATES: GateTelemetry[] = [
  {
    id: 'gate-a',
    name: 'Gate A',
    zone: 'North Grandstand',
    current_throughput_per_min: 120,
    max_capacity_per_min: 150,
    avg_wait_time_seconds: 110,
  },
  {
    id: 'gate-b',
    name: 'Gate B',
    zone: 'East Concourse',
    current_throughput_per_min: 90,
    max_capacity_per_min: 140,
    avg_wait_time_seconds: 45,
  },
  {
    id: 'gate-c',
    name: 'Gate C',
    zone: 'South VIP Plaza',
    current_throughput_per_min: 145,
    max_capacity_per_min: 150,
    avg_wait_time_seconds: 240,
  },
  {
    id: 'gate-d',
    name: 'Gate D',
    zone: 'West Entrance',
    current_throughput_per_min: 75,
    max_capacity_per_min: 130,
    avg_wait_time_seconds: 30,
  },
];

export default function App() {
  const [gates, setGates] = useState<GateTelemetry[]>(INITIAL_GATES);
  const [eventName, setEventName] = useState<string>('Championship Finals - Match 09');
  const [totalAttendance, setAttendance] = useState<number>(78400);
  const [isAutoSimulating, setIsAutoSimulating] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-simulation effect with +/- 15 fluctuation and compounding bottleneck wait time (+30s when >80%)
  useEffect(() => {
    if (!isAutoSimulating) return;

    const interval = setInterval(() => {
      setGates((prev) =>
        prev.map((gate) => {
          const delta = Math.floor(Math.random() * 31) - 15; // -15 to +15 fans
          const newThroughput = Math.max(10, Math.min(gate.max_capacity_per_min * 1.3, gate.current_throughput_per_min + delta));
          const loadRatio = newThroughput / gate.max_capacity_per_min;
          
          let newWait = gate.avg_wait_time_seconds;
          if (loadRatio > 0.8) {
            newWait += 30; // compound wait time
          } else {
            newWait = Math.max(15, newWait - 10);
          }

          return {
            ...gate,
            current_throughput_per_min: Math.round(newThroughput),
            avg_wait_time_seconds: Math.round(newWait),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoSimulating]);

  const handleUpdateGate = (gateId: string, field: keyof GateTelemetry, value: number) => {
    setGates((prev) =>
      prev.map((g) => (g.id === gateId ? { ...g, [field]: value } : g))
    );
  };

  const handleSimulateSurge = () => {
    setGates((prev) =>
      prev.map((gate) => {
        if (gate.id === 'gate-c' || gate.id === 'gate-a') {
          return {
            ...gate,
            current_throughput_per_min: Math.round(gate.max_capacity_per_min * 0.95),
            avg_wait_time_seconds: 300,
          };
        }
        return gate;
      })
    );
  };

  const handleReset = () => {
    setGates(INITIAL_GATES);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    const wasSimulating = isAutoSimulating;
    if (wasSimulating) {
      setIsAutoSimulating(false); // Pause simulation during analysis
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    // Snapshot of current gates at this millisecond
    const currentGatesSnapshot = [...gates];

    try {
      const response = await fetch('/api/optimize-crowd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gates: currentGatesSnapshot, eventName, totalAttendance }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate AI analysis.');
      }

      const data: AIAnalysisResult = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Network error connecting to OpsStream AI server.');
    } finally {
      setIsAnalyzing(false);
      if (wasSimulating) {
        setIsAutoSimulating(true); // Resume simulation after response
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Header
        eventName={eventName}
        setEventName={setEventName}
        totalAttendance={totalAttendance}
        setAttendance={setAttendance}
        isAutoSimulating={isAutoSimulating}
        setIsAutoSimulating={setIsAutoSimulating}
        onSimulateSurge={handleSimulateSurge}
        onReset={handleReset}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-8">
        {errorMessage && (
          <div className="bg-red-950/80 border border-red-500/50 p-4 rounded-xl flex items-center space-x-3 text-red-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Central Gate Status Grid */}
        <section aria-label="Gate Telemetry Grid">
          <GateGrid gates={gates} />
        </section>

        {/* Telemetry Control Panel & Analyze Button */}
        <section aria-label="Telemetry Control Panel">
          <GateControlPanel
            gates={gates}
            onUpdateGate={handleUpdateGate}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </section>

        {/* AI Analysis and Directives */}
        <section aria-label="AI Operations Analysis">
          <AnalysisPanel analysis={analysisResult} isAnalyzing={isAnalyzing} />
        </section>

        {/* Multilingual PA System Announcements */}
        {analysisResult && (
          <section aria-label="Public Address System">
            <MultilingualPACard alerts={analysisResult.multilingualAlerts} />
          </section>
        )}
      </main>

      <footer className="bg-slate-900/60 border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        OpsStream AI Stadium Security & Operations &bull; Secure Real-Time Telemetry Protocol v3.4
      </footer>
    </div>
  );
}
