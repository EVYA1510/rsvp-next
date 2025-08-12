"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Icon from "./Icon";
import { toast } from "react-hot-toast";

interface WazeButtonProps {
  className?: string;
}

export default function WazeButton({ className = "" }: WazeButtonProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  const openWaze = async () => {
    setIsNavigating(true);

    // 1. Show first toast in Hebrew
    toast("Opening Waze for you – everything is ready to go 😊", {
      duration: 3000,
      position: "top-center",
    });

    const coordinates = "31.902997,34.789722";
    const wazeAppUrl = `waze://?ll=${coordinates}&navigate=yes`;
    const wazeWebUrl = `https://waze.com/ul?ll=${coordinates}&navigate=yes`;

    let hasRedirected = false;

    // 2. Try to open native Waze app
    try {
      window.location.href = wazeAppUrl;
    } catch (error) {
      console.error("Failed to open native Waze app:", error);
    }

    // 3. After 1.5 seconds, if user hasn't been redirected, open web version
    setTimeout(() => {
      if (!hasRedirected) {
        window.open(wazeWebUrl, "_blank");
        setIsNavigating(false);
      }
    }, 1500);

    // 4. After 3 seconds, show error toast if user is still on the site
    setTimeout(() => {
      if (!hasRedirected) {
        toast.error("לא הצלחנו לפתוח את Waze. נסה לפתוח את האפליקציה ידנית.", {
          duration: 4000,
          position: "top-center",
        });
        setIsNavigating(false);
      }
    }, 3000);

    // Check if user has been redirected (this is a simplified approach)
    // In a real implementation, you might want to track this more precisely
    const checkRedirect = () => {
      if (document.hidden || document.visibilityState === "hidden") {
        hasRedirected = true;
      }
    };

    document.addEventListener("visibilitychange", checkRedirect);

    // Cleanup
    setTimeout(() => {
      document.removeEventListener("visibilitychange", checkRedirect);
    }, 5000);
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
    <motion.div className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.button
        onClick={openWaze}
        disabled={isNavigating}
        className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        title="Navigate with Waze"
      >
        <Icon
          name="waze"
          className={`text-2xl ${isNavigating ? "animate-pulse" : ""}`}
        />
      </motion.button>
      <span className="text-sm font-medium text-gray-700">נווט</span>
    </motion.div>
  );
}
