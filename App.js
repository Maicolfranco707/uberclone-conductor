import 'react-native-gesture-handler';
import React from 'react';
import { SessionProvider } from './src/context/SessionContext';
import Navigation from './src/navigation';

export default function App() {
  return (
    <SessionProvider>
      <Navigation />
    </SessionProvider>
  );
}
