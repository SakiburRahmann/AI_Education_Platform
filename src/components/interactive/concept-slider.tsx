"use client";

import { useState } from "react";
import type { ConceptSliderData } from "@/types/interactive";

type Props = ConceptSliderData & {
  onComplete?: (value: number, correct: boolean | null) => void;
};

const SLIDER_ID = "eduai-concept-slider";

export function ConceptSlider({ label, min, max, step = 1, initial, unit, description, correctValue, onComplete }: Props) {
  const [value, setValue] = useState(initial);
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    setChecked(true);
    if (correctValue !== undefined) {
      const tolerance = (max - min) * 0.05;
      onComplete?.(value, Math.abs(value - correctValue) <= tolerance);
    }
  };

  const handleReset = () => {
    setChecked(false);
    setValue(initial);
  };

  return (
    <div className="my-3 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-lg font-bold text-eduai-primary">
          {value}{unit || ""}
        </p>
      </div>
      {description && (
        <p className="mb-3 text-xs text-muted-foreground">{description}</p>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => { setValue(Number(e.target.value)); setChecked(false); }}
        id={SLIDER_ID}
        className="w-full accent-eduai-primary"
      />
      <style>{`
        #${SLIDER_ID}::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #6C3CE1;
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 6px rgba(108,60,225,0.3);
        }
        #${SLIDER_ID}::-moz-range-thumb {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #6C3CE1;
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 6px rgba(108,60,225,0.3);
        }
      `}</style>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
      {correctValue !== undefined && !checked && (
        <button
          onClick={handleCheck}
          className="mt-3 rounded-lg bg-primary px-4 py-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Check
        </button>
      )}
      {checked && correctValue !== undefined && (
        <div className="mt-3">
          <p className={`text-xs font-medium ${Math.abs(value - correctValue) <= (max - min) * 0.05 ? "text-green-600" : "text-red-500"}`}>
            {Math.abs(value - correctValue) <= (max - min) * 0.05
              ? `Correct! The target was ${correctValue}${unit || ""}.`
              : `Not quite. The correct value was ${correctValue}${unit || ""}. Your value: ${value}${unit || ""}.`}
          </p>
          <button
            onClick={handleReset}
            className="mt-3 rounded-lg border px-4 py-4 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
