"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "./Icon";
import WazeButton from "./WazeButton";
import CalendarButton from "./CalendarButton";

export default function WeddingActions() {
  const [showAboutModal, setShowAboutModal] = useState(false);

  const openAboutModal = () => {
    setShowAboutModal(true);
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
        delay: 0.3,
      },
    },
  };

  const modalVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <motion.div
        className="flex flex-col items-center gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-center items-center gap-8 flex-wrap">
          {/* Waze Navigation Button */}
          <WazeButton />

          {/* About System Button */}
          <motion.div className="flex flex-col items-center gap-2">
            <motion.button
              onClick={openAboutModal}
              className="w-20 h-20 bg-gradient-to-br from-violet-400 to-violet-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              title="About the System"
            >
              <Icon name="question" className="text-2xl" />
            </motion.button>
            <span className="text-sm font-medium text-gray-700">אודות</span>
          </motion.div>

          {/* Add to Calendar Button */}
          <CalendarButton />
        </div>
      </motion.div>

      {/* About Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAboutModal(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowAboutModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
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

              {/* Modal Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  אודות BeThere
                </h3>
                <div className="space-y-4 text-right">
                  <p className="text-gray-700 leading-relaxed">
                    BeThere היא פלטפורמה מודרנית להזמנות דיגיטליות שמאפשרת
                    לזוגות ליצור הזמנות יפות ואינטראקטיביות לאירועים שלהם.
                    המערכת שלנו הופכת את השיתוף של היום המיוחד עם חברים ומשפחה
                    לחוויה קלה ונעימה.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    הפלטפורמה מתאימה במיוחד לחתונות ואירועים בישראל, ומציעה כלים
                    שימושיים כמו אישורי הגעה, ניווט, אינטגרציה ליומן, ועוד.
                  </p>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      רוצים גם אתם להזמין מערכת אישורי הגעה לאירוע שלכם?
                    </p>
                    <p className="text-sm font-medium text-pink-600">
                      דברו איתנו: evyatar61300@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
