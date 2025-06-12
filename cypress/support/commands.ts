// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
// ***********************************************
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    // Add custom commands here
    // Example: login(email: string, password: string): Chainable<void>
  }
}

// Example custom command
// Cypress.Commands.add('login', (email: string, password: string) => {
//   cy.visit('/login');
//   cy.get('[data-cy=email]').type(email);
//   cy.get('[data-cy=password]').type(password);
//   cy.get('[data-cy=submit]').click();
// });
