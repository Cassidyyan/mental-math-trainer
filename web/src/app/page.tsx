"use client";

import { useState, useEffect, useRef } from "react";
import { Problem, Mode, Difficulty, GameState, Duration } from "./lib/types";
import { generateProblem } from "./lib/problemGenerator";
import { calculateAccuracy, calculatePPM } from "./lib/utils";

// Main Component
export default function Home() {
  // Game State Variables
  const [gameState, setGameState] = useState<GameState>("idle");
  const [duration, setDuration] = useState<Duration>(30);
  const [timeLeft, setTimeLeft] = useState<number>(duration);

  // State Variables for the Math Problem and Scoring
  const [mode, setMode] = useState<Mode>("add");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
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
  
  // Visual Feedback State
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  
  // Timer reference for session
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate a new problem (now uses difficulty)
  function newProblem() {
    setProblem(generateProblem(mode, difficulty));
  }

  // Start the timed test session
  function startTest() {
    // Generate a fresh problem with current settings
    const newProb = generateProblem(mode, difficulty);
    setProblem(newProb);
    
    setGameState("running");
    setTimeLeft(duration);
    setCorrect(0);
    setTotal(0);
    setAnswer("");
    setFeedback(null);
  }

  // Restart the test session
  function restartTest() {
    setGameState("idle");
    setTimeLeft(duration);
    setCorrect(0);
    setTotal(0);
    setAnswer("");
    setFeedback(null);
  }

  // Handle answer input and check correctness
  function handleAnswer(value: string) {
    if (gameState !== "running") return;
    setAnswer(value);

    const userAnswer = parseInt(value);
    const correctAnswer = problem.answer;
    
    // Auto-submit when user types enough digits
    const isComplete = value.length >= correctAnswer.toString().length;
    
    if (isComplete && !isNaN(userAnswer)) {
      setTotal((prev) => prev + 1);
      
      const isCorrect = userAnswer === correctAnswer;
      
      if (isCorrect) {
        setCorrect((prev) => prev + 1);
        setFeedback("correct");
      } else {
        setFeedback("incorrect");
      }
      
      // Clear feedback and move to next problem
      setTimeout(() => {
        setFeedback(null);
        setAnswer("");
        newProblem();
      }, 50);
    }
  }

  // Change mode (only allowed when idle)
  function changeMode(newMode: Mode) {
    if (gameState !== "idle") return;
    setMode(newMode);
  }

  // Change difficulty (only allowed when idle)
  function changeDifficultyLevel(newDifficulty: Difficulty) {
    if (gameState !== "idle") return;
    setDifficulty(newDifficulty);
  }

  // Change duration (only allowed when idle)
  function changeDuration(newDuration: Duration) {
    if (gameState !== "idle") return;
    setDuration(newDuration);
    setTimeLeft(newDuration);
  }

  // Timer effect
  useEffect(() => {
    if (gameState === "running") {
      // setInterval runs the function every second
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

    // Cleanup timer to prevent memory leaks
    return () => {
      // Clear the timer if it exists
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState]);

  // Escape key to return to main menu, F key for dev shortcut to results
  useEffect(() => {
    function handleEscapeKey(e: KeyboardEvent) {
      if (e.key === "Escape" && gameState === "running") {
        restartTest();
      }
      // Developer shortcut: F key to jump to results screen
      if (e.key === "f" && gameState === "running") {
        setGameState("finished");
      }
    }

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [gameState]);

  // Auto-focus input when game starts
  useEffect(() => {
    if (gameState === "running" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Keyboard shortcuts for idle and finished states
  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (gameState === "idle" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        startTest();
      }
      if (gameState === "finished" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        restartTest();
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState]);

  // Stats from Session Data
  const accuracy = calculateAccuracy(correct, total);
  const elapsedSeconds = duration - timeLeft;
  const ppm = calculatePPM(total, elapsedSeconds);

  // RENDER: Idle State (Setup Screen)
  if (gameState === "idle") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#323437] text-gray-100">
        <div className="w-full max-w-4xl space-y-20">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-5xl font-medium tracking-wide text-[#d1d0c5]">mental math trainer</h1>
          </div>

          {/* Configuration Block */}
          <div className="space-y-5">
            
            {/* Mode Row */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => changeMode("add")}
                className={`px-4 py-2 rounded transition-all duration-150 ${
                  mode === "add" 
                    ? "bg-[#e2b714] text-[#323437] font-medium" 
                    : "bg-transparent text-[#646669] opacity-60 hover:opacity-80"
                }`}
              >
                + addition
              </button>
              <button
                onClick={() => changeMode("subtract")}
                className={`px-4 py-2 rounded transition-all duration-150 ${
                  mode === "subtract" 
                    ? "bg-[#e2b714] text-[#323437] font-medium" 
                    : "bg-transparent text-[#646669] opacity-60 hover:opacity-80"
                }`}
              >
                - subtraction
              </button>
              <button
                onClick={() => changeMode("multiply")}
                className={`px-4 py-2 rounded transition-all duration-150 ${
                  mode === "multiply" 
                    ? "bg-[#e2b714] text-[#323437] font-medium" 
                    : "bg-transparent text-[#646669] opacity-60 hover:opacity-80"
                }`}
              >
                × multiplication
              </button>
              <button
                onClick={() => changeMode("mixed")}
                className={`px-4 py-2 rounded transition-all duration-150 ${
                  mode === "mixed" 
                    ? "bg-[#e2b714] text-[#323437] font-medium" 
                    : "bg-transparent text-[#646669] opacity-60 hover:opacity-80"
                }`}
              >
                ∞ mixed
              </button>
            </div>

            {/* Subtle Divider */}
            <div className="h-px bg-white/5 max-w-2xl mx-auto"></div>

            {/* Difficulty & Duration Row */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => changeDifficultyLevel("easy")}
                className={`px-4 py-2 rounded transition-all duration-150 ${
                  difficulty === "easy" 
                    ? "bg-[#e2b714] text-[#323437] font-medium" 
                    : "bg-transparent text-[#646669] opacity-60 hover:opacity-80"
                }`}
              >
                easy
              </button>
              <button
                onClick={() => changeDifficultyLevel("medium")}
                className={`px-4 py-2 rounded transition-all duration-150 ${
                  difficulty === "medium" 
                    ? "bg-[#e2b714] text-[#323437] font-medium" 
                    : "bg-transparent text-[#646669] opacity-60 hover:opacity-80"
                }`}
              >
                medium
              </button>
              <button
                onClick={() => changeDifficultyLevel("hard")}
                className={`px-4 py-2 rounded transition-all duration-150 ${
                  difficulty === "hard" 
                    ? "bg-[#e2b714] text-[#323437] font-medium" 
                    : "bg-transparent text-[#646669] opacity-60 hover:opacity-80"
                }`}
              >
                hard
              </button>

              <div className="w-px h-6 bg-white/10 mx-2"></div>

              <button
                onClick={() => changeDuration(15)}
                className={`px-3 py-2 rounded transition-all duration-150 ${
                  duration === 15 
                    ? "bg-[#e2b714] text-[#323437] font-medium" 
                    : "bg-transparent text-[#646669] opacity-60 hover:opacity-80"
                }`}
              >
                15
              </button>
              <button
                onClick={() => changeDuration(30)}
                className={`px-3 py-2 rounded transition-all duration-150 ${
                  duration === 30 
                    ? "bg-[#e2b714] text-[#323437] font-medium" 
                    : "bg-transparent text-[#646669] opacity-60 hover:opacity-80"
                }`}
              >
                30
              </button>
              <button
                onClick={() => changeDuration(60)}
                className={`px-3 py-2 rounded transition-all duration-150 ${
                  duration === 60 
                    ? "bg-[#e2b714] text-[#323437] font-medium" 
                    : "bg-transparent text-[#646669] opacity-60 hover:opacity-80"
                }`}
              >
                60
              </button>
            </div>

          </div>

          {/* Instruction Text */}
          <div className="text-center">
            <p className="text-xs text-[#646669] opacity-60 tracking-widest">press enter or space to start</p>
          </div>
          
        </div>
      </main>
    );
  }

  // RENDER: Running State (Active Test)
  if (gameState === "running") {
    // Subtle feedback colors (MonkeyType style)
    const getInputColor = () => {
      if (feedback === "correct") return "text-[#d1d0c5]";
      if (feedback === "incorrect") return "text-[#ca4754]";
      return "text-[#d1d0c5]";
    };

    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#323437]">
        <div className="w-full max-w-4xl space-y-20">
          
          {/* Timer */}
          <div className="flex justify-center">
            <div className={`text-2xl font-light tabular-nums transition-colors ${
              timeLeft <= 5 ? "text-[#ca4754]" : "text-[#646669]"
            }`}>
              {timeLeft}
            </div>
          </div>

          {/* Problem - Main Focus */}
          <div className="text-center">
            <div className="text-8xl font-light tracking-tight text-[#d1d0c5]">
              {problem.left} {problem.operator} {problem.right}
            </div>
          </div>

          {/* Answer Input - Invisible Style */}
          <div className="flex justify-center">
            <input
              ref={inputRef}
              value={answer}
              onChange={(e) => handleAnswer(e.target.value)}
              onWheel={(e) => e.preventDefault()}
              type="number"
              inputMode="numeric"
              className={`bg-transparent outline-none text-5xl font-light text-center w-64 caret-[#646669] transition-colors ${getInputColor()}`}
              placeholder=""
              style={{ caretColor: '#646669' }}
            />
          </div>

          {/* Live Stats */}
          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className={`font-medium tabular-nums transition-colors duration-150 ${feedback === "correct" ? "text-[#d1d0c5]" : "text-[#646669] opacity-70"}`}>{correct}</span>
              <span className="text-[#646669] opacity-60">correct</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-medium tabular-nums transition-colors duration-150 ${feedback === "incorrect" ? "text-[#ca4754]" : "text-[#646669] opacity-70"}`}>{total - correct}</span>
              <span className="text-[#646669] opacity-60">wrong</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium tabular-nums text-[#646669] opacity-70">{total}</span>
              <span className="text-[#646669] opacity-60">total</span>
            </div>
          </div>

        </div>

        {/* Hint */}
        <div className="absolute bottom-8 text-xs text-[#646669] opacity-50 tracking-widest">
          esc to exit
        </div>
      </main>
    );
  }

  // RENDER: Finished State (Results Screen)
  if (gameState === "finished") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#323437]">
        <div className="w-full max-w-2xl space-y-16">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-medium text-[#d1d0c5]">test complete</h1>
          </div>

          {/* Stats */}
          <div className="space-y-10">
            
            {/* Primary Stats */}
            <div className="grid grid-cols-2 gap-12 max-w-lg mx-auto">
              <div className="text-center space-y-2">
                <div className="text-6xl font-medium text-[#d1d0c5] tabular-nums">{accuracy}%</div>
                <div className="text-xs uppercase tracking-widest text-[#646669] opacity-70">accuracy</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-6xl font-medium text-[#d1d0c5] tabular-nums">{ppm}</div>
                <div className="text-xs uppercase tracking-widest text-[#646669] opacity-70">ppm</div>
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="h-px bg-white/5 max-w-md mx-auto"></div>

            {/* Secondary Stats */}
            <div className="space-y-3 max-w-md mx-auto text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#646669] opacity-70">problems</span>
                <span className="font-normal text-[#646669] opacity-80 tabular-nums">{total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#646669] opacity-70">correct</span>
                <span className="font-normal text-[#646669] opacity-80 tabular-nums">{correct}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#646669] opacity-70">incorrect</span>
                <span className="font-normal text-[#646669] opacity-80 tabular-nums">{total - correct}</span>
              </div>
            </div>

          </div>

          {/* Instruction Text */}
          <div className="text-center">
            <p className="text-xs text-[#646669] opacity-70 tracking-widest">press enter or space to continue</p>
          </div>

        </div>
      </main>
    );
  }
  return null;
}
