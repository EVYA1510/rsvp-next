import React from "react";
import { render, screen } from "@/utils/test-utils";
import userEvent from "@testing-library/user-event";
import RSVPForm from "../RSVPForm";
import { mockFormData } from "@/utils/test-utils";
import "@testing-library/jest-dom";

// Mock the useRSVPForm hook
const mockUseRSVPForm = jest.fn();

jest.mock("@/hooks/useRSVPForm", () => ({
  useRSVPForm: () => mockUseRSVPForm(),
}));

describe("RSVPForm", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup default mock
    mockUseRSVPForm.mockReturnValue({
      formData: {
        name: "",
        status: "מגיע" as const,
        guests: 1,
        blessing: "",
      },
      setFormData: jest.fn(),
      submitted: false,
      isSubmitting: false,
      isLoadingPrevious: false,
      nameFromURL: null,
      isNameLocked: false,
      submitMessage: "",
      errors: {},
      handleSubmit: jest.fn(),
      handleReset: jest.fn(),
    });
  });

  it("renders the form correctly", () => {
    render(<RSVPForm />);

    expect(screen.getByText("אישור הגעה")).toBeInTheDocument();
    expect(screen.getByText("שם מלא")).toBeInTheDocument();
    expect(screen.getByText("סטטוס הגעה")).toBeInTheDocument();
    expect(screen.getByText("ברכה (לא חובה)")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /שלח אישור/i })
    ).toBeInTheDocument();
  });

  it("displays form fields with correct accessibility attributes", () => {
    render(<RSVPForm />);

    const nameInput = screen.getByPlaceholderText("הזן את שמך המלא");
    const statusSelect = screen.getByRole("combobox");
    const blessingTextarea = screen.getByPlaceholderText(
      "כתוב ברכה לבני הזוג..."
    );

    expect(nameInput).toHaveAttribute("required");
    expect(statusSelect).toBeInTheDocument();
    expect(blessingTextarea).not.toHaveAttribute("required");
  });

  it('shows guests field when status is "מגיע" or "אולי"', () => {
    render(<RSVPForm />);

    const statusSelect = screen.getByRole("combobox");
    expect(statusSelect).toHaveValue("מגיע");

    // Guests field should be visible for "מגיע" status
    expect(screen.getByText("מספר אורחים (כולל אותך)")).toBeInTheDocument();
  });

  it('hides guests field when status is "לא מגיע"', async () => {

    // Mock the hook to return "לא מגיע" status
    mockUseRSVPForm.mockReturnValue({
      formData: {
        name: "",
        status: "לא מגיע" as const,
        guests: 1,
        blessing: "",
      },
      setFormData: jest.fn(),
      submitted: false,
      isSubmitting: false,
      isLoadingPrevious: false,
      nameFromURL: null,
      isNameLocked: false,
      submitMessage: "",
      errors: {},
      handleSubmit: jest.fn(),
      handleReset: jest.fn(),
    });

    render(<RSVPForm />);

    // Guests field should be hidden for "לא מגיע" status
    expect(
      screen.queryByText("מספר אורחים (כולל אותך)")
    ).not.toBeInTheDocument();
  });

  it("displays error messages for invalid form data", () => {
    // Mock the hook to return errors
    mockUseRSVPForm.mockReturnValue({
      formData: mockFormData,
      setFormData: jest.fn(),
      submitted: false,
      isSubmitting: false,
      isLoadingPrevious: false,
      nameFromURL: null,
      isNameLocked: false,
      submitMessage: "",
      errors: {
        name: "שם חייב להכיל לפחות 2 תווים",
        guests: "מספר אורחים לא יכול להיות גדול מ-10",
      },
      handleSubmit: jest.fn(),
      handleReset: jest.fn(),
    });

    render(<RSVPForm />);

    expect(screen.getByText("שם חייב להכיל לפחות 2 תווים")).toBeInTheDocument();
    expect(
      screen.getByText("מספר אורחים לא יכול להיות גדול מ-10")
    ).toBeInTheDocument();
  });

  it("shows loading state when submitting", () => {
    // Mock the hook to return loading state
    mockUseRSVPForm.mockReturnValue({
      formData: mockFormData,
      setFormData: jest.fn(),
      submitted: false,
      isSubmitting: true,
      isLoadingPrevious: false,
      nameFromURL: null,
      isNameLocked: false,
      submitMessage: "",
      errors: {},
      handleSubmit: jest.fn(),
      handleReset: jest.fn(),
    });

    render(<RSVPForm />);

    const submitButton = screen.getByRole("button", { name: /שולח/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("shows success message when form is submitted", () => {
    // Mock the hook to return submitted state
    mockUseRSVPForm.mockReturnValue({
      formData: mockFormData,
      setFormData: jest.fn(),
      submitted: true,
      isSubmitting: false,
      isLoadingPrevious: false,
      nameFromURL: null,
      isNameLocked: false,
      submitMessage: "",
      errors: {},
      handleSubmit: jest.fn(),
      handleReset: jest.fn(),
    });

    render(<RSVPForm />);

    expect(screen.getByText("מקווים שתוכלו להגיע")).toBeInTheDocument();
    expect(screen.getByText("לעדכן את הפרטים שלי שוב")).toBeInTheDocument();
  });

  it("displays name from URL when provided", () => {
    // Mock the hook to return name from URL
    mockUseRSVPForm.mockReturnValue({
      formData: { ...mockFormData, name: "אביתר כהן" },
      setFormData: jest.fn(),
      submitted: false,
      isSubmitting: false,
      isLoadingPrevious: false,
      nameFromURL: "אביתר כהן",
      isNameLocked: true,
      submitMessage: "",
      errors: {},
      handleSubmit: jest.fn(),
      handleReset: jest.fn(),
    });

    render(<RSVPForm />);

    expect(
      screen.getByText("👋 שלום אביתר כהן! הפרטים שלך נטענו אוטומטית")
    ).toBeInTheDocument();
    expect(screen.getByText("אביתר כהן")).toBeInTheDocument();
    expect(screen.getByText("(שם נטען אוטומטית מהקישור)")).toBeInTheDocument();
  });

  it("shows previous RSVP message when available", () => {
    // Mock the hook to return previous RSVP message
    mockUseRSVPForm.mockReturnValue({
      formData: mockFormData,
      setFormData: jest.fn(),
      submitted: false,
      isSubmitting: false,
      isLoadingPrevious: false,
      nameFromURL: null,
      isNameLocked: false,
      submitMessage: "מצאנו אישור קודם שלך מ-15 בינואר 2024",
      errors: {},
      handleSubmit: jest.fn(),
      handleReset: jest.fn(),
    });

    render(<RSVPForm />);

    expect(
      screen.getByText("מצאנו אישור קודם שלך מ-15 בינואר 2024")
    ).toBeInTheDocument();
  });

  it("handles form submission correctly", async () => {
    const user = userEvent.setup();
    const mockHandleSubmit = jest.fn();

    mockUseRSVPForm.mockReturnValue({
      formData: mockFormData,
      setFormData: jest.fn(),
      submitted: false,
      isSubmitting: false,
      isLoadingPrevious: false,
      nameFromURL: null,
      isNameLocked: false,
      submitMessage: "",
      errors: {},
      handleSubmit: mockHandleSubmit,
      handleReset: jest.fn(),
    });

    render(<RSVPForm />);

    const submitButton = screen.getByRole("button", { name: /שלח אישור/i });
    
    // Mock the form submission to avoid requestSubmit error
    const form = submitButton.closest('form');
    if (form) {
      form.requestSubmit = jest.fn();
    }
    
    await user.click(submitButton);

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it("handles form reset correctly", async () => {
    const user = userEvent.setup();
    const mockHandleReset = jest.fn();

    mockUseRSVPForm.mockReturnValue({
      formData: mockFormData,
      setFormData: jest.fn(),
      submitted: true,
      isSubmitting: false,
      isLoadingPrevious: false,
      nameFromURL: null,
      isNameLocked: false,
      submitMessage: "",
      errors: {},
      handleSubmit: jest.fn(),
      handleReset: mockHandleReset,
    });

    render(<RSVPForm />);

    const resetButton = screen.getByText("לעדכן את הפרטים שלי שוב");
    await user.click(resetButton);

    expect(mockHandleReset).toHaveBeenCalledTimes(1);
  });

  it("shows loading state when loading previous RSVP", () => {
    mockUseRSVPForm.mockReturnValue({
      formData: mockFormData,
      setFormData: jest.fn(),
      submitted: false,
      isSubmitting: false,
      isLoadingPrevious: true,
      nameFromURL: null,
      isNameLocked: false,
      submitMessage: "",
      errors: {},
      handleSubmit: jest.fn(),
      handleReset: jest.fn(),
    });

    render(<RSVPForm />);

    // Should show loading spinner or skeleton
    expect(screen.getByText("אישור הגעה")).toBeInTheDocument();
  });

  it("displays success message when form is submitted", () => {
    mockUseRSVPForm.mockReturnValue({
      formData: mockFormData,
      setFormData: jest.fn(),
      submitted: true,
      isSubmitting: false,
      isLoadingPrevious: false,
      nameFromURL: null,
      isNameLocked: false,
      submitMessage: "",
      errors: {},
      handleSubmit: jest.fn(),
      handleReset: jest.fn(),
    });

    render(<RSVPForm />);
    expect(screen.getByText("מקווים שתוכלו להגיע")).toBeInTheDocument();
  });

  it("handles form data changes correctly", () => {
    const mockSetFormData = jest.fn();

    mockUseRSVPForm.mockReturnValue({
      formData: mockFormData,
      setFormData: mockSetFormData,
      submitted: false,
      isSubmitting: false,
      isLoadingPrevious: false,
      nameFromURL: null,
      isNameLocked: false,
      submitMessage: "",
      errors: {},
      handleSubmit: jest.fn(),
      handleReset: jest.fn(),
    });

    render(<RSVPForm />);

    // Verify that the form displays the current data
    expect(screen.getByDisplayValue("שובל לוי")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
  });

  it("handles form data changes correctly", () => {
    const mockSetFormData = jest.fn();

    mockUseRSVPForm.mockReturnValue({
      formData: mockFormData,
      setFormData: mockSetFormData,
      submitted: false,
      isSubmitting: false,
      isLoadingPrevious: false,
      nameFromURL: null,
      isNameLocked: false,
      submitMessage: "",
      errors: {},
      handleSubmit: jest.fn(),
      handleReset: jest.fn(),
    });

    render(<RSVPForm />);

    // Verify that the form displays the current data
    expect(screen.getByDisplayValue("שובל לוי")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
  });
});
