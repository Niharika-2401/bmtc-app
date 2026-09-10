// 1. Initialize Leaflet Map centered on Bengaluru
const map = L.map('map').setView([12.9716, 77.5946], 12);

// Add OpenStreetMap base tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Group to manage stop markers and route polylines
const markersGroup = L.layerGroup().addTo(map);
const routePolylineGroup = L.layerGroup().addTo(map);

// 2. Populate Dropdown Options from bmtcData.js
function populateDropdowns() {
  const fromSelect = document.getElementById('fromStop');
  const toSelect = document.getElementById('toStop');

  bmtcStops.forEach(stop => {
    const optionFrom = document.createElement('option');
    optionFrom.value = stop.id;
    optionFrom.textContent = stop.name;
    fromSelect.appendChild(optionFrom);

    const optionTo = document.createElement('option');
    optionTo.value = stop.id;
    optionTo.textContent = stop.name;
    toSelect.appendChild(optionTo);
  });
}

// 3. Render Bus Stops as Map Markers
function renderStopsOnMap() {
  bmtcStops.forEach(stop => {
    const marker = L.marker([stop.lat, stop.lng]).addTo(markersGroup);
    marker.bindPopup(`<b>🚏 ${stop.name}</b>`);
  });
}

// Dynamic ETA Calculation Helper
function calculateETA(stopCount) {
  const baseMinutes = stopCount * 6; // Average drive time between major stops
  const dwellTime = stopCount * 1.5; // Average dwell time at bus stops
  return Math.round(baseMinutes + dwellTime);
}

// 4. Search Routes Logic
function searchRoutes() {
  const originId = document.getElementById('fromStop').value;
  const destId = document.getElementById('toStop').value;
  const busListDiv = document.getElementById('busList');

  // Clear previous polyline lines from map
  routePolylineGroup.clearLayers();

  if (!originId || !destId) {
    busListDiv.innerHTML = "<p style='color: red;'>Please select both Boarding and Alighting stops.</p>";
    return;
  }

  if (originId === destId) {
    busListDiv.innerHTML = "<p style='color: orange;'>Boarding and Alighting stops cannot be the same.</p>";
    return;
  }

  // Find direct buses passing through origin first, then destination
  const matchingRoutes = bmtcRoutes.filter(route => {
    const originIndex = route.stops.indexOf(originId);
    const destIndex = route.stops.indexOf(destId);
    return originIndex !== -1 && destIndex !== -1 && originIndex < destIndex;
  });

  if (matchingRoutes.length === 0) {
    busListDiv.innerHTML = "<p>No direct bus routes found between selected stops.</p>";
    return;
  }

  // Display found routes in UI
  busListDiv.innerHTML = "";
  matchingRoutes.forEach(route => {
    const originStop = bmtcStops.find(s => s.id === originId);
    const destStop = bmtcStops.find(s => s.id === destId);

    // Calculate intermediate stops count and ETA
    const startIndex = route.stops.indexOf(originId);
    const endIndex = route.stops.indexOf(destId);
    const stopCount = endIndex - startIndex;
    const etaMins = calculateETA(stopCount);

    // Build route UI card
    const card = document.createElement('div');
    card.className = 'bus-card';
    card.innerHTML = `
      <h5>🚌 Route ${route.routeNo} (${route.type})</h5>
      <p>Stops in between: <b>${stopCount} stops</b> | Est. Travel Time: <b>~${etaMins} mins</b></p>
    `;
    busListDiv.appendChild(card);

    // Draw route line on map
    const routeCoords = route.stops
      .slice(startIndex, endIndex + 1)
      .map(stopId => {
        const s = bmtcStops.find(item => item.id === stopId);
        return [s.lat, s.lng];
      });

    const polyline = L.polyline(routeCoords, { color: '#003366', weight: 5, opacity: 0.8 });
    routePolylineGroup.addLayer(polyline);
    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
  });
}

// 5. App Setup Execution
populateDropdowns();
renderStopsOnMap();

// Attach Event Listener to Search Button
document.getElementById('findBusBtn').addEventListener('click', searchRoutes);