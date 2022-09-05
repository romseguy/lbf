import { userEmail } from "../fixtures/env";

describe("AUTH", () => {
  beforeEach(() => {});

  it("should display login form", () => {
    cy.visit("/login");
    cy.k("email-input").should("exist");
    cy.k("password-input").should("exist");
  });

  it("should log in", () => {
    cy.k("email-input").type(userEmail);
    cy.k("password-input").type("wxcv");
    cy.k("login-form").submit();
    cy.wait(5000);
    cy.k("event-popover-button").should("exist");
  });

  // it("should log out", () => {
  //   cy.k("avatar-button").click();
  //   cy.wait(5000);
  //   cy.k("logout").should("exist");
  //   // FIXME: cy.k("logout").click()
  //   cy.wait(5000);
  //   cy.k("event-popover-button").should("not.exist");
  // });
});
