// May 2026 — FINAL / MONTH-END CLOSE (BD29, 20/20 business days) — INLINED (do not re-import from data.ts)
// Sources: Dentrix Ascend ProviderTotals (36) + Prod/Coll Summary (28) + AgedReceivables (36)
//          Mango Voice 05/01–05/29 · Dental Intel OSB (providers/operations/ar-overview-2026-5-29)
// OSB CONVERTED TO ASCEND MID-MAY → all metrics = Dental Intel (pre-conversion) + Ascend (post-conversion), SUMMED.
//   Combined OSB: prod $149,955 (DI $46,221 + Ascend $103,734); coll $124,620 (DI $108,813 + Ascend $15,807);
//   AR $218,339 (DI $137,405 + Ascend $80,934); NP 39 (DI 16 + Ascend 23). Per-provider rows also summed.
// LKW collections $340,849: BD28's P/C briefly showed $382K (applied-date over-attribution on Chris Nichols); settled at close.
// HNS collections $65,000 = Ascend direct (P/C $80,022 over-attributed Connolly multi-loc); pending exact final Ascend pull.
import type { MonthSnapshot } from '../types'

const may2026: MonthSnapshot = {
  key:       '2026-05',
  periodInfo: {
    label:         'May 2026',
    dataAsOf:      'May 29',
    totalBizDays:  20,
    daysComplete:  20,
    daysRemaining: 0,
  },
  data: {
    period: 'May 2026',
    org: {
      production:      2279022,
      productionGoal:  2400000,
      collections:     1237324,
      collectionsGoal: 1320000,
      newPatients:         511,
      activePatients:     2531,
      phoneAnswerRate:    70.5,
      hygieneRecare:      95.3,
      suppliesPct:         6.8,
    },

    locations: [
      { code:'LKW', production:563300, collections:340849, collectionRate:60.5, newPatients:90, recareRate:0,    phoneAnswerRate:81, activePatients:534, suppliesPct:0, status:'needs_work' },
      { code:'LT',  production:262200, collections:182892, collectionRate:69.8, newPatients:50, recareRate:0,    phoneAnswerRate:76, activePatients:421, suppliesPct:0, status:'watch'      },
      { code:'HNR', production:157200, collections:97996,  collectionRate:62.3, newPatients:83, recareRate:0,    phoneAnswerRate:71, activePatients:298, suppliesPct:0, status:'on_pace'    },
      { code:'HNS', production:129900, collections:65000,  collectionRate:50.0, newPatients:48, recareRate:0,    phoneAnswerRate:68, activePatients:276, suppliesPct:0, status:'watch'      },
      { code:'HNK', production:95367,  collections:24588,  collectionRate:25.8, newPatients:17, recareRate:0,    phoneAnswerRate:56, activePatients:0,   suppliesPct:0, status:'needs_work' },
      { code:'PB',  production:572500, collections:210268, collectionRate:36.7, newPatients:96, recareRate:0,    phoneAnswerRate:67, activePatients:389, suppliesPct:0, status:'watch'      },
      { code:'PR',  production:348600, collections:191111, collectionRate:54.8, newPatients:88, recareRate:0,    phoneAnswerRate:63, activePatients:321, suppliesPct:0, status:'on_pace'    },
      { code:'OSB', production:149955, collections:124620, collectionRate:83.1, newPatients:39, recareRate:95.3, phoneAnswerRate:66, activePatients:292, suppliesPct:0, status:'watch',     isOSB:true },
    ],

    doctors: [
      { name:'Nichols, Christopher',  locationCode:'LKW', grossProd:265812, collections:162924, collRate:61.3,  prodPerDay:13291, daysWorked:20, ytdProd:1643000 },
      { name:"Weathers, L'Cris",      locationCode:'PR',  grossProd:273862, collections:103058, collRate:37.6,  prodPerDay:13693, daysWorked:20, ytdProd:1128000 },
      { name:'Proctor, Sarah',        locationCode:'PB',  grossProd:269022, collections:128703, collRate:47.8,  prodPerDay:13451, daysWorked:20, ytdProd:1355000 },
      { name:'Ballard, Erin',         locationCode:'PB',  grossProd:135801, collections:70014,  collRate:51.6,  prodPerDay:6790,  daysWorked:20, ytdProd:722000  },
      { name:'Connolly, Noah',        locationCode:'HNS', grossProd:137079, collections:75358,  collRate:55.0,  prodPerDay:6854,  daysWorked:20, ytdProd:762000  },
      { name:'Nichols, Patrick',      locationCode:'LT',  grossProd:174639, collections:107951, collRate:61.8,  prodPerDay:8732,  daysWorked:20, ytdProd:761000  },
      { name:'Walters, Carrie',       locationCode:'LKW', grossProd:133849, collections:69264,  collRate:51.7,  prodPerDay:6692,  daysWorked:20, ytdProd:525000  },
      { name:'Skaggs, Ernest',        locationCode:'HNR', grossProd:50937,  collections:42812,  collRate:84.0,  prodPerDay:2547,  daysWorked:20, ytdProd:375000  },
      { name:'Osbourne, Brian',       locationCode:'OSB', grossProd:101640, collections:80645,  collRate:79.3,  prodPerDay:5082,  daysWorked:20, ytdProd:487000, isOSB:true },
      { name:'Gleason, Robert',       locationCode:'HNR', grossProd:87562,  collections:35920,  collRate:41.0,  prodPerDay:4378,  daysWorked:20, ytdProd:330000  },
      { name:'Chadwick, Evan',        locationCode:'LKW', grossProd:110168, collections:52626,  collRate:47.8,  prodPerDay:5508,  daysWorked:20, ytdProd:429000  },
      { name:'Decker Haycraft, Kara', locationCode:'LT',  grossProd:73955,  collections:35519,  collRate:48.0,  prodPerDay:3698,  daysWorked:20, ytdProd:341000  },
      { name:'King, Susan',           locationCode:'HNK', grossProd:95367,  collections:24588,  collRate:25.8,  prodPerDay:4768,  daysWorked:20, ytdProd:112000  },
      { name:'Harvey, Mark',          locationCode:'LKW', grossProd:10220,  collections:5899,   collRate:57.7,  prodPerDay:511,   daysWorked:20, ytdProd:10000   },
    ],

    hygienists: [
      // ── LKW ──
      { name:'Berry, Tasha',     locationCode:'LKW', grossProd:16583, collections:9649,  collRate:58.2,  hoursWorked:126.35, prodPerHr:131, recareRate:0 },
      { name:'Bewley, Emma',     locationCode:'LKW', grossProd:7838,  collections:3318,  collRate:42.3,  hoursWorked:62.52,  prodPerHr:125, recareRate:0 },
      { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:13894, collections:8995,  collRate:64.7,  hoursWorked:97.68,  prodPerHr:142, recareRate:0 },
      { name:'Woosley, Emily',   locationCode:'LKW', grossProd:22684, collections:8815,  collRate:38.9,  hoursWorked:148.77, prodPerHr:152, recareRate:0 },
      { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:6855,  collections:5302,  collRate:77.3,  hoursWorked:84.16,  prodPerHr:81,  recareRate:0 },
      { name:'Payne, McKay',     locationCode:'LKW', grossProd:14340, collections:7264,  collRate:50.7,  hoursWorked:88.96,  prodPerHr:161, recareRate:0 },
      { name:'Murphy, Sherry',   locationCode:'LKW', grossProd:4170,  collections:1395,  collRate:33.5,  hoursWorked:35.14,  prodPerHr:119, recareRate:0 },
      { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:16573, collections:8119,  collRate:49.0,  hoursWorked:129.49, prodPerHr:128, recareRate:0 },
      { name:'Vowels, Susan',    locationCode:'LKW', grossProd:11201, collections:6821,  collRate:60.9,  hoursWorked:87.65,  prodPerHr:128, recareRate:0 },
      // ── LT ──
      { name:'Howell, Dana',     locationCode:'LT',  grossProd:20747, collections:14060, collRate:67.8,  hoursWorked:142.80, prodPerHr:145, recareRate:0 },
      { name:'Blandford, Cassi', locationCode:'LT',  grossProd:16633, collections:8818,  collRate:53.0,  hoursWorked:121.85, prodPerHr:137, recareRate:0 },
      { name:'Kittle, Jolena',   locationCode:'LT',  grossProd:8637,  collections:5718,  collRate:66.2,  hoursWorked:59.18,  prodPerHr:146, recareRate:0 },
      { name:'Harned, Stacy',    locationCode:'LT',  grossProd:10719, collections:6464,  collRate:60.3,  hoursWorked:83.31,  prodPerHr:129, recareRate:0 },
      { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:6948,  collections:3440,  collRate:49.5,  hoursWorked:47.30,  prodPerHr:147, recareRate:0 },
      { name:'Youart, Britney',  locationCode:'LT',  grossProd:4775,  collections:5681,  collRate:119.0, hoursWorked:31.64,  prodPerHr:151, recareRate:0 },
      // ── HNR ──
      { name:'Morris, Amber',    locationCode:'HNR', grossProd:19214, collections:13654, collRate:71.1,  hoursWorked:131.75, prodPerHr:146, recareRate:0 },
      { name:'Lynch, Cassie',    locationCode:'HNR', grossProd:21067, collections:10379, collRate:49.3,  hoursWorked:129.30, prodPerHr:163, recareRate:0 },
      // ── HNS ──
      { name:'Logsdon, Megan',   locationCode:'HNS', grossProd:21122, collections:10693, collRate:50.6,  hoursWorked:144.82, prodPerHr:146, recareRate:0 },
      // ── HNK ──
      { name:'Miller, Taylor',   locationCode:'HNK', grossProd:0,     collections:0,     collRate:0,     hoursWorked:104.22, prodPerHr:0,   recareRate:0 },
      { name:'Decker, Heather',  locationCode:'HNK', grossProd:0,     collections:0,     collRate:0,     hoursWorked:22.70,  prodPerHr:0,   recareRate:0 },
      // ── PB ──
      { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:52867, collections:19316, collRate:36.5,  hoursWorked:120.01, prodPerHr:441, recareRate:0 },
      { name:'Wires, Tanya',     locationCode:'PB',  grossProd:23603, collections:13654, collRate:57.8,  hoursWorked:107.57, prodPerHr:219, recareRate:0 },
      { name:'Miller, Jenna',    locationCode:'PB',  grossProd:0,     collections:0,     collRate:0,     hoursWorked:0,      prodPerHr:0,   recareRate:0 },
      // ── PR ──
      { name:'Jones, Chad',      locationCode:'PR',  grossProd:45038, collections:27120, collRate:60.2,  hoursWorked:120.44, prodPerHr:374, recareRate:0 },
      // ── OSB (Dental Intel + Ascend summed) ──
      { name:'Culver, Angela',   locationCode:'OSB', grossProd:11230, collections:7303,  collRate:65.0,  hoursWorked:81.29,  prodPerHr:138, recareRate:95.3, isOSB:true },
      { name:'Greenwell, Denise',locationCode:'OSB', grossProd:1709,  collections:2942,  collRate:172.1, hoursWorked:31.79,  prodPerHr:54,  recareRate:95.3, isOSB:true },
      { name:'Haydon, Kelsey',   locationCode:'OSB', grossProd:10979, collections:7049,  collRate:64.2,  hoursWorked:84.20,  prodPerHr:130, recareRate:95.3, isOSB:true },
      { name:'Smith, Jessica',   locationCode:'OSB', grossProd:5972,  collections:3096,  collRate:51.8,  hoursWorked:66.61,  prodPerHr:90,  recareRate:95.3, isOSB:true },
      { name:'Ulrich, Leigh',    locationCode:'OSB', grossProd:5548,  collections:7667,  collRate:138.2, hoursWorked:68.08,  prodPerHr:81,  recareRate:95.3, isOSB:true },
      { name:'Yates, Jaclyn',    locationCode:'OSB', grossProd:5960,  collections:6156,  collRate:103.3, hoursWorked:66.58,  prodPerHr:90,  recareRate:95.3, isOSB:true },
    ],

    phones: [
      { code:'LKW', totalCalls:1761, answered:1428, missed:333, answerRate:81, estMissedRevenue:0 },
      { code:'LT',  totalCalls:935,  answered:707,  missed:228, answerRate:76, estMissedRevenue:0 },
      { code:'HNR', totalCalls:967,  answered:683,  missed:284, answerRate:71, estMissedRevenue:0 },
      { code:'HNS', totalCalls:476,  answered:323,  missed:153, answerRate:68, estMissedRevenue:0 },
      { code:'HNK', totalCalls:273,  answered:154,  missed:119, answerRate:56, estMissedRevenue:0 },
      { code:'PB',  totalCalls:1407, answered:941,  missed:466, answerRate:67, estMissedRevenue:0 },
      { code:'PR',  totalCalls:1174, answered:735,  missed:439, answerRate:63, estMissedRevenue:0 },
      { code:'OSB', totalCalls:999,  answered:663,  missed:336, answerRate:66, estMissedRevenue:0 },
    ],

    ar: {
      asOf: '05/29/2026',
      healthScore: 69,
      total: 1907157,
      buckets: { d0_30: 1312051, d31_60: 327199, d61_90: 216360, d90plus: 329972 },
      pcts:    { d0_30: 60.0,    d31_60: 15.0,   d61_90: 9.9,    d90plus: 15.1  },
      arToProdRatio: 0.84,
      locations: [
        { code:'LKW', total:607395, d0_30:291511, d31_60:130980, d61_90:129318, d90plus:194072, pct0_30:39.1, pct31_60:17.6, pct61_90:17.3, pct90plus:26.0, insuranceAR:196338, patientAR:418702, patientPct:68, arToProd:1.08, status:'needs_work' },
        { code:'HNK', total:63820,  d0_30:74140,  d31_60:0,      d61_90:0,      d90plus:0,      pct0_30:100.0,pct31_60:0.0,  pct61_90:0.0,  pct90plus:0.0,  insuranceAR:43110,  patientAR:27112,  patientPct:39, arToProd:0.67, status:'good'      },
        { code:'LT',  total:174061, d0_30:122644, d31_60:27728,  d61_90:12928,  d90plus:39806,  pct0_30:60.4, pct31_60:13.7, pct61_90:6.4,  pct90plus:19.6, insuranceAR:76238,  patientAR:46763,  patientPct:38, arToProd:0.66, status:'watch'     },
        { code:'HNR', total:184355, d0_30:136624, d31_60:46616,  d61_90:18358,  d90plus:26460,  pct0_30:59.9, pct31_60:20.4, pct61_90:8.1,  pct90plus:11.6, insuranceAR:89092,  patientAR:68860,  patientPct:44, arToProd:1.17, status:'watch'     },
        { code:'HNS', total:40442,  d0_30:35774,  d31_60:10571,  d61_90:4653,   d90plus:2243,   pct0_30:67.2, pct31_60:19.9, pct61_90:8.7,  pct90plus:4.2,  insuranceAR:20882,  patientAR:12841,  patientPct:38, arToProd:0.31, status:'watch'     },
        { code:'PB',  total:307415, d0_30:261296, d31_60:58185,  d61_90:12825,  d90plus:16872,  pct0_30:74.8, pct31_60:16.7, pct61_90:3.7,  pct90plus:4.8,  insuranceAR:129378, patientAR:66582,  patientPct:34, arToProd:0.54, status:'watch'     },
        { code:'PR',  total:311329, d0_30:220773, d31_60:39137,  d61_90:23255,  d90plus:30474,  pct0_30:70.4, pct31_60:12.5, pct61_90:7.4,  pct90plus:9.7,  insuranceAR:109116, patientAR:189255, patientPct:63, arToProd:0.89, status:'watch'     },
        { code:'OSB', total:218339, d0_30:169289, d31_60:13982,  d61_90:15023,  d90plus:20045,  pct0_30:77.5, pct31_60:6.4,  pct61_90:6.9,  pct90plus:9.2,  insuranceAR:118914, patientAR:106391, patientPct:47, arToProd:1.46, status:'watch',    isOSB:true },
      ],
    },
  },
}

export default may2026
