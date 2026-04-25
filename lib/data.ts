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

// April 2026 — data pulled 04/24/2026 (BD18 complete)
// Business days: Apr 1,2,3,6,7,8,9,10,13,14,15,16,17,20,21,22,23,24 = 18 complete
export const PERIOD_INFO = {
  label:          'April 2026',
  dataAsOf:       'April 24',   // Date of last data pull — update with each refresh
  totalBizDays:   22,           // All weekdays Apr 1–30 (Good Friday Apr 3 = working day)
  daysComplete:   18,
  daysRemaining:  4,
}

// ─── Live Data — Sources: Dentrix + Mango Voice + Dental Intel OSB ───
// Production (org gross): ProviderTotals (10) Procedure Charges 04/01–04/24 Ascend + Dental Intel OSB providers-performance 04/24
// Production (per location): NET from Production/Collection Summary (8) 04/01–04/24
// Collections: EXACT from Production/Collection Summary (8) 04/01–04/24 + Dental Intel OSB ar-overview 04/24
// Phones: Mango Voice 04/01–04/20 — no new pull (unchanged)
// New Patients: New Patients (10) Dentrix 04/01–04/24 + Dental Intel OSB operations-performance 04/24
// Recare: OSB only (92.7% from DI) — Ascend recare not in current export set; shown as — in UI
export const DEMO_DATA = {
  period: 'April 2026',
  org: {
    production:      2065735,  // $1,942,379 Ascend ProviderTotals (10) gross + $123,356 OSB
    productionGoal:  2400000,
    collections:     1030377,  // $881,121 Ascend Prod/Coll Summary (8) exact + $149,256 OSB
    collectionsGoal: 1320000,
    newPatients:        500,   // LKW:102 LT:49 HNR:85 HNS:54 PB:83 PR:79 OSB:48
    activePatients:    2531,
    phoneAnswerRate:   66.2,   // Mango Voice 04/01–04/20 — unchanged (no new pull)
    hygieneRecare:      0,     // No verified Ascend recare report — not displayed
  },

  // Collections: EXACT per location from Prod/Coll Summary (8)
  // Production: NET from Prod/Coll Summary (8) — after write-offs/adjustments
  // Note: HNR/PB/OSB collectionRate >100% = collecting on prior-month AR (expected)
  // recareRate: 0 = no verified data; UI shows "—". OSB only from DI operations-performance.
  locations: [
    { code:'LKW', production:351065, collections:237052, collectionRate:67.5,  newPatients:102, recareRate:0,    phoneAnswerRate:63.7, activePatients:534, suppliesPct:5.76, status:'on_pace'  },
    { code:'LT',  production:175505, collections:141304, collectionRate:80.5,  newPatients:49,  recareRate:0,    phoneAnswerRate:73.7, activePatients:421, suppliesPct:5.38, status:'watch'    },
    { code:'HNR', production:85777,  collections:86319,  collectionRate:100.6, newPatients:85,  recareRate:0,    phoneAnswerRate:66.1, activePatients:298, suppliesPct:6.92, status:'on_pace'  },
    { code:'HNS', production:68204,  collections:49683,  collectionRate:72.8,  newPatients:54,  recareRate:0,    phoneAnswerRate:65.0, activePatients:276, suppliesPct:3.62, status:'on_pace'  },
    { code:'PB',  production:222385, collections:249774, collectionRate:112.3, newPatients:83,  recareRate:0,    phoneAnswerRate:61.8, activePatients:389, suppliesPct:6.77, status:'on_pace'  },
    { code:'PR',  production:159884, collections:116989, collectionRate:73.2,  newPatients:79,  recareRate:0,    phoneAnswerRate:68.0, activePatients:321, suppliesPct:10.58,status:'on_pace'  },
    { code:'OSB', production:90621,  collections:149256, collectionRate:164.7, newPatients:48,  recareRate:92.7, phoneAnswerRate:68.7, activePatients:292, suppliesPct:2.09, status:'watch',   isOSB:true },
  ],

  // Source: Dentrix ProviderTotals (10) 04/01–04/24/2026 + Dental Intel OSB providers-performance 04/24
  // Gross = Procedure Charges column; daysWorked = 18 (BD18 complete Apr 24)
  doctors: [
    { name:'Nichols, Christopher', locationCode:'LKW', grossProd:276236, collections:111075, collRate:40.2, prodPerDay:15346, daysWorked:18, ytdProd:1350000 },
    { name:'Proctor, Sarah',       locationCode:'PB',  grossProd:254732, collections:142333, collRate:55.9, prodPerDay:14152, daysWorked:18, ytdProd:930000  },
    { name:'Weathers, L\'Cris',    locationCode:'PR',  grossProd:231668, collections:76952,  collRate:33.2, prodPerDay:12871, daysWorked:18, ytdProd:780000  },
    { name:'Connolly, Noah',       locationCode:'HNS', grossProd:179109, collections:67791,  collRate:37.8, prodPerDay:9951,  daysWorked:18, ytdProd:545000  },
    { name:'Ballard, Erin',        locationCode:'PB',  grossProd:172448, collections:73173,  collRate:42.4, prodPerDay:9580,  daysWorked:18, ytdProd:550000  },
    { name:'Nichols, Patrick',     locationCode:'LT',  grossProd:135395, collections:74244,  collRate:54.8, prodPerDay:7522,  daysWorked:18, ytdProd:495000  },
    { name:'Walters, Carrie',      locationCode:'LKW', grossProd:116610, collections:47935,  collRate:41.1, prodPerDay:6478,  daysWorked:18, ytdProd:400000  },
    { name:'Osbourne, Brian',      locationCode:'OSB', grossProd:77392,  collections:93794,  collRate:121.2,prodPerDay:4300,  daysWorked:18, ytdProd:155000, isOSB:true },
    { name:'Skaggs, Ernest',       locationCode:'HNR', grossProd:69292,  collections:30851,  collRate:44.5, prodPerDay:3850,  daysWorked:18, ytdProd:110000  },
    { name:'Gleason, Robert',      locationCode:'LKW', grossProd:62697,  collections:32838,  collRate:52.4, prodPerDay:3483,  daysWorked:18, ytdProd:378000  },
    { name:'Decker Haycraft, Kara',locationCode:'LT',  grossProd:62069,  collections:27771,  collRate:44.7, prodPerDay:3448,  daysWorked:18, ytdProd:150000  },
    { name:'Chadwick, Evan',       locationCode:'PR',  grossProd:50518,  collections:23414,  collRate:46.3, prodPerDay:2807,  daysWorked:18, ytdProd:150000  },
  ],

  // Source: Dentrix ProviderTotals (10) + Time Clock 04/01–04/24/2026
  // OSB: Dental Intel providers-performance 04/24 — hours estimated (no Ascend time clock)
  // recareRate: 0 = no verified data for Ascend locations; OSB from DI operations-performance
  hygienists: [
    // ── LKW ──
    { name:'Howell, Dana',     locationCode:'LKW', grossProd:22435, collections:8901,  collRate:39.7, hoursWorked:127.63,prodPerHr:176, recareRate:0 },
    { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:19784, collections:8779,  collRate:44.4, hoursWorked:124.1, prodPerHr:159, recareRate:0 },
    { name:'Payne, McKay',     locationCode:'LKW', grossProd:16082, collections:6029,  collRate:37.5, hoursWorked:108.98,prodPerHr:148, recareRate:0 },
    { name:'Woosley, Emily',   locationCode:'LKW', grossProd:15972, collections:6721,  collRate:42.1, hoursWorked:120.64,prodPerHr:132, recareRate:0 },
    { name:'Blandford, Cassi', locationCode:'LKW', grossProd:12045, collections:6316,  collRate:52.4, hoursWorked:85.48, prodPerHr:141, recareRate:0 },
    { name:'Berry, Tasha',     locationCode:'LKW', grossProd:12041, collections:5587,  collRate:46.4, hoursWorked:82.12, prodPerHr:147, recareRate:0 },
    { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:11951, collections:6574,  collRate:55.0, hoursWorked:119.42,prodPerHr:100, recareRate:0 },
    { name:'Vowels, Susan',    locationCode:'LKW', grossProd:8139,  collections:4601,  collRate:56.5, hoursWorked:61.82, prodPerHr:132, recareRate:0 },
    { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:7900,  collections:6555,  collRate:83.0, hoursWorked:54.89, prodPerHr:144, recareRate:0 },
    { name:'Youart, Britney',  locationCode:'LKW', grossProd:7867,  collections:3858,  collRate:49.0, hoursWorked:50.46, prodPerHr:156, recareRate:0 },
    { name:'Bewley, Emma',     locationCode:'LKW', grossProd:3905,  collections:3742,  collRate:95.8, hoursWorked:27.6,  prodPerHr:141, recareRate:0 },
    // ── LT ──
    { name:'Logsdon, Megan',   locationCode:'LT',  grossProd:18236, collections:7781,  collRate:42.7, hoursWorked:122.38,prodPerHr:149, recareRate:0 },
    { name:'Morris, Amber',    locationCode:'LT',  grossProd:18216, collections:11856, collRate:65.1, hoursWorked:130.15,prodPerHr:140, recareRate:0 },
    { name:'Harned, Stacy',    locationCode:'LT',  grossProd:10340, collections:4813,  collRate:46.5, hoursWorked:75.85, prodPerHr:136, recareRate:0 },
    { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:8401,  collections:4120,  collRate:49.0, hoursWorked:53.37, prodPerHr:157, recareRate:0 },
    // ── PR (Proctor Radcliff) ──
    { name:'Jones, Chad',      locationCode:'PR',  grossProd:42903, collections:17352, collRate:40.4, hoursWorked:95.34, prodPerHr:450, recareRate:0 },
    { name:'Wires, Tanya',     locationCode:'PR',  grossProd:26514, collections:12460, collRate:47.0, hoursWorked:124.09,prodPerHr:214, recareRate:0 },
    { name:'Lynch, Cassie',    locationCode:'PR',  grossProd:20130, collections:11058, collRate:54.9, hoursWorked:110.53,prodPerHr:182, recareRate:0 },
    // ── PB (Proctor Bardstown) ──
    { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:36499, collections:14310, collRate:39.2, hoursWorked:120.74,prodPerHr:302, recareRate:0 },
    { name:'Kittle, Jolena',   locationCode:'PB',  grossProd:12245, collections:5572,  collRate:45.5, hoursWorked:83.26, prodPerHr:147, recareRate:0 },
    // ── HNS (H&N Shepherdsville) ──
    { name:'Logsdon, Megan',   locationCode:'HNS', grossProd:0,     collections:0,     collRate:0,    hoursWorked:0,     prodPerHr:0,   recareRate:0 },
    // ── OSB (Dental Intel — manual source) ──
    { name:'Haydon, Kelsey',   locationCode:'OSB', grossProd:9179,  collections:8693,  collRate:94.7, hoursWorked:88.0,  prodPerHr:104, recareRate:92.7, isOSB:true },
    { name:'Culver, Angela',   locationCode:'OSB', grossProd:8890,  collections:7861,  collRate:88.4, hoursWorked:88.0,  prodPerHr:101, recareRate:92.7, isOSB:true },
    { name:'Ulrich, Leigh',    locationCode:'OSB', grossProd:8694,  collections:7242,  collRate:83.3, hoursWorked:88.0,  prodPerHr:99,  recareRate:92.7, isOSB:true },
    { name:'Greenwell, Denise',locationCode:'OSB', grossProd:5261,  collections:4024,  collRate:76.5, hoursWorked:45.0,  prodPerHr:117, recareRate:92.7, isOSB:true },
    { name:'Yates, Jaclyn',    locationCode:'OSB', grossProd:3662,  collections:6418,  collRate:175.3,hoursWorked:35.0,  prodPerHr:105, recareRate:92.7, isOSB:true },
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

  // Source: Dentrix AgedReceivables (10) 04/24/2026 + Dental Intel OSB ar-overview 04/24/2026
  // Totals = gross AR before unapplied credits; insuranceAR/patientAR from location sections
  // arToProdRatio = org AR / projected full-month gross (ProviderTotals gross × 22/18)
  // arToProd per location = loc AR / projected full-month net (Prod/Coll Summary net × 22/18)
  ar: {
    asOf: '04/24/2026',
    healthScore: 50,
    total: 2238681,   // Ascend $2,040,376 + OSB $198,305
    buckets: { d0_30: 1363285, d31_60: 483190, d61_90: 178078, d90plus: 214129 },
    pcts:    { d0_30: 60.9,    d31_60: 21.6,   d61_90: 7.9,    d90plus: 9.6   },
    arToProdRatio: 0.89,
    locations: [
      { code:'LKW', total:754925,  d0_30:362208, d31_60:195750, d61_90:91969,  d90plus:104998, pct0_30:48.0, pct31_60:25.9, pct61_90:12.2, pct90plus:13.9, insuranceAR:237252, patientAR:351743, patientPct:47, arToProd:1.76, status:'needs_work' },
      { code:'LT',  total:294558,  d0_30:182801, d31_60:70595,  d61_90:16321,  d90plus:24841,  pct0_30:62.1, pct31_60:24.0, pct61_90:5.5,  pct90plus:8.4,  insuranceAR:117834, patientAR:45183,  patientPct:15, arToProd:1.37, status:'watch'     },
      { code:'HNR', total:219475,  d0_30:134307, d31_60:41922,  d61_90:14211,  d90plus:29035,  pct0_30:61.2, pct31_60:19.1, pct61_90:6.5,  pct90plus:13.2, insuranceAR:92072,  patientAR:64982,  patientPct:30, arToProd:2.09, status:'needs_work' },
      { code:'HNS', total:66962,   d0_30:53314,  d31_60:8754,   d61_90:767,    d90plus:4126,   pct0_30:79.6, pct31_60:13.1, pct61_90:1.1,  pct90plus:6.2,  insuranceAR:30604,  patientAR:14382,  patientPct:21, arToProd:0.80, status:'watch'     },
      { code:'PB',  total:301956,  d0_30:243675, d31_60:28143,  d61_90:21223,  d90plus:8915,   pct0_30:80.7, pct31_60:9.3,  pct61_90:7.0,  pct90plus:3.0,  insuranceAR:137855, patientAR:44341,  patientPct:15, arToProd:1.11, status:'good'      },
      { code:'PR',  total:402500,  d0_30:230453, d31_60:119395, d61_90:22810,  d90plus:29841,  pct0_30:57.3, pct31_60:29.7, pct61_90:5.7,  pct90plus:7.4,  insuranceAR:144217, patientAR:216459, patientPct:54, arToProd:2.06, status:'watch'     },
      { code:'OSB', total:198305,  d0_30:156527, d31_60:18629,  d61_90:10777,  d90plus:12372,  pct0_30:79.0, pct31_60:9.4,  pct61_90:5.4,  pct90plus:6.2,  insuranceAR:126376, patientAR:71928,  patientPct:36, arToProd:1.79, status:'watch',    isOSB:true },
    ],
  },
}
