// AI-assisted: see docs/AI_LOG.md #1
// Unsigned upload (preset configured in Cloudinary). No API secret in the app.
export async function uploadImage(uri) {
  const cloud = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // SDK 58 does not accept { uri, type, name } parts in FormData: send a Blob instead.
  const blob = await (await fetch(uri)).blob();
  const body = new FormData();
  body.append('file', blob, 'upload.jpg');
  body.append('upload_preset', preset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: 'POST',
    body,
  });
  const json = await res.json();
  if (!json.secure_url) {
    throw new Error(json.error?.message || 'No se pudo subir la imagen');
  }
  return json.secure_url;
}
