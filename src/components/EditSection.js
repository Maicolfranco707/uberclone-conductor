// AI-assisted: see docs/AI_LOG.md #2
import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { uploadImage } from '../services/cloudinary';
import Field from './Field';
import { s } from '../theme';

// Edits a group of driver fields and saves only what changed.
export default function EditSection({ driver, fields, onSaved }) {
  const [form, setForm] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.key, driver[f.key] ?? '']))
  );
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const merged = { ...driver, ...form };
  const errors = Object.fromEntries(fields.map((f) => [f.key, f.validate(merged[f.key], merged)]));
  const valid = Object.values(errors).every((e) => !e);
  const changed = fields.filter((f) => form[f.key] !== (driver[f.key] ?? ''));
  const disabled = !valid || changed.length === 0 || saving;

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      const update = {};
      for (const f of changed) {
        let value = form[f.key];
        if (f.type === 'image' && !String(value).startsWith('http')) value = await uploadImage(value);
        if (f.key === 'plate') value = String(value).toUpperCase();
        update[f.key] = value;
      }
      await updateDoc(doc(db, 'drivers', driver.id), update);
      setForm((prev) => ({ ...prev, ...update }));
      setMessage('Cambios guardados');
      if (onSaved) onSaved(update);
    } catch (e) {
      setMessage('No se pudo guardar: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View>
      {fields.map((def) => (
        <Field
          key={def.key}
          def={def}
          value={form[def.key]}
          error={touched[def.key] ? errors[def.key] : ''}
          onChange={(v) => setForm((prev) => ({ ...prev, [def.key]: v }))}
          onTouch={() => setTouched((t) => ({ ...t, [def.key]: true }))}
        />
      ))}
      {message ? <Text style={[s.muted, { marginTop: 12 }]}>{message}</Text> : null}
      <Pressable style={[s.btn, disabled && s.btnOff]} disabled={disabled} onPress={save}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Guardar cambios</Text>}
      </Pressable>
    </View>
  );
}