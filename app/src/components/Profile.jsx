import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../apis/config';
import { getFavorites, removeFavorite } from '../apis/favorites';
import './Profile.css';

// Página de perfil de usuario (/perfil).
// Recupera los datos del usuario autenticado y sus gasolineras favoritas desde el backend.
// Pruebas: cypress/e2e/perfil.cy.js (datos) y cypress/e2e/favoritos.cy.js (favoritos).
function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [favError, setFavError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión para ver tu perfil.');
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar el perfil');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    // Carga de favoritos (independiente: si falla no rompe el perfil).
    getFavorites()
      .then(setFavorites)
      .catch(err => setFavError(err.message));
  }, []);

  const handleRemove = async stationId => {
    try {
      await removeFavorite(stationId);
      setFavorites(favs => favs.filter(f => f.station_id !== stationId));
    } catch (err) {
      setFavError(err.message);
    }
  };

  if (loading) return <div className="profile-container">Cargando perfil...</div>;
  if (error)
    return (
      <div className="profile-container">
        <p className="profile-error">{error}</p>
        <Link to="/login">Ir a iniciar sesión</Link>
      </div>
    );

  return (
    <div className="profile-container">
      <h1>Mi perfil</h1>
      <ul className="profile-data">
        <li>
          <strong>Nombre:</strong> <span data-cy="profile-name">{profile.name ?? profile.username}</span>
        </li>
        <li>
          <strong>Email:</strong> <span data-cy="profile-email">{profile.email}</span>
        </li>
        <li>
          <strong>ID de usuario:</strong> <span data-cy="profile-id">{profile.id}</span>
        </li>
      </ul>

      <h2>Mis gasolineras favoritas</h2>
      {favError && <p className="profile-error">{favError}</p>}
      {favorites.length === 0 ? (
        <p data-cy="no-favorites">Todavía no has guardado ninguna gasolinera favorita.</p>
      ) : (
        <ul className="favorites-list" data-cy="favorites-list">
          {favorites.map(fav => (
            <li key={fav.station_id} className="favorite-item" data-cy="favorite-item">
              <span className="favorite-name">{fav.station_name || fav.station_id}</span>
              {fav.station_address && (
                <span className="favorite-address"> — {fav.station_address}</span>
              )}
              <button
                type="button"
                className="remove-favorite"
                data-cy={`remove-favorite-${fav.station_id}`}
                onClick={() => handleRemove(fav.station_id)}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Profile;
