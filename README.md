# UberClone — Versión Conductor

App móvil (React Native + Expo) para el conductor: registro con validaciones, disponibilidad con ubicación en tiempo real, solicitudes con temporizador de 15 s, viaje en curso, cobro con Mercado Pago (modo prueba) o efectivo, ganancias e historial.

## Instalación

```bash
# 1) Crear el proyecto Expo y copiar aquí el contenido de este paquete (src/, App.js, backend/, docs/)
npx create-expo-app@latest UberDriver --template blank
cd UberDriver

# 2) Dependencias (npx expo install elige versiones compatibles con tu SDK)
npx expo install firebase @react-native-async-storage/async-storage expo-location expo-image-picker \
  react-native-maps react-native-gesture-handler react-native-reanimated react-native-screens \
  react-native-safe-area-context react-native-pager-view @react-native-picker/picker \
  @react-native-community/datetimepicker
npm i @react-navigation/native @react-navigation/native-stack @react-navigation/drawer \
  @react-navigation/material-top-tabs react-native-tab-view
npm i -D jest-expo jest @types/jest   # y en package.json: "jest": { "preset": "jest-expo" }, "scripts": { "test": "jest" }

# 3) Variables de entorno
cp .env.example .env        # completar valores de Firebase, Google Maps y Cloudinary
npx expo start
```

Agrega la key de Google Maps en `app.json` (`ios.config.googleMapsApiKey` y `android.config.googleMaps.apiKey`) y restríngela por aplicación.

## Backend de pagos (Mercado Pago, modo prueba)

```bash
cd backend && npm install
cp .env.example .env        # MP_ACCESS_TOKEN (credencial de PRUEBA), PUBLIC_URL (ngrok), serviceAccount.json de Firebase
npm start
```

El `access_token` solo vive en `backend/.env` (excluido de Git). Expón el backend con `ngrok http 3000` para que Mercado Pago alcance el webhook.

## Pruebas
`npm test` verifica `calculateFare` con el ejemplo del enunciado (8,5 km / 22 min → Económico 19.200 y XL 26.900).

## Simular la aprobación del conductor
En Firestore, `drivers/{uid}.approvalStatus`: cambiar `pending` → `approved`.

## Datos y reglas
- Colecciones: `drivers`, `trips` (modelo en la sección 6 del enunciado).
- Firestore pedirá crear índices compuestos al consultar el historial y las ganancias (el error trae el enlace).
- Para probar una solicitud, crea un doc en `trips` con `status: "requested"`, `offeredTo: "<uid del conductor>"`, `origin`, `destination`, `distanceKm`, `durationMin`, `category`, `paymentMethod`, `tip`, `passengerId`.
- Configura reglas de seguridad antes de entregar (cada conductor solo lee/escribe sus documentos).

## Uso de IA
Ver [docs/AI_LOG.md](docs/AI_LOG.md).
