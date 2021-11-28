const k = key => `[data-cy=${key}]`
const topicName = "test";
const userName = "romain"
const message = "t"
const message2 = "s"

describe("/forum", () => {
  it("should add topic", () => {
    cy.login();
    cy.visit("/forum")
    cy.wait("@session");
    cy.get(k("add-topic")).click()
    cy.get("#topicName").type(topicName);
    cy.get("form").submit();
    cy.get(k("topic-unsubscribe")).should("exist")
    cy.get(k("topic")).contains(topicName)
    cy.get(k("topic")).contains(userName)
    cy.get(k("topic")).first().click()
  })

  it("should unsubscribe from topic", () => {
    cy.get(k("topic-unsubscribe")).first().click()
    cy.get(k("topic-subscribers")).should("not.contain", userName)
  })

  it("should subscribe to topic", () => {
    cy.get(k("topic-subscribe")).first().click()
    cy.get(k("topic-subscribers")).contains(userName)
  })

  it("should answer to topic", () => {
    cy.get(".ql-editor").type(message)
    cy.get("form").submit();
    cy.get(k("topic-message")).contains(message)
    cy.get(k("topic-message")).find("a").should("have.attr", "href").and("include", `/${userName}`)
  })

  it("should edit answer back and forth", () => {
    cy.get(k("topic-message-edit")).click()
    cy.get(k("topic-message")).find(".ql-editor").clear().type(message2)
    cy.get(k("topic-message-edit-submit")).click()
    cy.get(k("topic-message")).contains(message2)
    cy.get(k("topic-message-edit")).click()
    cy.get(k("topic-message")).find(".ql-editor").clear().type(message)
    cy.get(k("topic-message-edit-submit")).click()
    cy.get(k("topic-message")).contains(message)
  })

  it("should open url requested topic", () => {
    cy.login();
    cy.visit(`/forum/${topicName}`)
    cy.wait("@session");
    //   cy.get(k("topic-subscribers")).contains(userName)
    cy.get(k("topic-message")).contains(message)
  })

  it("should delete topic", () => {
    cy.get(k("delete-topic")).first().click()
    cy.wait(2000)
    cy.get(k("delete-button-submit")).click()
  })
})