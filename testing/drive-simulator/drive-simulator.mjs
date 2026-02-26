// drive-simulator.mjs
// Simulates driving a route by overriding Chrome's geolocation via CDP.
// Uses OSRM (free) to snap waypoints to real streets before simulating.
//
// Usage:
//   node drive-simulator.mjs [--speed <km/h>] [--route <route-name>]
//
// Examples:
//   node drive-simulator.mjs
//   node drive-simulator.mjs --speed 60 --route pinheiros
//   node drive-simulator.mjs --route fuel-stations --loop
//   node drive-simulator.mjs --no-roads          (skip OSRM, straight lines)
//
// Prerequisites:
//   npm install ws
//   Chrome running with: --remote-debugging-port=9222

import WebSocket from "ws";

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

const ROUTES = {
  // === RIO DE JANEIRO ===

  // Scenic ride: Zona Sul coastline (~18 km)
  // Copacabana → Ipanema → Leblon → Sao Conrado → Barra da Tijuca
  rio: [
    { lat: -22.9711, lng: -43.1822, label: "Copacabana (Posto 6)" },
    { lat: -22.9717, lng: -43.1860 },
    { lat: -22.9726, lng: -43.1878 },
    { lat: -22.9747, lng: -43.1895 },
    { lat: -22.9779, lng: -43.1905 },
    { lat: -22.9835, lng: -43.1920, label: "Arpoador" },
    { lat: -22.9847, lng: -43.1952 },
    { lat: -22.9860, lng: -43.1990 },
    { lat: -22.9868, lng: -43.2040, label: "Ipanema (Posto 9)" },
    { lat: -22.9870, lng: -43.2100 },
    { lat: -22.9870, lng: -43.2170 },
    { lat: -22.9868, lng: -43.2230, label: "Leblon" },
    { lat: -22.9880, lng: -43.2280 },
    { lat: -22.9950, lng: -43.2340 },
    { lat: -22.9990, lng: -43.2480, label: "Vidigal" },
    { lat: -23.0030, lng: -43.2560 },
    { lat: -23.0060, lng: -43.2630 },
    { lat: -23.0100, lng: -43.2680, label: "Sao Conrado" },
    { lat: -23.0130, lng: -43.2730 },
    { lat: -23.0100, lng: -43.2850 },
    { lat: -23.0050, lng: -43.2950 },
    { lat: -23.0020, lng: -43.3050 },
    { lat: -23.0000, lng: -43.3150, label: "Barra da Tijuca (start)" },
    { lat: -22.9990, lng: -43.3300 },
    { lat: -22.9985, lng: -43.3500, label: "Praia da Barra" },
  ],

  // Centro Historico → Lapa → Gloria → Flamengo → Botafogo (~8 km)
  "rio-centro": [
    { lat: -22.9068, lng: -43.1729, label: "Praca Maua" },
    { lat: -22.9080, lng: -43.1760 },
    { lat: -22.9095, lng: -43.1790, label: "Boulevard Olimpico" },
    { lat: -22.9110, lng: -43.1770 },
    { lat: -22.9130, lng: -43.1780 },
    { lat: -22.9150, lng: -43.1790, label: "Cinelandia" },
    { lat: -22.9170, lng: -43.1800 },
    { lat: -22.9130, lng: -43.1830, label: "Arcos da Lapa" },
    { lat: -22.9180, lng: -43.1770 },
    { lat: -22.9220, lng: -43.1750 },
    { lat: -22.9260, lng: -43.1730, label: "Gloria" },
    { lat: -22.9310, lng: -43.1720 },
    { lat: -22.9350, lng: -43.1710 },
    { lat: -22.9400, lng: -43.1700, label: "Catete" },
    { lat: -22.9440, lng: -43.1720 },
    { lat: -22.9480, lng: -43.1730 },
    { lat: -22.9330, lng: -43.1760, label: "Aterro do Flamengo" },
    { lat: -22.9420, lng: -43.1740 },
    { lat: -22.9510, lng: -43.1740 },
    { lat: -22.9530, lng: -43.1760, label: "Praia de Botafogo" },
    { lat: -22.9550, lng: -43.1790 },
    { lat: -22.9570, lng: -43.1820, label: "Botafogo" },
  ],

  // Barra da Tijuca → Recreio → Grumari (~20 km, coastal highway)
  "rio-barra": [
    { lat: -23.0000, lng: -43.3650, label: "Barra Shopping" },
    { lat: -22.9990, lng: -43.3750 },
    { lat: -22.9985, lng: -43.3850 },
    { lat: -22.9980, lng: -43.3950 },
    { lat: -22.9975, lng: -43.4050 },
    { lat: -22.9970, lng: -43.4150, label: "Recreio dos Bandeirantes" },
    { lat: -22.9965, lng: -43.4250 },
    { lat: -22.9960, lng: -43.4350 },
    { lat: -22.9970, lng: -43.4450 },
    { lat: -22.9980, lng: -43.4550, label: "Praia do Macumba" },
    { lat: -23.0010, lng: -43.4620 },
    { lat: -23.0050, lng: -43.4680 },
    { lat: -23.0080, lng: -43.4720, label: "Prainha" },
    { lat: -23.0110, lng: -43.4760 },
    { lat: -23.0130, lng: -43.4810 },
    { lat: -23.0490, lng: -43.5240, label: "Grumari" },
  ],

  // === SAO PAULO ===

  // Av. Paulista to Ibirapuera Park (~4 km)
  paulista: [
    { lat: -23.5612, lng: -46.6559, label: "Av. Paulista (Trianon)" },
    { lat: -23.5635, lng: -46.6545 },
    { lat: -23.5660, lng: -46.6530 },
    { lat: -23.5690, lng: -46.6528 },
    { lat: -23.5720, lng: -46.6535 },
    { lat: -23.5755, lng: -46.6540 },
    { lat: -23.5790, lng: -46.6548 },
    { lat: -23.5825, lng: -46.6555 },
    { lat: -23.5850, lng: -46.6565 },
    { lat: -23.5874, lng: -46.6576, label: "Ibirapuera Park" },
  ],

  // Pinheiros loop (~6 km)
  pinheiros: [
    { lat: -23.5670, lng: -46.6917, label: "Largo de Pinheiros" },
    { lat: -23.5650, lng: -46.6950 },
    { lat: -23.5620, lng: -46.6985 },
    { lat: -23.5590, lng: -46.7020 },
    { lat: -23.5565, lng: -46.7050, label: "R. dos Pinheiros" },
    { lat: -23.5540, lng: -46.7010 },
    { lat: -23.5520, lng: -46.6960 },
    { lat: -23.5545, lng: -46.6920 },
    { lat: -23.5580, lng: -46.6900 },
    { lat: -23.5620, lng: -46.6895 },
    { lat: -23.5655, lng: -46.6905 },
    { lat: -23.5670, lng: -46.6917, label: "Largo de Pinheiros (loop)" },
  ],

  // Marginal Pinheiros, passes gas stations (~8 km)
  "fuel-stations": [
    { lat: -23.5735, lng: -46.7020, label: "Marginal Pinheiros (start)" },
    { lat: -23.5700, lng: -46.7050 },
    { lat: -23.5660, lng: -46.7085 },
    { lat: -23.5615, lng: -46.7100 },
    { lat: -23.5570, lng: -46.7095, label: "Near BR Posto" },
    { lat: -23.5520, lng: -46.7080 },
    { lat: -23.5475, lng: -46.7060 },
    { lat: -23.5430, lng: -46.7035, label: "Near Shell Pinheiros" },
    { lat: -23.5385, lng: -46.7010 },
    { lat: -23.5340, lng: -46.6985 },
    { lat: -23.5300, lng: -46.6960 },
    { lat: -23.5260, lng: -46.6930, label: "Near Ipiranga Marginal" },
    { lat: -23.5220, lng: -46.6900 },
    { lat: -23.5185, lng: -46.6870, label: "Marginal Pinheiros (end)" },
  ],

  // === QUICK TEST ===

  test: [
    { lat: -23.5505, lng: -46.6333, label: "Se Cathedral" },
    { lat: -23.5480, lng: -46.6360 },
    { lat: -23.5455, lng: -46.6390, label: "Republica" },
  ],
};

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

function getArg(name, fallback) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
🚗 Kopilot Drive Simulator

Simulates a car driving a route by overriding Chrome's geolocation via CDP.
Uses OSRM to snap waypoints to real streets (free, no API key needed).

Usage:
  node drive-simulator.mjs [options]

Options:
  --route <name>    Route to simulate (default: paulista)
  --speed <km/h>    Driving speed (default: 40)
  --loop            Restart route when it ends
  --no-roads        Skip OSRM, use straight lines between waypoints
  --host <host>     Chrome CDP host (default: localhost)
  --port <port>     Chrome CDP port (default: 9222)
  --help            Show this help

Routes (Rio de Janeiro):
  rio               Copacabana → Ipanema → Leblon → Barra (~18 km)
  rio-centro        Praca Maua → Lapa → Flamengo → Botafogo (~8 km)
  rio-barra         Barra → Recreio → Prainha → Grumari (~20 km)

Routes (Sao Paulo):
  paulista          Av. Paulista to Ibirapuera Park (~4 km)
  pinheiros         Loop around Pinheiros neighborhood (~6 km)
  fuel-stations     Marginal Pinheiros, passes gas stations (~8 km)
  test              Se Cathedral to Republica (~0.5 km, quick test)
`);
  process.exit(0);
}

const speedKmh = parseFloat(getArg("speed", "40"));
const routeName = getArg("route", "paulista");
const cdpHost = getArg("host", "localhost");
const cdpPort = getArg("port", "9222");
const loop = args.includes("--loop");
const noRoads = args.includes("--no-roads");

const route = ROUTES[routeName];
if (!route) {
  console.error(`Unknown route: "${routeName}"`);
  console.error(`Available routes: ${Object.keys(ROUTES).join(", ")}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// OSRM — fetch real road geometry (free, no API key)
// ---------------------------------------------------------------------------

async function fetchRoadGeometry(waypoints) {
  // Build OSRM route request: lng,lat;lng,lat;...
  const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM returned ${res.status}`);
  const data = await res.json();

  if (data.code !== "Ok" || !data.routes?.[0]) {
    throw new Error(`OSRM error: ${data.code} — ${data.message || "no route found"}`);
  }

  // Extract coordinates from GeoJSON LineString [lng, lat] → { lat, lng }
  const geometry = data.routes[0].geometry.coordinates;
  return geometry.map(([lng, lat]) => ({ lat, lng }));
}

// ---------------------------------------------------------------------------
// Geo math
// ---------------------------------------------------------------------------

function haversineDistance(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function bearing(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;
  const dLng = toRad(b.lng - a.lng);
  const y = Math.sin(dLng) * Math.cos(toRad(b.lat));
  const x =
    Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
    Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function interpolateRoute(waypoints, intervalMeters = 50) {
  const points = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    const dist = haversineDistance(a, b);
    const steps = Math.max(1, Math.floor(dist / intervalMeters));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      points.push({
        lat: a.lat + (b.lat - a.lat) * t,
        lng: a.lng + (b.lng - a.lng) * t,
        heading: bearing(a, b),
        label: s === 0 ? a.label : undefined,
      });
    }
  }
  const last = waypoints[waypoints.length - 1];
  const prev = waypoints[waypoints.length - 2];
  points.push({
    lat: last.lat,
    lng: last.lng,
    heading: bearing(prev, last),
    label: last.label,
  });
  return points;
}

// ---------------------------------------------------------------------------
// CDP connection + simulation
// ---------------------------------------------------------------------------

async function getWebSocketUrl() {
  const res = await fetch(`http://${cdpHost}:${cdpPort}/json`);
  const tabs = await res.json();
  const tab = tabs.find((t) => t.type === "page");
  if (!tab) throw new Error("No page tab found in Chrome");
  return tab.webSocketDebuggerUrl;
}

async function run() {
  const speedMs = (speedKmh * 1000) / 3600;
  const intervalMeters = 20;
  const intervalSeconds = intervalMeters / speedMs;
  const intervalMs = intervalSeconds * 1000;

  // Fetch real road geometry from OSRM, or fall back to straight lines
  let roadPoints = route;
  if (!noRoads) {
    try {
      process.stdout.write(`🗺️  Fetching road geometry from OSRM...`);
      roadPoints = await fetchRoadGeometry(route);
      console.log(` got ${roadPoints.length} road points`);
    } catch (err) {
      console.log(` failed (${err.message})`);
      console.log(`   Falling back to straight lines. Use --no-roads to skip this.\n`);
      roadPoints = route;
    }
  }

  const points = interpolateRoute(roadPoints, intervalMeters);
  const totalDist = points.reduce((sum, p, i) => {
    if (i === 0) return 0;
    return sum + haversineDistance(points[i - 1], p);
  }, 0);

  console.log(`\n🚗 Kopilot Drive Simulator`);
  console.log(`─────────────────────────────────`);
  console.log(`   Route:    ${routeName} (${route.length} waypoints)`);
  console.log(`   Road:     ${noRoads ? "straight lines" : "OSRM street geometry"}`);
  console.log(`   Points:   ${points.length} interpolated positions`);
  console.log(`   Distance: ${(totalDist / 1000).toFixed(1)} km`);
  console.log(`   Speed:    ${speedKmh} km/h`);
  console.log(
    `   Duration: ~${Math.round(totalDist / speedMs / 60)} min`
  );
  console.log(`   Interval: ${intervalMs.toFixed(0)}ms between updates`);
  console.log(`   Loop:     ${loop ? "yes" : "no (stops at end)"}`);
  console.log(`─────────────────────────────────\n`);

  let wsUrl;
  try {
    wsUrl = await getWebSocketUrl();
  } catch (err) {
    console.error(`❌ Cannot connect to Chrome at ${cdpHost}:${cdpPort}`);
    console.error(`   Is Chrome running with --remote-debugging-port=${cdpPort}?\n`);
    console.error(`   Launch it with:`);
    console.error(
      `   /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome \\`
    );
    console.error(`     --remote-debugging-port=${cdpPort} \\`);
    console.error(`     --user-data-dir=/tmp/chrome-kopilot-test \\`);
    console.error(`     "http://localhost:3000"\n`);
    process.exit(1);
  }

  const ws = new WebSocket(wsUrl);

  let msgId = 1;
  const send = (method, params) =>
    ws.send(JSON.stringify({ id: msgId++, method, params }));

  ws.on("open", () => {
    console.log("✅ Connected to Chrome CDP\n");

    // Inject geolocation monkey-patch that adds speed/heading support.
    // Chrome's Emulation.setGeolocationOverride doesn't provide speed or heading
    // (they come back as null), so we patch the Geolocation API to read those
    // values from a global variable that we update on each tick.
    const patchScript = `
      (function() {
        if (window.__geoSimPatched) return;
        window.__geoSimPatched = true;
        window.__geoSim = null;

        const origWatch = navigator.geolocation.watchPosition.bind(navigator.geolocation);
        const origGet = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);

        function buildPosition() {
          const s = window.__geoSim;
          if (!s) return null;
          return {
            coords: {
              latitude: s.latitude,
              longitude: s.longitude,
              accuracy: s.accuracy || 10,
              altitude: s.altitude || null,
              altitudeAccuracy: null,
              heading: s.heading,
              speed: s.speed,
            },
            timestamp: Date.now(),
          };
        }

        // Patch getCurrentPosition
        navigator.geolocation.getCurrentPosition = function(success, error, opts) {
          const pos = buildPosition();
          if (pos) { success(pos); return; }
          origGet(success, error, opts);
        };

        // Patch watchPosition — poll for updates from our global
        const watchers = new Map();
        let watchId = 1000;
        navigator.geolocation.watchPosition = function(success, error, opts) {
          const id = watchId++;
          let lastTs = 0;
          const interval = setInterval(() => {
            const pos = buildPosition();
            if (pos && pos.timestamp !== lastTs) {
              lastTs = pos.timestamp;
              success(pos);
            }
          }, 200);
          watchers.set(id, interval);
          // Fire immediately if data available
          const pos = buildPosition();
          if (pos) success(pos);
          return id;
        };

        const origClear = navigator.geolocation.clearWatch.bind(navigator.geolocation);
        navigator.geolocation.clearWatch = function(id) {
          if (watchers.has(id)) {
            clearInterval(watchers.get(id));
            watchers.delete(id);
          } else {
            origClear(id);
          }
        };
      })();
    `;

    // Inject on current page and on every future navigation
    send("Page.addScriptToEvaluateOnNewDocument", { source: patchScript });
    send("Runtime.evaluate", { expression: patchScript });

    console.log("   Geolocation patched (speed + heading enabled)\n");

    let i = 0;

    const tick = () => {
      const point = points[i];
      const currentSpeedMs = speedMs;
      const headingDeg = point.heading || 0;

      // Update our global with full position data including speed + heading
      send("Runtime.evaluate", {
        expression: `window.__geoSim = {
          latitude: ${point.lat},
          longitude: ${point.lng},
          accuracy: 10,
          speed: ${currentSpeedMs.toFixed(4)},
          heading: ${headingDeg.toFixed(2)},
        }`,
      });

      // Also keep CDP override as fallback
      send("Emulation.setGeolocationOverride", {
        latitude: point.lat,
        longitude: point.lng,
        accuracy: 10,
      });

      const pct = ((i / (points.length - 1)) * 100).toFixed(0);
      const label = point.label ? ` — ${point.label}` : "";
      const speedDisplay = (currentSpeedMs * 3.6).toFixed(0);
      process.stdout.write(
        `\r  📍 [${pct.padStart(3)}%] ${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}  ${headingDeg.toFixed(0)}°  ${speedDisplay} km/h${label}   `
      );

      i++;
      if (i >= points.length) {
        if (loop) {
          i = 0;
          console.log(`\n\n  🔄 Looping route...\n`);
        } else {
          console.log(`\n\n✅ Route complete!\n`);
          // Set speed to 0 on completion
          send("Runtime.evaluate", {
            expression: `window.__geoSim = { ...window.__geoSim, speed: 0 }`,
          });
          send("Emulation.clearGeolocationOverride", {});
          setTimeout(() => {
            ws.close();
            process.exit(0);
          }, 500);
          return;
        }
      }

      setTimeout(tick, intervalMs);
    };

    tick();
  });

  ws.on("error", (err) => {
    console.error(`\n❌ CDP connection error: ${err.message}`);
    console.error(
      `   Is Chrome running with --remote-debugging-port=${cdpPort}?`
    );
    process.exit(1);
  });

  ws.on("close", () => {
    console.log("\n🔌 Chrome connection closed");
  });

  // Graceful shutdown on Ctrl+C
  process.on("SIGINT", () => {
    console.log(`\n\n🛑 Stopping simulation...`);
    try {
      send("Emulation.clearGeolocationOverride", {});
    } catch {}
    setTimeout(() => {
      ws.close();
      process.exit(0);
    }, 300);
  });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
