export interface RSVPData {
  name: string;
  status: "yes" | "maybe" | "no";
  guests: number;
  blessing?: string;
  timestamp: string;
  id?: string; // Add ID field
}

export interface StoredRSVPData {
  name: string;
  status: "yes" | "maybe" | "no";
  guests: number;
  blessing: string;
  submitted: boolean;
  id?: string; // Add ID field
}

// Generate a unique ID
export const generateUniqueId = (): string => {
  return "rsvp_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
};

// Get or create unique ID for current guest
export const getOrCreateGuestId = (): string => {
  try {
    let guestId = localStorage.getItem("rsvp_id");

    if (!guestId) {
      guestId = generateUniqueId();
      localStorage.setItem("rsvp_id", guestId);
      console.log("Generated new guest ID:", guestId);
    } else {
      console.log("Using existing guest ID:", guestId);
    }

    return guestId;
  } catch (error) {
    console.error("Error managing guest ID:", error);
    return generateUniqueId();
  }
};

// Save RSVP data to localStorage
export const saveRSVPData = (data: Partial<StoredRSVPData>) => {
  try {
    if (data.name !== undefined) {
      localStorage.setItem("rsvp_name", data.name);
    }
    if (data.status !== undefined) {
      localStorage.setItem("rsvp_status", data.status);
    }
    if (data.guests !== undefined) {
      localStorage.setItem("rsvp_guests", data.guests.toString());
    }
    if (data.blessing !== undefined) {
      localStorage.setItem("rsvp_blessing", data.blessing);
    }
    if (data.submitted !== undefined) {
      localStorage.setItem("rsvp_submitted", data.submitted.toString());
    }
    if (data.id !== undefined) {
      localStorage.setItem("rsvp_id", data.id);
    }
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Load RSVP data from localStorage
export const loadRSVPData = (): Partial<StoredRSVPData> => {
  try {
    const data = {
      name: localStorage.getItem("rsvp_name") || "",
      status:
        (localStorage.getItem("rsvp_status") as "yes" | "maybe" | "no") ||
        "yes",
      guests: parseInt(localStorage.getItem("rsvp_guests") || "1"),
      blessing: localStorage.getItem("rsvp_blessing") || "",
      submitted: localStorage.getItem("rsvp_submitted") === "true",
      id: localStorage.getItem("rsvp_id") || undefined,
    };
    return data;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return {
      name: "",
      status: "yes",
      guests: 1,
      blessing: "",
      submitted: false,
    };
  }
};

// Clear all RSVP data from localStorage
export const clearRSVPData = () => {
  try {
    localStorage.removeItem("rsvp_name");
    localStorage.removeItem("rsvp_status");
    localStorage.removeItem("rsvp_guests");
    localStorage.removeItem("rsvp_blessing");
    localStorage.removeItem("rsvp_submitted");
    // Note: We don't clear rsvp_id to maintain guest identity
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

// Check if user has already submitted
export const isAlreadySubmitted = (): boolean => {
  try {
    return localStorage.getItem("rsvp_submitted") === "true";
  } catch (error) {
    console.error("Error checking submission status:", error);
    return false;
  }
};

// Get URL parameters with proper decoding
export const getURLParams = () => {
  if (typeof window === "undefined") return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get("name");
    const id = urlParams.get("id");

    // Properly decode the name parameter for Hebrew text
    const decodedName = name ? decodeURIComponent(name) : null;

    console.log("URL params - raw name:", name, "decoded name:", decodedName);

    return {
      name: decodedName,
      id: id,
    };
  } catch (error) {
    console.error("Error getting URL parameters:", error);
    return {};
  }
};
