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

// April 2026 — data pulled 04/23/2026 (BD17 complete)
// Business days: Apr 1,2,3,6,7,8,9,10,13,14,15,16,17,20,21,22,23 = 17 complete
export const PERIOD_INFO = {
  label:          'April 2026',
  dataAsOf:       'April 23',   // Date of last data pull — update with each refresh
  totalBizDays:   22,           // All weekdays Apr 1–30 (Good Friday Apr 3 = working day)
  daysComplete:   17,
  daysRemaining:  5,
}

// ─── Live Data — Sources: Dentrix + Mango Voice + Dental Intel OSB ───
// Production (org gross): ProviderTotals (9) Procedure Charges 04/01–04/23 Ascend + Dental Intel OSB providers-performance 04/23
// Production (per location): NET from Production/Collection Summary (7) 04/01–04/23
// Collections: EXACT from Production/Collection Summary (7) 04/01–04/23 + Dental Intel OSB ar-overview 04/23
// Phones: Mango Voice 04/01–04/20 — no new pull (unchanged)
// New Patients: New Patients (9) Dentrix 04/01–04/23 + Dental Intel OSB operations-performance 04/23
// Recare: OSB only (92% from DI) — Ascend recare not in current export set; shown as — in UI
export const DEMO_DATA = {
  period: 'April 2026',
  org: {
    production:      1999511,  // $1,893,064 Ascend ProviderTotals (9) gross + $106,447 OSB
    productionGoal:  2400000,
    collections:     1009899,  // $874,377 Ascend Prod/Coll Summary (7) exact + $135,522 OSB
    collectionsGoal: 1320000,
    newPatients:        485,   // LKW:98 LT:48 HNR:78 HNS:54 PB:83 PR:78 OSB:46
    activePatients:    2531,
    phoneAnswerRate:   66.2,   // Mango Voice 04/01–04/20 — unchanged (no new pull)
    hygieneRecare:      0,     // No verified Ascend recare report — not displayed
  },

  // Collections: EXACT per location from Prod/Coll Summary (7)
  // Production: NET from Prod/Coll Summary (7) — after write-offs/adjustments
  // Note: HNR/PB/OSB collectionRate >100% = collecting on prior-month AR (expected)
  // recareRate: 0 = no verified data; UI shows "—". OSB only from DI operations-performance.
  locations: [
    { code:'LKW', production:342582, collections:232710, collectionRate:67.9,  newPatients:98, recareRate:0,    phoneAnswerRate:63.7, activePatients:534, suppliesPct:5.76, status:'on_pace'  },
    { code:'LT',  production:167693, collections:139959, collectionRate:83.5,  newPatients:48, recareRate:0,    phoneAnswerRate:73.7, activePatients:421, suppliesPct:5.38, status:'watch'    },
    { code:'HNR', production:80069,  collections:85639,  collectionRate:107.0, newPatients:78, recareRate:0,    phoneAnswerRate:66.1, activePatients:298, suppliesPct:6.92, status:'on_pace'  },
    { code:'HNS', production:68709,  collections:49454,  collectionRate:72.0,  newPatients:54, recareRate:0,    phoneAnswerRate:65.0, activePatients:276, suppliesPct:3.62, status:'on_pace'  },
    { code:'PB',  production:212538, collections:249626, collectionRate:117.5, newPatients:83, recareRate:0,    phoneAnswerRate:61.8, activePatients:389, suppliesPct:6.77, status:'on_pace'  },
    { code:'PR',  production:145296, collections:116989, collectionRate:80.5,  newPatients:78, recareRate:0,    phoneAnswerRate:68.0, activePatients:321, suppliesPct:10.58,status:'on_pace'  },
    { code:'OSB', production:76353,  collections:135522, collectionRate:177.5, newPatients:46, recareRate:92.0, phoneAnswerRate:68.7, activePatients:292, suppliesPct:2.09, status:'watch',   isOSB:true },
  ],

  // Source: Dentrix ProviderTotals (9) 04/01–04/23/2026 + Dental Intel OSB providers-performance 04/23
  // Gross = Procedure Charges column; daysWorked = 17 (BD17 complete Apr 23)
  doctors: [
    { name:'Nichols, Christopher', locationCode:'LKW', grossProd:276091, collections:110222, collRate:39.9, prodPerDay:16241, daysWorked:17, ytdProd:1350000 },
    { name:'Proctor, Sarah',       locationCode:'PB',  grossProd:254787, collections:142093, collRate:55.8, prodPerDay:14988, daysWorked:17, ytdProd:930000  },
    { name:'Weathers, L\'Cris',    locationCode:'PR',  grossProd:217576, collections:76952,  collRate:35.4, prodPerDay:12799, daysWorked:17, ytdProd:780000  },
    { name:'Ballard, Erin',        locationCode:'PB',  grossProd:172448, collections:73173,  collRate:42.4, prodPerDay:10144, daysWorked:17, ytdProd:550000  },
    { name:'Connolly, Noah',       locationCode:'HNS', grossProd:169119, collections:67653,  collRate:40.0, prodPerDay:9948,  daysWorked:17, ytdProd:545000  },
    { name:'Nichols, Patrick',     locationCode:'LT',  grossProd:129470, collections:72778,  collRate:56.2, prodPerDay:7616,  daysWorked:17, ytdProd:495000  },
    { name:'Walters, Carrie',      locationCode:'LKW', grossProd:108207, collections:46567,  collRate:43.0, prodPerDay:6365,  daysWorked:17, ytdProd:400000  },
    { name:'Skaggs, Ernest',       locationCode:'HNR', grossProd:68752,  collections:30804,  collRate:44.8, prodPerDay:4044,  daysWorked:17, ytdProd:110000  },
    { name:'Osbourne, Brian',      locationCode:'OSB', grossProd:66011,  collections:84177,  collRate:127.5,prodPerDay:3883,  daysWorked:17, ytdProd:155000, isOSB:true },
    { name:'Decker Haycraft, Kara',locationCode:'LT',  grossProd:62069,  collections:27771,  collRate:44.7, prodPerDay:3651,  daysWorked:17, ytdProd:150000  },
    { name:'Gleason, Robert',      locationCode:'LKW', grossProd:57910,  collections:32056,  collRate:55.4, prodPerDay:3407,  daysWorked:17, ytdProd:378000  },
    { name:'Chadwick, Evan',       locationCode:'PR',  grossProd:50518,  collections:23235,  collRate:46.0, prodPerDay:2972,  daysWorked:17, ytdProd:150000  },
  ],

  // Source: Dentrix ProviderTotals (9) + Time Clock 04/01–04/23/2026
  // OSB: Dental Intel providers-performance 04/23 — hours estimated (no Ascend time clock)
  // recareRate: 0 = no verified data for Ascend locations; OSB from DI operations-performance
  hygienists: [
    // ── LKW ──
    { name:'Howell, Dana',     locationCode:'LKW', grossProd:21365, collections:8901,  collRate:41.7, hoursWorked:119.95,prodPerHr:178, recareRate:0 },
    { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:19784, collections:8660,  collRate:43.8, hoursWorked:124.1, prodPerHr:159, recareRate:0 },
    { name:'Woosley, Emily',   locationCode:'LKW', grossProd:15281, collections:6516,  collRate:42.6, hoursWorked:114.32,prodPerHr:134, recareRate:0 },
    { name:'Payne, McKay',     locationCode:'LKW', grossProd:15074, collections:5857,  collRate:38.9, hoursWorked:102.36,prodPerHr:147, recareRate:0 },
    { name:'Blandford, Cassi', locationCode:'LKW', grossProd:12045, collections:6316,  collRate:52.4, hoursWorked:85.48, prodPerHr:141, recareRate:0 },
    { name:'Berry, Tasha',     locationCode:'LKW', grossProd:12041, collections:5587,  collRate:46.4, hoursWorked:82.12, prodPerHr:147, recareRate:0 },
    { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:11951, collections:6574,  collRate:55.0, hoursWorked:119.42,prodPerHr:100, recareRate:0 },
    { name:'Vowels, Susan',    locationCode:'LKW', grossProd:8139,  collections:4335,  collRate:53.3, hoursWorked:61.82, prodPerHr:132, recareRate:0 },
    { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:7900,  collections:6458,  collRate:81.7, hoursWorked:54.89, prodPerHr:144, recareRate:0 },
    { name:'Youart, Britney',  locationCode:'LKW', grossProd:7147,  collections:3748,  collRate:52.4, hoursWorked:45.51, prodPerHr:157, recareRate:0 },
    { name:'Bewley, Emma',     locationCode:'LKW', grossProd:3004,  collections:3634,  collRate:121.0,hoursWorked:17.16, prodPerHr:175, recareRate:0 },
    // ── LT ──
    { name:'Logsdon, Megan',   locationCode:'LT',  grossProd:18236, collections:7690,  collRate:42.2, hoursWorked:122.38,prodPerHr:149, recareRate:0 },
    { name:'Morris, Amber',    locationCode:'LT',  grossProd:17262, collections:11824, collRate:68.5, hoursWorked:123.67,prodPerHr:140, recareRate:0 },
    { name:'Harned, Stacy',    locationCode:'LT',  grossProd:10340, collections:4813,  collRate:46.5, hoursWorked:75.85, prodPerHr:136, recareRate:0 },
    { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:7779,  collections:4120,  collRate:53.0, hoursWorked:48.16, prodPerHr:162, recareRate:0 },
    // ── PR (Proctor Radcliff) ──
    { name:'Jones, Chad',      locationCode:'PR',  grossProd:42903, collections:17352, collRate:40.4, hoursWorked:95.34, prodPerHr:450, recareRate:0 },
    { name:'Wires, Tanya',     locationCode:'PR',  grossProd:26514, collections:12395, collRate:46.8, hoursWorked:105.92,prodPerHr:250, recareRate:0 },
    { name:'Lynch, Cassie',    locationCode:'PR',  grossProd:20608, collections:11320, collRate:54.9, hoursWorked:104.02,prodPerHr:198, recareRate:0 },
    // ── PB (Proctor Bardstown) ──
    { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:36499, collections:14310, collRate:39.2, hoursWorked:120.74,prodPerHr:302, recareRate:0 },
    { name:'Kittle, Jolena',   locationCode:'PB',  grossProd:12245, collections:5572,  collRate:45.5, hoursWorked:83.26, prodPerHr:147, recareRate:0 },
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

  // Source: Dentrix AgedReceivables (9) 04/23/2026 + Dental Intel OSB ar-overview 04/23/2026
  // Totals = gross AR before unapplied credits; insuranceAR/patientAR from location sections
  // arToProdRatio = org AR / projected full-month gross (ProviderTotals gross × 22/17)
  // arToProd per location = loc AR / projected full-month net (Prod/Coll Summary net × 22/17)
  ar: {
    asOf: '04/23/2026',
    healthScore: 49,
    total: 2197174,   // Ascend $2,000,503 + OSB $196,671
    buckets: { d0_30: 1348996, d31_60: 477131, d61_90: 155744, d90plus: 215303 },
    pcts:    { d0_30: 61.4,    d31_60: 21.7,   d61_90: 7.1,    d90plus: 9.8   },
    arToProdRatio: 0.85,
    locations: [
      { code:'LKW', total:749593,  d0_30:366521, d31_60:205052, d61_90:73188,  d90plus:104832, pct0_30:48.9, pct31_60:27.4, pct61_90:9.8,  pct90plus:14.0, insuranceAR:237759, patientAR:341734, patientPct:46, arToProd:1.69, status:'needs_work' },
      { code:'LT',  total:288233,  d0_30:178841, d31_60:70217,  d61_90:14264,  d90plus:24911,  pct0_30:62.0, pct31_60:24.4, pct61_90:4.9,  pct90plus:8.6,  insuranceAR:114752, patientAR:45392,  patientPct:16, arToProd:1.33, status:'watch'     },
      { code:'HNR', total:214353,  d0_30:133148, d31_60:38226,  d61_90:13862,  d90plus:29117,  pct0_30:62.1, pct31_60:17.8, pct61_90:6.5,  pct90plus:13.6, insuranceAR:89961,  patientAR:64884,  patientPct:30, arToProd:2.07, status:'needs_work' },
      { code:'HNS', total:67696,   d0_30:54508,  d31_60:8295,   d61_90:767,    d90plus:4126,   pct0_30:80.5, pct31_60:12.3, pct61_90:1.1,  pct90plus:6.1,  insuranceAR:30858,  patientAR:14464,  patientPct:21, arToProd:0.76, status:'watch'     },
      { code:'PB',  total:292220,  d0_30:235862, d31_60:27407,  d61_90:20036,  d90plus:8915,   pct0_30:80.7, pct31_60:9.4,  pct61_90:6.9,  pct90plus:3.1,  insuranceAR:133471, patientAR:44647,  patientPct:15, arToProd:1.06, status:'good'      },
      { code:'PR',  total:388408,  d0_30:222760, d31_60:112996, d61_90:22810,  d90plus:29841,  pct0_30:57.4, pct31_60:29.1, pct61_90:5.9,  pct90plus:7.7,  insuranceAR:136766, patientAR:210986, patientPct:54, arToProd:2.07, status:'watch'     },
      { code:'OSB', total:196671,  d0_30:157355, d31_60:14939,  d61_90:10817,  d90plus:13560,  pct0_30:80.0, pct31_60:7.6,  pct61_90:5.5,  pct90plus:6.9,  insuranceAR:128998, patientAR:67674,  patientPct:34, arToProd:1.87, status:'watch',    isOSB:true },
    ],
  },
}
