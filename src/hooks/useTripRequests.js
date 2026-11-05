import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { toTrip } from '../services/trips';

// Listens for trips the dispatcher (passenger app/backend) offered to this driver.
export default function useTripRequests(driverId, available) {
  const [request, setRequest] = useState(null);

  useEffect(() => {
    if (!driverId || !available) { setRequest(null); return; }
    const q = query(
      collection(db, 'trips'),
      where('status', '==', 'requested'),
      where('offeredTo', '==', driverId)
    );
    const unsub = onSnapshot(q, (snap) => setRequest(snap.empty ? null : toTrip(snap.docs[0])));
    return unsub; // cleanup
  }, [driverId, available]);

  return request;
}
