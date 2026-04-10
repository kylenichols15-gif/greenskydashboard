export const LOCATIONS = [
  { code: 'LKW', name: 'H&N Lakewood',        brand: 'Harvey & Nichols', isOSB: false },
  { code: 'LT',  name: 'H&N Lincoln Trail',   brand: 'Harvey & Nichols', isOSB: false },
  { code: 'HNR', name: 'H&N Radcliff',        brand: 'Harvey & Nichols', isOSB: false },
  { code: 'HNS', name: 'H&N Shepherdsville',  brand: 'Harvey & Nichols', isOSB: false },
  { code: 'PB',  name: 'Proctor Bardstown',   brand: 'Proctor Family',   isOSB: false },
  { code: 'PR',  name: 'Proctor Radcliff',    brand: 'Proctor Family',   isOSB: false },
  { code: 'OSB', name: 'Osbourne Family',     brand: 'Osbourne',         isOSB: true  },
]

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

// Business days for April 2026
export const PERIOD_INFO = {
  label:          'April 2026',
  totalBizDays:   22,
  daysComplete:   7,
  daysRemaining:  15,
}

export const DEMO_DATA = {
  period: 'April 2026',
  org: {
    production:        423800,
    productionGoal:    500000,
    collections:       371200,
    collectionsGoal:   440000,
    newPatients:       127,
    activePatients:    2531,
    phoneAnswerRate:   71.4,
    hygieneRecare:     78.2,
  },
  locations: [
    { code:'LKW', production:98400,  collections:82100,  collectionRate:83.4, newPatients:31, recareRate:79.1, phoneAnswerRate:46.2, activePatients:534, suppliesPct:6.8, status:'behind'   },
    { code:'LT',  production:87200,  collections:74900,  collectionRate:85.9, newPatients:24, recareRate:82.4, phoneAnswerRate:74.1, activePatients:421, suppliesPct:5.9, status:'on_pace'  },
    { code:'HNR', production:54100,  collections:43200,  collectionRate:79.8, newPatients:18, recareRate:71.2, phoneAnswerRate:68.3, activePatients:298, suppliesPct:7.1, status:'critical' },
    { code:'HNS', production:48300,  collections:38100,  collectionRate:78.9, newPatients:14, recareRate:66.4, phoneAnswerRate:72.1, activePatients:276, suppliesPct:7.4, status:'critical' },
    { code:'PB',  production:71200,  collections:62400,  collectionRate:87.6, newPatients:22, recareRate:88.1, phoneAnswerRate:83.4, activePatients:389, suppliesPct:5.4, status:'on_pace'  },
    { code:'PR',  production:42800,  collections:38900,  collectionRate:90.9, newPatients:11, recareRate:91.2, phoneAnswerRate:97.1, activePatients:321, suppliesPct:5.1, status:'on_pace'  },
    { code:'OSB', production:21800,  collections:18200,  collectionRate:83.5, newPatients:7,  recareRate:84.2, phoneAnswerRate:76.8, activePatients:292, suppliesPct:6.2, status:'behind',  isOSB:true },
  ],
  doctors: [
    { name:'Nichols, Christopher G', locationCode:'LKW', grossProd:84200, collections:69800, collRate:82.9, prodPerDay:9355, daysWorked:9,  ytdProd:412800 },
    { name:'Connolly, Drew',         locationCode:'LT',  grossProd:87200, collections:74900, collRate:85.9, prodPerDay:8720, daysWorked:10, ytdProd:398100 },
    { name:'Proctor, Sarah',         locationCode:'PB',  grossProd:71200, collections:62400, collRate:87.6, prodPerDay:7911, daysWorked:9,  ytdProd:331400 },
    { name:'Weathers, L\'Cris',      locationCode:'PR',  grossProd:42800, collections:38900, collRate:90.9, prodPerDay:4755, daysWorked:9,  ytdProd:222100 },
    { name:'Ballard, Erin',          locationCode:'PB',  grossProd:38400, collections:33700, collRate:87.8, prodPerDay:3840, daysWorked:10, ytdProd:169200 },
    { name:'Chadwick, Evan',         locationCode:'LKW', grossProd:14200, collections:12300, collRate:86.6, prodPerDay:7100, daysWorked:2,  ytdProd:89200  },
  ],
  hygienists: [
    { name:'Haycraft, Kara',   locationCode:'LT',  grossProd:21800, collections:20100, collRate:92.2, hoursWorked:70.0, prodPerHr:311, recareRate:88.4 },
    { name:'Berry, Tasha',     locationCode:'LKW', grossProd:18400, collections:17100, collRate:92.9, hoursWorked:62.5, prodPerHr:294, recareRate:82.1 },
    { name:'Walters, Carrie',  locationCode:'LKW', grossProd:14200, collections:13100, collRate:92.3, hoursWorked:48.0, prodPerHr:296, recareRate:76.3 },
    { name:'Ortega, Maria',    locationCode:'PB',  grossProd:16800, collections:15400, collRate:91.7, hoursWorked:56.0, prodPerHr:300, recareRate:90.2 },
    { name:'Simmons, Dana',    locationCode:'PR',  grossProd:12100, collections:11200, collRate:92.6, hoursWorked:44.0, prodPerHr:275, recareRate:93.1 },
    { name:'Fletcher, Renee',  locationCode:'HNR', grossProd:9800,  collections:8900,  collRate:90.8, hoursWorked:40.0, prodPerHr:245, recareRate:71.2 },
  ],
  phones: [
    { code:'LKW', totalCalls:1124, answered:519,  missed:605, answerRate:46.2, estMissedRevenue:48400 },
    { code:'LT',  totalCalls:834,  answered:618,  missed:216, answerRate:74.1, estMissedRevenue:17280 },
    { code:'HNR', totalCalls:612,  answered:418,  missed:194, answerRate:68.3, estMissedRevenue:15520 },
    { code:'HNS', totalCalls:541,  answered:390,  missed:151, answerRate:72.1, estMissedRevenue:12080 },
    { code:'PB',  totalCalls:748,  answered:624,  missed:124, answerRate:83.4, estMissedRevenue:9920  },
    { code:'PR',  totalCalls:644,  answered:625,  missed:19,  answerRate:97.1, estMissedRevenue:1520  },
    { code:'OSB', totalCalls:312,  answered:240,  missed:72,  answerRate:76.9, estMissedRevenue:5760  },
  ],
  ar: {
    asOf: '04/07/2026',
    healthScore: 68,
    total: 1621400,
    buckets: { d0_30: 1151194, d31_60: 243210, d61_90: 113498, d90plus: 113498 },
    pcts:    { d0_30: 71.0,    d31_60: 15.0,   d61_90: 7.0,    d90plus: 7.0 },
    arToProdRatio: 1.36,
    locations: [
      { code:'LKW', total:564000, d0_30:372240, d31_60:87084, d61_90:52152, d90plus:52524, pct0_30:66.0, pct31_60:15.5, pct61_90:9.2, pct90plus:9.3, insuranceAR:367000, patientAR:197000, patientPct:35, arToProd:1.51, status:'needs_work' },
      { code:'LT',  total:312000, d0_30:233376, d31_60:46800, d61_90:15600, d90plus:16224, pct0_30:74.8, pct31_60:15.0, pct61_90:5.0, pct90plus:5.2, insuranceAR:198000, patientAR:114000, patientPct:37, arToProd:1.21, status:'watch'     },
      { code:'HNR', total:176000, d0_30:110176, d31_60:27456, d61_90:14080, d90plus:24288, pct0_30:62.6, pct31_60:15.6, pct61_90:8.0, pct90plus:13.8, insuranceAR:108000, patientAR:68000,  patientPct:39, arToProd:1.55, status:'needs_work' },
      { code:'HNS', total:35000,  d0_30:29365,  d31_60:1190,  d61_90:595,   d90plus:3850,  pct0_30:83.9, pct31_60:3.4,  pct61_90:1.7, pct90plus:11.0, insuranceAR:16000,  patientAR:8000,   patientPct:22, arToProd:0.61, status:'watch'     },
      { code:'PB',  total:331000, d0_30:241630, d31_60:41373, d61_90:27523, d90plus:20474, pct0_30:73.0, pct31_60:12.5, pct61_90:8.3, pct90plus:6.2,  insuranceAR:211000, patientAR:120000, patientPct:36, arToProd:1.81, status:'needs_work' },
      { code:'PR',  total:168000, d0_30:155232, d31_60:9240,  d61_90:1680,  d90plus:1848,  pct0_30:92.4, pct31_60:5.5,  pct61_90:1.0, pct90plus:1.1,  insuranceAR:124000, patientAR:44000,  patientPct:26, arToProd:0.89, status:'good'      },
      { code:'OSB', total:35400,  d0_30:28320,  d31_60:3894,  d61_90:1770,  d90plus:1416,  pct0_30:80.0, pct31_60:11.0, pct61_90:5.0, pct90plus:4.0,  insuranceAR:22000,  patientAR:13400,  patientPct:38, arToProd:0.94, status:'watch',    isOSB:true },
    ],
  },
}
