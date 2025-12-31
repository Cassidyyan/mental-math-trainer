import { RefObject } from "react";

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  feedback: "correct" | "incorrect" | null;
}

export function AnswerInput({ value, onChange, inputRef, feedback }: AnswerInputProps) {
  const getInputColor = () => {
    if (feedback === "correct") return "text-[#d1d0c5]";
    if (feedback === "incorrect") return "text-[#ca4754]";
    return "text-[#d1d0c5]";
  };

  return (
    <div className="flex justify-center">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onWheel={(e) => e.preventDefault()}
        type="number"
        inputMode="numeric"
        className={`bg-transparent outline-none text-3xl sm:text-4xl md:text-5xl font-light text-center w-48 sm:w-56 md:w-64 caret-[#646669] transition-colors ${getInputColor()}`}
        placeholder=""
        style={{ caretColor: '#646669' }}
      />
    </div>
  );
}
