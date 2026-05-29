/// <reference types="cypress" />
// Prueba nueva 2: la página /about muestra, por cada miembro, su nombre y la
// descripción de su aportación, además del número de equipo.
import { TEAM, TEAM_NUMBER } from '../../src/data/team';

describe('Sección "Quienes somos" (/about)', () => {
  beforeEach(() => {
    // Estabilizamos la carga inicial (no dependemos de la API externa ni de datos pesados).
    cy.intercept('GET', '**/EstacionesTerrestres/**', { body: { ListaEESSPrecio: [] } });
    cy.visit('/about');
  });

  it('muestra el número de equipo', () => {
    cy.get('#info').should('contain', `Somos el equipo nº ${TEAM_NUMBER}`);
  });

  it('muestra el nombre y la aportación de cada miembro', () => {
    TEAM.forEach(member => {
      cy.contains('.about-member-name', member.name).should('be.visible');
      cy.contains('.about-member-contribution', member.contribution).should('be.visible');
    });
  });
});
