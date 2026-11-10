// AI-assisted: see docs/AI_LOG.md #2
// Uso: node --env-file=.env scripts/crearViajePrueba.mjs <idDelConductor> [cash|mercadopago]
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const [driverId, paymentMethod = 'cash'] = process.argv.slice(2);
if (!driverId) {
  console.error('Falta el id del conductor (el id del documento en la colección drivers).');
  process.exit(1);
}

const app = initializeApp({
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
});
const db = getFirestore(app);

const ref = await addDoc(collection(db, 'trips'), {
  passengerId: 'pasajero-prueba',
  driverId: null,
  offeredTo: driverId, // the request is offered to this driver
  status: 'requested',
  category: 'economy',
  distanceKm: 8.5,
  durationMin: 22,
  tip: 0,
  paymentMethod,
  origin: { lat: 6.2623, lng: -75.5775, address: 'Universidad Nacional, Medellín' },
  destination: { lat: 6.2086, lng: -75.5659, address: 'Parque Lleras, Medellín' },
  createdAt: serverTimestamp(),
});
console.log('Viaje creado:', ref.id);
process.exit(0);
