import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import FuelFilters from './FuelFilters';
import { addFavorite, isLoggedIn } from '../apis/favorites';
import { distanceToStation } from '../apis/geo';
import './FuelTable.css';

const PAGE_SIZE = 20;

const FuelTable = ({ stations }) => {

  // Filtros
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');

  // Orden
  const [sortField, setSortField] = useState<string>('Precio Gasoleo A');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Favoritos (solo si el usuario ha iniciado sesión)
  const logged = isLoggedIn();
  const [favIds, setFavIds] = useState<Set<string>>(new Set());

  const handleAddFavorite = async (station) => {
    try {
      await addFavorite({
        station_id: station.IDEESS,
        station_name: station['Rótulo'],
        station_address: station['Dirección'],
      });
      setFavIds(prev => new Set(prev).add(station.IDEESS));
    } catch {
      // Si falla (p.ej. sesión caducada) no rompemos la tabla.
    }
  };

  // "Cerca de mí": geolocalización del usuario
  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(null);
  const [geoMsg, setGeoMsg] = useState('');

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setGeoMsg('Tu navegador no soporta geolocalización.');
      return;
    }
    setGeoMsg('Obteniendo tu ubicación...');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserPos({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setGeoMsg('');
      },
      () => setGeoMsg('No se pudo obtener tu ubicación.')
    );
  };


  // Provincias y ciudades únicas
  const provinces = useMemo(
    () => Array.from(new Set(stations.map(s => s.Provincia))).sort(),
    [stations]
  );
  const cities = useMemo(
    () =>
      Array.from(
        new Set(
          stations
            .filter(s => !selectedProvince || s.Provincia === selectedProvince)
            .map(s => s.Municipio)
        )
      ).sort(),
    [stations, selectedProvince]
  );

  // Filtrado
  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      const matchProvince = !selectedProvince || station.Provincia === selectedProvince;
      const matchCity = !selectedCity || station.Municipio === selectedCity;
      const matchFuel =
        !selectedFuel ||
        (station[selectedFuel] && station[selectedFuel].replace(',', '.') !== '' && station[selectedFuel] !== '-');
      return matchProvince && matchCity && matchFuel;
    });
  }, [stations, selectedProvince, selectedCity, selectedFuel]);

  // Ordenación
  const sortedStations = useMemo(() => {
    if (!selectedFuel) return filteredStations;
    return [...filteredStations].sort((a, b) => {
      const aVal = parseFloat((a[sortField] || '0').replace(',', '.')) || 0;
      const bVal = parseFloat((b[sortField] || '0').replace(',', '.')) || 0;
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [filteredStations, sortField, sortOrder, selectedFuel]);

  // Distancias a cada gasolinera (solo si tenemos la posición del usuario)
  const distances = useMemo(() => {
    if (!userPos) return null;
    const m = new Map<string, number>();
    filteredStations.forEach(s => {
      const d = distanceToStation(userPos, s);
      if (d != null) m.set(s.IDEESS, d);
    });
    return m;
  }, [userPos, filteredStations]);

  // Orden final: por distancia si "cerca de mí" está activo; si no, el orden normal.
  const orderedStations = useMemo(() => {
    if (userPos && distances) {
      return [...filteredStations].sort((a, b) => {
        const da = distances.get(a.IDEESS) ?? Infinity;
        const db = distances.get(b.IDEESS) ?? Infinity;
        return da - db;
      });
    }
    return sortedStations;
  }, [userPos, distances, filteredStations, sortedStations]);

  // Paginación
  const totalPages = Math.ceil(orderedStations.length / PAGE_SIZE);
  const paginatedStations = orderedStations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Cambiar orden
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Reset página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProvince, selectedCity, selectedFuel, userPos]);


  return (
    <div className="fuel-page">
      <h2>Precios de combustibles en gasolineras españolas</h2>
      <FuelFilters
        provinces={provinces}
        cities={cities}
        selectedProvince={selectedProvince}
        selectedCity={selectedCity}
        selectedFuel={selectedFuel}
        onProvinceChange={setSelectedProvince}
        onCityChange={setSelectedCity}
        onFuelChange={setSelectedFuel}
      />
      <div className="near-me-bar">
        <button type="button" className="near-me-btn" onClick={handleNearMe}>
          📍 Cerca de mí
        </button>
        {userPos && (
          <button type="button" className="near-me-clear" onClick={() => setUserPos(null)}>
            Quitar orden por distancia
          </button>
        )}
        {geoMsg && <span className="near-me-msg">{geoMsg}</span>}
      </div>
      <div className="table-scroll">
      <table className="fuel-table">
        <thead>
          <tr>
            <th>Gasolinera</th>
            <th>Dirección</th>
            <th>Municipio</th>
            <th>
              <button
                className="sortable"
                onClick={() => handleSort('Precio Gasoleo A')}
              >
                Gasóleo A {sortField === 'Precio Gasoleo A' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </button>
            </th>
            <th>
              <button
                className="sortable"
                onClick={() => handleSort('Precio Gasolina 95 E5')}
              >
                Gasolina 95 E5 {sortField === 'Precio Gasolina 95 E5' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </button>
            </th>
            <th>Detalle</th>
            {userPos && <th>Distancia</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedStations.map((station, idx) => (
            <tr key={station.IDEESS || idx}>
              <td>{station['Rótulo']}</td>
              <td>{station['Dirección']}</td>
              <td>{station['Municipio']}</td>
              <td>{station['Precio Gasoleo A']}</td>
              <td>{station['Precio Gasolina 95 E5']}</td>
              <td>
                <Link
                  to={`/station/${station.IDEESS}`}
                  state={{
                    gobackLink: "/lista"
                  }}
                >
                  Ver detalle
                </Link>
                {logged && (
                  <button
                    type="button"
                    className="add-favorite"
                    title="Añadir a favoritos"
                    aria-label={`Añadir ${station['Rótulo']} a favoritos`}
                    onClick={() => handleAddFavorite(station)}
                  >
                    {favIds.has(station.IDEESS) ? '★' : '☆'}
                  </button>
                )}
              </td>
              {userPos && (
                <td className="num">
                  {distances?.get(station.IDEESS) != null
                    ? `${distances.get(station.IDEESS)!.toFixed(1)} km`
                    : '—'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {/* Paginación */}
      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          {'<<'}
        </button>
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
          {'<'}
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
          {'>'}
        </button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
          {'>>'}
        </button>
      </div>
    </div>
  );
};

export default FuelTable;