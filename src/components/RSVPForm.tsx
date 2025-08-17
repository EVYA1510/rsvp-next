"use client";

import React, { useCallback } from "react";
import { useRSVPForm } from "@/hooks/useRSVPForm";
import RSVPFormFields from "./forms/RSVPFormFields";
import RSVPSuccessMessage from "./forms/RSVPSuccessMessage";
import Confetti from "./Confetti";

export default function RSVPForm() {
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
  } = useRSVPForm();

  // Trigger confetti when status is "yes"
  const shouldTriggerConfetti = formData.status === "yes";

  // Debounced submit handler
  const debouncedSubmit = useCallback(() => {
    if (!isSubmitting) {
      handleSubmit();
    }
  }, [handleSubmit, isSubmitting]);

  if (submitted || isAlreadySubmitted) {
    return (
      <RSVPSuccessMessage
        name={formData.name}
        status={formData.status}
        guests={formData.guests}
        blessing={formData.blessing}
        onReset={handleReset}
        isAlreadySubmitted={isAlreadySubmitted}
        reportId={reportId}
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
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
