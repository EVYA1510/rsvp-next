"use client";

import confetti from "canvas-confetti";

// Welcome colors - shades of pink and red
const welcomeColors = ["#f93963", "#a10864", "#ee0b93"];

export function fireWelcomeConfetti() {
  // Fire heart confetti
  confetti({
    scalar: 2,
    spread: 180,
    particleCount: 30,
    origin: { y: -0.1 },
    startVelocity: -35,
    colors: welcomeColors,
    shapes: ["circle", "square"],
  });
}

export function hasShownWelcomeConfetti(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("welcome-confetti-shown") === "true";
}

export function markWelcomeConfettiAsShown(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("welcome-confetti-shown", "true");
}
