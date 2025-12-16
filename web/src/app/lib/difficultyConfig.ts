// Difficulty Configurations - Rule-based constraints per mode

import { Difficulty, DifficultyConfig } from "./types";

// Configuration for each difficulty level
export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    add: {
      leftRange: [1, 10],
      rightRange: [1, 10],
      maxSum: 20, // Addition sums capped at 20
    },
    subtract: {
      leftRange: [1, 10],
      rightRange: [1, 10],
      allowNegative: false, // Never produce negatives
    },
    multiply: {
      leftRange: [1, 9], // 1-digit × 1-digit
      rightRange: [1, 9],
    },
  },
  
  medium: {
    add: {
      leftRange: [10, 50],
      rightRange: [10, 50],
    },
    subtract: {
      leftRange: [10, 50],
      rightRange: [10, 50],
      allowNegative: false, 
    },
    multiply: {
      leftRange: [10, 99], // 2-digit × 1-digit
      rightRange: [1, 9],
    },
  },
  
  hard: {
    add: {
      leftRange: [50, 999],
      rightRange: [50, 999],
    },
    subtract: {
      leftRange: [10, 999],
      rightRange: [10, 999],
      allowNegative: false, 
    },
    multiply: {
      leftRange: [10, 99], // 2-digit × 2-digit
      rightRange: [10, 99],
    },
  },
};

// Generate a number within the range of the LB and UB (inclusive)
export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
