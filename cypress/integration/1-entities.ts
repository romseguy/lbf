import { OrgTypes, OrgTypesV, Visibility } from "models/Org";
import {
  eventDescription,
  eventName,
  eventUrl,
  newEventUrl,
  orgName,
  newOrgName,
  orgUrl,
  newOrgUrl
} from "../fixtures/env";

describe("CRUD entities", () => {
  it("resets db", () => {
    cy.request("http://localhost:3004/api/reset-db");
  });

  it("404", () => {
    cy.visit("/test");
    cy.location("pathname", { timeout: 20000 }).should("eq", "/");
  });

  describe("/org", () => {
    it("creates org", () => {
      cy.login();
      cy.visit("/");
      cy.wait("@session");

      cy.k("org-popover-button").click();
      cy.k("org-add-button").click();
      cy.get("input[name=orgName]").type(orgName);
      cy.get("select[name=orgType]").select(OrgTypesV[OrgTypes.ASSO]);
      cy.get("form").submit();
      cy.location("pathname", { timeout: 20000 }).should(
        "include",
        `/${orgUrl}`
      );
      cy.k("org-settings").should("have.length", 1);
    });

    it("updates orgName", () => {
      cy.login();
      cy.visit(`/${orgUrl}`);
      cy.wait("@session");

      cy.k("org-settings").click();
      cy.k("orgEdit").click();
      cy.get("input[name=orgName]").type("m");
      cy.wait(5000);
      cy.get("form").submit();
      cy.location("pathname", { timeout: 20000 }).should(
        "include",
        `/${newOrgUrl}`
      );
    });
  });

  describe("/event", () => {
    it("creates event", () => {
      cy.login();
      cy.visit("/");
      cy.wait("@session");

      cy.k("event-popover-button").click();
      cy.k("event-add-button").click();
      cy.get("input[name=eventName]").type(eventName);
      cy.get('button[aria-label="minDate"]').click();
      cy.get(".react-datepicker__time-list-item")
        .filter(":visible")
        .first()
        .click();
      cy.get(".react-select-container").click();
      cy.get(".react-select__option").contains(newOrgName).click();
      cy.get("form").submit();
      cy.location("pathname", { timeout: 20000 }).should(
        "include",
        `/${eventUrl}`
      );
      cy.k("eventSettings").should("exist");
      cy.k(newOrgUrl)
        .should("have.length", 1)
        .should("have.attr", "href")
        .and("include", `/${newOrgUrl}`);
    });

    it("updates eventName", () => {
      cy.login();
      cy.visit(`/${eventUrl}`);
      cy.wait("@session");

      cy.k("eventSettings").click();
      cy.k("eventEdit").click();
      cy.wait(5000);
      cy.get("input#eventName").type("t");
      cy.get("form").submit();
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        `/${newEventUrl}`
      );
    });

    it("updates event description", () => {
      cy.login();
      cy.visit(`/${newEventUrl}`);
      cy.wait("@session");

      cy.k("eventSettings").click();
      cy.k("eventEdit").click();
      cy.wait(5000);
      cy.setTinyMceContent("rteditor-0", "c");
      cy.get("form").submit();
      cy.wait(5000);
      cy.get(".rteditor").contains(eventDescription + "c");
    });
  });

  describe("/org with password", () => {
    it("creates org with password", () => {
      cy.login();
      cy.visit("/");
      cy.wait("@session");

      cy.k("org-popover-button").click();
      cy.k("org-add-button").click();
      cy.get("input[name=orgName]").type("1234");
      cy.get("select[name=orgType]").select(OrgTypesV[OrgTypes.ASSO]);
      cy.get("select[name=orgVisibility]").select(Visibility.PRIVATE);
      cy.get("input[name=orgPassword]").type("1234");
      cy.get("input[name=orgPasswordConfirm]").type("1234");
      cy.get("form").submit();
      cy.location("pathname", { timeout: 20000 }).should("include", "1234");
    });

    it("logs into org", () => {
      cy.logout();
      cy.visit("/1234");
      cy.get("input[name=orgPassword]").type("12345");
      cy.get("form").submit();
      cy.get("div[role=alert]").should("exist");
      cy.get("input[name=orgPassword]").type("1234");
      cy.get("form").submit();
      cy.get(".chakra-tabs__tablist").contains("Accueil");
      cy.get(".chakra-tabs__tablist").contains("Événements");
      cy.get(".chakra-tabs__tablist").contains("Projets");
      cy.get(".chakra-tabs__tablist").contains("Discussions");
      cy.get(".chakra-tabs__tablist").contains("Galerie");
    });
  });
});
