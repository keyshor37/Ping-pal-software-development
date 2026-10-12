import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Session 9: axe must report 0 serious/critical issues on main pages.
for (const path of ["/", "/auth"]) {
  test(`no serious accessibility issues on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    for (const v of serious) console.log(`${v.impact}: ${v.id} — ${v.help}`);
    expect(serious).toEqual([]);
  });
}
