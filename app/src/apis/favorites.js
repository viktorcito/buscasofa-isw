import { API_BASE } from './config';

// Llamadas al backend para gestionar las gasolineras favoritas del usuario.
// La autenticación se hace con el token JWT guardado en localStorage.

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export async function getFavorites() {
  const res = await fetch(`${API_BASE}/api/favorites`, { headers: authHeaders() });
  if (!res.ok) throw new Error('No se pudieron cargar los favoritos');
  return res.json();
}

export async function addFavorite(station) {
  const res = await fetch(`${API_BASE}/api/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(station),
  });
  if (!res.ok) throw new Error('No se pudo guardar el favorito');
  return res.json();
}

export async function removeFavorite(stationId) {
  const res = await fetch(`${API_BASE}/api/favorites/${stationId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('No se pudo eliminar el favorito');
  return res.json();
}
