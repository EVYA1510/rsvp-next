"use client";

import { motion } from "framer-motion";
import Icon from "./Icon";
import toast from "react-hot-toast";

export default function CalendarButton() {
  const getOS = (): "iOS" | "Android" | "Other" => {
    const userAgent = navigator.userAgent;

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return "iOS";
    } else if (/Android/.test(userAgent)) {
      return "Android";
    } else {
      return "Other";
    }
  };

  const openGoogleCalendar = () => {
    const eventDetails = {
      text: "💍 החתונה של אביתר ושובל",
      dates: "20250909T190000/20250910T010000",
      details:
        "בואו לחגוג איתנו ערב חתונה קסום! 🎉\n🕖 תחילת האירוע: 19:00\n🕐 סיום האירוע: 01:00\n💖 אתם מוזמנים באהבה!",
      location: "גן אירועים הפרדס",
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventDetails.text
    )}&dates=${eventDetails.dates}&details=${encodeURIComponent(
      eventDetails.details
    )}&location=${encodeURIComponent(eventDetails.location)}`;

    window.open(googleCalendarUrl, "_blank");
  };

  // Fallback 1: Create and download ICS file directly
  const downloadICSFile = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:💍 החתונה של אביתר ושובל
DTSTART;TZID=Asia/Jerusalem:20250909T190000
DTEND;TZID=Asia/Jerusalem:20250910T010000
LOCATION:גן אירועים הפרדס
DESCRIPTION:בואו לחגוג איתנו ערב חתונה קסום! 🎉
🕖 תחילת האירוע: 19:00
🕐 סיום האירוע: 01:00
💖 אתם מוזמנים באהבה!
URL: https://rsvp-next.vercel.app
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "החתונה_של_אביתר_ושובל.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Fallback 2: Try data URL approach
  const openDataURL = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:💍 החתונה של אביתר ושובל
DTSTART;TZID=Asia/Jerusalem:20250909T190000
DTEND;TZID=Asia/Jerusalem:20250910T010000
LOCATION:גן אירועים הפרדס
DESCRIPTION:בואו לחגוג איתנו ערב חתונה קסום! 🎉
🕖 תחילת האירוע: 19:00
🕐 סיום האירוע: 01:00
💖 אתם מוזמנים באהבה!
URL: https://rsvp-next.vercel.app
END:VEVENT
END:VCALENDAR`;

    const dataUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(
      icsContent
    )}`;
    window.location.href = dataUrl;
  };

  // Enhanced Google Calendar with better Android support
  const openGoogleCalendarEnhanced = () => {
    const eventDetails = {
      text: "💍 החתונה של אביתר ושובל",
      dates: "20250909T190000/20250910T010000",
      details:
        "בואו לחגוג איתנו ערב חתונה קסום! 🎉\n🕖 תחילת האירוע: 19:00\n🕐 סיום האירוע: 01:00\n💖 אתם מוזמנים באהבה!",
      location: "גן אירועים הפרדס",
    };

    // Try to open in Google Calendar app first
    const googleCalendarAppUrl = `https://calendar.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(
      eventDetails.text
    )}&dates=${eventDetails.dates}&details=${encodeURIComponent(
      eventDetails.details
    )}&location=${encodeURIComponent(eventDetails.location)}`;

    // Try to open in app, fallback to web
    window.location.href = googleCalendarAppUrl;
  };

  const addToCalendar = () => {
    // Show friendly Hebrew toast message first
    toast("פותח את לוח השנה 🎉 רגע...", {
      icon: "📅",
      duration: 3000,
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        fontSize: "14px",
      },
    });

    // Small delay to show the toast before redirecting
    setTimeout(() => {
      const os = getOS();

      if (os === "iOS") {
        // iOS logic - keep ICS fallbacks
        try {
          // Method 1: Try webcal:// with main domain (working URL)
          const webcalUrl = "webcal://rsvp-next.vercel.app/wedding.ics";
          window.location.href = webcalUrl;

          // Method 2: Fallback to data URL after 1 second
          setTimeout(() => {
            openDataURL();
          }, 1000);

          // Method 3: Final fallback to download after 2 seconds
          setTimeout(() => {
            downloadICSFile();
          }, 2000);
        } catch (error) {
          console.error("iOS calendar integration failed:", error);
          // Fallback to Google Calendar
          openGoogleCalendar();
        }
      } else if (os === "Android") {
        // Android logic - Google Calendar only, no ICS fallbacks
        try {
          // Step 1: Try enhanced Google Calendar (app-first approach)
          openGoogleCalendarEnhanced();

          // Step 2: After 3 seconds, try regular Google Calendar as fallback
          setTimeout(() => {
            openGoogleCalendar();
          }, 3000);
        } catch (error) {
          console.error("Android calendar integration failed:", error);
          // Final fallback to Google Calendar web
          openGoogleCalendar();
        }
      } else {
        // Other (Desktop) - use Google Calendar
        openGoogleCalendar();
      }
    }, 500);
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

  return (
    <motion.div className="flex flex-col items-center gap-2">
      <motion.button
        onClick={addToCalendar}
        className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        title="Add to Calendar"
      >
        <Icon name="calendar" className="text-2xl" />
      </motion.button>
      <span className="text-sm font-medium text-gray-700">הוסף ליומן</span>
    </motion.div>
  );
}
