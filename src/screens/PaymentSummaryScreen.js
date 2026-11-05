import React, { useState } from 'react';
import { View, Text, Pressable, Linking, ActivityIndicator } from 'react-native';
import { useSession } from '../context/SessionContext';
import { markCashPaid } from '../services/trips';
import { createPaymentPreference } from '../services/payments';
import { formatCOP } from '../utils/calculateFare';
import { s } from '../theme';

const LABEL = { approved: 'Aprobado', pending: 'Pendiente', rejected: 'Rechazado', cash: 'Efectivo', cash_pending: 'Pendiente' };

export default function PaymentSummaryScreen({ navigation }) {
  const { activeTrip: trip, setActiveTripId } = useSession();
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

  const Row = ({ k, v, bold }) => (<View style={s.row}><Text style={s.muted}>{k}</Text><Text style={bold && { fontWeight: '700' }}>{v}</Text></View>);

  return (
    <View style={s.screen}>
      <Text style={s.title}>Resumen del viaje</Text>
      <View style={s.card}>
        <Row k="Tarifa final" v={formatCOP(trip.fare)} />
        <Row k={`Comisión (${(trip.commissionRate * 100).toFixed(0)}%)`} v={`-${formatCOP(trip.commission)}`} />
        <Row k="Propina" v={formatCOP(trip.tip || 0)} />
        <Row k="Ganancia neta" v={formatCOP(trip.driverEarnings)} bold />
        <Row k="Estado del pago" v={LABEL[trip.paymentStatus] || trip.paymentStatus} bold />
      </View>
      {error ? <Text style={s.error}>{error}</Text> : null}
      {!done && isCash && <Pressable style={s.btn} onPress={() => markCashPaid(trip)}><Text style={s.btnText}>Cobro en efectivo recibido</Text></Pressable>}
      {!done && !isCash && <Pressable style={[s.btn, busy && s.btnOff]} disabled={busy} onPress={pay}><Text style={s.btnText}>Cobrar con Mercado Pago</Text></Pressable>}
      {done && <Pressable style={s.btn} onPress={() => { setActiveTripId(null); navigation.popToTop(); }}><Text style={s.btnText}>Listo</Text></Pressable>}
    </View>
  );
}
