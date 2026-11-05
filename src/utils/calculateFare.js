// AI-assisted: see docs/AI_LOG.md #1
import { PRICING } from '../config/pricing';

// Pure function used by the passenger estimate AND the driver trip closing.
export function calculateFare(
  { distanceKm, durationMin, category = 'economy', tip = 0 },
  pricing = PRICING
) {
  const multiplier = pricing.multipliers[category];
  if (multiplier === undefined) throw new Error(`Unknown category: ${category}`);

  const raw =
    (pricing.baseFare + distanceKm * pricing.perKm + durationMin * pricing.perMinute) * multiplier;
  const fare = Math.round(Math.max(pricing.minimumFare, raw) / pricing.roundTo) * pricing.roundTo;
  const commission = Math.round(fare * pricing.commissionRate);
  const driverEarnings = fare - commission + Math.round(tip);

  return { fare, commission, driverEarnings, commissionRate: pricing.commissionRate };
}

export const formatCOP = (n) =>
  '$' + Math.round(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
