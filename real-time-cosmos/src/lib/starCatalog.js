// Bright star catalog with real astronomical data
// RA/Dec in degrees (J2000), distance in light-years, proper motion in arcsec/year
// H = transverse velocity component (km/s), D = distance (light-years)

const LIGHT_SPEED_KM_S = 299792.458; // km/s
const LY_TO_KM = 9.461e12; // light-year in km
const ARCSEC_TO_RAD = Math.PI / (180 * 3600);

export const CONSTELLATIONS = {
  UMa: { name: "Ursa Major", lines: [["Dubhe","Merak"],["Dubhe","Megrez"],["Merak","Phecda"],["Phecda","Megrez"],["Megrez","Alioth"],["Alioth","Mizar"],["Mizar","Alkaid"]] },
  Ori: { name: "Orion", lines: [["Betelgeuse","Bellatrix"],["Betelgeuse","Alnitak"],["Bellatrix","Mintaka"],["Alnitak","Alnilam"],["Alnilam","Mintaka"],["Alnitak","Saiph"],["Mintaka","Rigel"],["Saiph","Rigel"]] },
  Cyg: { name: "Cygnus", lines: [["Deneb","Sadr"],["Sadr","Albireo"],["Sadr","Gienah Cyg"],["Sadr","Delta Cyg"]] },
  Lyr: { name: "Lyra", lines: [["Vega","Sheliak"],["Vega","Sulafat"],["Sheliak","Sulafat"]] },
  Cas: { name: "Cassiopeia", lines: [["Schedar","Caph"],["Schedar","Gamma Cas"],["Gamma Cas","Ruchbah"],["Ruchbah","Segin"]] },
  Leo: { name: "Leo", lines: [["Regulus","Eta Leo"],["Eta Leo","Algieba"],["Algieba","Zosma"],["Zosma","Denebola"],["Regulus","Chertan"],["Chertan","Denebola"]] },
  Sco: { name: "Scorpius", lines: [["Antares","Dschubba"],["Antares","Tau Sco"],["Tau Sco","Shaula"]] },
  Gem: { name: "Gemini", lines: [["Castor","Pollux"]] },
  CMa: { name: "Canis Major", lines: [["Sirius","Mirzam"],["Sirius","Wezen"],["Wezen","Aludra"]] },
  Aql: { name: "Aquila", lines: [["Altair","Tarazed"],["Altair","Alshain"]] },
};

// Each star: name, RA (hrs), Dec (deg), magnitude, distance (ly), proper motion RA (mas/yr), proper motion Dec (mas/yr), spectral type, constellation
export const STARS = [
  // Ursa Major
  { name: "Dubhe", ra: 11.062, dec: 61.751, mag: 1.79, dist: 124, pmRA: -136.46, pmDec: -35.25, spectral: "K0III", constellation: "UMa" },
  { name: "Merak", ra: 11.031, dec: 56.382, mag: 2.37, dist: 79, pmRA: 81.66, pmDec: 33.74, spectral: "A1V", constellation: "UMa" },
  { name: "Phecda", ra: 11.897, dec: 53.695, mag: 2.44, dist: 84, pmRA: 107.76, pmDec: 11.16, spectral: "A0V", constellation: "UMa" },
  { name: "Megrez", ra: 12.257, dec: 57.033, mag: 3.31, dist: 81, pmRA: 104.11, pmDec: 7.30, spectral: "A3V", constellation: "UMa" },
  { name: "Alioth", ra: 12.900, dec: 55.960, mag: 1.77, dist: 81, pmRA: 111.74, pmDec: -8.99, spectral: "A1III", constellation: "UMa" },
  { name: "Mizar", ra: 13.399, dec: 54.925, mag: 2.27, dist: 78, pmRA: 121.23, pmDec: -22.01, spectral: "A2V", constellation: "UMa" },
  { name: "Alkaid", ra: 13.792, dec: 49.313, mag: 1.86, dist: 101, pmRA: -121.23, pmDec: -15.56, spectral: "B3V", constellation: "UMa" },
  
  // Orion
  { name: "Betelgeuse", ra: 5.919, dec: 7.407, mag: 0.42, dist: 700, pmRA: 24.95, pmDec: 9.56, spectral: "M1Ia", constellation: "Ori" },
  { name: "Rigel", ra: 5.242, dec: -8.202, mag: 0.13, dist: 860, pmRA: 1.87, pmDec: -0.56, spectral: "B8Ia", constellation: "Ori" },
  { name: "Bellatrix", ra: 5.419, dec: 6.350, mag: 1.64, dist: 250, pmRA: -8.75, pmDec: -13.28, spectral: "B2III", constellation: "Ori" },
  { name: "Alnitak", ra: 5.679, dec: -1.943, mag: 1.77, dist: 1200, pmRA: 3.99, pmDec: 2.54, spectral: "O9.5Ib", constellation: "Ori" },
  { name: "Alnilam", ra: 5.603, dec: -1.202, mag: 1.69, dist: 2000, pmRA: 1.49, pmDec: -1.06, spectral: "B0Ia", constellation: "Ori" },
  { name: "Mintaka", ra: 5.533, dec: -0.299, mag: 2.23, dist: 1200, pmRA: 1.67, pmDec: -0.56, spectral: "O9.5II", constellation: "Ori" },
  { name: "Saiph", ra: 5.796, dec: -9.670, mag: 2.06, dist: 720, pmRA: 1.55, pmDec: -1.20, spectral: "B0.5Ia", constellation: "Ori" },
  
  // Cygnus
  { name: "Deneb", ra: 20.690, dec: 45.281, mag: 1.25, dist: 2600, pmRA: 1.56, pmDec: 1.55, spectral: "A2Ia", constellation: "Cyg" },
  { name: "Sadr", ra: 20.370, dec: 40.257, mag: 2.20, dist: 1800, pmRA: 2.43, pmDec: -0.93, spectral: "F8Ib", constellation: "Cyg" },
  { name: "Albireo", ra: 19.512, dec: 27.960, mag: 3.18, dist: 430, pmRA: -7.17, pmDec: -5.63, spectral: "K3II", constellation: "Cyg" },
  { name: "Gienah Cyg", ra: 20.770, dec: 33.970, mag: 2.46, dist: 72, pmRA: 329.40, pmDec: 259.52, spectral: "A0IV", constellation: "Cyg" },
  { name: "Delta Cyg", ra: 19.749, dec: 45.131, mag: 2.87, dist: 171, pmRA: 44.07, pmDec: 48.66, spectral: "B9.5III", constellation: "Cyg" },

  // Lyra
  { name: "Vega", ra: 18.616, dec: 38.784, mag: 0.03, dist: 25, pmRA: 200.94, pmDec: 286.23, spectral: "A0V", constellation: "Lyr" },
  { name: "Sheliak", ra: 18.835, dec: 33.363, mag: 3.52, dist: 960, pmRA: 1.10, pmDec: -4.46, spectral: "A8II", constellation: "Lyr" },
  { name: "Sulafat", ra: 18.982, dec: 32.690, mag: 3.24, dist: 620, pmRA: -2.76, pmDec: 1.77, spectral: "B9III", constellation: "Lyr" },

  // Cassiopeia
  { name: "Schedar", ra: 0.675, dec: 56.537, mag: 2.23, dist: 230, pmRA: 50.36, pmDec: -32.17, spectral: "K0II", constellation: "Cas" },
  { name: "Caph", ra: 0.153, dec: 59.150, mag: 2.27, dist: 55, pmRA: 523.39, pmDec: -179.77, spectral: "F2III", constellation: "Cas" },
  { name: "Gamma Cas", ra: 0.945, dec: 60.717, mag: 2.47, dist: 610, pmRA: 25.65, pmDec: -3.82, spectral: "B0.5IVe", constellation: "Cas" },
  { name: "Ruchbah", ra: 1.357, dec: 60.235, mag: 2.68, dist: 100, pmRA: 296.68, pmDec: -49.88, spectral: "A5III", constellation: "Cas" },
  { name: "Segin", ra: 1.907, dec: 63.670, mag: 3.37, dist: 440, pmRA: 22.09, pmDec: -3.35, spectral: "B3III", constellation: "Cas" },

  // Leo
  { name: "Regulus", ra: 10.139, dec: 11.967, mag: 1.35, dist: 79, pmRA: -249.40, pmDec: 4.91, spectral: "B8IV", constellation: "Leo" },
  { name: "Denebola", ra: 11.818, dec: 14.572, mag: 2.14, dist: 36, pmRA: -499.02, pmDec: -113.78, spectral: "A3V", constellation: "Leo" },
  { name: "Algieba", ra: 10.333, dec: 19.842, mag: 2.28, dist: 130, pmRA: 310.77, pmDec: -152.88, spectral: "K1III", constellation: "Leo" },
  { name: "Zosma", ra: 11.235, dec: 20.524, mag: 2.56, dist: 58, pmRA: -143.42, pmDec: -130.36, spectral: "A4V", constellation: "Leo" },
  { name: "Chertan", ra: 11.237, dec: 15.430, mag: 3.34, dist: 165, pmRA: -60.31, pmDec: -69.94, spectral: "A2IV", constellation: "Leo" },
  { name: "Eta Leo", ra: 10.122, dec: 16.763, mag: 3.52, dist: 2000, pmRA: -1.41, pmDec: -0.24, spectral: "A0Ib", constellation: "Leo" },

  // Scorpius
  { name: "Antares", ra: 16.490, dec: -26.432, mag: 0.96, dist: 550, pmRA: -10.16, pmDec: -23.21, spectral: "M1.5Iab", constellation: "Sco" },
  { name: "Shaula", ra: 17.560, dec: -37.104, mag: 1.63, dist: 570, pmRA: -8.90, pmDec: -29.95, spectral: "B2IV", constellation: "Sco" },
  { name: "Dschubba", ra: 16.005, dec: -22.622, mag: 2.32, dist: 400, pmRA: -10.21, pmDec: -36.90, spectral: "B0.3IV", constellation: "Sco" },
  { name: "Tau Sco", ra: 16.598, dec: -28.216, mag: 2.82, dist: 470, pmRA: -8.59, pmDec: -22.53, spectral: "B0.2V", constellation: "Sco" },

  // Gemini
  { name: "Pollux", ra: 7.755, dec: 28.026, mag: 1.14, dist: 34, pmRA: -625.69, pmDec: -45.95, spectral: "K0III", constellation: "Gem" },
  { name: "Castor", ra: 7.577, dec: 31.888, mag: 1.58, dist: 52, pmRA: -191.45, pmDec: -145.19, spectral: "A2V", constellation: "Gem" },

  // Canis Major
  { name: "Sirius", ra: 6.752, dec: -16.716, mag: -1.46, dist: 8.6, pmRA: -546.01, pmDec: -1223.07, spectral: "A1V", constellation: "CMa" },
  { name: "Mirzam", ra: 6.379, dec: -17.956, mag: 1.98, dist: 500, pmRA: -3.45, pmDec: -0.47, spectral: "B1II", constellation: "CMa" },
  { name: "Wezen", ra: 7.140, dec: -26.393, mag: 1.84, dist: 1800, pmRA: -2.75, pmDec: 3.33, spectral: "F8Ia", constellation: "CMa" },
  { name: "Aludra", ra: 7.402, dec: -29.303, mag: 2.45, dist: 2000, pmRA: -3.99, pmDec: 5.65, spectral: "B5Ia", constellation: "CMa" },

  // Aquila
  { name: "Altair", ra: 19.846, dec: 8.868, mag: 0.77, dist: 16.7, pmRA: 536.23, pmDec: 385.29, spectral: "A7V", constellation: "Aql" },
  { name: "Tarazed", ra: 19.771, dec: 10.613, mag: 2.72, dist: 460, pmRA: 15.72, pmDec: -3.08, spectral: "K3II", constellation: "Aql" },
  { name: "Alshain", ra: 19.922, dec: 6.407, mag: 3.71, dist: 45, pmRA: 46.35, pmDec: -481.32, spectral: "G8IV", constellation: "Aql" },

  // Other bright stars
  { name: "Polaris", ra: 2.530, dec: 89.264, mag: 1.98, dist: 430, pmRA: 44.48, pmDec: -11.85, spectral: "F7Ib", constellation: null },
  { name: "Arcturus", ra: 14.261, dec: 19.182, mag: -0.05, dist: 37, pmRA: -1093.45, pmDec: -1999.40, spectral: "K1.5III", constellation: null },
  { name: "Capella", ra: 5.278, dec: 45.998, mag: 0.08, dist: 42, pmRA: 75.52, pmDec: -427.13, spectral: "G5III", constellation: null },
  { name: "Procyon", ra: 7.655, dec: 5.225, mag: 0.34, dist: 11.4, pmRA: -714.59, pmDec: -1036.80, spectral: "F5IV", constellation: null },
  { name: "Spica", ra: 13.420, dec: -11.161, mag: 1.04, dist: 260, pmRA: -42.50, pmDec: -31.73, spectral: "B1III", constellation: null },
  { name: "Fomalhaut", ra: 22.961, dec: -29.622, mag: 1.16, dist: 25, pmRA: 329.22, pmDec: -164.22, spectral: "A4V", constellation: null },
  { name: "Aldebaran", ra: 4.599, dec: 16.509, mag: 0.85, dist: 65, pmRA: 62.78, pmDec: -189.36, spectral: "K5III", constellation: null },
  { name: "Canopus", ra: 6.399, dec: -52.696, mag: -0.74, dist: 310, pmRA: 19.93, pmDec: 23.24, spectral: "A9II", constellation: null },
  { name: "Achernar", ra: 1.629, dec: -57.237, mag: 0.46, dist: 139, pmRA: 87.00, pmDec: -38.24, spectral: "B6V", constellation: null },
];

/**
 * Time Delay Formula:
 * T_observed = T_actual + sqrt(H² + D²) / C_s
 * 
 * Where:
 * H = object motion (transverse displacement in the light travel time)
 * D = distance from observer
 * C_s = signal velocity (speed of light)
 * 
 * This computes the time delay, and from that we can estimate the star's
 * "actual current position" by advancing its proper motion by the light-travel time.
 */
export function computeSBSDelay(star) {
  const distKm = star.dist * LY_TO_KM;
  
  // Proper motion in arcsec/yr combined
  const pmTotal = Math.sqrt(star.pmRA * star.pmRA + star.pmDec * star.pmDec) / 1000; // mas to arcsec
  
  // Transverse velocity: v_t = 4.74 * pm(arcsec/yr) * distance(parsec)
  const distParsec = star.dist / 3.262;
  const vTransverse = 4.74 * pmTotal * distParsec; // km/s
  
  // H = transverse displacement during light travel time
  // Light travel time in seconds
  const lightTravelTimeSec = distKm / LIGHT_SPEED_KM_S;
  const lightTravelTimeYrs = star.dist; // distance in ly IS the light travel time in years
  
  // H = v_transverse * light_travel_time (in km)
  const H = vTransverse * lightTravelTimeSec;
  const D = distKm;
  
  // Time delay formula: delay = sqrt(H² + D²) / C_s
  const sbsDelay = Math.sqrt(H * H + D * D) / LIGHT_SPEED_KM_S;
  const sbsDelayYears = sbsDelay / (365.25 * 24 * 3600);
  
  return {
    lightTravelTimeYrs,
    sbsDelayYears,
    extraDelay: sbsDelayYears - lightTravelTimeYrs,
    vTransverse,
    H_km: H,
    D_km: D,
  };
}

/**
 * Get the predicted "real-time" position of a star
 * by advancing its proper motion by the light travel time
 */
export function getPredictedPosition(star) {
  const sbs = computeSBSDelay(star);
  
  // The star's "real-time" position is where it has moved to over the full
  // light travel time (i.e. the time elapsed since the light we see left it).
  // We advance proper motion by lightTravelTimeYrs so the star's current
  // location is meaningfully separated from its observed position on screen.
  const advanceYears = sbs.lightTravelTimeYrs;

  // pmRA and pmDec are in milliarcseconds per year
  const deltaRA = (star.pmRA / 1000 / 3600) * advanceYears; // degrees
  const deltaDec = (star.pmDec / 1000 / 3600) * advanceYears; // degrees
  
  return {
    ra: star.ra + deltaRA / 15, // convert degrees to hours
    dec: star.dec + deltaDec,
    deltaRA_arcsec: (star.pmRA / 1000) * advanceYears,
    deltaDec_arcsec: (star.pmDec / 1000) * advanceYears,
    totalShift_arcsec: Math.sqrt(
      Math.pow((star.pmRA / 1000) * advanceYears, 2) + 
      Math.pow((star.pmDec / 1000) * advanceYears, 2)
    ),
    ...sbs,
  };
}

/**
 * Convert RA (hours) and Dec (degrees) to a 2D projection (stereographic)
 */
export function celestialToXY(raHours, decDeg, centerRA, centerDec, scale) {
  const ra = raHours * 15 * Math.PI / 180;
  const dec = decDeg * Math.PI / 180;
  const ra0 = centerRA * 15 * Math.PI / 180;
  const dec0 = centerDec * Math.PI / 180;
  
  const cosDec = Math.cos(dec);
  const sinDec = Math.sin(dec);
  const cosDec0 = Math.cos(dec0);
  const sinDec0 = Math.sin(dec0);
  const cosRaDiff = Math.cos(ra - ra0);
  
  const denom = sinDec0 * sinDec + cosDec0 * cosDec * cosRaDiff;
  
  if (denom <= 0) return null; // behind the projection
  
  const x = (cosDec * Math.sin(ra - ra0)) / denom;
  const y = (cosDec0 * sinDec - sinDec0 * cosDec * cosRaDiff) / denom;
  
  return { x: -x * scale, y: -y * scale };
}

// Spectral type to color mapping
export function spectralToColor(spectral) {
  if (!spectral) return "#ffffff";
  const type = spectral[0];
  const colors = {
    'O': '#9bb0ff',
    'B': '#aabfff',
    'A': '#cad7ff',
    'F': '#f8f7ff',
    'G': '#fff4ea',
    'K': '#ffd2a1',
    'M': '#ffcc6f',
  };
  return colors[type] || '#ffffff';
}

// Magnitude to visual size
export function magToSize(mag) {
  return Math.max(1.5, Math.min(8, 6 - mag * 0.8));
}