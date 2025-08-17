import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import { RsvpFormData, validateRsvpForm, isGasOk } from "@/lib/validations";
import {
  getSavedReportId,
  saveReportId,
  clearReportId,
  saveFullRSVPData,
  clearFullRSVPData,
} from "@/utils/localStorageHelpers";

interface UseRSVPFormReturn {
  formData: RsvpFormData;
  setFormData: (data: Partial<RsvpFormData>) => void;
  submitted: boolean;
  isSubmitting: boolean;
  nameFromURL: string | null;
  isNameLocked: boolean;
  submitMessage: string;
  isFormReady: boolean;
  isAlreadySubmitted: boolean;
  reportId: string | null;
  handleSubmit: () => Promise<void>;
  handleReset: () => void;
  setAlreadySubmitted: (reportId: string) => void;
}

export function useRSVPForm(): UseRSVPFormReturn {
  const [formData, setFormDataState] = useState<RsvpFormData>({
    name: "",
    status: "yes",
    guests: 1,
    blessing: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [isFormReady, setIsFormReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);

  // Get name from URL parameter
  const [nameFromURL, setNameFromURL] = useState<string | null>(null);
  const [isNameLocked, setIsNameLocked] = useState(false);
  const loadedFromUrl = useRef(false);

  // Simplified data loading - bootstrap handles the heavy lifting
  useEffect(() => {
    if (!loadedFromUrl.current) {
      const params = new URLSearchParams(window.location.search);
      const n = params.get("name");
      if (n) {
        const cleanName = n.trim().replace(/\s+/g, " ");
        setNameFromURL(cleanName);
        setIsNameLocked(true);
        setFormDataState((prev) => ({ ...prev, name: cleanName }));
        console.log("Name loaded from URL:", cleanName);
      }
      loadedFromUrl.current = true;
    }
    setIsInitialized(true);
  }, []);

  // Track visit once per session
  useEffect(() => {
    if (!isInitialized || sessionStorage.getItem("visit_tracked")) return;

    const reportId = getSavedReportId();
    const currentName = formData.name || nameFromURL || "Anonymous";

    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: currentName,
        device: navigator.userAgent,
        reportId,
      }),
    }).finally(() => sessionStorage.setItem("visit_tracked", "1"));
  }, [isInitialized, formData.name, nameFromURL]);

  // Check if form is ready
  useEffect(() => {
    if (!isInitialized) return;

    const isReady =
      formData.name.trim().length > 0 && // יש שם
      Object.keys(errors).length === 0; // אין שגיאות

    console.log("isFormReady check:", {
      nameLength: formData.name.trim().length,
      errorsCount: Object.keys(errors).length,
      isReady,
    });

    setIsFormReady(isReady);
  }, [isInitialized, formData.name, errors]);

  // Validate form
  const validateForm = useCallback(() => {
    try {
      validateRsvpForm(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      if (error.errors) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [formData]);

  // Set form data
  const setFormData = useCallback((data: Partial<RsvpFormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!isFormReady || isSubmitting) {
      console.log("Form not ready or already submitting");
      return;
    }

    if (!validateForm()) {
      toast.error("יש שגיאות בטופס. אנא תקן אותן ונסה שוב.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const submissionName = formData.name.trim();
      const finalStatus = formData.status;
      const finalGuests =
        finalStatus === "yes" ? Math.max(1, formData.guests) : 0;

      const payload = {
        name: submissionName,
        status: finalStatus,
        guests: finalGuests,
        blessing: formData.blessing || "",
        reportId: reportId || getSavedReportId() || "",
      };

      console.log("Submitting RSVP with data:", payload);

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (!isGasOk(data)) {
        throw new Error(data?.message || "Submit failed");
      }

      if (data.reportId) {
        saveReportId(data.reportId);
        setReportId(data.reportId);

        // Save full RSVP data to localStorage
        saveFullRSVPData({
          reportId: data.reportId,
          name: formData.name,
          status: formData.status,
          guests: formData.guests,
          blessing: formData.blessing || "",
          savedAt: Date.now(),
        });
      } else if (reportId) {
        // If we already have a reportId, save the current data
        saveFullRSVPData({
          reportId: reportId,
          name: formData.name,
          status: formData.status,
          guests: formData.guests,
          blessing: formData.blessing || "",
          savedAt: Date.now(),
        });
      }

      setSubmitted(true);
      setIsAlreadySubmitted(true);
      toast.success("האישור נשלח בהצלחה! 🎉");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("אירעה שגיאה בשליחת האישור. אנא נסה שוב.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, isFormReady, isSubmitting, reportId]);

  // Set already submitted state (for bootstrap integration)
  const setAlreadySubmitted = useCallback((newReportId: string) => {
    setIsAlreadySubmitted(true);
    setReportId(newReportId);
  }, []);

  // Handle form reset
  const handleReset = useCallback(() => {
    setSubmitted(false);
    setIsAlreadySubmitted(false);
    setReportId(null);
    setFormDataState({
      name: nameFromURL || "", // Keep name from URL if exists
      status: "yes",
      guests: 1,
      blessing: "",
    });
    setErrors({});
    setSubmitMessage("");
    clearReportId();
    clearFullRSVPData();
    toast.success("הטופס אופס מחדש");
  }, [nameFromURL]);

  return {
    formData,
    setFormData,
    submitted,
    isSubmitting,
    nameFromURL,
    isNameLocked,
    submitMessage,
    isFormReady,
    isAlreadySubmitted,
    reportId,
    handleSubmit,
    handleReset,
    setAlreadySubmitted,
  };
}
