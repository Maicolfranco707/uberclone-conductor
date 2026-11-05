// AI-assisted: see docs/AI_LOG.md #1
import { PRICING } from '../config/pricing';

const empty = (v) => v === undefined || v === null || String(v).trim() === '';
const req = (msg = 'Campo obligatorio') => (v) => (empty(v) ? msg : '');
const parseDate = (s) => {
  const [y, m, d] = String(s).split('-').map(Number);
  return new Date(y, m - 1, d);
};
const today = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
const needsTech = (form) => new Date().getFullYear() - Number(form.year) >= 5;

export const validators = {
  required: req(),
  photo: req('Debes adjuntar una imagen'),
  fullName: (v) => {
    if (empty(v)) return 'Campo obligatorio';
    if (v.length > 50) return 'Máximo 50 caracteres';
    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/.test(v)) return 'Solo letras y espacios';
    return '';
  },
  idNumber: (v) => (empty(v) ? 'Campo obligatorio' : /^\d{6,10}$/.test(v) ? '' : 'Entre 6 y 10 dígitos'),
  phone: (v) => (empty(v) ? 'Campo obligatorio' : /^\d{10}$/.test(v) ? '' : 'Deben ser 10 dígitos'),
  email: (v) =>
    empty(v) ? 'Campo obligatorio' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Correo no válido',
  birthDate: (v) => {
    if (empty(v)) return 'Selecciona una fecha';
    const b = parseDate(v);
    const t = today();
    let age = t.getFullYear() - b.getFullYear();
    if (t < new Date(t.getFullYear(), b.getMonth(), b.getDate())) age -= 1;
    return age >= 18 ? '' : 'Debes ser mayor de 18 años';
  },
  plate: (v) => {
    if (empty(v)) return 'Campo obligatorio';
    return /^[A-Z]{3}\d{3}$/.test(String(v).toUpperCase()) ? '' : 'Formato ABC123';
  },
  max30: (v) => (empty(v) ? 'Campo obligatorio' : v.length > 30 ? 'Máximo 30 caracteres' : ''),
  year: (v) => {
    if (empty(v)) return 'Campo obligatorio';
    if (!/^\d{4}$/.test(v)) return 'Deben ser 4 dígitos';
    return Number(v) > new Date().getFullYear() ? 'No puede ser mayor al año actual' : '';
  },
  capacity: (v, form) => {
    if (empty(v)) return 'Campo obligatorio';
    if (!/^\d+$/.test(v) || Number(v) < 1 || Number(v) > 10) return 'Número entre 1 y 10';
    if (form.category === 'xl' && Number(v) < PRICING.xlMinCapacity)
      return `XL exige mínimo ${PRICING.xlMinCapacity}`;
    return '';
  },
  futureDate: (v) => {
    if (empty(v)) return 'Selecciona una fecha';
    return parseDate(v) > today() ? '' : 'Debe ser posterior a hoy';
  },
  // Tech inspection only required when the vehicle is 5+ years old (Colombia)
  techPhoto: (v, form) => (needsTech(form) ? validators.photo(v) : ''),
  techDate: (v, form) => (needsTech(form) ? validators.futureDate(v) : ''),
  terms: (v) => (v === true ? '' : 'Debes aceptar los términos'),
};
