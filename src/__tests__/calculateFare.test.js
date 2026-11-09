import { calculateFare } from '../utils/calculateFare';

describe('calculateFare (ejemplo del PDF: 8,5 km y 22 min)', () => {
  test('Económico', () => {
    const r = calculateFare({ distanceKm: 8.5, durationMin: 22, category: 'economy', tip: 0 });
    expect(r).toMatchObject({ fare: 19200, commission: 3840, driverEarnings: 15360 });
  });
  test('XL', () => {
    const r = calculateFare({ distanceKm: 8.5, durationMin: 22, category: 'xl', tip: 0 });
    expect(r).toMatchObject({ fare: 26900, commission: 5380, driverEarnings: 21520 });
  });
  test('Tarifa mínima', () => {
    expect(calculateFare({ distanceKm: 0.1, durationMin: 1, category: 'economy' }).fare).toBe(6000);
  });
  test('La propina va completa al conductor', () => {
    const r = calculateFare({ distanceKm: 8.5, durationMin: 22, category: 'economy', tip: 2000 });
    expect(r.driverEarnings).toBe(17360);
  });
});
