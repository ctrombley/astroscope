/**
 * Bright star catalog — subset of the Yale BSC5 / Hipparcos catalog.
 * Format: [ra_deg, dec_deg, vmag, bv_color_index]
 * BV: -0.3=blue-white, 0=white, 0.6=yellow-white, 1.0=orange, 1.5+=red
 * Covers stars to roughly vmag ≤ 3.5, plus notable fainter ones.
 */
export const CATALOG_STARS: [number, number, number, number][] = [
  // === CANIS MAJOR ===
  [101.29, -16.72, -1.46,  0.01], // Sirius α CMa
  [104.66, -28.97,  1.50, -0.21], // Adhara ε CMa
  [107.10, -26.39,  1.84,  0.67], // Wezen δ CMa
  [95.67,  -17.96,  1.98, -0.23], // Mirzam β CMa
  [111.02, -29.30,  2.45, -0.07], // Aludra η CMa
  [109.49, -37.10,  2.71,  0.43], // Pi Pup (in Puppis)

  // === CARINA / VELA / PUPPIS ===
  [95.99,  -52.70, -0.72,  0.16], // Canopus α Car
  [138.30, -69.72,  1.68,  0.04], // Miaplacidus β Car
  [125.63, -59.51,  1.86,  1.39], // Avior ε Car
  [122.38, -47.34,  1.83, -0.22], // Regor γ Vel
  [120.90, -40.00,  2.21, -0.27], // Naos ζ Pup
  [136.99, -43.43,  2.23,  1.67], // Suhail λ Vel
  [139.27, -59.28,  2.25,  0.45], // Aspidiske ι Car
  [131.18, -54.71,  1.98,  0.04], // Alsephina δ Vel
  [140.53, -55.01,  2.50, -0.18], // Markab κ Vel

  // === CANIS MINOR ===
  [114.83,   5.22,  0.34,  0.43], // Procyon α CMi
  [111.79,   8.29,  2.90, -0.09], // Gomeisa β CMi

  // === ORION ===
  [78.63,   -8.20,  0.13, -0.03], // Rigel β Ori
  [88.79,    7.41,  0.45,  1.85], // Betelgeuse α Ori
  [81.28,    6.35,  1.64, -0.22], // Bellatrix γ Ori
  [84.05,   -1.20,  1.70, -0.19], // Alnilam ε Ori
  [85.19,   -1.94,  1.74, -0.20], // Alnitak ζ Ori
  [83.00,   -0.30,  2.23, -0.22], // Mintaka δ Ori
  [86.94,   -9.67,  2.07, -0.17], // Saiph κ Ori
  [76.96,   -5.09,  2.79,  0.13], // Cursa β Eri

  // === TAURUS ===
  [68.98,   16.51,  0.87,  1.54], // Aldebaran α Tau
  [81.57,   28.61,  1.65, -0.14], // Elnath β Tau
  [56.87,   24.11,  2.87, -0.09], // Alcyone η Tau (brightest Pleiad)
  [57.29,   24.36,  3.63, -0.05], // Atlas 27 Tau
  [83.78,   -6.00,  3.60, -0.20], // Lambda Ori

  // === GEMINI ===
  [113.65,  31.89,  1.57,  0.03], // Castor α Gem
  [116.33,  28.03,  1.16,  1.00], // Pollux β Gem
  [99.43,   16.40,  1.93,  0.00], // Alhena γ Gem
  [100.98,  25.13,  2.98,  1.40], // Mebsuda ε Gem
  [95.74,   22.51,  2.87,  1.60], // Tejat μ Gem

  // === LEO ===
  [152.09,  11.97,  1.36, -0.08], // Regulus α Leo
  [177.26,  14.57,  2.14,  0.09], // Denebola β Leo
  [154.99,  19.84,  2.01,  1.13], // Algieba γ Leo
  [168.53,  20.52,  2.56,  0.13], // Zosma δ Leo
  [154.17,  23.42,  3.44,  0.28], // Adhafera ζ Leo
  [148.19,  26.01,  3.44,  0.47], // Mu Leo

  // === VIRGO ===
  [201.30, -11.16,  0.97, -0.24], // Spica α Vir
  [190.41,  -1.45,  2.74,  0.37], // Porrima γ Vir
  [195.54,  10.96,  2.83,  0.94], // Vindemiatrix ε Vir
  [193.90, -23.17,  3.00,  0.93], // Gamma Hya (nearby)

  // === SCORPIUS ===
  [247.35, -26.43,  1.06,  1.87], // Antares α Sco
  [264.33, -37.10,  1.63, -0.22], // Shaula λ Sco
  [264.40, -43.00,  1.87,  0.41], // Sargas θ Sco
  [240.08, -22.62,  2.32, -0.12], // Dschubba δ Sco
  [241.36, -19.81,  2.62, -0.10], // Acrab β Sco
  [252.97, -34.29,  2.29,  0.49], // Wei ε Sco
  [265.62, -39.03,  2.41,  0.07], // Girtab κ Sco
  [263.40, -37.30,  2.69, -0.12], // Lesath υ Sco
  [243.59, -42.36,  3.21,  1.70], // Mu Sco

  // === SAGITTARIUS ===
  [276.04, -34.38,  1.79, -0.03], // Kaus Australis ε Sgr
  [283.82, -26.30,  2.05, -0.13], // Nunki σ Sgr
  [285.65, -29.88,  2.60,  0.07], // Ascella ζ Sgr
  [275.25, -29.83,  2.72,  1.36], // Kaus Media δ Sgr
  [274.41, -25.42,  2.82,  1.00], // Kaus Borealis λ Sgr
  [271.45, -30.42,  2.97,  0.98], // Alnasl γ Sgr
  [283.82, -21.07,  3.11, -0.07], // Tau Sgr
  [269.76, -26.99,  3.17,  0.01], // Phi Sgr

  // === AQUILA ===
  [297.70,   8.87,  0.77,  0.22], // Altair α Aql
  [296.56,  10.61,  2.72,  1.50], // Tarazed γ Aql
  [298.13,  13.86,  2.99,  0.03], // Okab ζ Aql
  [298.83,   6.41,  3.71,  0.86], // Alshain β Aql

  // === CYGNUS ===
  [310.36,  45.28,  1.25,  0.09], // Deneb α Cyg
  [305.56,  40.26,  2.23,  0.68], // Sadr γ Cyg
  [311.55,  33.97,  2.48,  0.98], // Gienah ε Cyg
  [296.24,  45.13,  2.87,  0.08], // Delta Cyg
  [292.68,  27.96,  3.08,  1.10], // Albireo β Cyg
  [316.21,  30.23,  3.20,  0.90], // Zeta Cyg
  [317.67,  58.21,  3.77, -0.07], // Iota Cyg

  // === LYRA ===
  [279.23,  38.78,  0.03,  0.00], // Vega α Lyr
  [284.74,  32.69,  3.24,  0.00], // Sulafat γ Lyr
  [282.52,  33.36,  3.52,  0.00], // Sheliak β Lyr

  // === HERCULES ===
  [247.55,  21.49,  2.78,  0.93], // Kornephoros β Her
  [250.72,  31.60,  2.81,  0.65], // Zeta Her
  [258.76,  24.84,  3.14,  0.28], // Sarin δ Her

  // === BOOTES ===
  [213.92,  19.18, -0.05,  1.24], // Arcturus α Boo
  [221.25,  27.07,  2.37,  0.97], // Izar ε Boo
  [218.88,  18.40,  2.68,  0.58], // Muphrid η Boo
  [222.68,  38.31,  3.03,  0.19], // Seginus γ Boo
  [225.49,  40.39,  3.49,  0.98], // Nekkar β Boo

  // === CORONA BOREALIS ===
  [233.67,  26.71,  2.23,  0.02], // Alphecca α CrB

  // === OPHIUCHUS / SERPENS ===
  [263.73,  12.56,  2.08,  0.15], // Rasalhague α Oph
  [257.59, -15.72,  2.43,  0.06], // Sabik η Oph
  [249.29, -10.57,  2.56,  0.02], // Han ζ Oph
  [243.59,  -3.69,  2.74,  1.60], // Yed Prior δ Oph
  [236.07,   6.43,  2.63,  1.17], // Unukalhai α Ser

  // === URSA MAJOR (Big Dipper) ===
  [165.93,  61.75,  1.79,  1.06], // Dubhe α UMa
  [165.46,  56.38,  2.37,  0.04], // Merak β UMa
  [178.46,  53.69,  2.44,  0.04], // Phecda γ UMa
  [183.86,  57.03,  3.31,  0.08], // Megrez δ UMa
  [193.51,  55.96,  1.76, -0.02], // Alioth ε UMa
  [200.98,  54.93,  2.27,  0.14], // Mizar ζ UMa
  [206.89,  49.31,  1.86, -0.18], // Alkaid η UMa

  // === URSA MINOR (Little Dipper) ===
  [37.95,   89.26,  2.02,  0.64], // Polaris α UMi
  [222.68,  74.16,  2.08,  1.47], // Kochab β UMi
  [230.18,  71.83,  3.05,  0.06], // Pherkad γ UMi
  [247.73,  86.59,  4.25,  0.26], // Delta UMi (handle star)

  // === CASSIOPEIA ===
  [10.13,   56.54,  2.23,  1.17], // Schedar α Cas
  [2.29,    59.15,  2.27,  0.34], // Caph β Cas
  [14.18,   60.72,  2.47, -0.15], // Cih γ Cas
  [21.45,   60.24,  2.68,  0.12], // Ruchbah δ Cas
  [28.60,   63.67,  3.38, -0.18], // Segin ε Cas

  // === PERSEUS ===
  [51.08,   49.86,  1.79,  0.48], // Mirfak α Per
  [47.04,   40.96,  2.12, -0.05], // Algol β Per
  [58.53,   31.88,  2.86, -0.20], // Zeta Per
  [65.87,   35.79,  4.04,  0.04], // Xi Per (Menkib)

  // === AURIGA ===
  [79.17,   45.99,  0.08,  0.80], // Capella α Aur
  [89.88,   44.95,  1.90,  0.03], // Menkalinan β Aur
  [90.00,   37.21,  2.62,  0.01], // Theta Aur
  [74.25,   33.17,  2.69,  1.50], // Hassaleh ι Aur
  [75.49,   43.82,  2.99,  0.54], // Epsilon Aur

  // === ANDROMEDA ===
  [2.10,    29.09,  2.07, -0.11], // Alpheratz α And
  [17.43,   35.62,  2.06,  1.58], // Mirach β And
  [30.97,   42.33,  2.10,  1.37], // Almach γ And
  [23.30,   30.86,  3.27,  0.97], // Delta And

  // === PEGASUS ===
  [346.19,  15.21,  2.49, -0.05], // Markab α Peg
  [345.94,  28.08,  2.44,  1.68], // Scheat β Peg
  [3.31,    15.18,  2.83, -0.20], // Algenib γ Peg
  [326.05,   9.87,  2.39,  1.52], // Enif ε Peg
  [332.44,  10.83,  3.40, -0.02], // Homam ζ Peg
  [338.62,  20.77,  3.48,  1.01], // Matar η Peg

  // === ARIES ===
  [31.79,   23.46,  2.01,  1.15], // Hamal α Ari
  [28.66,   20.81,  2.64,  0.08], // Sheratan β Ari

  // === CETUS ===
  [10.90,  -17.99,  2.04,  1.02], // Diphda β Cet
  [45.57,    4.09,  2.53,  1.64], // Menkar α Cet

  // === ERIDANUS ===
  [24.43,  -57.24,  0.46, -0.17], // Achernar α Eri
  [44.57,  -40.31,  3.24,  0.13], // Acamar θ Eri
  [76.96,   -5.09,  2.79,  0.13], // Cursa β Eri (shared w/ Orion)
  [59.51,  -13.51,  2.95,  1.56], // Zaurak γ Eri

  // === LEPUS ===
  [83.18,  -17.82,  2.58,  0.21], // Arneb α Lep
  [82.06,  -20.76,  2.84,  0.82], // Nihal β Lep

  // === COLUMBA ===
  [84.91,  -34.07,  2.65, -0.12], // Phact α Col
  [87.74,  -35.77,  3.12,  1.16], // Wazn β Col

  // === PISCIS AUSTRINUS ===
  [344.41, -29.62,  1.16,  0.14], // Fomalhaut α PsA

  // === AQUARIUS ===
  [322.89,  -5.57,  2.91,  1.05], // Sadalsuud β Aqr
  [331.45,  -0.32,  2.96,  1.00], // Sadalmelik α Aqr
  [311.92,  -9.50,  3.27,  0.02], // Skat δ Aqr

  // === CAPRICORNUS ===
  [326.76, -16.13,  2.85,  0.30], // Deneb Algedi δ Cap
  [305.25, -14.78,  3.08,  0.79], // Dabih β Cap

  // === CEPHEUS ===
  [319.64,  62.59,  2.45,  0.26], // Alderamin α Cep
  [322.16,  70.56,  3.23, -0.22], // Alfirk β Cep
  [354.84,  77.63,  3.21,  1.03], // Errai γ Cep

  // === DRACO ===
  [269.15,  51.49,  2.23,  1.52], // Eltanin γ Dra
  [262.61,  52.30,  2.79,  1.07], // Rastaban β Dra
  [288.14,  67.66,  3.07,  0.99], // Altais δ Dra
  [264.40,  65.71,  3.17,  0.01], // Aldibah ζ Dra

  // === LIBRA ===
  [222.72, -16.04,  2.75,  0.15], // Zubenelgenubi α Lib
  [229.25,  -9.38,  2.61, -0.10], // Zubeneschamali β Lib

  // === CENTAURUS ===
  [219.90, -60.83, -0.01,  0.71], // Rigil Kentaurus α Cen
  [210.96, -60.37,  0.61, -0.23], // Hadar β Cen
  [211.67, -36.37,  2.06,  1.02], // Menkent θ Cen
  [211.11, -41.69,  3.04, -0.18], // Mu Cen

  // === CRUX (Southern Cross) ===
  [186.65, -63.10,  0.77, -0.24], // Acrux α Cru
  [191.93, -59.69,  1.25, -0.24], // Mimosa β Cru
  [187.79, -57.11,  1.64,  1.60], // Gacrux γ Cru
  [183.79, -58.75,  2.79, -0.16], // Delta Cru

  // === MUSCA ===
  [189.30, -69.14,  2.69, -0.18], // Alpha Mus
  [191.38, -68.11,  3.05, -0.08], // Beta Mus

  // === LUPUS ===
  [220.48, -47.39,  2.30, -0.19], // Alpha Lup
  [224.63, -43.13,  2.68, -0.11], // Beta Lup

  // === CORVUS ===
  [183.79, -17.54,  2.58, -0.12], // Gienah γ Crv
  [188.02, -23.40,  2.65,  0.89], // Kraz β Crv
  [187.47, -16.52,  2.95, -0.09], // Algorab δ Crv

  // === HYDRA ===
  [141.90,  -8.66,  1.99,  1.44], // Alphard α Hya

  // === GRUS ===
  [332.06, -46.96,  1.74, -0.07], // Alnair α Gru
  [340.67, -46.88,  2.11,  1.62], // Gruis β Gru
  [328.48, -37.36,  3.01,  0.05], // Gamma Gru

  // === PHOENIX ===
  [6.57,   -42.31,  2.40,  1.09], // Ankaa α Phe

  // === TUCANA ===
  [334.62, -60.26,  2.86,  1.39], // Alpha Tuc

  // === PAVO ===
  [306.41, -56.73,  1.94, -0.12], // Peacock α Pav
  [311.14, -66.20,  3.42,  0.30], // Beta Pav

  // === INDUS ===
  [309.39, -47.29,  3.11,  0.94], // Alpha Ind

  // === ARA ===
  [252.15, -55.53,  2.85,  1.45], // Beta Ara
  [262.96, -49.88,  2.95, -0.08], // Alpha Ara

  // === TRIANGULUM AUSTRALE ===
  [252.17, -69.03,  1.92,  1.44], // Atria α TrA
  [249.36, -63.43,  2.83, -0.11], // Beta TrA

  // === CORONA AUSTRALIS ===
  [287.37, -38.32,  4.10,  0.88], // Alpha CrA

  // === SAGITTARIUS (additional) ===
  [286.73, -27.67,  3.32,  0.89], // Tau Sgr

  // === SCORPIUS ADDITIONAL ===
  [239.22, -26.11,  3.01,  1.58], // Pi Sco

  // === AQUILA ADDITIONAL ===
  [300.66,  13.86,  3.36, -0.01], // Lambda Aql

  // === SUMMER TRIANGLE CONTEXT ===
  [298.83,   6.41,  3.71,  0.86], // Alshain β Aql

  // === NOTABLE OBJECTS ===
  [83.82,  -5.91,  3.19,  0.07], // Hatsya ι Ori (in Sword)
]

/**
 * Generate procedural background stars to fill the sky.
 * Returns [ra_deg, dec_deg, vmag] for count random stars
 * biased toward the galactic plane.
 */
export function generateBackgroundStars(count: number, seed: number = 42): [number, number, number][] {
  const stars: [number, number, number][] = []
  // Simple LCG random number generator (deterministic)
  let s = seed
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }

  // North galactic pole in equatorial coords (J2000)
  const NGP_RA = 192.86 * (Math.PI / 180)
  const NGP_DEC = 27.13 * (Math.PI / 180)

  for (let i = 0; i < count * 6 && stars.length < count; i++) {
    const ra = rand() * 360
    const dec = Math.asin(rand() * 2 - 1) * (180 / Math.PI)

    // Compute galactic latitude
    const raDelta = ra * (Math.PI / 180) - NGP_RA
    const decRad = dec * (Math.PI / 180)
    const sinGalLat =
      Math.sin(decRad) * Math.sin(NGP_DEC) +
      Math.cos(decRad) * Math.cos(NGP_DEC) * Math.cos(raDelta)
    const galLat = Math.asin(sinGalLat) * (180 / Math.PI)

    // Density weight: higher near galactic plane
    const planeWeight = Math.exp(-Math.abs(galLat) / 15) * 2.0 + 0.5
    if (rand() > planeWeight / 2.5) continue

    // Magnitudes 4.0–7.0 (faint background stars)
    const vmag = 4.0 + rand() * 3.0
    stars.push([ra, dec, vmag])
  }
  return stars.slice(0, count)
}
