import { StyleSheet } from 'react-native';
export const colors = { bg: '#fff', text: '#111', muted: '#6b7280', primary: '#111', accent: '#06c167', danger: '#d92d20', border: '#e5e7eb' };
export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 12 },
  label: { fontWeight: '600', marginTop: 12, marginBottom: 4, color: colors.text },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10, fontSize: 16 },
  error: { color: colors.danger, marginTop: 4, fontSize: 13 },
  btn: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  btnOff: { opacity: 0.4 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  muted: { color: colors.muted },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginRight: 6 },
  chipOn: { backgroundColor: colors.primary },
});
