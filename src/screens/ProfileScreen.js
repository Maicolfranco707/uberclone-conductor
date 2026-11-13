// AI-assisted: see docs/AI_LOG.md #2
import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../services/firebase';
import { useSession } from '../context/SessionContext';
import EditSection from '../components/EditSection';
import { vehicleFields, documentFields } from './registrationFields';
import { validators as v } from '../utils/validators';
import { s, colors, fonts } from '../theme';

const contactFields = [
  { key: 'phone', label: 'Celular', type: 'number', validate: v.phone },
  { key: 'mpEmail', label: 'Correo de Mercado Pago', keyboard: 'email-address', validate: v.email },
  {
    key: 'language', label: 'Idioma', type: 'select',
    options: [{ value: 'es', label: 'Español' }, { value: 'en', label: 'English' }],
    validate: v.required,
  },
];
// Terms and the payment email are not part of the documents section
const docFields = documentFields.filter((f) => f.key !== 'acceptTerms' && f.key !== 'mpEmail');

const SECTIONS = [
  ['contact', 'Datos', contactFields],
  ['vehicle', 'Vehículo', vehicleFields],
  ['docs', 'Documentos', docFields],
];
const STATUS = { pending: 'Pendiente de aprobación', approved: 'Aprobado' };

export default function ProfileScreen() {
  const { driver } = useSession();
  const [section, setSection] = useState('contact');
  if (!driver) return null;
  const current = SECTIONS.find(([k]) => k === section);

  // Preference only (no sensitive data): remember the chosen language
  const onSaved = (update) => {
    if (update.language) AsyncStorage.setItem('language', update.language);
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        {driver.photo ? (
          <Image source={{ uri: driver.photo }} style={{ width: 64, height: 64, borderRadius: 32, marginRight: 14 }} />
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: colors.text }}>{driver.fullName}</Text>
          <Text style={s.muted}>{driver.brand} {driver.model} · {driver.plate}</Text>
          <Text style={s.muted}>{STATUS[driver.approvalStatus] || driver.approvalStatus}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        {SECTIONS.map(([k, label]) => (
          <Pressable key={k} style={[s.chip, section === k && s.chipOn]} onPress={() => setSection(k)}>
            <Text style={{ color: section === k ? '#fff' : colors.text }}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <EditSection key={section} driver={driver} fields={current[2]} onSaved={onSaved} />

      <Pressable style={[s.btn, { backgroundColor: colors.danger }]} onPress={() => signOut(auth)}>
        <Text style={s.btnText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}