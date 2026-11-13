import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Pressable, ScrollView } from 'react-native';
import { useSession } from '../context/SessionContext';
import { fetchTripsPage } from '../services/trips';
import { DateField } from '../components/Field';
import { formatCOP } from '../utils/calculateFare';
import { startOfDay, startOfWeek, startOfMonth } from '../utils/dates';
import { s } from '../theme';
import { categoryLabel, paymentMethodLabel } from '../utils/labels';

const PERIODS = [['today', 'Hoy'], ['week', 'Semana'], ['month', 'Mes'], ['range', 'Rango']];
const METHODS = [['all', 'Todos'], ['mercadopago', 'Mercado Pago'], ['stripe', 'Stripe'], ['cash', 'Efectivo']];

const Chip = ({ on, label, onPress }) => (
  <Pressable style={[s.chip, on && s.chipOn]} onPress={onPress}>
    <Text style={{ color: on ? '#fff' : '#111' }}>{label}</Text>
  </Pressable>
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
  const loadingRef = useRef(false); // blocks a second request while one is in flight
  const generationRef = useRef(0); // discards answers that belong to an old filter

  const bounds = useCallback(() => {
    if (period === 'today') return { from: startOfDay() };
    if (period === 'week') return { from: startOfWeek() };
    if (period === 'month') return { from: startOfMonth() };
    const parse = (v, endOfDay) => {
      if (!v) return undefined;
      const [y, m, d] = v.split('-').map(Number);
      return new Date(y, m - 1, d, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0);
    };
    return { from: parse(range.from), to: parse(range.to, true) };
  }, [period, range]);

  const load = useCallback(async (reset) => {
    if (!driver) return;
    if (reset) generationRef.current += 1;
    else if (loadingRef.current || end) return;

    const generation = generationRef.current;
    loadingRef.current = true;
    setLoading(true);
    try {
      const page = await fetchTripsPage({
        driverId: driver.id,
        ...bounds(),
        cursor: reset ? null : cursor,
        pageSize: 20,
      });
      if (generation !== generationRef.current) return; // the filter changed meanwhile
      setItems((prev) => {
        const base = reset ? [] : prev;
        const seen = new Set(base.map((t) => t.id));
        return [...base, ...page.items.filter((t) => !seen.has(t.id))];
      });
      setCursor(page.cursor);
      setEnd(page.end);
    } finally {
      if (generation === generationRef.current) {
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, [driver, bounds, cursor, end]);

  useEffect(() => {
    setEnd(false);
    load(true);
  }, [driver?.id, period, range]); // eslint-disable-line react-hooks/exhaustive-deps

  const data = method === 'all' ? items : items.filter((t) => t.paymentMethod === method);

  return (
    <View style={s.screen}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {PERIODS.map(([k, l]) => <Chip key={k} on={period === k} label={l} onPress={() => setPeriod(k)} />)}
      </View>
      {period === 'range' && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <View style={{ flex: 1 }}><DateField value={range.from} onChange={(v) => setRange((r) => ({ ...r, from: v }))} /></View>
          <View style={{ flex: 1 }}><DateField value={range.to} onChange={(v) => setRange((r) => ({ ...r, to: v }))} /></View>
        </View>
      )}
      <ScrollView horizontal style={{ flexGrow: 0, marginVertical: 8 }}>
        {METHODS.map(([k, l]) => <Chip key={k} on={method === k} label={l} onPress={() => setMethod(k)} />)}
      </ScrollView>
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
            <View style={s.row}>
              <Text>{categoryLabel(t.category)} · {formatCOP(t.fare)}</Text>
              <Text style={{ fontWeight: '700' }}>{formatCOP(t.driverEarnings)}</Text>
            </View>
            <Text style={s.muted}>Pago: {paymentMethodLabel(t.paymentMethod)}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}