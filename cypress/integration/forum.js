describe("/forum", () => {
  it("should subscribe to topic", () => {
    cy.login();
    cy.visit("/forum")
    cy.wait("@session");
    cy.get(k("topic-subscribe")).first().click()
    cy.get(k("topic")).first().click()
    cy.get(k("topic-subscribers")).contains("romain")
    cy.get(k("topic-unsubscribe")).first().click()
    cy.get(k("topic-subscribers")).should("not.contain", "romain")
  })
})