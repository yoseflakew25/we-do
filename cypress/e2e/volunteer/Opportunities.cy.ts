describe('Opportunities Page', () => {
  before(() => {
    cy.login(Cypress.env('USER_EMAIL'), Cypress.env('USER_PASSWORD'));
  });

  beforeEach(() => {
    cy.visit('/talent/opportunities');
  });

  it('should display UI components', () => {
    // cy.contains('Opportunities').should('be.visible');
    cy.contains('Operational Reaches').should('be.visible');
    cy.contains('Categories').should('be.visible');
  });

  it('should match information on opportunity card to opportunity detail', function () {
    // Ensure no animations or loaders are blocking
    cy.get('.animate-bounce-slow').should('not.exist');

    // Declare variables to store data
    let cardTitle: string, cardOrg: string, cardType: string;

    // Extract data from the card and store it
    cy.get('[data-testid*="opportunity-title"]')
      .first()
      .invoke('text')
      .then((text) => {
        cardTitle = text;
        cy.get('[data-testid*="org-name"]')
          .first()
          .invoke('text')
          .then((text) => {
            cardOrg = text;
            cy.get('[data-testid*="opportunity-type"]')
              .first()
              .invoke('text')
              .then((text) => {
                cardType = text;

                // Click to navigate to the opportunity details page
                cy.get('[data-testid*="opportunity-card"]').first().click();

                cy.wait(3000); // Wait for 3 seconds (use only if necessary)

                // Wait for navigation to the details page
                cy.url().should('include', '/talent/opportunities/');

                // Ensure the page content is fully loaded
                cy.get('[data-testid*="opportunity-detail-opp-title"]').should(
                  'be.visible'
                );

                // Perform assertions using the captured data
                cy.get('[data-testid*="opportunity-detail-opp-title"]').should(
                  'contain.text',
                  cardTitle
                );
                cy.get('[data-testid*="opportunity-detail-org-name"]').should(
                  'contain.text',
                  cardOrg
                );
                cy.get('[data-testid*="work-location"]').should(
                  'contain.text',
                  cardType
                );
              });
          });
      });
  });
});
