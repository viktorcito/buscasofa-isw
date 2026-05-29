/// <reference types="cypress" />
// Prueba de la funcionalidad original: gasolineras favoritas.
// Verifica que el perfil lista los favoritos del usuario y que se pueden quitar.

describe('Gasolineras favoritas en el perfil', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/EstacionesTerrestres/**', { fixture: 'fuel_data.json' });
    cy.intercept('GET', '**/api/profile', { fixture: 'profile.json' });
    cy.intercept('GET', '**/api/favorites', { fixture: 'favorites.json' }).as('getFavorites');

    cy.visit('/perfil', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-jwt-token');
      },
    });
    cy.wait('@getFavorites');
  });

  it('lista las gasolineras favoritas del usuario', () => {
    cy.get('[data-cy="favorites-list"]').should('be.visible');
    cy.get('[data-cy="favorite-item"]').should('have.length', 2);
    cy.contains('.favorite-name', 'Repsol Centro').should('be.visible');
    cy.contains('.favorite-name', 'Cepsa Norte').should('be.visible');
  });

  it('permite quitar una gasolinera de favoritos', () => {
    cy.intercept('DELETE', '**/api/favorites/1234', { statusCode: 200, body: { message: 'Favorito eliminado' } }).as('deleteFav');

    cy.get('[data-cy="remove-favorite-1234"]').click();
    cy.wait('@deleteFav');

    cy.contains('.favorite-name', 'Repsol Centro').should('not.exist');
    cy.get('[data-cy="favorite-item"]').should('have.length', 1);
  });
});
