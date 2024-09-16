import { expect, request, APIRequestContext, test } from "@playwright/test";

test("LoginForm.onSubmit", async ({ page, context, browser, playwright }) => {
  await page.goto("");
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
  await page.getByPlaceholder("Saisir un mot de passe...").fill("wxcv");
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(page).toHaveTitle(/Atelier – Photo – ateliers.lebonforum.fr/);
});
