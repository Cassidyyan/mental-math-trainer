"use client";

import { useState, useEffect, useRef } from "react";

// Type Definitions
type Problem = {
  left: number;
  right: number;
  operator: string;
  answer: number;
};

type Mode = "add" | "subtract" | "multiply" | "mixed";
type GameState = "idle" | "running" | "finished";
type Duration = 15 | 30 | 60;

// Main Component
export default function Home() {
  // Game State Variables
  const [gameState, setGameState] = useState<GameState>("idle");
  const [duration, setDuration] = useState<Duration>(30);
  const [timeLeft, setTimeLeft] = useState<number>(duration);

  // State Variables for the Math Problem and Scoring
  const [mode, setMode] = useState<Mode>("add");
  const [problem, setProblem] = useState<Problem>({
    left: 0,
    right: 0,
    operator: "+",
    answer: 0,
  });
  const [answer, setAnswer] = useState("");

  // Session Stats
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  
  // Timer reference for session
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate problem based on mode
  function generateProblem(currentMode: Mode): Problem {
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

  // Generate a new problem
  function newProblem() {
    setProblem(generateProblem(mode));
  }

  useEffect(() => {
    newProblem();
  }, []);

  // Handle answer input and check correctness
  function handleAnswer(value: string) {
    setAnswer(value);

    if (parseInt(value) === problem.answer) {
      setCorrect((prev) => prev + 1);
      setTotal((prev) => prev + 1);
      setAnswer("");
      newProblem();
    }
  }

  // Change mode and generate new problem
  function changeMode(newMode: Mode) {
    setMode(newMode);
    setProblem(generateProblem(newMode));
    setAnswer("");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Mental Math Trainer</h1>

      {/* Mode Selection */}
      <div className="flex gap-3">
        <button
          onClick={() => changeMode("add")}
          className={`px-4 py-2 rounded-md font-semibold ${
            mode === "add" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Addition
        </button>
        <button
          onClick={() => changeMode("subtract")}
          className={`px-4 py-2 rounded-md font-semibold ${
            mode === "subtract" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Subtraction
        </button>
        <button
          onClick={() => changeMode("multiply")}
          className={`px-4 py-2 rounded-md font-semibold ${
            mode === "multiply" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Multiplication
        </button>
        <button
          onClick={() => changeMode("mixed")}
          className={`px-4 py-2 rounded-md font-semibold ${
            mode === "mixed" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Mixed
        </button>
      </div>

      <div className="text-6xl font-bold">
        {problem.left} {problem.operator} {problem.right}
      </div>

      <input
        value={answer}
        onChange={(e) => handleAnswer(e.target.value)}
        autoFocus
        className="text-white p-3 text-2xl rounded-md w-40 text-center"
        placeholder="Answer"
      />

      <div className="text-xl">
        Correct: {correct} / {total}
      </div>
    </main>
  );
}
