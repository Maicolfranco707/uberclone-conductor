// AI-assisted: see docs/AI_LOG.md #5
// Unsigned upload (preset configured in Cloudinary). No API secret in the app.

// Android returns blobs without a MIME type, so we build the data URL with an explicit image type.
function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result);
      resolve(result.replace(/^data:(application\/octet-stream)?;/, 'data:image/jpeg;'));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function uploadImage(uri) {
  const cloud = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const blob = await (await fetch(uri)).blob();
  const body = new FormData();
  body.append('file', await blobToDataUrl(blob));
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