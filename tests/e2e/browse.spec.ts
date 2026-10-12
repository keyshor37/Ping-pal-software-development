import { test, expect } from "@playwright/test";

// Core public stories: browse, search by city, filter, reset, login rejection.
// Uses only fictional data. No accounts are created by default.

test("visitor sees the Find Players page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("city search and reset", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const city = page.locator("#filter-city");
  await city.fill("NoSuchCity123");
  await page.getByRole("button", { name: /search/i }).click();
  await expect(page.getByText(/No players found\./)).toBeVisible();
  await page.getByRole("button", { name: /reset/i }).click();
  await expect(city).toHaveValue("");
});

test("incorrect login shows a generic error", async ({ page }) => {
  await page.goto("/auth");
  await page.waitForLoadState("networkidle");
  await page.locator("#login-email").fill("nobody@example.test");
  await page.locator("#login-password").fill("wrong-password-123");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.getByText(/invalid email or password/i)).toBeVisible();
});

test("signed-out visitor is redirected away from /profile", async ({ page }) => {
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/auth/);
});
