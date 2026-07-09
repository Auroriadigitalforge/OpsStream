import React from 'react';
import { GateTelemetry } from '../types';
import { MapPin, Users, Clock, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

interface GateGridProps {
  gates: GateTelemetry[];
}

export const GateGrid: React.FC<GateGridProps> = ({ gates }) => {
  const getCapacityPercent = (curr: number, max: number) => Math.min(100, Math.round((curr / max) * 100));

  const getStatus = (percent: number) => {
    if (percent > 85) return { label: 'CRITICAL', color: 'border-red-500 bg-red-950/20 text-red-400', badge: 'bg-red-500/20 text-red-400 border-red-500/30', glow: 'shadow-red-500/20 animate-pulse', bar: 'bg-red-500' };
    if (percent > 70) return { label: 'WARNING', color: 'border-amber-500 bg-amber-950/20 text-amber-400', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', glow: 'shadow-amber-500/10', bar: 'bg-amber-500' };
    return { label: 'NORMAL', color: 'border-emerald-500/50 bg-emerald-950/10 text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', glow: 'shadow-emerald-500/10', bar: 'bg-emerald-500' };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-semibold text-white tracking-tight">Stadium Gate Telemetry Grid</h2>
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" /> Normal (&lt;70%)
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500" /> Warning (70-85%)
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500 animate-pulse" /> Critical (&gt;85%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {gates.map((gate) => {
          const capPercent = getCapacityPercent(gate.current_throughput_per_min, gate.max_capacity_per_min);
          const status = getStatus(capPercent);

          return (
            <div
              key={gate.id}
              className={`rounded-2xl border p-5 backdrop-blur-md shadow-xl transition-all duration-300 flex flex-col justify-between ${status.color} ${status.glow}`}
            >
              <div>
                {/* Top card header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{gate.zone}</span>
                    <h3 className="text-lg font-bold text-white tracking-tight">{gate.name}</h3>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border flex items-center gap-1 ${status.badge}`}>
                    {capPercent > 85 ? <Flame className="w-3.5 h-3.5 animate-bounce" /> : capPercent > 70 ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    {status.label}
                  </span>
                </div>

                {/* Capacity progress */}
                <div className="space-y-1.5 my-4">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Capacity Load</span>
                    <span className="font-bold text-white">{capPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${status.bar}`}
                      style={{ width: `${capPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Metrics footer */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 text-xs font-mono">
                <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-800/50">
                  <span className="text-slate-400 block text-[10px]">THROUGHPUT</span>
                  <span className="text-white font-bold flex items-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    {gate.current_throughput_per_min} <span className="text-[10px] text-slate-500">/min</span>
                  </span>
                </div>
                <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-800/50">
                  <span className="text-slate-400 block text-[10px]">AVG WAIT</span>
                  <span className="text-white font-bold flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {gate.avg_wait_time_seconds} <span className="text-[10px] text-slate-500">sec</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
