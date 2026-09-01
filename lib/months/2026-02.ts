// February 2026 — FINAL (BD19, 19/19 business days)
// Sources: Dentrix Ascend ProviderTotals (16) 02/01–02/28 · AgedReceivables (18) 02/28
//          Mango Voice 02/01–02/28 (all 7 confirmed) · Dental Intel OSB operations/providers-performance
// Location production/collections: provider-level aggregation by known location assignment
// hoursWorked: not available for historical months (set to 0)
import type { MonthSnapshot } from '../types'

const feb2026: MonthSnapshot = {
  key:       '2026-02',
  periodInfo: {
    label:         'February 2026',
    dataAsOf:      'February 28',
    totalBizDays:  19,
    daysComplete:  19,
    daysRemaining: 0,
  },
  data: {
    period: 'February 2026',
    org: {
      production:      2350232,  // $2,118,415 Ascend (ProviderTotals 16) + $231,817 OSB (DI)
      productionGoal:  2400000,
      collections:     1230553,  // $1,038,059 Ascend + $192,494 OSB
      collectionsGoal: 1320000,
      newPatients:        601,   // ~526 Ascend + 75 OSB
      activePatients:    2450,
      phoneAnswerRate:   59.3,   // LKW 51% + LT 72.8% + HNR 68.1% + HNS 60% + PB 59.3% (ED7B) + PR 33.1% (18CB) + OSB 79% — weighted avg all 7
      hygieneRecare:    92.5,    // OSB from DI; Ascend not available
      suppliesPct:       0,
    },

    locations: [
      // newPatients: backfilled from New Patients all offices (17) — 2026-05-07 pull includes Feb history
      { code:'LKW', production:656532, collections:424212, collectionRate:64.6,  newPatients:141, recareRate:0,    phoneAnswerRate:51.0, activePatients:0, suppliesPct:0, status:'watch'     },
      { code:'LT',  production:316488, collections:181750, collectionRate:57.4,  newPatients:63,  recareRate:0,    phoneAnswerRate:72.8, activePatients:0, suppliesPct:0, status:'good'      },
      { code:'HNR', production:85005,  collections:77861,  collectionRate:91.6,  newPatients:84,  recareRate:0,    phoneAnswerRate:68.1, activePatients:0, suppliesPct:0, status:'needs_work' },
      { code:'HNS', production:144656, collections:63036,  collectionRate:43.6,  newPatients:51,  recareRate:0,    phoneAnswerRate:60.0, activePatients:0, suppliesPct:0, status:'good'      },
      { code:'PB',  production:504595, collections:204613, collectionRate:40.6,  newPatients:85,  recareRate:0,    phoneAnswerRate:59.3, activePatients:0, suppliesPct:0, status:'good'      },
      { code:'PR',  production:410963, collections:184798, collectionRate:44.9,  newPatients:102, recareRate:0,    phoneAnswerRate:33.1, activePatients:0, suppliesPct:0, status:'watch'     },
      { code:'OSB', production:231817, collections:192494, collectionRate:83.0,  newPatients:75,  recareRate:92.5, phoneAnswerRate:79.0, activePatients:0, suppliesPct:0, status:'on_pace', isOSB:true },
    ],

    // ytdProd = Jan + Feb
    doctors: [
      { name:'Nichols, Christopher',  locationCode:'LKW', grossProd:306485, collections:177290, collRate:57.8, prodPerDay:16131, daysWorked:19, ytdProd:618000  },
      { name:"Weathers, L'Cris",      locationCode:'PR',  grossProd:213682, collections:89549,  collRate:41.9, prodPerDay:11246, daysWorked:19, ytdProd:383000  },
      { name:'Proctor, Sarah',        locationCode:'PB',  grossProd:287698, collections:124278, collRate:43.2, prodPerDay:15142, daysWorked:19, ytdProd:513000  },
      { name:'Ballard, Erin',         locationCode:'PB',  grossProd:166637, collections:56436,  collRate:33.9, prodPerDay:8770,  daysWorked:19, ytdProd:218000  },
      { name:'Connolly, Noah',        locationCode:'HNS', grossProd:144656, collections:63036,  collRate:43.6, prodPerDay:7613,  daysWorked:19, ytdProd:249000  },
      { name:'Nichols, Patrick',      locationCode:'LT',  grossProd:146646, collections:85713,  collRate:58.4, prodPerDay:7718,  daysWorked:19, ytdProd:310000  },
      { name:'Walters, Carrie',       locationCode:'LKW', grossProd:115203, collections:42006,  collRate:36.5, prodPerDay:6063,  daysWorked:19, ytdProd:169000  },
      { name:'Skaggs, Ernest',        locationCode:'HNR', grossProd:85005,  collections:77861,  collRate:91.6, prodPerDay:4474,  daysWorked:19, ytdProd:156000  },
      { name:'Osbourne, Brian',       locationCode:'OSB', grossProd:105857, collections:89157,  collRate:84.2, prodPerDay:5571,  daysWorked:19, ytdProd:182000, isOSB:true },
      { name:'Gleason, Robert',       locationCode:'LKW', grossProd:49547,  collections:17589,  collRate:35.5, prodPerDay:2608,  daysWorked:19, ytdProd:91000   },
      { name:'Chadwick, Evan',        locationCode:'PR',  grossProd:94776,  collections:44602,  collRate:47.1, prodPerDay:4988,  daysWorked:19, ytdProd:170000  },
      { name:'Decker Haycraft, Kara', locationCode:'LT',  grossProd:83582,  collections:51531,  collRate:61.7, prodPerDay:4399,  daysWorked:19, ytdProd:147000  },
    ],

    hygienists: [
      // ── LKW ──
      { name:'Howell, Dana',     locationCode:'LKW', grossProd:19658, collections:10041, collRate:51.1, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:20200, collections:9616,  collRate:47.6, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Woosley, Emily',   locationCode:'LKW', grossProd:18198, collections:7959,  collRate:43.7, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Berry, Tasha',     locationCode:'LKW', grossProd:20579, collections:9569,  collRate:46.5, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Payne, McKay',     locationCode:'LKW', grossProd:16033, collections:8213,  collRate:51.2, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Blandford, Cassi', locationCode:'LKW', grossProd:18171, collections:9329,  collRate:51.3, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:18370, collections:9456,  collRate:51.5, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:14855, collections:7185,  collRate:48.4, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Bewley, Emma',     locationCode:'LKW', grossProd:10646, collections:5906,  collRate:55.5, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Vowels, Susan',    locationCode:'LKW', grossProd:12010, collections:7370,  collRate:61.4, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Youart, Britney',  locationCode:'LKW', grossProd:8865,  collections:2397,  collRate:27.0, hoursWorked:0, prodPerHr:0, recareRate:0 },
      // ── LT ──
      { name:'Logsdon, Megan',   locationCode:'LT',  grossProd:19334, collections:9172,  collRate:47.4, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Morris, Amber',    locationCode:'LT',  grossProd:22262, collections:11326, collRate:50.9, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Harned, Stacy',    locationCode:'LT',  grossProd:12004, collections:6497,  collRate:54.1, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:8741,  collections:4650,  collRate:53.2, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Miller, Jenna',    locationCode:'LT',  grossProd:16644, collections:7385,  collRate:44.4, hoursWorked:0, prodPerHr:0, recareRate:0 },
      // ── PR ──
      { name:'Jones, Chad',      locationCode:'PR',  grossProd:53472, collections:27293, collRate:51.0, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Wires, Tanya',     locationCode:'PR',  grossProd:29829, collections:13774, collRate:46.2, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Lynch, Cassie',    locationCode:'PR',  grossProd:19204, collections:9580,  collRate:49.9, hoursWorked:0, prodPerHr:0, recareRate:0 },
      // ── PB ──
      { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:41420, collections:18314, collRate:44.2, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Kittle, Jolena',   locationCode:'PB',  grossProd:8840,  collections:5585,  collRate:63.2, hoursWorked:0, prodPerHr:0, recareRate:0 },
    ],

    // Mango Voice: all 7 confirmed. ED7B = PB (Proctor Family Dental); 18CB = PR (Proctor Family Dental - Radcliff).
    phones: [
      { code:'LKW', totalCalls:2523, answered:1286, missed:1237, answerRate:51.0, estMissedRevenue:218949 },
      { code:'LT',  totalCalls:1147, answered:835,  missed:312,  answerRate:72.8, estMissedRevenue:55224  },
      { code:'HNR', totalCalls:1047, answered:713,  missed:334,  answerRate:68.1, estMissedRevenue:59118  },
      { code:'HNS', totalCalls:412,  answered:247,  missed:165,  answerRate:60.0, estMissedRevenue:29205  },
      { code:'PB',  totalCalls:1736, answered:1029, missed:707,  answerRate:59.3, estMissedRevenue:125139 },
      { code:'PR',  totalCalls:1221, answered:404,  missed:817,  answerRate:33.1, estMissedRevenue:144609 },
      { code:'OSB', totalCalls:1428, answered:1128, missed:300,  answerRate:79.0, estMissedRevenue:53100  },
    ],

    // Source: AgedReceivables (18) as of 02/28/2026 (Ascend) · Dental Intel OSB operations-performance
    ar: {
      asOf: '02/28/2026',
      healthScore: 63,
      total: 1722464,  // Ascend $1,474,408 + OSB $248,056
      buckets: { d0_30: 1013541, d31_60: 235560, d61_90: 128781, d90plus: 96527 },
      pcts:    { d0_30: 68.7,    d31_60: 16.0,   d61_90: 8.7,    d90plus: 6.5  },
      arToProdRatio: 0.70,
      locations: [
        { code:'LKW', total:536624, d0_30:344709, d31_60:82615, d61_90:73459, d90plus:35840, pct0_30:64.2, pct31_60:15.4, pct61_90:13.7, pct90plus:6.7,  insuranceAR:216452, patientAR:214573, patientPct:40, arToProd:0.82, status:'watch'     },
        { code:'LT',  total:205725, d0_30:154161, d31_60:31104, d61_90:16357, d90plus:4103,  pct0_30:74.9, pct31_60:15.1, pct61_90:7.9,  pct90plus:2.0,  insuranceAR:77861,  patientAR:42314,  patientPct:21, arToProd:0.65, status:'good'      },
        { code:'HNR', total:196125, d0_30:114230, d31_60:32368, d61_90:14469, d90plus:35059, pct0_30:58.2, pct31_60:16.5, pct61_90:7.4,  pct90plus:17.9, insuranceAR:91395,  patientAR:63735,  patientPct:32, arToProd:2.31, status:'needs_work' },
        { code:'HNS', total:37676,  d0_30:32254,  d31_60:877,   d61_90:764,   d90plus:3781,  pct0_30:85.6, pct31_60:2.3,  pct61_90:2.0,  pct90plus:10.0, insuranceAR:15781,  patientAR:7049,   patientPct:19, arToProd:0.26, status:'watch'     },
        { code:'PB',  total:251263, d0_30:202002, d31_60:49261, d61_90:0,     d90plus:0,     pct0_30:80.4, pct31_60:19.6, pct61_90:0.0,  pct90plus:0.0,  insuranceAR:139114, patientAR:39000,  patientPct:16, arToProd:0.50, status:'good'      },
        { code:'PR',  total:246996, d0_30:166184, d31_60:39335, d61_90:23733, d90plus:17744, pct0_30:67.3, pct31_60:15.9, pct61_90:9.6,  pct90plus:7.2,  insuranceAR:86955,  patientAR:114453, patientPct:46, arToProd:0.60, status:'watch'     },
        { code:'OSB', total:248056, d0_30:0,      d31_60:0,     d61_90:0,     d90plus:0,     pct0_30:0,    pct31_60:0,    pct61_90:0,    pct90plus:0,    insuranceAR:162809, patientAR:85246,  patientPct:34, arToProd:1.07, status:'on_pace', isOSB:true },
      ],
    },
  },
}

export default feb2026
