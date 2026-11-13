// AI-assisted: see docs/AI_LOG.md #4
import * as Notifications from 'expo-notifications';

// Show the banner even if the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function askNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Local notification (works in Expo Go). A real push would come from FCM in a development build.
export function notifyNewRequest(trip) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Nueva solicitud de viaje',
      body: `${trip.origin?.address} → ${trip.destination?.address}`,
      sound: true,
    },
    trigger: null,
  });
}