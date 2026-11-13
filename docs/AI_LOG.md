# Bitácora de uso de IA

### Entrada #1
- Fecha: 2026-11-05
- Integrante: Maicol Franco
- Herramienta: Claude
- Objetivo: Generar el esqueleto del proyecto UberClone Conductor y guiar la instalación paso a paso
- Prompt: "necesito hacer esto" (con el PDF del enunciado adjunto)
- Resumen de la respuesta: Claude generó la estructura del proyecto (pantallas, hooks, servicios, validadores, calculateFare y backend de pagos) y una guía de instalación por pasos.
- Qué se usó / modificó / descartó: Se usó el código tal cual; se actualizó el proyecto a Expo SDK 58 y se conectó Firebase.
- Archivos y commit: src/, backend/, docs/ — commits 63ce526 a 00037f8 (el commit original a023b75 se partió después en commits temáticos; ver entrada #6)
- Verificación: calculateFare probado con el ejemplo de 8,5 km y 22 min; la app abre en Expo Go y el login con Firebase funciona.
- Aprendizaje: Aprendí a montar un proyecto de Expo desde cero y que la versión del SDK tiene que coincidir con la de Expo Go en el celular (tuve que subir de SDK 57 a 58). Aprendí que las claves de Firebase van en un archivo .env que no se sube a GitHub, y que solo el .env.example queda en el repositorio. También entendí que la app guarda la sesión del conductor con Firebase Authentication y los datos en Firestore. Aprendí a resolver errores de instalación de dependencias y a hacer commits pequeños con mensajes claros.

### Entrada #2
- Fecha: VERIFICAR (rango de fechas de los commits de estilo, ver git log)
- Integrante: Maicol Franco
- Herramienta: Claude
- Objetivo: Diseñar la identidad visual (tema, fuente Sora, pantalla de acceso, inicio con la lámpara de disponibilidad, resumen del viaje) y corregir detalles de interfaz (lista desplegable, textos en español, historial sin duplicados).
- Prompt: "quiero estilos unicos y diferentes, algo tipo profesional y creativo, q se vea elegante"
- Resumen de la respuesta: Claude propuso una paleta (tinta, niebla y ámbar) con la fuente Sora, y entregó el código de theme.js, AuthScreen, HomeScreen, PaymentSummaryScreen, SelectField, las etiquetas en español y la corrección del historial.
- Qué se usó / modificó / descartó: Se usó el código entregado, pegado a mano en cada archivo. Se descartó el botón "Crear viaje de prueba" dentro de la app, que se dejó para más adelante.
- Archivos y commits: src/theme.js (6abda55), src/screens/AuthScreen.js (0ae9b84), src/screens/HomeScreen.js (cf4987c), src/screens/PaymentSummaryScreen.js (48e6846), src/screens/HistoryScreen.js (60fde5a), y los commits de SelectField y de labels.js (ver git log).
- Verificación: Probado en iPhone con Expo Go: el resumen, el historial sin duplicados y las listas desplegables se ven y funcionan bien.
- Aprendizaje: Aprendí que los estilos compartidos de la app viven en un solo archivo (theme.js) y que cambiarlo cambia todas las pantallas a la vez. Entendí cómo se carga una fuente con expo-font antes de mostrar la app, y que una lista desplegable propia (SelectField) reemplaza a la rueda del Picker, que era incómoda. También aprendí a probar cada cambio en el celular antes de guardarlo en un commit.

### Entrada #3
- Fecha: 2026-11-13
- Integrante: Maicol Franco
- Herramienta: Claude (en otra conversación, los cuatro archivos de la rama de ajustes) y Claude (en esta conversación, el diagnóstico de las ramas)
- Objetivo: Mostrar el estado del pago en el historial, marcar los viajes rechazados, quitar la dependencia del Picker y ordenar las ramas y el package-lock.
- Resumen de la respuesta: Se entregaron versiones corregidas de labels.js, HistoryScreen.js, Field.js y trips.js. En esta conversación, Claude explicó por qué la rama quedó desordenada y cómo rehacerla desde main.
- Qué se usó / modificó / descartó: Se usaron los cambios de labels.js, HistoryScreen.js y trips.js. Se descartaron el cambio de Field.js (cambió unas 200 líneas y desordenó el código) y los plugins de Firebase nativo en app.json (Expo Go no los soporta). La rama se rehízo desde main.
- Archivos y commits: b38c40b, 13b6da6, 2089b7c, 22c918b, 46175ed, 6a1bd4c (Pull Requests #1 y #3).
- Verificación: La app abre en Expo Go sin errores, las listas funcionan y el historial muestra el estado del pago.
- Aprendizaje: Aprendí que un commit tiene que contener solo lo que dice su mensaje: un cambio de una línea no debería tocar 200 líneas de un archivo. Aprendí que el package-lock se desincroniza si no se guarda al instalar paquetes, y que conviene trabajar en ramas y unirlas con Pull Requests, descartando lo que rompe la app.

### Entrada #4
- Fecha: 2026-11-13
- Integrante: Maicol Franco
- Herramienta: Claude y Copilot
- Objetivo: Avisar al conductor con una notificación cuando llega una solicitud con la app en segundo plano.
- Prompt: "bueno, hagamos las notificaciones" (a Claude). A Copilot: VERIFICAR, pega el mensaje que de verdad le enviaste, tal como lo escribiste.
- Resumen de la respuesta: Claude implementó notificaciones locales con expo-notifications. Claude y Copilot coincidieron en que las notificaciones push remotas no funcionan en Expo Go y requieren un development build y, en iPhone, una cuenta de Apple Developer de pago.
- Qué se usó / modificó / descartó: Se usó la notificación local. Se descartó implementar FCM real por el tiempo y los requisitos del build. Copilot no propuso cambios de código en esta consulta.
- Archivos y commits: src/services/notifications.js (91c4718), src/screens/HomeScreen.js (5263dd8), package.json (f1bc1ca).
- Verificación: Probado en iPhone y Android con Expo Go: la solicitud llega a la app y la notificación aparece al volver del segundo plano, no con la app suspendida.
- Aprendizaje: Aprendí la diferencia entre una notificación local y una push remota, y que Expo Go no recibe push remotas desde el SDK 53: para eso hace falta un development build y, en iPhone, una cuenta de Apple Developer de pago. Entendí que la notificación local solo funciona mientras la app sigue activa.

### Entrada #5
- Fecha: 2026-11-13
- Integrante: Maicol Franco
- Herramienta: Claude y Copilot
- Objetivo: Arreglar el error "Invalid image file" al subir fotos a Cloudinary desde Android.
- Prompt: A Claude: el mensaje que pegaste con la captura del error ("Invalid image file"). A Copilot: VERIFICAR, pega el mensaje que de verdad le enviaste, tal como lo escribiste.
- Resumen de la respuesta: Claude propuso enviar la foto a Cloudinary como data URL y agregó un mensaje temporal de diagnóstico. Copilot cambió pickImage para pedir la foto en base64 con expo-image-picker y devolverla como data URL, y agregó un aviso de error.
- Qué se usó / modificó / descartó: Se usó el cambio de Copilot en Field.js y cloudinary.js. Se descartó el mensaje de diagnóstico.
- Archivos y commits: src/components/Field.js y src/services/cloudinary.js (VERIFICAR el hash cuando se guarde el commit).
- Verificación: Registro de una cuenta nueva en Android con las cinco fotos subidas a Cloudinary; falta comprobar el cambio de foto desde el perfil en iPhone.
- Aprendizaje: Aprendí que Android y iPhone manejan distinto los archivos de imagen y que un error de subida puede venir de cómo se lee la foto. Aprendí a usar la opción base64 de expo-image-picker y que hay que probar en las dos plataformas antes de unir un cambio.

### Entrada #6
- Fecha: 2026-11-13
- Integrante: Maicol Franco
- Herramienta: Claude y Gemini
- Objetivo: Partir el commit inicial de la app en commits temáticos y reemplazar el historial en GitHub.
- Resumen de la respuesta: Claude propuso agrupar los archivos en commits por tema y dio los comandos para armarlos; no accedió a quitar las marcas de código asistido por IA. COMPLETAR qué comandos te dio Gemini (la unión de los commits posteriores y la subida del historial reescrito).
- Qué se usó / modificó / descartó: Se usó el plan de commits y los comandos de cherry-pick y push forzado. Las marcas "AI-assisted" se mantuvieron en el código. COMPLETAR lo que descartaste de Gemini, si hubo algo.
- Archivos y commits: 63ce526 a 00037f8 (commits temáticos que reemplazan a a023b75).
- Verificación: El código de main quedó idéntico al de la rama de respaldo (git diff vacío).
- Aprendizaje: Aprendí a partir un commit grande en commits temáticos con una rama nueva, a traer archivos de un commit con git checkout y a verificar con git diff que el resultado es idéntico. También aprendí que reescribir el historial exige un push forzado y que por eso conviene dejar una rama de respaldo.