import { expect } from "@playwright/test";
import { test } from "./normal.fixtures";

test("login", async ({ page }) => {
  await page.goto("http://localhost:3000/api/login");
});

test.describe("event forms", () => {
  test("DocumentForm.onSubmit", async ({ page }) => {
    await page.goto("http://localhost:3000/api/login");
    await page.goto("/photo/galeries");
    await expect(page).toHaveURL("http://localhost:3000/photo/galeries");

    await page.getByLabel("Ouvrir la galerie").nth(0).click();
    await expect(page).toHaveURL(/atelier/i);

    await page.getByLabel("Ajouter des photos").click();
    await page.getByRole("alert", { name: /participant/i }).isVisible();
  });
});

test.describe("org forms", () => {
  test("TopicForm.onSubmit", async ({ page }) => {
    await page.goto("http://localhost:3000/api/login");
    await page.goto("/photo/discussions");
    await expect(page).toHaveURL("/photo/discussions");
    await page.getByText(/Ajouter/).click();
    await page.getByRole("alert", { name: /participant/i }).isVisible();
  });

  test("GalleryForm.onSubmit", async ({ page }) => {
    await page.goto("http://localhost:3000/api/login");
    await page.goto("/photo/galeries");
    await expect(page).toHaveURL("/photo/galeries");
    await page.getByText(/Ajouter/).click();
    await page.getByRole("alert", { name: /participant/i }).isVisible();
    //await page.screenshot({ path: "test.png", fullPage: true });
  });

  test("DocumentForm.onSubmit", async ({ page }) => {
    await page.goto("http://localhost:3000/api/login");
    await page.goto("/photo/galeries");
    await expect(page).toHaveURL("/photo/galeries");
    const locator = page
      .locator("p")
      .filter({ hasText: /Galerie/ })
      .nth(0);
    if (locator) {
      await locator.click();
      await page.getByText(/Ajouter des photos/).click();
      await page.getByRole("alert", { name: /participant/i }).isVisible();
    }
  });
});
