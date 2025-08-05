"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import WeddingCard from "./ui/WeddingCard";

export default function WeddingInvitation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setIsShareMenuOpen(false);
      }
    };

    if (isModalOpen || isShareMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, isShareMenuOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const shareText = `אנחנו מתחתנים! 🎉
הזמנה לחתונה של אביתר ושובל:
${typeof window !== "undefined" ? window.location.href : ""}`;

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: "📱",
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText)}`,
          "_blank"
        );
        setIsShareMenuOpen(false);
      },
    },
    {
      name: "Email",
      icon: "📧",
      action: () => {
        window.open(
          `mailto:?subject=You're invited!&body=${encodeURIComponent(
            shareText
          )}`,
          "_blank"
        );
        setIsShareMenuOpen(false);
      },
    },
    {
      name: "Copy Link",
      icon: "📋",
      action: async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
          setIsShareMenuOpen(false);
        } catch (err) {
          console.error("Failed to copy link");
        }
      },
    },
  ];

  const sparkleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1.2, 1],
      opacity: [0, 1, 0.8],
      transition: {
        duration: 1.5,
        ease: "easeOut" as const,
      },
    },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <>
      <WeddingCard>
        <motion.div
          className="text-center"
          variants={cardVariants}
          initial="initial"
          animate="animate"
        >
          <h3 className="text-2xl font-bold text-pink-700 mb-6">
            הזמנת החתונה
          </h3>

          <div className="relative">
            {/* Sparkle Animation */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              variants={sparkleVariants}
              initial="initial"
              animate="animate"
            >
              <div className="absolute top-4 left-4 text-yellow-400 text-xl">
                ✨
              </div>
              <div className="absolute top-8 right-8 text-pink-400 text-lg">
                💫
              </div>
              <div className="absolute bottom-6 left-6 text-blue-400 text-lg">
                ⭐
              </div>
            </motion.div>

            <motion.div
              className="relative cursor-pointer group"
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg border border-white/40 bg-gradient-to-br from-pink-50 to-blue-50 p-4">
                <Image
                  src="/invitation.png"
                  alt="הזמנת החתונה"
                  width={300}
                  height={400}
                  className="w-full h-auto rounded-xl object-cover"
                  priority
                />
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex justify-center items-center gap-4 mt-4">
              {/* Magnifying Glass Icon */}
              <motion.div
                className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors duration-200 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                title="לחץ להגדלה"
              >
                <span className="text-lg">🧐</span>
                <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  לחץ להגדלה
                </span>
              </motion.div>

              {/* Share Button */}
              <div className="relative">
                <motion.button
                  className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
                  onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  title="שתף הזמנה"
                >
                  <span className="text-lg">📤</span>
                  <span className="text-sm">שתף</span>
                </motion.button>

                {/* Share Menu */}
                <AnimatePresence>
                  {isShareMenuOpen && (
                    <motion.div
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-3 min-w-[200px]"
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-2">
                        {shareOptions.map((option, index) => (
                          <motion.button
                            key={option.name}
                            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-pink-50 transition-colors duration-200 text-right"
                            onClick={option.action}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="text-lg">{option.icon}</span>
                            <span className="text-sm font-medium text-gray-700">
                              {option.name}
                            </span>
                          </motion.button>
                        ))}
                      </div>

                      {/* Success Message */}
                      {copySuccess && (
                        <motion.div
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          הועתק בהצלחה! ✅
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </WeddingCard>

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
              className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl"
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
                <Image
                  src="/invitation.png"
                  alt="הזמנת החתונה"
                  width={800}
                  height={1000}
                  className="w-full h-auto max-h-[90vh] object-contain rounded-2xl"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
