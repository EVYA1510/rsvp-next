import { renderHook, act, waitFor } from "@testing-library/react";
import { useRSVPForm } from "../useRSVPForm";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
global.localStorage = localStorageMock as Storage;

// Mock URLSearchParams
let mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
}));

describe("useRSVPForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    localStorageMock.getItem.mockReturnValue(null);
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ previousRSVP: null }),
    });
  });

  it("initializes with default form data", async () => {
    const { result } = renderHook(() => useRSVPForm());

    await waitFor(() => {
      expect(result.current.formData).toEqual({
        name: "",
        status: "מגיע",
        guests: 1,
        blessing: "",
      });
      expect(result.current.submitted).toBe(false);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.errors).toEqual({});
    });
  });

  it("loads name from URL parameters", async () => {
    // Set up URL parameters
    mockSearchParams.set("name", "אביתר כהן");

    const { result } = renderHook(() => useRSVPForm());

    await waitFor(() => {
      expect(result.current.nameFromURL).toBe("אביתר כהן");
      expect(result.current.isNameLocked).toBe(true);
      expect(result.current.formData.name).toBe("אביתר כהן");
    });
  });

  it("updates form data correctly", async () => {
    const { result } = renderHook(() => useRSVPForm());

    await waitFor(() => {
      act(() => {
        result.current.setFormData({
          name: "שובל לוי",
          status: "אולי",
          guests: 2,
          blessing: "מזל טוב!",
        });
      });

      expect(result.current.formData).toEqual({
        name: "שובל לוי",
        status: "אולי",
        guests: 2,
        blessing: "מזל טוב!",
      });
    });
  });

  it("validates form data correctly", async () => {
    const { result } = renderHook(() => useRSVPForm());

    await waitFor(() => {
      // Test valid data
      act(() => {
        result.current.setFormData({
          name: "אביתר כהן",
          status: "מגיע",
          guests: 2,
          blessing: "מזל טוב!",
        });
      });

      expect(result.current.errors).toEqual({});

      // Test invalid data
      act(() => {
        result.current.setFormData({
          name: "א", // Too short
          status: "מגיע",
          guests: 15, // Too many
          blessing: "",
        });
      });

      // Call validateForm to trigger validation
      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.name).toBeDefined();
      expect(result.current.errors.guests).toBeDefined();
    });
  });

  it("handles guest count validation based on status", async () => {
    const { result } = renderHook(() => useRSVPForm());

    await waitFor(() => {
      // Test "לא מגיע" status - guests should be 0
      act(() => {
        result.current.setFormData({
          name: "אביתר כהן",
          status: "לא מגיע",
          guests: 1,
          blessing: "",
        });
      });

      // Call validateForm to trigger validation
      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.guests).toBeDefined();

      // Test valid guest count for "מגיע" status
      act(() => {
        result.current.setFormData({
          name: "אביתר כהן",
          status: "מגיע",
          guests: 2,
          blessing: "",
        });
      });

      // Call validateForm to trigger validation
      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.guests).toBeUndefined();
    });
  });

  it("handles blessing length validation", async () => {
    const { result } = renderHook(() => useRSVPForm());

    const longBlessing = "א".repeat(501); // 501 characters

    await waitFor(() => {
      act(() => {
        result.current.setFormData({
          name: "אביתר כהן",
          status: "מגיע",
          guests: 1,
          blessing: longBlessing,
        });
      });

      // Call validateForm to trigger validation
      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.blessing).toBeDefined();
    });
  });

  it("handles Hebrew name validation", async () => {
    const { result } = renderHook(() => useRSVPForm());

    await waitFor(() => {
      // Test name with English characters
      act(() => {
        result.current.setFormData({
          name: "אביתר Cohen",
          status: "מגיע",
          guests: 1,
          blessing: "",
        });
      });

      // Call validateForm to trigger validation
      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.name).toBeDefined();

      // Test valid Hebrew name
      act(() => {
        result.current.setFormData({
          name: "אביתר כהן",
          status: "מגיע",
          guests: 1,
          blessing: "",
        });
      });

      // Call validateForm to trigger validation
      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.name).toBeUndefined();
    });
  });
});
