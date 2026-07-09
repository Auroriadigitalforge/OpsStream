import React, { useState } from 'react';
import { GateTelemetry } from '../types';
import { Sliders, Zap, Users, Clock, ArrowUpRight } from 'lucide-react';

interface GateControlPanelProps {
  gates: GateTelemetry[];
  onUpdateGate: (gateId: string, field: keyof GateTelemetry, value: number) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const GateControlPanel: React.FC<GateControlPanelProps> = ({
  gates,
  onUpdateGate,
  onAnalyze,
  isAnalyzing,
}) => {
  const [selectedGateId, setSelectedGateId] = useState<string>(gates[0]?.id || 'gate-a');

  const activeGate = gates.find((g) => g.id === selectedGateId) || gates[0];

  const getCapacityPercent = (curr: number, max: number) => Math.min(100, Math.round((curr / max) * 100));

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">Telemetry Control Panel</h2>
            <p className="text-xs text-slate-400">Adjust real-time sensor parameters for stadium entry portals</p>
          </div>
        </div>

        {/* Analyze & Balance Button */}
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-55 disabled:cursor-not-allowed group cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Synthesizing AI Intelligence...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-cyan-200 group-hover:scale-110 transition-transform" />
              <span>Analyze & Balance</span>
              <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>

      {/* Gate Tabs Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
        {gates.map((gate) => {
          const cap = getCapacityPercent(gate.current_throughput_per_min, gate.max_capacity_per_min);
          const isSelected = gate.id === selectedGateId;
          const statusColor =
            cap > 85
              ? 'bg-red-500/10 text-red-400 border-red-500/30'
              : cap > 70
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

          return (
            <button
              key={gate.id}
              onClick={() => setSelectedGateId(gate.id)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800 border-cyan-500 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white text-sm">{gate.name}</span>
                <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full border ${statusColor}`}>
                  {cap}%
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>{gate.zone}</span>
                <span className="text-slate-300 font-medium">{gate.current_throughput_per_min} /m</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Gate Sliders */}
      {activeGate && (
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Configuring Telemetry</span>
              <h3 className="text-lg font-bold text-white">{activeGate.name} ({activeGate.zone})</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono">Load Capacity: </span>
              <span className={`text-sm font-bold font-mono ${
                getCapacityPercent(activeGate.current_throughput_per_min, activeGate.max_capacity_per_min) > 85
                  ? 'text-red-400'
                  : getCapacityPercent(activeGate.current_throughput_per_min, activeGate.max_capacity_per_min) > 70
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}>
                {getCapacityPercent(activeGate.current_throughput_per_min, activeGate.max_capacity_per_min)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Current Throughput */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Current Throughput</span>
                </span>
                <span className="text-cyan-400 font-mono font-bold">{activeGate.current_throughput_per_min} p/min</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(200, activeGate.max_capacity_per_min * 1.2)}
                value={activeGate.current_throughput_per_min}
                onChange={(e) => onUpdateGate(activeGate.id, 'current_throughput_per_min', Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0</span>
                <span>Max: {activeGate.max_capacity_per_min}</span>
              </div>
            </div>

            {/* Max Capacity */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  <span>Max Capacity</span>
                </span>
                <span className="text-blue-400 font-mono font-bold">{activeGate.max_capacity_per_min} p/min</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                value={activeGate.max_capacity_per_min}
                onChange={(e) => onUpdateGate(activeGate.id, 'max_capacity_per_min', Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>50</span>
                <span>200</span>
              </div>
            </div>

            {/* Avg Wait Time */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Avg Wait Time</span>
                </span>
                <span className="text-amber-400 font-mono font-bold">{activeGate.avg_wait_time_seconds} sec</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={activeGate.avg_wait_time_seconds}
                onChange={(e) => onUpdateGate(activeGate.id, 'avg_wait_time_seconds', Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0s</span>
                <span>300s (5m)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
