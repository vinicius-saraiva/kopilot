# Fake GPS Location in Chrome for Testing

Simulate a car driving through Sao Paulo while testing the app in Chrome.

---

## Quick Start (3 commands)

**Open two terminal windows and run:**

### Terminal 1 — Open Chrome in debug mode

Quit Chrome first (Cmd+Q), then:

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-kopilot-test \
  "http://localhost:3000"
```

This opens a fresh Chrome window pointing at your app. Replace `http://localhost:3000` with your app's URL.

### Terminal 2 — Start the drive simulation

```bash
cd /Users/viniciusandrade/Documents/Projects/kopilot/tutorials
npm install ws
node drive-simulator.mjs
```

That's it. Your app now thinks you're driving down Av. Paulista at 40 km/h.

Press `Ctrl+C` to stop.

---

## Pick a Different Route or Speed

```bash
node drive-simulator.mjs --route pinheiros --speed 60
node drive-simulator.mjs --route fuel-stations --speed 30 --loop
```

**Rio de Janeiro:**

| Route | What it is | Distance |
|-------|------------|----------|
| `rio` | Copacabana → Ipanema → Leblon → Barra (scenic coast) | ~18 km |
| `rio-centro` | Praca Maua → Lapa → Flamengo → Botafogo | ~8 km |
| `rio-barra` | Barra → Recreio → Prainha → Grumari (coastal highway) | ~20 km |

**Sao Paulo:**

| Route | What it is | Distance |
|-------|------------|----------|
| `paulista` (default) | Av. Paulista to Ibirapuera Park | ~4 km |
| `pinheiros` | Loop around Pinheiros neighborhood | ~6 km |
| `fuel-stations` | Marginal Pinheiros, passes gas stations | ~8 km |
| `test` | Se Cathedral to Republica (quick test) | ~0.5 km |

| Flag | Default | What it does |
|------|---------|--------------|
| `--route` | `paulista` | Which route to drive |
| `--speed` | `40` | Speed in km/h |
| `--loop` | off | Keep driving in circles |
| `--no-roads` | off | Skip OSRM, straight lines between waypoints |

---

## Add Your Own Route

1. Open Google Maps
2. Right-click a point, click the coordinates to copy them
3. Add waypoints to the `ROUTES` object in `drive-simulator.mjs`:

```javascript
"my-commute": [
  { lat: -23.5505, lng: -46.6333, label: "Home" },
  { lat: -23.5550, lng: -46.6400 },
  { lat: -23.5612, lng: -46.6559, label: "Office" },
],
```

You only need corners/turns — the script fills in the straight parts automatically.

---

## How It Works

On startup, the script fetches real road geometry from [OSRM](https://project-osrm.org/) (free, no API key). Your waypoints get snapped to actual streets, so the simulated car follows real roads instead of cutting through buildings.

Then it connects to Chrome's debug port and tells it "the user is at these coordinates" every few hundred milliseconds, moving along the route. Any code in your app that calls `navigator.geolocation` gets the fake position. It works at the browser level, so it survives page reloads and works with any map library (Mapbox, Leaflet, Google Maps).

Use `--no-roads` to skip OSRM and use straight lines (useful offline).

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `connect ECONNREFUSED` | Chrome isn't in debug mode. Quit Chrome (Cmd+Q) and relaunch with the command from Terminal 1. |
| `Cannot find package 'ws'` | Run `npm install ws` in the tutorials folder. |
| App doesn't react to position changes | Make sure your app calls `navigator.geolocation.watchPosition()` or `getCurrentPosition()`. Reload the page after starting the simulator. |
