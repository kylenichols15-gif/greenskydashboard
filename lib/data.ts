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

// April 2026 — data pulled 04/21/2026 (BD15 complete)
// Business days: Apr 1,2,3,6,7,8,9,10,13,14,15,16,17,20,21 = 15 complete
export const PERIOD_INFO = {
  label:          'April 2026',
  dataAsOf:       'April 21',   // Date of last data pull — update with each refresh
  totalBizDays:   22,           // All weekdays Apr 1–30 (Good Friday Apr 3 = working day)
  daysComplete:   15,
  daysRemaining:  7,
}

// ─── Live Data — Sources: Dentrix + Mango Voice + Dental Intel OSB ───
// Production (org gross): ProviderTotals (7) Procedure Charges 04/01–04/21 Ascend + Dental Intel OSB
// Production (per location): NET from Production/Collection Summary (5) 04/01–04/21
// Collections: EXACT from Production/Collection Summary (5) 04/01–04/21 + Dental Intel OSB ar-overview
// Phones: Mango Voice 04/01–04/20 — no new screenshots this pull (unchanged)
// New Patients: New Patients (7) Dentrix 04/01–04/21 + Dental Intel OSB 04/21
export const DEMO_DATA = {
  period: 'April 2026',
  org: {
    production:      1777629,  // $1,661,698 Ascend ProviderTotals (7) gross + $115,931 OSB
    productionGoal:  2400000,
    collections:      943892,  // $833,485 Ascend Prod/Coll Summary (5) exact + $110,407 OSB
    collectionsGoal: 1320000,
    newPatients:        420,   // LKW:86 LT:44 HNR:65 HNS:44 PB:72 PR:66 OSB:43
    activePatients:    2531,
    phoneAnswerRate:   66.2,   // Mango Voice 04/01–04/20 — unchanged (no new pull)
    hygieneRecare:     78.2,   // Weighted avg — OSB 91.9%; Ascend rates held from prior pull
  },

  // Collections: EXACT per location from Prod/Coll Summary (5)
  // Production: NET from Prod/Coll Summary (5) — after write-offs/adjustments
  // Note: HNR/HNS/PB/PR/OSB collectionRate >100% = collecting on prior-month AR (expected)
  locations: [
    { code:'LKW', production:306421, collections:237049, collectionRate:77.4,  newPatients:86, recareRate:79.1, phoneAnswerRate:63.7, activePatients:534, suppliesPct:5.76, status:'on_pace'  },
    { code:'LT',  production:138837, collections:128719, collectionRate:92.7,  newPatients:44, recareRate:82.4, phoneAnswerRate:73.7, activePatients:421, suppliesPct:5.38, status:'watch'    },
    { code:'HNR', production:66500,  collections:84156,  collectionRate:126.6, newPatients:65, recareRate:71.2, phoneAnswerRate:66.1, activePatients:298, suppliesPct:6.92, status:'on_pace'  },
    { code:'HNS', production:41885,  collections:45357,  collectionRate:108.3, newPatients:44, recareRate:66.4, phoneAnswerRate:65.0, activePatients:276, suppliesPct:3.62, status:'on_pace'  },
    { code:'PB',  production:163328, collections:221720, collectionRate:135.7, newPatients:72, recareRate:88.1, phoneAnswerRate:61.8, activePatients:389, suppliesPct:6.77, status:'on_pace'  },
    { code:'PR',  production:95398,  collections:116484, collectionRate:122.1, newPatients:66, recareRate:91.2, phoneAnswerRate:68.0, activePatients:321, suppliesPct:10.58,status:'on_pace'  },
    { code:'OSB', production:100402, collections:110407, collectionRate:110.0, newPatients:43, recareRate:91.9, phoneAnswerRate:68.7, activePatients:292, suppliesPct:2.09, status:'critical', isOSB:true },
  ],

  // Source: Dentrix ProviderTotals (7) 04/01–04/21/2026 + Dental Intel OSB providers-performance (1)
  // Gross = Procedure Charges column; daysWorked = 15 (BD15 complete Apr 21)
  doctors: [
    { name:'Nichols, Christopher', locationCode:'LKW', grossProd:260113, collections:103256, collRate:39.7, prodPerDay:17341, daysWorked:15, ytdProd:1350000 },
    { name:'Proctor, Sarah',       locationCode:'PB',  grossProd:210698, collections:124412, collRate:59.0, prodPerDay:14047, daysWorked:15, ytdProd:930000  },
    { name:'Weathers, L\'Cris',    locationCode:'PR',  grossProd:184031, collections:76952,  collRate:41.8, prodPerDay:12269, daysWorked:15, ytdProd:780000  },
    { name:'Ballard, Erin',        locationCode:'PB',  grossProd:146815, collections:67111,  collRate:45.7, prodPerDay:9788,  daysWorked:15, ytdProd:550000  },
    { name:'Connolly, Noah',       locationCode:'HNS', grossProd:142534, collections:62673,  collRate:44.0, prodPerDay:9502,  daysWorked:15, ytdProd:545000  },
    { name:'Nichols, Patrick',     locationCode:'LT',  grossProd:112596, collections:64267,  collRate:57.1, prodPerDay:7506,  daysWorked:15, ytdProd:495000  },
    { name:'Walters, Carrie',      locationCode:'LKW', grossProd:94239,  collections:41330,  collRate:43.9, prodPerDay:6283,  daysWorked:15, ytdProd:400000  },
    { name:'Osbourne, Brian',      locationCode:'OSB', grossProd:72788,  collections:70209,  collRate:96.5, prodPerDay:4853,  daysWorked:15, ytdProd:155000, isOSB:true },
    { name:'Skaggs, Ernest',       locationCode:'HNR', grossProd:64328,  collections:30510,  collRate:47.4, prodPerDay:4289,  daysWorked:15, ytdProd:110000  },
    { name:'Decker Haycraft, Kara',locationCode:'LT',  grossProd:54828,  collections:25403,  collRate:46.3, prodPerDay:3655,  daysWorked:15, ytdProd:150000  },
    { name:'Chadwick, Evan',       locationCode:'PR',  grossProd:50518,  collections:22451,  collRate:44.4, prodPerDay:3368,  daysWorked:15, ytdProd:150000  },
    { name:'Gleason, Robert',      locationCode:'LKW', grossProd:48031,  collections:31221,  collRate:65.0, prodPerDay:3202,  daysWorked:15, ytdProd:378000  },
  ],

  // Source: Dentrix ProviderTotals (7) + Time Clock 04/01–04/21/2026
  // OSB: Dental Intel providers-performance (1) — hours estimated (no Ascend time clock)
  hygienists: [
    // ── LKW ──
    { name:'Howell, Dana',     locationCode:'LKW', grossProd:18827, collections:8275,  collRate:43.9, hoursWorked:103.9, prodPerHr:181, recareRate:79.1 },
    { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:17421, collections:7746,  collRate:44.5, hoursWorked:108.1, prodPerHr:161, recareRate:79.0 },
    { name:'Woosley, Emily',   locationCode:'LKW', grossProd:13617, collections:6023,  collRate:44.2, hoursWorked:102.7, prodPerHr:133, recareRate:79.0 },
    { name:'Payne, McKay',     locationCode:'LKW', grossProd:12085, collections:5506,  collRate:45.6, hoursWorked:85.4,  prodPerHr:142, recareRate:79.0 },
    { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:10401, collections:6072,  collRate:58.4, hoursWorked:103.0, prodPerHr:101, recareRate:79.0 },
    { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:7900,  collections:6192,  collRate:78.4, hoursWorked:54.9,  prodPerHr:144, recareRate:79.0 },
    { name:'Berry, Tasha',     locationCode:'LKW', grossProd:9454,  collections:5056,  collRate:53.5, hoursWorked:73.7,  prodPerHr:128, recareRate:79.1 },
    { name:'Youart, Britney',  locationCode:'LKW', grossProd:6144,  collections:3029,  collRate:49.3, hoursWorked:38.3,  prodPerHr:160, recareRate:79.1 },
    { name:'Vowels, Susan',    locationCode:'LKW', grossProd:6969,  collections:4124,  collRate:59.2, hoursWorked:53.3,  prodPerHr:131, recareRate:79.0 },
    { name:'Bewley, Emma',     locationCode:'LKW', grossProd:3004,  collections:3499,  collRate:99.9, hoursWorked:17.2,  prodPerHr:175, recareRate:79.1 },
    { name:'Blandford, Cassi', locationCode:'LKW', grossProd:9921,  collections:5912,  collRate:59.6, hoursWorked:69.2,  prodPerHr:143, recareRate:79.1 },
    // ── LT ──
    { name:'Morris, Amber',    locationCode:'LT',  grossProd:14857, collections:11819, collRate:79.6, hoursWorked:108.4, prodPerHr:137, recareRate:79.0 },
    { name:'Logsdon, Megan',   locationCode:'LT',  grossProd:16174, collections:7303,  collRate:45.1, hoursWorked:104.5, prodPerHr:155, recareRate:79.0 },
    { name:'Harned, Stacy',    locationCode:'LT',  grossProd:9184,  collections:4455,  collRate:48.5, hoursWorked:68.2,  prodPerHr:135, recareRate:80.0 },
    { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:7031,  collections:4129,  collRate:58.7, hoursWorked:39.6,  prodPerHr:177, recareRate:78.0 },
    // ── PR (Proctor Radcliff) ──
    { name:'Jones, Chad',      locationCode:'PR',  grossProd:34954, collections:17352, collRate:49.6, hoursWorked:79.4,  prodPerHr:440, recareRate:91.2 },
    { name:'Lynch, Cassie',    locationCode:'PR',  grossProd:15854, collections:10807, collRate:68.2, hoursWorked:87.1,  prodPerHr:182, recareRate:91.2 },
    { name:'Wires, Tanya',     locationCode:'PR',  grossProd:21127, collections:11019, collRate:52.2, hoursWorked:88.0,  prodPerHr:240, recareRate:91.2 },
    // ── PB (Proctor Bardstown) ──
    { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:29775, collections:11703, collRate:39.3, hoursWorked:103.3, prodPerHr:288, recareRate:88.1 },
    { name:'Kittle, Jolena',   locationCode:'PB',  grossProd:10746, collections:5133,  collRate:47.8, hoursWorked:74.7,  prodPerHr:144, recareRate:88.1 },
    // ── HNS (H&N Shepherdsville) ──
    { name:'Logsdon, Megan',   locationCode:'HNS', grossProd:0,     collections:0,     collRate:0,    hoursWorked:0,     prodPerHr:0,   recareRate:66.4 },
    // ── OSB (Dental Intel — manual source) ──
    { name:'Haydon, Kelsey',   locationCode:'OSB', grossProd:9084,  collections:6826,  collRate:75.2, hoursWorked:88.0,  prodPerHr:103, recareRate:91.9, isOSB:true },
    { name:'Culver, Angela',   locationCode:'OSB', grossProd:7981,  collections:6294,  collRate:78.9, hoursWorked:88.0,  prodPerHr:91,  recareRate:91.9, isOSB:true },
    { name:'Ulrich, Leigh',    locationCode:'OSB', grossProd:7376,  collections:5950,  collRate:80.7, hoursWorked:88.0,  prodPerHr:84,  recareRate:91.9, isOSB:true },
    { name:'Greenwell, Denise',locationCode:'OSB', grossProd:4020,  collections:3009,  collRate:74.8, hoursWorked:45.0,  prodPerHr:89,  recareRate:91.9, isOSB:true },
    { name:'Yates, Jaclyn',    locationCode:'OSB', grossProd:2804,  collections:5516,  collRate:99.9, hoursWorked:35.0,  prodPerHr:80,  recareRate:91.9, isOSB:true },
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
  // arToProd = AR total / projected full-month net (MTD net × 22/15)
  ar: {
    asOf: '04/21/2026',
    healthScore: 47,
    total: 2077629,   // Ascend $1,858,525 + OSB $219,104
    buckets: { d0_30: 1255100, d31_60: 435536, d61_90: 168274, d90plus: 218719 },
    pcts:    { d0_30: 60.4,    d31_60: 21.0,   d61_90: 8.1,    d90plus: 10.5  },
    arToProdRatio: 0.80,
    locations: [
      { code:'LKW', total:728814,  d0_30:365772, d31_60:183824, d61_90:79684,  d90plus:99534,  pct0_30:50.2, pct31_60:25.2, pct61_90:10.9, pct90plus:13.7, insuranceAR:224042, patientAR:342919, patientPct:47, arToProd:1.62, status:'needs_work' },
      { code:'LT',  total:273057,  d0_30:164766, d31_60:67478,  d61_90:14323,  d90plus:26489,  pct0_30:60.3, pct31_60:24.7, pct61_90:5.2,  pct90plus:9.7,  insuranceAR:111746, patientAR:43600,  patientPct:16, arToProd:1.34, status:'watch'     },
      { code:'HNR', total:200672,  d0_30:123873, d31_60:33293,  d61_90:14402,  d90plus:29105,  pct0_30:61.7, pct31_60:16.6, pct61_90:7.2,  pct90plus:14.5, insuranceAR:84011,  patientAR:64514,  patientPct:32, arToProd:2.06, status:'needs_work' },
      { code:'HNS', total:44968,   d0_30:34635,  d31_60:5440,   d61_90:767,    d90plus:4126,   pct0_30:77.0, pct31_60:12.1, pct61_90:1.7,  pct90plus:9.2,  insuranceAR:21103,  patientAR:12874,  patientPct:29, arToProd:0.73, status:'watch'     },
      { code:'PB',  total:272670,  d0_30:219305, d31_60:24188,  d61_90:21148,  d90plus:8028,   pct0_30:80.4, pct31_60:8.9,  pct61_90:7.8,  pct90plus:2.9,  insuranceAR:120865, patientAR:50441,  patientPct:19, arToProd:1.14, status:'watch'     },
      { code:'PR',  total:338345,  d0_30:179585, d31_60:106108, d61_90:26517,  d90plus:26134,  pct0_30:53.1, pct31_60:31.4, pct61_90:7.8,  pct90plus:7.7,  insuranceAR:119373, patientAR:182624, patientPct:54, arToProd:2.42, status:'needs_work' },
      { code:'OSB', total:219104,  d0_30:167164, d31_60:15205,  d61_90:11432,  d90plus:25303,  pct0_30:76.3, pct31_60:6.9,  pct61_90:5.2,  pct90plus:11.5, insuranceAR:138855, patientAR:80249,  patientPct:37, arToProd:1.49, status:'needs_work', isOSB:true },
    ],
  },
}
