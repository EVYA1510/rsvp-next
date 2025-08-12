import { POST, GET } from "../submit/route";

describe("/api/submit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock environment variables
    process.env.GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/test/exec";
  });

  afterEach(() => {
    delete process.env.GOOGLE_SCRIPT_URL;
  });

  describe("POST", () => {
    it("successfully submits RSVP data", async () => {
      const mockData = {
        name: "אביתר כהן",
        status: "מגיע",
        guests: "2",
        blessing: "מזל טוב!",
        timestamp: "2024-01-15T10:00:00.000Z",
        id: "rsvp_123",
      };

      const request = new global.Request(
        `http://localhost:3000/api/submit?${new URLSearchParams(
          mockData
        ).toString()}`,
        {
          method: "POST",
        }
      );

      const response = await POST(request);
      const responseText = await response.text();
      const data = JSON.parse(responseText);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("RSVP submitted successfully");
      expect(data.data).toEqual({
        name: mockData.name,
        status: mockData.status,
        guests: mockData.guests,
        blessing: mockData.blessing,
      });
    });

    it("handles missing required parameters", async () => {
      const request = new global.Request(
        "http://localhost:3000/api/submit?name=אביתר&status=מגיע",
        {
          method: "POST",
        }
      );

      const response = await POST(request);
      const responseText = await response.text();
      const data = JSON.parse(responseText);

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing required fields");
    });

    it("handles empty blessing gracefully", async () => {
      const mockData = {
        name: "אביתר כהן",
        status: "מגיע",
        guests: "1",
        blessing: "",
        timestamp: "2024-01-15T10:00:00.000Z",
        id: "rsvp_123",
      };

      const request = new global.Request(
        `http://localhost:3000/api/submit?${new URLSearchParams(
          mockData
        ).toString()}`,
        {
          method: "POST",
        }
      );

      const response = await POST(request);
      const responseText = await response.text();
      const data = JSON.parse(responseText);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.blessing).toBe("");
    });

    it("handles Google Script errors gracefully", async () => {
      // Mock fetch to simulate Google Script error
      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

      const mockData = {
        name: "אביתר כהן",
        status: "מגיע",
        guests: "2",
        blessing: "מזל טוב!",
        timestamp: "2024-01-15T10:00:00.000Z",
        id: "rsvp_123",
      };

      const request = new global.Request(
        `http://localhost:3000/api/submit?${new URLSearchParams(
          mockData
        ).toString()}`,
        {
          method: "POST",
        }
      );

      const response = await POST(request);
      const responseText = await response.text();
      const data = JSON.parse(responseText);

      // Should still succeed even if Google Script fails
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("works without Google Script URL configured", async () => {
      delete process.env.GOOGLE_SCRIPT_URL;

      const mockData = {
        name: "אביתר כהן",
        status: "מגיע",
        guests: "2",
        blessing: "מזל טוב!",
        timestamp: "2024-01-15T10:00:00.000Z",
        id: "rsvp_123",
      };

      const request = new global.Request(
        `http://localhost:3000/api/submit?${new URLSearchParams(
          mockData
        ).toString()}`,
        {
          method: "POST",
        }
      );

      const response = await POST(request);
      const responseText = await response.text();
      const data = JSON.parse(responseText);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe("GET", () => {
    it("returns error when name parameter is missing", async () => {
      const request = new global.Request("http://localhost:3000/api/submit", {
        method: "GET",
      });

      const response = await GET(request);
      const responseText = await response.text();
      const data = JSON.parse(responseText);

      expect(response.status).toBe(400);
      expect(data.error).toBe("Name parameter is required");
    });

    it("returns no previous RSVP when name is provided", async () => {
      const request = new global.Request(
        "http://localhost:3000/api/submit?name=אביתר כהן",
        {
          method: "GET",
        }
      );

      const response = await GET(request);
      const responseText = await response.text();
      const data = JSON.parse(responseText);

      expect(response.status).toBe(200);
      expect(data.found).toBe(false);
      expect(data.message).toContain("No previous RSVP found");
    });

    it("handles errors gracefully", async () => {
      // Create a request that will cause an error in the API
      const request = new global.Request(
        "http://localhost:3000/api/submit?name=אביתר כהן",
        {
          method: "GET",
        }
      );

      // Mock the URL constructor to throw an error when called inside the API
      const originalURL = global.URL;
      global.URL = jest.fn().mockImplementation(() => {
        // Always throw an error to simulate a problem
        throw new Error("URL error");
      });

      const response = await GET(request);
      const responseText = await response.text();
      const data = JSON.parse(responseText);

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to check previous RSVP");

      // Restore original URL
      global.URL = originalURL;
    });
  });
});
