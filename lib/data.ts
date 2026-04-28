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

// April 2026 — data pulled 04/27/2026 (BD19 complete)
// Business days: Apr 1,2,3,6,7,8,9,10,13,14,15,16,17,20,21,22,23,24,27 = 19 complete
export const PERIOD_INFO = {
  label:          'April 2026',
  dataAsOf:       'April 27',   // Date of last data pull — update with each refresh
  totalBizDays:   22,           // All weekdays Apr 1–30 (Good Friday Apr 3 = working day)
  daysComplete:   19,
  daysRemaining:  3,
}

// ─── Live Data — Sources: Dentrix + Mango Voice + Dental Intel OSB ───
// Production (org gross): ProviderTotals (11) Procedure Charges 04/01–04/27 Ascend + Dental Intel OSB providers-performance 04/27
// Production (per location): NET from Production/Collection Summary (9) 04/01–04/27
// Collections: EXACT from Production/Collection Summary (9) 04/01–04/27 + Dental Intel OSB ar-overview 04/27
// Phones: Mango Voice 04/01–04/27 — ALL 7 locations confirmed from screenshots
// New Patients: New Patients (11) Dentrix 04/01–04/27 + Dental Intel OSB operations-performance 04/27
// Recare: OSB only (92.7% from DI) — Ascend recare not in current export set; shown as — in UI
// Note: PB net production reflects retroactive write-offs entered 04/25–27; collections continued up
export const DEMO_DATA = {
  period: 'April 2026',
  org: {
    production:      2247805,  // $2,124,449 Ascend ProviderTotals (11) gross + $123,356 OSB (DI carry-forward)
    productionGoal:  2400000,
    collections:     1141871,  // $992,615 Ascend Prod/Coll Summary (9) exact + $149,256 OSB
    collectionsGoal: 1320000,
    newPatients:        532,   // LKW:106 LT:53 HNR:87 HNS:58 PB:94 PR:86 OSB:48
    activePatients:    2531,
    phoneAnswerRate:   68.3,   // Mango Voice 04/01–04/27 — all 7 locations confirmed from screenshots
    hygieneRecare:      0,     // No verified Ascend recare report — not displayed
  },

  // Collections: EXACT per location from Prod/Coll Summary (9)
  // Production: NET from Prod/Coll Summary (9) — after write-offs/adjustments
  // Note: PB/PR/HNR/OSB collectionRate >100% = collecting on prior-month AR (expected)
  // recareRate: 0 = no verified data; UI shows "—". OSB only from DI operations-performance.
  locations: [
    { code:'LKW', production:383393, collections:280850, collectionRate:73.3,  newPatients:106, recareRate:0,    phoneAnswerRate:69.5, activePatients:534, suppliesPct:5.76, status:'on_pace'  },
    { code:'LT',  production:179656, collections:154861, collectionRate:86.2,  newPatients:53,  recareRate:0,    phoneAnswerRate:76.0, activePatients:421, suppliesPct:5.38, status:'watch'    },
    { code:'HNR', production:98238,  collections:88072,  collectionRate:89.7,  newPatients:87,  recareRate:0,    phoneAnswerRate:68.5, activePatients:298, suppliesPct:6.92, status:'on_pace'  },
    { code:'HNS', production:74964,  collections:53726,  collectionRate:71.7,  newPatients:58,  recareRate:0,    phoneAnswerRate:64.8, activePatients:276, suppliesPct:3.62, status:'on_pace'  },
    { code:'PB',  production:194278, collections:271280, collectionRate:139.6, newPatients:94,  recareRate:0,    phoneAnswerRate:59.4, activePatients:389, suppliesPct:6.77, status:'on_pace'  },
    { code:'PR',  production:128996, collections:143826, collectionRate:111.5, newPatients:86,  recareRate:0,    phoneAnswerRate:67.7, activePatients:321, suppliesPct:10.58,status:'on_pace'  },
    { code:'OSB', production:90621,  collections:149256, collectionRate:164.7, newPatients:48,  recareRate:92.7, phoneAnswerRate:71.9, activePatients:292, suppliesPct:2.09, status:'watch',   isOSB:true },
  ],

  // Source: Dentrix ProviderTotals (11) 04/01–04/27/2026 + Dental Intel OSB providers-performance 04/27
  // Gross = Procedure Charges column; daysWorked = 19 (BD19 complete Apr 27)
  doctors: [
    { name:'Nichols, Christopher', locationCode:'LKW', grossProd:322962, collections:138330, collRate:42.8, prodPerDay:16998, daysWorked:19, ytdProd:1350000 },
    { name:'Proctor, Sarah',       locationCode:'PB',  grossProd:266749, collections:154340, collRate:57.9, prodPerDay:14039, daysWorked:19, ytdProd:930000  },
    { name:'Weathers, L\'Cris',    locationCode:'PR',  grossProd:250474, collections:96467,  collRate:38.5, prodPerDay:13183, daysWorked:19, ytdProd:780000  },
    { name:'Connolly, Noah',       locationCode:'HNS', grossProd:187432, collections:77381,  collRate:41.3, prodPerDay:9865,  daysWorked:19, ytdProd:545000  },
    { name:'Ballard, Erin',        locationCode:'PB',  grossProd:184783, collections:78032,  collRate:42.2, prodPerDay:9725,  daysWorked:19, ytdProd:550000  },
    { name:'Nichols, Patrick',     locationCode:'LT',  grossProd:142607, collections:81790,  collRate:57.4, prodPerDay:7506,  daysWorked:19, ytdProd:495000  },
    { name:'Walters, Carrie',      locationCode:'LKW', grossProd:128116, collections:50954,  collRate:39.8, prodPerDay:6743,  daysWorked:19, ytdProd:400000  },
    { name:'Skaggs, Ernest',       locationCode:'HNR', grossProd:84507,  collections:32184,  collRate:38.1, prodPerDay:4448,  daysWorked:19, ytdProd:110000  },
    { name:'Osbourne, Brian',      locationCode:'OSB', grossProd:77392,  collections:93794,  collRate:121.2,prodPerDay:4073,  daysWorked:19, ytdProd:155000, isOSB:true },
    { name:'Decker Haycraft, Kara',locationCode:'LT',  grossProd:63742,  collections:28696,  collRate:45.0, prodPerDay:3355,  daysWorked:19, ytdProd:150000  },
    { name:'Gleason, Robert',      locationCode:'LKW', grossProd:62808,  collections:33860,  collRate:53.9, prodPerDay:3306,  daysWorked:19, ytdProd:378000  },
    { name:'Chadwick, Evan',       locationCode:'PR',  grossProd:50518,  collections:26414,  collRate:52.3, prodPerDay:2659,  daysWorked:19, ytdProd:150000  },
  ],

  // Source: Dentrix ProviderTotals (11) + Time Clock 04/01–04/27/2026
  // OSB: Dental Intel providers-performance 04/27 — hours estimated (no Ascend time clock)
  // recareRate: 0 = no verified data for Ascend locations; OSB from DI operations-performance
  hygienists: [
    // ── LKW ──
    { name:'Howell, Dana',     locationCode:'LKW', grossProd:23279, collections:9919,  collRate:42.6, hoursWorked:136.29,prodPerHr:171, recareRate:0 },
    { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:21088, collections:9588,  collRate:45.5, hoursWorked:133.50,prodPerHr:158, recareRate:0 },
    { name:'Woosley, Emily',   locationCode:'LKW', grossProd:17000, collections:7071,  collRate:41.6, hoursWorked:129.28,prodPerHr:132, recareRate:0 },
    { name:'Payne, McKay',     locationCode:'LKW', grossProd:16082, collections:6353,  collRate:39.5, hoursWorked:108.98,prodPerHr:148, recareRate:0 },
    { name:'Berry, Tasha',     locationCode:'LKW', grossProd:13377, collections:6594,  collRate:49.3, hoursWorked:90.63, prodPerHr:148, recareRate:0 },
    { name:'Blandford, Cassi', locationCode:'LKW', grossProd:12919, collections:6782,  collRate:52.5, hoursWorked:93.83, prodPerHr:138, recareRate:0 },
    { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:12907, collections:6814,  collRate:52.8, hoursWorked:129.38,prodPerHr:100, recareRate:0 },
    { name:'Vowels, Susan',    locationCode:'LKW', grossProd:9164,  collections:5319,  collRate:58.0, hoursWorked:70.69, prodPerHr:130, recareRate:0 },
    { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:9480,  collections:6605,  collRate:69.7, hoursWorked:63.24, prodPerHr:150, recareRate:0 },
    { name:'Youart, Britney',  locationCode:'LKW', grossProd:8894,  collections:4009,  collRate:45.1, hoursWorked:56.97, prodPerHr:156, recareRate:0 },
    { name:'Bewley, Emma',     locationCode:'LKW', grossProd:3905,  collections:3742,  collRate:95.8, hoursWorked:27.60, prodPerHr:142, recareRate:0 },
    // ── LT ──
    { name:'Logsdon, Megan',   locationCode:'LT',  grossProd:19954, collections:9019,  collRate:45.2, hoursWorked:131.73,prodPerHr:152, recareRate:0 },
    { name:'Morris, Amber',    locationCode:'LT',  grossProd:19240, collections:12143, collRate:63.1, hoursWorked:137.62,prodPerHr:140, recareRate:0 },
    { name:'Harned, Stacy',    locationCode:'LT',  grossProd:11430, collections:5166,  collRate:45.2, hoursWorked:84.26, prodPerHr:136, recareRate:0 },
    { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:8401,  collections:4557,  collRate:54.2, hoursWorked:53.37, prodPerHr:157, recareRate:0 },
    // ── PR (Proctor Radcliff) ──
    { name:'Jones, Chad',      locationCode:'PR',  grossProd:47956, collections:19686, collRate:41.1, hoursWorked:103.80,prodPerHr:462, recareRate:0 },
    { name:'Wires, Tanya',     locationCode:'PR',  grossProd:26514, collections:12517, collRate:47.2, hoursWorked:124.09,prodPerHr:214, recareRate:0 },
    { name:'Lynch, Cassie',    locationCode:'PR',  grossProd:21103, collections:10907, collRate:51.7, hoursWorked:115.96,prodPerHr:182, recareRate:0 },
    // ── PB (Proctor Bardstown) ──
    { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:40709, collections:14797, collRate:36.3, hoursWorked:129.48,prodPerHr:314, recareRate:0 },
    { name:'Kittle, Jolena',   locationCode:'PB',  grossProd:12245, collections:5927,  collRate:48.4, hoursWorked:83.26, prodPerHr:147, recareRate:0 },
    // ── HNS (H&N Shepherdsville) ──
    { name:'Logsdon, Megan',   locationCode:'HNS', grossProd:0,     collections:0,     collRate:0,    hoursWorked:0,     prodPerHr:0,   recareRate:0 },
    // ── OSB (Dental Intel — manual source, carry-forward from 04/24) ──
    { name:'Haydon, Kelsey',   locationCode:'OSB', grossProd:9179,  collections:8693,  collRate:94.7, hoursWorked:88.0,  prodPerHr:104, recareRate:92.7, isOSB:true },
    { name:'Culver, Angela',   locationCode:'OSB', grossProd:8890,  collections:7861,  collRate:88.4, hoursWorked:88.0,  prodPerHr:101, recareRate:92.7, isOSB:true },
    { name:'Ulrich, Leigh',    locationCode:'OSB', grossProd:8694,  collections:7242,  collRate:83.3, hoursWorked:88.0,  prodPerHr:99,  recareRate:92.7, isOSB:true },
    { name:'Greenwell, Denise',locationCode:'OSB', grossProd:5261,  collections:4024,  collRate:76.5, hoursWorked:45.0,  prodPerHr:117, recareRate:92.7, isOSB:true },
    { name:'Yates, Jaclyn',    locationCode:'OSB', grossProd:3662,  collections:6418,  collRate:175.3,hoursWorked:35.0,  prodPerHr:105, recareRate:92.7, isOSB:true },
  ],

  // Source: Mango Voice 04/01–04/27/2026 — ALL 7 locations confirmed from screenshots
  // PB/PR note: "External" calls (37.5%/30.9%) counted as missed — routed externally, not answered in-office
  phones: [
    { code:'LKW', totalCalls:1884, answered:1309, missed:575, answerRate:69.5, estMissedRevenue:101775 },
    { code:'LT',  totalCalls:890,  answered:676,  missed:214, answerRate:76.0, estMissedRevenue:37878  },
    { code:'HNR', totalCalls:878,  answered:601,  missed:277, answerRate:68.5, estMissedRevenue:49029  },
    { code:'HNS', totalCalls:491,  answered:318,  missed:173, answerRate:64.8, estMissedRevenue:30621  },
    { code:'PB',  totalCalls:1364, answered:810,  missed:554, answerRate:59.4, estMissedRevenue:98058  },
    { code:'PR',  totalCalls:1076, answered:728,  missed:348, answerRate:67.7, estMissedRevenue:61596  },
    { code:'OSB', totalCalls:1034, answered:743,  missed:291, answerRate:71.9, estMissedRevenue:51507  },
  ],

  // Source: Dentrix AgedReceivables (11) 04/27/2026 + Dental Intel OSB ar-overview (carry-forward 04/24)
  // Totals = gross AR before unapplied credits; insuranceAR/patientAR from location sections
  // arToProdRatio = org AR / projected full-month gross (ProviderTotals gross × 22/19)
  // arToProd per location = loc AR / projected full-month net (Prod/Coll Summary net × 22/19)
  ar: {
    asOf: '04/27/2026',
    healthScore: 49,
    total: 2128813,   // Ascend $1,930,508 + OSB $198,305 (carry-forward)
    buckets: { d0_30: 1266257, d31_60: 443516, d61_90: 205054, d90plus: 213987 },
    pcts:    { d0_30: 59.5,    d31_60: 20.8,   d61_90: 9.6,    d90plus: 10.1  },
    arToProdRatio: 0.87,
    locations: [
      { code:'LKW', total:745647,  d0_30:348397, d31_60:182486, d61_90:107758, d90plus:107006, pct0_30:46.7, pct31_60:24.5, pct61_90:14.5, pct90plus:14.4, insuranceAR:235152, patientAR:351168, patientPct:47, arToProd:1.68, status:'needs_work' },
      { code:'LT',  total:285874,  d0_30:172652, d31_60:57230,  d61_90:31159,  d90plus:24833,  pct0_30:60.4, pct31_60:20.0, pct61_90:10.9, pct90plus:8.7,  insuranceAR:115338, patientAR:42930,  patientPct:15, arToProd:1.37, status:'watch'     },
      { code:'HNR', total:230260,  d0_30:147098, d31_60:41257,  d61_90:15010,  d90plus:26895,  pct0_30:63.9, pct31_60:17.9, pct61_90:6.5,  pct90plus:11.7, insuranceAR:99375,  patientAR:65299,  patientPct:28, arToProd:2.02, status:'needs_work' },
      { code:'HNS', total:70027,   d0_30:56680,  d31_60:8090,   d61_90:1131,   d90plus:4126,   pct0_30:80.9, pct31_60:11.6, pct61_90:1.6,  pct90plus:5.9,  insuranceAR:29548,  patientAR:14998,  patientPct:21, arToProd:0.81, status:'watch'     },
      { code:'PB',  total:254351,  d0_30:212911, d31_60:20467,  d61_90:12057,  d90plus:8915,   pct0_30:83.7, pct31_60:8.0,  pct61_90:4.7,  pct90plus:3.5,  insuranceAR:111171, patientAR:47606,  patientPct:19, arToProd:1.13, status:'good'      },
      { code:'PR',  total:344350,  d0_30:171991, d31_60:115356, d61_90:27161,  d90plus:29841,  pct0_30:49.9, pct31_60:33.5, pct61_90:7.9,  pct90plus:8.7,  insuranceAR:120840, patientAR:185106, patientPct:54, arToProd:2.31, status:'watch'     },
      { code:'OSB', total:198305,  d0_30:156527, d31_60:18629,  d61_90:10777,  d90plus:12372,  pct0_30:79.0, pct31_60:9.4,  pct61_90:5.4,  pct90plus:6.2,  insuranceAR:126376, patientAR:71928,  patientPct:36, arToProd:1.89, status:'watch',    isOSB:true },
    ],
  },
}
