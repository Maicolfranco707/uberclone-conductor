import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSession } from '../context/SessionContext';
import { setTripStatus, finishTrip } from '../services/trips';
import { getRoute } from '../services/directions';
import { decodePolyline } from '../utils/polyline';
import { s } from '../theme';

export default function TripInProgressScreen({ navigation }) {
  const { activeTrip: trip } = useSession();
  const [encoded, setEncoded] = useState('');

  // accepted -> driver_arriving as soon as the driver starts heading to the pickup
  useEffect(() => {
    if (trip?.status === 'accepted') setTripStatus(trip.id, 'driver_arriving');
  }, [trip?.status, trip?.id]);

  // One Directions call per leg (pickup leg, then destination leg)
  useEffect(() => {
    if (!trip) return;
    const from = trip.status === 'in_progress' ? trip.origin : trip.driverStart || trip.origin;
    const to = trip.status === 'in_progress' ? trip.destination : trip.origin;
    getRoute(from, to).then(setEncoded).catch(() => setEncoded(''));
  }, [trip?.status === 'in_progress']); // eslint-disable-line react-hooks/exhaustive-deps

  if (!trip) return null;
  const inProgress = trip.status === 'in_progress';
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
        region={{ latitude: target.lat, longitude: target.lng, latitudeDelta: 0.04, longitudeDelta: 0.04 }}
      >
        <Marker coordinate={{ latitude: target.lat, longitude: target.lng }} />
        {encoded ? <Polyline coordinates={decodePolyline(encoded)} strokeWidth={4} /> : null}
      </MapView>
      <View style={{ padding: 16, backgroundColor: '#fff' }}>
        <Text style={{ fontWeight: '700' }}>{inProgress ? `Hacia el destino: ${trip.destination.address}` : `Hacia el pasajero: ${trip.origin.address}`}</Text>
        {!inProgress ? (
          <Pressable style={s.btn} onPress={() => setTripStatus(trip.id, 'in_progress')}>
            <Text style={s.btnText}>Pasajero a bordo</Text>
          </Pressable>
        ) : (
          <Pressable style={s.btn} onPress={finish}><Text style={s.btnText}>Finalizar viaje</Text></Pressable>
        )}
        {!inProgress && (
          <Pressable style={[s.btn, { backgroundColor: '#d92d20' }]} onPress={async () => { await setTripStatus(trip.id, 'cancelled'); navigation.popToTop(); }}>
            <Text style={s.btnText}>Cancelar viaje</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
