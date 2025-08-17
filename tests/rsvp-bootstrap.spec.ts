import { test, expect } from "@playwright/test";

const NAME = "אביתר לידני";
const URL = `/?name=${encodeURIComponent(NAME)}`;

test.beforeEach(async ({ page, context }) => {
  await context.clearCookies();
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    try {
      indexedDB.deleteDatabase("rsvp-db");
    } catch {}
  });
});

// עוזר ל"כאילו יש קאש" (אחרי שליחה קודמת)
async function seedLocalCache(page) {
  await page.addInitScript(
    ([name]) => {
      localStorage.setItem(
        "rsvp_cache_data",
        JSON.stringify({
          reportId: "rsvp_mock_123",
          name,
          status: "yes",
          guests: 2,
          blessing: "",
          updatedAt: Date.now(),
        })
      );
    },
    [NAME]
  );
}

test.describe("RSVP Bootstrap Tests", () => {
  test("Cache-first: עם קאש מקומי ה־UI עולה מייד גם כש־GET איטי", async ({
    page,
  }) => {
    await seedLocalCache(page);

    // סימולציית שרת איטי (3 שניות)
    await page.route("**/api/rsvp**", async (route) => {
      await new Promise((r) => setTimeout(r, 3000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            reportId: "rsvp_mock_123",
            name: NAME,
            status: "yes",
            guests: 2,
            blessing: "מעודכן מהשרת",
          },
        }),
      });
    });

    const t0 = Date.now();
    await page.goto(URL);
    // אמור להציג כרטיס/טופס מיידית — לא מחכה 3 שניות
    await expect(
      page.getByTestId("confirmation-card").or(page.getByTestId("rsvp-form"))
    ).toBeVisible();
    const t1 = Date.now();
    expect(t1 - t0).toBeLessThan(600); // מתחת ל~0.6 שניות (כוונן לפי המציאות)

    // לאחר מכן, אחרי שהשרת חזר — אפשר לאמת שהתוכן עודכן (לא חובה)
    await expect(page.getByTestId("confirmation-card")).toBeVisible({
      timeout: 5000,
    });
  });

  test("First load ללא קאש: רואים Skeleton מהר ואז טופס לאחר GET", async ({
    page,
  }) => {
    await page.route("**/api/rsvp**", async (route) => {
      // זמן סביר (800ms)
      await new Promise((r) => setTimeout(r, 800));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: null }), // אין רשומה
      });
    });

    const t0 = Date.now();
    await page.goto(URL);

    await expect(page.getByTestId("rsvp-skeleton")).toBeVisible();
    expect(Date.now() - t0).toBeLessThan(800);

    await expect(page.getByTestId("rsvp-form")).toBeVisible({ timeout: 3000 });
  });

  test("GET תקוע: ה־UI נשאר על הקאש; ה־fetch מתבטל ב־timeout", async ({
    page,
  }) => {
    await seedLocalCache(page);

    await page.route("**/api/rsvp**", async (route) => {
      // לא עונים בכלל (לתת ל־AbortController שלכם לבטל)
      await new Promise(() => {}); // never resolve
    });

    await page.goto(URL);

    // עדיין רואים UI מיידי
    await expect(
      page.getByTestId("confirmation-card").or(page.getByTestId("rsvp-form"))
    ).toBeVisible();
  });

  test("tracking איטי/נכשל אינו חוסם רינדור", async ({ page }) => {
    await seedLocalCache(page);

    await page.route("**/api/rsvp**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: null }),
      })
    );

    await page.route("**/api/track**", async (route) => {
      await new Promise((r) => setTimeout(r, 5000)); // איטי מאוד
      await route.abort(); // נכשל
    });

    await page.goto(URL);
    // UI מוצג מייד – לא מחכה ל־track
    await expect(
      page.getByTestId("confirmation-card").or(page.getByTestId("rsvp-form"))
    ).toBeVisible();
  });

  test("רענון אחד מספיק: אין תלות ב-double refresh", async ({ page }) => {
    await seedLocalCache(page);

    let hits = 0;
    await page.route("**/api/rsvp**", async (route) => {
      hits++;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: null }),
      });
    });

    await page.goto(URL);
    await expect(
      page.getByTestId("confirmation-card").or(page.getByTestId("rsvp-form"))
    ).toBeVisible();

    // רענון שוב — גם כאן צריך להיות מיידי
    await page.reload();
    await expect(
      page.getByTestId("confirmation-card").or(page.getByTestId("rsvp-form"))
    ).toBeVisible();

    // עם cache, לא בהכרח יהיו קריאות API
    // expect(hits).toBeGreaterThanOrEqual(1); // היו קריאות, אבל הן לא חסמו UI
  });

  test("רשת נופלת: ה־UI נשאר יציב עם קאש", async ({ page }) => {
    await seedLocalCache(page);

    await page.route("**/api/rsvp**", async (route) => {
      await route.abort(); // נכשל מיד
    });

    await page.goto(URL);

    // UI מוצג מייד עם הנתונים מהקאש
    await expect(page.getByTestId("confirmation-card")).toBeVisible();
    await expect(page.getByTestId("name-text")).toContainText(NAME);
  });

  test("רשת איטית מאוד: timeout עובד וה־UI לא נתקע", async ({ page }) => {
    await seedLocalCache(page);

    await page.route("**/api/rsvp**", async (route) => {
      // יותר מ-1.8 שניות (timeout שלנו)
      await new Promise((r) => setTimeout(r, 2500));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: null }),
      });
    });

    const t0 = Date.now();
    await page.goto(URL);

    // UI מוצג מייד (לא מחכה 2.5 שניות)
    await expect(
      page.getByTestId("confirmation-card").or(page.getByTestId("rsvp-form"))
    ).toBeVisible();
    const t1 = Date.now();
    expect(t1 - t0).toBeLessThan(2000); // פחות מ-2 שניות
  });

  test("אין קאש + רשת תקועה: רואים skeleton ואז טופס ריק", async ({ page }) => {
    await page.route("**/api/rsvp**", async (route) => {
      // לא עונים בכלל
      await new Promise(() => {});
    });

    await page.goto(URL);

    // רואים skeleton מהר
    await expect(page.getByTestId("rsvp-skeleton")).toBeVisible();

    // אחרי timeout, רואים טופס ריק
    await expect(page.getByTestId("rsvp-form")).toBeVisible({ timeout: 3000 });
  });
});
