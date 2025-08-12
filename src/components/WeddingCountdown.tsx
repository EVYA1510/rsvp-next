"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function WeddingCountdown() {
  // Debug mode configuration
  const debugMode = false; // Set to false to disable debug menu
  const debugDates = {
    future: new Date("2025-09-01T14:00:00+03:00"),
    todayMorning: new Date("2025-09-09T09:00:00+03:00"),
    todayEvening: new Date("2025-09-09T17:00:00+03:00"),
    afterEvent: new Date("2025-09-10T12:00:00+03:00"),
  };

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [countUpValue, setCountUpValue] = useState(0);
  const [devNowOverride, setDevNowOverride] = useState<Date | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    setMounted(true);

    const weddingDate = new Date("2025-09-09T18:00:00+03:00");

    function getTimeLeft() {
      const now = devNowOverride || new Date();
      const diff = weddingDate.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      return { days, hours, minutes };
    }

    // Set initial time
    const initialTime = getTimeLeft();
    setTimeLeft(initialTime);

    const timer = setInterval(() => {
      const currentTime = getTimeLeft();
      setTimeLeft(currentTime);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [devNowOverride]);

  // Count up animation effect
  useEffect(() => {
    if (timeLeft && isInView) {
      const targetValue = timeLeft.days;
      const duration = 1000; // 1 second
      const steps = 60;
      const increment = targetValue / steps;
      let currentValue = 0;

      const countUpTimer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
          setCountUpValue(targetValue);
          clearInterval(countUpTimer);
        } else {
          setCountUpValue(Math.floor(currentValue));
        }
      }, duration / steps);

      return () => clearInterval(countUpTimer);
    }
  }, [timeLeft, isInView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
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
        duration: 0.8,
        ease: "easeOut" as const,
        delay: 0.3,
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  const shimmerVariants = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear" as const,
      },
    },
  };

  // Smart logic for different time states
  const getMessage = () => {
    if (!timeLeft) {
      // Check if event is over by calculating directly
      const weddingDate = new Date("2025-09-09T18:00:00+03:00");
      const now = devNowOverride || new Date();
      const diff = weddingDate.getTime() - now.getTime();

      if (diff <= 0) {
        return {
          text: "תודה שהייתם חלק מהרגעים הבלתי נשכחים שלנו 💖",
          subtitle: "הלב שלנו מלא בהכרת תודה",
          icon: "💐",
          isComplete: true,
        };
      }
      return null;
    }

    const { days, hours } = timeLeft;

    // Event is over (after 23:59 on wedding day)
    if (days < 0) {
      return {
        text: "תודה שהייתם חלק מהרגעים הבלתי נשכחים שלנו 💖",
        subtitle: "הלב שלנו מלא בהכרת תודה",
        icon: "💐",
        isComplete: true,
      };
    }

    // Event is today and happening soon (within 6 hours)
    if (days === 0 && hours <= 6) {
      return {
        text: "האירוע בעוד רגע!",
        subtitle: "מחכים לראותכם",
        icon: "🎉",
        isComplete: false,
      };
    }

    // Event is today but still hours away
    if (days === 0 && hours > 6) {
      return {
        text: "היום זה היום!",
        subtitle: "מחכים לראותכם",
        icon: "💍",
        isComplete: false,
      };
    }

    // Event is in the future
    return {
      text: `${days} ימים נותרו לאירוע`,
      subtitle: "נשמח לראותכם ביום הגדול שלנו",
      icon: "⏰",
      isComplete: false,
    };
  };

  const message = getMessage();

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div>
        <motion.div
          ref={ref}
          className="max-w-sm mx-auto bg-white/20 backdrop-blur-md rounded-3xl shadow-pink-200 p-6 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="text-3xl mb-4"
            variants={pulseVariants}
            animate="animate"
          >
            ⏰
          </motion.div>
          <motion.div
            className="text-lg font-semibold text-pink-700 drop-shadow-sm"
            variants={shimmerVariants}
            animate="animate"
            style={{
              background: "linear-gradient(90deg, #ec4899, #a855f7, #ec4899)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ...
          </motion.div>
        </motion.div>

        {/* Debug Menu */}
        {debugMode && (
          <div className="flex gap-2 justify-center mt-4 flex-wrap text-sm text-gray-700">
            <button
              onClick={() => setDevNowOverride(null)}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              🕒 Real Time
            </button>
            <button
              onClick={() => setDevNowOverride(debugDates.future)}
              className="px-3 py-1 rounded bg-blue-200 hover:bg-blue-300 transition-colors"
            >
              🔮 Future
            </button>
            <button
              onClick={() => setDevNowOverride(debugDates.todayMorning)}
              className="px-3 py-1 rounded bg-green-200 hover:bg-green-300 transition-colors"
            >
              🌅 Today (Morning)
            </button>
            <button
              onClick={() => setDevNowOverride(debugDates.todayEvening)}
              className="px-3 py-1 rounded bg-yellow-200 hover:bg-yellow-300 transition-colors"
            >
              ⏳ Soon
            </button>
            <button
              onClick={() => setDevNowOverride(debugDates.afterEvent)}
              className="px-3 py-1 rounded bg-red-200 hover:bg-red-300 transition-colors"
            >
              ✅ After
            </button>
          </div>
        )}
      </div>
    );
  }

  // Event is complete - minimized state
  const completeMessage = message?.isComplete ? message : getMessage();
  if (completeMessage?.isComplete) {
    return (
      <div>
        <motion.div
          ref={ref}
          className="max-w-sm mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-pink-200 p-4 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="text-center"
            variants={pulseVariants}
            animate="animate"
          >
            <div className="text-3xl mb-3">💐</div>
            <div className="text-base font-semibold text-gray-800 drop-shadow-sm">
              {completeMessage.text}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {completeMessage.subtitle}
            </div>
          </motion.div>
        </motion.div>

        {/* Debug Menu */}
        {debugMode && (
          <div className="flex gap-2 justify-center mt-4 flex-wrap text-sm text-gray-700">
            <button
              onClick={() => setDevNowOverride(null)}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              🕒 Real Time
            </button>
            <button
              onClick={() => setDevNowOverride(debugDates.future)}
              className="px-3 py-1 rounded bg-blue-200 hover:bg-blue-300 transition-colors"
            >
              🔮 Future
            </button>
            <button
              onClick={() => setDevNowOverride(debugDates.todayMorning)}
              className="px-3 py-1 rounded bg-green-200 hover:bg-green-300 transition-colors"
            >
              🌅 Today (Morning)
            </button>
            <button
              onClick={() => setDevNowOverride(debugDates.todayEvening)}
              className="px-3 py-1 rounded bg-yellow-200 hover:bg-yellow-300 transition-colors"
            >
              ⏳ Soon
            </button>
            <button
              onClick={() => setDevNowOverride(debugDates.afterEvent)}
              className="px-3 py-1 rounded bg-red-200 hover:bg-red-300 transition-colors"
            >
              ✅ After
            </button>
          </div>
        )}
      </div>
    );
  }

  // Event is happening soon or today
  if (timeLeft && (timeLeft.days === 0 || message?.text.includes("רגע"))) {
    return (
      <div>
        <motion.div
          ref={ref}
          className="max-w-sm mx-auto bg-white/20 backdrop-blur-md rounded-3xl shadow-pink-200 p-6 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="text-center"
            variants={pulseVariants}
            animate="animate"
          >
            <div className="text-3xl mb-4">{message?.icon}</div>
            <div className="text-lg font-semibold text-pink-700 drop-shadow-sm">
              {message?.text}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {message?.subtitle}
            </div>
          </motion.div>
        </motion.div>

        {/* Debug Menu */}
        {debugMode && (
          <div className="flex gap-2 justify-center mt-4 flex-wrap text-sm text-gray-700">
            <button
              onClick={() => setDevNowOverride(null)}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              🕒 Real Time
            </button>
            <button
              onClick={() => setDevNowOverride(debugDates.future)}
              className="px-3 py-1 rounded bg-blue-200 hover:bg-blue-300 transition-colors"
            >
              🔮 Future
            </button>
            <button
              onClick={() => setDevNowOverride(debugDates.todayMorning)}
              className="px-3 py-1 rounded bg-green-200 hover:bg-green-300 transition-colors"
            >
              🌅 Today (Morning)
            </button>
            <button
              onClick={() => setDevNowOverride(debugDates.todayEvening)}
              className="px-3 py-1 rounded bg-yellow-200 hover:bg-yellow-300 transition-colors"
            >
              ⏳ Soon
            </button>
            <button
              onClick={() => setDevNowOverride(debugDates.afterEvent)}
              className="px-3 py-1 rounded bg-red-200 hover:bg-red-300 transition-colors"
            >
              ✅ After
            </button>
          </div>
        )}
      </div>
    );
  }

  // Normal countdown state
  return (
    <div>
      <motion.div
        ref={ref}
        className="max-w-sm mx-auto bg-white/20 backdrop-blur-md rounded-3xl shadow-pink-200 p-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center"
          variants={pulseVariants}
          animate="animate"
        >
          <div className="text-3xl mb-4">⏰</div>
          <div className="text-lg font-semibold text-pink-700 drop-shadow-sm">
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
              {countUpValue}
            </motion.span>{" "}
            ימים נותרו לאירוע
          </div>
          <div className="text-sm text-gray-600 mt-2">
            נשמח לראותכם ביום הגדול שלנו
          </div>
        </motion.div>
      </motion.div>

      {/* Debug Menu */}
      {debugMode && (
        <div className="flex gap-2 justify-center mt-4 flex-wrap text-sm text-gray-700">
          <button
            onClick={() => setDevNowOverride(null)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            🕒 Real Time
          </button>
          <button
            onClick={() => setDevNowOverride(debugDates.future)}
            className="px-3 py-1 rounded bg-blue-200 hover:bg-blue-300 transition-colors"
          >
            🔮 Future
          </button>
          <button
            onClick={() => setDevNowOverride(debugDates.todayMorning)}
            className="px-3 py-1 rounded bg-green-200 hover:bg-green-300 transition-colors"
          >
            🌅 Today (Morning)
          </button>
          <button
            onClick={() => setDevNowOverride(debugDates.todayEvening)}
            className="px-3 py-1 rounded bg-yellow-200 hover:bg-yellow-300 transition-colors"
          >
            ⏳ Soon
          </button>
          <button
            onClick={() => setDevNowOverride(debugDates.afterEvent)}
            className="px-3 py-1 rounded bg-red-200 hover:bg-red-300 transition-colors"
          >
            ✅ After
          </button>
        </div>
      )}
    </div>
  );
}
