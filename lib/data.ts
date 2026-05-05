export const LOCATIONS = [
  { code: 'LKW', name: 'H&N Lakewood',        brand: 'Harvey & Nichols', isOSB: false },
  { code: 'LT',  name: 'H&N Lincoln Trail',   brand: 'Harvey & Nichols', isOSB: false },
  { code: 'HNR', name: 'H&N Radcliff',        brand: 'Harvey & Nichols', isOSB: false },
  { code: 'HNS', name: 'H&N Shepherdsville',  brand: 'Harvey & Nichols', isOSB: false },
  { code: 'HNK', name: 'H&N King',            brand: 'Harvey & Nichols', isOSB: false },
  { code: 'PB',  name: 'Proctor Bardstown',   brand: 'Proctor Family',   isOSB: false },
  { code: 'PR',  name: 'Proctor Radcliff',    brand: 'Proctor Family',   isOSB: false },
  { code: 'OSB', name: 'Osbourne Family',     brand: 'Osbourne',         isOSB: true  },
]

// Bonus race collection goals (100% = $1,000 bonus tier)
export const MONTHLY_GOALS: Record<string, number> = {
  LKW: 335000, LT: 210000, HNR: 90000, HNS: 60000, HNK: 50000, PB: 275000, PR: 140000, OSB: 210000,
}

// Individual doctor monthly gross production goals
// PLACEHOLDER — update with confirmed targets from Kyle
// Key must match DEMO_DATA.doctors[].name exactly
export const PROVIDER_GOALS: Record<string, number> = {
  'Nichols, Christopher':    360000,
  "Weathers, L'Cris":       330000,
  'Proctor, Sarah':          330000,
  'Ballard, Erin':           250000,
  'Connolly, Noah':          235000,
  'Nichols, Patrick':        165000,
  'Walters, Carrie':         160000,
  'Skaggs, Ernest':          110000,
  'Osbourne, Brian':         100000,
  'Gleason, Robert':          90000,
  'Chadwick, Evan':           80000,
  'Decker Haycraft, Kara':    75000,
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

// May 2026 — BD4 (2/21 business days complete — May 1-2; May 3-4 weekend)
// Business days: May 1-2 complete; 5,6,7,8,9,12,13,14,15,16,19,20,21,22,23,27,28,29,30 remaining
// (Memorial Day May 26 = holiday excluded → 21 total biz days)
export const PERIOD_INFO = {
  label:          'May 2026',
  dataAsOf:       'May 4',      // Date of last data pull
  totalBizDays:   21,
  daysComplete:   2,
  daysRemaining:  19,
}

// ─── Live Data — BD4 (May 1-4) — Sources: Dentrix Ascend ProviderTotals (20) + Dental Intel OSB ───
// ProviderTotals run 05/01–05/04 by modified/applied date (covers BD2: May 1-2 clinical + weekend postings)
// Production/Collection Summary (13) — per-location May data
// AgedReceivables (20) — as of 05/04/2026
// New Patients all offices (15) — May MTD
// Time clock 05/01–05/04 — hours by provider
//
// HNK (Harvey and Nichols King) — NEW location, effective 04/29/2026
//   Provider: King, Susan M (hygienist/GP) — 2101 N Dixie Hwy, Elizabethtown KY
//   Not yet in standard ProviderTotals; production captured via Production/Collection Summary
//
// NOTE: Collection rates distorted at BD4 — insurance payments from April posting in May
//       inflates collection rate above 100% at HNR, PB, PR. Not meaningful until BD8+.
export const DEMO_DATA = {
  period: 'May 2026',
  org: {
    production:      152159,    // Ascend ProviderTotals Procedure Charges 147,809 + OSB 4,350
    productionGoal:  2400000,
    collections:     142338,    // Ascend 123,207 + OSB 19,131 (includes April insurance catch-up)
    collectionsGoal: 1320000,
    newPatients:        32,     // LKW:4 LT:5 HNR:2 HNS:7 PB:5 PR:6 OSB:3 (HNK not yet in NP report)
    activePatients:    2531,    // carry forward from April
    phoneAnswerRate:    0,      // BD4 — Mango Voice not yet pulled for May
    hygieneRecare:    87.1,     // OSB from Dental Intel operations-performance 05/04
  },

  locations: [
    // production = gross charges from ProviderTotals allocation; collections = from Prod/Coll Summary
    { code:'LKW', production:31842, collections:13509, collectionRate:42.4,  newPatients:4, recareRate:0,    phoneAnswerRate:0, activePatients:534, suppliesPct:0, status:'watch'    },
    { code:'LT',  production:24975, collections:16831, collectionRate:67.4,  newPatients:5, recareRate:0,    phoneAnswerRate:0, activePatients:421, suppliesPct:0, status:'on_pace'  },
    { code:'HNR', production:5284,  collections:18201, collectionRate:344.4, newPatients:2, recareRate:0,    phoneAnswerRate:0, activePatients:298, suppliesPct:0, status:'watch'    },
    { code:'HNS', production:4486,  collections:3408,  collectionRate:76.0,  newPatients:7, recareRate:0,    phoneAnswerRate:0, activePatients:276, suppliesPct:0, status:'watch'    },
    { code:'HNK', production:8455,  collections:168,   collectionRate:2.0,   newPatients:0, recareRate:0,    phoneAnswerRate:0, activePatients:0,   suppliesPct:0, status:'on_pace'  },
    { code:'PB',  production:42511, collections:41962, collectionRate:98.7,  newPatients:5, recareRate:0,    phoneAnswerRate:0, activePatients:389, suppliesPct:0, status:'on_pace'  },
    { code:'PR',  production:32431, collections:33372, collectionRate:102.9, newPatients:6, recareRate:0,    phoneAnswerRate:0, activePatients:321, suppliesPct:0, status:'on_pace'  },
    { code:'OSB', production:4350,  collections:19131, collectionRate:439.8, newPatients:3, recareRate:87.1, phoneAnswerRate:0, activePatients:292, suppliesPct:0, status:'watch',   isOSB:true },
  ],

  // BD4 — doctor production/collections from ProviderTotals (20) 05/01–05/04
  // ytdProd = Jan–Apr 2026 cumulative (unchanged from April final)
  // Collection rates >100% at BD4 are normal — April insurance payments posting in May
  doctors: [
    { name:'Nichols, Christopher',  locationCode:'LKW', grossProd:2266,  collections:3139,  collRate:138.6, prodPerDay:1133,  daysWorked:2, ytdProd:1389000 },
    { name:"Weathers, L'Cris",      locationCode:'PR',  grossProd:18087, collections:14042, collRate:77.6,  prodPerDay:9044,  daysWorked:2, ytdProd:951000  },
    { name:'Proctor, Sarah',        locationCode:'PB',  grossProd:24087, collections:20343, collRate:84.5,  prodPerDay:12044, daysWorked:2, ytdProd:1209000 },
    { name:'Ballard, Erin',         locationCode:'PB',  grossProd:14674, collections:12033, collRate:82.0,  prodPerDay:7337,  daysWorked:2, ytdProd:638000  },
    { name:'Connolly, Noah',        locationCode:'HNS', grossProd:8382,  collections:10464, collRate:124.8, prodPerDay:4191,  daysWorked:2, ytdProd:656000  },
    { name:'Nichols, Patrick',      locationCode:'LT',  grossProd:15100, collections:7538,  collRate:49.9,  prodPerDay:7550,  daysWorked:2, ytdProd:630000  },
    { name:'Walters, Carrie',       locationCode:'LKW', grossProd:11976, collections:5124,  collRate:42.8,  prodPerDay:5988,  daysWorked:2, ytdProd:452000  },
    { name:'Skaggs, Ernest',        locationCode:'HNR', grossProd:5284,  collections:10537, collRate:199.4, prodPerDay:2642,  daysWorked:2, ytdProd:340000  },
    { name:'Osbourne, Brian',       locationCode:'OSB', grossProd:1216,  collections:11291, collRate:928.5, prodPerDay:608,   daysWorked:2, ytdProd:388000,  isOSB:true },
    { name:'Gleason, Robert',       locationCode:'LKW', grossProd:2925,  collections:3379,  collRate:115.5, prodPerDay:1463,  daysWorked:2, ytdProd:268000  },
    { name:'Chadwick, Evan',        locationCode:'PR',  grossProd:11049, collections:2338,  collRate:21.2,  prodPerDay:5525,  daysWorked:2, ytdProd:349000  },
    { name:'Decker Haycraft, Kara', locationCode:'LT',  grossProd:6465,  collections:2890,  collRate:44.7,  prodPerDay:3233,  daysWorked:2, ytdProd:287000  },
  ],

  // BD4 — production/collections from ProviderTotals (20); hours from Time Clock 05/01–05/04
  // LKW hygienists; Collection rates distorted (April payments posting in May)
  hygienists: [
    // ── LKW ──
    { name:'Howell, Dana',     locationCode:'LKW', grossProd:2080, collections:1121, collRate:53.9,  hoursWorked:15.23, prodPerHr:137, recareRate:0 },
    { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:1377, collections:320,  collRate:23.2,  hoursWorked:9.05,  prodPerHr:152, recareRate:0 },
    { name:'Woosley, Emily',   locationCode:'LKW', grossProd:2369, collections:587,  collRate:24.8,  hoursWorked:14.56, prodPerHr:163, recareRate:0 },
    { name:'Payne, McKay',     locationCode:'LKW', grossProd:0,    collections:397,  collRate:0,     hoursWorked:0,     prodPerHr:0,   recareRate:0 },
    { name:'Berry, Tasha',     locationCode:'LKW', grossProd:1388, collections:352,  collRate:25.4,  hoursWorked:8.24,  prodPerHr:168, recareRate:0 },
    { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:758,  collections:52,   collRate:6.9,   hoursWorked:9.73,  prodPerHr:78,  recareRate:0 },
    { name:'Blandford, Cassi', locationCode:'LKW', grossProd:1072, collections:844,  collRate:78.7,  hoursWorked:8.61,  prodPerHr:125, recareRate:0 },
    { name:'Youart, Britney',  locationCode:'LKW', grossProd:898,  collections:639,  collRate:71.2,  hoursWorked:5.59,  prodPerHr:161, recareRate:0 },
    { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:2096, collections:149,  collRate:7.1,   hoursWorked:12.86, prodPerHr:163, recareRate:0 },
    { name:'Vowels, Susan',    locationCode:'LKW', grossProd:1200, collections:100,  collRate:8.3,   hoursWorked:8.27,  prodPerHr:145, recareRate:0 },
    { name:'Bewley, Emma',     locationCode:'LKW', grossProd:673,  collections:189,  collRate:28.1,  hoursWorked:0,     prodPerHr:0,   recareRate:0 },
    // ── LT ──
    { name:'Logsdon, Megan',   locationCode:'LT',  grossProd:1185, collections:1093, collRate:92.2,  hoursWorked:8.71,  prodPerHr:136, recareRate:0 },
    { name:'Morris, Amber',    locationCode:'LT',  grossProd:1616, collections:1811, collRate:112.1, hoursWorked:10.17, prodPerHr:159, recareRate:0 },
    { name:'Harned, Stacy',    locationCode:'LT',  grossProd:906,  collections:330,  collRate:36.4,  hoursWorked:0,     prodPerHr:0,   recareRate:0 },
    { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:888,  collections:186,  collRate:20.9,  hoursWorked:5.99,  prodPerHr:148, recareRate:0 },
    // ── HNK (new location) ──
    { name:'King, Susan',      locationCode:'HNK', grossProd:8455, collections:168,  collRate:2.0,   hoursWorked:16.00, prodPerHr:528, recareRate:0 },
    // ── PR (Proctor Radcliff) ──
    { name:'Jones, Chad',      locationCode:'PR',  grossProd:2394, collections:7991, collRate:333.8, hoursWorked:7.95,  prodPerHr:301, recareRate:0 },
    { name:'Wires, Tanya',     locationCode:'PR',  grossProd:901,  collections:6036, collRate:670.0, hoursWorked:8.98,  prodPerHr:100, recareRate:0 },
    { name:'Lynch, Cassie',    locationCode:'PR',  grossProd:0,    collections:2338, collRate:0,     hoursWorked:0,     prodPerHr:0,   recareRate:0 },
    // ── PB (Proctor Bardstown) ──
    { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:2880, collections:5014, collRate:174.1, hoursWorked:8.51,  prodPerHr:338, recareRate:0 },
    { name:'Kittle, Jolena',   locationCode:'PB',  grossProd:870,  collections:259,  collRate:29.8,  hoursWorked:7.06,  prodPerHr:123, recareRate:0 },
    // ── OSB (Dental Intel — manual source; hours not available from Ascend time clock) ──
    { name:'Haydon, Kelsey',   locationCode:'OSB', grossProd:346,  collections:1333, collRate:385.3, hoursWorked:0, prodPerHr:0, recareRate:87.1, isOSB:true },
    { name:'Culver, Angela',   locationCode:'OSB', grossProd:404,  collections:1441, collRate:356.7, hoursWorked:0, prodPerHr:0, recareRate:87.1, isOSB:true },
    { name:'Ulrich, Leigh',    locationCode:'OSB', grossProd:934,  collections:1437, collRate:153.9, hoursWorked:0, prodPerHr:0, recareRate:87.1, isOSB:true },
    { name:'Greenwell, Denise',locationCode:'OSB', grossProd:0,    collections:620,  collRate:0,     hoursWorked:0, prodPerHr:0, recareRate:87.1, isOSB:true },
    { name:'Yates, Jaclyn',    locationCode:'OSB', grossProd:0,    collections:1168, collRate:0,     hoursWorked:0, prodPerHr:0, recareRate:87.1, isOSB:true },
  ],

  // BD4 — Mango Voice not yet pulled for May; zeroed pending next pull
  phones: [
    { code:'LKW', totalCalls:0, answered:0, missed:0, answerRate:0, estMissedRevenue:0 },
    { code:'LT',  totalCalls:0, answered:0, missed:0, answerRate:0, estMissedRevenue:0 },
    { code:'HNR', totalCalls:0, answered:0, missed:0, answerRate:0, estMissedRevenue:0 },
    { code:'HNS', totalCalls:0, answered:0, missed:0, answerRate:0, estMissedRevenue:0 },
    { code:'HNK', totalCalls:0, answered:0, missed:0, answerRate:0, estMissedRevenue:0 },
    { code:'PB',  totalCalls:0, answered:0, missed:0, answerRate:0, estMissedRevenue:0 },
    { code:'PR',  totalCalls:0, answered:0, missed:0, answerRate:0, estMissedRevenue:0 },
    { code:'OSB', totalCalls:0, answered:0, missed:0, answerRate:0, estMissedRevenue:0 },
  ],

  // AR — AgedReceivables (20) as of 05/04/2026 — ALL locations including HNK
  // Org total: Ascend $1,927,410 (7 locations) + OSB $172,215 = $2,099,625
  // OSB buckets from Dental Intel operations-performance: AR Patients X-Y = total (patient+insurance) by bucket
  ar: {
    asOf: '05/04/2026',
    healthScore: 52,  // Improved from 49 — HNK all current; LKW still heavy in 90+ ($113K)
    total: 2099625,
    buckets: { d0_30: 1265284, d31_60: 347198, d61_90: 251095, d90plus: 236048 },
    pcts:    { d0_30: 60.3,    d31_60: 16.5,   d61_90: 12.0,   d90plus: 11.2  },
    arToProdRatio: 0.87,
    locations: [
      // LKW — heavy 90+; $113K over 90 days outstanding
      { code:'LKW', total:721718,  d0_30:295265, d31_60:183977, d61_90:129067, d90plus:113409, pct0_30:40.9, pct31_60:25.5, pct61_90:17.9, pct90plus:15.7, insuranceAR:223098, patientAR:351273, patientPct:49, arToProd:2.06, status:'needs_work' },
      // LT — high write-off estimate ($104K of $244K total); proceed with caution
      { code:'LT',  total:243751,  d0_30:155812, d31_60:25652,  d61_90:34959,  d90plus:27327,  pct0_30:63.9, pct31_60:10.5, pct61_90:14.3, pct90plus:11.2, insuranceAR:97317,  patientAR:41990,  patientPct:17, arToProd:1.22, status:'needs_work' },
      // HNR — 13.8% in 90+; catching up from ramp
      { code:'HNR', total:198388,  d0_30:129160, d31_60:26159,  d61_90:15750,  d90plus:27319,  pct0_30:65.1, pct31_60:13.2, pct61_90:7.9,  pct90plus:13.8, insuranceAR:78279,  patientAR:65117,  patientPct:33, arToProd:2.20, status:'needs_work' },
      // HNS — healthy mix; 81.2% current
      { code:'HNS', total:90598,   d0_30:73532,  d31_60:12128,  d61_90:1646,   d90plus:3291,   pct0_30:81.2, pct31_60:13.4, pct61_90:1.8,  pct90plus:3.6,  insuranceAR:36961,  patientAR:15307,  patientPct:17, arToProd:1.51, status:'good'      },
      // HNK — new location opened 04/29; 100% current AR as expected
      { code:'HNK', total:11590,   d0_30:11590,  d31_60:0,      d61_90:0,      d90plus:0,      pct0_30:100.0,pct31_60:0,    pct61_90:0,    pct90plus:0,    insuranceAR:9276,   patientAR:2315,   patientPct:20, arToProd:0.14, status:'good'      },
      // PB — healthy; 79.6% current, low 90+
      { code:'PB',  total:291495,  d0_30:232105, d31_60:30745,  d61_90:17333,  d90plus:11311,  pct0_30:79.6, pct31_60:10.5, pct61_90:5.9,  pct90plus:3.9,  insuranceAR:116769, patientAR:53376,  patientPct:18, arToProd:1.06, status:'good'      },
      // PR — high patient AR ($209K); 57% patient-side; needs patient billing attention
      { code:'PR',  total:369871,  d0_30:238702, d31_60:51328,  d61_90:43344,  d90plus:36497,  pct0_30:64.5, pct31_60:13.9, pct61_90:11.7, pct90plus:9.9,  insuranceAR:128607, patientAR:208856, patientPct:57, arToProd:2.64, status:'watch'     },
      // OSB — ALT DATA MANUAL SOURCE (Dental Intel); bucket totals = patient+insurance combined
      { code:'OSB', total:172215,  d0_30:129118, d31_60:17208,  d61_90:8996,   d90plus:16893,  pct0_30:75.0, pct31_60:10.0, pct61_90:5.2,  pct90plus:9.8,  insuranceAR:104301, patientAR:67913,  patientPct:39, arToProd:0.82, status:'watch',    isOSB:true },
    ],
  },
}
