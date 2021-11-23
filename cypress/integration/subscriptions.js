const k = key => `[data-cy=${key}]`
const orgName = "testt";
const email = "r@r.com";

describe("CRUD", () => {
  // it("adds subscriber", () => {
  //   cy.visit(`/${orgName}`);
  //   cy.get("[data-cy=orgSettings]").click();
  //   cy.get("[data-cy=orgAddSubscribers]").click();
  //   cy.get("#emailList").type(email);
  //   cy.get("[data-cy=orgAddSubscribersSubmit]").click();
  //   cy.get("main").contains(email);
  // });

  // it("unsubscribes", () => {
  //   cy.get("[data-cy=orgSubscriberUnsubscribe]").click();
  //   cy.wait(5000);
  //   cy.get("[data-cy=orgSubscriberFollow]").should("exist");
  //   cy.get("[data-cy=orgSubscriberSubscribe]").should("exist");
  // });

  // it("subscribes as follower", () => {
  //   cy.get("[data-cy=orgSubscriberFollow]").click();
  //   cy.wait(5000);
  //   cy.get("[data-cy=orgSubscriberUnfollow]").should("exist");
  //   cy.get("[data-cy=orgSubscriberSubscribe]").should("exist");
  // });

  // it("unfollows", () => {
  //   cy.get("[data-cy=orgSubscriberUnfollow]").click();
  //   cy.wait(5000);
  //   cy.get("[data-cy=orgSubscriberFollow]").should("exist");
  //   cy.get("[data-cy=orgSubscriberSubscribe]").should("exist");

  //   cy.get("[data-cy=orgSubscriberFollow]").click();
  // });

  // it("subscribes", () => {
  //   cy.get("[data-cy=orgSubscriberSubscribe]").click();
  //   cy.wait(5000);
  //   cy.get("[data-cy=orgSubscriberUnfollow]").should("exist");
  //   cy.get("[data-cy=orgSubscriberUnsubscribe]").should("exist");
  // });

  // it("removes subscription", () => {
  //   cy.get("[data-cy=orgUnsubscribe]").click();
  //   cy.get("main").contains(email).should("not.exist");
  // });

});
