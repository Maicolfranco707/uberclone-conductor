import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Pressable } from 'react-native';
import MapView from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useSession } from '../context/SessionContext';
import useDriverLocation from '../hooks/useDriverLocation';
import useTripRequests from '../hooks/useTripRequests';
import { s, colors } from '../theme';

export default function HomeScreen({ navigation }) {
  const { driver, activeTrip, setActiveTripId } = useSession();
  const [available, setAvailable] = useState(false);
  const approved = driver?.approvalStatus === 'approved';
  const { location } = useDriverLocation(driver?.id, available);
  const request = useTripRequests(driver?.id, available);

  // Preference only (no sensitive data): remember last availability choice
  useEffect(() => { AsyncStorage.setItem('lastAvailability', String(available)); }, [available]);

  useEffect(() => {
    if (request) navigation.navigate('IncomingRequest', { trip: request });
  }, [request, navigation]);

  const toggle = async (value) => {
    if (!approved) return;
    setAvailable(value);
    await updateDoc(doc(db, 'drivers', driver.id), { isAvailable: value });
  };

  // Leaving the screen with the switch on is fine (tracking continues), but unmounting stops it via hook cleanup.
  const hasActiveTrip = activeTrip && !['paid', 'cancelled', 'rejected'].includes(activeTrip.status);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        showsUserLocation
        region={location ? { latitude: location.lat, longitude: location.lng, latitudeDelta: 0.02, longitudeDelta: 0.02 } : undefined}
      />
      <View style={{ position: 'absolute', top: 50, left: 16, right: 16, backgroundColor: '#fff', borderRadius: 12, padding: 14 }}>
        {!approved && <Text style={[s.error, { marginBottom: 8 }]}>Tu cuenta está pendiente de aprobación.</Text>}
        <View style={[s.row, { alignItems: 'center' }]}>
          <Text style={{ fontWeight: '700' }}>{available ? 'Disponible' : 'No disponible'}</Text>
          <Switch value={available} disabled={!approved} onValueChange={toggle} trackColor={{ true: colors.accent }} />
        </View>
        {hasActiveTrip && (
          <Pressable style={s.btn} onPress={() => navigation.navigate(activeTrip.status === 'completed' ? 'PaymentSummary' : 'TripInProgress')}>
            <Text style={s.btnText}>Volver al viaje</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
