import { newOrgUrl, userName } from "../fixtures/env";

const eventName = "testeventt";
const topicName = "t";
const orgUrl = "1234";

describe("topics", () => {
  it("resets topics", () => {
    cy.request("http://localhost:3004/api/reset-db?list=topics");
  });

  describe("org topics", () => {
    it("adds topic", () => {
      cy.login();
      cy.visit(`/${orgUrl}/discussions`);
      cy.wait("@session");

      cy.k("topic-add-button").click();
      cy.get("input[name=topicName]").type(topicName);
      cy.get("form").submit();
      cy.k("topic-list-item").contains(topicName);
      cy.k("topic-list-item").contains(userName);
      cy.k("topic-list-item-unsubscribe").should("exist");
    });

    it("unsubscribes and subscribes from topic", () => {
      cy.k("topic-list-item-unsubscribe").click();
      cy.k("topic-list-item-subscribe").should("exist");
      cy.k("topic-list-item-subscribe").click();
      cy.k("topic-list-item-unsubscribe").should("exist");
    });

    it("adds topic message", () => {
      cy.login();
      cy.visit(`/${orgUrl}/discussions/${topicName}`);
      cy.wait("@session");

      cy.get("#rteditor-0").should("exist");
      cy.wait(2000);
      cy.setTinyMceContent("rteditor-0", "c");
      cy.wait(2000);
      cy.get("form").submit();
      cy.k("topic-message").contains(userName);
      cy.k("topic-message").contains("c");
    });

    it("removes topic", () => {
      cy.login();
      cy.visit(`/${orgUrl}/discussions`);
      cy.wait("@session");

      cy.k("topic-list-item-delete").click();
      cy.k("delete-submit-button").click();
      cy.k("topic-list").contains(topicName).should("not.exist");
    });
  });

  // describe("event topics", () => {
  //   it("adds topic", () => {
  //     cy.visit(`/${eventName}`);
  //     cy.wait(2000);
  //     //cy.k("eventTab-Discussions").click();
  //     cy.k("add-topic").click();
  //     cy.get("#topicName").type(topicName);
  //     cy.k("addTopic").click();
  //     cy.k("topic-list-item").contains(topicName);
  //     cy.k("topic-list-item").contains(userName);
  //     cy.k("topic-list-item-unsubscribe").should("exist");
  //   });

  //   it("unsubscribes and subscribes from topic", () => {
  //     cy.k("topic-list-item-unsubscribe").click();
  //     cy.wait(5000);
  //     cy.k("topic-list-item-subscribe").should("exist");
  //     cy.wait(5000);
  //     cy.k("topic-list-item-subscribe").click();
  //   });

  //   it("adds topic messages", () => {
  //     cy.k("topic").click();
  //     cy.get(".ql-editor.ql-blank").type("c");
  //     cy.get("form").submit();
  //     cy.k("topicMessage").contains(userName);
  //     cy.k("topicMessage").contains("c");
  //   });

  //   it("removes topic", () => {
  //     cy.k("deleteTopic").click();
  //     cy.get("#topicName").type(topicName);
  //     cy.k("deleteButtonSubmit").click();
  //     cy.k("topicList").contains(topicName).should("not.exist");
  //   });
  // });
});
