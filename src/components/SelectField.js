// AI-assisted: see docs/AI_LOG.md #2
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { s, colors, fonts } from '../theme';

// Dropdown list that opens below the field (replaces the iOS wheel picker).
export default function SelectField({ value, options, onChange, placeholder = 'Seleccionar...' }) {
  const [open, setOpen] = useState(false);
  const items = options.map((o) => ({ value: o.value ?? o, label: o.label ?? o }));
  const selected = items.find((o) => o.value === value);

  return (
    <View>
      <Pressable
        style={[s.input, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
        onPress={() => setOpen((v) => !v)}
      >
        <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: selected ? colors.text : colors.muted }}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={{ color: colors.muted }}>{open ? '▲' : '▼'}</Text>
      </Pressable>

      {open && (
        <View
          style={{
            borderWidth: 1, borderColor: colors.border, borderRadius: 12,
            backgroundColor: colors.surface, marginTop: 4, overflow: 'hidden',
          }}
        >
          {items.map((o, i) => (
            <Pressable
              key={String(o.value)}
              onPress={() => { onChange(o.value); setOpen(false); }}
              style={{
                padding: 12,
                borderTopWidth: i ? 1 : 0,
                borderColor: colors.border,
                backgroundColor: o.value === value ? colors.bg : colors.surface,
              }}
            >
              <Text style={{ fontFamily: o.value === value ? fonts.semibold : fonts.regular, fontSize: 16, color: colors.text }}>
                {o.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
