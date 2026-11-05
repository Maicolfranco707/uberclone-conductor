# Bitácora de uso de IA

### Entrada #1
- Fecha: 2026-11-05
- Integrante: Maicol Franco
- Herramienta: Claude
- Objetivo: Generar el esqueleto del proyecto UberClone Conductor y guiar la instalación paso a paso
- Prompt: "necesito hacer esto" (con el PDF del enunciado adjunto)
- Resumen de la respuesta: Claude generó la estructura del proyecto (pantallas, hooks, servicios, validadores, calculateFare y backend de pagos) y una guía de instalación por pasos.
- Qué se usó / modificó / descartó: Se usó el código tal cual; se actualizó el proyecto a Expo SDK 58 y se conectó Firebase.
- Archivos y commit: src/, backend/, docs/ — a023b75
- Verificación: calculateFare probado con el ejemplo de 8,5 km y 22 min; la app abre en Expo Go y el login con Firebase funciona.
- Aprendizaje:Aprendí a montar un proyecto de Expo desde cero y que la versión del SDK tiene que coincidir con la de Expo Go en el celular (tuve que subir de SDK 57 a 58). Aprendí que las claves de Firebase van en un archivo .env que no se sube a GitHub, y que solo el .env.example queda en el repositorio. También entendí que la app guarda la sesión del conductor con Firebase Authentication y los datos en Firestore. Aprendí a resolver errores de instalación de dependencias y a hacer commits pequeños con mensajes claros
