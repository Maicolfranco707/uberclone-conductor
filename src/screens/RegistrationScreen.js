import React, { createContext, useContext, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { uploadImage } from '../services/cloudinary';
import { useSession } from '../context/SessionContext';
import Field from '../components/Field';
import { s } from '../theme';
import { personalFields, vehicleFields, documentFields, allFields } from './registrationFields';

const FormCtx = createContext(null);
const Tab = createMaterialTopTabNavigator();

function FormTab({ fields }) {
  const { form, setForm, touched, setTouched, errors } = useContext(FormCtx);
  return (
    <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      {fields.map((def) => (
        <Field
          key={def.key}
          def={def}
          value={form[def.key]}
          error={touched[def.key] ? errors[def.key] : ''}
          onChange={(val) => setForm((f) => ({ ...f, [def.key]: val }))}
          onTouch={() => setTouched((t) => ({ ...t, [def.key]: true }))}
        />
      ))}
    </ScrollView>
  );
}

export default function RegistrationScreen() {
  const { user } = useSession();
  const [form, setForm] = useState({ email: user?.email || '', acceptTerms: false });
  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);

  const errors = useMemo(() => {
    const out = {};
    allFields.forEach((f) => { out[f.key] = f.validate(form[f.key], form); });
    return out;
  }, [form]);
  const valid = Object.values(errors).every((e) => !e);

  const submit = async () => {
    setSending(true);
    try {
      const imageKeys = allFields.filter((f) => f.type === 'image').map((f) => f.key);
      const data = { ...form, plate: form.plate.toUpperCase() };
      for (const k of imageKeys) if (data[k]) data[k] = await uploadImage(data[k]);
      await setDoc(doc(db, 'drivers', user.uid), {
        ...data,
        approvalStatus: 'pending', // change to 'approved' in Firestore to simulate approval
        isAvailable: false,
        balance: 0,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      Alert.alert('Error', e.message); // only for network/server failures, not field validation
    } finally {
      setSending(false);
    }
  };

  return (
    <FormCtx.Provider value={{ form, setForm, touched, setTouched, errors }}>
      <View style={{ flex: 1, paddingTop: 40, backgroundColor: '#fff' }}>
        <Tab.Navigator>
          <Tab.Screen name="Datos">{() => <FormTab fields={personalFields} />}</Tab.Screen>
          <Tab.Screen name="Vehículo">{() => <FormTab fields={vehicleFields} />}</Tab.Screen>
          <Tab.Screen name="Documentos">{() => <FormTab fields={documentFields} />}</Tab.Screen>
        </Tab.Navigator>
        <Pressable style={[s.btn, { margin: 16 }, (!valid || sending) && s.btnOff]} disabled={!valid || sending} onPress={submit}>
          {sending ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Enviar registro</Text>}
        </Pressable>
      </View>
    </FormCtx.Provider>
  );
}
