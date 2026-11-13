// AI-assisted: see docs/AI_LOG.md #1
import {
  doc, updateDoc, arrayUnion, increment, serverTimestamp, collection, query, where,
  orderBy, limit, startAfter, getDocs, Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { calculateFare } from '../utils/calculateFare';

const tripRef = (id) => doc(db, 'trips', id);

export const acceptTrip = (tripId, driverId) =>
  updateDoc(tripRef(tripId), { status: 'accepted', driverId, offeredTo: null, acceptedAt: serverTimestamp() });

// Reject / timeout: the trip is marked as rejected (there is no dispatcher yet to offer it to the next driver).
export const rejectTrip = (tripId, driverId) =>
  updateDoc(tripRef(tripId), {
    status: 'rejected',
    offeredTo: null,
    rejectedBy: arrayUnion(driverId),
  });

export const setTripStatus = (tripId, status, extra = {}) =>
  updateDoc(tripRef(tripId), { status, ...extra });

export function finishTrip(trip, routePolyline = '') {
  const { fare, commission, driverEarnings, commissionRate } = calculateFare({
    distanceKm: trip.distanceKm,
    durationMin: trip.durationMin,
    category: trip.category,
    tip: trip.tip || 0,
  });
  return setTripStatus(trip.id, 'completed', {
    fare, commission, driverEarnings, commissionRate, route: routePolyline,
    completedAt: serverTimestamp(),
    paymentStatus: trip.paymentMethod === 'cash' ? 'cash_pending' : 'pending',
  });
}

// Cash: platform did not receive the money -> commission is deducted from the driver balance.
export async function markCashPaid(trip) {
  await setTripStatus(trip.id, 'paid', { paymentStatus: 'cash', paymentId: 'cash' });
  await updateDoc(doc(db, 'drivers', trip.driverId), { balance: increment(-trip.commission) });
}

export async function fetchTripsPage({ driverId, from, to, cursor, pageSize = 20 }) {
  const constraints = [
    where('driverId', '==', driverId),
    where('status', 'in', ['completed', 'paid']),
  ];
  if (from) constraints.push(where('completedAt', '>=', Timestamp.fromDate(from)));
  if (to) constraints.push(where('completedAt', '<=', Timestamp.fromDate(to)));
  constraints.push(orderBy('completedAt', 'desc'));
  if (cursor) constraints.push(startAfter(cursor));
  constraints.push(limit(pageSize));
  const snap = await getDocs(query(collection(db, 'trips'), ...constraints));
  return {
    items: snap.docs.map(toTrip),
    cursor: snap.docs[snap.docs.length - 1] || null,
    end: snap.docs.length < pageSize,
  };
}

// Firestore timestamps -> millis so the object is serializable for navigation.
export function toTrip(d) {
  const data = d.data();
  const ms = (t) => (t?.toMillis ? t.toMillis() : t ?? null);
  return { id: d.id, ...data, createdAt: ms(data.createdAt), completedAt: ms(data.completedAt), acceptedAt: ms(data.acceptedAt) };
}