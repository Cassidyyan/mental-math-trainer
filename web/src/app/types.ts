// Type Definitions for Mental Math Trainer

export type Problem = {
  left: number;
  right: number;
  operator: string;
  answer: number;
};

export type Mode = "add" | "subtract" | "multiply" | "mixed";
export type GameState = "idle" | "running" | "finished";
export type Duration = 15 | 30 | 60;
