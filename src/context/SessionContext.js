// AI-assisted: see docs/AI_LOG.md #1
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { toTrip } from '../services/trips';

const SessionContext = createContext(null);

const initial = { loading: true, user: null, driver: null, activeTripId: null, activeTrip: null };
function reducer(state, a) {
  switch (a.type) {
    case 'user': return { ...state, user: a.user, loading: a.user ? state.loading : false, driver: a.user ? state.driver : null };
    case 'driver': return { ...state, driver: a.driver, loading: false };
    case 'tripId': return { ...state, activeTripId: a.id, activeTrip: a.id ? state.activeTrip : null };
    case 'trip': return { ...state, activeTrip: a.trip };
    default: return state;
  }
}

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => onAuthStateChanged(auth, (user) => dispatch({ type: 'user', user })), []);

  useEffect(() => {
    if (!state.user) return;
    const unsub = onSnapshot(doc(db, 'drivers', state.user.uid), (snap) =>
      dispatch({ type: 'driver', driver: snap.exists() ? { id: snap.id, ...snap.data() } : null })
    );
    return unsub; // cleanup
  }, [state.user]);

  useEffect(() => {
    if (!state.activeTripId) return;
    const unsub = onSnapshot(doc(db, 'trips', state.activeTripId), (snap) => {
      if (snap.exists()) dispatch({ type: 'trip', trip: toTrip(snap) });
    });
    return unsub; // cleanup
  }, [state.activeTripId]);

  const setActiveTripId = (id) => dispatch({ type: 'tripId', id });
  return <SessionContext.Provider value={{ ...state, setActiveTripId }}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
