import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import { RsvpFormData, validateRsvpForm, isGasOk } from "@/lib/validations";
import {
  getSavedReportId,
  saveReportId,
  clearReportId,
  saveFullRSVPData,
  loadFullRSVPData,
  getURLId,
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

  // Load data on mount - from URL ID or localStorage
  useEffect(() => {
    const loadData = async () => {
      const urlId = getURLId();

      if (urlId) {
        // Load from GAS via API
        try {
          console.log("Loading RSVP data from URL ID:", urlId);
          const response = await fetch(
            `/api/rsvp?id=${encodeURIComponent(urlId)}`
          );

          if (response.ok) {
            const data = await response.json();
            console.log("RSVP data loaded from GAS:", data);

            if (data.success && data.data) {
              const rsvpData = data.data;
              setFormDataState({
                name: rsvpData.name || "",
                status: rsvpData.status || "yes",
                guests: rsvpData.guests || 1,
                blessing: rsvpData.blessing || "",
              });
              setReportId(rsvpData.reportId || urlId);
              setIsAlreadySubmitted(true);

              // Save to localStorage for future use
              saveFullRSVPData({
                reportId: rsvpData.reportId || urlId,
                name: rsvpData.name || "",
                status: rsvpData.status || "yes",
                guests: rsvpData.guests || 1,
                blessing: rsvpData.blessing || "",
                savedAt: Date.now(),
              });

              return;
            } else if (data.success && data.data === null) {
              console.warn("GAS returned null data - RSVP not found");
            } else if (data.error) {
              console.warn("GAS returned error:", data.error);
            } else if (data.name) {
              // Handle direct GAS response (without wrapper)
              console.log("Direct GAS response detected:", data);
              setFormDataState({
                name: data.name || "",
                status: data.status || "yes",
                guests: data.guests || 1,
                blessing: data.blessing || "",
              });
              setReportId(data.reportId || urlId);
              setIsAlreadySubmitted(true);

              // Save to localStorage for future use
              saveFullRSVPData({
                reportId: data.reportId || urlId,
                name: data.name || "",
                status: data.status || "yes",
                guests: data.guests || 1,
                blessing: data.blessing || "",
                savedAt: Date.now(),
              });

              return;
            } else {
              console.warn("Unexpected GAS response format:", data);
            }
          } else {
            console.warn(`GAS responded with status: ${response.status}`);
            try {
              const errorData = await response.json();
              console.warn("Error response data:", errorData);
            } catch (parseError) {
              console.warn("Could not parse error response");
            }
          }
      } catch (error) {
        console.error("Error loading RSVP data from GAS:", error);
        // Continue to localStorage fallback
      }
    }

      // Fallback to localStorage
      const savedData = loadFullRSVPData();
      if (savedData) {
        console.log("Loading RSVP data from localStorage:", savedData);
        setFormDataState({
          name: savedData.name,
          status: savedData.status,
          guests: savedData.guests,
          blessing: savedData.blessing || "",
        });
        setReportId(savedData.reportId);
        setIsAlreadySubmitted(true);
        return;
      }

      // Load name from URL parameter if no other data
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
    };

    loadData();
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
  };
}
