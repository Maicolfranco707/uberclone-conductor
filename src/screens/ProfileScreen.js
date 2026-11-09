import React, { useState } from 'react';
import { ScrollView, Text, Pressable, Image, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../services/firebase';
import { useSession } from '../context/SessionContext';
import Field from '../components/Field';
import { validators as v } from '../utils/validators';
import { s } from '../theme';

export default function ProfileScreen() {
  const { driver } = useSession();
  const [phone, setPhone] = useState(driver?.phone || '');
  const [mpEmail, setMpEmail] = useState(driver?.mpEmail || '');
  const [language, setLanguage] = useState(driver?.language || 'es');
  const errors = { phone: v.phone(phone), mpEmail: v.email(mpEmail) };
  const valid = !errors.phone && !errors.mpEmail;

  const save = async () => {
    await updateDoc(doc(db, 'drivers', driver.id), { phone, mpEmail, language });
    await AsyncStorage.setItem('language', language); // preference only
    Alert.alert('Listo', 'Perfil actualizado');
  };

  return (
    <ScrollView style={s.screen}>
      {driver?.photo && <Image source={{ uri: driver.photo }} style={{ width: 90, height: 90, borderRadius: 45 }} />}
      <Text style={s.title}>{driver?.fullName}</Text>
      <Text style={s.muted}>{driver?.brand} {driver?.model} · {driver?.plate} · {driver?.category}</Text>
      <Text style={s.muted}>Estado: {driver?.approvalStatus}</Text>
      <Field def={{ label: 'Celular', type: 'number' }} value={phone} error={errors.phone} onChange={setPhone} onTouch={() => {}} />
      <Field def={{ label: 'Correo de Mercado Pago', keyboard: 'email-address' }} value={mpEmail} error={errors.mpEmail} onChange={setMpEmail} onTouch={() => {}} />
      <Field def={{ label: 'Idioma', type: 'select', options: [{ value: 'es', label: 'Español' }, { value: 'en', label: 'English' }] }} value={language} onChange={setLanguage} onTouch={() => {}} />
      <Pressable style={[s.btn, !valid && s.btnOff]} disabled={!valid} onPress={save}><Text style={s.btnText}>Guardar cambios</Text></Pressable>
      <Pressable style={[s.btn, { backgroundColor: '#d92d20' }]} onPress={() => signOut(auth)}><Text style={s.btnText}>Cerrar sesión</Text></Pressable>
    </ScrollView>
  );
}
