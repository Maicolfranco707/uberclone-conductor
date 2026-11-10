// AI-assisted: see docs/AI_LOG.md #2
import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#EDF0F4',      // niebla
  surface: '#FFFFFF', // papel
  text: '#1B2A41',    // tinta
  primary: '#1B2A41',
  muted: '#6B7788',   // pizarra
  border: '#D9DFE7',
  accent: '#F5A623',  // ámbar de taxi: el único acento
  success: '#1E8E6B',
  danger: '#B4382F',
};

export const fonts = {
  regular: 'Sora_400Regular',
  semibold: 'Sora_600SemiBold',
  bold: 'Sora_700Bold',
};

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 20 },
  title: { fontFamily: fonts.bold, fontSize: 26, letterSpacing: -0.5, color: colors.text, marginBottom: 14 },
  label: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text, marginTop: 16, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12,
    fontFamily: fonts.regular, fontSize: 16, color: colors.text, backgroundColor: colors.surface,
  },
  error: { fontFamily: fonts.regular, color: colors.danger, marginTop: 4, fontSize: 13 },
  btn: { backgroundColor: colors.primary, paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 14 },
  btnOff: { opacity: 0.35 },
  btnText: { fontFamily: fonts.semibold, color: '#fff', fontSize: 16 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 16, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  muted: { fontFamily: fonts.regular, color: colors.muted },
  chip: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: colors.border, marginRight: 8, backgroundColor: colors.surface },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
});
