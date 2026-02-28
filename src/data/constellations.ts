/**
 * Constellation stick-figure data.
 * Each constellation has an array of "paths" (connected sequences of [ra_deg, dec_deg]).
 * Star coordinates match the Yale BSC5 catalog where possible.
 * labelRa/labelDec marks where to place the name label (roughly the centroid).
 */
export interface ConstellationDef {
  name: string
  labelRa: number
  labelDec: number
  paths: [number, number][][]
}

export const CONSTELLATIONS: ConstellationDef[] = [
  {
    name: 'Orion',
    labelRa: 84, labelDec: 0,
    paths: [
      // Shoulders ↔ belt ↔ feet
      [[78.63, -8.20], [84.05, -1.20], [88.79, 7.41]],       // Rigel → Alnilam → Betelgeuse
      [[86.94, -9.67], [85.19, -1.94], [81.28, 6.35]],       // Saiph → Alnitak → Bellatrix
      [[85.19, -1.94], [84.05, -1.20], [83.00, -0.30]],      // belt: Alnitak–Alnilam–Mintaka
      [[88.79, 7.41], [81.28, 6.35]],                         // shoulder bar
      [[88.79, 7.41], [83.78, 9.94]],                         // Betelgeuse → Meissa (head)
      [[81.28, 6.35], [83.78, 9.94]],                         // Bellatrix → Meissa
    ],
  },
  {
    name: 'Ursa Major',
    labelRa: 180, labelDec: 60,
    paths: [
      [[206.89, 49.31], [200.98, 54.93], [193.51, 55.96],
       [183.86, 57.03], [178.46, 53.69], [165.46, 56.38], [165.93, 61.75]],  // handle+bowl
      [[165.93, 61.75], [183.86, 57.03]],                     // close bowl top
    ],
  },
  {
    name: 'Ursa Minor',
    labelRa: 230, labelDec: 80,
    paths: [
      [[37.95, 89.26], [247.73, 86.59], [248.0, 82.03],       // handle
       [230.0, 77.79], [222.68, 74.16], [230.18, 71.83],      // bowl
       [247.0, 77.79], [248.0, 82.03]],                        // close bowl
    ],
  },
  {
    name: 'Cassiopeia',
    labelRa: 14, labelDec: 62,
    paths: [
      [[28.60, 63.67], [21.45, 60.24], [14.18, 60.72], [10.13, 56.54], [2.29, 59.15]],
    ],
  },
  {
    name: 'Perseus',
    labelRa: 52, labelDec: 44,
    paths: [
      [[51.08, 49.86], [47.04, 40.96], [51.08, 49.86], [58.53, 31.88]],
      [[51.08, 49.86], [63.50, 47.00]],    // toward η Per area
    ],
  },
  {
    name: 'Auriga',
    labelRa: 82, labelDec: 41,
    paths: [
      [[79.17, 46.00], [89.88, 44.95], [90.00, 37.21],
       [74.25, 33.17], [75.49, 43.82], [79.17, 46.00]],
    ],
  },
  {
    name: 'Taurus',
    labelRa: 68, labelDec: 19,
    paths: [
      [[56.87, 24.11], [65.00, 16.50], [68.98, 16.51], [84.41, 21.14]],  // Pleiades→Aldebaran→horn
      [[68.98, 16.51], [81.57, 28.61]],                                    // Aldebaran→Elnath
    ],
  },
  {
    name: 'Gemini',
    labelRa: 104, labelDec: 28,
    paths: [
      [[113.65, 31.89], [116.33, 28.03]],                      // Castor–Pollux heads
      [[113.65, 31.89], [100.98, 25.13], [99.43, 16.40]],     // Castor body → Alhena foot
      [[116.33, 28.03], [100.98, 25.13], [95.74, 22.51]],     // Pollux body → Tejat foot
    ],
  },
  {
    name: 'Leo',
    labelRa: 165, labelDec: 19,
    paths: [
      [[148.19, 26.01], [154.17, 23.42], [154.99, 19.84], [152.09, 11.97]],  // Sickle
      [[152.09, 11.97], [165.00, 14.00], [168.53, 20.52], [177.26, 14.57]],  // body → Denebola
    ],
  },
  {
    name: 'Virgo',
    labelRa: 193, labelDec: 4,
    paths: [
      [[195.54, 10.96], [190.41, -1.45], [201.30, -11.16]],
      [[190.41, -1.45], [183.00, 3.00]],   // arm toward Vindemiatrix area
    ],
  },
  {
    name: 'Libra',
    labelRa: 226, labelDec: -13,
    paths: [
      [[222.72, -16.04], [229.25, -9.38], [237.00, -14.00], [222.72, -16.04]],
    ],
  },
  {
    name: 'Scorpius',
    labelRa: 252, labelDec: -28,
    paths: [
      [[239.22, -26.11], [240.08, -22.62], [241.36, -19.81]],  // claws
      [[240.08, -22.62], [247.35, -26.43], [252.97, -34.29],   // body
       [264.40, -43.00], [265.62, -39.03], [264.33, -37.10],   // tail
       [263.40, -37.30]],                                        // stinger
    ],
  },
  {
    name: 'Sagittarius',
    labelRa: 280, labelDec: -27,
    paths: [
      // Teapot body
      [[271.45, -30.42], [275.25, -29.83], [276.04, -34.38],
       [285.65, -29.88], [283.82, -26.30], [274.41, -25.42], [275.25, -29.83]],
      [[274.41, -25.42], [271.45, -30.42]],  // spout connection
      [[269.76, -26.99], [271.45, -30.42]], // spout tip
      [[283.82, -26.30], [286.73, -27.67]], // handle
    ],
  },
  {
    name: 'Capricorn',
    labelRa: 316, labelDec: -14,
    paths: [
      [[305.25, -14.78], [309.00, -17.00], [315.00, -15.00],
       [326.76, -16.13], [322.00, -18.00], [310.00, -21.00], [305.25, -14.78]],
    ],
  },
  {
    name: 'Aquarius',
    labelRa: 334, labelDec: -5,
    paths: [
      [[322.89, -5.57], [331.45, -0.32], [337.00, -1.00]],
      [[331.45, -0.32], [330.00, -10.00], [344.00, -18.00]],
      [[334.00, -12.00], [320.00, -16.00]],
    ],
  },
  {
    name: 'Pisces',
    labelRa: 20, labelDec: 12,
    paths: [
      [[22.88, 15.35], [15.00, 9.00], [8.00, 3.00], [30.51, 2.76], [22.00, 6.00]],  // approximate
    ],
  },
  {
    name: 'Aries',
    labelRa: 30, labelDec: 25,
    paths: [
      [[31.79, 23.46], [28.66, 20.81], [30.00, 16.00]],
    ],
  },
  {
    name: 'Andromeda',
    labelRa: 18, labelDec: 34,
    paths: [
      [[2.10, 29.09], [17.43, 35.62], [30.97, 42.33]],
      [[17.43, 35.62], [23.30, 30.86]],
    ],
  },
  {
    name: 'Pegasus',
    labelRa: 344, labelDec: 22,
    paths: [
      [[346.19, 15.21], [345.94, 28.08], [2.10, 29.09], [3.31, 15.18], [346.19, 15.21]],  // Great Square
      [[346.19, 15.21], [326.05, 9.87]],  // Markab → Enif (nose)
    ],
  },
  {
    name: 'Cygnus',
    labelRa: 304, labelDec: 43,
    paths: [
      [[310.36, 45.28], [305.56, 40.26], [292.68, 27.96]],  // vertical bar (Deneb–Sadr–Albireo)
      [[296.24, 45.13], [305.56, 40.26], [311.55, 33.97]],  // horizontal bar (δ–Sadr–ε)
    ],
  },
  {
    name: 'Aquila',
    labelRa: 297, labelDec: 12,
    paths: [
      [[296.56, 10.61], [297.70, 8.87], [298.83, 6.41]],    // Tarazed–Altair–Alshain
      [[298.13, 13.86], [297.70, 8.87], [294.00, 4.00]],    // wing tips
    ],
  },
  {
    name: 'Lyra',
    labelRa: 282, labelDec: 36,
    paths: [
      [[279.23, 38.78], [282.52, 33.36]],
      [[279.23, 38.78], [284.74, 32.69]],
      [[282.52, 33.36], [284.74, 32.69]],
    ],
  },
  {
    name: 'Boötes',
    labelRa: 220, labelDec: 30,
    paths: [
      [[213.92, 19.18], [218.88, 18.40], [221.25, 27.07], [222.68, 38.31], [225.49, 40.39]],
      [[218.88, 18.40], [221.25, 27.07]],
    ],
  },
  {
    name: 'Hercules',
    labelRa: 256, labelDec: 28,
    paths: [
      [[247.55, 21.49], [250.72, 31.60], [258.76, 24.84], [247.55, 21.49]],  // Keystone approx
      [[250.72, 31.60], [256.70, 30.93], [258.66, 14.39]],                   // body
    ],
  },
  {
    name: 'Ophiuchus',
    labelRa: 260, labelDec: 4,
    paths: [
      [[263.73, 12.56], [257.59, -15.72], [249.29, -10.57], [243.59, -3.69], [263.73, 12.56]],
    ],
  },
  {
    name: 'Corvus',
    labelRa: 187, labelDec: -19,
    paths: [
      [[183.79, -17.54], [187.47, -16.52], [188.02, -23.40],
       [184.85, -22.62], [183.79, -17.54]],
    ],
  },
  {
    name: 'Centaurus',
    labelRa: 213, labelDec: -50,
    paths: [
      [[211.67, -36.37], [210.96, -60.37], [219.90, -60.83]],
      [[210.96, -60.37], [206.00, -55.00], [211.67, -36.37]],
    ],
  },
  {
    name: 'Crux',
    labelRa: 187, labelDec: -59,
    paths: [
      [[187.79, -57.11], [186.65, -63.10]],  // vertical
      [[183.79, -58.75], [191.93, -59.69]],  // horizontal
    ],
  },
  {
    name: 'Lupus',
    labelRa: 223, labelDec: -45,
    paths: [
      [[220.48, -47.39], [224.63, -43.13], [222.22, -52.10], [220.48, -47.39]],
    ],
  },
  {
    name: 'Grus',
    labelRa: 332, labelDec: -43,
    paths: [
      [[328.48, -37.36], [332.06, -46.96], [340.67, -46.88]],
    ],
  },
]

/**
 * Named bright stars for hover/label overlay.
 * [ra_deg, dec_deg, commonName]
 */
export const NAMED_BRIGHT_STARS: [number, number, string][] = [
  [101.29, -16.72, 'Sirius'],
  [95.99,  -52.70, 'Canopus'],
  [219.90, -60.83, 'Rigil Kentaurus'],
  [213.92,  19.18, 'Arcturus'],
  [279.23,  38.78, 'Vega'],
  [79.17,   46.00, 'Capella'],
  [78.63,   -8.20, 'Rigel'],
  [114.83,   5.22, 'Procyon'],
  [88.79,    7.41, 'Betelgeuse'],
  [24.43,  -57.24, 'Achernar'],
  [210.96, -60.37, 'Hadar'],
  [297.70,   8.87, 'Altair'],
  [186.65, -63.10, 'Acrux'],
  [68.98,   16.51, 'Aldebaran'],
  [201.30, -11.16, 'Spica'],
  [247.35, -26.43, 'Antares'],
  [116.33,  28.03, 'Pollux'],
  [344.41, -29.62, 'Fomalhaut'],
  [310.36,  45.28, 'Deneb'],
  [191.93, -59.69, 'Mimosa'],
  [152.09,  11.97, 'Regulus'],
  [104.66, -28.97, 'Adhara'],
  [113.65,  31.89, 'Castor'],
  [264.33, -37.10, 'Shaula'],
  [187.79, -57.11, 'Gacrux'],
  [81.28,    6.35, 'Bellatrix'],
  [81.57,   28.61, 'Elnath'],
  [84.05,   -1.20, 'Alnilam'],
  [85.19,   -1.94, 'Alnitak'],
  [83.00,   -0.30, 'Mintaka'],
  [86.94,   -9.67, 'Saiph'],
  [193.51,  55.96, 'Alioth'],
  [206.89,  49.31, 'Alkaid'],
  [165.93,  61.75, 'Dubhe'],
  [200.98,  54.93, 'Mizar'],
  [51.08,   49.86, 'Mirfak'],
  [276.04, -34.38, 'Kaus Australis'],
  [283.82, -26.30, 'Nunki'],
  [306.41, -56.73, 'Peacock'],
  [332.06, -46.96, 'Alnair'],
  [141.90,  -8.66, 'Alphard'],
  [37.95,   89.26, 'Polaris'],
  [222.68,  74.16, 'Kochab'],
  [233.67,  26.71, 'Alphecca'],
  [31.79,   23.46, 'Hamal'],
  [10.13,   56.54, 'Schedar'],
  [2.29,    59.15, 'Caph'],
  [2.10,    29.09, 'Alpheratz'],
  [17.43,   35.62, 'Mirach'],
  [30.97,   42.33, 'Almach'],
  [252.17, -69.03, 'Atria'],
  [138.30, -69.72, 'Miaplacidus'],
  [122.38, -47.34, 'Regor'],
]
