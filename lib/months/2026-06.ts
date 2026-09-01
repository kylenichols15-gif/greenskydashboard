// June 2026 — FINAL / MONTH-END CLOSE (BD22, 22/22 business days) — INLINED (do not re-import from data.ts)
// Sources: Dentrix Ascend ProviderTotals (71) + Prod/Coll Summary (46) + AgedReceivables (56) 06/30
//          Mango Voice 06/25 (last pull) · Dental Intel OSB (operations/providers 6/30, coarse)
// OSB (Ascend + Dental Intel): prod $274,086 (Ascend net proxy — DI gross is negative residual, excluded);
//   coll $113,145 (Ascend $90,623 + DI $22,522); AR $372,004 (Ascend $260,023 + DI $111,981); NP 65 (Ascend only).
// June FINAL: production $2,816,263 (117% of goal) · collections $1,320,154 (100% of $1.32M goal) · 687 new patients.
import type { MonthSnapshot } from '../types'

const jun2026: MonthSnapshot = {
  key:       '2026-06',
  periodInfo: {
    label:         'June 2026',
    dataAsOf:      'Jun 30',
    totalBizDays:  22,
    daysComplete:  22,
    daysRemaining: 0,
  },
  data: {
    period: 'June 2026',
    org: {
      production:      2816263,
      productionGoal:  2400000,
      collections:     1320154,
      collectionsGoal: 1320000,
      newPatients:         687,
      activePatients:     2531,
      phoneAnswerRate:    71.8,
      hygieneRecare:      95.3,
      suppliesPct:         6.7,
    },

    locations: [
      { code:'LKW', production:719639, collections:347921, collectionRate:48.3,  newPatients:129, recareRate:0, phoneAnswerRate:85, activePatients:534, suppliesPct:10.18, status:'on_pace' },
      { code:'LT',  production:307400, collections:177697, collectionRate:57.8,  newPatients:61,  recareRate:0, phoneAnswerRate:78, activePatients:421, suppliesPct:4.92,  status:'on_pace' },
      { code:'HNR', production:217722, collections:107687, collectionRate:49.5,  newPatients:102, recareRate:0, phoneAnswerRate:57, activePatients:298, suppliesPct:4.5,   status:'on_pace' },
      { code:'HNS', production:174599, collections:71877,  collectionRate:41.2,  newPatients:86,  recareRate:0, phoneAnswerRate:80, activePatients:276, suppliesPct:4.27,  status:'watch'   },
      { code:'HNK', production:54586,  collections:56882,  collectionRate:104.2, newPatients:20,  recareRate:0, phoneAnswerRate:53, activePatients:0,   suppliesPct:4.17,  status:'watch'   },
      { code:'PB',  production:728813, collections:263679, collectionRate:36.2,  newPatients:144, recareRate:0, phoneAnswerRate:70, activePatients:389, suppliesPct:6.55,  status:'on_pace' },
      { code:'PR',  production:339419, collections:181266, collectionRate:53.4,  newPatients:80,  recareRate:0, phoneAnswerRate:67, activePatients:321, suppliesPct:8.7,   status:'on_pace' },
      { code:'OSB', production:274086, collections:113145, collectionRate:41.3,  newPatients:65,  recareRate:0, phoneAnswerRate:68, activePatients:292, suppliesPct:0.56,  status:'watch',  isOSB:true },
    ],

    doctors: [
      { name:'Nichols, Christopher',  locationCode:'LKW', grossProd:381410, collections:143205, collRate:37.5,  prodPerDay:17337, daysWorked:22, ytdProd:2026000, patientCount:381, prodPerPatient:1001 },
      { name:'Proctor, Sarah',        locationCode:'PB',  grossProd:297789, collections:146282, collRate:49.1,  prodPerDay:13536, daysWorked:22, ytdProd:1652000, patientCount:408, prodPerPatient:730 },
      { name:"Weathers, L'Cris",      locationCode:'PR',  grossProd:246512, collections:124782, collRate:50.6,  prodPerDay:11205, daysWorked:22, ytdProd:1375000, patientCount:370, prodPerPatient:666 },
      { name:'Connolly, Noah',        locationCode:'HNS', grossProd:226913, collections:85565,  collRate:37.7,  prodPerDay:10314, daysWorked:22, ytdProd:990000,  patientCount:314, prodPerPatient:723 },
      { name:'Osbourne, Brian',       locationCode:'OSB', grossProd:206584, collections:77287,  collRate:37.4,  prodPerDay:9390,  daysWorked:22, ytdProd:709000,  patientCount:864, prodPerPatient:239, isOSB:true },
      { name:'Ballard, Erin',         locationCode:'PB',  grossProd:204657, collections:75590,  collRate:36.9,  prodPerDay:9303,  daysWorked:22, ytdProd:926000,  patientCount:333, prodPerPatient:615 },
      { name:'Nichols, Patrick',      locationCode:'LT',  grossProd:204085, collections:108810, collRate:53.3,  prodPerDay:9277,  daysWorked:22, ytdProd:964000,  patientCount:667, prodPerPatient:306 },
      { name:'Walters, Carrie',       locationCode:'LKW', grossProd:130376, collections:63273,  collRate:48.5,  prodPerDay:5926,  daysWorked:22, ytdProd:654000,  patientCount:610, prodPerPatient:214 },
      { name:'Skaggs, Ernest',        locationCode:'HNR', grossProd:106805, collections:48426,  collRate:45.3,  prodPerDay:4855,  daysWorked:22, ytdProd:485000,  patientCount:323, prodPerPatient:331 },
      { name:'Chadwick, Evan',        locationCode:'LKW', grossProd:103351, collections:57207,  collRate:55.4,  prodPerDay:4698,  daysWorked:22, ytdProd:533000,  patientCount:652, prodPerPatient:159 },
      { name:'Decker Haycraft, Kara', locationCode:'LT',  grossProd:89268,  collections:42126,  collRate:47.2,  prodPerDay:4058,  daysWorked:22, ytdProd:431000,  patientCount:353, prodPerPatient:253 },
      { name:'Gleason, Robert',       locationCode:'HNR', grossProd:72381,  collections:37295,  collRate:51.5,  prodPerDay:3290,  daysWorked:22, ytdProd:401000,  patientCount:327, prodPerPatient:221 },
      { name:'King, Susan',           locationCode:'HNK', grossProd:22708,  collections:37647,  collRate:165.8, prodPerDay:1032,  daysWorked:22, ytdProd:139000,  patientCount:261, prodPerPatient:87  },
      { name:'Harvey, Mark',          locationCode:'LKW', grossProd:12688,  collections:6803,   collRate:53.6,  prodPerDay:577,   daysWorked:22, ytdProd:22000,   patientCount:312, prodPerPatient:41  },
    ],

    hygienists: [
      // ── LKW ──
      { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:22263, collections:9416, collRate:42.3,  hoursWorked:148.32,prodPerHr:150, recareRate:0, patientCount:174, prodPerPatient:128 },
      { name:'Berry, Tasha',     locationCode:'LKW', grossProd:19112, collections:10209,collRate:53.4,  hoursWorked:141.68,prodPerHr:135, recareRate:0, patientCount:187, prodPerPatient:102 },
      { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:20941, collections:10698,collRate:51.1,  hoursWorked:128.97,prodPerHr:162, recareRate:0, patientCount:183, prodPerPatient:114 },
      { name:'Woosley, Emily',   locationCode:'LKW', grossProd:19391, collections:11913,collRate:61.4,  hoursWorked:125.60,prodPerHr:154, recareRate:0, patientCount:203, prodPerPatient:96  },
      { name:'Payne, McKay',     locationCode:'LKW', grossProd:14295, collections:7988, collRate:55.9,  hoursWorked:104.65,prodPerHr:137, recareRate:0, patientCount:148, prodPerPatient:97  },
      { name:'Vowels, Susan',    locationCode:'LKW', grossProd:14910, collections:7739, collRate:51.9,  hoursWorked:111.88,prodPerHr:133, recareRate:0, patientCount:134, prodPerPatient:111 },
      { name:'Bewley, Emma',     locationCode:'LKW', grossProd:13350, collections:4623, collRate:34.6,  hoursWorked:76.11, prodPerHr:175, recareRate:0, patientCount:108, prodPerPatient:124 },
      { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:7736,  collections:4161, collRate:53.8,  hoursWorked:148.28,prodPerHr:52,  recareRate:0, patientCount:71,  prodPerPatient:109 },
      { name:'Murphy, Sherry',   locationCode:'LKW', grossProd:6945,  collections:3545, collRate:51.0,  hoursWorked:54.53, prodPerHr:127, recareRate:0, patientCount:70,  prodPerPatient:99  },
      // ── LT ──
      { name:'Blandford, Cassi', locationCode:'LT',  grossProd:15496, collections:8459, collRate:54.6,  hoursWorked:116.38,prodPerHr:133, recareRate:0, patientCount:149, prodPerPatient:104 },
      { name:'Harned, Stacy',    locationCode:'LT',  grossProd:14783, collections:5153, collRate:34.9,  hoursWorked:109.06,prodPerHr:136, recareRate:0, patientCount:119, prodPerPatient:124 },
      { name:'Howell, Dana',     locationCode:'LT',  grossProd:16336, collections:7236, collRate:44.3,  hoursWorked:119.47,prodPerHr:137, recareRate:0, patientCount:170, prodPerPatient:96  },
      { name:'Kittle, Jolena',   locationCode:'LT',  grossProd:11869, collections:4654, collRate:39.2,  hoursWorked:79.40, prodPerHr:149, recareRate:0, patientCount:92,  prodPerPatient:129 },
      { name:'Youart, Britney',  locationCode:'LT',  grossProd:8911,  collections:4934, collRate:55.4,  hoursWorked:47.84, prodPerHr:186, recareRate:0, patientCount:65,  prodPerPatient:137 },
      { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:5150,  collections:3725, collRate:72.3,  hoursWorked:34.10, prodPerHr:151, recareRate:0, patientCount:52,  prodPerPatient:99  },
      // ── HNR ──
      { name:'Morris, Amber',    locationCode:'HNR', grossProd:23241, collections:8669, collRate:37.3,  hoursWorked:158.20,prodPerHr:147, recareRate:0, patientCount:202, prodPerPatient:115 },
      { name:'Lynch, Cassie',    locationCode:'HNR', grossProd:24034, collections:11719,collRate:48.8,  hoursWorked:135.18,prodPerHr:178, recareRate:0, patientCount:195, prodPerPatient:123 },
      // ── HNS ──
      { name:'Logsdon, Megan',   locationCode:'HNS', grossProd:23713, collections:9189, collRate:38.8,  hoursWorked:163.70,prodPerHr:145, recareRate:0, patientCount:150, prodPerPatient:158 },
      // ── HNK ──
      { name:'Miller, Taylor',   locationCode:'HNK', grossProd:12570, collections:12246,collRate:97.4,  hoursWorked:142.27,prodPerHr:88,  recareRate:0, patientCount:151, prodPerPatient:83  },
      { name:'Decker, Heather',  locationCode:'HNK', grossProd:4572,  collections:2850, collRate:62.3,  hoursWorked:40.07, prodPerHr:114, recareRate:0, patientCount:36,  prodPerPatient:127 },
      // ── PB ──
      { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:63434, collections:33134,collRate:52.2,  hoursWorked:155.67,prodPerHr:407, recareRate:0, patientCount:283, prodPerPatient:224 },
      { name:'Wires, Tanya',     locationCode:'PB',  grossProd:205,   collections:5157, collRate:2515.6,hoursWorked:0,     prodPerHr:0,   recareRate:0, patientCount:44,  prodPerPatient:5   },
      // ── PR ──
      { name:'Jones, Chad',      locationCode:'PR',  grossProd:52986, collections:21935,collRate:41.4,  hoursWorked:144.35,prodPerHr:367, recareRate:0, patientCount:224, prodPerPatient:237 },
      // ── OSB (Ascend net proxy + Dental Intel collections) ──
      { name:'Haydon, Kelsey',   locationCode:'OSB', grossProd:15088, collections:7698, collRate:51.0,  hoursWorked:129.00,prodPerHr:117, recareRate:0, patientCount:141, prodPerPatient:107, isOSB:true },
      { name:'Culver, Angela',   locationCode:'OSB', grossProd:16860, collections:6652, collRate:39.5,  hoursWorked:144.23,prodPerHr:117, recareRate:0, patientCount:149, prodPerPatient:113, isOSB:true },
      { name:'Yates, Jaclyn',    locationCode:'OSB', grossProd:12358, collections:4180, collRate:33.8,  hoursWorked:112.53,prodPerHr:110, recareRate:0, patientCount:120, prodPerPatient:103, isOSB:true },
      { name:'Ulrich, Leigh',    locationCode:'OSB', grossProd:10759, collections:6078, collRate:56.5,  hoursWorked:104.92,prodPerHr:103, recareRate:0, patientCount:114, prodPerPatient:94,  isOSB:true },
      { name:'Greenwell, Denise',locationCode:'OSB', grossProd:5400,  collections:2038, collRate:37.7,  hoursWorked:51.42, prodPerHr:105, recareRate:0, patientCount:48,  prodPerPatient:112, isOSB:true },
    ],

    phones: [
      { code:'LKW', totalCalls:1513, answered:1289, missed:224, answerRate:85, estMissedRevenue:0 },
      { code:'LT',  totalCalls:651,  answered:506,  missed:145, answerRate:78, estMissedRevenue:0 },
      { code:'HNR', totalCalls:818,  answered:468,  missed:350, answerRate:57, estMissedRevenue:0 },
      { code:'HNS', totalCalls:411,  answered:327,  missed:84,  answerRate:80, estMissedRevenue:0 },
      { code:'HNK', totalCalls:446,  answered:236,  missed:210, answerRate:53, estMissedRevenue:0 },
      { code:'PB',  totalCalls:986,  answered:693,  missed:293, answerRate:70, estMissedRevenue:0 },
      { code:'PR',  totalCalls:630,  answered:425,  missed:205, answerRate:67, estMissedRevenue:0 },
      { code:'OSB', totalCalls:787,  answered:538,  missed:249, answerRate:68, estMissedRevenue:0 },
    ],

    ar: {
      asOf: '06/30/2026',
      healthScore: 74,
      total: 2068065,
      buckets: { d0_30: 1528398, d31_60: 306883, d61_90: 143782, d90plus: 400674 },
      pcts:    { d0_30: 64.23,   d31_60: 12.90,  d61_90: 6.04,   d90plus: 16.84 },
      arToProdRatio: 0.73,
      locations: [
        { code:'LKW', total:624945, d0_30:354597, d31_60:131926, d61_90:66391, d90plus:226155, pct0_30:45.52, pct31_60:16.93, pct61_90:8.52, pct90plus:29.03, insuranceAR:189766, patientAR:454215, patientPct:71, arToProd:0.9, status:'needs_work' },
        { code:'HNK', total:59489,  d0_30:59566,  d31_60:11390,  d61_90:1381,  d90plus:0,      pct0_30:82.34, pct31_60:15.75, pct61_90:1.91, pct90plus:0.0,  insuranceAR:32874,  patientAR:15969,  patientPct:33, arToProd:1.1, status:'good'      },
        { code:'LT',  total:219763, d0_30:174259, d31_60:19890,  d61_90:15648, d90plus:37948,  pct0_30:70.33, pct31_60:8.03,  pct61_90:6.32, pct90plus:15.32, insuranceAR:90815,  patientAR:45180,  patientPct:33, arToProd:0.7, status:'watch'     },
        { code:'HNR', total:231444, d0_30:183991, d31_60:37257,  d61_90:22240, d90plus:36118,  pct0_30:65.81, pct31_60:13.32, pct61_90:7.95, pct90plus:12.92, insuranceAR:106056, patientAR:96547,  patientPct:48, arToProd:1.1, status:'watch'     },
        { code:'HNS', total:71883,  d0_30:69476,  d31_60:6628,   d61_90:2777,  d90plus:5379,   pct0_30:82.45, pct31_60:7.87,  pct61_90:3.30, pct90plus:6.38,  insuranceAR:35020,  patientAR:13593,  patientPct:28, arToProd:0.4, status:'good'      },
        { code:'OSB', total:372004, d0_30:286191, d31_60:66762,  d61_90:0,     d90plus:29736,  pct0_30:74.78, pct31_60:17.44, pct61_90:0.0,  pct90plus:7.77,  insuranceAR:210429, patientAR:125815, patientPct:37, arToProd:1.4, status:'watch',   isOSB:true },
        { code:'PB',  total:294790, d0_30:256585, d31_60:26999,  d61_90:27302, d90plus:27888,  pct0_30:75.74, pct31_60:7.97,  pct61_90:8.06, pct90plus:8.23,  insuranceAR:121025, patientAR:95186,  patientPct:44, arToProd:0.4, status:'watch'     },
        { code:'PR',  total:193747, d0_30:143734, d31_60:6033,   d61_90:8044,  d90plus:37449,  pct0_30:73.61, pct31_60:3.09,  pct61_90:4.12, pct90plus:19.18, insuranceAR:64750,  patientAR:116494, patientPct:64, arToProd:0.6, status:'watch'     },
      ],
    },
  },
}

export default jun2026
