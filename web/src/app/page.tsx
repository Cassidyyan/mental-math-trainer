
// FIle runs on the client side
"use client";

// React Hooks
import { useState, useEffect } from "react";

// Main Component
export default function Home() {
  // State Variables for the Math Problem and Scoring
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  // Basic problem generation up to 20 sum
  function newProblem() {
    setA(Math.floor(Math.random() * 10));
    setB(Math.floor(Math.random() * 10));
  }

  useEffect(() => {
    newProblem();
  }, []);

  // Handle answer input and check correctness
  function handleAnswer(value: string) {
    setAnswer(value);

    if (parseInt(value) === a + b) {
      setCorrect((prev) => prev + 1);
      setTotal((prev) => prev + 1);
      setAnswer("");
      newProblem();
    }
  }
  // Main Render
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Mental Math Trainer</h1>

      <div className="text-6xl font-bold">
        {a} + {b}
      </div>

      <input
        value={answer}
        onChange={(e) => handleAnswer(e.target.value)}
        autoFocus
        className="text-black p-3 text-2xl rounded-md w-40 text-center"
        placeholder="Answer"
      />

      <div className="text-xl">
        Correct: {correct} / {total}
      </div>
    </main>
  );
}
