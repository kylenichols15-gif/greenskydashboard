// March 2026 — FINAL (BD22, 22/22 business days)
// Sources: Dentrix Ascend ProviderTotals (17) 03/01–03/31 · AgedReceivables (19) 03/31
//          Mango Voice 03/01–03/31 (all 7 confirmed) · Dental Intel OSB operations/providers-performance
// Location production/collections: provider-level aggregation by known location assignment
// hoursWorked: not available for historical months (set to 0)
import type { MonthSnapshot } from '../types'

const mar2026: MonthSnapshot = {
  key:       '2026-03',
  periodInfo: {
    label:         'March 2026',
    dataAsOf:      'March 31',
    totalBizDays:  22,
    daysComplete:  22,
    daysRemaining: 0,
  },
  data: {
    period: 'March 2026',
    org: {
      production:      2746815,  // $2,550,564 Ascend (ProviderTotals 17) + $196,251 OSB (DI)
      productionGoal:  2400000,
      collections:     1304069,  // $1,079,053 Ascend + $225,016 OSB
      collectionsGoal: 1320000,
      newPatients:        684,   // ~616 Ascend + 68 OSB
      activePatients:    2500,
      phoneAnswerRate:   64.6,   // LKW 65.8% + LT 73.5% + HNR 64.4% + HNS 53.8% + PB 56.6% (ED7B) + PR 59.3% (18CB) + OSB 74.5% — weighted avg all 7
      hygieneRecare:    92.6,    // OSB from DI; Ascend not available
      suppliesPct:       0,
    },

    locations: [
      // newPatients: backfilled from New Patients all offices (17) — 2026-05-07 pull includes Mar history
      { code:'LKW', production:856701, collections:385385, collectionRate:45.0,  newPatients:145, recareRate:0,    phoneAnswerRate:65.8, activePatients:0, suppliesPct:0, status:'needs_work' },
      { code:'LT',  production:318267, collections:144731, collectionRate:45.5,  newPatients:84,  recareRate:0,    phoneAnswerRate:73.5, activePatients:0, suppliesPct:0, status:'watch'      },
      { code:'HNR', production:87249,  collections:78719,  collectionRate:90.2,  newPatients:84,  recareRate:0,    phoneAnswerRate:64.4, activePatients:0, suppliesPct:0, status:'needs_work'  },
      { code:'HNS', production:185784, collections:72496,  collectionRate:39.0,  newPatients:72,  recareRate:0,    phoneAnswerRate:53.8, activePatients:0, suppliesPct:0, status:'good'       },
      { code:'PB',  production:622866, collections:239496, collectionRate:38.4,  newPatients:117, recareRate:0,    phoneAnswerRate:56.6, activePatients:0, suppliesPct:0, status:'good'       },
      { code:'PR',  production:476262, collections:157071, collectionRate:33.0,  newPatients:114, recareRate:0,    phoneAnswerRate:59.3, activePatients:0, suppliesPct:0, status:'good'       },
      { code:'OSB', production:196251, collections:225016, collectionRate:114.7, newPatients:68,  recareRate:92.6, phoneAnswerRate:74.5, activePatients:0, suppliesPct:0, status:'on_pace', isOSB:true },
    ],

    // ytdProd = Jan + Feb + Mar
    doctors: [
      { name:'Nichols, Christopher',  locationCode:'LKW', grossProd:431543, collections:177898, collRate:41.2, prodPerDay:19615, daysWorked:22, ytdProd:1049000 },
      { name:"Weathers, L'Cris",      locationCode:'PR',  grossProd:254554, collections:60539,  collRate:23.8, prodPerDay:11571, daysWorked:22, ytdProd:638000  },
      { name:'Proctor, Sarah',        locationCode:'PB',  grossProd:383539, collections:148076, collRate:38.6, prodPerDay:17434, daysWorked:22, ytdProd:897000  },
      { name:'Ballard, Erin',         locationCode:'PB',  grossProd:187871, collections:74301,  collRate:39.5, prodPerDay:8540,  daysWorked:22, ytdProd:406000  },
      { name:'Connolly, Noah',        locationCode:'HNS', grossProd:185784, collections:72496,  collRate:39.0, prodPerDay:8445,  daysWorked:22, ytdProd:435000  },
      { name:'Nichols, Patrick',      locationCode:'LT',  grossProd:155369, collections:71699,  collRate:46.1, prodPerDay:7062,  daysWorked:22, ytdProd:465000  },
      { name:'Walters, Carrie',       locationCode:'LKW', grossProd:129297, collections:69847,  collRate:54.0, prodPerDay:5877,  daysWorked:22, ytdProd:298000  },
      { name:'Skaggs, Ernest',        locationCode:'HNR', grossProd:87249,  collections:78719,  collRate:90.2, prodPerDay:3966,  daysWorked:22, ytdProd:243000  },
      { name:'Osbourne, Brian',       locationCode:'OSB', grossProd:115892, collections:115817, collRate:99.9, prodPerDay:5268,  daysWorked:22, ytdProd:297000, isOSB:true },
      { name:'Gleason, Robert',       locationCode:'LKW', grossProd:95538,  collections:31252,  collRate:32.7, prodPerDay:4343,  daysWorked:22, ytdProd:187000  },
      { name:'Chadwick, Evan',        locationCode:'PR',  grossProd:102923, collections:53376,  collRate:51.9, prodPerDay:4678,  daysWorked:22, ytdProd:273000  },
      { name:'Decker Haycraft, Kara', locationCode:'LT',  grossProd:72157,  collections:31635,  collRate:43.8, prodPerDay:3280,  daysWorked:22, ytdProd:219000  },
    ],

    hygienists: [
      // ── LKW ──
      { name:'Howell, Dana',     locationCode:'LKW', grossProd:20740, collections:9633,  collRate:46.4, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:21840, collections:13219, collRate:60.5, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Woosley, Emily',   locationCode:'LKW', grossProd:22115, collections:11877, collRate:53.7, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Berry, Tasha',     locationCode:'LKW', grossProd:19893, collections:12916, collRate:64.9, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Payne, McKay',     locationCode:'LKW', grossProd:15586, collections:8903,  collRate:57.1, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Blandford, Cassi', locationCode:'LKW', grossProd:21405, collections:9272,  collRate:43.3, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:18810, collections:10224, collRate:54.4, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:13384, collections:7185,  collRate:53.7, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Bewley, Emma',     locationCode:'LKW', grossProd:10887, collections:4690,  collRate:43.1, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Vowels, Susan',    locationCode:'LKW', grossProd:16903, collections:8352,  collRate:49.4, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Youart, Britney',  locationCode:'LKW', grossProd:9390,  collections:3846,  collRate:40.9, hoursWorked:0, prodPerHr:0, recareRate:0 },
      // ── LT ──
      { name:'Logsdon, Megan',   locationCode:'LT',  grossProd:23526, collections:9101,  collRate:38.7, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Morris, Amber',    locationCode:'LT',  grossProd:21147, collections:12602, collRate:59.6, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Harned, Stacy',    locationCode:'LT',  grossProd:13702, collections:4539,  collRate:33.1, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:8799,  collections:2995,  collRate:34.0, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Miller, Jenna',    locationCode:'LT',  grossProd:17037, collections:7928,  collRate:46.5, hoursWorked:0, prodPerHr:0, recareRate:0 },
      // ── PR ──
      { name:'Jones, Chad',      locationCode:'PR',  grossProd:60501, collections:22914, collRate:37.9, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Wires, Tanya',     locationCode:'PR',  grossProd:35165, collections:9880,  collRate:28.1, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Lynch, Cassie',    locationCode:'PR',  grossProd:23119, collections:10362, collRate:44.8, hoursWorked:0, prodPerHr:0, recareRate:0 },
      // ── PB ──
      { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:43660, collections:15124, collRate:34.6, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Kittle, Jolena',   locationCode:'PB',  grossProd:7796,  collections:1995,  collRate:25.6, hoursWorked:0, prodPerHr:0, recareRate:0 },
    ],

    // Mango Voice: all 7 confirmed. ED7B = PB (Proctor Family Dental); 18CB = PR (Proctor Family Dental - Radcliff).
    phones: [
      { code:'LKW', totalCalls:2276, answered:1497, missed:779,  answerRate:65.8, estMissedRevenue:137883 },
      { code:'LT',  totalCalls:1266, answered:931,  missed:335,  answerRate:73.5, estMissedRevenue:59295  },
      { code:'HNR', totalCalls:1058, answered:681,  missed:377,  answerRate:64.4, estMissedRevenue:66729  },
      { code:'HNS', totalCalls:589,  answered:317,  missed:272,  answerRate:53.8, estMissedRevenue:48144  },
      { code:'PB',  totalCalls:1704, answered:965,  missed:739,  answerRate:56.6, estMissedRevenue:130803 },
      { code:'PR',  totalCalls:1356, answered:804,  missed:552,  answerRate:59.3, estMissedRevenue:97704  },
      { code:'OSB', totalCalls:1314, answered:979,  missed:335,  answerRate:74.5, estMissedRevenue:59295  },
    ],

    // Source: AgedReceivables (19) as of 03/31/2026 (Ascend) · Dental Intel OSB operations-performance
    ar: {
      asOf: '03/31/2026',
      healthScore: 58,
      total: 2103229,  // Ascend $1,891,334 + OSB $211,895
      buckets: { d0_30: 1302334, d31_60: 296599, d61_90: 148011, d90plus: 144391 },
      pcts:    { d0_30: 68.9,    d31_60: 15.7,   d61_90: 7.8,    d90plus: 7.6  },
      arToProdRatio: 0.74,
      locations: [
        { code:'LKW', total:642681, d0_30:370354, d31_60:128708, d61_90:55686, d90plus:87933, pct0_30:57.6, pct31_60:20.0, pct61_90:8.7,  pct90plus:13.7, insuranceAR:210847, patientAR:313164, patientPct:49, arToProd:0.75, status:'needs_work' },
        { code:'LT',  total:249846, d0_30:173346, d31_60:43210,  d61_90:18568, d90plus:14722, pct0_30:69.4, pct31_60:17.3, pct61_90:7.4,  pct90plus:5.9,  insuranceAR:101196, patientAR:42602,  patientPct:17, arToProd:0.78, status:'watch'      },
        { code:'HNR', total:211961, d0_30:142318, d31_60:25554,  d61_90:18806, d90plus:25283, pct0_30:67.1, pct31_60:12.1, pct61_90:8.9,  pct90plus:11.9, insuranceAR:95119,  patientAR:50057,  patientPct:24, arToProd:2.43, status:'needs_work'  },
        { code:'HNS', total:52890,  d0_30:46260,  d31_60:1637,   d61_90:831,   d90plus:4162,  pct0_30:87.5, pct31_60:3.1,  pct61_90:1.6,  pct90plus:7.9,  insuranceAR:18994,  patientAR:16988,  patientPct:32, arToProd:0.28, status:'watch'      },
        { code:'PB',  total:349322, d0_30:253528, d31_60:64631,  d61_90:31162, d90plus:0,     pct0_30:72.6, pct31_60:18.5, pct61_90:8.9,  pct90plus:0.0,  insuranceAR:174290, patientAR:35040,  patientPct:10, arToProd:0.56, status:'good'       },
        { code:'PR',  total:384635, d0_30:316528, d31_60:32859,  d61_90:22958, d90plus:12290, pct0_30:82.3, pct31_60:8.5,  pct61_90:6.0,  pct90plus:3.2,  insuranceAR:154675, patientAR:178212, patientPct:46, arToProd:0.81, status:'good'       },
        { code:'OSB', total:211895, d0_30:0,      d31_60:0,      d61_90:0,     d90plus:0,     pct0_30:0,    pct31_60:0,    pct61_90:0,    pct90plus:0,    insuranceAR:126362, patientAR:85533,  patientPct:40, arToProd:1.08, status:'on_pace', isOSB:true },
      ],
    },
  },
}

export default mar2026
