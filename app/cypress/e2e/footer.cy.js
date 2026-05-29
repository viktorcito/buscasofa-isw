/// <reference types="cypress" />
// Prueba nueva 1: el footer muestra los nombres de TODOS los miembros del equipo.
import { TEAM } from '../../src/data/team';

describe('Footer con los miembros del equipo', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('muestra el nombre de cada miembro del equipo en el footer', () => {
    cy.get('footer').within(() => {
      TEAM.forEach(member => {
        cy.contains(member.name).should('be.visible');
      });
    });
  });
});
