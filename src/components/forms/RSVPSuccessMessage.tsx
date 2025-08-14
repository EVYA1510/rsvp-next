"use client";

import { motion } from "framer-motion";
import WeddingCard from "../ui/WeddingCard";
import { RsvpStatus } from "@/lib/validations";

interface RSVPSuccessMessageProps {
  name: string;
  status: RsvpStatus;
  guests: number;
  blessing: string;
  onReset: () => void;
}

export default function RSVPSuccessMessage({
  name,
  status,
  guests,
  blessing,
  onReset,
}: RSVPSuccessMessageProps) {
  const getSuccessMessage = () => {
    switch (status) {
      case "maybe":
        return {
          title: "מקווים שתוכלו להגיע",
          subtitle: `תודה ${name}! עדכנו אותנו על מצב ההגעה שלכם.`,
          icon: "🎈",
        };
      case "no":
        return {
          title: "תודה על העדכון",
          subtitle: `תודה ${name}! העדכון שלך התקבל בהצלחה.`,
          icon: "💌",
        };
      default:
        return {
          title: "תודה רבה על אישור ההגעה!",
          subtitle: `תודה ${name}! אישור ההגעה שלך התקבל בהצלחה.`,
          icon: "🎉",
        };
    }
  };

  const successMessage = getSuccessMessage();

  return (
    <WeddingCard variant="gradient">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-6xl mb-6"
        >
          {successMessage.icon}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-green-800 mb-3"
        >
          {successMessage.title}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-700 mb-8"
        >
          {successMessage.subtitle}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
        >
          <div className="text-sm text-green-700">
            <div className="font-semibold mb-2">פרטי האישור שלך:</div>
            <div>שם: {name}</div>
            <div>סטטוס: {status === "yes" ? "מגיע" : status === "maybe" ? "אולי" : "לא מגיע"}</div>
            {status !== "no" && <div>מספר אורחים: {guests}</div>}
            {blessing && <div className="mt-2">ברכה: {blessing}</div>}
          </div>
        </motion.div>

        <motion.button
          onClick={onReset}
          className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          לעדכן את הפרטים שלי שוב
        </motion.button>
      </div>
    </WeddingCard>
  );
}
