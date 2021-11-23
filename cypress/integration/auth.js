const k = key => `[data-cy=${key}]`

describe("AUTH", () => {
  beforeEach(() => { });

  it("should display login form", () => {
    cy.visit("/?login");
    cy.get(k("email-input")).should("exist")
    cy.get(k("password-input")).should("exist")
  });

  it("should log in", () => {
    cy.get(k("email-input")).type("rom.seguy@lilo.org")
    cy.get(k("password-input")).type("wxcv")
    cy.get(k("submit-button")).click()
    cy.wait(5000)
    cy.get(k("event-popover-button")).should("exist");
  })

  // it("should log out", () => {
  //   cy.get(k("avatar-button")).click()
  //   cy.wait(5000)
  //   cy.get(k("logout")).should("exist")
  //   cy.get(k("logout")).click()
  //   cy.wait(5000)
  //   cy.get(k("event-popover-button")).should("not.exist");
  // })
})
