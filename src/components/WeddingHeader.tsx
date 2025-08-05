"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import WeddingCard from "./ui/WeddingCard";

// Dynamically import Confetti to avoid SSR issues
const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false,
  loading: () => null,
});

export default function WeddingHeader() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only set dimensions and show confetti on client
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setShowConfetti(true);

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <WeddingCard variant="gradient">
        <div className="text-center">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-gray-900 mb-4 leading-tight">
              החתונה של אביתר ושובל
            </h1>
            <div className="text-2xl text-pink-600 mb-2">💍</div>
          </div>
          
          <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
            נשמח לראותכם ביום הגדול שלנו
          </p>
        </div>
      </WeddingCard>
    );
  }

  return (
    <>
      {showConfetti && windowDimensions.width > 0 && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          wind={0.05}
          colors={["#f472b6", "#60a5fa", "#a78bfa", "#fbbf24", "#34d399"]}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1000,
            pointerEvents: "none",
          }}
        />
      )}
      
      <WeddingCard variant="gradient">
        <div className="text-center">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-gray-900 mb-4 leading-tight">
              החתונה של אביתר ושובל
            </h1>
            <div className="text-2xl text-pink-600 mb-2">💍</div>
          </div>
          
          <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
            נשמח לראותכם ביום הגדול שלנו
          </p>
        </div>
      </WeddingCard>
    </>
  );
} 