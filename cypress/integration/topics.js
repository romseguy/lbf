const orgName = "testt";
const eventName = "testeventt";
const topicName = "t";
const userName = "romseguy8933";

describe(" topics", () => {
  describe("org topics", () => {
    it("adds topic", () => {
      cy.visit(`/${orgName}`);
      cy.wait(2000);
      cy.get("[data-cy=orgTab-Discussions]").click();
      cy.get("[data-cy=addTopicForm]").click();
      cy.get("#topicName").type(topicName);
      cy.get("[data-cy=addTopic]").click();
      cy.get("[data-cy=topicHeader]").contains(topicName);
      cy.get("[data-cy=topicHeader]").contains(userName);
      cy.get("[data-cy=topicUnsubscribe]").should("exist");
    });

    it("unsubscribes and subscribes from topic", () => {
      cy.get("[data-cy=topicUnsubscribe]").click();
      cy.wait(5000);
      cy.get("[data-cy=topicSubscribe]").should("exist");
      cy.wait(5000);
      cy.get("[data-cy=topicSubscribe]").click();
    });

    it("adds topic messages", () => {
      cy.get("[data-cy=topic]").click();
      cy.get(".ql-editor.ql-blank").type("c");
      cy.get("form").submit();
      cy.get("[data-cy=topicMessage]").contains(userName);
      cy.get("[data-cy=topicMessage]").contains("c");
    });

    it("removes topic", () => {
      cy.get("[data-cy=deleteTopic]").click();
      cy.get("#topicName").type(topicName);
      cy.get("[data-cy=deleteButtonSubmit]").click();
      cy.get("[data-cy=topicList]").contains(topicName).should("not.exist");
    });
  });

  describe("event topics", () => {
    it("adds topic", () => {
      cy.visit(`/${eventName}`);
      cy.wait(2000);
      //cy.get("[data-cy=eventTab-Discussions]").click();
      cy.get("[data-cy=addTopicForm]").click();
      cy.get("#topicName").type(topicName);
      cy.get("[data-cy=addTopic]").click();
      cy.get("[data-cy=topicHeader]").contains(topicName);
      cy.get("[data-cy=topicHeader]").contains(userName);
      cy.get("[data-cy=topicUnsubscribe]").should("exist");
    });

    it("unsubscribes and subscribes from topic", () => {
      cy.get("[data-cy=topicUnsubscribe]").click();
      cy.wait(5000);
      cy.get("[data-cy=topicSubscribe]").should("exist");
      cy.wait(5000);
      cy.get("[data-cy=topicSubscribe]").click();
    });

    it("adds topic messages", () => {
      cy.get("[data-cy=topic]").click();
      cy.get(".ql-editor.ql-blank").type("c");
      cy.get("form").submit();
      cy.get("[data-cy=topicMessage]").contains(userName);
      cy.get("[data-cy=topicMessage]").contains("c");
    });

    it("removes topic", () => {
      cy.get("[data-cy=deleteTopic]").click();
      cy.get("#topicName").type(topicName);
      cy.get("[data-cy=deleteButtonSubmit]").click();
      cy.get("[data-cy=topicList]").contains(topicName).should("not.exist");
    });
  });
});
