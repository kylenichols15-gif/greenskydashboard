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

// April 2026 — data pulled 04/21/2026 (BD14 in progress)
// Business days: Apr 1, 2, [3 Good Fri skip], 6-10, 13-17, 20 = 13 complete; Apr 21 = BD14 underway
export const PERIOD_INFO = {
  label:          'April 2026',
  dataAsOf:       'April 21',   // Date of last data pull — update with each refresh
  totalBizDays:   21,           // Good Friday (Apr 3) not worked
  daysComplete:   14,
  daysRemaining:  7,
}

// ─── Live Data — Sources: Dentrix + Mango Voice + Dental Intel OSB ───
// Production: ProviderTotals gross 04/01–04/20/2026 (Ascend) + Dental Intel OSB 04/21 pull
// Collections: EXACT from Production/Collection Summary 04/01–04/20/2026 + Dental Intel OSB
// Phones: Mango Voice 04/01–04/20/2026 — ALL 7 LOCATIONS (no new screenshots this pull)
// New Patients: Dentrix 04/01–04/20/2026 + Dental Intel OSB 04/21 pull
export const DEMO_DATA = {
  period: 'April 2026',
  org: {
    production:      1571732,  // $1,466,412 Ascend (ProviderTotals gross) + $105,320 OSB — 04/20
    productionGoal:  2400000,
    collections:      834257,  // $745,395 Ascend (Prod/Coll Summary exact) + $88,862 OSB — 04/20
    collectionsGoal: 1320000,
    newPatients:        396,   // LKW:83 LT:42 HNR:61 HNS:40 PB:66 PR:63 OSB:41
    activePatients:    2531,
    phoneAnswerRate:   66.2,   // Mango Voice 04/01–04/20 — all 7 confirmed (unchanged from prior pull)
    hygieneRecare:     78.2,   // Weighted avg — OSB updated to 91.1%; Ascend rates held from prior
  },

  // Collections: EXACT from Production/Collection Summary by location 04/01–04/20
  // Production: gross estimated from ProviderTotals provider assignments, scaled proportionally
  // Note: HNR/HNS/PR collectionRate >100% = collecting heavily from prior AR (expected for startups)
  locations: [
    { code:'LKW', production:416000, collections:188716, collectionRate:45.4, newPatients:83,  recareRate:79.1, phoneAnswerRate:63.7, activePatients:534, suppliesPct:5.76, status:'watch'    },
    { code:'LT',  production:214000, collections:113440, collectionRate:53.0, newPatients:42,  recareRate:82.4, phoneAnswerRate:73.7, activePatients:421, suppliesPct:5.38, status:'watch'    },
    { code:'HNR', production:60000,  collections:80784,  collectionRate:134.6,newPatients:61,  recareRate:71.2, phoneAnswerRate:66.1, activePatients:298, suppliesPct:6.92, status:'excellent'},
    { code:'HNS', production:142000, collections:44857,  collectionRate:31.6, newPatients:40,  recareRate:66.4, phoneAnswerRate:65.0, activePatients:276, suppliesPct:3.62, status:'on_pace' },
    { code:'PB',  production:347000, collections:201197, collectionRate:58.0, newPatients:66,  recareRate:88.1, phoneAnswerRate:61.8, activePatients:389, suppliesPct:6.77, status:'on_pace' },
    { code:'PR',  production:282000, collections:116402, collectionRate:41.3, newPatients:63,  recareRate:91.2, phoneAnswerRate:68.0, activePatients:321, suppliesPct:10.58,status:'excellent'},
    { code:'OSB', production:105320, collections:88862,  collectionRate:84.4, newPatients:41,  recareRate:91.1, phoneAnswerRate:68.7, activePatients:292, suppliesPct:2.09, status:'critical', isOSB:true },
  ],

  // Source: Dentrix ProviderTotals 04/01–04/20/2026 + Dental Intel OSB 04/21 pull
  // Gross = Procedure Charges column; daysWorked = 13 full days (Apr 20 = BD13 complete)
  doctors: [
    { name:'Nichols, Christopher', locationCode:'LKW', grossProd:216929, collections:88333,  collRate:40.7, prodPerDay:16687, daysWorked:13, ytdProd:1350000 },
    { name:'Proctor, Sarah',       locationCode:'PB',  grossProd:180228, collections:109682, collRate:60.9, prodPerDay:13864, daysWorked:13, ytdProd:930000  },
    { name:'Weathers, L\'Cris',    locationCode:'PR',  grossProd:175884, collections:76869,  collRate:43.7, prodPerDay:13529, daysWorked:13, ytdProd:780000  },
    { name:'Ballard, Erin',        locationCode:'PB',  grossProd:137413, collections:63241,  collRate:46.0, prodPerDay:10570, daysWorked:13, ytdProd:550000  },
    { name:'Connolly, Noah',       locationCode:'HNS', grossProd:114159, collections:59496,  collRate:52.1, prodPerDay:8781,  daysWorked:13, ytdProd:545000  },
    { name:'Nichols, Patrick',     locationCode:'LT',  grossProd:102334, collections:56940,  collRate:55.6, prodPerDay:7872,  daysWorked:13, ytdProd:495000  },
    { name:'Walters, Carrie',      locationCode:'LKW', grossProd:87897,  collections:35296,  collRate:40.2, prodPerDay:6762,  daysWorked:13, ytdProd:400000  },
    { name:'Osbourne, Brian',      locationCode:'OSB', grossProd:66146,  collections:57764,  collRate:87.3, prodPerDay:5088,  daysWorked:13, ytdProd:155000, isOSB:true },
    { name:'Skaggs, Ernest',       locationCode:'HNR', grossProd:55000,  collections:29365,  collRate:53.4, prodPerDay:4231,  daysWorked:13, ytdProd:110000  },
    { name:'Decker Haycraft, Kara',locationCode:'LT',  grossProd:51686,  collections:23453,  collRate:45.4, prodPerDay:3976,  daysWorked:13, ytdProd:150000  },
    { name:'Chadwick, Evan',       locationCode:'PR',  grossProd:44583,  collections:20345,  collRate:45.6, prodPerDay:3429,  daysWorked:13, ytdProd:150000  },
    { name:'Gleason, Robert',      locationCode:'LKW', grossProd:41463,  collections:29320,  collRate:70.7, prodPerDay:3189,  daysWorked:13, ytdProd:378000  },
  ],

  // Source: Dentrix ProviderTotals + Time Clock 04/01–04/20/2026
  // OSB: Dental Intel providers-performance-2026-4-21.csv
  hygienists: [
    // ── LT ──
    { name:'Howell, Dana',     locationCode:'LT',  grossProd:17565, collections:6963,  collRate:39.6, hoursWorked:95.5,  prodPerHr:184, recareRate:82.4 },
    { name:'Morris, Amber',    locationCode:'LT',  grossProd:13623, collections:11396, collRate:83.6, hoursWorked:100.2, prodPerHr:136, recareRate:79.0 },
    { name:'Kittle, Jolena',   locationCode:'LT',  grossProd:9585,  collections:4784,  collRate:49.9, hoursWorked:65.9,  prodPerHr:145, recareRate:75.0 },
    { name:'Harned, Stacy',    locationCode:'LT',  grossProd:8088,  collections:3617,  collRate:44.7, hoursWorked:59.9,  prodPerHr:135, recareRate:80.0 },
    { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:7031,  collections:3731,  collRate:53.1, hoursWorked:39.6,  prodPerHr:177, recareRate:78.0 },
    // ── LKW ──
    { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:15876, collections:6709,  collRate:42.3, hoursWorked:98.5,  prodPerHr:161, recareRate:79.0 },
    { name:'Woosley, Emily',   locationCode:'LKW', grossProd:12279, collections:4908,  collRate:40.0, hoursWorked:94.1,  prodPerHr:131, recareRate:79.0 },
    { name:'Payne, McKay',     locationCode:'LKW', grossProd:11323, collections:4525,  collRate:40.0, hoursWorked:77.8,  prodPerHr:145, recareRate:79.0 },
    { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:8821,  collections:4708,  collRate:53.4, hoursWorked:94.0,  prodPerHr:94,  recareRate:79.0 },
    { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:7900,  collections:5260,  collRate:66.6, hoursWorked:54.9,  prodPerHr:144, recareRate:79.0 },
    { name:'Blandford, Cassi', locationCode:'LKW', grossProd:8847,  collections:5338,  collRate:60.3, hoursWorked:60.7,  prodPerHr:146, recareRate:79.1 },
    { name:'Berry, Tasha',     locationCode:'LKW', grossProd:8050,  collections:4341,  collRate:53.9, hoursWorked:64.2,  prodPerHr:125, recareRate:79.1 },
    { name:'Youart, Britney',  locationCode:'LKW', grossProd:6144,  collections:2540,  collRate:41.3, hoursWorked:38.3,  prodPerHr:161, recareRate:79.1 },
    { name:'Vowels, Susan',    locationCode:'LKW', grossProd:5873,  collections:3500,  collRate:59.6, hoursWorked:44.1,  prodPerHr:133, recareRate:79.0 },
    { name:'Bewley, Emma',     locationCode:'LKW', grossProd:1442,  collections:3499,  collRate:99.9, hoursWorked:12.7,  prodPerHr:113, recareRate:79.1 },
    // ── PR (Proctor Radcliff) ──
    { name:'Jones, Chad',      locationCode:'PR',  grossProd:29653, collections:17352, collRate:58.5, hoursWorked:70.3,  prodPerHr:422, recareRate:79.0 },
    { name:'Lynch, Cassie',    locationCode:'PR',  grossProd:14139, collections:11010, collRate:77.9, hoursWorked:78.4,  prodPerHr:180, recareRate:79.0 },
    // ── PB (Proctor Bardstown) ──
    { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:24137, collections:10582, collRate:43.8, hoursWorked:94.9,  prodPerHr:254, recareRate:79.0 },
    { name:'Wires, Tanya',     locationCode:'PB',  grossProd:17574, collections:10191, collRate:58.0, hoursWorked:79.3,  prodPerHr:222, recareRate:79.0 },
    // ── HNS (H&N Shepherdsville) ──
    { name:'Logsdon, Megan',   locationCode:'HNS', grossProd:14414, collections:7035,  collRate:48.8, hoursWorked:95.1,  prodPerHr:152, recareRate:79.0 },
    // ── OSB (Dental Intel — manual source) ──
    { name:'Haydon, Kelsey',   locationCode:'OSB', grossProd:8270,  collections:4797,  collRate:58.0, hoursWorked:80.0,  prodPerHr:103, recareRate:92.0, isOSB:true },
    { name:'Culver, Angela',   locationCode:'OSB', grossProd:7341,  collections:4829,  collRate:65.8, hoursWorked:80.0,  prodPerHr:92,  recareRate:88.0, isOSB:true },
    { name:'Ulrich, Leigh',    locationCode:'OSB', grossProd:6519,  collections:4342,  collRate:66.6, hoursWorked:80.0,  prodPerHr:81,  recareRate:85.0, isOSB:true },
    { name:'Greenwell, Denise',locationCode:'OSB', grossProd:4042,  collections:2386,  collRate:59.0, hoursWorked:45.0,  prodPerHr:90,  recareRate:85.0, isOSB:true },
    { name:'Yates, Jaclyn',    locationCode:'OSB', grossProd:2351,  collections:4520,  collRate:99.9, hoursWorked:35.0,  prodPerHr:67,  recareRate:85.0, isOSB:true },
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

  // Source: Dentrix AgedReceivables 04/21/2026 pull + Dental Intel OSB ar-overview 04/21/2026
  // Totals = gross AR before unapplied credits; insuranceAR/patientAR = actual portions (excl. est. writeoffs)
  // arToProd = AR total / projected full-month gross (MTD gross × 21/14)
  ar: {
    asOf: '04/21/2026',
    healthScore: 46,
    total: 2051616,
    buckets: { d0_30: 1217180, d31_60: 445827, d61_90: 173676, d90plus: 214931 },
    pcts:    { d0_30: 59.3,    d31_60: 21.7,   d61_90: 8.5,    d90plus: 10.5  },
    arToProdRatio: 0.87,
    locations: [
      { code:'LKW', total:727933, d0_30:358188, d31_60:189321, d61_90:80652, d90plus:99773,  pct0_30:49.2, pct31_60:26.0, pct61_90:11.1, pct90plus:13.7, insuranceAR:228174, patientAR:337451, patientPct:46, arToProd:1.17, status:'needs_work' },
      { code:'LT',  total:280585, d0_30:169276, d31_60:70520,  d61_90:14304, d90plus:26485,  pct0_30:60.3, pct31_60:25.1, pct61_90:5.1,  pct90plus:9.4,  insuranceAR:116383, patientAR:42849,  patientPct:15, arToProd:0.87, status:'watch'     },
      { code:'HNR', total:186463, d0_30:108839, d31_60:34710,  d61_90:14032, d90plus:28882,  pct0_30:58.4, pct31_60:18.6, pct61_90:7.5,  pct90plus:15.5, insuranceAR:77314,  patientAR:62036,  patientPct:33, arToProd:2.07, status:'needs_work' },
      { code:'HNS', total:43890,  d0_30:33557,  d31_60:5440,   d61_90:767,   d90plus:4126,   pct0_30:76.5, pct31_60:12.4, pct61_90:1.7,  pct90plus:9.4,  insuranceAR:20424,  patientAR:12874,  patientPct:29, arToProd:0.21, status:'good'      },
      { code:'PB',  total:286430, d0_30:232522, d31_60:24399,  d61_90:25850, d90plus:3658,   pct0_30:81.2, pct31_60:8.5,  pct61_90:9.0,  pct90plus:1.3,  insuranceAR:123457, patientAR:49783,  patientPct:17, arToProd:0.55, status:'watch'     },
      { code:'PR',  total:296295, d0_30:137336, d31_60:106108, d61_90:26716, d90plus:26134,  pct0_30:46.4, pct31_60:35.8, pct61_90:9.0,  pct90plus:8.8,  insuranceAR:105067, patientAR:159932, patientPct:54, arToProd:0.70, status:'watch'     },
      { code:'OSB', total:230020, d0_30:177462, d31_60:15329,  d61_90:11355, d90plus:25873,  pct0_30:77.1, pct31_60:6.7,  pct61_90:4.9,  pct90plus:11.2, insuranceAR:148465, patientAR:81554,  patientPct:35, arToProd:1.46, status:'needs_work', isOSB:true },
    ],
  },
}
