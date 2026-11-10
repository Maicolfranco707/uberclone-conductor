// AI-assisted: see docs/AI_LOG.md #1
// AI-assisted: see docs/AI_LOG.md #1
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, Switch, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { s, colors } from '../theme';
import { toISODate } from '../utils/dates';
import SelectField from './SelectField';

const yearsAgo = (n) => { const d = new Date(); d.setFullYear(d.getFullYear() - n); return d; };

export function DateField({ value, onChange, maximumDate, minimumDate }) {
  const [show, setShow] = useState(false);
  const [y, m, d] = (value || '').split('-').map(Number);
  const current = value ? new Date(y, m - 1, d) : (maximumDate || new Date());
  return (
    <>
      <Pressable style={s.input} onPress={() => setShow(true)}>
        <Text>{value || 'Seleccionar fecha'}</Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={current}
          mode="date"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={(_, date) => {
            setShow(Platform.OS === 'ios');
            if (date) onChange(toISODate(date));
          }}
        />
      )}
    </>
  );
}

async function pickImage() {
  const choice = await new Promise((resolve) => {
    const { Alert } = require('react-native');
    Alert.alert('Imagen', 'Elige el origen', [
      { text: 'Cámara', onPress: () => resolve('camera') },
      { text: 'Galería', onPress: () => resolve('gallery') },
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(null) },
    ]);
  });
  if (!choice) return null;
  const opts = { mediaTypes: ['images'], quality: 0.7 };
  const res =
    choice === 'camera'
      ? (await ImagePicker.requestCameraPermissionsAsync()).granted && (await ImagePicker.launchCameraAsync(opts))
      : await ImagePicker.launchImageLibraryAsync(opts);
  return res && !res.canceled ? res.assets[0].uri : null;
}

// Generic field: text | number | select | date | image | checkbox
export default function Field({ def, value, error, onChange, onTouch }) {
  const { type = 'text', label, options, hint } = def;
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      {hint ? <Text style={s.muted}>{hint}</Text> : null}
      {type === 'select' && (
        <SelectField value={value} options={options} onChange={(v) => { onChange(v); onTouch(); }} />
      )}
      {type === 'date' && (
        <DateField
          value={value}
          maximumDate={def.maxYearsAgo ? yearsAgo(def.maxYearsAgo) : undefined}
          onChange={(v) => { onChange(v); onTouch(); }}
        />
      )}
      {type === 'image' && (
        <Pressable
          style={[s.input, { alignItems: 'center' }]}
          onPress={async () => { const uri = await pickImage(); if (uri) onChange(uri); onTouch(); }}
        >
          {value ? <Image source={{ uri: value }} style={{ width: 120, height: 120, borderRadius: 8 }} /> : <Text>Tomar o elegir foto</Text>}
        </Pressable>
      )}
      {type === 'checkbox' && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Switch value={!!value} onValueChange={(v) => { onChange(v); onTouch(); }} trackColor={{ true: colors.accent }} />
          <Text style={{ flex: 1, marginLeft: 8 }}>{def.text}</Text>
        </View>
      )}
      {(type === 'text' || type === 'number') && (
        <TextInput
          style={s.input}
          value={value ?? ''}
          keyboardType={type === 'number' ? 'number-pad' : def.keyboard || 'default'}
          autoCapitalize={def.autoCapitalize || 'none'}
          secureTextEntry={def.secure}
          onChangeText={(v) => onChange(def.upper ? v.toUpperCase() : v)}
          onBlur={onTouch}
        />
      )}
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}