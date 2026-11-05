// AI-assisted: see docs/AI_LOG.md #1
// The app only talks to YOUR backend. The Mercado Pago access_token lives there.
export async function createPaymentPreference(tripId) {
  const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/payments/preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tripId }),
  });
  if (!res.ok) throw new Error('No se pudo crear el cobro');
  return res.json(); // { initPoint }
}
