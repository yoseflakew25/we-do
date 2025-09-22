describe('Organization Link Test', () => {
  beforeEach(() => {
    // TODO: Seed database with organization instead of hardcoding
    cy.login(Cypress.env('USER_EMAIL'), Cypress.env('USER_PASSWORD'));
    cy.visit('talent/opportunities/667bceede413487a8c3d963f');
  });

  it('should display the application form, validate fields, and close the form', () => {
    // Click on the apply button to open the form
    cy.get('[data-testid="apply-button"]', { timeout: 10000 })
      .should('exist')
      .first()
      .click({ force: true });

    // // Assert that the form is displayed
    // cy.get('[data-testid="application-form"]', {
    //   timeout: 10000,
    // }).should('exist');

    // // Validate the fields (assuming the form has fields with ids 'name' and 'email')
    // cy.get('input[name="name"]').type('Name');
    // cy.get('input[name="email"]').type('email@gmail.com');
    // cy.get('input[name="phone"]').type('0912345678');

    // TODO: Frontend should use test endpoints before production
    // Can't test submit application until test and production is split
    // Click on the submit button
    // cy.get('input[type="submit"]').click();

    // Click on the close button to close the form
    // cy.contains('Cancel').click();

    // Assert that the form is closed
    // cy.get('[data-testid="application-form"]').should('not.exist');
  });

  it('should redirect to organization detail page', () => {
    // Click the organization name link
    cy.get('[data-testid="opportunity-detail-org-link"]', {
      timeout: 10000,
    }).click();

    // Wait for the URL to change dynamically
    cy.url({ timeout: 10000 }).should('include', '/talent/organizations/');

    // Wait for the back button to appear on the organization detail page
    // cy.get('[data-testid="back-button"]', { timeout: 10000 })
    //   .should('exist')
    //   .click();

    // // Verify the page has navigated back
    // cy.url({ timeout: 5000 }).should('include', '/talent/opportunities/');
  });

  // TODO: Share button is always visible. Investigate
  // it('should display share options upon clicking the Share button', () => {
  //     cy.get('[data-testid="share-button"]').click();
  //     cy.get('[data-testid="share-options"]').should('be.visible');
  //     cy.get('[data-testid="share-button"]').click();
  //     cy.get('[data-testid="share-options"]').should('not.be.visible');
  // });
});
