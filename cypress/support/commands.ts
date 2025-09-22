declare namespace Cypress {
  interface Chainable {
    login(_email: string, _password: string): Chainable<void>;
  }
}

// Login command is cached with email as its key. So it only gets called once per user across all test files
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session(
    email,
    () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('form').submit();

      cy.wait(15000);

      // Profile picture should be visible
      cy.get('img[alt="profile pic"]').should('be.visible');

      // Assert user is redirected to the login page
      cy.url().should('include', '/talent/opportunities');
    },
    {
      cacheAcrossSpecs: true,
    }
  );
});
