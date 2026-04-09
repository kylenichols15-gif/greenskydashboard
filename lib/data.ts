export const LOCATIONS = [
  { code: 'LKW', name: 'H&N Lakewood',        brand: 'Harvey & Nichols', isOSB: false },
  { code: 'LT',  name: 'H&N Lincoln Trail',   brand: 'Harvey & Nichols', isOSB: false },
  { code: 'HNR', name: 'H&N Radcliff',        brand: 'Harvey & Nichols', isOSB: false },
  { code: 'HNS', name: 'H&N Shepherdsville',  brand: 'Harvey & Nichols', isOSB: false },
  { code: 'PB',  name: 'Proctor Bardstown',   brand: 'Proctor Family',   isOSB: false },
  { code: 'PR',  name: 'Proctor Radcliff',    brand: 'Proctor Family',   isOSB: false },
  { code: 'OSB', name: 'Osbourne Family',     brand: 'Osbourne',         isOSB: true  },
]

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
  providers: [
    { name:'Nichols, Christopher G', type:'Doctor',    locationCode:'LKW', grossProd:84200, collections:69800, prodPerDay:9355, daysWorked:9,  ytdProd:412800 },
    { name:'Chadwick, Evan',         type:'Doctor',    locationCode:'LKW', grossProd:14200, collections:12300, prodPerDay:7100, daysWorked:2,  ytdProd:89200  },
    { name:'Connolly, Drew',         type:'Doctor',    locationCode:'LT',  grossProd:87200, collections:74900, prodPerDay:8720, daysWorked:10, ytdProd:398100 },
    { name:'Walters, Carrie',        type:'Hygienist', locationCode:'LKW', grossProd:18400, collections:17100, hoursWorked:62.5, prodPerHr:294 },
    { name:'Berry, Tasha',           type:'Hygienist', locationCode:'LKW', grossProd:14200, collections:13100, hoursWorked:48.0, prodPerHr:296 },
    { name:'Haycraft, Kara',         type:'Hygienist', locationCode:'LT',  grossProd:21800, collections:20100, hoursWorked:70.0, prodPerHr:311 },
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
}
