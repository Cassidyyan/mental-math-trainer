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
      <div className="flex justify-center gap-8 text-sm">
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
    );
  }

  // Finished state - results
  if (gameState === "finished") {
    return (
      <div className="space-y-10">
        {/* Primary Stats */}
        <div className="grid grid-cols-2 gap-12 max-w-lg mx-auto">
          <div className="text-center space-y-2">
            <div className="text-6xl font-medium text-[#a1a3a4] tabular-nums">{accuracy}%</div>
            <div className="text-xs uppercase tracking-widest text-[#a1a3a4] opacity-70">accuracy</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-6xl font-medium text-[#a1a3a4] tabular-nums">{ppm}</div>
            <div className="text-xs uppercase tracking-widest text-[#a1a3a4] opacity-70">ppm</div>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="h-px bg-white/5 max-w-md mx-auto"></div>

        {/* Secondary Stats */}
        <div className="space-y-3 max-w-md mx-auto text-sm">
          <div className="flex justify-between items-center">
            <span className="text-[#a1a3a4] opacity-70">problems</span>
            <span className="font-normal text-[#a1a3a4] opacity-80 tabular-nums">{total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#a1a3a4] opacity-70">correct</span>
            <span className="font-normal text-[#a1a3a4] opacity-80 tabular-nums">{correct}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#a1a3a4] opacity-70">incorrect</span>
            <span className="font-normal text-[#a1a3a4] opacity-80 tabular-nums">{total - correct}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
