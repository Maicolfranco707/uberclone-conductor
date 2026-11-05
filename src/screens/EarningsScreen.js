// AI-assisted: see docs/AI_LOG.md #1
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSession } from '../context/SessionContext';
import useEarnings from '../hooks/useEarnings';
import { formatCOP } from '../utils/calculateFare';
import { s } from '../theme';

function Block({ title, d }) {
  const Row = ({ k, v }) => (<View style={s.row}><Text style={s.muted}>{k}</Text><Text>{v}</Text></View>);
  return (
    <View style={s.card}>
      <Text style={{ fontWeight: '700', fontSize: 16 }}>{title}</Text>
      <Row k="Viajes" v={d.count} />
      <Row k="Total facturado" v={formatCOP(d.billed)} />
      <Row k="Comisiones" v={formatCOP(d.commissions)} />
      <Row k="Propinas" v={formatCOP(d.tips)} />
      <Row k="Ganancia neta" v={formatCOP(d.net)} />
      <Row k="Promedio por viaje" v={formatCOP(d.average)} />
    </View>
  );
}

export default function EarningsScreen() {
  const { driver } = useSession();
  const e = useEarnings(driver?.id);
  return (
    <ScrollView style={s.screen}>
      <View style={[s.card, { backgroundColor: '#f3f4f6' }]}>
        <Text style={s.muted}>Saldo</Text>
        <Text style={{ fontSize: 26, fontWeight: '800', color: (driver?.balance || 0) < 0 ? '#d92d20' : '#111' }}>{formatCOP(driver?.balance)}</Text>
        <Text style={s.muted}>Viajes pagados por pasarela, menos comisiones de viajes en efectivo.</Text>
      </View>
      <Block title="Hoy" d={e.today} />
      <Block title="Esta semana" d={e.week} />
      <Block title="Este mes" d={e.month} />
    </ScrollView>
  );
}
