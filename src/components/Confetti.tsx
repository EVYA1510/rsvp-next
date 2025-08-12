"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  shape: "circle" | "square" | "star" | "heart";
  delay: number;
  duration: number;
  direction: "down" | "up";
}

// צבעים צבעוניים ובהירים
const colorfulColors = [
  "#FF6B6B", // אדום
  "#4ECDC4", // טורקיז
  "#45B7D1", // כחול בהיר
  "#96CEB4", // ירוק בהיר
  "#FFEAA7", // צהוב בהיר
  "#DDA0DD", // סגול בהיר
  "#FFB347", // כתום בהיר
  "#98D8C8", // ירוק-כחול
  "#F7DC6F", // צהוב-כתום
  "#BB8FCE", // סגול בהיר
];

const confettiShapes = ["circle", "square", "star", "heart"] as const;

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  intensity?: "low" | "medium" | "high";
  type?: "falling" | "explosion";
}

export default function Confetti({
  isActive,
  duration = 6000,
  intensity = "high",
  type = "falling",
}: ConfettiProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  const getIntensitySettings = (confettiIntensity: "low" | "medium" | "high") => {
    switch (confettiIntensity) {
      case "low":
        return { pieceCount: 50, durationRange: [3, 5] };
      case "medium":
        return { pieceCount: 100, durationRange: [4, 6] };
      case "high":
        return { pieceCount: 150, durationRange: [5, 7] };
      default:
        return { pieceCount: 150, durationRange: [5, 7] };
    }
  };

  const generateConfetti = useCallback(() => {
    const { pieceCount, durationRange } = getIntensitySettings(intensity);
    
    const newConfetti: ConfettiPiece[] = [];

    for (let i = 0; i < pieceCount; i++) {
      const direction = type === "explosion" ? "up" : "down";
      
      newConfetti.push({
        id: i,
        x: Math.random() * 100, // 0-100% of viewport width
        y: type === "explosion" ? 50 + Math.random() * 20 : -10 - Math.random() * 20, // Start position based on type
        rotation: Math.random() * 360,
        scale: 0.3 + Math.random() * 1.2,
        color: colorfulColors[Math.floor(Math.random() * colorfulColors.length)],
        shape: confettiShapes[Math.floor(Math.random() * confettiShapes.length)],
        delay: Math.random() * 800, // Stagger the animation
        duration: durationRange[0] + Math.random() * (durationRange[1] - durationRange[0]),
        direction,
      });
    }

    return newConfetti;
  }, [intensity, type]);

  useEffect(() => {
    if (!isActive) {
      setConfetti([]);
      return;
    }

    const newConfetti = generateConfetti();
    setConfetti(newConfetti);

    // Clear confetti after duration
    const timer = setTimeout(() => {
      setConfetti([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [isActive, duration, generateConfetti]);

  const renderShape = (shape: string, color: string) => {
    switch (shape) {
      case "circle":
        return (
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        );
      case "square":
        return <div className="w-2 h-2" style={{ backgroundColor: color }} />;
      case "heart":
        return (
          <div className="w-3 h-3 relative" style={{ color: color }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        );
      case "star":
        return (
          <div className="w-3 h-3 relative" style={{ color: color }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        );
    }
  };

  const getAnimationValues = (piece: ConfettiPiece) => {
    if (type === "explosion") {
      // קונפטי מתפוצץ - עולה מהמרכז
      return {
        y: [piece.y, piece.y - 100 - Math.random() * 200],
        x: [piece.x, piece.x + (Math.random() - 0.5) * 100],
        opacity: [0, 1, 1, 0],
        scale: [0, piece.scale, piece.scale, 0],
        rotate: [piece.rotation, piece.rotation + 360, piece.rotation + 720],
      };
    } else {
      // קונפטי יורד - נופל מלמעלה
      return {
        y: [piece.y, "100vh"],
        x: [piece.x, piece.x + (Math.random() - 0.5) * 50],
        opacity: [0, 1, 1, 0],
        scale: [0, piece.scale, piece.scale, 0],
        rotate: [piece.rotation, piece.rotation + 360, piece.rotation + 720],
      };
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute"
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
            }}
            initial={{
              y: piece.y,
              x: piece.x,
              opacity: 0,
              scale: 0,
              rotate: piece.rotation,
            }}
            animate={getAnimationValues(piece)}
            transition={{
              duration: piece.duration,
              delay: piece.delay / 1000,
              ease: "easeOut",
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
          >
            {renderShape(piece.shape, piece.color)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for easy confetti triggering
export function useConfetti() {
  const [isActive, setIsActive] = useState(false);

  const trigger = useCallback((
    duration = 6000,
    intensity: "low" | "medium" | "high" = "high",
    type: "falling" | "explosion" = "falling"
  ) => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), duration);
  }, []);

  return { isActive, trigger };
}
