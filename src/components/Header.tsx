import React from 'react';
import { ShieldAlert, Activity, Radio, Cpu, RefreshCw } from 'lucide-react';

interface HeaderProps {
  eventName: string;
  setEventName: (name: string) => void;
  totalAttendance: number;
  setAttendance: (val: number) => void;
  isAutoSimulating: boolean;
  setIsAutoSimulating: (val: boolean) => void;
  onSimulateSurge: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  eventName,
  setEventName,
  totalAttendance,
  setAttendance,
  isAutoSimulating,
  setIsAutoSimulating,
  onSimulateSurge,
  onReset,
}) => {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Logo and title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <Radio className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">OpsStream AI</h1>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">
                Live Ops v3.4
              </span>
            </div>
            <p className="text-xs text-slate-400">Stadium Crowd Load-Balancing & Telemetry Command Center</p>
          </div>
        </div>

        {/* Event Quick Config & Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-slate-800/80 rounded-lg px-3 py-1.5 border border-slate-700/60">
            <span className="text-xs text-slate-400 mr-2 font-mono">EVENT:</span>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="bg-transparent text-sm text-white font-medium focus:outline-none w-36 sm:w-48"
            />
          </div>

          <div className="flex items-center bg-slate-800/80 rounded-lg px-3 py-1.5 border border-slate-700/60">
            <span className="text-xs text-slate-400 mr-2 font-mono">ATTENDANCE:</span>
            <input
              type="number"
              value={totalAttendance}
              onChange={(e) => setAttendance(Number(e.target.value))}
              className="bg-transparent text-sm text-cyan-400 font-mono font-bold focus:outline-none w-20"
            />
          </div>

          <button
            onClick={onSimulateSurge}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-lg border border-amber-500/30 transition-all flex items-center gap-1.5 shadow-sm"
            title="Inject random high-density crowd surge at random gates"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Simulate Surge</span>
          </button>

          <button
            onClick={() => setIsAutoSimulating(!isAutoSimulating)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
              isAutoSimulating
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10 shadow-lg'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${isAutoSimulating ? 'animate-spin' : ''}`} />
            <span>{isAutoSimulating ? 'Auto-Flux ON' : 'Auto-Flux OFF'}</span>
          </button>

          <button
            onClick={onReset}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-colors"
            title="Reset telemetry to baseline"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
