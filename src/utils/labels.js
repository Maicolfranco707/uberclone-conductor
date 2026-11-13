// Human-readable labels for the values stored in Firestore.
export const CATEGORY_LABEL = { economy: 'Económico', xl: 'XL', premium: 'Premium' };
export const PAYMENT_METHOD_LABEL = { mercadopago: 'Mercado Pago', stripe: 'Stripe', cash: 'Efectivo' };
export const PAYMENT_STATUS_LABEL = {
  approved: 'Aprobado',
  pending: 'Pendiente',
  rejected: 'Rechazado',
  cash: 'Recibido',
  cash_pending: 'Pendiente',
};

export const categoryLabel = (c) => CATEGORY_LABEL[c] || c;
export const paymentMethodLabel = (m) => PAYMENT_METHOD_LABEL[m] || m;
export const paymentStatusLabel = (st) => PAYMENT_STATUS_LABEL[st] || st || 'Pendiente';