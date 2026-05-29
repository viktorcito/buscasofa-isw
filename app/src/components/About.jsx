import React from 'react'
import { TEAM, TEAM_NUMBER } from '../data/team'
import './About.css'

// Página /about. Verificada por:
//  - cypress/components/About.cy.jsx  (h1 + #info con el nº de equipo)
//  - cypress/e2e/about.cy.js          (nombre y aportación de cada miembro)
const About = () => {
    return (
        <div className="about-container">
            <h1>Acerca de nosotros</h1>
            <div id="info">
                Somos el equipo nº {TEAM_NUMBER}
            </div>

            <h2>Miembros del equipo y aportaciones</h2>
            <ul className="about-members">
                {TEAM.map(member => (
                    <li key={member.name} className="about-member">
                        <span className="about-member-name">{member.name}</span>
                        {': '}
                        <span className="about-member-contribution">{member.contribution}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default About
