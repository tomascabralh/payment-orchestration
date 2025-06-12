describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the home page", () => {
    cy.get("body").should("be.visible");
  });

  it("should have a working navigation", () => {
    // Add your navigation tests here
    // Example:
    // cy.get('[data-cy=nav-link]').click();
    // cy.url().should('include', '/some-page');
  });
});
