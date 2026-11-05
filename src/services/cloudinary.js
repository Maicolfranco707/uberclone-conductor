// Unsigned upload (preset configured in Cloudinary). No API secret in the app.
export async function uploadImage(uri) {
  const cloud = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const body = new FormData();
  body.append('file', { uri, type: 'image/jpeg', name: 'upload.jpg' });
  body.append('upload_preset', preset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body });
  const json = await res.json();
  if (!json.secure_url) throw new Error('No se pudo subir la imagen');
  return json.secure_url;
}
