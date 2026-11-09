// Call once per leg (pickup / destination), never on every location update.
export async function getRoute(origin, destination) {
  const key = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY;
  const url =
    `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}` +
    `&destination=${destination.lat},${destination.lng}&key=${key}`;
  const json = await (await fetch(url)).json();
  return json.routes?.[0]?.overview_polyline?.points || '';
}
