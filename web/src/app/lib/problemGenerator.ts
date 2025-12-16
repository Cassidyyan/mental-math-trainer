// Problem Generation Logic - Now with Difficulty Support

import { Problem, Mode, Difficulty } from "./types";
import { DIFFICULTY_CONFIGS, randomInRange } from "./difficultyConfig";

export function generateProblem(currentMode: Mode, difficulty: Difficulty): Problem {
  // Get the configuration for the selected difficulty
  const config = DIFFICULTY_CONFIGS[difficulty];
  
  switch (currentMode) {
    case "add":
      return generateAddition(config.add);
    case "subtract":
      return generateSubtraction(config.subtract);
    case "multiply":
      return generateMultiplication(config.multiply);
    case "mixed":
      const modes: Mode[] = ["add", "subtract", "multiply"];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      return generateProblem(randomMode, difficulty);
    default:
      return generateAddition(config.add);
  }
}

// Addition with constraints
function generateAddition(rules: typeof DIFFICULTY_CONFIGS.easy.add): Problem {
  let left: number;
  let right: number;
  let sum: number;
  
  do {
    left = randomInRange(rules.leftRange[0], rules.leftRange[1]);
    right = randomInRange(rules.rightRange[0], rules.rightRange[1]);
    sum = left + right;
  } while (rules.maxSum && sum > rules.maxSum); // Regenerate if exceeds maxSum
  
  return {
    left,
    right,
    operator: "+",
    answer: sum,
  };
}

// Subtraction with negative control
function generateSubtraction(rules: typeof DIFFICULTY_CONFIGS.easy.subtract): Problem {
  let left = randomInRange(rules.leftRange[0], rules.leftRange[1]);
  let right = randomInRange(rules.rightRange[0], rules.rightRange[1]);
  
  // If negatives not allowed, ensure left >= right
  if (!rules.allowNegative && left < right) {
    [left, right] = [right, left];
  }
  
  return {
    left,
    right,
    operator: "-",
    answer: left - right,
  };
}

// Multiplication with range control
function generateMultiplication(rules: typeof DIFFICULTY_CONFIGS.easy.multiply): Problem {
  const left = randomInRange(rules.leftRange[0], rules.leftRange[1]);
  const right = randomInRange(rules.rightRange[0], rules.rightRange[1]);
  
  return {
    left,
    right,
    operator: "×",
    answer: left * right,
  };
}
