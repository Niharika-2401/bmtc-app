/* BMTC Bus Stops with coordinates */
const bmtcStops = [
  { id: "s1", name: "Kempegowda Bus Station (Majestic)", lat: 12.9779, lng: 77.5723 },
  { id: "s2", name: "Corporation", lat: 12.9654, lng: 77.5881 },
  { id: "s3", name: "Domlur", lat: 12.9609, lng: 77.6382 },
  { id: "s4", name: "Silk Board", lat: 12.9172, lng: 77.6228 },
  { id: "s5", name: "HSR Layout", lat: 12.9116, lng: 77.6389 },
  { id: "s6", name: "Bellandur", lat: 12.9260, lng: 77.6762 },
  { id: "s7", name: "Marathahalli", lat: 12.9559, lng: 77.7011 },
  { id: "s8", name: "Tin Factory", lat: 13.0003, lng: 77.6622 },
  { id: "s9", name: "Whitefield", lat: 12.9698, lng: 77.7499 }
];

/* Sample BMTC Bus Routes */
const bmtcRoutes = [
  {
    routeNo: "500-D",
    type: "Volvo AC",
    stops: ["s4", "s5", "s6", "s7", "s8"] // Silk Board -> Tin Factory
  },
  {
    routeNo: "335-E",
    type: "Vajra AC",
    stops: ["s1", "s2", "s3", "s7", "s9"] // Majestic -> Whitefield
  },
  {
    routeNo: "500-A",
    type: "Ordinary",
    stops: ["s1", "s2", "s4", "s5", "s6"] // Majestic -> Bellandur
  }
];