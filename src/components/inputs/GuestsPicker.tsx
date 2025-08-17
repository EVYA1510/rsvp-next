"use client";

import React from "react";

interface GuestsPickerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function GuestsPicker({
  value,
  onChange,
  min = 0,
  max = 10,
  disabled = false,
}: GuestsPickerProps) {
  const handleIncrement = () => {
    if (!disabled && value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (!disabled && value > min) {
      onChange(value - 1);
    }
  };

  const handleChipClick = (chipValue: number) => {
    if (!disabled && chipValue >= min && chipValue <= max) {
      onChange(chipValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const newValue = parseInt(e.target.value) || 0;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  const isMinDisabled = disabled || value <= min;
  const isMaxDisabled = disabled || value >= max;

  return (
    <div data-testid="guests-picker" className="space-y-3">
      {/* Stepper Controls */}
      <div className="flex items-center justify-center space-x-4 space-x-reverse">
        <button
          type="button"
          data-testid="guests-dec"
          onClick={handleDecrement}
          disabled={isMinDisabled}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isMinDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
          aria-label="הפחת אורח"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <input
          type="number"
          data-testid="guests-input"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          disabled={disabled}
          className="w-16 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          aria-label="מספר אורחים"
        />

        <button
          type="button"
          data-testid="guests-inc"
          onClick={handleIncrement}
          disabled={isMaxDisabled}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isMaxDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
          aria-label="הוסף אורח"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Quick Chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {[0, 1, 2, 3, 4, 5].map((chipValue) => (
          <button
            key={chipValue}
            type="button"
            data-testid={`guests-chip-${chipValue}`}
            onClick={() => handleChipClick(chipValue)}
            disabled={disabled || chipValue < min || chipValue > max}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              value === chipValue
                ? "bg-blue-600 text-white"
                : disabled || chipValue < min || chipValue > max
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            }`}
            aria-label={`${chipValue} אורחים`}
          >
            {chipValue}
          </button>
        ))}
      </div>
    </div>
  );
}
