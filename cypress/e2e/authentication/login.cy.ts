describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form correctly', () => {
    // Assert that the login form elements are present
    cy.get('form').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('Should display error message when email is not provided', () => {
    // Fill out only password field
    cy.get('input[name="password"]').type(Cypress.env('USER_PASSWORD'));
    cy.get('form').submit();

    cy.contains('p', 'Email is required').should('be.visible');
  });

  it('Should display error message when email is invalid', () => {
    // Fill out only password field
    cy.get('input[name="email"]').type('invalidEmail.com');
    cy.get('input[name="password"]').type(Cypress.env('USER_PASSWORD'));
    cy.get('form').submit();

    cy.contains('p', 'Invalid email').should('be.visible');
  });

  it('Should display error message when password is not provided', () => {
    // Fill out only the email field
    cy.get('input[name="email"]').type(Cypress.env('USER_EMAIL'));
    cy.get('form').submit();

    cy.contains('p', 'Password is required').should('be.visible');
  });

  it('Should display error message when password is under 6 char long', () => {
    // Fill out only the email field
    cy.get('input[name="email"]').type(Cypress.env('USER_EMAIL'));
    cy.get('input[name="password"]').type('123');
    cy.get('form').submit();

    cy.contains('p', 'Password must be at least 6 characters long').should(
      'be.visible'
    );
  });

  it('Should redirect to sign up when sign up is clicked', () => {
    // Click the sign-up text
    cy.contains('a', 'Sign Up').click();

    // Assert that the URL includes '/signup
    cy.url().should('include', '/signup');
  });
});
