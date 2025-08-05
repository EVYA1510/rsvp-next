"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faWaze } from "@fortawesome/free-brands-svg-icons";
import WeddingCard from "./ui/WeddingCard";

export default function WeddingActions() {
  const openWaze = () => {
    // Waze navigation to אולמי הרמוניה, רחובות
    const wazeUrl =
      "https://waze.com/ul?q=אולמי%20הרמוניה%2C%20רחובות%2C%20ישראל&navigate=yes";
    window.open(wazeUrl, "_blank");
  };

  const addToCalendar = () => {
    // Google Calendar event link
    const eventDetails = {
      text: "החתונה של אביתר ושובל",
      dates: "20250909T180000/20250909T230000",
      details:
        "הזמנה לחתונה של אביתר ושובל\n\nמיקום: אולמי הרמוניה, רחובות\n\nנשמח לראותכם ביום הגדול שלנו!",
      location: "אולמי הרמוניה, רחובות, ישראל",
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventDetails.text
    )}&dates=${eventDetails.dates}&details=${encodeURIComponent(
      eventDetails.details
    )}&location=${encodeURIComponent(eventDetails.location)}`;

    window.open(googleCalendarUrl, "_blank");
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
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

  return (
    <WeddingCard>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-pink-700 mb-8">פעולות נוספות</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Waze Navigation Button */}
          <motion.button
            onClick={openWaze}
            className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white py-8 px-6 rounded-2xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:shadow-xl"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faWaze} />
              </div>
              <div className="font-bold text-lg">נווט עם Waze</div>
              <div className="text-sm opacity-80 mt-2">
                ניווט לאולמי הרמוניה
              </div>
            </div>
          </motion.button>

          {/* Add to Calendar Button */}
          <motion.button
            onClick={addToCalendar}
            className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white py-8 px-6 rounded-2xl shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:shadow-xl"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faCalendar} />
              </div>
              <div className="font-bold text-lg">הוסף ליומן</div>
              <div className="text-sm opacity-80 mt-2">
                הוסף את התאריך ליומן שלך
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </WeddingCard>
  );
}
