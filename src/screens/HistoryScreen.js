// AI-assisted: see docs/AI_LOG.md #1
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, ScrollView } from 'react-native';
import { useSession } from '../context/SessionContext';
import { fetchTripsPage } from '../services/trips';
import { DateField } from '../components/Field';
import { formatCOP } from '../utils/calculateFare';
import { startOfDay, startOfWeek, startOfMonth } from '../utils/dates';
import { s } from '../theme';

const PERIODS = [['today', 'Hoy'], ['week', 'Semana'], ['month', 'Mes'], ['range', 'Rango']];
const METHODS = [['all', 'Todos'], ['mercadopago', 'Mercado Pago'], ['stripe', 'Stripe'], ['cash', 'Efectivo']];

const Chip = ({ on, label, onPress }) => (
  <Pressable style={[s.chip, on && s.chipOn]} onPress={onPress}><Text style={{ color: on ? '#fff' : '#111' }}>{label}</Text></Pressable>
);

export default function HistoryScreen({ navigation }) {
  const { driver } = useSession();
  const [period, setPeriod] = useState('week');
  const [method, setMethod] = useState('all');
  const [range, setRange] = useState({ from: '', to: '' });
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [end, setEnd] = useState(false);
  const [loading, setLoading] = useState(false);

  const bounds = useCallback(() => {
    if (period === 'today') return { from: startOfDay() };
    if (period === 'week') return { from: startOfWeek() };
    if (period === 'month') return { from: startOfMonth() };
    const parse = (v, endOfDay) => { if (!v) return undefined; const [y, m, d] = v.split('-').map(Number); return new Date(y, m - 1, d, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0); };
    return { from: parse(range.from), to: parse(range.to, true) };
  }, [period, range]);

  const load = useCallback(async (reset) => {
    if (!driver || loading || (!reset && end)) return;
    setLoading(true);
    try {
      const page = await fetchTripsPage({ driverId: driver.id, ...bounds(), cursor: reset ? null : cursor, pageSize: 20 });
      setItems((prev) => (reset ? page.items : [...prev, ...page.items]));
      setCursor(page.cursor); setEnd(page.end);
    } finally { setLoading(false); }
  }, [driver, bounds, cursor, end, loading]);

  useEffect(() => { setEnd(false); load(true); }, [driver?.id, period, range]); // eslint-disable-line react-hooks/exhaustive-deps

  const data = method === 'all' ? items : items.filter((t) => t.paymentMethod === method);

  return (
    <View style={s.screen}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{PERIODS.map(([k, l]) => <Chip key={k} on={period === k} label={l} onPress={() => setPeriod(k)} />)}</View>
      {period === 'range' && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <View style={{ flex: 1 }}><DateField value={range.from} onChange={(v) => setRange((r) => ({ ...r, from: v }))} /></View>
          <View style={{ flex: 1 }}><DateField value={range.to} onChange={(v) => setRange((r) => ({ ...r, to: v }))} /></View>
        </View>
      )}
      <ScrollView horizontal style={{ flexGrow: 0, marginVertical: 8 }}>{METHODS.map(([k, l]) => <Chip key={k} on={method === k} label={l} onPress={() => setMethod(k)} />)}</ScrollView>
      <FlatList
        data={data}
        keyExtractor={(t) => t.id}
        onEndReached={() => load(false)}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={!loading && <Text style={[s.muted, { textAlign: 'center', marginTop: 40 }]}>No tienes viajes en este filtro.</Text>}
        renderItem={({ item: t }) => (
          <Pressable style={s.card} onPress={() => navigation.navigate('TripDetail', { trip: t })}>
            <Text style={s.muted}>{new Date(t.completedAt).toLocaleString()}</Text>
            <Text numberOfLines={1}>{t.origin?.address} → {t.destination?.address}</Text>
            <View style={s.row}><Text>{t.category} · {formatCOP(t.fare)}</Text><Text style={{ fontWeight: '700' }}>{formatCOP(t.driverEarnings)}</Text></View>
            <Text style={s.muted}>Pago: {t.paymentStatus}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
