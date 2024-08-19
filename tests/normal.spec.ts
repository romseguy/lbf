import { expect } from "@playwright/test";
import { test } from "./normal.fixtures";

test.describe("forms", () => {
  test("TopicForm.onSubmit", async ({ page }) => {
    await page.goto("http://localhost:3000/api/login");
    await page.goto("/photo/discussions");
    await expect(page).toHaveURL("/photo/discussions");
    await page.getByText(/Ajouter/).click();
    const toast = page.locator("#chakra-toast-manager-top-right");
    expect(await toast.isVisible()).toBeTruthy();
  });

  test("GalleryForm.onSubmit", async ({ page }) => {
    await page.goto("http://localhost:3000/api/login");
    await page.goto("/photo/galeries");
    await expect(page).toHaveURL("/photo/galeries");
    await page.getByText(/Ajouter/).click();
    const toast = page.locator("#chakra-toast-manager-top-right");
    expect(await toast.isVisible()).toBeTruthy();
    //await page.screenshot({ path: "test.png", fullPage: true });
  });

  test("DocumentForm.onSubmit", async ({ page }) => {
    await page.goto("http://localhost:3000/api/login");
    await page.goto("/photo/galeries");
    await expect(page).toHaveURL("/photo/galeries");
    const locator = page
      .locator("p")
      .filter({ hasText: /Galerie/ })
      .nth(1);
    if (locator) {
      await locator.click();
      await page.getByText(/Ajouter des photos/).click();
      const toast = page.locator("#chakra-toast-manager-bottom");
      expect(await toast.isVisible()).toBeTruthy();
    }
  });
});
