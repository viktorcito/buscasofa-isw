import React from 'react';
import { Link } from 'react-router-dom';

// Página 404. El texto exacto lo verifica cypress/e2e/features/notfound.feature
function NotFound() {
  return (
    <div className="notfound-container" style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>404</h1>
      <p>No hemos encontrado la página que buscas</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}

export default NotFound;
