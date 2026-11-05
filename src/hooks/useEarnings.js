// AI-assisted: see docs/AI_LOG.md #1
import { useEffect, useMemo, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { toTrip } from '../services/trips';
import { startOfDay, startOfWeek, startOfMonth } from '../utils/dates';

function summarize(trips) {
  const count = trips.length;
  const billed = trips.reduce((a, t) => a + (t.fare || 0), 0);
  const commissions = trips.reduce((a, t) => a + (t.commission || 0), 0);
  const tips = trips.reduce((a, t) => a + (t.tip || 0), 0);
  const net = trips.reduce((a, t) => a + (t.driverEarnings || 0), 0);
  return { count, billed, commissions, tips, net, average: count ? Math.round(net / count) : 0 };
}

export default function useEarnings(driverId) {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    if (!driverId) return;
    const since = new Date(Math.min(startOfMonth().getTime(), startOfWeek().getTime()));
    const q = query(
      collection(db, 'trips'),
      where('driverId', '==', driverId),
      where('status', 'in', ['completed', 'paid']),
      where('completedAt', '>=', Timestamp.fromDate(since)),
      orderBy('completedAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => setTrips(snap.docs.map(toTrip)));
    return unsub; // cleanup
  }, [driverId]);

  return useMemo(() => {
    const d = startOfDay().getTime(), w = startOfWeek().getTime(), m = startOfMonth().getTime();
    const from = (t0) => trips.filter((t) => t.completedAt >= t0);
    return { today: summarize(from(d)), week: summarize(from(w)), month: summarize(from(m)) };
  }, [trips]);
}
