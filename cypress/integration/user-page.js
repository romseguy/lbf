const k = key => `[data-cy=${key}]`

describe("UserPage", () => {
  // it("should provide a valid session", () => {
  //   // Call your custom cypress command
  //   cy.login();
  //   // Visit a route in order to allow cypress to actually set the cookie
  //   cy.visit("/");
  //   // Wait until the intercepted request is ready
  //   cy.wait("@session");
  //   // This is where you can now add assertions
  //   cy.get(k("event-popover-button")).should("exist");
  // });

  // it("should access user page", () => {
  //   cy.login();
  //   cy.visit("/romain")
  //   cy.wait("@session");
  //   cy.get(k("user-edit")).should("exist");
  // })

  // it("should have a link to user page", () => {
  //   cy.get(k("avatar-button")).click()
  //   cy.get(k("my-page")).should("have.attr", "href").and("include", "/romain")
  // })

  it("should change user name back and forth", () => {
    cy.login();
    cy.visit("/romain")
    cy.wait("@session");

    cy.get(k("user-edit")).click()
    cy.get(k("username-input")).should("have.value", "romain").clear().type("r")

    //cy.login();
    cy.get("form").submit();
    //cy.wait("@session");

    cy.wait(2000)
    cy.location("pathname", { timeout: 10000 }).should(
      "include",
      `/r`
    );
    // cy.get(k("avatar-button")).click()
    // cy.get(k("my-page")).should("have.attr", "href").and("include", "/r")

    cy.get(k("user-edit")).click()
    cy.get(k("username-input")).should("have.value", "r")
    cy.get(k("username-input")).clear().type("romain")

    // cy.login();
    cy.get("form").submit();
    // cy.wait("@session");

    cy.location("pathname", { timeout: 10000 }).should(
      "include",
      `/romain`
    );

    // cy.get(k("avatar-button")).click()
    // cy.get(k("my-page")).should("have.attr", "href").and("include", "/r")

    cy.get(k("user-edit")).click()
    cy.get(k("username-input")).should("have.value", "romain")
    cy.get(k("user-edit")).click()
  })

  // it("should change email back and forth", () => {
  //   cy.login();
  //   cy.visit("/romain")
  //   cy.wait("@session");

  //   cy.get(k("user-edit")).click()
  //   cy.get(k("email-input")).should("have.value", "rom.seguy@lilo.org").clear().type("romseguy@lilo.org")

  //   //cy.login();
  //   cy.get("form").submit();
  //   //cy.wait("@session");

  //   cy.wait(2000)
  //   cy.get(k("user-edit")).click()
  //   cy.get(k("email-input")).should("have.value", "romseguy@lilo.org")
  //   cy.get(k("email-input")).clear().type("rom.seguy@lilo.org")

  //   cy.get("form").submit();

  //   cy.wait(2000)
  //   cy.get(k("user-edit")).click()
  //   cy.get(k("email-input")).should("have.value", "rom.seguy@lilo.org")
  // })
});