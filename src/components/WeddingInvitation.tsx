"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function WeddingInvitation() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const containerVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut" as const,
      },
    },
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03 },
    tap: { scale: 0.98 },
  };

  const ctaVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8,
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
    hover: {
      opacity: 0.9,
      y: -3,
      transition: { duration: 0.2 },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <>
      {/* Main Invitation Section */}
      <section className="py-16 px-4">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {/* Main Image Container */}
          <motion.div
            className="relative cursor-pointer group"
            onClick={handleImageClick}
            variants={imageVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            transition={{ duration: 0.3 }}
          >
            {/* Image with enhanced prominence */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <div className="aspect-[4/5] w-full">
                <Image
                  src="/invitation.jpeg"
                  alt="הזמנת החתונה"
                  width={500}
                  height={625}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

            {/* Subtle overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-black/15 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />

            {/* Enhanced call-to-action button */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              variants={ctaVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div
                className="bg-white/95 backdrop-blur-md rounded-full px-6 py-3 shadow-xl border border-white/60"
                variants={pulseVariants}
                animate="animate"
                whileHover="hover"
              >
                <span className="text-base font-medium text-gray-800 flex items-center gap-3">
                  לחץ לצפייה
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              className="relative max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors duration-200 group"
              >
                <svg
                  className="w-6 h-6 text-gray-700 group-hover:text-gray-900 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image */}
              <div className="relative w-full h-full">
                <div className="aspect-[4/5] w-full max-h-[90vh]">
                  <Image
                    src="/invitation.jpeg"
                    alt="הזמנת החתונה"
                    width={1000}
                    height={1250}
                    className="w-full h-full object-contain rounded-3xl"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
