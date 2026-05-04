// April 2026 — FINAL (BD22, 22/22 business days) — INLINED (do not re-import from data.ts)
// Sources: Dentrix Ascend ProviderTotals (14) + Prod/Coll Summary (12) + AgedReceivables (14)
//          Mango Voice 04/01–04/30 · Dental Intel OSB (04/29 — DI not updated 04/30)
import type { MonthSnapshot } from '../types'

const apr2026: MonthSnapshot = {
  key:       '2026-04',
  periodInfo: {
    label:         'April 2026',
    dataAsOf:      'April 30',
    totalBizDays:  22,
    daysComplete:  22,
    daysRemaining: 0,
  },
  data: {
    period: 'April 2026',
    org: {
      production:      2636181,
      productionGoal:  2400000,
      collections:     1301971,
      collectionsGoal: 1320000,
      newPatients:        660,
      activePatients:    2531,
      phoneAnswerRate:   69.3,
      hygieneRecare:      0,
    },

    locations: [
      { code:'LKW', production:408460, collections:341488, collectionRate:83.6,  newPatients:136, recareRate:0,    phoneAnswerRate:70.9, activePatients:534, suppliesPct:5.76, status:'on_pace'  },
      { code:'LT',  production:163654, collections:192125, collectionRate:117.4, newPatients:60,  recareRate:0,    phoneAnswerRate:77.0, activePatients:421, suppliesPct:5.38, status:'watch'    },
      { code:'HNR', production:108802, collections:110557, collectionRate:101.6, newPatients:100, recareRate:0,    phoneAnswerRate:68.8, activePatients:298, suppliesPct:6.92, status:'on_pace'  },
      { code:'HNS', production:97799,  collections:56685,  collectionRate:58.0,  newPatients:73,  recareRate:0,    phoneAnswerRate:65.2, activePatients:276, suppliesPct:3.62, status:'watch'    },
      { code:'PB',  production:288225, collections:277877, collectionRate:96.4,  newPatients:127, recareRate:0,    phoneAnswerRate:60.9, activePatients:389, suppliesPct:6.77, status:'on_pace'  },
      { code:'PR',  production:215143, collections:144356, collectionRate:67.1,  newPatients:102, recareRate:0,    phoneAnswerRate:68.4, activePatients:321, suppliesPct:10.58,status:'on_pace'  },
      { code:'OSB', production:109100, collections:178883, collectionRate:163.9, newPatients:62,  recareRate:92.7, phoneAnswerRate:74.0, activePatients:292, suppliesPct:2.09, status:'watch',   isOSB:true },
    ],

    doctors: [
      { name:'Nichols, Christopher',  locationCode:'LKW', grossProd:339404, collections:172735, collRate:50.9, prodPerDay:15427, daysWorked:22, ytdProd:1389000 },
      { name:"Weathers, L'Cris",      locationCode:'PR',  grossProd:313093, collections:96467,  collRate:30.8, prodPerDay:14231, daysWorked:22, ytdProd:951000  },
      { name:'Proctor, Sarah',        locationCode:'PB',  grossProd:312048, collections:159329, collRate:51.1, prodPerDay:14184, daysWorked:22, ytdProd:1209000 },
      { name:'Ballard, Erin',         locationCode:'PB',  grossProd:232079, collections:79598,  collRate:34.3, prodPerDay:10549, daysWorked:22, ytdProd:638000  },
      { name:'Connolly, Noah',        locationCode:'HNS', grossProd:221551, collections:79416,  collRate:35.8, prodPerDay:10071, daysWorked:22, ytdProd:656000  },
      { name:'Nichols, Patrick',      locationCode:'LT',  grossProd:156277, collections:97974,  collRate:62.7, prodPerDay:7104,  daysWorked:22, ytdProd:630000  },
      { name:'Walters, Carrie',       locationCode:'LKW', grossProd:148541, collections:62869,  collRate:42.3, prodPerDay:6752,  daysWorked:22, ytdProd:452000  },
      { name:'Skaggs, Ernest',        locationCode:'HNR', grossProd:96826,  collections:44612,  collRate:46.1, prodPerDay:4401,  daysWorked:22, ytdProd:340000  },
      { name:'Osbourne, Brian',       locationCode:'OSB', grossProd:91054,  collections:109450, collRate:120.2,prodPerDay:4139,  daysWorked:22, ytdProd:388000,  isOSB:true },
      { name:'Gleason, Robert',       locationCode:'LKW', grossProd:78325,  collections:39778,  collRate:50.8, prodPerDay:3560,  daysWorked:22, ytdProd:268000  },
      { name:'Chadwick, Evan',        locationCode:'PR',  grossProd:69876,  collections:32721,  collRate:46.8, prodPerDay:3176,  daysWorked:22, ytdProd:349000  },
      { name:'Decker Haycraft, Kara', locationCode:'LT',  grossProd:67428,  collections:35695,  collRate:52.9, prodPerDay:3065,  daysWorked:22, ytdProd:287000  },
    ],

    hygienists: [
      // ── LKW ──
      { name:'Howell, Dana',     locationCode:'LKW', grossProd:26648, collections:12766, collRate:47.9, hoursWorked:157.93,prodPerHr:169, recareRate:0 },
      { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:25198, collections:11715, collRate:46.5, hoursWorked:160.44,prodPerHr:157, recareRate:0 },
      { name:'Woosley, Emily',   locationCode:'LKW', grossProd:18737, collections:9696,  collRate:51.7, hoursWorked:142.26,prodPerHr:132, recareRate:0 },
      { name:'Payne, McKay',     locationCode:'LKW', grossProd:18132, collections:8118,  collRate:44.8, hoursWorked:124.83,prodPerHr:145, recareRate:0 },
      { name:'Berry, Tasha',     locationCode:'LKW', grossProd:17052, collections:7840,  collRate:46.0, hoursWorked:124.74,prodPerHr:137, recareRate:0 },
      { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:16297, collections:8724,  collRate:53.5, hoursWorked:155.88,prodPerHr:105, recareRate:0 },
      { name:'Blandford, Cassi', locationCode:'LKW', grossProd:15177, collections:8717,  collRate:57.4, hoursWorked:111.62,prodPerHr:136, recareRate:0 },
      { name:'Youart, Britney',  locationCode:'LKW', grossProd:13538, collections:5530,  collRate:40.9, hoursWorked:69.53, prodPerHr:195, recareRate:0 },
      { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:13247, collections:7761,  collRate:58.6, hoursWorked:87.54, prodPerHr:151, recareRate:0 },
      { name:'Vowels, Susan',    locationCode:'LKW', grossProd:11245, collections:5924,  collRate:52.7, hoursWorked:86.90, prodPerHr:129, recareRate:0 },
      { name:'Bewley, Emma',     locationCode:'LKW', grossProd:5122,  collections:3922,  collRate:76.6, hoursWorked:36.82, prodPerHr:139, recareRate:0 },
      // ── LT ──
      { name:'Logsdon, Megan',   locationCode:'LT',  grossProd:24732, collections:10014, collRate:40.5, hoursWorked:159.08,prodPerHr:156, recareRate:0 },
      { name:'Morris, Amber',    locationCode:'LT',  grossProd:22262, collections:15215, collRate:68.3, hoursWorked:157.87,prodPerHr:141, recareRate:0 },
      { name:'Harned, Stacy',    locationCode:'LT',  grossProd:11430, collections:7504,  collRate:65.7, hoursWorked:84.26, prodPerHr:136, recareRate:0 },
      { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:9686,  collections:6137,  collRate:63.4, hoursWorked:60.54, prodPerHr:160, recareRate:0 },
      // ── PR ──
      { name:'Jones, Chad',      locationCode:'PR',  grossProd:55612, collections:19686, collRate:35.4, hoursWorked:129.28,prodPerHr:430, recareRate:0 },
      { name:'Wires, Tanya',     locationCode:'PR',  grossProd:32926, collections:12603, collRate:38.3, hoursWorked:141.44,prodPerHr:233, recareRate:0 },
      { name:'Lynch, Cassie',    locationCode:'PR',  grossProd:24254, collections:12789, collRate:52.7, hoursWorked:133.59,prodPerHr:182, recareRate:0 },
      // ── PB ──
      { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:51086, collections:15613, collRate:30.6, hoursWorked:145.97,prodPerHr:350, recareRate:0 },
      { name:'Kittle, Jolena',   locationCode:'PB',  grossProd:14561, collections:8128,  collRate:55.8, hoursWorked:101.06,prodPerHr:144, recareRate:0 },
      // ── HNS ──
      { name:'Logsdon, Megan',   locationCode:'HNS', grossProd:0,     collections:0,     collRate:0,    hoursWorked:0,     prodPerHr:0,   recareRate:0 },
      // ── OSB (Dental Intel) ──
      { name:'Haydon, Kelsey',   locationCode:'OSB', grossProd:11254, collections:11293, collRate:100.3,hoursWorked:97.0,  prodPerHr:116, recareRate:92.7, isOSB:true },
      { name:'Culver, Angela',   locationCode:'OSB', grossProd:9981,  collections:9889,  collRate:99.1, hoursWorked:97.0,  prodPerHr:103, recareRate:92.7, isOSB:true },
      { name:'Ulrich, Leigh',    locationCode:'OSB', grossProd:10611, collections:9882,  collRate:93.1, hoursWorked:97.0,  prodPerHr:109, recareRate:92.7, isOSB:true },
      { name:'Greenwell, Denise',locationCode:'OSB', grossProd:6458,  collections:4971,  collRate:77.0, hoursWorked:49.0,  prodPerHr:132, recareRate:92.7, isOSB:true },
      { name:'Yates, Jaclyn',    locationCode:'OSB', grossProd:5314,  collections:7169,  collRate:134.9,hoursWorked:39.0,  prodPerHr:136, recareRate:92.7, isOSB:true },
    ],

    phones: [
      { code:'LKW', totalCalls:2131, answered:1511, missed:620, answerRate:70.9, estMissedRevenue:109740 },
      { code:'LT',  totalCalls:1032, answered:795,  missed:237, answerRate:77.0, estMissedRevenue:41949  },
      { code:'HNR', totalCalls:1003, answered:690,  missed:313, answerRate:68.8, estMissedRevenue:55401  },
      { code:'HNS', totalCalls:575,  answered:375,  missed:200, answerRate:65.2, estMissedRevenue:35400  },
      { code:'PB',  totalCalls:1555, answered:947,  missed:608, answerRate:60.9, estMissedRevenue:107616 },
      { code:'PR',  totalCalls:1226, answered:839,  missed:387, answerRate:68.4, estMissedRevenue:68499  },
      { code:'OSB', totalCalls:1183, answered:875,  missed:308, answerRate:74.0, estMissedRevenue:54516  },
    ],

    ar: {
      asOf: '04/30/2026',
      healthScore: 49,
      total: 2228008,
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
  },
}

export default apr2026
