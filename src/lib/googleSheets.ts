// Google Sheets API integration for RSVP form
// This module handles communication with Google Sheets for storing RSVP data

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  range: string;
  apiKey?: string;
}

export interface RSVPData {
  timestamp: string;
  name: string;
  status: string;
  guests: number;
  blessing: string;
  id: string;
}

export interface GoogleSheetsResponse {
  success: boolean;
  error?: string;
}

/**
 * Appends a new row to the Google Sheets spreadsheet
 */
export async function appendRow(data: string[]): Promise<GoogleSheetsResponse> {
  try {
    const config = getGoogleSheetsConfig();
    
    if (!config.spreadsheetId) {
      throw new Error("Google Sheets configuration is missing");
    }

    // In a real implementation, this would make an API call to Google Sheets
    // For now, we'll simulate the behavior
    console.log("Appending row to Google Sheets:", data);
    
    return { success: true };
  } catch (error) {
    console.error("Error appending row to Google Sheets:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Retrieves rows from the Google Sheets spreadsheet
 */
export async function getRows(): Promise<string[][]> {
  try {
    const config = getGoogleSheetsConfig();
    
    if (!config.spreadsheetId) {
      throw new Error("Google Sheets configuration is missing");
    }

    // In a real implementation, this would make an API call to Google Sheets
    // For now, we'll return empty array to simulate no existing data
    console.log("Retrieving rows from Google Sheets");
    
    return [];
  } catch (error) {
    console.error("Error retrieving rows from Google Sheets:", error);
    return [];
  }
}

/**
 * Gets Google Sheets configuration from environment variables
 */
function getGoogleSheetsConfig(): GoogleSheetsConfig {
  return {
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "",
    range: process.env.GOOGLE_SHEETS_RANGE || "Sheet1!A:F",
    apiKey: process.env.GOOGLE_SHEETS_API_KEY,
  };
}

/**
 * Validates RSVP data before sending to Google Sheets
 */
export function validateRSVPData(data: RSVPData): boolean {
  return !!(
    data.timestamp &&
    data.name &&
    data.status &&
    typeof data.guests === "number" &&
    data.id
  );
}

/**
 * Formats RSVP data for Google Sheets
 */
export function formatRSVPDataForSheets(data: RSVPData): string[] {
  return [
    data.timestamp,
    data.name,
    data.status,
    data.guests.toString(),
    data.blessing || "",
    data.id,
  ];
}
