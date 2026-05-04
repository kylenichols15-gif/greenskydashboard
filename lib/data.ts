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

// May 2026 — BD2 (2/21 business days complete — PARTIAL)
// Business days: May 1,2 complete; 4,5,6,7,8,9,12,13,14,15,16,19,20,21,22,23,27,28,29,30 remaining
// (Memorial Day May 26 = holiday excluded → 21 total biz days)
export const PERIOD_INFO = {
  label:          'May 2026',
  dataAsOf:       'May 4',      // Date of last data pull — update with each refresh
  totalBizDays:   21,
  daysComplete:   2,
  daysRemaining:  19,
}

// ─── Live Data — BD2 partial — Sources: Dentrix + Dental Intel OSB ───
// Production (org gross): Ascend ProviderTotals + OSB Dental Intel — 05/01–05/02 partial
// Location/Doctor/Hygienist breakdown: not yet compiled at BD2 — zeroed pending next pull
// Phones: not yet compiled at BD2 — zeroed
// AR: org total updated 05/04; bucket breakdown pending (reflects Apr 30 aging pending refresh)
export const DEMO_DATA = {
  period: 'May 2026',
  org: {
    production:      44652,    // Ascend + OSB BD2 partial — 05/01–05/02
    productionGoal:  2400000,
    collections:     42389,    // Ascend + OSB BD2 partial — 05/01–05/02
    collectionsGoal: 1320000,
    newPatients:        0,     // BD2 — not yet compiled
    activePatients:    2531,   // carry forward from April
    phoneAnswerRate:   0,      // BD2 — not yet compiled
    hygieneRecare:     0,
  },

  // BD2 — location breakdown not yet available; zeroed pending next Ascend pull
  locations: [
    { code:'LKW', production:0, collections:0, collectionRate:0, newPatients:0, recareRate:0, phoneAnswerRate:0, activePatients:534, suppliesPct:0, status:'on_pace'  },
    { code:'LT',  production:0, collections:0, collectionRate:0, newPatients:0, recareRate:0, phoneAnswerRate:0, activePatients:421, suppliesPct:0, status:'watch'    },
    { code:'HNR', production:0, collections:0, collectionRate:0, newPatients:0, recareRate:0, phoneAnswerRate:0, activePatients:298, suppliesPct:0, status:'on_pace'  },
    { code:'HNS', production:0, collections:0, collectionRate:0, newPatients:0, recareRate:0, phoneAnswerRate:0, activePatients:276, suppliesPct:0, status:'watch'    },
    { code:'PB',  production:0, collections:0, collectionRate:0, newPatients:0, recareRate:0, phoneAnswerRate:0, activePatients:389, suppliesPct:0, status:'on_pace'  },
    { code:'PR',  production:0, collections:0, collectionRate:0, newPatients:0, recareRate:0, phoneAnswerRate:0, activePatients:321, suppliesPct:0, status:'on_pace'  },
    { code:'OSB', production:0, collections:0, collectionRate:0, newPatients:0, recareRate:0, phoneAnswerRate:0, activePatients:292, suppliesPct:0, status:'watch',   isOSB:true },
  ],

  // BD2 — provider breakdown not yet available; grossProd/collections zeroed; ytdProd = Jan–Apr cumulative
  doctors: [
    { name:'Nichols, Christopher',  locationCode:'LKW', grossProd:0, collections:0, collRate:0, prodPerDay:0, daysWorked:0, ytdProd:1389000 },
    { name:"Weathers, L'Cris",      locationCode:'PR',  grossProd:0, collections:0, collRate:0, prodPerDay:0, daysWorked:0, ytdProd:951000  },
    { name:'Proctor, Sarah',        locationCode:'PB',  grossProd:0, collections:0, collRate:0, prodPerDay:0, daysWorked:0, ytdProd:1209000 },
    { name:'Ballard, Erin',         locationCode:'PB',  grossProd:0, collections:0, collRate:0, prodPerDay:0, daysWorked:0, ytdProd:638000  },
    { name:'Connolly, Noah',        locationCode:'HNS', grossProd:0, collections:0, collRate:0, prodPerDay:0, daysWorked:0, ytdProd:656000  },
    { name:'Nichols, Patrick',      locationCode:'LT',  grossProd:0, collections:0, collRate:0, prodPerDay:0, daysWorked:0, ytdProd:630000  },
    { name:'Walters, Carrie',       locationCode:'LKW', grossProd:0, collections:0, collRate:0, prodPerDay:0, daysWorked:0, ytdProd:452000  },
    { name:'Skaggs, Ernest',        locationCode:'HNR', grossProd:0, collections:0, collRate:0, prodPerDay:0, daysWorked:0, ytdProd:340000  },
    { name:'Osbourne, Brian',       locationCode:'OSB', grossProd:0, collections:0, collRate:0, prodPerDay:0, daysWorked:0, ytdProd:388000,  isOSB:true },
    { name:'Gleason, Robert',       locationCode:'LKW', grossProd:0, collections:0, collRate:0, prodPerDay:0, daysWorked:0, ytdProd:268000  },
    { name:'Chadwick, Evan',        locationCode:'PR',  grossProd:0, collections:0, collRate:0, prodPerDay:0, daysWorked:0, ytdProd:349000  },
    { name:'Decker Haycraft, Kara', locationCode:'LT',  grossProd:0, collections:0, collRate:0, prodPerDay:0, daysWorked:0, ytdProd:287000  },
  ],

  // BD2 — hygienist breakdown not yet available; zeroed pending next pull
  hygienists: [
    // ── LKW ──
    { name:'Howell, Dana',     locationCode:'LKW', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Woosley, Emily',   locationCode:'LKW', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Payne, McKay',     locationCode:'LKW', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Berry, Tasha',     locationCode:'LKW', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Blandford, Cassi', locationCode:'LKW', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Youart, Britney',  locationCode:'LKW', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Vowels, Susan',    locationCode:'LKW', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Bewley, Emma',     locationCode:'LKW', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    // ── LT ──
    { name:'Logsdon, Megan',   locationCode:'LT',  grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Morris, Amber',    locationCode:'LT',  grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Harned, Stacy',    locationCode:'LT',  grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    // ── PR (Proctor Radcliff) ──
    { name:'Jones, Chad',      locationCode:'PR',  grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Wires, Tanya',     locationCode:'PR',  grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Lynch, Cassie',    locationCode:'PR',  grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    // ── PB (Proctor Bardstown) ──
    { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    { name:'Kittle, Jolena',   locationCode:'PB',  grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    // ── HNS (H&N Shepherdsville) ──
    { name:'Logsdon, Megan',   locationCode:'HNS', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0 },
    // ── OSB (Dental Intel — manual source) ──
    { name:'Haydon, Kelsey',   locationCode:'OSB', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0, isOSB:true },
    { name:'Culver, Angela',   locationCode:'OSB', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0, isOSB:true },
    { name:'Ulrich, Leigh',    locationCode:'OSB', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0, isOSB:true },
    { name:'Greenwell, Denise',locationCode:'OSB', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0, isOSB:true },
    { name:'Yates, Jaclyn',    locationCode:'OSB', grossProd:0, collections:0, collRate:0, hoursWorked:0, prodPerHr:0, recareRate:0, isOSB:true },
  ],

  // BD2 — phone data not yet compiled; zeroed pending Mango Voice pull
  phones: [
    { code:'LKW', totalCalls:0, answered:0, missed:0, answerRate:0, estMissedRevenue:0 },
    { code:'LT',  totalCalls:0, answered:0, missed:0, answerRate:0, estMissedRevenue:0 },
    { code:'HNR', totalCalls:0, answered:0, missed:0, answerRate:0, estMissedRevenue:0 },
    { code:'HNS', totalCalls:0, answered:0, missed:0, answerRate:0, estMissedRevenue:0 },
    { code:'PB',  totalCalls:0, answered:0, missed:0, answerRate:0, estMissedRevenue:0 },
    { code:'PR',  totalCalls:0, answered:0, missed:0, answerRate:0, estMissedRevenue:0 },
    { code:'OSB', totalCalls:0, answered:0, missed:0, answerRate:0, estMissedRevenue:0 },
  ],

  // AR total updated 05/04/2026; bucket breakdown and location detail pending next AR pull
  ar: {
    asOf: '05/04/2026',
    healthScore: 49,  // carry forward — pending refresh
    total: 2161861,   // org AR as of 05/04
    buckets: { d0_30: 1394299, d31_60: 429999, d61_90: 180886, d90plus: 222826 },
    pcts:    { d0_30: 62.6,    d31_60: 19.3,   d61_90: 8.1,    d90plus: 10.0  },
    arToProdRatio: 0.89,
    locations: [
      { code:'LKW', total:709056,  d0_30:305448, d31_60:194628, d61_90:98003,  d90plus:110977, pct0_30:43.1, pct31_60:27.5, pct61_90:13.8, pct90plus:15.6, insuranceAR:214289, patientAR:353120, patientPct:50, arToProd:1.74, status:'needs_work' },
      { code:'LT',  total:234439,  d0_30:153478, d31_60:31609,  d61_90:24601,  d90plus:24751,  pct0_30:65.5, pct31_60:13.5, pct61_90:10.5, pct90plus:10.6, insuranceAR:93361,  patientAR:43415,  patientPct:19, arToProd:1.43, status:'needs_work' },
      { code:'HNR', total:218003,  d0_30:150073, d31_60:28485,  d61_90:11126,  d90plus:28318,  pct0_30:68.8, pct31_60:13.1, pct61_90:5.1,  pct90plus:13.0, insuranceAR:89977,  patientAR:67831,  patientPct:31, arToProd:2.00, status:'needs_work' },
      { code:'HNS', total:89814,   d0_30:77702,  d31_60:8083,   d61_90:861,    d90plus:3168,   pct0_30:86.5, pct31_60:9.0,  pct61_90:1.0,  pct90plus:3.5,  insuranceAR:38243,  patientAR:13627,  patientPct:15, arToProd:0.92, status:'good'      },
      { code:'PB',  total:342932,  d0_30:289707, d31_60:32367,  d61_90:11589,  d90plus:9270,   pct0_30:84.5, pct31_60:9.4,  pct61_90:3.4,  pct90plus:2.7,  insuranceAR:142891, patientAR:54142,  patientPct:16, arToProd:1.19, status:'good'      },
      { code:'PR',  total:440348,  d0_30:267582, d31_60:115763, d61_90:24661,  d90plus:32341,  pct0_30:60.8, pct31_60:26.3, pct61_90:5.6,  pct90plus:7.3,  insuranceAR:157997, patientAR:238361, patientPct:54, arToProd:2.05, status:'watch'     },
      { code:'OSB', total:193416,  d0_30:150308, d31_60:19063,  d61_90:10045,  d90plus:14001,  pct0_30:77.7, pct31_60:9.9,  pct61_90:5.2,  pct90plus:7.2,  insuranceAR:119833, patientAR:73584,  patientPct:38, arToProd:1.77, status:'watch',    isOSB:true },
    ],
  },
}
