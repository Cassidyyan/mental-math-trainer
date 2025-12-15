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

  // Start the timed test session
  function startTest() {
    setGameState("running");
    setTimeLeft(duration);
    setCorrect(0);
    setTotal(0);
    setAnswer("");
    newProblem();
  }

  // Restart the test session
  function restartTest() {
    setGameState("idle");
    setTimeLeft(duration);
    setCorrect(0);
    setTotal(0);
    setAnswer("");
  }

  // Handle answer input and check correctness
  function handleAnswer(value: string) {
    if (gameState !== "running") return;

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
    if (gameState !== "idle") return;
    setMode(newMode);
    setProblem(generateProblem(newMode));
    setAnswer("");
  }

  // Change duration (only allowed when idle)
  function changeDuration(newDuration: Duration) {
    if (gameState !== "idle") return;
    setDuration(newDuration);
    setTimeLeft(newDuration);
  }

  // Timer effect - runs when game is running
  useEffect(() => {
    if (gameState === "running") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up! End the session
            setGameState("finished");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup timer on unmount or state change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState]);

  // Stats from Session Data
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const elapsedSeconds = duration - timeLeft;
  const ppm = elapsedSeconds > 0 ? ((total / elapsedSeconds) * 60).toFixed(1) : "0.0";

  // RENDER: Idle State (Setup Screen)
  if (gameState === "idle") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Mental Math Trainer</h1>
        <p className="text-gray-400">Configure your test and hit Start</p>

        {/* Mode Selection */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-center">Mode</h2>
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
        </div>

        {/* Duration Selection */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-center">Duration</h2>
          <div className="flex gap-3">
            <button
              onClick={() => changeDuration(15)}
              className={`px-6 py-2 rounded-md font-semibold ${
                duration === 15 ? "bg-green-600" : "bg-gray-700"
              }`}
            >
              15s
            </button>
            <button
              onClick={() => changeDuration(30)}
              className={`px-6 py-2 rounded-md font-semibold ${
                duration === 30 ? "bg-green-600" : "bg-gray-700"
              }`}
            >
              30s
            </button>
            <button
              onClick={() => changeDuration(60)}
              className={`px-6 py-2 rounded-md font-semibold ${
                duration === 60 ? "bg-green-600" : "bg-gray-700"
              }`}
            >
              60s
            </button>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={startTest}
          className="mt-4 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-2xl font-bold"
        >
          Start Test
        </button>
      </main>
    );
  }

  // RENDER: Running State (Active Test)
  if (gameState === "running") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 bg-gray-900 text-white">
        {/* Timer Display */}
        <div className="text-6xl font-bold text-yellow-400">{timeLeft}s</div>

        {/* Problem Display */}
        <div className="text-6xl font-bold">
          {problem.left} {problem.operator} {problem.right}
        </div>

        {/* Answer Input */}
        <input
          value={answer}
          onChange={(e) => handleAnswer(e.target.value)}
          autoFocus
          className="text-white bg-gray-800 p-3 text-2xl rounded-md w-40 text-center border-2 border-blue-500"
          placeholder="Answer"
        />

        {/* Live Stats */}
        <div className="text-xl">
          Correct: {correct} / {total}
        </div>
      </main>
    );
  }

  // RENDER: Finished State (Results Screen)
  if (gameState === "finished") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Test Complete!</h1>

        {/* Results Card */}
        <div className="bg-gray-800 p-8 rounded-lg w-96 space-y-4">
          <div className="flex justify-between text-xl">
            <span>Problems Attempted:</span>
            <span className="font-bold">{total}</span>
          </div>
          <div className="flex justify-between text-xl">
            <span>Correct:</span>
            <span className="font-bold text-green-400">{correct}</span>
          </div>
          <div className="flex justify-between text-xl">
            <span>Accuracy:</span>
            <span className="font-bold text-blue-400">{accuracy}%</span>
          </div>
          <div className="flex justify-between text-xl">
            <span>PPM:</span>
            <span className="font-bold text-purple-400">{ppm}</span>
          </div>
          <div className="text-sm text-gray-400 text-center mt-2">
            (Problems Per Minute)
          </div>
        </div>

        {/* Restart Button */}
        <button
          onClick={restartTest}
          className="mt-4 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-2xl font-bold"
        >
          Try Again
        </button>
      </main>
    );
  }
  return null;
}
