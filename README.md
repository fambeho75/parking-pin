# Parking Pin

Single-page tool: tap **I’m parked** to save GPS plus an optional level/zone note, then tap **Find car** to open Maps. No accounts — data stays in this browser’s `localStorage`.

**Live site:** https://fambeho75.github.io/parking-pin/

## iPhone, HTTPS, and GPS

Safari only shares location in a **secure context** (`https://` or `localhost`). Open the Pages URL above on the iPhone — it is already HTTPS — then allow location when you tap **I’m parked**.

Share → **Add to Home Screen** to keep a full-screen icon on that same HTTPS origin. A plain `http://` address (for example a LAN IP) often loads the page but blocks GPS. If location is denied, the app still saves the note and timestamp.

## Files

- `index.html` — full UI and logic
- `manifest.webmanifest` — Add to Home Screen
- `sw.js` — optional offline cache after the first load
- `icon.svg` — home-screen icon and favicon

## Local development

From this folder:

```bash
python3 -m http.server 8777
```

Open http://127.0.0.1:8777/ (GPS works on localhost). Do not open the file with `file://` — geolocation and the service worker will fail.

## How to use

1. Open the page in the garage.
2. Optionally type a level or zone, or tap a quick note (P1–P3, Yellow, Blue, Red, Green, Elevators, Near exit). Chips append with ` · ` and skip text already in the note.
3. Tap **I’m parked** and allow location if asked.
4. Later, open the same bookmark or home-screen icon and tap **Find car** (Apple Maps on iPhone, Google Maps elsewhere; a Google Maps link is also shown on iOS).
5. **Update pin** saves again. **Clear pin** asks for confirmation.

## Storage

Key: `parking-pin-v1`  
Shape: `{ lat, lng, accuracy, note, savedAt }`
