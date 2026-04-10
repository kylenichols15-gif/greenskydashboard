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
  LKW: 120000, LT: 100000, HNR: 70000, HNS: 65000, PB: 80000, PR: 55000, OSB: 30000,
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

// April 2026 — as of April 9, 2026 (7 business days complete)
export const PERIOD_INFO = {
  label:          'April 2026',
  totalBizDays:   22,
  daysComplete:   7,
  daysRemaining:  15,
}

// ─── Live Data (Sources: Dentrix Ascend ProviderTotals + AgedReceivables + Dental Intel OSB) ───
// Updated: 04/09/2026 | Period: 04/01–04/09/2026 (7 biz days)
// NOTE: Collection rates early-month include payments applied to prior-period AR — normalize over the month
export const DEMO_DATA = {
  period: 'April 2026',
  org: {
    production:       709976,   // Gross production, all 7 locations — Dentrix Procedure Charges
    productionGoal:  2400000,   // Full-month gross production target (March record: $2.26M)
    collections:      394906,   // Payments applied 04/01–04/09 — includes prior-period AR catch-up
    collectionsGoal: 1300000,   // Monthly collections target (March projected: $1.25M)
    newPatients:        191,    // LKW:40 LT:23 HNR:24 HNS:21 PB:32 PR:32 OSB:19
    activePatients:    2531,
    phoneAnswerRate:   71.4,    // Placeholder — update from Mango Voice
    hygieneRecare:     78.2,    // Placeholder — update from Dentrix hygiene report
  },

  // NOTE: collectionRate = MTD applied payments / MTD gross production.
  // HNR >100% and PR <20% are expected early-month due to AR timing — not errors.
  locations: [
    { code:'LKW', production:176742, collections:87178,  collectionRate:49.3, newPatients:40, recareRate:79.1, phoneAnswerRate:46.2, activePatients:534, suppliesPct:6.8, status:'behind'   },
    { code:'LT',  production:97440,  collections:64632,  collectionRate:66.3, newPatients:23, recareRate:82.4, phoneAnswerRate:74.1, activePatients:421, suppliesPct:5.9, status:'on_pace'  },
    { code:'HNR', production:23703,  collections:53787,  collectionRate:99.9, newPatients:24, recareRate:71.2, phoneAnswerRate:68.3, activePatients:298, suppliesPct:7.1, status:'critical' },
    { code:'HNS', production:57169,  collections:22411,  collectionRate:39.2, newPatients:21, recareRate:66.4, phoneAnswerRate:72.1, activePatients:276, suppliesPct:7.4, status:'critical' },
    { code:'PB',  production:116348, collections:103382, collectionRate:88.9, newPatients:32, recareRate:88.1, phoneAnswerRate:83.4, activePatients:389, suppliesPct:5.4, status:'on_pace'  },
    { code:'PR',  production:188424, collections:19471,  collectionRate:10.3, newPatients:32, recareRate:91.2, phoneAnswerRate:97.1, activePatients:321, suppliesPct:5.1, status:'on_pace'  },
    { code:'OSB', production:50150,  collections:44045,  collectionRate:87.8, newPatients:19, recareRate:91.8, phoneAnswerRate:76.8, activePatients:292, suppliesPct:6.2, status:'on_pace', isOSB:true },
  ],

  // Source: Dentrix ProviderTotals 04/01–04/09/2026
  // ytdProd = estimated gross YTD (Jan–Apr) based on March MTD net × 2.26 gross/net ratio × 3 + April gross
  doctors: [
    { name:'Weathers, L\'Cris',    locationCode:'PR',  grossProd:96703,  collections:15516,  collRate:16.1, prodPerDay:13815, daysWorked:7, ytdProd:660000  },
    { name:'Ballard, Erin',        locationCode:'PB',  grossProd:84181,  collections:27828,  collRate:33.1, prodPerDay:12026, daysWorked:7, ytdProd:430000  },
    { name:'Nichols, Christopher', locationCode:'LKW', grossProd:67300,  collections:35423,  collRate:52.6, prodPerDay:9614,  daysWorked:7, ytdProd:1230000 },
    { name:'Connolly, Noah',       locationCode:'HNS', grossProd:58938,  collections:29525,  collRate:50.1, prodPerDay:8420,  daysWorked:7, ytdProd:440000  },
    { name:'Proctor, Sarah',       locationCode:'PB',  grossProd:50515,  collections:47227,  collRate:93.5, prodPerDay:7216,  daysWorked:7, ytdProd:785000  },
    { name:'Nichols, Patrick',     locationCode:'LT',  grossProd:49091,  collections:33516,  collRate:68.3, prodPerDay:7013,  daysWorked:7, ytdProd:420000  },
    { name:'Walters, Carrie',      locationCode:'LKW', grossProd:45047,  collections:15632,  collRate:34.7, prodPerDay:6435,  daysWorked:7, ytdProd:330000  },
    { name:'Osbourne, Brian',      locationCode:'OSB', grossProd:31365,  collections:28878,  collRate:92.1, prodPerDay:4481,  daysWorked:7, ytdProd:120000,  isOSB:true },
    { name:'Decker Haycraft, Kara',locationCode:'LT',  grossProd:26837,  collections:12936,  collRate:48.2, prodPerDay:3834,  daysWorked:7, ytdProd:120000  },
    { name:'Gleason, Robert',      locationCode:'LKW', grossProd:25283,  collections:18938,  collRate:74.9, prodPerDay:3612,  daysWorked:7, ytdProd:320000  },
    { name:'Skaggs, Ernest',       locationCode:'HNR', grossProd:16581,  collections:18483,  collRate:99.9, prodPerDay:2369,  daysWorked:7, ytdProd:80000   },
  ],

  // Source: Dentrix ProviderTotals + Time Clock 04/01–04/09/2026
  // recareRate = placeholder — update from Dentrix hygiene recare report
  hygienists: [
    { name:'Howell, Dana',    locationCode:'LT',  grossProd:6553, collections:3445, collRate:52.6, hoursWorked:44.0, prodPerHr:149, recareRate:82.4 },
    { name:'Kittle, Jolena',  locationCode:'LT',  grossProd:4048, collections:1960, collRate:48.4, hoursWorked:33.9, prodPerHr:120, recareRate:75.0 },
    { name:'Harned, Stacy',   locationCode:'LT',  grossProd:3654, collections:2232, collRate:61.1, hoursWorked:27.8, prodPerHr:132, recareRate:80.0 },
    { name:'Buzick, Rebecca', locationCode:'LT',  grossProd:2993, collections:2163, collRate:72.3, hoursWorked:19.8, prodPerHr:151, recareRate:78.0 },
    { name:'Blandford, Cassi',locationCode:'LKW', grossProd:2537, collections:3483, collRate:99.9, hoursWorked:18.3, prodPerHr:139, recareRate:79.1 },
    { name:'Youart, Britney', locationCode:'LKW', grossProd:1934, collections:1320, collRate:68.2, hoursWorked:13.6, prodPerHr:142, recareRate:79.1 },
    { name:'Berry, Tasha',    locationCode:'LKW', grossProd:1894, collections:2629, collRate:99.9, hoursWorked:18.0, prodPerHr:105, recareRate:79.1 },
    { name:'Bewley, Emma',    locationCode:'LKW', grossProd:1386, collections:2635, collRate:99.9, hoursWorked:7.1,  prodPerHr:195, recareRate:79.1 },
    { name:'Culver, Angela',  locationCode:'OSB', grossProd:3768, collections:2561, collRate:68.0, hoursWorked:48.0, prodPerHr:78,  recareRate:88.0, isOSB:true },
    { name:'Haydon, Kelsey',  locationCode:'OSB', grossProd:4184, collections:2571, collRate:61.4, hoursWorked:48.0, prodPerHr:87,  recareRate:92.0, isOSB:true },
    { name:'Greenwell, Denise',locationCode:'OSB',grossProd:2308, collections:1160, collRate:50.3, hoursWorked:32.0, prodPerHr:72,  recareRate:85.0, isOSB:true },
  ],

  // Placeholder — update manually from Mango Voice portal
  phones: [
    { code:'LKW', totalCalls:1124, answered:519,  missed:605, answerRate:46.2, estMissedRevenue:48400 },
    { code:'LT',  totalCalls:834,  answered:618,  missed:216, answerRate:74.1, estMissedRevenue:17280 },
    { code:'HNR', totalCalls:612,  answered:418,  missed:194, answerRate:68.3, estMissedRevenue:15520 },
    { code:'HNS', totalCalls:541,  answered:390,  missed:151, answerRate:72.1, estMissedRevenue:12080 },
    { code:'PB',  totalCalls:748,  answered:624,  missed:124, answerRate:83.4, estMissedRevenue:9920  },
    { code:'PR',  totalCalls:644,  answered:625,  missed:19,  answerRate:97.1, estMissedRevenue:1520  },
    { code:'OSB', totalCalls:312,  answered:240,  missed:72,  answerRate:76.9, estMissedRevenue:5760  },
  ],

  // Source: Dentrix AgedReceivables 04/09/2026 + Dental Intel OSB
  // arToProd = Total AR / projected monthly gross production
  ar: {
    asOf: '04/09/2026',
    healthScore: 47,
    total: 1900468,
    buckets: { d0_30: 1137156, d31_60: 408890, d61_90: 168083, d90plus: 186339 },
    pcts:    { d0_30: 59.8,    d31_60: 21.5,   d61_90: 8.8,    d90plus: 9.8 },
    arToProdRatio: 0.84,
    locations: [
      { code:'LKW', total:655907, d0_30:333769, d31_60:164127, d61_90:63300,  d90plus:94710,  pct0_30:50.9, pct31_60:25.0, pct61_90:9.7,  pct90plus:14.4, insuranceAR:207343, patientAR:319315, patientPct:61, arToProd:1.18, status:'needs_work' },
      { code:'LT',  total:248004, d0_30:144032, d31_60:66801,  d61_90:14202,  d90plus:22969,  pct0_30:58.1, pct31_60:26.9, pct61_90:5.7,  pct90plus:9.3,  insuranceAR:103495, patientAR:37763,  patientPct:27, arToProd:0.81, status:'needs_work' },
      { code:'HNR', total:168943, d0_30:99623,  d31_60:28056,  d61_90:13986,  d90plus:27278,  pct0_30:59.0, pct31_60:16.6, pct61_90:8.3,  pct90plus:16.2, insuranceAR:71408,  patientAR:51379,  patientPct:42, arToProd:2.27, status:'needs_work' },
      { code:'HNS', total:51489,  d0_30:43255,  d31_60:2488,   d61_90:1529,   d90plus:4218,   pct0_30:84.0, pct31_60:4.8,  pct61_90:3.0,  pct90plus:8.2,  insuranceAR:21483,  patientAR:10990,  patientPct:34, arToProd:0.29, status:'watch'     },
      { code:'PB',  total:269538, d0_30:171258, d31_60:64944,  d61_90:33336,  d90plus:0,      pct0_30:63.5, pct31_60:24.1, pct61_90:12.4, pct90plus:0.0,  insuranceAR:135509, patientAR:45794,  patientPct:25, arToProd:0.74, status:'watch'     },
      { code:'PR',  total:423721, d0_30:312072, d31_60:68050,  d61_90:27306,  d90plus:16294,  pct0_30:73.7, pct31_60:16.1, pct61_90:6.4,  pct90plus:3.8,  insuranceAR:170548, patientAR:192849, patientPct:53, arToProd:0.72, status:'watch'     },
      { code:'OSB', total:82866,  d0_30:33147,  d31_60:14424,  d61_90:14424,  d90plus:20870,  pct0_30:40.0, pct31_60:17.4, pct61_90:17.4, pct90plus:25.2, insuranceAR:42000,  patientAR:40866,  patientPct:49, arToProd:0.53, status:'needs_work', isOSB:true },
    ],
  },
}
