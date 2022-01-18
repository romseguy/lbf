import { email, newOrgUrl } from "../fixtures/env";

const add = () => {
  cy.k("orgAddSubscribers").click();
  cy.get("#emailList").type(email);
  cy.k("subscriber-checkbox").click();
  cy.get("form").submit();
  cy.wait(1000);
  cy.k("subscriptions-list").contains(email);
  cy.k("orgSubscriberUnsubscribe").should("exist");
  cy.k("orgSubscriberFollow").should("exist");
};

describe("CRUD subscriptions", () => {
  it("lands", () => {
    cy.login();
    cy.visit(`/${newOrgUrl}`);
    cy.wait("@session");
  });

  it("adds subscriber", () => {
    cy.k("orgSettings").click();
    add();
  });

  it("removes subscription", () => {
    cy.k("orgUnsubscribe").click();
    cy.get("main").contains(email).should("not.exist");
  });

  it("unsubscribes", () => {
    add();
    cy.k("orgSubscriberUnsubscribe").click();
    cy.wait(5000);
    cy.k("orgSubscriberFollow").should("exist");
    cy.k("orgSubscriberSubscribe").should("exist");
  });

  it("subscribes as follower", () => {
    cy.k("orgSubscriberFollow").click();
    cy.wait(5000);
    cy.k("orgSubscriberUnfollow").should("exist");
    cy.k("orgSubscriberSubscribe").should("exist");
  });

  it("unfollows", () => {
    cy.k("orgSubscriberUnfollow").click();
    cy.wait(5000);
    cy.k("orgSubscriberFollow").should("exist");
    cy.k("orgSubscriberSubscribe").should("exist");

    cy.k("orgSubscriberFollow").click();
  });

  it("subscribes as subscriber", () => {
    cy.k("orgSubscriberSubscribe").click();
    cy.wait(5000);
    cy.k("orgSubscriberUnfollow").should("exist");
    cy.k("orgSubscriberUnsubscribe").should("exist");
  });
});
