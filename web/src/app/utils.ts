// Utility Functions for Stats Calculations

export function calculateAccuracy(correct: number, total: number): string {
  return total > 0 ? ((correct / total) * 100).toFixed(2) : "0.00";
}

export function calculatePPM(total: number, elapsedSeconds: number): string {
  return elapsedSeconds > 0 ? ((total / elapsedSeconds) * 60).toFixed(1) : "0.0";
}
