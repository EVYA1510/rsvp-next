import { useState, useEffect, useRef } from "react";
import {
  loadCachedRSVP,
  saveCachedRSVP,
  getURLName,
  getURLId,
  CachedRSVPData,
} from "@/utils/rsvpCache";

export type BootstrapPhase =
  | "initializing"
  | "hydrated"
  | "revalidating"
  | "complete"
  | "error";

interface UseRsvpBootstrapReturn {
  phase: BootstrapPhase;
  data: CachedRSVPData | null;
  nameFromURL: string | null;
  error: string | null;
  isReady: boolean;
}

export function useRsvpBootstrap(): UseRsvpBootstrapReturn {
  const [phase, setPhase] = useState<BootstrapPhase>("initializing");
  const [data, setData] = useState<CachedRSVPData | null>(null);
  const [nameFromURL, setNameFromURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Step 1: Hydrate immediately from cache and URL
        const cachedData = loadCachedRSVP();
        const urlName = getURLName();
        const urlId = getURLId();

        setNameFromURL(urlName);

        if (cachedData) {
          console.log("Bootstrap: Found cached data:", cachedData);
          setData(cachedData);
          setPhase("hydrated");
          // Immediately set to complete if we have cached data
          setTimeout(() => setPhase("complete"), 0);
        } else {
          console.log("Bootstrap: No cached data found");
          setPhase("hydrated");
        }

        // Step 2: Background revalidation if we have an ID
        if (urlId) {
          setPhase("revalidating");

          // Cancel any ongoing request
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }

          // Create new abort controller with timeout
          const controller = new AbortController();
          abortControllerRef.current = controller;

          const timeoutId = setTimeout(() => {
            controller.abort();
          }, 1800); // 1.8 second timeout

          try {
            const response = await fetch(
              `/api/rsvp?id=${encodeURIComponent(urlId)}`,
              {
                cache: "no-store",
                signal: controller.signal,
              }
            );

            clearTimeout(timeoutId);

            if (response.ok) {
              const result = await response.json();

              if (result.success && result.data) {
                const newData: CachedRSVPData = {
                  reportId: result.data.reportId || urlId,
                  name: result.data.name || "",
                  status: result.data.status || "yes",
                  guests: result.data.guests || 1,
                  blessing: result.data.blessing || "",
                  updatedAt: Date.now(),
                };

                setData(newData);
                saveCachedRSVP(newData);
                setPhase("complete");
              } else {
                // No data found, clear cache if we had cached data
                if (cachedData) {
                  setData(null);
                }
                setPhase("complete");
              }
            } else {
              console.warn("RSVP API returned error:", response.status);
              setPhase("complete");
            }
          } catch (fetchError) {
            clearTimeout(timeoutId);

            if (
              fetchError instanceof Error &&
              fetchError.name === "AbortError"
            ) {
              console.log("RSVP fetch aborted due to timeout");
            } else {
              console.warn("RSVP fetch failed:", fetchError);
            }

            // Stay with cached data if available, otherwise stay empty
            setPhase("complete");
          }
        } else {
          setPhase("complete");
        }
      } catch (error) {
        console.error("Bootstrap error:", error);
        setError("Failed to load RSVP data");
        setPhase("error");
      }
    };

    bootstrap();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    phase,
    data,
    nameFromURL,
    error,
    isReady: phase === "hydrated" || phase === "complete",
  };
}
