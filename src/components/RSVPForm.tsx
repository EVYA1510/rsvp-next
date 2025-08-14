"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback } from "react";
import WeddingCard from "./ui/WeddingCard";
import RSVPFormFields from "./forms/RSVPFormFields";
import RSVPSuccessMessage from "./forms/RSVPSuccessMessage";
import { useRSVPForm } from "@/hooks/useRSVPForm";
import { fireRSVPSequence } from "@/lib/confetti";

export default function RSVPForm() {
  const {
    formData,
    setFormData,
    submitted,
    isSubmitting,
    isLoadingPrevious,
    nameFromURL,
    isNameLocked,
    submitMessage,
    errors,
    handleSubmit,
    handleReset,
  } = useRSVPForm();

  // Trigger confetti when form is submitted successfully
  const handleSuccessfulSubmit = useCallback(
    async (e: React.FormEvent) => {
      try {
        await handleSubmit(e);
        // If we reach here, the submission was successful
        // הפעל קונפטי מתפוצץ רק אם המוזמן מגיע
        if (formData.status === "yes") {
          fireRSVPSequence();
        }
      } catch (error) {
        // Handle error if needed
        console.error("Form submission error:", error);
      }
    },
    [handleSubmit, formData.status]
  );

  if (submitted) {
    return (
      <RSVPSuccessMessage
        name={formData.name}
        status={formData.status}
        guests={formData.guests}
        blessing={formData.blessing || ""}
        onReset={handleReset}
      />
    );
  }

  return (
    <WeddingCard>
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-pink-700 mb-8">
          אישור הגעה
        </h2>

        {nameFromURL && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-600 bg-blue-50 border border-blue-200 p-4 rounded-xl text-center mb-6"
          >
            👋 שלום {nameFromURL}! הפרטים שלך נטענו אוטומטית
          </motion.div>
        )}

        {isLoadingPrevious && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-blue-600 bg-blue-100 p-4 rounded-xl text-center mb-6"
          >
            🔍 מחפש פרטים קודמים...
          </motion.div>
        )}

        <form onSubmit={handleSuccessfulSubmit} className="space-y-6">
          <AnimatePresence mode="wait" key="submitMessageContainer">
            {submitMessage && (
              <motion.div
                key="submitMessage"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-blue-600 bg-blue-100 p-4 rounded-xl text-center"
              >
                {submitMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <RSVPFormFields
            name={formData.name}
            setName={(name) => setFormData({ name })}
            status={formData.status}
            setStatus={(status) => setFormData({ status })}
            guests={formData.guests}
            setGuests={(guests) => setFormData({ guests })}
            blessing={formData.blessing || ""}
            setBlessing={(blessing) => setFormData({ blessing })}
            isNameLocked={isNameLocked}
            isSubmitting={isSubmitting}
            isLoadingPrevious={isLoadingPrevious}
            errors={errors}
          />

          <motion.button
            type="submit"
            disabled={isSubmitting || isLoadingPrevious}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg transform ${
              isSubmitting || isLoadingPrevious
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 hover:scale-105 hover:shadow-xl"
            } text-white`}
            whileHover={
              !isSubmitting && !isLoadingPrevious ? { scale: 1.02 } : {}
            }
            whileTap={
              !isSubmitting && !isLoadingPrevious ? { scale: 0.98 } : {}
            }
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                שולח...
              </div>
            ) : isLoadingPrevious ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                טוען...
              </div>
            ) : (
              "שלח אישור"
            )}
          </motion.button>
        </form>
      </div>
    </WeddingCard>
  );
}
