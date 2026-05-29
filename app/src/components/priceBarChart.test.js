import { describe, it, expect } from 'vitest';
import { barWidthPct } from './PriceBarChart';

describe('barWidthPct', () => {
  it('devuelve 50 cuando el valor es la mitad del máximo', () => {
    expect(barWidthPct(5, 10)).toBe(50);
  });

  it('devuelve 100 cuando el valor es igual al máximo', () => {
    expect(barWidthPct(10, 10)).toBe(100);
  });

  it('devuelve 0 cuando el máximo es 0', () => {
    expect(barWidthPct(5, 0)).toBe(0);
  });

  it('devuelve 0 cuando el valor es 0', () => {
    expect(barWidthPct(0, 10)).toBe(0);
  });

  it('devuelve 0 cuando el máximo es negativo', () => {
    expect(barWidthPct(5, -10)).toBe(0);
  });

  it('acota a 100 cuando el valor supera el máximo', () => {
    expect(barWidthPct(20, 10)).toBe(100);
  });

  it('acota a 0 cuando el valor es negativo', () => {
    expect(barWidthPct(-5, 10)).toBe(0);
  });
});
