import { expect } from "@playwright/test";
import path from "path";
import { test } from "./normal.fixtures";

test("TopicForm.onSubmit", async ({ page }) => {
  await page.goto("http://localhost:3000/api/login");
  await page.goto("");
  //await page.getByRole("button", { name: "Discussions" }).click();

  await page.getByText(/Discussions/).click();
  await expect(page).toHaveURL("/photo/discussions");

  //await page.getByRole("button", { name: "Ajouter une discussion" }).click();
  await page.getByText(/Ajouter/).click();
  const toast = page.locator("#chakra-toast-manager-top-right");
  expect(toast.isVisible()).toBeTruthy();
});

test("DocumentForm.onSubmit", async ({ page }) => {
  await page.goto("http://localhost:3000/api/login");
  await page.goto("");

  await page.getByText(/Galeries/).click();
  await expect(page).toHaveURL("/photo/galeries");
  await page
    .locator("p")
    .filter({ hasText: /Galerie/ })
    .nth(1)
    .click();
  await page.getByText(/Ajouter des photos/).click();
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.locator("#fichiers").click();
  const fileChooser = await fileChooserPromise;
  const filePath = path.join(__dirname, "GalleryForm.onSubmit.png");
  await fileChooser.setFiles(filePath);
  await page.getByText("Valider").click();

  expect(await page.getByText("Valider").isDisabled()).toBeTruthy();
});
