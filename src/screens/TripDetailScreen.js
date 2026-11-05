// AI-assisted: see docs/AI_LOG.md #1
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { decodePolyline } from '../utils/polyline';
import { formatCOP } from '../utils/calculateFare';
import { s } from '../theme';

export default function TripDetailScreen({ route }) {
  const { trip: t } = route.params;
  const coords = decodePolyline(t.route); // saved route: no Static Maps / Directions call
  const Row = ({ k, v }) => (<View style={s.row}><Text style={s.muted}>{k}</Text><Text>{v}</Text></View>);
  return (
    <ScrollView>
      <MapView style={{ height: 260 }} initialRegion={{ latitude: t.origin.lat, longitude: t.origin.lng, latitudeDelta: 0.06, longitudeDelta: 0.06 }}>
        <Marker coordinate={{ latitude: t.origin.lat, longitude: t.origin.lng }} />
        <Marker coordinate={{ latitude: t.destination.lat, longitude: t.destination.lng }} pinColor="green" />
        {coords.length > 0 && <Polyline coordinates={coords} strokeWidth={4} />}
      </MapView>
      <View style={s.screen}>
        <Row k="Duración" v={`${t.durationMin} min`} />
        <Row k="Distancia" v={`${t.distanceKm} km`} />
        <Row k="Tarifa" v={formatCOP(t.fare)} />
        <Row k={`Comisión (${(t.commissionRate * 100).toFixed(0)}%)`} v={formatCOP(t.commission)} />
        <Row k="Propina" v={formatCOP(t.tip || 0)} />
        <Row k="Ganancia neta" v={formatCOP(t.driverEarnings)} />
        <Row k="Calificación del pasajero" v={t.rating ? `${t.rating} / 5` : 'Sin calificar'} />
      </View>
    </ScrollView>
  );
}
