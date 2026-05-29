import React from 'react';
import { TEAM, TEAM_NUMBER } from '../data/team';
import './Footer.css';

// El footer muestra los nombres de todos los miembros del equipo.
// Verificado por cypress/e2e/footer.cy.js
function Footer() {
  return (
    <footer className="app-footer">
      <h2>Equipo nº {TEAM_NUMBER} — Miembros</h2>
      <ul className="footer-members">
        {TEAM.map(member => (
          <li key={member.name}>{member.name}</li>
        ))}
      </ul>
    </footer>
  );
}

export default Footer;
