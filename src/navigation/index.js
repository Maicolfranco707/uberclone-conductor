// AI-assisted: see docs/AI_LOG.md #1
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSession } from '../context/SessionContext';
import AuthScreen from '../screens/AuthScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import HomeScreen from '../screens/HomeScreen';
import EarningsScreen from '../screens/EarningsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import IncomingRequestScreen from '../screens/IncomingRequestScreen';
import TripInProgressScreen from '../screens/TripInProgressScreen';
import PaymentSummaryScreen from '../screens/PaymentSummaryScreen';
import TripDetailScreen from '../screens/TripDetailScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MainDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Inicio" component={HomeScreen} options={{ headerTransparent: true, headerTitle: '' }} />
      <Drawer.Screen name="Ganancias" component={EarningsScreen} />
      <Drawer.Screen name="Historial" component={HistoryScreen} />
      <Drawer.Screen name="Perfil" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

export default function Navigation() {
  const { loading, user, driver } = useSession();
  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : !driver ? (
          <Stack.Screen name="Registration" component={RegistrationScreen} />
        ) : (
          <>
            <Stack.Screen name="Drawer" component={MainDrawer} />
            <Stack.Screen name="IncomingRequest" component={IncomingRequestScreen} options={{ presentation: 'modal', gestureEnabled: false }} />
            <Stack.Screen name="TripInProgress" component={TripInProgressScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="PaymentSummary" component={PaymentSummaryScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="TripDetail" component={TripDetailScreen} options={{ headerShown: true, title: 'Detalle del viaje' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
