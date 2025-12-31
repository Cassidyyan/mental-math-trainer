import { GameState } from "@/app/lib/types";

interface StatsPanelProps {
  gameState: GameState;
  correct: number;
  total: number;
  feedback: "correct" | "incorrect" | null;
  accuracy: string;
  ppm: string;
}

export function StatsPanel({
  gameState,
  correct,
  total,
  feedback,
  accuracy,
  ppm,
}: StatsPanelProps) {
  // Running state - live stats only (timer is separate component now)
  if (gameState === "running") {
    return (
      <div className="flex justify-center">
        <div className="bg-[#2a2c2e] px-8 py-4 rounded-lg flex gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span className={`font-medium tabular-nums transition-colors duration-150 ${feedback === "correct" ? "text-[#d1d0c5]" : "text-[#a1a3a4] opacity-70"}`}>{correct}</span>
            <span className="text-[#a1a3a4] opacity-60">correct</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-medium tabular-nums transition-colors duration-150 ${feedback === "incorrect" ? "text-[#ca4754]" : "text-[#a1a3a4] opacity-70"}`}>{total - correct}</span>
            <span className="text-[#a1a3a4] opacity-60">wrong</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium tabular-nums text-[#a1a3a4] opacity-70">{total}</span>
            <span className="text-[#a1a3a4] opacity-60">total</span>
          </div>
        </div>
      </div>
    );
  }

  // Finished state - results
  if (gameState === "finished") {
    // Handle zero-state (no problems completed)
    if (total === 0) {
      return (
        <div className="text-center space-y-4">
          <div className="text-2xl text-[#a1a3a4] opacity-60">
            No problems completed
          </div>
          <div className="text-sm text-[#a1a3a4] opacity-50">
            Start a test to see your stats
          </div>
        </div>
      );
    }

    // Get accuracy color based on performance (MonkeyType inspired)
    const accuracyNum = parseInt(accuracy);
    const getAccuracyColor = () => {
      if (accuracyNum >= 90) return "text-[#7cb342]"; // Green
      if (accuracyNum >= 70) return "text-[#e2b714]"; // Yellow
      return "text-[#ca4754]"; // Red
    };

    // Performance feedback based on accuracy and PPM
    const getPerformanceFeedback = () => {
      const ppmNum = parseInt(ppm);
      if (accuracyNum >= 90 && ppmNum >= 40) return "Excellent performance!";
      if (accuracyNum >= 90) return "Great accuracy!";
      if (accuracyNum >= 70 && ppmNum >= 40) return "Balanced performance";
      if (accuracyNum >= 70) return "Good accuracy, work on speed";
      if (ppmNum >= 40) return "Fast pace, focus on accuracy";
      return "Keep practicing!";
    };

    return (
      <div className="space-y-8">
        {/* Performance Feedback */}
        <div className="text-center">
          <div className="text-sm text-[#a1a3a4] opacity-50 italic">
            {getPerformanceFeedback()}
          </div>
        </div>

        {/* Primary Stats - Accuracy larger, PPM smaller */}
        <div className="grid grid-cols-2 gap-16 max-w-lg mx-auto">
          <div className="text-center space-y-2">
            <div className={`text-7xl font-medium tabular-nums ${getAccuracyColor()}`}>
              {accuracyNum === 100 ? '100' : accuracy}%
            </div>
            <div className="text-xs uppercase tracking-widest text-[#a1a3a4] opacity-70">accuracy</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-5xl font-light text-[#a1a3a4] opacity-60 tabular-nums">{ppm}</div>
            <div className="text-xs uppercase tracking-widest text-[#a1a3a4] opacity-50">
              <div>ppm</div>
              <div className="text-[10px] normal-case opacity-60 mt-1">problems per minute</div>
            </div>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="h-px bg-white/5 max-w-md mx-auto"></div>

        {/* Secondary Stats - Improved readability */}
        <div className="flex justify-center">
          <div className="bg-[#2a2c2e] px-10 py-5 rounded-lg space-y-4 w-full max-w-md text-sm">
            <div className="flex justify-between items-center">
              <span className="text-[#a1a3a4] opacity-60 uppercase tracking-wider text-xs">problems</span>
              <span className="font-medium text-[#a1a3a4] text-lg tabular-nums">{total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#a1a3a4] opacity-60 uppercase tracking-wider text-xs">correct</span>
              <span className="font-medium text-[#a1a3a4] text-lg tabular-nums">{correct}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#a1a3a4] opacity-60 uppercase tracking-wider text-xs">incorrect</span>
              <span className="font-medium text-[#a1a3a4] text-lg tabular-nums">{total - correct}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
