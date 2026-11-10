// AI-assisted: see docs/AI_LOG.md #2
// Free routing with OSRM (no API key). One call per leg, never on every location update.
export async function getRoute(origin, destination) {
  const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=polyline`;
  const json = await (await fetch(url)).json();
  return json.routes?.[0]?.geometry || '';
}
