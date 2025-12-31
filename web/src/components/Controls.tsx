import { Mode, Difficulty, Duration } from "@/app/lib/types";
import { getButtonClass } from "@/app/lib/styleHelpers";

interface ControlsProps {
  mode: Mode;
  difficulty: Difficulty;
  duration: Duration;
  onModeChange: (mode: Mode) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onDurationChange: (duration: Duration) => void;
}

export function Controls({
  mode,
  difficulty,
  duration,
  onModeChange,
  onDifficultyChange,
  onDurationChange,
}: ControlsProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Mode Row */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text">
        <button onClick={() => onModeChange("add")} className={getButtonClass(mode === "add")}>
          <span className="hidden sm:inline">+ addition</span>
          <span className="sm:hidden">+</span>
        </button>
        <button onClick={() => onModeChange("subtract")} className={getButtonClass(mode === "subtract")}>
          <span className="hidden sm:inline">- subtraction</span>
          <span className="sm:hidden">-</span>
        </button>
        <button onClick={() => onModeChange("multiply")} className={getButtonClass(mode === "multiply")}>
          <span className="hidden sm:inline">× multiplication</span>
          <span className="sm:hidden">×</span>
        </button>
        <button onClick={() => onModeChange("mixed")} className={getButtonClass(mode === "mixed")}>
          <span className="hidden sm:inline">∞ mixed</span>
          <span className="sm:hidden">∞</span>
        </button>
      </div>

      {/* Subtle Divider */}
      <div className="h-px bg-white/5 max-w-2xl mx-auto"></div>

      {/* Difficulty & Duration Row */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        <button onClick={() => onDifficultyChange("easy")} className={getButtonClass(difficulty === "easy")}>
          easy
        </button>
        <button onClick={() => onDifficultyChange("medium")} className={getButtonClass(difficulty === "medium")}>
          medium
        </button>
        <button onClick={() => onDifficultyChange("hard")} className={getButtonClass(difficulty === "hard")}>
          hard
        </button>

        <div className="w-px h-6 bg-white/10 mx-1 sm:mx-2"></div>

        <button onClick={() => onDurationChange(15)} className={getButtonClass(duration === 15)}>
          15
        </button>
        <button onClick={() => onDurationChange(30)} className={getButtonClass(duration === 30)}>
          30
        </button>
        <button onClick={() => onDurationChange(60)} className={getButtonClass(duration === 60)}>
          60
        </button>
      </div>
    </div>
  );
}
