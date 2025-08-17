"use client";

import React, { useCallback, useEffect } from "react";
import { useRSVPForm } from "@/hooks/useRSVPForm";
import { useRsvpBootstrap } from "@/hooks/useRsvpBootstrap";
import RSVPFormFields from "./forms/RSVPFormFields";
import RSVPSuccessMessage from "./forms/RSVPSuccessMessage";
import { RSVPSkeleton } from "./ui/Skeleton";
import Confetti from "./Confetti";

export default function RSVPForm() {
  const {
    phase,
    data: bootstrapData,
    error: bootstrapError,
    isReady: bootstrapReady,
  } = useRsvpBootstrap();

  const {
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
  } = useRSVPForm();

  // Integrate bootstrap data with form state
  useEffect(() => {
    if (bootstrapData) {
      console.log("RSVPForm: Setting form data from bootstrap:", bootstrapData);
      setFormData({
        name: bootstrapData.name,
        status: bootstrapData.status,
        guests: bootstrapData.guests,
        blessing: bootstrapData.blessing || "",
      });

      // Set already submitted state if we have bootstrap data
      setAlreadySubmitted(bootstrapData.reportId);
    }
  }, [bootstrapData, setFormData, setAlreadySubmitted]);

  // Force re-render when bootstrap data changes
  useEffect(() => {
    if (bootstrapData && bootstrapReady) {
      console.log("RSVPForm: Bootstrap ready with data, forcing update");
      // This will trigger a re-render
    }
  }, [bootstrapData, bootstrapReady]);

  // Trigger confetti when status is "yes"
  const shouldTriggerConfetti = formData.status === "yes";

  // Debounced submit handler
  const debouncedSubmit = useCallback(() => {
    if (!isSubmitting) {
      handleSubmit();
    }
  }, [handleSubmit, isSubmitting]);

  // Show skeleton while initializing
  if (!bootstrapReady) {
    return <RSVPSkeleton />;
  }

  // Show error state if bootstrap failed
  if (bootstrapError) {
    return (
      <div className="w-full max-w-md mx-auto text-center p-6">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          <p className="font-medium">שגיאה בטעינת הנתונים</p>
          <p className="text-sm mt-1">{bootstrapError}</p>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log("RSVPForm render:", {
    bootstrapData,
    phase,
    isAlreadySubmitted,
    submitted,
    formData,
  });

  // Show success message if submitted or already submitted
  if (submitted || isAlreadySubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        {/* Sync indicator */}
        {phase === "revalidating" && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center text-sm text-blue-600">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              מסנכרן...
            </div>
          </div>
        )}

        <RSVPSuccessMessage
          name={formData.name}
          status={formData.status}
          guests={formData.guests}
          blessing={formData.blessing}
          onReset={handleReset}
          isAlreadySubmitted={isAlreadySubmitted}
          reportId={reportId}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Sync indicator */}
      {phase === "revalidating" && (
        <div className="text-center mb-4">
          <div className="inline-flex items-center text-sm text-blue-600">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            מסנכרן...
          </div>
        </div>
      )}

      <form
        data-testid="rsvp-form"
        onSubmit={(e) => {
          e.preventDefault();
          debouncedSubmit();
        }}
        className="space-y-6"
      >
        <RSVPFormFields
          formData={formData}
          setFormData={setFormData}
          nameFromURL={nameFromURL}
          isNameLocked={isNameLocked}
        />

        {submitMessage && (
          <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
            {submitMessage}
          </div>
        )}

        <button
          type="submit"
          data-testid="submit-btn"
          disabled={!isFormReady || isSubmitting}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            !isFormReady || isSubmitting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {!isFormReady
            ? "טוען טופס..."
            : isSubmitting
            ? "שולח..."
            : "שלח אישור"}
        </button>
      </form>

      {shouldTriggerConfetti && <Confetti isActive={true} />}
    </div>
  );
}
