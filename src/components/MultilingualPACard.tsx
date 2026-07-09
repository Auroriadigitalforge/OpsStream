import React, { useState } from 'react';
import { MultilingualAlerts } from '../types';
import { Volume2, Globe, Copy, Check, Radio } from 'lucide-react';

interface MultilingualPACardProps {
  alerts: MultilingualAlerts | null;
}

export const MultilingualPACard: React.FC<MultilingualPACardProps> = ({ alerts }) => {
  const [activeTab, setActiveTab] = useState<'english' | 'spanish' | 'french'>('english');
  const [copied, setCopied] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  if (!alerts) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBroadcast = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
    }, 4000);
  };

  const getLanguageLabel = (key: string) => {
    switch (key) {
      case 'english':
        return 'English (EN)';
      case 'spanish':
        return 'Español (ES)';
      case 'french':
        return 'Français (FR)';
      default:
        return key;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* PA System Header */}
      <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Volume2 className="w-5 h-5" />
            </div>
            {isBroadcasting && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-semibold text-white tracking-tight">Public Address System (PA)</h2>
              <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-full border ${
                isBroadcasting ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {isBroadcasting ? '● LIVE BROADCASTING' : 'READY'}
              </span>
            </div>
            <p className="text-xs text-slate-400">Multilingual stadium intercom broadcasts</p>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['english', 'spanish', 'french'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === lang
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {getLanguageLabel(lang)}
            </button>
          ))}
        </div>
      </div>

      {/* PA Announcement Display Screen */}
      <div className="p-6 space-y-6">
        <div className="bg-slate-950 rounded-xl p-5 border border-amber-500/30 relative shadow-inner overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/10 border-b border-l border-amber-500/20 text-[10px] font-mono text-amber-400 rounded-bl-xl flex items-center gap-1.5">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>PA TERMINAL #04</span>
          </div>

          <div className="min-h-[120px] flex items-center py-2">
            <p className="text-amber-300 font-mono text-sm leading-relaxed tracking-wide">
              "{alerts[activeTab]}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-900 text-xs font-mono text-slate-500">
            <span>TRANSMIT FREQUENCY: 450.25 MHz</span>
            <span>ENCRYPTION: SECURE-PA</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => handleCopy(alerts[activeTab])}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl border border-slate-700 transition-colors flex items-center justify-center space-x-2 text-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Announcement Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleBroadcast}
            disabled={isBroadcasting}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 text-xs cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>{isBroadcasting ? 'Broadcasting across Stadium PA...' : `Broadcast ${getLanguageLabel(activeTab)} PA`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
