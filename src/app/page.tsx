"use client";

import { motion } from "framer-motion";
import BackgroundGlow from "@/components/BackgroundGlow";
import WeddingHeader from "@/components/WeddingHeader";
import WeddingCountdown from "@/components/WeddingCountdown";
import WeddingInvitation from "@/components/WeddingInvitation";
import WeddingDetails from "@/components/WeddingDetails";
import WeddingActions from "@/components/WeddingActions";
import RSVPForm from "@/components/RSVPForm";
import WeddingFooter from "@/components/WeddingFooter";

export default function HomePage() {
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
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundGlow />

      <motion.main
        className="relative z-10 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-5xl mx-auto px-6">
          <motion.div variants={itemVariants}>
            <WeddingHeader />
          </motion.div>

          <motion.div variants={itemVariants}>
            <WeddingCountdown />
          </motion.div>

          <motion.div variants={itemVariants}>
            <WeddingInvitation />
          </motion.div>

          <motion.div variants={itemVariants}>
            <WeddingDetails />
          </motion.div>

          <motion.div variants={itemVariants}>
            <WeddingActions />
          </motion.div>

          <motion.div variants={itemVariants}>
            <RSVPForm />
          </motion.div>

          <motion.div variants={itemVariants}>
            <WeddingFooter />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
