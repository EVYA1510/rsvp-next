"use client";

import React from "react";
import { RsvpStatus } from "@/lib/validations";

interface RSVPSuccessMessageProps {
  name: string;
  status: RsvpStatus;
  guests: number;
  blessing?: string;
  onReset: () => void;
  isAlreadySubmitted?: boolean;
  reportId?: string | null;
}

export default function RSVPSuccessMessage({
  name,
  status,
  guests,
  blessing,
  onReset,
  isAlreadySubmitted = false,
  reportId,
}: RSVPSuccessMessageProps) {
  const getStatusText = (status: RsvpStatus) => {
    switch (status) {
      case "yes":
        return "מגיע";
      case "maybe":
        return "אולי";
      case "no":
        return "לא מגיע";
      default:
        return status;
    }
  };

  const getStatusColor = (status: RsvpStatus) => {
    switch (status) {
      case "yes":
        return "text-green-600 bg-green-50 border-green-200";
      case "maybe":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "no":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  return (
    <div
      data-testid="confirmation-card"
      className="w-full max-w-md mx-auto text-center"
    >
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2
          data-testid="rsvp-card-title"
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          {isAlreadySubmitted ? `שלום ${name}! 👋` : `תודה ${name}! 🎉`}
        </h2>
        <p className="text-gray-600">
          {isAlreadySubmitted
            ? "האישור שלך כבר נשלח קודם לכן"
            : "האישור שלך נשלח בהצלחה"}
        </p>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          פרטי האישור שלך:
        </h3>

        <div className="space-y-3 text-right">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">שם:</span>
            <span data-testid="name-text" className="font-medium">
              {name}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">סטטוס:</span>
            <span
              data-testid="status-text"
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                status
              )}`}
            >
              {getStatusText(status)}
            </span>
          </div>

          {status === "yes" && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">מספר אורחים:</span>
              <span data-testid="guests-text" className="font-medium">
                {guests}
              </span>
            </div>
          )}

          {blessing && (
            <div className="text-right">
              <span className="text-gray-600 block mb-1">ברכה:</span>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md text-sm">
                {blessing}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <button
          data-testid="update-btn"
          onClick={onReset}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          עדכן אישור
        </button>

        <p className="text-sm text-gray-500">
          אם תרצה לשנות את הפרטים, לחץ על &quot;עדכן אישור&quot;
        </p>

        {reportId && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              מזהה אישור: {reportId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
