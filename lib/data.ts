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

// April 2026 — data pulled 04/29/2026 (BD21 complete)
// Business days: Apr 1,2,3,6,7,8,9,10,13,14,15,16,17,20,21,22,23,24,27,28,29 = 21 complete
export const PERIOD_INFO = {
  label:          'April 2026',
  dataAsOf:       'April 29',   // Date of last data pull — update with each refresh
  totalBizDays:   22,           // All weekdays Apr 1–30 (Good Friday Apr 3 = working day)
  daysComplete:   21,
  daysRemaining:  1,
}

// ─── Live Data — Sources: Dentrix + Mango Voice + Dental Intel OSB ───
// Production (org gross): ProviderTotals (13) Procedure Charges 04/01–04/29 Ascend $2,384,907 + Dental Intel OSB providers-performance 04/29 $145,693
// Production (per location): NET from Production/Collection Summary (11) 04/01–04/29
// Collections: EXACT from Production/Collection Summary (11) 04/01–04/29 + Dental Intel OSB operations-performance 04/29
// Phones: Mango Voice 04/01–04/29 — ALL 7 locations confirmed from screenshots
// New Patients: New Patients (13) Dentrix 04/01–04/29 + Dental Intel OSB operations-performance 04/29
// Recare: OSB only (92.7% from DI) — Ascend recare not in current export set; shown as — in UI
// arToProdRatio = org AR / projected full-month gross (Ascend ProviderTotals gross × 22/21)
export const DEMO_DATA = {
  period: 'April 2026',
  org: {
    production:      2530600,  // $2,384,907 Ascend ProviderTotals (13) gross + $145,693 OSB (DI 04/29)
    productionGoal:  2400000,
    collections:     1270435,  // $1,091,552 Ascend Prod/Coll Summary (11) exact + $178,883 OSB (DI 04/29)
    collectionsGoal: 1320000,
    newPatients:        631,   // LKW:132 LT:60 HNR:99 HNS:65 PB:118 PR:95 OSB:62
    activePatients:    2531,
    phoneAnswerRate:   68.8,   // Mango Voice 04/01–04/29 — all 7 locations confirmed from screenshots
    hygieneRecare:      0,     // No verified Ascend recare report — not displayed
  },

  // Collections: EXACT per location from Prod/Coll Summary (11)
  // Production: NET from Prod/Coll Summary (11) — after write-offs/adjustments
  // Note: LT/HNR/PB collectionRate >100% = collecting on prior-month AR (expected)
  // recareRate: 0 = no verified data; UI shows "—". OSB only from DI operations-performance.
  locations: [
    { code:'LKW', production:401965, collections:325359, collectionRate:80.9,  newPatients:132, recareRate:0,    phoneAnswerRate:70.5, activePatients:534, suppliesPct:5.76, status:'on_pace'  },
    { code:'LT',  production:162644, collections:180670, collectionRate:111.1, newPatients:60,  recareRate:0,    phoneAnswerRate:76.4, activePatients:421, suppliesPct:5.38, status:'watch'    },
    { code:'HNR', production:100879, collections:109563, collectionRate:108.6, newPatients:99,  recareRate:0,    phoneAnswerRate:68.5, activePatients:298, suppliesPct:6.92, status:'on_pace'  },
    { code:'HNS', production:88357,  collections:55237,  collectionRate:62.5,  newPatients:65,  recareRate:0,    phoneAnswerRate:64.5, activePatients:276, suppliesPct:3.62, status:'on_pace'  },
    { code:'PB',  production:260157, collections:276367, collectionRate:106.2, newPatients:118, recareRate:0,    phoneAnswerRate:60.4, activePatients:389, suppliesPct:6.77, status:'on_pace'  },
    { code:'PR',  production:201631, collections:144356, collectionRate:71.6,  newPatients:95,  recareRate:0,    phoneAnswerRate:68.2, activePatients:321, suppliesPct:10.58,status:'on_pace'  },
    { code:'OSB', production:109100, collections:178883, collectionRate:163.9, newPatients:62,  recareRate:92.7, phoneAnswerRate:73.1, activePatients:292, suppliesPct:2.09, status:'watch',   isOSB:true },
  ],

  // Source: Dentrix ProviderTotals (13) 04/01–04/29/2026 + Dental Intel OSB providers-performance 04/29
  // Gross = Procedure Charges column; daysWorked = 21 (BD21 complete Apr 29)
  doctors: [
    { name:'Nichols, Christopher', locationCode:'LKW', grossProd:338741, collections:157364, collRate:46.5, prodPerDay:16131, daysWorked:21, ytdProd:1366000 },
    { name:'Proctor, Sarah',       locationCode:'PB',  grossProd:312943, collections:158837, collRate:50.8, prodPerDay:14902, daysWorked:21, ytdProd:976000  },
    { name:'Weathers, L\'Cris',    locationCode:'PR',  grossProd:289062, collections:96467,  collRate:33.4, prodPerDay:13765, daysWorked:21, ytdProd:818000  },
    { name:'Connolly, Noah',       locationCode:'HNS', grossProd:212647, collections:78145,  collRate:36.8, prodPerDay:10126, daysWorked:21, ytdProd:570000  },
    { name:'Ballard, Erin',        locationCode:'PB',  grossProd:204210, collections:78697,  collRate:38.5, prodPerDay:9724,  daysWorked:21, ytdProd:570000  },
    { name:'Nichols, Patrick',     locationCode:'LT',  grossProd:150480, collections:93920,  collRate:62.4, prodPerDay:7165,  daysWorked:21, ytdProd:502000  },
    { name:'Walters, Carrie',      locationCode:'LKW', grossProd:141019, collections:58284,  collRate:41.3, prodPerDay:6715,  daysWorked:21, ytdProd:413000  },
    { name:'Skaggs, Ernest',       locationCode:'HNR', grossProd:94194,  collections:44477,  collRate:47.2, prodPerDay:4485,  daysWorked:21, ytdProd:120000  },
    { name:'Osbourne, Brian',      locationCode:'OSB', grossProd:91054,  collections:109450, collRate:120.2,prodPerDay:4336,  daysWorked:21, ytdProd:170000,  isOSB:true },
    { name:'Gleason, Robert',      locationCode:'LKW', grossProd:74194,  collections:38886,  collRate:52.4, prodPerDay:3533,  daysWorked:21, ytdProd:389000  },
    { name:'Decker Haycraft, Kara',locationCode:'LT',  grossProd:67428,  collections:33466,  collRate:49.6, prodPerDay:3211,  daysWorked:21, ytdProd:154000  },
    { name:'Chadwick, Evan',       locationCode:'PR',  grossProd:64161,  collections:31919,  collRate:49.8, prodPerDay:3055,  daysWorked:21, ytdProd:164000  },
  ],

  // Source: Dentrix ProviderTotals (13) + Time Clock 04/01–04/29/2026
  // OSB: Dental Intel providers-performance 04/29 — hours estimated (no Ascend time clock)
  // recareRate: 0 = no verified data for Ascend locations; OSB from DI operations-performance
  hygienists: [
    // ── LKW ──
    { name:'Howell, Dana',     locationCode:'LKW', grossProd:25991, collections:12010, collRate:46.2, hoursWorked:153.32,prodPerHr:170, recareRate:0 },
    { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:24081, collections:11429, collRate:47.5, hoursWorked:152.26,prodPerHr:158, recareRate:0 },
    { name:'Woosley, Emily',   locationCode:'LKW', grossProd:18737, collections:9320,  collRate:49.7, hoursWorked:142.26,prodPerHr:132, recareRate:0 },
    { name:'Payne, McKay',     locationCode:'LKW', grossProd:18132, collections:7848,  collRate:43.3, hoursWorked:124.83,prodPerHr:145, recareRate:0 },
    { name:'Berry, Tasha',     locationCode:'LKW', grossProd:15982, collections:7513,  collRate:47.0, hoursWorked:116.75,prodPerHr:137, recareRate:0 },
    { name:'Blandford, Cassi', locationCode:'LKW', grossProd:15177, collections:8520,  collRate:56.1, hoursWorked:111.62,prodPerHr:136, recareRate:0 },
    { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:15203, collections:8530,  collRate:56.1, hoursWorked:146.64,prodPerHr:104, recareRate:0 },
    { name:'Youart, Britney',  locationCode:'LKW', grossProd:13538, collections:5212,  collRate:38.5, hoursWorked:69.53, prodPerHr:195, recareRate:0 },
    { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:11880, collections:7761,  collRate:65.3, hoursWorked:79.51, prodPerHr:149, recareRate:0 },
    { name:'Vowels, Susan',    locationCode:'LKW', grossProd:11245, collections:5924,  collRate:52.7, hoursWorked:86.90, prodPerHr:129, recareRate:0 },
    { name:'Bewley, Emma',     locationCode:'LKW', grossProd:5122,  collections:3922,  collRate:76.6, hoursWorked:36.82, prodPerHr:139, recareRate:0 },
    // ── LT ──
    { name:'Logsdon, Megan',   locationCode:'LT',  grossProd:22952, collections:9837,  collRate:42.9, hoursWorked:150.23,prodPerHr:153, recareRate:0 },
    { name:'Morris, Amber',    locationCode:'LT',  grossProd:21403, collections:15140, collRate:70.7, hoursWorked:153.81,prodPerHr:139, recareRate:0 },
    { name:'Harned, Stacy',    locationCode:'LT',  grossProd:11430, collections:6979,  collRate:61.1, hoursWorked:84.26, prodPerHr:136, recareRate:0 },
    { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:9686,  collections:5748,  collRate:59.4, hoursWorked:60.54, prodPerHr:160, recareRate:0 },
    // ── PR (Proctor Radcliff) ──
    { name:'Jones, Chad',      locationCode:'PR',  grossProd:53515, collections:19686, collRate:36.8, hoursWorked:121.19,prodPerHr:442, recareRate:0 },
    { name:'Wires, Tanya',     locationCode:'PR',  grossProd:31285, collections:12603, collRate:40.3, hoursWorked:133.37,prodPerHr:235, recareRate:0 },
    { name:'Lynch, Cassie',    locationCode:'PR',  grossProd:23842, collections:12789, collRate:53.6, hoursWorked:133.59,prodPerHr:179, recareRate:0 },
    // ── PB (Proctor Bardstown) ──
    { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:47729, collections:15497, collRate:32.5, hoursWorked:145.97,prodPerHr:327, recareRate:0 },
    { name:'Kittle, Jolena',   locationCode:'PB',  grossProd:13175, collections:7768,  collRate:59.0, hoursWorked:92.10, prodPerHr:143, recareRate:0 },
    // ── HNS (H&N Shepherdsville) ──
    { name:'Logsdon, Megan',   locationCode:'HNS', grossProd:0,     collections:0,     collRate:0,    hoursWorked:0,     prodPerHr:0,   recareRate:0 },
    // ── OSB (Dental Intel — manual source, 04/29) ──
    { name:'Haydon, Kelsey',   locationCode:'OSB', grossProd:11254, collections:11293, collRate:100.3,hoursWorked:97.0,  prodPerHr:116, recareRate:92.7, isOSB:true },
    { name:'Culver, Angela',   locationCode:'OSB', grossProd:9981,  collections:9889,  collRate:99.1, hoursWorked:97.0,  prodPerHr:103, recareRate:92.7, isOSB:true },
    { name:'Ulrich, Leigh',    locationCode:'OSB', grossProd:10611, collections:9882,  collRate:93.1, hoursWorked:97.0,  prodPerHr:109, recareRate:92.7, isOSB:true },
    { name:'Greenwell, Denise',locationCode:'OSB', grossProd:6458,  collections:4971,  collRate:77.0, hoursWorked:49.0,  prodPerHr:132, recareRate:92.7, isOSB:true },
    { name:'Yates, Jaclyn',    locationCode:'OSB', grossProd:5314,  collections:7169,  collRate:134.9,hoursWorked:39.0,  prodPerHr:136, recareRate:92.7, isOSB:true },
  ],

  // Source: Mango Voice 04/01–04/29/2026 — ALL 7 locations confirmed from screenshots
  // PB/PR note: "External" calls (36.6%/30.4%) counted as missed — routed externally, not answered in-office
  phones: [
    { code:'LKW', totalCalls:2068, answered:1458, missed:610, answerRate:70.5, estMissedRevenue:107970 },
    { code:'LT',  totalCalls:986,  answered:753,  missed:233, answerRate:76.4, estMissedRevenue:41241  },
    { code:'HNR', totalCalls:981,  answered:672,  missed:309, answerRate:68.5, estMissedRevenue:54693  },
    { code:'HNS', totalCalls:546,  answered:352,  missed:194, answerRate:64.5, estMissedRevenue:34338  },
    { code:'PB',  totalCalls:1500, answered:906,  missed:594, answerRate:60.4, estMissedRevenue:105138 },
    { code:'PR',  totalCalls:1189, answered:811,  missed:378, answerRate:68.2, estMissedRevenue:66906  },
    { code:'OSB', totalCalls:1139, answered:833,  missed:306, answerRate:73.1, estMissedRevenue:54162  },
  ],

  // Source: Dentrix AgedReceivables (13) 04/29/2026 + Dental Intel OSB ar-overview 04/29
  // Totals = gross AR before unapplied credits; insuranceAR/patientAR from location sections
  // arToProdRatio = org AR / projected full-month gross (Ascend ProviderTotals gross × 22/21)
  // arToProd per location = loc AR / projected full-month net (Prod/Coll Summary net × 22/21)
  ar: {
    asOf: '04/29/2026',
    healthScore: 49,
    total: 2180032,   // Ascend $1,986,616 + OSB $193,416
    buckets: { d0_30: 1337481, d31_60: 436045, d61_90: 182305, d90plus: 224201 },
    pcts:    { d0_30: 61.4,    d31_60: 20.0,   d61_90: 8.4,    d90plus: 10.3  },
    arToProdRatio: 0.87,
    locations: [
      { code:'LKW', total:724292,  d0_30:317996, d31_60:195869, d61_90:98273,  d90plus:112154, pct0_30:43.9, pct31_60:27.0, pct61_90:13.6, pct90plus:15.5, insuranceAR:224165, patientAR:354127, patientPct:49, arToProd:1.72, status:'needs_work' },
      { code:'LT',  total:243097,  d0_30:157240, d31_60:35325,  d61_90:25751,  d90plus:24781,  pct0_30:64.7, pct31_60:14.5, pct61_90:10.6, pct90plus:10.2, insuranceAR:98624,  patientAR:42655,  patientPct:18, arToProd:1.43, status:'needs_work' },
      { code:'HNR', total:211108,  d0_30:142906, d31_60:28705,  d61_90:11126,  d90plus:28372,  pct0_30:67.7, pct31_60:13.6, pct61_90:5.3,  pct90plus:13.4, insuranceAR:86173,  patientAR:67479,  patientPct:32, arToProd:2.00, status:'needs_work' },
      { code:'HNS', total:81148,   d0_30:69036,  d31_60:8083,   d61_90:861,    d90plus:3168,   pct0_30:85.1, pct31_60:10.0, pct61_90:1.1,  pct90plus:3.9,  insuranceAR:33734,  patientAR:13688,  patientPct:17, arToProd:0.88, status:'good'      },
      { code:'PB',  total:312786,  d0_30:258576, d31_60:33237,  d61_90:11589,  d90plus:9384,   pct0_30:82.7, pct31_60:10.6, pct61_90:3.7,  pct90plus:3.0,  insuranceAR:134401, patientAR:46993,  patientPct:15, arToProd:1.15, status:'good'      },
      { code:'PR',  total:414184,  d0_30:241418, d31_60:115763, d61_90:24661,  d90plus:32341,  pct0_30:58.3, pct31_60:28.0, pct61_90:6.0,  pct90plus:7.8,  insuranceAR:148195, patientAR:222550, patientPct:54, arToProd:1.96, status:'watch'     },
      { code:'OSB', total:193416,  d0_30:150308, d31_60:19063,  d61_90:10045,  d90plus:14001,  pct0_30:77.7, pct31_60:9.9,  pct61_90:5.2,  pct90plus:7.2,  insuranceAR:119833, patientAR:73584,  patientPct:38, arToProd:1.69, status:'watch',    isOSB:true },
    ],
  },
}
