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

// April 2026 — data pulled 04/28/2026 (BD20 complete)
// Business days: Apr 1,2,3,6,7,8,9,10,13,14,15,16,17,20,21,22,23,24,27,28 = 20 complete
export const PERIOD_INFO = {
  label:          'April 2026',
  dataAsOf:       'April 28',   // Date of last data pull — update with each refresh
  totalBizDays:   22,           // All weekdays Apr 1–30 (Good Friday Apr 3 = working day)
  daysComplete:   20,
  daysRemaining:  2,
}

// ─── Live Data — Sources: Dentrix + Mango Voice + Dental Intel OSB ───
// Production (org gross): ProviderTotals (12) Procedure Charges 04/01–04/28 Ascend + Dental Intel OSB providers-performance 04/28
// Production (per location): NET from Production/Collection Summary (10) 04/01–04/28
// Collections: EXACT from Production/Collection Summary (10) 04/01–04/28 + Dental Intel OSB providers-performance 04/28
// Phones: Mango Voice 04/01–04/28 — ALL 7 locations confirmed from screenshots
// New Patients: New Patients (12) Dentrix 04/01–04/28 + Dental Intel OSB operations-performance 04/28
// Recare: OSB only (92.8% from DI) — Ascend recare not in current export set; shown as — in UI
export const DEMO_DATA = {
  period: 'April 2026',
  org: {
    production:      2378092,  // $2,253,500 Ascend ProviderTotals (12) gross + $124,592 OSB (DI 04/28)
    productionGoal:  2400000,
    collections:     1208969,  // $1,051,963 Ascend Prod/Coll Summary (10) exact + $157,006 OSB
    collectionsGoal: 1320000,
    newPatients:        581,   // LKW:114 LT:57 HNR:97 HNS:61 PB:107 PR:90 OSB:55
    activePatients:    2531,
    phoneAnswerRate:   68.4,   // Mango Voice 04/01–04/28 — all 7 locations confirmed from screenshots
    hygieneRecare:      0,     // No verified Ascend recare report — not displayed
  },

  // Collections: EXACT per location from Prod/Coll Summary (10)
  // Production: NET from Prod/Coll Summary (10) — after write-offs/adjustments
  // Note: PB/PR/HNR/OSB collectionRate >100% = collecting on prior-month AR (expected)
  // recareRate: 0 = no verified data; UI shows "—". OSB only from DI operations-performance.
  locations: [
    { code:'LKW', production:395047, collections:296556, collectionRate:75.1,  newPatients:114, recareRate:0,    phoneAnswerRate:70.0, activePatients:534, suppliesPct:5.76, status:'on_pace'  },
    { code:'LT',  production:169416, collections:169153, collectionRate:99.8,  newPatients:57,  recareRate:0,    phoneAnswerRate:75.7, activePatients:421, suppliesPct:5.38, status:'watch'    },
    { code:'HNR', production:91251,  collections:109930, collectionRate:120.5, newPatients:97,  recareRate:0,    phoneAnswerRate:68.4, activePatients:298, suppliesPct:6.92, status:'on_pace'  },
    { code:'HNS', production:77165,  collections:54587,  collectionRate:70.7,  newPatients:61,  recareRate:0,    phoneAnswerRate:64.7, activePatients:276, suppliesPct:3.62, status:'on_pace'  },
    { code:'PB',  production:222843, collections:276851, collectionRate:124.3, newPatients:107, recareRate:0,    phoneAnswerRate:59.7, activePatients:389, suppliesPct:6.77, status:'on_pace'  },
    { code:'PR',  production:166958, collections:144886, collectionRate:86.8,  newPatients:90,  recareRate:0,    phoneAnswerRate:68.1, activePatients:321, suppliesPct:10.58,status:'on_pace'  },
    { code:'OSB', production:90925,  collections:157006, collectionRate:172.7, newPatients:55,  recareRate:92.8, phoneAnswerRate:72.5, activePatients:292, suppliesPct:2.09, status:'watch',   isOSB:true },
  ],

  // Source: Dentrix ProviderTotals (12) 04/01–04/28/2026 + Dental Intel OSB providers-performance 04/28
  // Gross = Procedure Charges column; daysWorked = 20 (BD20 complete Apr 28)
  doctors: [
    { name:'Nichols, Christopher', locationCode:'LKW', grossProd:333206, collections:147719, collRate:44.3, prodPerDay:16660, daysWorked:20, ytdProd:1360000 },
    { name:'Proctor, Sarah',       locationCode:'PB',  grossProd:288974, collections:158812, collRate:55.0, prodPerDay:14449, daysWorked:20, ytdProd:952000  },
    { name:'Weathers, L\'Cris',    locationCode:'PR',  grossProd:263950, collections:96467,  collRate:36.5, prodPerDay:13198, daysWorked:20, ytdProd:793000  },
    { name:'Connolly, Noah',       locationCode:'HNS', grossProd:200541, collections:77496,  collRate:38.6, prodPerDay:10027, daysWorked:20, ytdProd:558000  },
    { name:'Ballard, Erin',        locationCode:'PB',  grossProd:196695, collections:78627,  collRate:40.0, prodPerDay:9835,  daysWorked:20, ytdProd:562000  },
    { name:'Nichols, Patrick',     locationCode:'LT',  grossProd:145065, collections:89690,  collRate:61.8, prodPerDay:7253,  daysWorked:20, ytdProd:497000  },
    { name:'Walters, Carrie',      locationCode:'LKW', grossProd:133640, collections:54654,  collRate:40.9, prodPerDay:6682,  daysWorked:20, ytdProd:406000  },
    { name:'Skaggs, Ernest',       locationCode:'HNR', grossProd:89381,  collections:44306,  collRate:49.6, prodPerDay:4469,  daysWorked:20, ytdProd:115000  },
    { name:'Osbourne, Brian',      locationCode:'OSB', grossProd:77538,  collections:98010,  collRate:126.4,prodPerDay:3877,  daysWorked:20, ytdProd:156000,  isOSB:true },
    { name:'Decker Haycraft, Kara',locationCode:'LT',  grossProd:67428,  collections:31946,  collRate:47.4, prodPerDay:3371,  daysWorked:20, ytdProd:154000  },
    { name:'Gleason, Robert',      locationCode:'LKW', grossProd:66985,  collections:38490,  collRate:57.5, prodPerDay:3349,  daysWorked:20, ytdProd:382000  },
    { name:'Chadwick, Evan',       locationCode:'PR',  grossProd:57482,  collections:27737,  collRate:48.3, prodPerDay:2874,  daysWorked:20, ytdProd:157000  },
  ],

  // Source: Dentrix ProviderTotals (12) + Time Clock 04/01–04/28/2026
  // OSB: Dental Intel providers-performance 04/28 — hours estimated (no Ascend time clock)
  // recareRate: 0 = no verified data for Ascend locations; OSB from DI operations-performance
  hygienists: [
    // ── LKW ──
    { name:'Howell, Dana',     locationCode:'LKW', grossProd:24659, collections:11011, collRate:44.7, hoursWorked:144.98,prodPerHr:170, recareRate:0 },
    { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:22604, collections:10537, collRate:46.6, hoursWorked:143.22,prodPerHr:158, recareRate:0 },
    { name:'Woosley, Emily',   locationCode:'LKW', grossProd:17908, collections:8059,  collRate:45.0, hoursWorked:137.48,prodPerHr:130, recareRate:0 },
    { name:'Payne, McKay',     locationCode:'LKW', grossProd:17135, collections:7202,  collRate:42.0, hoursWorked:116.28,prodPerHr:147, recareRate:0 },
    { name:'Berry, Tasha',     locationCode:'LKW', grossProd:14700, collections:7214,  collRate:49.1, hoursWorked:108.30,prodPerHr:136, recareRate:0 },
    { name:'Blandford, Cassi', locationCode:'LKW', grossProd:14119, collections:7465,  collRate:52.9, hoursWorked:103.34,prodPerHr:137, recareRate:0 },
    { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:14093, collections:7462,  collRate:52.9, hoursWorked:138.63,prodPerHr:102, recareRate:0 },
    { name:'Youart, Britney',  locationCode:'LKW', grossProd:12583, collections:4854,  collRate:38.6, hoursWorked:62.96, prodPerHr:200, recareRate:0 },
    { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:10491, collections:7368,  collRate:70.2, hoursWorked:71.54, prodPerHr:147, recareRate:0 },
    { name:'Vowels, Susan',    locationCode:'LKW', grossProd:10392, collections:5709,  collRate:54.9, hoursWorked:79.65, prodPerHr:130, recareRate:0 },
    { name:'Bewley, Emma',     locationCode:'LKW', grossProd:5122,  collections:3922,  collRate:76.6, hoursWorked:36.82, prodPerHr:139, recareRate:0 },
    // ── LT ──
    { name:'Logsdon, Megan',   locationCode:'LT',  grossProd:21812, collections:9837,  collRate:45.1, hoursWorked:140.82,prodPerHr:155, recareRate:0 },
    { name:'Morris, Amber',    locationCode:'LT',  grossProd:20719, collections:15140, collRate:73.1, hoursWorked:147.14,prodPerHr:141, recareRate:0 },
    { name:'Harned, Stacy',    locationCode:'LT',  grossProd:11430, collections:6064,  collRate:53.1, hoursWorked:84.26, prodPerHr:136, recareRate:0 },
    { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:8401,  collections:4910,  collRate:58.5, hoursWorked:53.37, prodPerHr:157, recareRate:0 },
    // ── PR (Proctor Radcliff) ──
    { name:'Jones, Chad',      locationCode:'PR',  grossProd:50469, collections:19686, collRate:39.0, hoursWorked:112.75,prodPerHr:448, recareRate:0 },
    { name:'Wires, Tanya',     locationCode:'PR',  grossProd:28983, collections:12603, collRate:43.5, hoursWorked:124.09,prodPerHr:234, recareRate:0 },
    { name:'Lynch, Cassie',    locationCode:'PR',  grossProd:22980, collections:12573, collRate:54.7, hoursWorked:125.23,prodPerHr:184, recareRate:0 },
    // ── PB (Proctor Bardstown) ──
    { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:44345, collections:15403, collRate:34.7, hoursWorked:137.13,prodPerHr:323, recareRate:0 },
    { name:'Kittle, Jolena',   locationCode:'PB',  grossProd:13175, collections:6637,  collRate:50.4, hoursWorked:92.10, prodPerHr:143, recareRate:0 },
    // ── HNS (H&N Shepherdsville) ──
    { name:'Logsdon, Megan',   locationCode:'HNS', grossProd:0,     collections:0,     collRate:0,    hoursWorked:0,     prodPerHr:0,   recareRate:0 },
    // ── OSB (Dental Intel — manual source, 04/28) ──
    { name:'Haydon, Kelsey',   locationCode:'OSB', grossProd:9635,  collections:9104,  collRate:94.5, hoursWorked:92.0,  prodPerHr:105, recareRate:92.8, isOSB:true },
    { name:'Culver, Angela',   locationCode:'OSB', grossProd:8887,  collections:8238,  collRate:92.7, hoursWorked:92.0,  prodPerHr:97,  recareRate:92.8, isOSB:true },
    { name:'Ulrich, Leigh',    locationCode:'OSB', grossProd:9326,  collections:7349,  collRate:78.8, hoursWorked:92.0,  prodPerHr:101, recareRate:92.8, isOSB:true },
    { name:'Greenwell, Denise',locationCode:'OSB', grossProd:5261,  collections:4024,  collRate:76.5, hoursWorked:47.0,  prodPerHr:112, recareRate:92.8, isOSB:true },
    { name:'Yates, Jaclyn',    locationCode:'OSB', grossProd:4121,  collections:6450,  collRate:156.5,hoursWorked:37.0,  prodPerHr:111, recareRate:92.8, isOSB:true },
  ],

  // Source: Mango Voice 04/01–04/28/2026 — ALL 7 locations confirmed from screenshots
  // PB/PR note: "External" calls (37.3%/30.6%) counted as missed — routed externally, not answered in-office
  phones: [
    { code:'LKW', totalCalls:1978, answered:1384, missed:594, answerRate:70.0, estMissedRevenue:105138 },
    { code:'LT',  totalCalls:940,  answered:712,  missed:228, answerRate:75.7, estMissedRevenue:40356  },
    { code:'HNR', totalCalls:931,  answered:637,  missed:294, answerRate:68.4, estMissedRevenue:52038  },
    { code:'HNS', totalCalls:519,  answered:336,  missed:183, answerRate:64.7, estMissedRevenue:32391  },
    { code:'PB',  totalCalls:1441, answered:860,  missed:581, answerRate:59.7, estMissedRevenue:102837 },
    { code:'PR',  totalCalls:1137, answered:774,  missed:363, answerRate:68.1, estMissedRevenue:64251  },
    { code:'OSB', totalCalls:1083, answered:785,  missed:298, answerRate:72.5, estMissedRevenue:52746  },
  ],

  // Source: Dentrix AgedReceivables (12) 04/28/2026 + Dental Intel OSB ar-overview 04/28
  // Totals = gross AR before unapplied credits; insuranceAR/patientAR from location sections
  // arToProdRatio = org AR / projected full-month gross (Ascend ProviderTotals gross × 22/20)
  // arToProd per location = loc AR / projected full-month net (Prod/Coll Summary net × 22/20)
  ar: {
    asOf: '04/28/2026',
    healthScore: 49,
    total: 2131428,   // Ascend $1,932,215 + OSB $199,213
    buckets: { d0_30: 1298321, d31_60: 417455, d61_90: 198164, d90plus: 217488 },
    pcts:    { d0_30: 60.9,    d31_60: 19.6,   d61_90: 9.3,    d90plus: 10.2  },
    arToProdRatio: 0.86,
    locations: [
      { code:'LKW', total:740078,  d0_30:344648, d31_60:182202, d61_90:102157, d90plus:111071, pct0_30:46.6, pct31_60:24.6, pct61_90:13.8, pct90plus:15.0, insuranceAR:231674, patientAR:349465, patientPct:47, arToProd:1.70, status:'needs_work' },
      { code:'LT',  total:260538,  d0_30:161485, d31_60:43899,  d61_90:30297,  d90plus:24857,  pct0_30:62.0, pct31_60:16.9, pct61_90:11.6, pct90plus:9.5,  insuranceAR:105995, patientAR:41849,  patientPct:16, arToProd:1.40, status:'watch'     },
      { code:'HNR', total:202743,  d0_30:134601, d31_60:28630,  d61_90:14137,  d90plus:25376,  pct0_30:66.4, pct31_60:14.1, pct61_90:7.0,  pct90plus:12.5, insuranceAR:83102,  patientAR:65504,  patientPct:32, arToProd:2.02, status:'needs_work' },
      { code:'HNS', total:71019,   d0_30:57850,  d31_60:7912,   d61_90:1131,   d90plus:4126,   pct0_30:81.5, pct31_60:11.1, pct61_90:1.6,  pct90plus:5.8,  insuranceAR:29650,  patientAR:15059,  patientPct:21, arToProd:0.84, status:'watch'     },
      { code:'PB',  total:275804,  d0_30:235157, d31_60:19674,  d61_90:12057,  d90plus:8915,   pct0_30:85.3, pct31_60:7.1,  pct61_90:4.4,  pct90plus:3.2,  insuranceAR:119548, patientAR:46531,  patientPct:17, arToProd:1.12, status:'good'      },
      { code:'PR',  total:382034,  d0_30:209675, d31_60:115356, d61_90:26005,  d90plus:30997,  pct0_30:54.9, pct31_60:30.2, pct61_90:6.8,  pct90plus:8.1,  insuranceAR:135680, patientAR:206781, patientPct:54, arToProd:2.08, status:'watch'     },
      { code:'OSB', total:199213,  d0_30:154905, d31_60:19782,  d61_90:12379,  d90plus:12146,  pct0_30:77.8, pct31_60:9.9,  pct61_90:6.2,  pct90plus:6.1,  insuranceAR:127338, patientAR:71875,  patientPct:36, arToProd:1.99, status:'watch',    isOSB:true },
    ],
  },
}
