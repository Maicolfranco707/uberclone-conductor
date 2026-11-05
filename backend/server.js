// AI-assisted: see docs/AI_LOG.md #1
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();
const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN }); // TEST credentials only

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.json({ ok: true }));

// 1) Create the Checkout Pro preference. The amount is read from Firestore, never trusted from the client.
app.post('/payments/preference', async (req, res) => {
  try {
    const { tripId } = req.body;
    const ref = db.collection('trips').doc(tripId);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Trip not found' });
    const trip = snap.data();
    if (trip.status !== 'completed') return res.status(409).json({ error: 'Trip is not ready to be paid' });

    const amount = trip.fare + (trip.tip || 0);
    const pref = await new Preference(mp).create({
      body: {
        items: [{ id: tripId, title: 'Viaje UberClone', quantity: 1, unit_price: amount, currency_id: 'COP' }],
        external_reference: tripId,
        notification_url: `${process.env.PUBLIC_URL}/payments/webhook`,
        back_urls: { success: `${process.env.PUBLIC_URL}/return`, failure: `${process.env.PUBLIC_URL}/return`, pending: `${process.env.PUBLIC_URL}/return` },
      },
    });
    await ref.update({ paymentMethod: 'mercadopago', paymentStatus: 'pending', paymentId: pref.id });
    res.json({ initPoint: pref.init_point });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not create preference' });
  }
});

// 2) Mercado Pago webhook: re-fetch the payment from MP (don't trust the body) and update the trip.
app.post('/payments/webhook', async (req, res) => {
  res.sendStatus(200); // ack fast
  try {
    const paymentId = req.body?.data?.id || req.query['data.id'];
    if (!paymentId || (req.body?.type || req.query.type) !== 'payment') return;
    const payment = await new Payment(mp).get({ id: paymentId });
    const tripId = payment.external_reference;
    const ref = db.collection('trips').doc(tripId);
    const trip = (await ref.get()).data();
    if (!trip) return;

    const status = payment.status; // approved | pending | rejected | ...
    const update = { paymentStatus: status, paymentId: String(paymentId) };
    if (status === 'approved' && trip.status !== 'paid') {
      update.status = 'paid';
      // Gateway-paid trips credit the driver's balance with their net earnings.
      await db.collection('drivers').doc(trip.driverId).update({ balance: admin.firestore.FieldValue.increment(trip.driverEarnings) });
    }
    await ref.update(update);
  } catch (e) {
    console.error('webhook error', e);
  }
});

app.get('/return', (_, res) => res.send('Pago procesado. Puedes volver a la app.'));

app.listen(process.env.PORT || 3000, () => console.log('Backend listening'));
