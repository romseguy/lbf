import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Connexion – ateliers.lebonforum.fr/);

  await page.getByPlaceholder("Saisir une adresse e-mail...").click();
  await page
    .getByPlaceholder("Saisir une adresse e-mail...")
    .fill("rom.seguy@lilo.org");

  await page
    .locator("div")
    .filter({ hasText: /^Mot de passe$/ })
    .locator("span")
    .click();
  await page.getByPlaceholder("Saisir un mot de passe...").click();
  await page.getByPlaceholder("Saisir un mot de passe...").fill("Bnja5ot*");

  //await expect(page).toHaveTitle(/Atelier – Photo – ateliers.lebonforum.fr/);
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

// test("should navigate to the about page", async ({ page }) => {
//   // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
//   await page.goto("/home");
//   // Find an element with the text 'About Page' and click on it
//   await page.getByText("About Page").click();
//   // The new url should be "/about" (baseURL is used there)
//   await expect(page).toHaveURL("/home/about");
//   // The new page should contain an h1 with "About Page"
//   await expect(page.getByRole("heading", { level: 1 })).toContainText(
//     "About Page"
//   );
// });
