// AI-assisted: see docs/AI_LOG.md #1
import { PRICING } from '../config/pricing';
import { validators as v } from '../utils/validators';

const COLORS = ['Blanco', 'Negro', 'Gris', 'Plateado', 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Otro'];

export const personalFields = [
  { key: 'photo', label: 'Foto de perfil', type: 'image', validate: v.photo },
  { key: 'fullName', label: 'Nombre completo', autoCapitalize: 'words', validate: v.fullName },
  { key: 'idNumber', label: 'Documento de identidad', type: 'number', validate: v.idNumber },
  { key: 'phone', label: 'Número de celular', type: 'number', validate: v.phone },
  { key: 'birthDate', label: 'Fecha de nacimiento', type: 'date', validate: v.birthDate },
  { key: 'gender', label: 'Género', type: 'select', options: ['Femenino', 'Masculino', 'Otro', 'Prefiero no decir'], validate: v.required },
  { key: 'email', label: 'Correo electrónico', keyboard: 'email-address', validate: v.email },
  { key: 'language', label: 'Idioma', type: 'select', options: [{ value: 'es', label: 'Español' }, { value: 'en', label: 'English' }], validate: v.required },
];

export const vehicleFields = [
  { key: 'category', label: 'Categoría', type: 'select', options: [{ value: 'economy', label: 'Económico' }, { value: 'xl', label: 'XL' }, { value: 'premium', label: 'Premium' }], validate: v.required },
  { key: 'plate', label: 'Placa (ABC123)', upper: true, autoCapitalize: 'characters', validate: v.plate },
  { key: 'brand', label: 'Marca', autoCapitalize: 'words', validate: v.max30 },
  { key: 'model', label: 'Modelo', autoCapitalize: 'words', validate: v.max30 },
  { key: 'year', label: 'Año', type: 'number', validate: v.year },
  { key: 'color', label: 'Color', type: 'select', options: COLORS, validate: v.required },
  { key: 'capacity', label: 'Capacidad de pasajeros', type: 'number', hint: `XL exige mínimo ${PRICING.xlMinCapacity}`, validate: v.capacity },
  { key: 'vehiclePhoto', label: 'Foto del vehículo (placa visible)', type: 'image', validate: v.photo },
];

export const documentFields = [
  { key: 'licenseNumber', label: 'Número de licencia de conducción', type: 'number', validate: v.required },
  { key: 'licensePhoto', label: 'Foto de la licencia', type: 'image', validate: v.photo },
  { key: 'licenseExpiry', label: 'Vencimiento de la licencia', type: 'date', validate: v.futureDate },
  { key: 'soatPhoto', label: 'Foto del SOAT', type: 'image', validate: v.photo },
  { key: 'soatExpiry', label: 'Vencimiento del SOAT', type: 'date', validate: v.futureDate },
  { key: 'techPhoto', label: 'Foto de revisión técnico-mecánica', type: 'image', hint: 'Obligatoria si el vehículo tiene 5 años o más', validate: v.techPhoto },
  { key: 'techExpiry', label: 'Vencimiento de la revisión', type: 'date', validate: v.techDate },
  { key: 'mpEmail', label: 'Correo de tu cuenta de Mercado Pago', keyboard: 'email-address', validate: v.email },
  { key: 'acceptTerms', label: 'Términos', type: 'checkbox', text: `Acepto los términos y condiciones. La plataforma cobra una comisión del ${PRICING.commissionRate * 100}% sobre cada tarifa.`, validate: v.terms },
];

export const allFields = [...personalFields, ...vehicleFields, ...documentFields];
