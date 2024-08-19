import { expect } from "@playwright/test";
import path from "path";
import { test } from "./attendee.fixtures";

test.describe("event forms", () => {
  test("DocumentForm.onSubmit", async ({ page }) => {
    await page.goto("http://localhost:3000/api/login");
    await page.goto("/photo/agenda");
    await page
      .locator("p")
      .filter({ hasText: /Atelier/ })
      .nth(1)
      .click();
  });
});

test.describe("org forms", () => {
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
    const toast = page.locator("#chakra-toast-manager-top-right");
    expect(toast).toHaveText("ajouté");
  });

  test("GalleryForm.onSubmit", async ({ page }) => {
    await page.goto("http://localhost:3000/api/login");
    await page.goto("");
    await page.getByText(/Galeries/).click();
    await page.getByText(/Ajouter/).click();
    await page.getByPlaceholder(/Nom/).fill("1");

    const locator = page
      .frameLocator('iframe[title="Zone de Texte Riche"]')
      .locator("html");
    await expect(locator).toBeEditable();
    await locator.locator("#tinymce").fill("2");

    await page.getByRole("button", { name: /Ajouter/ }).click();
    const toast = page.locator("#chakra-toast-manager-top-right");
    expect(await toast.isVisible()).toBeTruthy();

    await expect(page).toHaveURL("/photo/galeries/1");

    // await page.getByText(/Ajouter des photo/).click();

    // const fileChooserPromise = page.waitForEvent("filechooser");
    // await page.locator("#fichiers").click();
    // const fileChooser = await fileChooserPromise;
    // const filePath = path.join(__dirname, "GalleryForm.onSubmit.png");
    // await fileChooser.setFiles(filePath);

    // await page.getByText("Valider").click();

    // await page.locator("img").click();
    // await expect(page.getByText("GalleryForm.onSubmit.png")).toBeVisible();

    // await page.getByRole("button", { name: /Commenter/ }).click();
    // await expect(page).toHaveURL("/photo/discussions/GalleryForm.onSubmit.png");
  });

  test("TopicForm.onSubmit", async ({ page }) => {
    await page.goto("http://localhost:3000/api/login");
    await page.goto("");
    //await page.getByRole("button", { name: "Discussions" }).click();
    await page.getByText(/Discussions/).click();
    await expect(page).toHaveURL("/photo/discussions");

    //await page.getByRole("button", { name: "Ajouter une discussion" }).click();
    await page.getByText(/Ajouter/).click();
    await page.getByPlaceholder(/Objet/).fill("1");

    const locator = page
      .frameLocator('iframe[title="Zone de Texte Riche"]')
      .locator("html");
    await expect(locator).toBeEditable();
    await locator.locator("#tinymce").fill("2");

    await page.getByRole("button", { name: /Ajouter/ }).click();
    const toast = page.locator("#chakra-toast-manager-top-right");
    expect(await toast.isVisible()).toBeTruthy();

    // await page.goto("http://localhost:3000/api/login");
    // await page.goto("/photo/discussions/1");
    // await page.waitForURL("/photo/discussions/1");

    await expect(page).toHaveURL("/photo/discussions/1");
    await expect(page.getByText("2", { exact: true })).toBeVisible();
  });
});

test("TopicsListItem.DeleteButton", async ({ page }) => {
  await page.goto("http://localhost:3000/api/login");
  await page.goto("/photo/discussions");
  await expect(page).toHaveURL("/photo/discussions");
  await page.getByLabel("Supprimer").first().click();
  await page.getByRole("button", { name: "Supprimer" }).click();
  const toast = page.locator("#chakra-toast-manager-top-right");
  expect(await toast.isVisible()).toBeTruthy();
});
