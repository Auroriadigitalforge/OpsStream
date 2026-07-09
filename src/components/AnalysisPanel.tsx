import React from 'react';
import { AIAnalysisResult } from '../types';
import { Cpu, CheckCircle2, AlertTriangle, ShieldAlert, ArrowRight, Activity } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: AIAnalysisResult | null;
  isAnalyzing: boolean;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 animate-spin">
          <Activity className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">OpsStream AI Neural Engine Active</h3>
          <p className="text-xs text-slate-400 font-mono">Running crowd flow simulations and load-balancing calculus...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <Cpu className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-300">Ready for Telemetry Optimization</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Adjust the gate telemetry variables or simulate a surge, then click <span className="text-cyan-400 font-medium">"Analyze & Balance"</span> to generate AI operational directives.
        </p>
      </div>
    );
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> CRITICAL</span>;
      case 'WARNING':
        return <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> WARNING</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> ROUTINE</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Structural Analysis Summary Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center space-x-2.5 mb-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">Structural Operations Analysis</h2>
            <p className="text-xs text-slate-400">Gemini AI neural telemetry evaluation</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
          {analysis.structuralAnalysis}
        </p>
      </div>

      {/* Load-Balancing Action Items */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">Tactical Load-Balancing Directives</h2>
              <p className="text-xs text-slate-400">Action items for gate supervisors and crowd control teams</p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            {analysis.actions.length} Directives Issued
          </span>
        </div>

        <div className="space-y-3">
          {analysis.actions.map((act, index) => (
            <div
              key={index}
              className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20">
                    {act.gateId}
                  </span>
                  {getPriorityBadge(act.priority)}
                </div>
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{act.action}</span>
                </p>
                <p className="text-xs text-slate-400 pl-6">{act.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
