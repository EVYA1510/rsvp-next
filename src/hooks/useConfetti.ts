import { useState, useCallback } from "react";

export type ConfettiIntensity = "low" | "medium" | "high";
export type ConfettiType = "default" | "success" | "navigation" | "calendar" | "scroll";

interface UseConfettiReturn {
  isActive: boolean;
  trigger: (duration?: number, intensity?: ConfettiIntensity, type?: ConfettiType) => void;
  triggerSuccess: () => void;
  triggerNavigation: () => void;
  triggerCalendar: () => void;
  triggerScroll: () => void;
}

export function useConfetti(): UseConfettiReturn {
  const [isActive, setIsActive] = useState(false);

  const trigger = useCallback((
    duration = 6000,
    intensity: ConfettiIntensity = "high",
    type: ConfettiType = "default"
  ) => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), duration);
  }, []);

  const triggerSuccess = useCallback(() => {
    trigger(8000, "high", "success");
  }, [trigger]);

  const triggerNavigation = useCallback(() => {
    trigger(4000, "medium", "navigation");
  }, [trigger]);

  const triggerCalendar = useCallback(() => {
    trigger(5000, "medium", "calendar");
  }, [trigger]);

  const triggerScroll = useCallback(() => {
    trigger(3000, "low", "scroll");
  }, [trigger]);

  return {
    isActive,
    trigger,
    triggerSuccess,
    triggerNavigation,
    triggerCalendar,
    triggerScroll,
  };
}
