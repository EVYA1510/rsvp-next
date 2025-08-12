import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";

// Simple wrapper without theme provider for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data for tests
export const mockRSVPData = {
  name: "אביתר כהן",
  status: "מגיע" as const,
  guests: 2,
  blessing: "מזל טוב!",
  timestamp: "2024-01-15T10:30:00.000Z",
  id: "rsvp_123_abc123",
};

export const mockFormData = {
  name: "שובל לוי",
  status: "אולי" as const,
  guests: 1,
  blessing: "",
};

export const mockURLParams = {
  name: "אביתר כהן",
  id: "rsvp_123_abc123",
};

// Test helpers
export const fillForm = async (user: any, formData: typeof mockFormData) => {
  const nameInput = document.querySelector(
    'input[name="name"]'
  ) as HTMLInputElement;
  const statusSelect = document.querySelector(
    'select[name="status"]'
  ) as HTMLSelectElement;
  const guestsInput = document.querySelector(
    'input[name="guests"]'
  ) as HTMLInputElement;
  const blessingTextarea = document.querySelector(
    'textarea[name="blessing"]'
  ) as HTMLTextAreaElement;

  if (nameInput) {
    await user.type(nameInput, formData.name);
  }

  if (statusSelect) {
    await user.selectOptions(statusSelect, formData.status);
  }

  if (guestsInput) {
    await user.clear(guestsInput);
    await user.type(guestsInput, formData.guests.toString());
  }

  if (blessingTextarea) {
    await user.type(blessingTextarea, formData.blessing);
  }
};

export const submitForm = async (user: any) => {
  const submitButton = document.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement;
  if (submitButton) {
    await user.click(submitButton);
  }
};

// Mock API responses
export const mockAPIResponses = {
  success: {
    success: true,
    message: "האישור נשלח בהצלחה!",
    data: mockRSVPData,
  },
  error: {
    success: false,
    error: "שגיאה בשליחת האישור",
  },
  previousRSVP: {
    success: true,
    previousRSVP: {
      ...mockRSVPData,
      timestamp: "2024-01-10T10:30:00.000Z",
    },
  },
};

// Export everything from testing library
export * from "@testing-library/react";
export { customRender as render };
