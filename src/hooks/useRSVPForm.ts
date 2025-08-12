import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { RSVPFormData, safeValidateRSVPForm } from "@/lib/validations";
import {
  saveRSVPData,
  loadRSVPData,
  isAlreadySubmitted,
  getURLParams,
  getOrCreateGuestId,
  clearRSVPData,
} from "@/utils/localStorageHelpers";

interface UseRSVPFormReturn {
  // Form state
  formData: RSVPFormData;
  setFormData: (data: Partial<RSVPFormData>) => void;

  // UI state
  submitted: boolean;
  isSubmitting: boolean;
  isLoadingPrevious: boolean;
  nameFromURL: string | null;
  isNameLocked: boolean;
  submitMessage: string;

  // Validation
  errors: Record<string, string>;
  validateForm: () => boolean;

  // Actions
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleReset: () => void;
  checkPreviousRSVP: (guestName: string) => Promise<void>;
}

export function useRSVPForm(): UseRSVPFormReturn {
  // Form state
  const [formData, setFormDataState] = useState<RSVPFormData>({
    name: "",
    status: "מגיע",
    guests: 1,
    blessing: "",
  });

  // UI state
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);
  const [nameFromURL, setNameFromURL] = useState<string | null>(null);
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [guestId, setGuestId] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check previous RSVP function
  const checkPreviousRSVP = useCallback(async (guestName: string) => {
    if (!guestName.trim()) return;

    setIsLoadingPrevious(true);
    setSubmitMessage("");

    try {
      const response = await fetch(
        `/api/submit?name=${encodeURIComponent(guestName)}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.previousRSVP) {
          setSubmitMessage(
            `מצאנו אישור קודם שלך מ-${new Date(
              data.previousRSVP.timestamp
            ).toLocaleDateString("he-IL")}. תוכל לעדכן את הפרטים אם תרצה.`
          );
        }
      }
    } catch (error) {
      console.error("Error checking previous RSVP:", error);
    } finally {
      setIsLoadingPrevious(false);
    }
  }, []);

  // Initialize form
  useEffect(() => {
    const initializeForm = () => {
      try {
        // Get or create unique guest ID
        const id = getOrCreateGuestId();
        setGuestId(id);

        // Read URL parameters
        const urlParams = getURLParams();
        const urlName = urlParams.name;

        console.log("Initializing form with URL name:", urlName);
        console.log("URL params object:", urlParams);

        // If name comes from URL, lock it
        if (urlName && urlName.trim()) {
          setNameFromURL(urlName.trim());
          setIsNameLocked(true);
        }

        // Load from localStorage
        const savedData = loadRSVPData();
        console.log("Loaded data from localStorage:", savedData);

        // Set form data - prioritize URL name over localStorage
        // Ensure we don't lose the URL name if it exists
        const finalName =
          urlName && urlName.trim() ? urlName.trim() : savedData.name || "";
        const finalStatus = savedData.status || "מגיע";
        const finalGuests =
          finalStatus === "לא מגיע" ? 0 : savedData.guests || 1;

        console.log("Setting form data:", {
          name: finalName,
          status: finalStatus,
          guests: finalGuests,
          blessing: savedData.blessing || "",
        });

        setFormDataState({
          name: finalName,
          status: finalStatus,
          guests: finalGuests,
          blessing: savedData.blessing || "",
        });

        // Mark as initialized
        setIsInitialized(true);

        // Check if already submitted
        if (isAlreadySubmitted()) {
          setSubmitted(true);
        }

        // Check previous RSVP if we have a name
        if (finalName) {
          checkPreviousRSVP(finalName);
        }

        // Double-check that the name is properly set
        console.log("Final initialization check - name:", finalName);
        if (urlName && urlName.trim() && !finalName) {
          console.error("Name from URL was lost during initialization!");
          setFormDataState((prev) => ({ ...prev, name: urlName.trim() }));
        }
      } catch (error) {
        console.error("Error initializing form:", error);
        setIsInitialized(true);
      }
    };

    initializeForm();
  }, [checkPreviousRSVP]);

  // Auto-set guests to 0 when status is "לא מגיע"
  useEffect(() => {
    if (formData.status === "לא מגיע" && formData.guests > 0) {
      console.log("Auto-setting guests to 0 for status 'לא מגיע'");
      setFormDataState((prev) => ({ ...prev, guests: 0 }));
    }
  }, [formData.status]);

  // Save form data to localStorage
  useEffect(() => {
    if (!isInitialized) return;

    // Use URL name if form name is empty and we have a locked name
    const nameToSave =
      formData.name.trim() || (isNameLocked && nameFromURL ? nameFromURL : "");

    // Don't save if name is still empty
    if (!nameToSave) {
      console.log("Skipping save - no valid name available");
      return;
    }

    console.log("Saving form data to localStorage:", {
      ...formData,
      name: nameToSave,
    });
    saveRSVPData({
      name: nameToSave,
      status: formData.status,
      guests: formData.guests,
      blessing: formData.blessing || "",
    });
  }, [formData, isInitialized, isNameLocked, nameFromURL]);

  // Form data setter
  const setFormData = useCallback(
    (data: Partial<RSVPFormData>) => {
      console.log("Setting form data:", data);
      setFormDataState((prev) => {
        const newData = { ...prev, ...data };

        // Ensure we don't clear the name if it's locked (from URL)
        if (isNameLocked && (data.name === "" || data.name === undefined)) {
          newData.name = prev.name || nameFromURL || "";
        }

        console.log("New form data:", newData);
        return newData;
      });
    },
    [isNameLocked, nameFromURL]
  );

  // Validation function
  const validateForm = useCallback((): boolean => {
    console.log("Validating form data:", formData);
    const validation = safeValidateRSVPForm(formData);

    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      console.log("Validation errors:", newErrors);
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      console.log("Form submission started with data:", formData);
      console.log("Form data name field:", formData.name);
      console.log("Form data name length:", formData.name.length);
      console.log("Form data name trimmed:", formData.name.trim());
      console.log(
        "Form data name trimmed length:",
        formData.name.trim().length
      );

      if (!validateForm()) {
        toast.error("יש שגיאות בטופס. אנא תקן אותן ונסה שוב.");
        return;
      }

      if (!guestId) {
        toast.error("שגיאה: לא נמצא מזהה אורח. אנא רענן את הדף ונסה שוב.");
        return;
      }

      setIsSubmitting(true);

      try {
        const timestamp = new Date().toISOString();
        const urlParams = new URLSearchParams();

        // Ensure we have a valid name - use URL name if form name is empty
        const submissionName = formData.name.trim() || nameFromURL || "";

        // Validate the submission name
        if (!submissionName || submissionName.trim().length < 2) {
          toast.error("שם לא תקין. אנא הזן שם תקין.");
          return;
        }

        // Ensure all required fields are properly encoded
        urlParams.append("name", submissionName);
        urlParams.append("status", formData.status);
        urlParams.append("guests", formData.guests.toString());
        urlParams.append("blessing", formData.blessing || "");
        urlParams.append("timestamp", timestamp);
        urlParams.append("id", guestId);

        console.log("Submitting RSVP with data:", {
          name: submissionName,
          status: formData.status,
          guests: formData.guests,
          blessing: formData.blessing || "",
          timestamp,
          id: guestId,
        });

        const response = await fetch(`/api/submit?${urlParams.toString()}`, {
          method: "POST",
        });

        if (response.ok) {
          const result = await response.json();

          if (result.success) {
            setSubmitted(true);
            saveRSVPData({ submitted: true });
            toast.success("האישור נשלח בהצלחה! 🎉");
          } else {
            throw new Error(result.error || "שגיאה בשליחת האישור");
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "שגיאה בשליחת האישור");
        }
      } catch (error) {
        console.error("Submission error:", error);
        toast.error("אירעה שגיאה בשליחת האישור. אנא נסה שוב.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, guestId, validateForm, nameFromURL]
  );

  // Handle form reset
  const handleReset = useCallback(() => {
    setSubmitted(false);
    setFormDataState({
      name: "",
      status: "מגיע",
      guests: 1,
      blessing: "",
    });
    setErrors({});
    setSubmitMessage("");
    clearRSVPData();
    toast.success("הטופס אופס מחדש");
  }, []);

  return {
    formData,
    setFormData,
    submitted,
    isSubmitting,
    isLoadingPrevious,
    nameFromURL,
    isNameLocked,
    submitMessage,
    errors,
    validateForm,
    handleSubmit,
    handleReset,
    checkPreviousRSVP,
  };
}
