import { expect, request, APIRequestContext } from "@playwright/test";
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
  await expect(page.locator("#chakra-toast-manager-top-right")).toBeVisible();
});
