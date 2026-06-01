import React, { useMemo } from 'react'
import './Home.css'
import { COMUNIDADES_AUTONOMAS } from '../apis/fuelApiLib'
import PriceBarChart from './PriceBarChart'


const FUEL_TYPES = [
  { key: 'Precio Gasoleo A', label: 'Gasóleo A' },
  { key: 'Precio Gasolina 95 E5', label: 'Gasolina 95 E5' },
];

/**
 * Calcula el valor medio de un vector de valores formateados como string
 */
function getAverage(values: string[]) {
  const nums = values
    .map(p => parseFloat(p.replace(',', '.')))  // convertir a número
    .filter(n => !isNaN(n));                    // Eliminar inválidos
  if (nums.length === 0) return null;
  return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(3);
}


const Home = ({ stations }) => {

  console.log(stations);

  // Nacional: medias por tipo de combustible
  const nationalSummary = useMemo(() => {
    return FUEL_TYPES.map(fuel => {
      const prices = stations.map(s => s[fuel.key]);
      const avg = getAverage(prices);
      return { ...fuel, avg };
    }).sort((a, b) => (b.avg && a.avg ? parseFloat(b.avg) - parseFloat(a.avg) : 0));
  }, [stations]);
  console.log(nationalSummary);

  // Por comunidad autónoma
  const regionSummary = useMemo(() => {
    return COMUNIDADES_AUTONOMAS.map(region => {
      let regionName = region.name;
      const regionStations = stations.filter(s => s['IDCCAA'] === region.id);
      const fuelPrices = FUEL_TYPES.map(fuel => {
        const prices = regionStations.map(s => s[fuel.key]);
        const avg = getAverage(prices);
        return { ...fuel, avg };
      });
      return { regionName, fuelPrices };
    });
  }, [stations]);


  console.log(regionSummary)

  // Vista previa de gasolineras (nombre, dirección, municipio y precios principales).
  // Solo estaciones con todos los datos rellenos, para mostrar un primer ejemplo útil.
  const previewStations = useMemo(() => {
    return stations
      .filter(s =>
        s['Rótulo'] &&
        s['Dirección'] &&
        s['Municipio'] &&
        s['Precio Gasoleo A'] &&
        s['Precio Gasolina 95 E5']
      )
      .slice(0, 50);
  }, [stations]);

  // KPIs del dashboard
  const priceGasoleo = getAverage(stations.map(s => s['Precio Gasoleo A']));
  const priceGasolina = getAverage(stations.map(s => s['Precio Gasolina 95 E5']));
  const cheapestRegion = useMemo(() => {
    let best = null;
    regionSummary.forEach(r => {
      const v = parseFloat(r.fuelPrices[0]?.avg);
      if (!Number.isNaN(v) && (!best || v < best.v)) best = { name: r.regionName, v };
    });
    return best;
  }, [regionSummary]);

  const kpis = [
    { label: 'Gasóleo A · media nacional', value: priceGasoleo ? `${priceGasoleo} €` : '—' },
    { label: 'Gasolina 95 · media nacional', value: priceGasolina ? `${priceGasolina} €` : '—' },
    { label: 'Gasolineras', value: (stations.length || 0).toLocaleString('es-ES') },
    {
      label: 'Comunidad más barata (Gasóleo A)',
      value: cheapestRegion ? cheapestRegion.name : '—',
      sub: cheapestRegion ? `${cheapestRegion.v.toFixed(3)} €` : '',
    },
  ];

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Buscasofa</h1>
        <div className='description'>
          El mejor buscador de precios de combustible de España.
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map(k => (
          <div className="kpi-card" key={k.label}>
            <span className="kpi-value">{k.value}</span>
            <span className="kpi-label">{k.label}</span>
            {k.sub && <span className="kpi-sub">{k.sub}</span>}
          </div>
        ))}
      </div>

      <h2 className='gasolineras-destacadas'>Gasolineras destacadas</h2>
      <table className='gasolineras-destacadas'>
        <thead>
          <tr>
            <th>Gasolinera</th>
            <th>Dirección</th>
            <th>Municipio</th>
            <th>Gasóleo A</th>
            <th>Gasolina 95 E5</th>
          </tr>
        </thead>
        <tbody>
          {previewStations.map((station, idx) => (
            <tr key={station.IDEESS || idx}>
              <td>{station['Rótulo']}</td>
              <td>{station['Dirección']}</td>
              <td>{station['Municipio']}</td>
              <td>{station['Precio Gasoleo A']}</td>
              <td>{station['Precio Gasolina 95 E5']}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className='resumen-nacional'>Resumen nacional de precios</h2>
      <table className='resumen-nacional'>
        <thead>
          <tr>
            <th>Tipo de combustible</th>
            <th>Precio medio (€)</th>
          </tr>
        </thead>
        <tbody>
          {nationalSummary.map(fuel => (
            <tr key={fuel.key}>
              <td>{fuel.label}</td>
              <td>{fuel.avg ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className='resumen-comunidades'>Resumen por comunidad autónoma</h2>
      <table className='resumen-comunidades'>
        <thead>
          <tr>
            <th>Comunidad Autónoma</th>
            {FUEL_TYPES.map(fuel => (
              <th key={fuel.key}>{fuel.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {regionSummary.map(region => (
            <tr key={region.regionName}>
              <td>{region.regionName}</td>
              {region.fuelPrices.map(fuel => (
                <td key={fuel.key}>{fuel.avg ?? 'N/A'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className='grafico-comunidades'>Precio medio de Gasóleo A por comunidad</h2>
      <PriceBarChart
        data={regionSummary
          .map(region => ({
            label: region.regionName,
            value: parseFloat(region.fuelPrices[0]?.avg),
          }))
          .filter(d => !Number.isNaN(d.value))}
        unit="€"
      />

    </div>

  )
}

export default Home 