"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WeddingCard from "./ui/WeddingCard";

interface GuestGreetingProps {
  rsvpStatus?: "pending" | "confirmed" | "declined";
  hasSubmitted?: boolean;
}

export default function GuestGreeting({
  rsvpStatus = "pending",
  hasSubmitted = false,
}: GuestGreetingProps) {
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    // Only show greeting if RSVP is confirmed or user has submitted a positive response
    if (
      rsvpStatus === "confirmed" ||
      (hasSubmitted && rsvpStatus !== "declined")
    ) {
      setShowGreeting(true);
    }
  }, [rsvpStatus, hasSubmitted]);

  const greetingVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn" as const,
      },
    },
  };

  return (
    <AnimatePresence>
      {showGreeting && (
        <motion.div
          variants={greetingVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <WeddingCard variant="gradient">
            <div className="text-center max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-pink-600 mb-4"
              >
                <span className="text-4xl">💖</span>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-bold text-pink-800 text-xl mb-2"
              >
                תודה רבה על אישור ההגעה!
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-pink-700"
              >
                נשמח לראותכם ביום הגדול שלנו
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 text-sm text-pink-600"
              >
                ✨ נשלח לכם אישור במייל בקרוב
              </motion.div>
            </div>
          </WeddingCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
