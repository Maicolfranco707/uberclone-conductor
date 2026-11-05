// AI-assisted: see docs/AI_LOG.md #1
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSession } from '../context/SessionContext';
import { acceptTrip, rejectTrip } from '../services/trips';
import { calculateFare, formatCOP } from '../utils/calculateFare';
import { PRICING } from '../config/pricing';
import { s } from '../theme';

export default function IncomingRequestScreen({ route, navigation }) {
  const { trip } = route.params;
  const { driver, setActiveTripId } = useSession();
  const [seconds, setSeconds] = useState(PRICING.requestTimeoutSec);
  const est = calculateFare({ distanceKm: trip.distanceKm, durationMin: trip.durationMin, category: trip.category, tip: 0 });

  const reject = useCallback(async () => {
    await rejectTrip(trip.id, driver.id);
    navigation.goBack();
  }, [trip.id, driver.id, navigation]);

  const accept = useCallback(async () => {
    await acceptTrip(trip.id, driver.id);
    setActiveTripId(trip.id);
    navigation.replace('TripInProgress');
  }, [trip.id, driver.id, navigation, setActiveTripId]);

  // Countdown with cleanup; auto-reject at zero
  useEffect(() => {
    if (seconds <= 0) { reject(); return; }
    const id = setTimeout(() => setSeconds((x) => x - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds, reject]);

  const Row = ({ k, v }) => (<View style={s.row}><Text style={s.muted}>{k}</Text><Text style={{ flexShrink: 1, textAlign: 'right' }}>{v}</Text></View>);

  return (
    <View style={s.screen}>
      <Text style={s.title}>Nueva solicitud · {seconds}s</Text>
      <View style={s.card}>
        <Row k="Origen" v={trip.origin?.address} />
        <Row k="Destino" v={trip.destination?.address} />
        <Row k="Distancia" v={`${trip.distanceKm} km`} />
        <Row k="Duración" v={`${trip.durationMin} min`} />
        <Row k="Categoría" v={trip.category} />
        <Row k="Pago" v={trip.paymentMethod} />
        <Row k="Tarifa estimada" v={formatCOP(est.fare)} />
        <Row k="Ganancia neta estimada" v={formatCOP(est.driverEarnings)} />
      </View>
      <Pressable style={s.btn} onPress={accept}><Text style={s.btnText}>Aceptar</Text></Pressable>
      <Pressable style={[s.btn, { backgroundColor: '#d92d20' }]} onPress={reject}><Text style={s.btnText}>Rechazar</Text></Pressable>
    </View>
  );
}
