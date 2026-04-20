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

// April 2026 — as of April 18, 2026 (13 business days complete — Apr 3 Good Friday not worked)
export const PERIOD_INFO = {
  label:          'April 2026',
  dataAsOf:       'April 19',   // Date of last data pull — update with each refresh
  totalBizDays:   21,   // Good Friday (Apr 3) not worked
  daysComplete:   13,
  daysRemaining:  8,
}

// ─── Live Data — Sources: Dentrix + Mango Voice + Dental Intel OSB ───
// Production: ProviderTotals gross 04/01–04/19/2026 (Ascend) + Dental Intel OSB
// Collections: EXACT from Production/Collection Summary 04/01–04/19/2026 + Dental Intel OSB
// Phones: Mango Voice 04/01–04/20/2026 — ALL 7 LOCATIONS REFRESHED
// New Patients: Dentrix 04/01–04/19/2026 + Dental Intel OSB 04/01–04/19/2026
export const DEMO_DATA = {
  period: 'April 2026',
  org: {
    production:      1401129,  // $1,303,376 Ascend (ProviderTotals gross) + $97,753 OSB — 04/19
    productionGoal:  2400000,
    collections:      772563,  // $687,672 Ascend (Prod/Coll Summary exact) + $84,891 OSB — 04/19
    collectionsGoal: 1320000,
    newPatients:        351,   // LKW:75 LT:39 HNR:55 HNS:36 PB:50 PR:58 OSB:38
    activePatients:    2531,
    phoneAnswerRate:   66.2,   // Mango Voice 04/01–04/20 — all 7 confirmed (3,322 ans / 5,015 total)
    hygieneRecare:     78.2,   // Ascend placeholder — update from Dentrix hygiene report
  },

  // Collections: EXACT from Production/Collection Summary by location 04/01–04/19
  // Production: gross estimated from ProviderTotals provider assignments 04/01–04/19
  locations: [
    { code:'LKW', production:370000, collections:168651, collectionRate:45.6, newPatients:75, recareRate:79.1, phoneAnswerRate:63.7, activePatients:534, suppliesPct:5.76, status:'watch'    },
    { code:'LT',  production:190000, collections:102631, collectionRate:54.0, newPatients:39, recareRate:82.4, phoneAnswerRate:73.7, activePatients:421, suppliesPct:5.38, status:'watch'    },
    { code:'HNR', production:53000,  collections:73874,  collectionRate:99.9, newPatients:55, recareRate:71.2, phoneAnswerRate:66.1, activePatients:298, suppliesPct:6.92, status:'excellent'},
    { code:'HNS', production:126000, collections:35625,  collectionRate:28.3, newPatients:36, recareRate:66.4, phoneAnswerRate:65.0, activePatients:276, suppliesPct:3.62, status:'on_pace' },
    { code:'PB',  production:308000, collections:190697, collectionRate:61.9, newPatients:50, recareRate:88.1, phoneAnswerRate:61.8, activePatients:389, suppliesPct:6.77, status:'on_pace' },
    { code:'PR',  production:251000, collections:116402, collectionRate:46.4, newPatients:58, recareRate:91.2, phoneAnswerRate:68.0, activePatients:321, suppliesPct:10.58,status:'excellent'},
    { code:'OSB', production:97753,  collections:84891,  collectionRate:86.8, newPatients:38, recareRate:90.3, phoneAnswerRate:68.7, activePatients:292, suppliesPct:2.09, status:'critical', isOSB:true },
  ],

  // Source: Dentrix ProviderTotals 04/01–04/19/2026 (exact figures)
  doctors: [
    { name:'Nichols, Christopher', locationCode:'LKW', grossProd:170348, collections:78655, collRate:46.2, prodPerDay:13104, daysWorked:13, ytdProd:1330000 },
    { name:'Weathers, L\'Cris',    locationCode:'PR',  grossProd:167452, collections:76869, collRate:45.9, prodPerDay:12881, daysWorked:13, ytdProd:760000  },
    { name:'Proctor, Sarah',       locationCode:'PB',  grossProd:148100, collections:106914,collRate:72.2, prodPerDay:11392, daysWorked:13, ytdProd:900000  },
    { name:'Ballard, Erin',        locationCode:'PB',  grossProd:125674, collections:60232, collRate:47.9, prodPerDay:9667,  daysWorked:13, ytdProd:520000  },
    { name:'Connolly, Noah',       locationCode:'HNS', grossProd:112153, collections:51314, collRate:45.8, prodPerDay:8627,  daysWorked:13, ytdProd:530000  },
    { name:'Nichols, Patrick',     locationCode:'LT',  grossProd:86915,  collections:51342, collRate:59.1, prodPerDay:6686,  daysWorked:13, ytdProd:480000  },
    { name:'Walters, Carrie',      locationCode:'LKW', grossProd:81288,  collections:32976, collRate:40.6, prodPerDay:6253,  daysWorked:13, ytdProd:390000  },
    { name:'Osbourne, Brian',      locationCode:'OSB', grossProd:62199,  collections:55126, collRate:88.6, prodPerDay:4785,  daysWorked:13, ytdProd:150000, isOSB:true },
    { name:'Skaggs, Ernest',       locationCode:'HNR', grossProd:47383,  collections:26259, collRate:55.4, prodPerDay:3645,  daysWorked:13, ytdProd:105000  },
    { name:'Decker Haycraft, Kara',locationCode:'LT',  grossProd:47630,  collections:21949, collRate:46.1, prodPerDay:3664,  daysWorked:13, ytdProd:145000  },
    { name:'Chadwick, Evan',       locationCode:'PR',  grossProd:42975,  collections:18313, collRate:42.6, prodPerDay:3306,  daysWorked:13, ytdProd:145000  },
    { name:'Gleason, Robert',      locationCode:'LKW', grossProd:41371,  collections:28012, collRate:67.7, prodPerDay:3182,  daysWorked:13, ytdProd:375000  },
  ],

  // Source: Dentrix ProviderTotals + Time Clock 04/01–04/19/2026
  // Hours from Time Clock summary 04/01–04/19/2026
  // Location = primary/home location. Multi-loc providers rolled up under one name.
  // OSB: Dental Intel source (manual). Recare = estimated where not available.
  hygienists: [
    // ── LT ──
    { name:'Howell, Dana',     locationCode:'LT',  grossProd:16209, collections:6294,  collRate:38.8, hoursWorked:86.9,  prodPerHr:187, recareRate:82.4 },
    { name:'Morris, Amber',    locationCode:'LT',  grossProd:12229, collections:10371, collRate:84.8, hoursWorked:92.0,  prodPerHr:133, recareRate:79.0 },
    { name:'Kittle, Jolena',   locationCode:'LT',  grossProd:9585,  collections:4394,  collRate:45.8, hoursWorked:65.9,  prodPerHr:145, recareRate:75.0 },
    { name:'Harned, Stacy',    locationCode:'LT',  grossProd:7274,  collections:3561,  collRate:49.0, hoursWorked:51.9,  prodPerHr:140, recareRate:80.0 },
    { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:7031,  collections:3367,  collRate:47.9, hoursWorked:39.6,  prodPerHr:177, recareRate:78.0 },
    // ── LKW ──
    { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:14379, collections:6412,  collRate:44.6, hoursWorked:89.1,  prodPerHr:161, recareRate:79.0 },
    { name:'Woosley, Emily',   locationCode:'LKW', grossProd:11040, collections:4739,  collRate:42.9, hoursWorked:84.7,  prodPerHr:130, recareRate:79.0 },
    { name:'Payne, McKay',     locationCode:'LKW', grossProd:11323, collections:4398,  collRate:38.8, hoursWorked:77.8,  prodPerHr:146, recareRate:79.0 },
    { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:7979,  collections:4528,  collRate:56.7, hoursWorked:84.2,  prodPerHr:95,  recareRate:79.0 },
    { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:7900,  collections:5260,  collRate:66.6, hoursWorked:54.9,  prodPerHr:144, recareRate:79.0 },
    { name:'Blandford, Cassi', locationCode:'LKW', grossProd:7381,  collections:5129,  collRate:69.5, hoursWorked:51.7,  prodPerHr:143, recareRate:79.1 },
    { name:'Berry, Tasha',     locationCode:'LKW', grossProd:6622,  collections:4163,  collRate:62.9, hoursWorked:55.0,  prodPerHr:120, recareRate:79.1 },
    { name:'Youart, Britney',  locationCode:'LKW', grossProd:4860,  collections:2075,  collRate:42.7, hoursWorked:31.4,  prodPerHr:155, recareRate:79.1 },
    { name:'Vowels, Susan',    locationCode:'LKW', grossProd:4547,  collections:3314,  collRate:72.9, hoursWorked:34.5,  prodPerHr:132, recareRate:79.0 },
    { name:'Bewley, Emma',     locationCode:'LKW', grossProd:1442,  collections:3372,  collRate:99.9, hoursWorked:12.7,  prodPerHr:113, recareRate:79.1 },
    // ── PR (Proctor Radcliff) ──
    { name:'Jones, Chad',      locationCode:'PR',  grossProd:26043, collections:17352, collRate:66.6, hoursWorked:61.8,  prodPerHr:421, recareRate:79.0 },
    { name:'Lynch, Cassie',    locationCode:'PR',  grossProd:14139, collections:9725,  collRate:68.8, hoursWorked:78.4,  prodPerHr:180, recareRate:79.0 },
    // ── PB (Proctor Bardstown) ──
    { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:20389, collections:10659, collRate:52.3, hoursWorked:86.3,  prodPerHr:236, recareRate:79.0 },
    { name:'Wires, Tanya',     locationCode:'PB',  grossProd:14154, collections:9777,  collRate:69.1, hoursWorked:70.4,  prodPerHr:201, recareRate:79.0 },
    // ── HNS (H&N Shepherdsville) ──
    { name:'Logsdon, Megan',   locationCode:'HNS', grossProd:13776, collections:5902,  collRate:42.8, hoursWorked:86.7,  prodPerHr:159, recareRate:79.0 },
    // ── OSB (Dental Intel — manual source) ──
    { name:'Haydon, Kelsey',   locationCode:'OSB', grossProd:7674,  collections:4489,  collRate:58.5, hoursWorked:70.0,  prodPerHr:110, recareRate:92.0, isOSB:true },
    { name:'Culver, Angela',   locationCode:'OSB', grossProd:6592,  collections:4805,  collRate:72.9, hoursWorked:70.0,  prodPerHr:94,  recareRate:88.0, isOSB:true },
    { name:'Greenwell, Denise',locationCode:'OSB', grossProd:4042,  collections:2386,  collRate:59.0, hoursWorked:45.0,  prodPerHr:90,  recareRate:85.0, isOSB:true },
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

  // Source: Dentrix AgedReceivables 04/19/2026 + Dental Intel OSB operations report 04/19/2026
  // OSB AR buckets estimated from prior snapshot (total barely changed); 90+ exact from ops report
  // arToProd = AR balance / projected full-month gross (MTD gross × 21/13)
  ar: {
    asOf: '04/19/2026',
    healthScore: 46,
    total: 1962815,
    buckets: { d0_30: 1110637, d31_60: 455004, d61_90: 178449, d90plus: 217997 },
    pcts:    { d0_30: 56.6,    d31_60: 23.2,   d61_90: 9.1,    d90plus: 11.1  },
    arToProdRatio: 0.87,
    locations: [
      { code:'LKW', total:681219, d0_30:303713, d31_60:191654, d61_90:80487, d90plus:105365, pct0_30:44.6, pct31_60:28.1, pct61_90:11.8, pct90plus:15.5, insuranceAR:214353, patientAR:323185, patientPct:47, arToProd:1.14, status:'needs_work' },
      { code:'LT',  total:269026, d0_30:156403, d31_60:71842,  d61_90:13979, d90plus:26802,  pct0_30:58.1, pct31_60:26.7, pct61_90:5.2,  pct90plus:10.0, insuranceAR:111704, patientAR:41025,  patientPct:15, arToProd:0.88, status:'needs_work' },
      { code:'HNR', total:186411, d0_30:106940, d31_60:35978,  d61_90:13630, d90plus:29862,  pct0_30:57.4, pct31_60:19.3, pct61_90:7.3,  pct90plus:16.0, insuranceAR:79472,  patientAR:60603,  patientPct:33, arToProd:2.19, status:'needs_work' },
      { code:'HNS', total:61897,  d0_30:50945,  d31_60:5863,   d61_90:797,   d90plus:4293,   pct0_30:82.3, pct31_60:9.5,  pct61_90:1.3,  pct90plus:6.9,  insuranceAR:27356,  patientAR:13561,  patientPct:22, arToProd:0.30, status:'good'      },
      { code:'PB',  total:254024, d0_30:192307, d31_60:30058,  d61_90:28543, d90plus:3117,   pct0_30:75.7, pct31_60:11.8, pct61_90:11.2, pct90plus:1.2,  insuranceAR:98228,  patientAR:57004,  patientPct:22, arToProd:0.51, status:'watch'     },
      { code:'PR',  total:283289, d0_30:124330, d31_60:106108, d61_90:30014, d90plus:22836,  pct0_30:43.9, pct31_60:37.5, pct61_90:10.6, pct90plus:8.1,  insuranceAR:99752,  patientAR:153351, patientPct:54, arToProd:0.70, status:'watch'     },
      { code:'OSB', total:226948, d0_30:176500, d31_60:13500,  d61_90:11000, d90plus:25948,  pct0_30:77.8, pct31_60:5.9,  pct61_90:4.8,  pct90plus:11.4, insuranceAR:144341, patientAR:82607,  patientPct:36, arToProd:1.44, status:'needs_work', isOSB:true },
    ],
  },
}
