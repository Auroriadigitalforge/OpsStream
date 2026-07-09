export interface GateTelemetry {
  id: string;
  name: string;
  zone: string;
  current_throughput_per_min: number;
  max_capacity_per_min: number;
  avg_wait_time_seconds: number;
  status?: 'normal' | 'warning' | 'critical';
}

export interface OptimizationAction {
  gateId: string;
  action: string;
  priority: 'CRITICAL' | 'WARNING' | 'ROUTINE';
  reason: string;
}

export interface MultilingualAlerts {
  english: string;
  spanish: string;
  french: string;
}

export interface AIAnalysisResult {
  structuralAnalysis: string;
  actions: OptimizationAction[];
  multilingualAlerts: MultilingualAlerts;
}
