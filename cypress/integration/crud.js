const { getDate, getMonth, format, addDays } = require("date-fns");
import { fr } from "date-fns/locale";

const userName = "romseguy8933";
const eventName = "testevent";
const eventDescription = "";
const orgName = "test";
const skipVisit = true;

describe("CRUD", () => {
  beforeEach(() => {});

  it("404", () => {
    cy.visit("/t");
    cy.location("pathname", { timeout: 10000 }).should("eq", "/");
  });

  it("lands", () => {
    cy.request("http://localhost:3004/api/reset-db");
    cy.visit("/");
  });

  it("adds org", () => {
    cy.get("[data-cy=orgPopover]").click();
    cy.get("[data-cy=addOrg]").click();

    cy.get("input#orgName").type(orgName);
    cy.get("select#orgType").select("ASSOCIATION");
    cy.get("#orgAddress-label").then(($label) => {
      if ($label.find("span").length) {
        // address is required
        cy.get("input#orgAddress").type("Comiac");
        cy.get(".suggestions[role=list] li:first").click();
        cy.get("input#orgAddress").should("have.value", "Comiac, France");
        cy.wait(1000);
      }
    });

    cy.get("[data-cy=orgFormSubmit]").click();

    cy.location("pathname", { timeout: 20000 }).should(
      "include",
      `/${orgName}`
    );
    cy.get("[data-cy=orgSettings]").should("have.length", 1);
    cy.get('button[aria-label="Supprimer"]').should("have.length", 1);
  });

  it("adds event", () => {
    if (!skipVisit) cy.visit("/");
    else {
      cy.wait(3000);
      cy.get("[data-cy=homeLink]").click();
    }

    cy.get("[data-cy=addEvent]").click();

    cy.get("input#eventName").type(eventName);

    cy.get('button[aria-label="minDate"]').click();
    // const today = new Date();
    // let name = "Choose " + format(today, "eeee d MMMM yyyy", { locale: fr });
    // cy.findByRole("button", {
    //   name // Choose jeudi 1 juillet 2021
    // }).click();
    cy.get(".react-datepicker__time-list-item")
      .filter(":visible")
      .first()
      .click();

    // cy.get('button[aria-label="maxDate"]').click();
    // const tomorrow = addDays(today, 1);
    // name = "Choose " + format(tomorrow, "eeee d MMMM yyyy", { locale: fr });
    // cy.findByRole("button", {
    //   name // Choose jeudi 2 juillet 2021
    // }).click();
    // cy.get(".react-datepicker__time-list-item")
    //   .filter(":visible")
    //   .first()
    //   .click();

    cy.get("#eventAddress-label").then(($label) => {
      if ($label.find("span").length) {
        // address is required
        cy.get("input#eventAddress").type("Comiac");
        cy.get(".suggestions[role=list] li:first").click();
        cy.get("input#eventAddress").should("have.value", "Comiac, France");
        cy.wait(1000);
      }
    });

    cy.get('input[name="eventCity"]').should("have.value", "Comiac");

    cy.get(".react-select-container").click();
    cy.get(".react-select__option").contains(orgName).click();

    cy.get("[data-cy=eventFormSubmit").click();

    cy.location("pathname", { timeout: 10000 }).should(
      "include",
      `/${eventName}`
    );

    cy.get("[data-cy=eventSettings]").should("have.length", 1);

    cy.get(`[data-cy=eventCreatedBy-${orgName}]`)
      .should("have.length", 1)
      .should("have.attr", "href")
      .and("include", `/${orgName}`);

    // cy.get("[data-cy=homeLink]").click();

    // cy.location("pathname", { timeout: 10000 }).should("include", "/");

    // cy.findByRole("link", { name: eventName })
    //   .should("have.length", 1)
    //   .should("have.attr", "href")
    //   .and("include", `/${eventName}`);

    // cy.findByText("Comiac").should("exist");
  });

  it("fails adding org with already used name", () => {
    if (!skipVisit) {
      cy.visit("/");
    }

    cy.get("[data-cy=orgPopover]").click();
    cy.get("[data-cy=addOrg]").click();

    cy.get("input#orgName").type(orgName);
    cy.get("select#orgType").select("ASSOCIATION");
    cy.get("#orgAddress-label").then(($label) => {
      if ($label.find("span").length) {
        // address is required
        cy.get("input#orgAddress").type("Comiac");
        cy.get(".suggestions[role=list] li:first").click();
        cy.get("input#orgAddress").should("have.value", "Comiac, France");
        cy.wait(1000);
      }
    });

    cy.get("form").submit();
    cy.get("#orgName-feedback").should("exist");

    if (skipVisit) {
      cy.get("[data-cy=orgPopoverCloseButton]").click();
    }
  });

  it("fails adding org with already used name by user", () => {
    if (!skipVisit) {
      cy.visit("/");
    }

    cy.get("[data-cy=orgPopover]").click();
    cy.get("[data-cy=addOrg]").click();

    cy.get("input#orgName").type(userName);
    cy.get("select#orgType").select("ASSOCIATION");
    cy.get("#orgAddress-label").then(($label) => {
      if ($label.find("span").length) {
        // address is required
        cy.get("input#orgAddress").type("Comiac");
        cy.get(".suggestions[role=list] li:first").click();
        cy.get("input#orgAddress").should("have.value", "Comiac, France");
        cy.wait(1000);
      }
    });

    cy.get("form").submit();
    cy.get("#orgName-feedback").should("exist");

    if (skipVisit) {
      cy.get("[data-cy=orgPopoverCloseButton]").click();
    }
  });

  it("fails adding org with already used name by event", () => {
    if (!skipVisit) {
      cy.visit("/");
    }

    cy.get("[data-cy=orgPopover]").click();
    cy.get("[data-cy=addOrg]").click();

    cy.get("input#orgName").type(eventName);
    cy.get("select#orgType").select("ASSOCIATION");
    cy.get("#orgAddress-label").then(($label) => {
      if ($label.find("span").length) {
        // address is required
        cy.get("input#orgAddress").type("Comiac");
        cy.get(".suggestions[role=list] li:first").click();
        cy.get("input#orgAddress").should("have.value", "Comiac, France");
        cy.wait(1000);
      }
    });

    cy.get("form").submit();
    cy.get("#orgName-feedback").should("exist");

    if (skipVisit) {
      cy.get("[data-cy=orgPopoverCloseButton]").click();
    }
  });

  describe("/org", () => {
    it("lands", () => {
      cy.visit(`/${orgName}`);
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        `/${orgName}`
      );
      cy.get("[data-cy=orgSettings]").should("have.length", 1);
    });

    it("updates orgName", () => {
      if (!skipVisit) cy.visit(`/${orgName}`);

      const newOrgName = orgName + "t";
      cy.get("[data-cy=orgSettings]").click();
      cy.get("[data-cy=orgEdit]").click();
      cy.wait(10000);
      cy.get("input#orgName").type("t");
      cy.get("form").submit();
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        `/${newOrgName}`
      );
    });
  });

  describe("/event", () => {
    it("lands", () => {
      cy.visit(`/${eventName}`);
      cy.get("[data-cy=eventEdit]").should("have.length", 1);
      cy.get('button[aria-label="Supprimer"]').should("have.length", 1);
    });

    it("updates event description", () => {
      if (!skipVisit) {
        cy.visit(`/${eventName}`);
      }
      cy.get("[data-cy=eventSettings]").click();
      cy.get("[data-cy=eventEdit]").click();
      cy.wait(10000);
      cy.get(".ql-editor.ql-blank").type("c");
      cy.get("form").submit();
      cy.wait(10000);
      cy.get(".ql-editor").contains(eventDescription + "c");
    });

    it("updates eventName", () => {
      if (!skipVisit) {
        cy.visit(`/${eventName}`);
      }
      const newEventName = eventName + "t";
      cy.get("[data-cy=eventSettings]").click();
      cy.get("[data-cy=eventEdit]").click();
      cy.wait(10000);
      cy.get("input#eventName").type("t");
      cy.get("form").submit();
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        `/${newEventName}`
      );
    });
  });

  describe("/user", () => {
    it("lands", () => {
      cy.visit(`/${userName}`);
    });
  });
});
