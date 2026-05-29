// Utilidades de geolocalización para la funcionalidad "gasolineras cerca de mí".

/**
 * Convierte una coordenada en formato español ("40,4168") a número (40.4168).
 * Devuelve NaN si no es válida.
 */
export function parseCoord(value) {
  if (value == null) return NaN;
  return parseFloat(String(value).replace(',', '.'));
}

/**
 * Distancia en kilómetros entre dos puntos (lat/lon en grados) usando la
 * fórmula de Haversine.
 */
export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // radio de la Tierra en km
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Distancia desde una posición {lat, lon} a una estación de la API
 * (campos "Latitud" y "Longitud (WGS84)"). Devuelve null si la estación
 * no tiene coordenadas válidas.
 */
export function distanceToStation(pos, station) {
  const lat = parseCoord(station['Latitud']);
  const lon = parseCoord(station['Longitud (WGS84)']);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  return haversineKm(pos.lat, pos.lon, lat, lon);
}
