import { test, expect } from "@playwright/test";
import { resetContextStorage, setMockRSVPData } from "./utils/storage";

const NAME = "אביתר לידני";
const URL_WITH_NAME = `/?name=${encodeURIComponent(NAME)}`;

test.beforeEach(async ({ context, page }) => {
  await resetContextStorage(context, page);
});

test.describe("RSVP Integration", () => {
  test("1) משתמש חדש רואה טופס ומגיש בהצלחה", async ({ page }) => {
    await page.goto(URL_WITH_NAME);

    // במצב "חדש" אמור להופיע הטופס
    await expect(page.getByTestId("rsvp-form")).toBeVisible();

    // בחר מגיע, אורח 1, הוסף ברכה ושלח
    await page.getByTestId("status-select").selectOption({ label: "מגיע" });
    await page.getByTestId("guests-chip-1").click();
    await page.getByTestId("blessing-input").fill("מזל טוב! 🎉");
    await page.getByTestId("submit-btn").click();

    // אחרי שליחה – מוצג כרטיס אישור
    await expect(page.getByTestId("confirmation-card")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId("rsvp-card-title")).toHaveText(
      new RegExp(NAME)
    );
    await expect(page.getByTestId("name-text")).toContainText(NAME);
    await expect(page.getByTestId("status-text")).toContainText("מגיע");
    await expect(page.getByTestId("guests-text")).toContainText("1");
  });

  test('2) במצב "כבר אישרת" רואים כרטיס אישור', async ({ page }) => {
    // מדמה הגשה קודמת באמצעות סטוראג' לפני הניווט
    await page.addInitScript(
      ([name]) => {
        localStorage.setItem(
          "rsvp_full_data",
          JSON.stringify({
            reportId: "rsvp_mock_12345",
            name: name,
            status: "no",
            guests: 0,
            blessing: "",
            savedAt: Date.now(),
          })
        );
      },
      [NAME]
    );

    await page.goto(URL_WITH_NAME);

    await expect(page.getByTestId("confirmation-card")).toBeVisible();
    await expect(page.getByTestId("name-text")).toContainText(NAME);
    await expect(page.getByTestId("status-text")).toContainText("לא מגיע");
    await expect(page.getByTestId("update-btn")).toBeVisible();
  });

  test("3) עדכון תשובה קיימת (update) מחזיר תצוגה מעודכנת", async ({
    page,
  }) => {
    // שלב ראשון – שליחה עם "מגיע"
    await page.goto(URL_WITH_NAME);
    await expect(page.getByTestId("rsvp-form")).toBeVisible();

    await page.getByTestId("status-select").selectOption("yes");
    await page.getByTestId("guests-chip-1").click();
    await page.getByTestId("submit-btn").click();

    await expect(page.getByTestId("confirmation-card")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId("status-text")).toContainText("מגיע");

    // שלב שני – חזרה לטופס ועדכון ל-2 אורחים
    await page.getByTestId("update-btn").click();
    await expect(page.getByTestId("rsvp-form")).toBeVisible();

    await page.getByTestId("guests-chip-2").click();
    await page.getByTestId("submit-btn").click();

    await expect(page.getByTestId("confirmation-card")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId("status-text")).toContainText("מגיע");
    await expect(page.getByTestId("guests-text")).toContainText("2");
  });
});
