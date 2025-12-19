import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Start at the login page
    await page.goto("/login");
  });

  test("should display login form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("should login successfully with demo user credentials", async ({
    page,
  }) => {
    // Fill in demo user credentials
    await page.getByLabel(/username/i).fill("user");
    await page.getByLabel(/password/i).fill("user");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: /dashboard/i })
    ).toBeVisible();
  });

  test("should login successfully with demo admin credentials", async ({
    page,
  }) => {
    await page.getByLabel(/username/i).fill("admin");
    await page.getByLabel(/password/i).fill("admin");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: /dashboard/i })
    ).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.getByLabel(/username/i).fill("invalid");
    await page.getByLabel(/password/i).fill("invalid");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should stay on login page with error
    await expect(page).toHaveURL("/login");
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test("should redirect unauthenticated users to login", async ({ page }) => {
    // Try to access dashboard directly
    await page.goto("/");

    // Should redirect to login
    await expect(page).toHaveURL("/login");
  });
});

test.describe("Session Management", () => {
  test("should maintain session after login", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.getByLabel(/username/i).fill("user");
    await page.getByLabel(/password/i).fill("user");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Navigate away and back
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /dashboard/i })
    ).toBeVisible();
  });
});

