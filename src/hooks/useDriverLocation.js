// AI-assisted: see docs/AI_LOG.md #1
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { PRICING } from '../config/pricing';

// Tracks the position while `active`; always stops on cleanup.
export default function useDriverLocation(driverId, active) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  // Initial one-shot position so the map has somewhere to center
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return setError('Permiso de ubicación denegado');
      const pos = await Location.getCurrentPositionAsync({});
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    })();
  }, []);

  useEffect(() => {
    if (!active || !driverId) return;
    let sub;
    let cancelled = false;
    (async () => {
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: PRICING.locationIntervalMs, distanceInterval: 10 },
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(loc);
          setDoc(doc(db, 'drivers', driverId), { location: loc, locationUpdatedAt: serverTimestamp() }, { merge: true });
        }
      );
      if (cancelled) sub.remove();
    })();
    return () => { cancelled = true; sub?.remove(); }; // cleanup
  }, [active, driverId]);

  return { location, error };
}
