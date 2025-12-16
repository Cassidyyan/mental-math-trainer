"use client";

import { useState, useEffect, useRef } from "react";
import { Problem, Mode, Difficulty, GameState, Duration } from "@/app/lib/types";
import { generateProblem } from "@/app/lib/problemGenerator";
import { calculateAccuracy, calculatePPM } from "@/app/lib/utils";
import { Controls } from "./Controls";
import { ProblemDisplay } from "./ProblemDisplay";
import { AnswerInput } from "./AnswerInput";
import { StatsPanel } from "./StatsPanel";
import { Timer } from "./Timer";

export function GameContainer() {
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

  // Escape key to return to main menu, F key for dev shortcut to results, Tab to skip
  useEffect(() => {
    function handleEscapeKey(e: KeyboardEvent) {
      if (e.key === "Escape" && gameState === "running") {
        restartTest();
      }
      // Developer shortcut: F key to jump to results screen
      if (e.key === "f" && gameState === "running") {
        setGameState("finished");
      }
      // Tab key to skip current problem
      if (e.key === "Tab" && gameState === "running") {
        e.preventDefault();
        setTotal((prev) => prev + 1);
        setAnswer("");
        setFeedback(null);
        newProblem();
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
  }, [gameState, mode, difficulty, duration]);

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
          <Controls
            mode={mode}
            difficulty={difficulty}
            duration={duration}
            onModeChange={changeMode}
            onDifficultyChange={changeDifficultyLevel}
            onDurationChange={changeDuration}
          />

          {/* Instruction Text */}
          <div className="text-center">
            <p className="text-xs text-[#a1a3a4] opacity-60 tracking-widest">press 
                <span className="bg-[#a1a3a4]/10 px-2 py-0.5 rounded">enter</span> or 
                <span className="bg-[#a1a3a4]/10 px-2 py-0.5 rounded">space</span> to start</p>
          </div>
          
        </div>
      </main>
    );
  }

  // RENDER: Running State (Active Test)
  if (gameState === "running") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#323437]">
        <div className="w-full max-w-4xl space-y-20">
          
          <Timer timeLeft={timeLeft} />

          <ProblemDisplay problem={problem} />

          <AnswerInput
            value={answer}
            onChange={handleAnswer}
            inputRef={inputRef}
            feedback={feedback}
          />

          <StatsPanel
            gameState={gameState}
            correct={correct}
            total={total}
            feedback={feedback}
            accuracy={accuracy}
            ppm={ppm}
          />

        </div>

        {/* Hints */}
        <div className="absolute bottom-8 text-xs text-[#a1a3a4] opacity-50 text-center space-y-1">
          <div className="flex justify-center gap-8">
            <div>
            <span className="bg-[#a1a3a4]/10 px-2 py-1 rounded">tab</span> - skip problem
            </div>
            <span>
              <span className="bg-[#a1a3a4]/10 px-2 py-1 rounded">F</span> - finish test
            </span>
            <span>
              <span className="bg-[#a1a3a4]/10 px-2 py-1 rounded">esc</span> - exit
            </span>
          </div>
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
          <StatsPanel
            gameState={gameState}
            correct={correct}
            total={total}
            feedback={feedback}
            accuracy={accuracy}
            ppm={ppm}
          />

          {/* Instruction Text with subtle pulse animation */}
          <div className="text-center space-y-3">
            <button
              onClick={restartTest}
              className="px-6 py-2 bg-transparent border border-[#a1a3a4]/20 text-[#a1a3a4] rounded-lg hover:border-[#a1a3a4]/40 hover:bg-[#a1a3a4]/5 transition-all duration-200 text-sm"
            >
              Restart Test
            </button>
            <p className="text-xs text-[#a1a3a4] opacity-50 tracking-widest animate-pulse">
              press <span className="bg-[#a1a3a4]/10 px-2 py-0.5 rounded">enter</span> or <span className="bg-[#a1a3a4]/10 px-2 py-0.5 rounded">space</span>
            </p>
          </div>

        </div>
      </main>
    );
  }

  return null;
}
