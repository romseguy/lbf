import { topicName, message, message2, userName } from "../fixtures/env";

describe("/forum", () => {
  it("resets topics collection", () => {
    cy.request("http://localhost:3004/api/reset-db?list=topics");
  });

  it("should add topic", () => {
    cy.login();
    cy.visit("/forum");
    cy.wait("@session");
    cy.k("add-topic").click();
    cy.get("#topicName").type(topicName);
    cy.get("form").submit();
    cy.k("topic-unsubscribe").should("exist");
    cy.k("topic").contains(topicName);
    cy.k("topic").contains(userName);
    cy.k("topic").first().click();
  });

  it("should unsubscribe from topic", () => {
    cy.k("topic-unsubscribe").first().click();
    cy.k("topic-subscribers").should("not.contain", userName);
  });

  it("should subscribe to topic", () => {
    cy.k("topic-subscribe").first().click();
    cy.k("topic-subscribers").contains(userName);
  });

  it("should answer to topic", () => {
    cy.setTinyMceContent("rteditor-1", message);
    cy.get("form").submit();
    cy.wait(5000);
    cy.get(".rteditor").contains(message);
    cy.k("topic-message")
      .find("a")
      .should("have.attr", "href")
      .and("include", `/${userName}`);
  });

  it("should edit answer back and forth", () => {
    cy.k("topic-message-edit").click();
    cy.setTinyMceContent("rteditor-2", message2);
    cy.k("topic-message-edit-submit").click();
    //cy.wait(5000);
    cy.get(".rteditor").contains(message2);
    cy.k("topic-message-edit").click();
    cy.setTinyMceContent("rteditor-2", message);
    cy.k("topic-message-edit-submit").click();
    cy.get(".rteditor").contains(message);
  });

  it("should open url requested topic", () => {
    cy.login();
    cy.visit(`/forum/${topicName}`);
    cy.wait("@session");
    //   cy.k("topic-subscribers").contains(userName)
    cy.k("topic-message").contains(message);
  });

  it("should delete topic", () => {
    cy.k("delete-topic").first().click();
    cy.wait(2000);
    cy.k("delete-button-submit").click();
  });
});
