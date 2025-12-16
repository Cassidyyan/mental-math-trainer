// Type Definitions for Mental Math Trainer

export type Problem = {
  left: number;
  right: number;
  operator: string;
  answer: number;
};

export type Mode = "add" | "subtract" | "multiply" | "mixed";
export type Difficulty = "easy" | "medium" | "hard";
export type GameState = "idle" | "running" | "finished";
export type Duration = 15 | 30 | 60;

// Difficulty Configuration for each mode
export type DifficultyConfig = {
  add: {
    leftRange: [number, number];
    rightRange: [number, number];
    maxSum?: number;
  };
  subtract: {
    leftRange: [number, number];
    rightRange: [number, number];
    allowNegative: boolean;
  };
  multiply: {
    leftRange: [number, number];
    rightRange: [number, number];
  };
};
