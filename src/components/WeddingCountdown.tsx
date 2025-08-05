"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import WeddingCard from "./ui/WeddingCard";

export default function WeddingCountdown() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const weddingDate = new Date("2025-09-09T18:00:00+03:00");

    function getTimeLeft() {
      const now = new Date();
      const diff = weddingDate.getTime() - now.getTime();

      if (diff <= 0) return null;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      return { days, hours, minutes };
    }

    // Set initial time
    setTimeLeft(getTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  const numberVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        delay: 0.3,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <WeddingCard variant="gradient">
        <div className="text-center">
          <div className="text-2xl text-pink-700 mb-4">⏰</div>
          <div className="text-xl font-semibold text-pink-700">
            <span className="font-bold text-4xl">...</span> ימים נותרו לאירוע
          </div>
        </div>
      </WeddingCard>
    );
  }

  if (!timeLeft) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <WeddingCard variant="gradient">
          <motion.div
            className="text-center"
            variants={floatingVariants}
            animate="animate"
          >
            <div className="text-2xl font-bold text-green-800 mb-2">💍</div>
            <div className="text-xl font-semibold text-green-800">
              היום זה היום! מחכים לראותכם!
            </div>
          </motion.div>
        </WeddingCard>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <WeddingCard variant="gradient">
        <motion.div
          className="text-center"
          variants={floatingVariants}
          animate="animate"
        >
          <div className="text-2xl text-pink-700 mb-4">⏰</div>
          <div className="text-xl font-semibold text-pink-700">
            <motion.span
              className="font-bold text-4xl inline-block bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
              style={{
                textShadow: "0 0 20px rgba(236, 72, 153, 0.3)",
                filter: "drop-shadow(0 0 10px rgba(236, 72, 153, 0.2))",
              }}
              variants={numberVariants}
              initial="hidden"
              animate="visible"
            >
              {timeLeft.days}
            </motion.span>{" "}
            ימים נותרו לאירוע
          </div>
        </motion.div>
      </WeddingCard>
    </motion.div>
  );
}
