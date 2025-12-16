// Problem Generation Logic

import { Problem, Mode } from "./types";

export function generateProblem(currentMode: Mode): Problem {
  let left = Math.floor(Math.random() * 10);
  let right = Math.floor(Math.random() * 10);
  let operator = "+";
  let ans = 0;

  switch (currentMode) {
    case "add":
      operator = "+";
      ans = left + right;
      break;
    case "subtract":
      // Ensure no negative results
      if (left < right) [left, right] = [right, left];
      operator = "-";
      ans = left - right;
      break;
    case "multiply":
      operator = "×";
      ans = left * right;
      break;
    case "mixed":
      const modes: Mode[] = ["add", "subtract", "multiply"];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      return generateProblem(randomMode);
  }
  return { left, right, operator, answer: ans };
}
