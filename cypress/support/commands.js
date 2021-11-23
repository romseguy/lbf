Cypress.Commands.add("login", () => {
  cy.intercept("/api/auth/session", { fixture: "session.json" }).as("session");

  // Set the cookie for cypress.
  // It has to be a valid cookie so next-auth can decrypt it and confirm its validity.
  // This step can probably/hopefully be improved.
  // We are currently unsure about this part.
  // We need to refresh this cookie once in a while.
  // We are unsure if this is true and if true, when it needs to be refreshed.
  cy.setCookie("next-auth.session-token", "eyJhbGciOiJIUzUxMiJ9.eyJlbWFpbCI6InJvbS5zZWd1eUBsaWxvLm9yZyIsImlhdCI6MTYzNzY2MDgyMSwiZXhwIjoxNjQwMjUyODIxfQ.7uBuHakQkkgeqSMkrHl03YPr05qJvUrlrZL0kNtpLow_RHYS5N5IfIPQeZ_3A2KFcuGuQa7hReKIodljTi10LA");
  Cypress.Cookies.preserveOnce("next-auth.session-token");
});