export const LOCATIONS = [
  { code: 'LKW', name: 'H&N Lakewood',        brand: 'Harvey & Nichols', isOSB: false },
  { code: 'LT',  name: 'H&N Lincoln Trail',   brand: 'Harvey & Nichols', isOSB: false },
  { code: 'HNR', name: 'H&N Radcliff',        brand: 'Harvey & Nichols', isOSB: false },
  { code: 'HNS', name: 'H&N Shepherdsville',  brand: 'Harvey & Nichols', isOSB: false },
  { code: 'PB',  name: 'Proctor Bardstown',   brand: 'Proctor Family',   isOSB: false },
  { code: 'PR',  name: 'Proctor Radcliff',    brand: 'Proctor Family',   isOSB: false },
  { code: 'OSB', name: 'Osbourne Family',     brand: 'Osbourne',         isOSB: true  },
]

// Bonus race collection goals (100% = $1,000 bonus tier)
export const MONTHLY_GOALS: Record<string, number> = {
  LKW: 335000, LT: 210000, HNR: 90000, HNS: 60000, PB: 275000, PR: 140000, OSB: 210000,
}

export const BENCHMARKS = {
  NOI:               { target: 22.5, flagBelow: 18 },
  supplies_pct:      { target: 5.5,  flagAbove: 6.5 },
  lab_pct:           { target: 7.5,  flagAbove: 8.5 },
  payroll_pct:       { target: 27,   flagAbove: 30 },
  hygiene_recare:    { target: 85,   flagBelow: 80 },
  phone_answer_rate: { target: 80,   flagBelow: 70 },
  collections_rate:  { target: 98,   flagBelow: 95 },
  chair_utilization: { target: 85,   flagBelow: 75 },
}

// April 2026 — data pulled 04/22/2026 (BD16 complete)
// Business days: Apr 1,2,3,6,7,8,9,10,13,14,15,16,17,20,21,22 = 16 complete
export const PERIOD_INFO = {
  label:          'April 2026',
  dataAsOf:       'April 22',   // Date of last data pull — update with each refresh
  totalBizDays:   22,           // All weekdays Apr 1–30 (Good Friday Apr 3 = working day)
  daysComplete:   16,
  daysRemaining:  6,
}

// ─── Live Data — Sources: Dentrix + Mango Voice + Dental Intel OSB ───
// Production (org gross): ProviderTotals (8) Procedure Charges 04/01–04/22 Ascend + Dental Intel OSB providers-performance 04/23
// Production (per location): NET from Production/Collection Summary (6) 04/01–04/22
// Collections: EXACT from Production/Collection Summary (6) 04/01–04/22 + Dental Intel OSB ar-overview 04/23
// Phones: Mango Voice 04/01–04/20 — no new pull (unchanged)
// New Patients: New Patients (8) Dentrix 04/01–04/22 + Dental Intel OSB operations-performance 04/23
// Recare: OSB only (92% from DI) — Ascend recare not in current export set; shown as — in UI
export const DEMO_DATA = {
  period: 'April 2026',
  org: {
    production:      1893912,  // $1,787,465 Ascend ProviderTotals (8) gross + $106,447 OSB
    productionGoal:  2400000,
    collections:      979340,  // $843,818 Ascend Prod/Coll Summary (6) exact + $135,522 OSB
    collectionsGoal: 1320000,
    newPatients:        454,   // LKW:93 LT:47 HNR:70 HNS:48 PB:77 PR:73 OSB:46
    activePatients:    2531,
    phoneAnswerRate:   66.2,   // Mango Voice 04/01–04/20 — unchanged (no new pull)
    hygieneRecare:      0,     // No verified Ascend recare report — not displayed
  },

  // Collections: EXACT per location from Prod/Coll Summary (6)
  // Production: NET from Prod/Coll Summary (6) — after write-offs/adjustments
  // Note: HNR/HNS/PB/PR/OSB collectionRate >100% = collecting on prior-month AR (expected)
  // recareRate: 0 = no verified data; UI shows "—". OSB only from DI operations-performance.
  locations: [
    { code:'LKW', production:329727, collections:229779, collectionRate:69.7,  newPatients:93, recareRate:0,    phoneAnswerRate:63.7, activePatients:534, suppliesPct:5.76, status:'on_pace'  },
    { code:'LT',  production:154645, collections:137440, collectionRate:88.9,  newPatients:47, recareRate:0,    phoneAnswerRate:73.7, activePatients:421, suppliesPct:5.38, status:'watch'    },
    { code:'HNR', production:72532,  collections:84435,  collectionRate:116.4, newPatients:70, recareRate:0,    phoneAnswerRate:66.1, activePatients:298, suppliesPct:6.92, status:'on_pace'  },
    { code:'HNS', production:54171,  collections:47346,  collectionRate:87.4,  newPatients:48, recareRate:0,    phoneAnswerRate:65.0, activePatients:276, suppliesPct:3.62, status:'on_pace'  },
    { code:'PB',  production:207215, collections:228334, collectionRate:110.2, newPatients:77, recareRate:0,    phoneAnswerRate:61.8, activePatients:389, suppliesPct:6.77, status:'on_pace'  },
    { code:'PR',  production:124289, collections:116484, collectionRate:93.7,  newPatients:73, recareRate:0,    phoneAnswerRate:68.0, activePatients:321, suppliesPct:10.58,status:'on_pace'  },
    { code:'OSB', production:76353,  collections:135522, collectionRate:177.5, newPatients:46, recareRate:92.0, phoneAnswerRate:68.7, activePatients:292, suppliesPct:2.09, status:'watch',   isOSB:true },
  ],

  // Source: Dentrix ProviderTotals (8) 04/01–04/22/2026 + Dental Intel OSB providers-performance 04/23
  // Gross = Procedure Charges column; daysWorked = 16 (BD16 complete Apr 22)
  doctors: [
    { name:'Nichols, Christopher', locationCode:'LKW', grossProd:275511, collections:109666, collRate:39.8, prodPerDay:17219, daysWorked:16, ytdProd:1350000 },
    { name:'Proctor, Sarah',       locationCode:'PB',  grossProd:233373, collections:128303, collRate:55.0, prodPerDay:14586, daysWorked:16, ytdProd:930000  },
    { name:'Weathers, L\'Cris',    locationCode:'PR',  grossProd:203133, collections:76952,  collRate:37.9, prodPerDay:12696, daysWorked:16, ytdProd:780000  },
    { name:'Ballard, Erin',        locationCode:'PB',  grossProd:161810, collections:68389,  collRate:42.3, prodPerDay:10113, daysWorked:16, ytdProd:550000  },
    { name:'Connolly, Noah',       locationCode:'HNS', grossProd:154650, collections:64421,  collRate:41.7, prodPerDay:9666,  daysWorked:16, ytdProd:545000  },
    { name:'Nichols, Patrick',     locationCode:'LT',  grossProd:123021, collections:71325,  collRate:58.0, prodPerDay:7689,  daysWorked:16, ytdProd:495000  },
    { name:'Walters, Carrie',      locationCode:'LKW', grossProd:101230, collections:44329,  collRate:43.8, prodPerDay:6327,  daysWorked:16, ytdProd:400000  },
    { name:'Skaggs, Ernest',       locationCode:'HNR', grossProd:68752,  collections:30804,  collRate:44.8, prodPerDay:4297,  daysWorked:16, ytdProd:110000  },
    { name:'Osbourne, Brian',      locationCode:'OSB', grossProd:66011,  collections:84177,  collRate:127.5,prodPerDay:4126,  daysWorked:16, ytdProd:155000, isOSB:true },
    { name:'Decker Haycraft, Kara',locationCode:'LT',  grossProd:59767,  collections:26836,  collRate:44.9, prodPerDay:3735,  daysWorked:16, ytdProd:150000  },
    { name:'Gleason, Robert',      locationCode:'LKW', grossProd:54164,  collections:31294,  collRate:57.8, prodPerDay:3385,  daysWorked:16, ytdProd:378000  },
    { name:'Chadwick, Evan',       locationCode:'PR',  grossProd:50518,  collections:22887,  collRate:45.3, prodPerDay:3157,  daysWorked:16, ytdProd:150000  },
  ],

  // Source: Dentrix ProviderTotals (8) + Time Clock 04/01–04/22/2026
  // OSB: Dental Intel providers-performance 04/23 — hours estimated (no Ascend time clock)
  // recareRate: 0 = no verified data for Ascend locations; OSB from DI operations-performance
  hygienists: [
    // ── LKW ──
    { name:'Howell, Dana',     locationCode:'LKW', grossProd:20267, collections:8828,  collRate:43.6, hoursWorked:112.41,prodPerHr:180, recareRate:0 },
    { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:18789, collections:8490,  collRate:45.2, hoursWorked:116.26,prodPerHr:162, recareRate:0 },
    { name:'Woosley, Emily',   locationCode:'LKW', grossProd:14013, collections:6248,  collRate:44.6, hoursWorked:105.98,prodPerHr:132, recareRate:0 },
    { name:'Payne, McKay',     locationCode:'LKW', grossProd:13347, collections:5775,  collRate:43.3, hoursWorked:93.87, prodPerHr:142, recareRate:0 },
    { name:'Blandford, Cassi', locationCode:'LKW', grossProd:10942, collections:6208,  collRate:56.7, hoursWorked:77.35, prodPerHr:141, recareRate:0 },
    { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:10813, collections:6265,  collRate:57.9, hoursWorked:110.7, prodPerHr:98,  recareRate:0 },
    { name:'Berry, Tasha',     locationCode:'LKW', grossProd:10788, collections:5359,  collRate:49.7, hoursWorked:73.7,  prodPerHr:146, recareRate:0 },
    { name:'Vowels, Susan',    locationCode:'LKW', grossProd:8139,  collections:4124,  collRate:50.7, hoursWorked:53.32, prodPerHr:153, recareRate:0 },
    { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:7900,  collections:6192,  collRate:78.4, hoursWorked:54.89, prodPerHr:144, recareRate:0 },
    { name:'Youart, Britney',  locationCode:'LKW', grossProd:7147,  collections:3748,  collRate:52.4, hoursWorked:45.51, prodPerHr:157, recareRate:0 },
    { name:'Bewley, Emma',     locationCode:'LKW', grossProd:3004,  collections:3499,  collRate:116.5,hoursWorked:17.16, prodPerHr:175, recareRate:0 },
    // ── LT ──
    { name:'Logsdon, Megan',   locationCode:'LT',  grossProd:17036, collections:7494,  collRate:44.0, hoursWorked:113.96,prodPerHr:149, recareRate:0 },
    { name:'Morris, Amber',    locationCode:'LT',  grossProd:16079, collections:11819, collRate:73.5, hoursWorked:115.49,prodPerHr:139, recareRate:0 },
    { name:'Harned, Stacy',    locationCode:'LT',  grossProd:9184,  collections:4658,  collRate:50.7, hoursWorked:68.18, prodPerHr:135, recareRate:0 },
    { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:7779,  collections:4129,  collRate:53.1, hoursWorked:48.16, prodPerHr:162, recareRate:0 },
    // ── PR (Proctor Radcliff) ──
    { name:'Jones, Chad',      locationCode:'PR',  grossProd:38784, collections:17352, collRate:44.7, hoursWorked:87.16, prodPerHr:445, recareRate:0 },
    { name:'Wires, Tanya',     locationCode:'PR',  grossProd:24893, collections:11852, collRate:47.6, hoursWorked:97.03, prodPerHr:257, recareRate:0 },
    { name:'Lynch, Cassie',    locationCode:'PR',  grossProd:17846, collections:10884, collRate:61.0, hoursWorked:95.59, prodPerHr:187, recareRate:0 },
    // ── PB (Proctor Bardstown) ──
    { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:34040, collections:13360, collRate:39.2, hoursWorked:112.49,prodPerHr:303, recareRate:0 },
    { name:'Kittle, Jolena',   locationCode:'PB',  grossProd:10746, collections:5372,  collRate:50.0, hoursWorked:74.73, prodPerHr:144, recareRate:0 },
    // ── HNS (H&N Shepherdsville) ──
    { name:'Logsdon, Megan',   locationCode:'HNS', grossProd:0,     collections:0,     collRate:0,    hoursWorked:0,     prodPerHr:0,   recareRate:0 },
    // ── OSB (Dental Intel — manual source) ──
    { name:'Haydon, Kelsey',   locationCode:'OSB', grossProd:8423,  collections:7608,  collRate:90.3, hoursWorked:88.0,  prodPerHr:96,  recareRate:92.0, isOSB:true },
    { name:'Culver, Angela',   locationCode:'OSB', grossProd:7818,  collections:7207,  collRate:92.2, hoursWorked:88.0,  prodPerHr:89,  recareRate:92.0, isOSB:true },
    { name:'Ulrich, Leigh',    locationCode:'OSB', grossProd:7559,  collections:6907,  collRate:91.4, hoursWorked:88.0,  prodPerHr:86,  recareRate:92.0, isOSB:true },
    { name:'Greenwell, Denise',locationCode:'OSB', grossProd:4648,  collections:3483,  collRate:74.9, hoursWorked:45.0,  prodPerHr:103, recareRate:92.0, isOSB:true },
    { name:'Yates, Jaclyn',    locationCode:'OSB', grossProd:2668,  collections:6288,  collRate:235.7,hoursWorked:35.0,  prodPerHr:76,  recareRate:92.0, isOSB:true },
  ],

  // Source: Mango Voice 04/01–04/20/2026 — ALL 7 locations confirmed from screenshots
  // PB/PR note: "External" calls (35%/31%) counted as missed — routed externally, not answered in-office
  phones: [
    { code:'LKW', totalCalls:1236, answered:787, missed:449, answerRate:63.7, estMissedRevenue:79473 },
    { code:'LT',  totalCalls:604,  answered:445, missed:159, answerRate:73.7, estMissedRevenue:28143 },
    { code:'HNR', totalCalls:604,  answered:399, missed:205, answerRate:66.1, estMissedRevenue:36285 },
    { code:'HNS', totalCalls:311,  answered:202, missed:109, answerRate:65.0, estMissedRevenue:19293 },
    { code:'PB',  totalCalls:862,  answered:533, missed:329, answerRate:61.8, estMissedRevenue:58233 },
    { code:'PR',  totalCalls:672,  answered:457, missed:215, answerRate:68.0, estMissedRevenue:38055 },
    { code:'OSB', totalCalls:726,  answered:499, missed:227, answerRate:68.7, estMissedRevenue:40179 },
  ],

  // Source: Dentrix AgedReceivables (8) 04/22/2026 + Dental Intel OSB ar-overview 04/23/2026
  // Totals = gross AR before unapplied credits; insuranceAR/patientAR from location sections
  // arToProdRatio = org AR / projected full-month gross (ProviderTotals gross × 22/16)
  // arToProd per location = loc AR / projected full-month net (Prod/Coll Summary net × 22/16)
  ar: {
    asOf: '04/22/2026',
    healthScore: 48,
    total: 2154031,   // Ascend $1,957,360 + OSB $196,671
    buckets: { d0_30: 1331918, d31_60: 449742, d61_90: 159554, d90plus: 212817 },
    pcts:    { d0_30: 61.8,    d31_60: 20.9,   d61_90: 7.4,    d90plus: 9.9   },
    arToProdRatio: 0.83,
    locations: [
      { code:'LKW', total:740080,  d0_30:375104, d31_60:186784, d61_90:73257,  d90plus:104936, pct0_30:50.7, pct31_60:25.2, pct61_90:9.9,  pct90plus:14.2, insuranceAR:232829, patientAR:341481, patientPct:46, arToProd:1.63, status:'needs_work' },
      { code:'LT',  total:278348,  d0_30:169746, d31_60:68979,  d61_90:14312,  d90plus:25311,  pct0_30:61.0, pct31_60:24.8, pct61_90:5.1,  pct90plus:9.1,  insuranceAR:111713, patientAR:44519,  patientPct:16, arToProd:1.31, status:'watch'     },
      { code:'HNR', total:207866,  d0_30:127551, d31_60:36808,  d61_90:14402,  d90plus:29105,  pct0_30:61.4, pct31_60:17.7, pct61_90:6.9,  pct90plus:14.0, insuranceAR:87147,  patientAR:65204,  patientPct:31, arToProd:2.08, status:'needs_work' },
      { code:'HNS', total:55330,   d0_30:42131,  d31_60:8305,   d61_90:767,    d90plus:4126,   pct0_30:76.1, pct31_60:15.0, pct61_90:1.4,  pct90plus:7.5,  insuranceAR:24824,  patientAR:13426,  patientPct:24, arToProd:0.74, status:'watch'     },
      { code:'PB',  total:308328,  d0_30:253425, d31_60:25775,  d61_90:20161,  d90plus:8967,   pct0_30:82.2, pct31_60:8.4,  pct61_90:6.5,  pct90plus:2.9,  insuranceAR:135362, patientAR:48897,  patientPct:16, arToProd:1.08, status:'good'      },
      { code:'PR',  total:367410,  d0_30:206606, d31_60:108152, d61_90:25838,  d90plus:26813,  pct0_30:56.2, pct31_60:29.4, pct61_90:7.0,  pct90plus:7.3,  insuranceAR:130825, patientAR:198931, patientPct:54, arToProd:2.15, status:'watch'     },
      { code:'OSB', total:196671,  d0_30:157355, d31_60:14939,  d61_90:10817,  d90plus:13560,  pct0_30:80.0, pct31_60:7.6,  pct61_90:5.5,  pct90plus:6.9,  insuranceAR:128998, patientAR:67674,  patientPct:34, arToProd:1.87, status:'watch',    isOSB:true },
    ],
  },
}
