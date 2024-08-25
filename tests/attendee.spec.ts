import { expect } from "@playwright/test";
import path from "path";
import { test } from "./attendee.fixtures";

// les participants ne peuvent pas modifier les descriptions qui ne leur appartiennent pas
// -> il ne peut pas modifier la description de la galerie de l'événement
// ->

test.describe("event forms", () => {
  test("DocumentForm.onSubmit", async ({ page }) => {
    await page.goto("http://localhost:3000/api/login");
    await page.goto("/photo/galeries");
    await expect(page).toHaveURL("/photo/galeries");
    await page.getByLabel("Ouvrir la galerie").nth(0).click();
    await expect(page).toHaveURL(/atelier/i);

    await page.getByLabel("Ajouter des photos").click();
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator("#fichiers").click();
    const fileChooser = await fileChooserPromise;
    const filePath = path.join(__dirname, "GalleryForm.onSubmit.png");
    await fileChooser.setFiles(filePath);
    await page.getByText("Valider").click();
    await page.getByRole("alert", { name: /ajouté/i }).isVisible();

    const img = page.locator("img").nth(0);
    await expect(img).toBeVisible();
    await img.click();
    await expect(page.getByText("GalleryForm.onSubmit.png")).toBeVisible();
    await page.getByLabel(/supprimer/i).click();
    await page.getByRole("button", { name: "Supprimer" }).click();
    await page.getByRole("alert", { name: /supprimé/i }).isVisible();

    await expect(img).toBeHidden();
  });
});

test.describe("event gallery", () => {
  test("user gallery", async ({ page }) => {
    await page.goto("http://localhost:3000/api/login");
    await page.goto("/photo/galeries");
    await expect(page).toHaveURL("/photo/galeries");
    await page.getByLabel("Ouvrir la galerie").nth(0).click();
    await expect(page).toHaveURL(/atelier/i);
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
    await page.getByRole("alert", { name: /ajouté/i }).isVisible();

    await page.locator("img").first().click();
    await expect(page.getByText("GalleryForm.onSubmit.png")).toBeVisible();

    await page.getByLabel(/supprimer/i).click();
    await page.getByRole("button", { name: "Supprimer" }).click();
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
    await page.getByRole("alert", { name: /ajouté/i }).isVisible();

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
    await page.getByRole("alert", { name: /ajouté/i }).isVisible();

    // await page.goto("http://localhost:3000/api/login");
    // await page.goto("/photo/discussions/1");
    // await page.waitForURL("/photo/discussions/1");

    await expect(page).toHaveURL("/photo/discussions/1");
    await expect(page.getByText("2", { exact: true })).toBeVisible();
  });
});

test.describe("org galleries", () => {
  test("Galleries", async ({ page }) => {
    await page.goto("http://localhost:3000/api/login");
    await page.goto("/photo/galeries");
  });
});

test("TopicsListItem.DeleteButton", async ({ page }) => {
  await page.goto("http://localhost:3000/api/login");
  await page.goto("/photo/discussions");
  await expect(page).toHaveURL("/photo/discussions");
  await page.getByLabel("Supprimer").first().click();
  await page.getByRole("button", { name: "Supprimer" }).click();
  await page.getByRole("alert", { name: /supprimé/i }).isVisible();
});
