// Single source of truth for pricing. All amounts are integer COP.
export const PRICING = {
  baseFare: 3500,
  perKm: 1200,
  perMinute: 250,
  minimumFare: 6000,
  roundTo: 100,
  commissionRate: 0.2,
  multipliers: { economy: 1.0, xl: 1.4, premium: 1.8 },
  requestTimeoutSec: 15,
  locationIntervalMs: 5000,
  xlMinCapacity: 6,
};
