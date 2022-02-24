import { email, listName, newOrgUrl } from "../fixtures/env";

describe("CRUD lists", () => {
  it("lands", () => {
    cy.login();
    cy.visit(`/${newOrgUrl}`);
    cy.wait("@session");
  });

  it("adds list", () => {
    cy.k("org-settings-button").click();
    cy.k("org-list-add").click();
    cy.get("input[name=listName]").type(listName);
    cy.get(".react-select-container").click();
    cy.get(".react-select__option").contains(email).click();
    cy.get("form").submit();
    cy.k(`org-list-link`).should("have.length", 3).first().contains(`1 membre`);
  });

  it("removes member from list", () => {
    cy.k(`org-list-${listName}-edit`).click();
    cy.get(".react-select__clear-indicator").click();
    cy.get("form").submit();
    cy.k(`org-list-link`).first().contains(`0 membres`);
  });

  it("adds member to list", () => {
    cy.k(`org-list-${listName}-edit`).click();
    cy.get(".react-select-container").click();
    cy.get(".react-select__option").contains(email).click();
    cy.get("form").submit();
    cy.k(`org-list-link`).first().contains(`1 membre`);
  });

  it("removes list", () => {
    cy.k(`org-list-${listName}-remove`).click();
    cy.k("delete-button-submit").click();
    cy.k(`org-list-link`).should("have.length", 2);
  });
});
