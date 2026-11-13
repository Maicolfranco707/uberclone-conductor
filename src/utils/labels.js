// Human-readable labels for the values stored in Firestore.
export const CATEGORY_LABEL = { economy: 'Económico', xl: 'XL', premium: 'Premium' };
export const PAYMENT_METHOD_LABEL = { mercadopago: 'Mercado Pago', stripe: 'Stripe', cash: 'Efectivo' };

export const categoryLabel = (c) => CATEGORY_LABEL[c] || c;
export const paymentMethodLabel = (m) => PAYMENT_METHOD_LABEL[m] || m;