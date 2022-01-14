const k = key => cy.get(`[data-cy=${key}]`)

const orgName = "testt";
const eventName = "testeventt";
const topicName = "t";
const userName = "romseguy8933";

describe(" topics", () => {
  describe("org topics", () => {
    it("adds topic", () => {
      cy.visit(`/${orgName}`);
      cy.wait(2000);
      k("orgTab-Discussions").click();
      k("add-topic").click();
      cy.get("#topicName").type(topicName);
      k("addTopic").click();
      k("topicHeader").contains(topicName);
      k("topicHeader").contains(userName);
      k("topicUnsubscribe").should("exist");
    });

    it("unsubscribes and subscribes from topic", () => {
      k("topicUnsubscribe").click();
      cy.wait(5000);
      k("topicSubscribe").should("exist");
      cy.wait(5000);
      k("topicSubscribe").click();
    });

    it("adds topic messages", () => {
      k("topic").click();
      cy.get(".ql-editor.ql-blank").type("c");
      cy.get("form").submit();
      k("topicMessage").contains(userName);
      k("topicMessage").contains("c");
    });

    it("removes topic", () => {
      k("deleteTopic").click();
      cy.get("#topicName").type(topicName);
      k("deleteButtonSubmit").click();
      k("topicList").contains(topicName).should("not.exist");
    });
  });

  describe("event topics", () => {
    it("adds topic", () => {
      cy.visit(`/${eventName}`);
      cy.wait(2000);
      //k("eventTab-Discussions").click();
      k("add-topic").click();
      cy.get("#topicName").type(topicName);
      k("addTopic").click();
      k("topicHeader").contains(topicName);
      k("topicHeader").contains(userName);
      k("topicUnsubscribe").should("exist");
    });

    it("unsubscribes and subscribes from topic", () => {
      k("topicUnsubscribe").click();
      cy.wait(5000);
      k("topicSubscribe").should("exist");
      cy.wait(5000);
      k("topicSubscribe").click();
    });

    it("adds topic messages", () => {
      k("topic").click();
      cy.get(".ql-editor.ql-blank").type("c");
      cy.get("form").submit();
      k("topicMessage").contains(userName);
      k("topicMessage").contains("c");
    });

    it("removes topic", () => {
      k("deleteTopic").click();
      cy.get("#topicName").type(topicName);
      k("deleteButtonSubmit").click();
      k("topicList").contains(topicName).should("not.exist");
    });
  });
});
