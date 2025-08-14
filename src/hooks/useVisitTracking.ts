"use client";

import { useEffect, useRef } from "react";
import { getURLParams } from "@/utils/localStorageHelpers";

interface VisitData {
  name: string;
  timestamp: string;
  userAgent: string;
  deviceType: "mobile" | "desktop" | "tablet";
  referrer: string;
  url: string;
}

export function useVisitTracking() {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per session
    if (hasTracked.current) return;

    const trackVisit = async () => {
      try {
        const urlParams = getURLParams();
        const name = urlParams.name;

        // Only track if we have a name parameter
        if (!name || !name.trim()) {
          console.log("No name parameter found, skipping visit tracking");
          return;
        }

        // Detect device type
        const userAgent = navigator.userAgent;
        let deviceType: "mobile" | "desktop" | "tablet" = "desktop";

        if (
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            userAgent
          )
        ) {
          deviceType = /iPad|Android(?=.*\bMobile\b)(?!.*\bTV\b)/i.test(
            userAgent
          )
            ? "tablet"
            : "mobile";
        }

        const visitData: VisitData = {
          name: decodeURIComponent(name),
          timestamp: new Date().toISOString(),
          userAgent: userAgent,
          deviceType,
          referrer: document.referrer || "",
          url: window.location.href,
        };

        console.log("Tracking visit:", visitData);

        // Send visit data to Google Apps Script
        const response = await fetch("/api/track-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visitData),
        });

        if (response.ok) {
          console.log("Visit tracked successfully");
          hasTracked.current = true;
        } else {
          console.error("Failed to track visit:", response.status);
        }
      } catch (error) {
        console.error("Error tracking visit:", error);
        // Don't throw error - tracking should not break the main functionality
      }
    };

    // Track visit after a short delay to ensure page is fully loaded
    const timer = setTimeout(trackVisit, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { hasTracked: hasTracked.current };
}

