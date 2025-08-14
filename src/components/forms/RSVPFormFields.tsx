"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RsvpStatus } from "@/lib/validations";

interface RSVPFormFieldsProps {
  name: string;
  setName: (name: string) => void;
  status: RsvpStatus;
  setStatus: (status: RsvpStatus) => void;
  guests: number;
  setGuests: (guests: number) => void;
  blessing: string;
  setBlessing: (blessing: string) => void;
  isNameLocked: boolean;
  isSubmitting: boolean;
  isLoadingPrevious: boolean;
  errors: Record<string, string>;
}

export default function RSVPFormFields({
  name,
  setName,
  status,
  setStatus,
  guests,
  setGuests,
  blessing,
  setBlessing,
  isNameLocked,
  isSubmitting,
  isLoadingPrevious,
  errors,
}: RSVPFormFieldsProps) {
  const isDisabled = isSubmitting || isLoadingPrevious;

  return (
    <div className="space-y-6">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          שם מלא
        </label>
        {isNameLocked ? (
          <div className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-700 text-right">
            {name || "טוען..."}
            <span className="text-xs text-gray-500 block mt-1">
              (שם נטען אוטומטית מהקישור)
            </span>
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-4 border rounded-xl bg-white focus:ring-2 focus:border-transparent transition-all text-right ${
                errors.name
                  ? "border-red-300 focus:ring-red-300"
                  : "border-gray-300 focus:ring-pink-300"
              }`}
              required
              disabled={isDisabled}
              placeholder="הזן את שמך המלא"
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 text-right"
              >
                {errors.name}
              </motion.p>
            )}
          </div>
        )}
      </div>

      {/* Status Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          סטטוס הגעה
        </label>
        <select
          value={status}
          onChange={(e) => {
            const newStatus = e.target.value as RsvpStatus;
            setStatus(newStatus);
            // אם הסטטוס הוא "no", הגדר מספר אורחים ל-0
            if (newStatus === "no") {
              setGuests(0);
            } else if (guests === 0) {
              // אם הסטטוס השתנה מ"no" למשהו אחר ומספר האורחים הוא 0, הגדר ל-1
              setGuests(1);
            }
          }}
          className={`w-full p-4 border rounded-xl bg-white focus:ring-2 focus:border-transparent transition-all text-right ${
            errors.status
              ? "border-red-300 focus:ring-red-300"
              : "border-gray-300 focus:ring-pink-300"
          }`}
          disabled={isDisabled}
        >
          <option value="yes">מגיע</option>
          <option value="maybe">אולי</option>
          <option value="no">לא מגיע</option>
        </select>
        {errors.status && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-2 text-right"
          >
            {errors.status}
          </motion.p>
        )}
      </div>

      {/* Guests Field - Conditional */}
      <AnimatePresence mode="wait" key="guestsContainer">
        {(status === "yes" || status === "maybe") && (
          <motion.div
            key="guests"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              מספר אורחים (כולל אותך)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={guests || ""}
              onChange={(e) => {
                const value = e.target.value;
                const newGuests = value === "" ? 1 : Math.max(1, Number(value));
                setGuests(newGuests);
              }}
              className={`w-full p-4 border rounded-xl bg-white focus:ring-2 focus:border-transparent transition-all text-right ${
                errors.guests
                  ? "border-red-300 focus:ring-red-300"
                  : "border-gray-300 focus:ring-pink-300"
              }`}
              disabled={isDisabled}
            />
            {errors.guests && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 text-right"
              >
                {errors.guests}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Message for "no" status */}
        {status === "no" && (
          <motion.div
            key="not-coming-message"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border border-gray-300 rounded-xl bg-gray-50 text-center"
          >
            <p className="text-gray-600 text-sm">
              מספר אורחים הוגדר אוטומטית ל-0
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blessing Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ברכה (לא חובה)
        </label>
        <textarea
          value={blessing}
          onChange={(e) => setBlessing(e.target.value)}
          className={`w-full p-4 border rounded-xl bg-white focus:ring-2 focus:border-transparent transition-all text-right resize-none ${
            errors.blessing
              ? "border-red-300 focus:ring-red-300"
              : "border-gray-300 focus:ring-pink-300"
          }`}
          rows={4}
          disabled={isDisabled}
          placeholder="כתוב ברכה לבני הזוג..."
        />
        {errors.blessing && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-2 text-right"
          >
            {errors.blessing}
          </motion.p>
        )}
      </div>
    </div>
  );
}
