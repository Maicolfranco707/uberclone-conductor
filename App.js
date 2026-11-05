// AI-assisted: see docs/AI_LOG.md #1
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
