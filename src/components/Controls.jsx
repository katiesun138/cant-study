import React from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./Button";

export default function Controls({ onMove, disabled = false }) {
  const buttonClass =
    "h-14 w-14 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-lavender-200 shadow-lg active:scale-95 transition-all hover:bg-white disabled:opacity-50";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex flex-col items-center gap-1">
        <Button
          variant="ghost"
          className={buttonClass}
          onPointerDown={() => onMove("up")}
          onPointerUp={() => onMove(null)}
          onPointerLeave={() => onMove(null)}
          disabled={disabled}
        >
          <ChevronUp className="h-8 w-8 text-gray-600" />
        </Button>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            className={buttonClass}
            onPointerDown={() => onMove("left")}
            onPointerUp={() => onMove(null)}
            onPointerLeave={() => onMove(null)}
            disabled={disabled}
          >
            <ChevronLeft className="h-8 w-8 text-gray-600" />
          </Button>
          <div className="h-14 w-14" /> {/* Spacer */}
          <Button
            variant="ghost"
            className={buttonClass}
            onPointerDown={() => onMove("right")}
            onPointerUp={() => onMove(null)}
            onPointerLeave={() => onMove(null)}
            disabled={disabled}
          >
            <ChevronRight className="h-8 w-8 text-gray-600" />
          </Button>
        </div>

        <Button
          variant="ghost"
          className={buttonClass}
          onPointerDown={() => onMove("down")}
          onPointerUp={() => onMove(null)}
          onPointerLeave={() => onMove(null)}
          disabled={disabled}
        >
          <ChevronDown className="h-8 w-8 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}
