import { topicName, message, message2, userName } from "../fixtures/env";

describe("/forum", () => {
  it("resets topics collection", () => {
    cy.request("http://localhost:3004/api/reset-db?list=topics");
  });

  it("should add topic", () => {
    cy.login();
    cy.visit("/forum");
    cy.wait("@session");
    cy.k("topic-add-button").click();
    cy.get("#topicName").type(topicName);
    cy.get("form").submit();
    cy.k("topic-list-item-unsubscribe").should("exist");
    cy.k("topic-list-item").contains(topicName);
    cy.k("topic-list-item").contains(userName);
    cy.k("topic-list-item").first().click();
  });

  it("should subscribe back and forth", () => {
    cy.k("topic-list-item-unsubscribe").first().click();
    cy.k("topic-subscribers").should("not.contain", userName);
    cy.k("topic-list-item-subscribe").first().click();
    cy.k("topic-subscribers").contains(userName);
  });

  it("should answer to topic", () => {
    cy.login();
    cy.visit("/forum");
    cy.wait("@session");
    cy.k("topic-list-item").first().click();
    cy.wait(5000);

    cy.setTinyMceContent("rteditor-0", message);
    cy.get("form").submit();
    //cy.wait(5000);

    cy.get(".rteditor").contains(message);
    cy.k("topic-message")
      .find("a")
      .should("have.attr", "href")
      .and("include", `/${userName}`);
  });

  it("should edit answer back and forth", () => {
    cy.login();
    cy.visit("/forum");
    cy.wait("@session");
    cy.k("topic-list-item").first().click();

    cy.k("topic-message-edit").click();
    cy.wait(5000);

    cy.setTinyMceContent("rteditor-1", message2);
    cy.k("topic-message-edit-submit").click();
    cy.get(".rteditor").contains(message2);

    cy.k("topic-message-edit").click();
    cy.wait(5000);

    cy.setTinyMceContent("rteditor-2", message);
    cy.k("topic-message-edit-submit").click();
    cy.get(".rteditor").contains(message);
  });

  it("should open url requested topic", () => {
    cy.login();
    cy.visit(`/forum/${topicName}`);
    cy.wait("@session");
    cy.k("topic-message").contains(message);
  });

  it("should delete topic", () => {
    cy.k("topic-list-item-delete").first().click();
    cy.wait(2000);
    cy.k("delete-submit-button").click();
  });
});
