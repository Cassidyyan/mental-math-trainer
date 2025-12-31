import { Problem } from "@/app/lib/types";

interface ProblemDisplayProps {
  problem: Problem;
}

export function ProblemDisplay({ problem }: ProblemDisplayProps) {
  return (
    <div className="text-center">
      <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#d1d0c5]">
        {problem.left} {problem.operator} {problem.right}
      </div>
    </div>
  );
}
