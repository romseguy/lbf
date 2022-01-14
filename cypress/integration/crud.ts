import { OrgTypes, OrgTypesV } from "models/Org";

const userName = "romain";

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

  it("lands", () => {
    cy.visit("/");
  });

  // it("404", () => {
  //   cy.visit("/test");
  //   cy.location("pathname", { timeout: 10000 }).should("eq", "/");
  // });

  describe("CREATE", () => {
    it("adds org", () => {
      cy.k("org-popover-button").click();
      cy.k("org-add-button").click();
      cy.get("input[name=orgName]").type(orgName);
      cy.get("select[name=orgType]").select(OrgTypesV[OrgTypes.ASSO]);
      // cy.get("#orgAddress-label").then(($label) => {
      //   if ($label.find("span").length) {
      //     // address is required
      //     cy.get("input#orgAddress").type("Comiac");
      //     cy.get(".suggestions[role=list] li:first").click();
      //     cy.get("input#orgAddress").should("have.value", "Comiac, France");
      //     cy.wait(1000);
      //   }
      // });
      cy.get("form").submit();
      cy.location("pathname", { timeout: 20000 }).should(
        "include",
        `/${orgUrl}`
      );
      cy.k("orgSettings").should("have.length", 1);
    });

    it("adds event", () => {
      if (!skipVisit) cy.visit(`/`);

      cy.k("event-popover-button").click();
      cy.k("event-add-button").click();
      cy.get("input[name=eventName]").type(eventName);
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
      // cy.get("#eventAddress-label").then(($label) => {
      //   if ($label.find("span").length) {
      //     // address is required
      //     cy.get("input#eventAddress").type("Comiac");
      //     cy.get(".suggestions[role=list] li:first").click();
      //     cy.get("input#eventAddress").should("have.value", "Comiac, France");
      //     cy.wait(1000);
      //   }
      // });
      cy.get(".react-select-container").click();
      cy.get(".react-select__option").contains(orgName).click();
      cy.get("form").submit();
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        `/${eventUrl}`
      );
      cy.k("eventSettings").should("have.length", 1);
      cy.k(`${orgUrl}-link`)
        .should("have.length", 1)
        .should("have.attr", "href")
        .and("include", `/${orgUrl}`);
      // cy.k("homeLink").click();
      // cy.location("pathname", { timeout: 10000 }).should("include", "/");
      // cy.findByRole("link", { name: eventName })
      //   .should("have.length", 1)
      //   .should("have.attr", "href")
      //   .and("include", `/${eventName}`);
      // cy.findByText("Comiac").should("exist");
    });
  });

  describe("/org", () => {
    it("lands", () => {
      cy.visit(`/${orgName}`);
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        `/${orgUrl}`
      );
      cy.k("orgSettings").should("have.length", 1);
    });

    it("updates orgName", () => {
      if (!skipVisit) cy.visit(`/${orgUrl}`);

      cy.k("orgSettings").click();
      cy.k("orgEdit").click();
      cy.wait(10000);
      cy.get("input[name=orgName]").type("t");
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
      cy.k("eventSettings").should("have.length", 1);
    });

    it("updates eventName", () => {
      if (!skipVisit) {
        cy.visit(`/${eventName}`);
      }
      cy.k("eventSettings").click();
      cy.k("eventEdit").click();
      cy.wait(10000);
      cy.get("input#eventName").type("t");
      cy.get("form").submit();
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        `/${newEventUrl}`
      );
    });

    it("updates event description", () => {
      if (!skipVisit) {
        cy.visit(`/${eventUrl}`);
      }
      cy.k("eventSettings").click();
      cy.k("eventEdit").click();
      cy.wait(10000);
      cy.setTinyMceContent("rteditor", "c");
      cy.get("form").submit();
      cy.wait(10000);
      cy.get(".rteditor").contains(eventDescription + "c");
    });
  });
});

describe("/user", () => {
  it("lands", () => {
    cy.visit(`/${userName}`);
  });
});
