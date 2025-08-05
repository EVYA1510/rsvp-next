"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import WeddingCard from "./ui/WeddingCard";

interface RSVPData {
  name: string;
  status: "מגיע" | "לא מגיע";
  guests: number;
  blessing?: string;
  timestamp: string;
}

export default function RSVPForm() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"מגיע" | "לא מגיע">("מגיע");
  const [guests, setGuests] = useState(1);
  const [blessing, setBlessing] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);

  // Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = "/api/submit";

  // Load previous RSVP data on component mount
  useEffect(() => {
    const savedName = localStorage.getItem("rsvp_name");
    if (savedName) {
      setName(savedName);
      checkPreviousRSVP(savedName);
    }
  }, []);

  const checkPreviousRSVP = async (guestName: string) => {
    setIsLoadingPrevious(true);
    try {
      const response = await fetch(
        `${GOOGLE_SCRIPT_URL}?name=${encodeURIComponent(guestName)}`,
        {
          method: "GET",
          mode: "no-cors", // Workaround for Google Apps Script CORS limitations
        }
      );
      // With no-cors mode, we can't read the response, so we'll skip this for now
      // The data will still be sent to the script, but we can't read the response
      console.log("Previous RSVP check sent (no-cors mode)");
    } catch (error) {
      console.error("Error checking previous RSVP:", error);
    } finally {
      setIsLoadingPrevious(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("נא להזין שם מלא");
      return;
    }

    if (guests < 1 || guests > 10) {
      setError("מספר אורחים בין 1 ל־10");
      return;
    }

    setError("");
    setIsSubmitting(true);
    setSubmitMessage("שולח את הפרטים...");

    try {
      const formData: RSVPData = {
        name: name.trim(),
        status: status,
        guests: guests,
        blessing: blessing.trim() || undefined,
        timestamp: new Date().toISOString(),
      };

      console.log("Sending data to:", GOOGLE_SCRIPT_URL);
      console.log("Form data:", formData);

      // Send as URL parameters instead of JSON body to avoid CORS issues
      const params = new URLSearchParams({
        name: formData.name,
        status: formData.status,
        guests: formData.guests.toString(),
        blessing: formData.blessing || "",
        timestamp: formData.timestamp,
      });

      const response = await fetch(
        `${GOOGLE_SCRIPT_URL}?${params.toString()}`,
        {
          method: "POST",
          mode: "no-cors",
        }
      );

      // With no-cors mode, we can't read the response, but the data is still sent
      console.log("Request sent successfully (no-cors mode)");

      // Save name to localStorage
      localStorage.setItem("rsvp_name", name.trim());

      setSubmitted(true);
      setSubmitMessage("הפרטים נשלחו בהצלחה! 🎉");

      // Form submitted successfully
    } catch (error) {
      console.error("Submission error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "שגיאה בשליחת הפרטים. נא לנסות שוב."
      );
      setSubmitMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setError("");
    setSubmitMessage("");
    setName("");
    setStatus("מגיע");
    setGuests(1);
    setBlessing("");
    localStorage.removeItem("rsvp_name");
  };

  if (submitted) {
    return (
      <WeddingCard variant="gradient">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-4xl mb-4"
          >
            🎉
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-green-800 mb-2"
          >
            תודה רבה על אישור ההגעה!
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-green-700"
          >
            נשמח לראותך ביום הגדול שלנו
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-sm text-green-600"
          >
            ✨ נשלח לכם אישור במייל בקרוב
          </motion.div>

          <motion.button
            onClick={handleReset}
            className="mt-6 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            שלח RSVP נוסף
          </motion.button>
        </div>
      </WeddingCard>
    );
  }

  return (
    <WeddingCard>
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-pink-700 mb-8">
          אישור הגעה
        </h2>

        {isLoadingPrevious && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-blue-600 bg-blue-100 p-4 rounded-xl text-center mb-6"
          >
            🔍 מחפש פרטים קודמים...
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 bg-red-100 p-4 rounded-xl text-center"
            >
              {error}
            </motion.div>
          )}

          {submitMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-blue-600 bg-blue-100 p-4 rounded-xl text-center"
            >
              {submitMessage}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              שם מלא
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all text-right"
              required
              disabled={isSubmitting || isLoadingPrevious}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              סטטוס הגעה
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "מגיע" | "לא מגיע")}
              className="w-full p-4 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all text-right"
              disabled={isSubmitting || isLoadingPrevious}
            >
              <option value="מגיע">מגיע</option>
              <option value="לא מגיע">לא מגיע</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              מספר אורחים (כולל אותך)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full p-4 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all text-right"
              disabled={isSubmitting || isLoadingPrevious}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              ברכה (לא חובה)
            </label>
            <textarea
              value={blessing}
              onChange={(e) => setBlessing(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all text-right resize-none"
              rows={4}
              disabled={isSubmitting || isLoadingPrevious}
            />
          </div>

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
