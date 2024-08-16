import { expect } from "@playwright/test";
import path from "path";
import { test } from "./attendee.fixtures";

test("TopicForm.onSubmit", async ({ page }) => {
  await page.goto("http://localhost:3000/api/login");
  await page.goto("");
  //await page.getByRole("button", { name: "Discussions" }).click();
  await page.getByText(/Discussions/).click();
  await expect(page).toHaveURL("/photo/discussions");

  //await page.getByRole("button", { name: "Ajouter une discussion" }).click();
  await page.getByText(/Ajouter/).click();
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
});

// test("GalleryForm.onSubmit", async ({ page }) => {
//   await page.goto("http://localhost:3000/api/login");
//   await page.goto("");
//   await page.getByText(/Galeries/).click();
//   await page.getByText(/Ajouter/).click();
//   await page.getByPlaceholder(/Nom/).fill("1");

//   const locator = page
//     .frameLocator('iframe[title="Zone de Texte Riche"]')
//     .locator("html");
//   await expect(locator).toBeEditable();
//   await locator.locator("#tinymce").fill("2");

//   await page.getByRole("button", { name: /Ajouter/ }).click();
//   await expect(page).toHaveURL("/photo/galeries/1");

//   await page.getByText(/Ajouter des photo/).click();

//   const fileChooserPromise = page.waitForEvent("filechooser");
//   await page.locator("#fichiers").click();
//   const fileChooser = await fileChooserPromise;
//   const filePath = path.join(__dirname, "GalleryForm.onSubmit.png");
//   await fileChooser.setFiles(filePath);

//   await page.getByText("Valider").click();

//   await page.locator("img").click();
//   await expect(page.getByText("GalleryForm.onSubmit.png")).toBeVisible();

//   await page.getByRole("button", { name: /Commenter/ }).click();
//   await expect(page).toHaveURL("/photo/discussions/GalleryForm.onSubmit.png");
// });

// test("EventForm.onSubmit", async ({ page }) => {
//   await page.goto("http://localhost:3000/api/login");
//   await page.goto("/photo/agenda");
//   await page.getByText("Ajouter un événement").click();
//   await page
//     .getByPlaceholder("Nom de l'événement")
//     .fill("Atelier du 1er janvier 1970");
//   await page.getByLabel("minDate").click();
//   await page
//     .getByRole("button", { name: /Choose lundi/ })
//     .nth(0)
//     .click();

//   await page.getByRole("button", { name: "Ajouter" }).click();
//   await expect(page).toHaveURL(/\/atelier_du_1er_janvier_1970/);

//   await expect(
//     page.getByRole("link", { name: /Atelier du 1er janvier/ })
//   ).toBeVisible();

//   await page.getByLabel("Revenir à l'atelier").click();
//   await expect(page).toHaveURL("/photo");
