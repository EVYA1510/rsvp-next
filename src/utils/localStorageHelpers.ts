import { RsvpStatus } from "@/lib/validations";

export interface RSVPData {
  name: string;
  status: RsvpStatus;
  guests: number;
  blessing?: string;
  reportId?: string;
}

export interface StoredRSVPData {
  submitted: boolean;
  reportId?: string;
}

export interface FullRSVPData {
  reportId: string;
  name: string;
  status: RsvpStatus;
  guests: number;
  blessing?: string;
  savedAt: number;
}

const RSVP_STORAGE_KEY = "rsvp_data";
const RSVP_REPORT_ID_KEY = "rsvp_report_id";
const RSVP_FULL_DATA_KEY = "rsvp_full_data";

// Save RSVP data to localStorage
export function saveRSVPData(data: StoredRSVPData): void {
  try {
    localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(data));
    if (data.reportId !== undefined) {
      localStorage.setItem(RSVP_REPORT_ID_KEY, data.reportId);
    }
  } catch (error) {
    console.error("Error saving RSVP data:", error);
  }
}

// Load RSVP data from localStorage
export function loadRSVPData(): StoredRSVPData | null {
  try {
    const data = localStorage.getItem(RSVP_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading RSVP data:", error);
    return null;
  }
}

// Check if RSVP was already submitted
export function isAlreadySubmitted(): boolean {
  const data = loadRSVPData();
  return data?.submitted || false;
}

// Get report ID from localStorage
export function getReportId(): string | null {
  try {
    return localStorage.getItem(RSVP_REPORT_ID_KEY);
  } catch (error) {
    console.error("Error getting report ID:", error);
    return null;
  }
}

// Clear RSVP data from localStorage
export function clearRSVPData(): void {
  try {
    localStorage.removeItem(RSVP_STORAGE_KEY);
    localStorage.removeItem(RSVP_REPORT_ID_KEY);
  } catch (error) {
    console.error("Error clearing RSVP data:", error);
  }
}

// Get URL parameters
export function getURLParams(): { name?: string } {
  if (typeof window === "undefined") return {};

  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");

  console.log("URL params:", { name });

  return {
    name: name || undefined,
  };
}

// Generate unique ID (for backward compatibility)
export function generateUniqueId(): string {
  return "rsvp_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

const LS_KEY = "rsvp_reportId";

export function getSavedReportId(): string {
  try {
    return localStorage.getItem(LS_KEY) || "";
  } catch {
    return "";
  }
}

export function saveReportId(id: string) {
  try {
    if (id) localStorage.setItem(LS_KEY, id);
  } catch {}
}

export function clearReportId() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {}
}

// Save full RSVP data to localStorage
export function saveFullRSVPData(data: FullRSVPData): void {
  try {
    const dataToSave = {
      ...data,
      savedAt: Date.now()
    };
    localStorage.setItem(RSVP_FULL_DATA_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error("Error saving full RSVP data:", error);
  }
}

// Load full RSVP data from localStorage
export function loadFullRSVPData(): FullRSVPData | null {
  try {
    const data = localStorage.getItem(RSVP_FULL_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading full RSVP data:", error);
    return null;
  }
}

// Get URL ID parameter
export function getURLId(): string | null {
  if (typeof window === "undefined") return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Clear full RSVP data from localStorage
export function clearFullRSVPData(): void {
  try {
    localStorage.removeItem(RSVP_FULL_DATA_KEY);
  } catch (error) {
    console.error("Error clearing full RSVP data:", error);
  }
}
