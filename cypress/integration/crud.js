import { OrgTypes, OrgTypesV } from "models/Org";

const userName = "romseguy8933";

const eventName = "test event";
const eventUrl = "test_event";
const newEventUrl = eventUrl + "t";
const eventDescription = "";

const orgName = "test test";
const orgUrl = "test_test";
const newOrgUrl = orgUrl + "t";

const skipVisit = true;

describe("CRUD", () => {
  beforeEach(() => {});

  it("resets db", () => {
    cy.request("http://localhost:3004/api/reset-db");
  });

  // it("lands", () => {
  //   cy.visit("/");
  // });

  it("404", () => {
    cy.visit("/test");
    cy.location("pathname", { timeout: 10000 }).should("eq", "/");
  });

  // it("logins", () => {
  //   cy.visit("/?noLogin");
  //   cy.get("[data-cy=login]").click();
  //   cy.get("#email").type("rom.seguy@lilo.org");
  //   cy.get("#password").type("wxcv");
  //   cy.get("[data-cy=loginFormSubmit]").click();
  //   cy.get("[data-cy=orgPopover]").should("exist");
  // });

  describe("CREATE", () => {
    it("adds org", () => {
      cy.get("[data-cy=orgPopover]").click();
      cy.get("[data-cy=addOrg]").click();
      cy.get("input#orgName").type(orgName);
      cy.get("select#orgType").select(OrgTypesV[OrgTypes.ASSO]);
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
      cy.get(".react-select-container").click();
      cy.get(".react-select__option").contains(orgName).click();
      cy.get("[data-cy=eventFormSubmit").click();
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        `/${eventUrl}`
      );
      cy.get("[data-cy=eventSettings]").should("have.length", 1);
      cy.get(`[data-cy=eventCreatedBy-${orgName}]`)
        .should("have.length", 1)
        .should("have.attr", "href")
        .and("include", `/${orgUrl}`);
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
      cy.get("select#orgType").select(OrgTypesV[OrgTypes.ASSO]);
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
      cy.get("select#orgType").select(OrgTypesV[OrgTypes.ASSO]);
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
      cy.get("select#orgType").select(OrgTypesV[OrgTypes.ASSO]);
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
  });

  describe("/org", () => {
    it("lands", () => {
      cy.visit(`/${orgName}`);
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        `/${orgUrl}`
      );
      cy.get("[data-cy=orgSettings]").should("have.length", 1);
    });

    it("updates orgName", () => {
      if (!skipVisit) cy.visit(`/${orgUrl}`);

      cy.get("[data-cy=orgSettings]").click();
      cy.get("[data-cy=orgEdit]").click();
      cy.wait(10000);
      cy.get("input#orgName").type("t");
      cy.get("form").submit();
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        `/${newOrgUrl}`
      );
    });
  });

  describe("/event", () => {
    it("lands", () => {
      cy.visit(`/${eventUrl}`);
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        `/${eventUrl}`
      );
      cy.get("[data-cy=eventSettings]").should("have.length", 1);
    });

    it("updates event description", () => {
      if (!skipVisit) {
        cy.visit(`/${eventUrl}`);
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
      cy.get("[data-cy=eventSettings]").click();
      cy.get("[data-cy=eventEdit]").click();
      cy.wait(10000);
      cy.get("input#eventName").type("t");
      cy.get("form").submit();
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        `/${newEventUrl}`
      );
    });
  });
});

describe("/user", () => {
  it("lands", () => {
    cy.visit(`/${userName}`);
  });
});
