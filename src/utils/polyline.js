// Decodes a Google encoded polyline into [{latitude, longitude}]
export function decodePolyline(str = '') {
  let i = 0, lat = 0, lng = 0;
  const out = [];
  while (i < str.length) {
    for (const axis of ['lat', 'lng']) {
      let shift = 0, result = 0, b;
      do {
        b = str.charCodeAt(i++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const delta = result & 1 ? ~(result >> 1) : result >> 1;
      if (axis === 'lat') lat += delta; else lng += delta;
    }
    out.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return out;
}
