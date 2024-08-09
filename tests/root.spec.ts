import { expect, request, APIRequestContext } from "@playwright/test";
import { test } from "./root.fixtures";

// headers: {
//   "Content-Type": "application/json",
//   Authorization: "Bearer " + didToken
// }

// class Widget {
//   c: APIRequestContext | null = null;
//   constructor(c: APIRequestContext) {
//     this.c = c;
//   }
//   async dispose() {
//     if (this.c) await this.c.dispose();
//   }
// }
// let widget: Widget;

// test.beforeAll(async ({ browser, context }) => {
//   //widget = new Widget(apiRequestContext);

//   const apiRequestContext = await request.newContext();
//   await context.route("http://localhost:3000/api/login", async (route) => {

//   });
// });

test("logged in", async ({ page, context, browser, playwright }) => {
  await page.goto("http://localhost:3000/api/login");
  await page.goto("http://localhost:3000");
  await expect(page).toHaveTitle(/Atelier – Photo – ateliers.lebonforum.fr/);
});

test("logged out", async ({ page, context, browser, playwright }) => {
  await page.goto("http://localhost:3000");
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

// test.afterAll(async ({}) => {
//   //await widget.dispose();
// });
