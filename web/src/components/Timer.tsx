interface TimerProps {
  timeLeft: number;
}

export function Timer({ timeLeft }: TimerProps) {
  return (
    <div className="flex justify-center">
      <div className={`text-2xl font-light tabular-nums transition-colors ${
        timeLeft <= 5 ? "text-[#ca4754]" : "text-[#646669]"
      }`}>
        {timeLeft}
      </div>
    </div>
  );
}
