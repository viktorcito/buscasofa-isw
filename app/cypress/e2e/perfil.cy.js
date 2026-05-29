/// <reference types="cypress" />
// Prueba nueva 3 (libre): página de perfil de usuario (/perfil).
// Verifica que, con un usuario autenticado, se muestran sus datos (nombre, email e id)
// obtenidos del backend. Se usa la fixture profile.json para los datos del perfil.

describe('Página de perfil de usuario (/perfil)', () => {
  it('muestra los datos del usuario autenticado', () => {
    cy.intercept('GET', '**/EstacionesTerrestres/**', { body: { ListaEESSPrecio: [] } });
    cy.intercept('GET', '**/api/profile', { fixture: 'profile.json' }).as('getProfile');

    cy.visit('/perfil', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-jwt-token');
      },
    });

    cy.wait('@getProfile');

    cy.get('[data-cy="profile-name"]').should('contain', 'Jane');
    cy.get('[data-cy="profile-email"]').should('contain', 'jane@example.com');
    cy.get('[data-cy="profile-id"]').should('contain', '8739');
  });

  it('pide iniciar sesión si no hay token', () => {
    cy.intercept('GET', '**/EstacionesTerrestres/**', { body: { ListaEESSPrecio: [] } });
    cy.visit('/perfil');
    cy.contains('Debes iniciar sesión').should('be.visible');
  });
});
