# Fake GPS Location in Chrome for Testing

Simulate a car driving real routes while testing Kopilot's ride tracking in Chrome.

---

## Quick Start

**Open two terminal windows and run:**

### Terminal 1 — Open Chrome in debug mode

Quit Chrome first (Cmd+Q), then run as a single line:

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-kopilot-test "https://app.kopilot.autos/rides"
```

This opens a fresh Chrome window with Kopilot's Rides page. Log in if needed.

### Terminal 2 — Start the drive simulation

```bash
cd /Users/viniciusandrade/Documents/Projects/kopilot/testing/drive-simulator
npm install ws
node drive-simulator.mjs --route serra --timescale 30
```

### Steps

1. In the debug Chrome window, tap **Start Ride**
2. Switch to Terminal 2 and run the simulator
3. Watch the car drive from Rio up through Serra do Mar to Teresopolis (~6 min)
4. When it finishes, tap **End Ride** in Kopilot

Press `Ctrl+C` to stop the simulation early.

---

## Pick a Different Route or Speed

```bash
node drive-simulator.mjs --route serra --timescale 20
node drive-simulator.mjs --route pinheiros --speed 60
node drive-simulator.mjs --route fuel-stations --speed 30 --loop
```

**Mountain routes:**

| Route | What it is | Distance |
|-------|------------|----------|
| `serra` | Rio → Petropolis → Teresopolis (mountain highway) | ~150 km |

The `serra` route has per-waypoint speeds that vary realistically: 90 km/h on the highway, 35–50 km/h on the Serra do Mar climb, 30 km/h in city centers. Use `--timescale 20` to finish in ~5 minutes while keeping the speed data intact.

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
| `--speed` | `40` | Speed in km/h (ignored if route has per-waypoint speeds) |
| `--timescale` | `1` | Run N times faster; speed DATA stays realistic |
| `--loop` | off | Keep driving in circles |
| `--no-roads` | off | Skip OSRM, straight lines between waypoints |

### Timescale

`--timescale` accelerates the simulation without changing the speed values reported to Kopilot. Each GPS position still reports the realistic speed (e.g. 50 km/h on mountain curves), but the interval between updates is shortened.

This means Kopilot's recorded speed per point is accurate, but the ride's total duration will be compressed (a 2-hour drive finishes in a few minutes). Good for testing that the feature works end-to-end.

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
| `Cannot find package 'ws'` | Run `npm install ws` in the drive-simulator folder. |
| "Localização indisponível" in Kopilot | You must start the ride **in the debug Chrome window**, not your regular Chrome. |
| App doesn't react to position changes | Reload the page in the debug Chrome after starting the simulator. |
| Chrome command splits into multiple errors | Run the Chrome launch command as a **single line**, not with `\` line breaks. |
