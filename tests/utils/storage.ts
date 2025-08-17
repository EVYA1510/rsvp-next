import { BrowserContext, Page } from "@playwright/test";

export async function resetContextStorage(context: BrowserContext, page: Page) {
  await context.clearCookies();
  await page.addInitScript(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ("indexedDB" in window) {
        try {
          // נסה למחוק את כל מסדי הנתונים הידועים
          const del = (name: string) => {
            try {
              indexedDB.deleteDatabase(name);
            } catch (_) {}
          };
          // אם יש לכם DB בשם קבוע – מחק אותו
          del("rsvp-db");
        } catch (_) {}
      }
    } catch (_) {}
  });
}

export async function setMockRSVPData(
  context: BrowserContext,
  data: {
    name: string;
    status: string;
    guests: number;
    reportId?: string;
  }
) {
  await context.addInitScript(
    ([mockData]) => {
      try {
        localStorage.setItem(
          "rsvp_full_data",
          JSON.stringify({
            reportId: mockData.reportId || "rsvp_1234567890_mock",
            name: mockData.name,
            status: mockData.status,
            guests: mockData.guests,
            blessing: "",
            savedAt: Date.now(),
          })
        );
      } catch (_) {}
    },
    [data]
  );
}
