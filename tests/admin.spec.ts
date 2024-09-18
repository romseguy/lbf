import { expect } from "@playwright/test";
import { test } from "./admin.fixtures";

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
//   await context.route("/api/login", async (route) => {

//   });
// });

// test("logged in", async ({ page, context, browser, playwright }) => {
//   await page.goto("http://localhost:3000/api/login");
//   await page.goto("");
//   await expect(page).toHaveTitle(/Atelier – Photo – ateliers.lebonforum.fr/);
// });

test("login", async ({ page }) => {
  await page.goto("http://localhost:3000/api/login");
});

test("EventForm.onSubmit", async ({ page }) => {
  await page.goto("http://localhost:3000/api/login");
  await page.goto("/photo/agenda");
  await page.getByText("Ajouter un événement").click();
  await page
    .getByPlaceholder("Nom de l'événement")
    .fill("Atelier du 1er janvier 1970");
  await page.getByLabel("minDate").click();
  await page
    .getByRole("button", { name: /Choose lundi/ })
    .nth(0)
    .click();

  await page.getByRole("button", { name: "Ajouter" }).click();
  await expect(page).toHaveURL(/\/atelier_du_1er_janvier_1970/);

  await expect(
    page.getByRole("link", { name: /Atelier du 1er janvier/ })
  ).toBeVisible();

  await page.getByLabel("Revenir à l'accueil").click();
  await expect(page).toHaveURL("/photo");

  // await page.getByText(/Discussions/).click();
  // await expect(page).toHaveURL("/photo/discussions");

  // await page
  //   .locator("button[aria-label='Ouvrir la discussion']")
  //   .first()
  //   .click();

  // await expect(page).toHaveURL(/\/atelier_du_1er_janvier_1970/);
  // await expect(page).toHaveURL(/discussions/);

  // await page.getByLabel("Revenir à l'atelier").click();
  // await expect(page).toHaveURL("/photo");

  // await page.getByText(/Galeries/).click();
  // await expect(page).toHaveURL("/photo/galeries");

  // await page.locator("button[aria-label='Ouvrir la galerie']").first().click();

  // await expect(page).toHaveURL(/\/atelier_du_1er_janvier_1970/);
  // await expect(page).toHaveURL(/galerie/);

  // await page.getByText(/Ajouter des photo/).click();

  // const fileChooserPromise = page.waitForEvent("filechooser");
  // await page.locator("#fichiers").click();
  // const fileChooser = await fileChooserPromise;
  // const filePath = path.join(__dirname, "EventForm.onSubmit.png");
  // await fileChooser.setFiles(filePath);

  // await page.getByText("Valider").click();

  // await page.locator("img").first().click();
  // await expect(page.getByText("EventForm.onSubmit.png")).toBeVisible();

  // await page.getByRole("button", { name: /Commenter/ }).click();
  // await expect(page).toHaveURL(/discussions\/EventForm.onSubmit.png/);
});

// test.afterAll(async ({}) => {
//   //await widget.dispose();
// });
