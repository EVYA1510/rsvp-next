"use client";

import React from "react";
import { RsvpFormData, RsvpStatus } from "@/lib/validations";
import GuestsPicker from "../inputs/GuestsPicker";

interface RSVPFormFieldsProps {
  formData: RsvpFormData;
  setFormData: (data: Partial<RsvpFormData>) => void;
  nameFromURL: string | null;
  isNameLocked: boolean;
}

export default function RSVPFormFields({
  formData,
  setFormData,
  nameFromURL,
  isNameLocked,
}: RSVPFormFieldsProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNameLocked) {
      setFormData({ name: e.target.value });
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as RsvpStatus;
    setFormData({
      status: newStatus,
      guests: newStatus === "yes" ? Math.max(1, formData.guests) : 0,
    });
  };

  const handleGuestsChange = (guests: number) => {
    setFormData({ guests });
  };

  const handleBlessingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ blessing: e.target.value });
  };

  return (
    <div className="space-y-6">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          שם מלא *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleNameChange}
          disabled={isNameLocked}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            isNameLocked
              ? "bg-gray-100 text-gray-600 cursor-not-allowed"
              : "bg-white text-gray-900"
          }`}
          placeholder="הזן את שמך המלא"
          required
        />
        {isNameLocked && nameFromURL && (
          <p className="mt-1 text-sm text-blue-600">
            👋 שלום {nameFromURL}! השם נטען אוטומטית מהקישור
          </p>
        )}
      </div>

      {/* Status Field */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          האם תגיע לחתונה? *
        </label>
        <select
          id="status"
          data-testid="status-select"
          value={formData.status}
          onChange={handleStatusChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          required
        >
          <option value="yes">מגיע</option>
          <option value="maybe">אולי</option>
          <option value="no">לא מגיע</option>
        </select>
      </div>

      {/* Guests Field */}
      {formData.status === "yes" && (
        <div>
          <label
            htmlFor="guests"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            מספר אורחים *
          </label>
          <GuestsPicker
            value={formData.guests}
            onChange={handleGuestsChange}
            min={1}
            max={10}
          />
          <p className="mt-1 text-sm text-gray-500">כולל אותך</p>
        </div>
      )}

      {/* Blessing Field */}
      <div>
        <label
          htmlFor="blessing"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          ברכה (אופציונלי)
        </label>
        <textarea
          id="blessing"
          data-testid="blessing-input"
          value={formData.blessing || ""}
          onChange={handleBlessingChange}
          rows={3}
          maxLength={500}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 resize-none"
          placeholder="כתוב ברכה לזוג הצעיר..."
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.blessing?.length || 0}/500 תווים
        </p>
      </div>
    </div>
  );
}
