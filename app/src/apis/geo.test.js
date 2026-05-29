import { describe, it, expect } from 'vitest';
import { parseCoord, haversineKm, distanceToStation } from './geo';

describe('parseCoord', () => {
  it('convierte coma decimal a número', () => {
    expect(parseCoord('40,4168')).toBeCloseTo(40.4168, 4);
  });
  it('acepta punto decimal', () => {
    expect(parseCoord('-3.7038')).toBeCloseTo(-3.7038, 4);
  });
  it('devuelve NaN si no es válida', () => {
    expect(Number.isNaN(parseCoord(undefined))).toBe(true);
    expect(Number.isNaN(parseCoord(''))).toBe(true);
  });
});

describe('haversineKm', () => {
  it('distancia 0 para el mismo punto', () => {
    expect(haversineKm(40.4168, -3.7038, 40.4168, -3.7038)).toBeCloseTo(0, 5);
  });
  it('Madrid–Barcelona ~ 505 km', () => {
    const d = haversineKm(40.4168, -3.7038, 41.3874, 2.1686);
    expect(d).toBeGreaterThan(490);
    expect(d).toBeLessThan(520);
  });
});

describe('distanceToStation', () => {
  const pos = { lat: 40.4168, lon: -3.7038 };
  it('calcula la distancia con coordenadas en formato español', () => {
    const station = { Latitud: '41,3874', 'Longitud (WGS84)': '2,1686' };
    const d = distanceToStation(pos, station);
    expect(d).toBeGreaterThan(490);
    expect(d).toBeLessThan(520);
  });
  it('devuelve null si faltan coordenadas', () => {
    expect(distanceToStation(pos, { Latitud: '', 'Longitud (WGS84)': '' })).toBeNull();
  });
});
