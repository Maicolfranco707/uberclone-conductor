// AI-assisted: see docs/AI_LOG.md #2, #4
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, AppState } from 'react-native';
import MapView from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { askNotificationPermission, notifyNewRequest } from '../services/notifications';
import { useSession } from '../context/SessionContext';
import useDriverLocation from '../hooks/useDriverLocation';
import useTripRequests from '../hooks/useTripRequests';
import { s, colors, fonts } from '../theme';

export default function HomeScreen({ navigation }) {
  const { driver, activeTrip } = useSession();
  const [available, setAvailable] = useState(false);
  const approved = driver?.approvalStatus === 'approved';
  const { location } = useDriverLocation(driver?.id, available);
  const request = useTripRequests(driver?.id, available);

  // Preference only (no sensitive data): remember last availability choice
  useEffect(() => { AsyncStorage.setItem('lastAvailability', String(available)); }, [available]);

  // On app start the pill is off, so Firestore must say the same
  useEffect(() => {
    if (driver?.id && driver.isAvailable) {
      updateDoc(doc(db, 'drivers', driver.id), { isAvailable: false });
    }
  }, [driver?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // New request: notify if the app is in the background, and open the request screen
  useEffect(() => {
    if (request) {
      if (AppState.currentState !== 'active') notifyNewRequest(request);
      navigation.navigate('IncomingRequest', { trip: request });
    }
  }, [request, navigation]);

  const toggle = async () => {
    if (!approved) return;
    const next = !available;
    if (next) askNotificationPermission();
    setAvailable(next);
    await updateDoc(doc(db, 'drivers', driver.id), { isAvailable: next });
  };

  const hasActiveTrip = activeTrip && !['paid', 'cancelled', 'rejected'].includes(activeTrip.status);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        showsUserLocation
        region={location ? { latitude: location.lat, longitude: location.lng, latitudeDelta: 0.02, longitudeDelta: 0.02 } : undefined}
      />

      <View style={{ position: 'absolute', left: 20, right: 20, bottom: 34 }}>
        {!approved && (
          <View style={[s.card, { marginBottom: 10, paddingVertical: 12 }]}>
            <Text style={{ fontFamily: fonts.semibold, color: colors.danger }}>Cuenta pendiente de aprobación</Text>
            <Text style={[s.muted, { marginTop: 2, fontSize: 13 }]}>Podrás ponerte disponible cuando la aprueben.</Text>
          </View>
        )}

        {hasActiveTrip && (
          <Pressable
            style={[s.btn, { marginTop: 0, marginBottom: 10 }]}
            onPress={() => navigation.navigate(activeTrip.status === 'completed' ? 'PaymentSummary' : 'TripInProgress')}
          >
            <Text style={s.btnText}>Volver al viaje</Text>
          </Pressable>
        )}

        {/* The "taxi lamp": glows amber when the driver is online */}
        <Pressable
          onPress={toggle}
          disabled={!approved}
          style={{
            height: 64,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: available ? colors.accent : colors.surface,
            borderWidth: available ? 0 : 1,
            borderColor: colors.border,
            opacity: approved ? 1 : 0.5,
            shadowColor: colors.accent,
            shadowOpacity: available ? 0.75 : 0,
            shadowRadius: 22,
            shadowOffset: { width: 0, height: 0 },
            elevation: available ? 12 : 3,
          }}
        >
          <Text style={{ fontFamily: fonts.bold, fontSize: 18, letterSpacing: -0.3, color: available ? colors.text : colors.muted }}>
            {available ? 'Disponible' : 'No disponible'}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: available ? colors.text : colors.muted }}>
            {available ? 'Toca para desconectarte' : 'Toca para recibir viajes'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}