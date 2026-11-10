// AI-assisted: see docs/AI_LOG.md #2
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSession } from '../context/SessionContext';
import { setTripStatus, finishTrip } from '../services/trips';
import { getRoute } from '../services/directions';
import { decodePolyline } from '../utils/polyline';
import { s } from '../theme';

export default function TripInProgressScreen({ navigation }) {
  const { activeTrip: trip, driver } = useSession();
  const [encoded, setEncoded] = useState('');
  const inProgress = trip?.status === 'in_progress';
  const hasLocation = Boolean(driver?.location);

  // accepted -> driver_arriving as soon as the driver starts heading to the pickup
  useEffect(() => {
    if (trip?.status === 'accepted') setTripStatus(trip.id, 'driver_arriving');
  }, [trip?.status, trip?.id]);

  // One route call per leg: driver -> pickup, then pickup -> destination
  useEffect(() => {
    if (!trip) return;
    const from = inProgress ? trip.origin : driver?.location || trip.origin;
    const to = inProgress ? trip.destination : trip.origin;
    getRoute(from, to).then(setEncoded).catch(() => setEncoded(''));
  }, [inProgress, hasLocation]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!trip) return null;
  const target = inProgress ? trip.destination : trip.origin;

  const finish = async () => {
    await finishTrip(trip, encoded);
    navigation.replace('PaymentSummary');
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        showsUserLocation
        region={{ latitude: target.lat, longitude: target.lng, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
      >
        <Marker coordinate={{ latitude: target.lat, longitude: target.lng }} />
        {encoded ? <Polyline coordinates={decodePolyline(encoded)} strokeWidth={5} strokeColor="#1B2A41" /> : null}
      </MapView>
      <View style={{ padding: 16, backgroundColor: '#fff' }}>
        <Text style={{ fontWeight: '700' }}>
          {inProgress ? `Hacia el destino: ${trip.destination.address}` : `Hacia el pasajero: ${trip.origin.address}`}
        </Text>
        {!inProgress ? (
          <Pressable style={s.btn} onPress={() => setTripStatus(trip.id, 'in_progress')}>
            <Text style={s.btnText}>Pasajero a bordo</Text>
          </Pressable>
        ) : (
          <Pressable style={s.btn} onPress={finish}>
            <Text style={s.btnText}>Finalizar viaje</Text>
          </Pressable>
        )}
        {!inProgress && (
          <Pressable
            style={[s.btn, { backgroundColor: '#B4382F' }]}
            onPress={async () => { await setTripStatus(trip.id, 'cancelled'); navigation.popToTop(); }}
          >
            <Text style={s.btnText}>Cancelar viaje</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
