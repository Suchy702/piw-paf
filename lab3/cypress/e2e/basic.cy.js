describe('EasyBook E2E', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('Hydration failed')) {
        return false;
      }
    });
    cy.visit('http://localhost:5173/');
    cy.wait(1000);
  });

  it('powinien wyświetlić stronę główną i navbar', () => {
    cy.contains('EasyBook');
    cy.get('nav').should('exist');
    cy.contains('Strona główna');
    cy.contains('Dodaj książkę');
  });

  it('powinien przejść do formularza dodawania książki', () => {
    cy.contains('Dodaj książkę').click();
    cy.url().should('include', '/new');
    cy.get('form').should('exist');
  });

  it('powinien wyświetlić listę książek lub komunikat o braku książek', () => {
    cy.get('h2').contains('Lista książek');
    cy.get('.book-list').should('exist');
  });
});
