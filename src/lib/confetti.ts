"use client";

import confetti from "canvas-confetti";

// Wedding theme colors
const weddingColors = ["#F472B6", "#F59E0B", "#F97316"];

export function fireRSVPSequence() {
  // Left launch
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.2, y: 0.6 },
    colors: weddingColors,
    shapes: ["circle", "square"],
  });

  // Right launch
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.8, y: 0.6 },
      colors: weddingColors,
      shapes: ["circle", "square"],
    });
  }, 200);

  // Center burst
  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 360,
      origin: { x: 0.5, y: 0.6 },
      colors: weddingColors,
      shapes: ["circle", "square"],
    });
  }, 400);
}
