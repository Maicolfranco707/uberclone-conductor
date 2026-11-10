// AI-assisted: see docs/AI_LOG.md #1
import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFonts, Sora_400Regular, Sora_600SemiBold, Sora_700Bold } from '@expo-google-fonts/sora';
import { SessionProvider } from './src/context/SessionContext';
import Navigation from './src/navigation';

export default function App() {
  const [fontsLoaded] = useFonts({ Sora_400Regular, Sora_600SemiBold, Sora_700Bold });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#EDF0F4' }}>
        <ActivityIndicator color="#1B2A41" />
      </View>
    );
  }

  return (
    <SessionProvider>
      <Navigation />
    </SessionProvider>
  );
}
