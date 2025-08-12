"use client";

import { motion } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";
import BackgroundGlow from "@/components/BackgroundGlow";
import WeddingInvitation from "@/components/WeddingInvitation";
import WeddingFooter from "@/components/WeddingFooter";
import { SkeletonCard } from "@/components/ui/Skeleton";
import {
  fireWelcomeConfetti,
  hasShownWelcomeConfetti,
  markWelcomeConfettiAsShown,
} from "@/lib/confetti-welcome";

// Lazy load heavy components
const WeddingCountdown = lazy(() => import("@/components/WeddingCountdown"));
const WeddingActions = lazy(() => import("@/components/WeddingActions"));
const RSVPForm = lazy(() => import("@/components/RSVPForm"));

// Improved loading components
const RSVPFormSkeleton = () => (
  <div className="max-w-xl mx-auto">
    <SkeletonCard />
  </div>
);

const WeddingCountdownSkeleton = () => (
  <div className="max-w-sm mx-auto">
    <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-pink-200 p-6 text-center">
      <div className="text-3xl mb-4">⏰</div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
      </div>
    </div>
  </div>
);

const WeddingActionsSkeleton = () => (
  <div className="flex flex-col items-center gap-6">
    <div className="flex justify-center items-center gap-8 flex-wrap">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function HomePage() {
  // קונפטי לברכה בפתיחת הקישור
  useEffect(() => {
    // הפעל קונפטי לברכה רק אם עוד לא הוצג
    if (!hasShownWelcomeConfetti()) {
      const timer = setTimeout(() => {
        fireWelcomeConfetti();
        markWelcomeConfettiAsShown();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundGlow />

      <motion.main
        className="relative z-10 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-5xl mx-auto px-6">
          <motion.div variants={itemVariants}>
            <WeddingInvitation />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Suspense fallback={<RSVPFormSkeleton />}>
              <RSVPForm />
            </Suspense>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Suspense fallback={<WeddingCountdownSkeleton />}>
              <WeddingCountdown />
            </Suspense>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Suspense fallback={<WeddingActionsSkeleton />}>
              <WeddingActions />
            </Suspense>
          </motion.div>

          <motion.div variants={itemVariants}>
            <WeddingFooter />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
