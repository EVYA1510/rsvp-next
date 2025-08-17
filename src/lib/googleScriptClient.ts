// Google Apps Script client with retry mechanism
export async function submitToGoogleScript(
  data: Record<string, any>,
  retries: number = 3
): Promise<any> {
  const url = process.env.GOOGLE_SCRIPT_URL;

  if (!url) {
    throw new Error("Google Script URL not configured");
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(
        `Attempting to submit to Google Script (attempt ${attempt}/${retries})`
      );

      // Add action parameter if not present
      const formData = { ...data };
      if (!formData.action) {
        formData.action = "upsert";
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "User-Agent": "RSVP-Form/1.0",
        },
        body: new URLSearchParams(formData),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      console.log(`Google Script response status: ${response.status}`);

      if (response.ok) {
        const result = await response.json();
        console.log("Google Script submission successful:", result);
        return result;
      }

      // If response is not ok, throw error for retry
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    } catch (error) {
      console.error(`Google Script attempt ${attempt} failed:`, error);

      // If this is the last attempt, throw the error
      if (attempt === retries) {
        throw new Error(
          `Failed to submit to Google Script after ${retries} attempts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }

      // Wait before retrying (exponential backoff)
      const delay = 1000 * attempt;
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Check if Google Script is available
export async function checkGoogleScriptHealth(): Promise<boolean> {
  const url = process.env.GOOGLE_SCRIPT_URL;

  if (!url) {
    return false;
  }

  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });

    return response.ok;
  } catch (error) {
    console.error("Google Script health check failed:", error);
    return false;
  }
}

// Get Google Script configuration
export function getGoogleScriptConfig(): {
  url: string | undefined;
  isConfigured: boolean;
} {
  const url = process.env.GOOGLE_SCRIPT_URL;

  return {
    url,
    isConfigured:
      !!url && url !== "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
  };
}
