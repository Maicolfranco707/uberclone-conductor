// AI-assisted: see docs/AI_LOG.md #2
import React, { useState } from 'react';
import { View, Text, Pressable, Linking, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '../context/SessionContext';
import { markCashPaid } from '../services/trips';
import { createPaymentPreference } from '../services/payments';
import { formatCOP } from '../utils/calculateFare';
import { s, colors, fonts } from '../theme';

const LABEL = { approved: 'Aprobado', pending: 'Pendiente', rejected: 'Rechazado', cash: 'Efectivo', cash_pending: 'Pendiente' };

export default function PaymentSummaryScreen({ navigation }) {
  const { activeTrip: trip, setActiveTripId } = useSession();
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!trip || trip.fare === undefined) return <ActivityIndicator style={{ flex: 1 }} />;

  const isCash = trip.paymentMethod === 'cash';
  const done = trip.status === 'paid';

  const pay = async () => {
    setBusy(true); setError('');
    try {
      const { initPoint } = await createPaymentPreference(trip.id);
      await Linking.openURL(initPoint); // Checkout Pro; result arrives via webhook -> Firestore
    } catch (e) { setError(e.message); }
    setBusy(false);
  };

  const Row = ({ k, v }) => (
    <View style={s.row}>
      <Text style={s.muted}>{k}</Text>
      <Text style={{ fontFamily: fonts.regular, color: colors.text }}>{v}</Text>
    </View>
  );

  return (
    <View style={[s.screen, { paddingTop: insets.top + 16 }]}>
      <Text style={s.title}>Resumen del viaje</Text>
      <View style={s.card}>
        <Row k="Tarifa final" v={formatCOP(trip.fare)} />
        <Row k={`Comisión (${(trip.commissionRate * 100).toFixed(0)}%)`} v={`-${formatCOP(trip.commission)}`} />
        <Row k="Propina" v={formatCOP(trip.tip || 0)} />
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 10 }} />
        <Text style={s.muted}>Ganancia neta</Text>
        <Text style={{ fontFamily: fonts.bold, fontSize: 34, letterSpacing: -1, color: colors.text }}>
          {formatCOP(trip.driverEarnings)}
        </Text>
        <Text style={[s.muted, { marginTop: 6 }]}>Estado del pago: {LABEL[trip.paymentStatus] || trip.paymentStatus}</Text>
      </View>

      {error ? <Text style={s.error}>{error}</Text> : null}
      {!done && isCash && (
        <Pressable style={s.btn} onPress={() => markCashPaid(trip)}>
          <Text style={s.btnText}>Cobro en efectivo recibido</Text>
        </Pressable>
      )}
      {!done && !isCash && (
        <Pressable style={[s.btn, busy && s.btnOff]} disabled={busy} onPress={pay}>
          <Text style={s.btnText}>Cobrar con Mercado Pago</Text>
        </Pressable>
      )}
      {done && (
        <Pressable style={s.btn} onPress={() => { setActiveTripId(null); navigation.popToTop(); }}>
          <Text style={s.btnText}>Listo</Text>
        </Pressable>
      )}
    </View>
  );
}
