"use client";

import { motion } from "framer-motion";

export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        className="w-[800px] h-[800px] bg-pink-300 opacity-40 rounded-full blur-3xl absolute top-[-200px] right-[-200px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
      />
      <motion.div
        className="w-[600px] h-[600px] bg-blue-300 opacity-40 rounded-full blur-2xl absolute bottom-[-200px] left-[-200px]"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: 2,
        }}
      />
    </div>
  );
}
