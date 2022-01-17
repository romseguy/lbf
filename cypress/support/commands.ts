import "@foreachbe/cypress-tinymce";

declare global {
  namespace Cypress {
    interface Chainable {
      k: typeof dataCyCommand;
      login: typeof loginCommand;
      logout: typeof logoutCommand;
      setTinyMceContent: (id: string, value: string) => void;
    }
  }
}

function dataCyCommand(value: string) {
  return cy.get(`[data-cy=${value}]`);
}

function loginCommand() {
  cy.intercept("/api/auth/session", { fixture: "session.json" }).as("session");
  cy.setCookie(
    "next-auth.session-token",
    "eyJhbGciOiJIUzUxMiJ9.eyJlbWFpbCI6InJvbS5zZWd1eUBsaWxvLm9yZyIsImlhdCI6MTYzNzY2MDgyMSwiZXhwIjoxNjQwMjUyODIxfQ.7uBuHakQkkgeqSMkrHl03YPr05qJvUrlrZL0kNtpLow_RHYS5N5IfIPQeZ_3A2KFcuGuQa7hReKIodljTi10LA"
  );
  Cypress.Cookies.preserveOnce("next-auth.session-token");
}

function logoutCommand() {
  cy.intercept("/api/auth/session", { fixture: null }).as("session");
  cy.setCookie("next-auth.session-token", "null");
  Cypress.Cookies.preserveOnce("next-auth.session-token");
}

Cypress.Commands.add("k", dataCyCommand);
Cypress.Commands.add("login", loginCommand);
Cypress.Commands.add("logout", logoutCommand);
