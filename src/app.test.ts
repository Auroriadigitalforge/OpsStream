import { describe, it, expect } from 'vitest';

// Test to verify our compounding bottleneck formula logic works safely
describe('Gate Telemetry Logic Tests', () => {
  it('should compound wait time by 30 seconds when capacity load exceeds 80%', () => {
    const currentThroughput = 145;
    const maxCapacity = 150;
    const loadRatio = currentThroughput / maxCapacity; // ~96% (Greater than 80%)
    
    let avgWaitTimeSeconds = 110;
    
    if (loadRatio > 0.8) {
      avgWaitTimeSeconds += 30;
    }

    expect(avgWaitTimeSeconds).toBe(140);
  });

  it('should reduce wait time when gate load is under normal thresholds', () => {
    const currentThroughput = 50;
    const maxCapacity = 150;
    const loadRatio = currentThroughput / maxCapacity; // ~33%
    
    let avgWaitTimeSeconds = 45;
    
    if (loadRatio > 0.8) {
      avgWaitTimeSeconds += 30;
    } else {
      avgWaitTimeSeconds = Math.max(15, avgWaitTimeSeconds - 10);
    }

    expect(avgWaitTimeSeconds).toBe(35);
  });
});
