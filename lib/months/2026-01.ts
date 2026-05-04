// January 2026 — FINAL (BD20, 20/20 business days)
// Sources: Dentrix Ascend ProviderTotals (15) 01/01–01/31 · AgedReceivables (17) 01/31
//          Mango Voice 01/01–01/31 (all 7 confirmed) · Dental Intel OSB operations/providers-performance
// Location production/collections: provider-level aggregation by known location assignment
// hoursWorked: not available for historical months (set to 0)
import type { MonthSnapshot } from '../types'

const jan2026: MonthSnapshot = {
  key:       '2026-01',
  periodInfo: {
    label:         'January 2026',
    dataAsOf:      'January 31',
    totalBizDays:  20,
    daysComplete:  20,
    daysRemaining: 0,
  },
  data: {
    period: 'January 2026',
    org: {
      production:      1843000,  // $1,669,964 Ascend (ProviderTotals 15) + $173,034 OSB (DI)
      productionGoal:  2400000,
      collections:     816885,   // $654,300 Ascend + $162,585 OSB
      collectionsGoal: 1320000,
      newPatients:        484,   // ~424 Ascend + 60 OSB
      activePatients:    2400,   // estimated (trend back from Apr 2531)
      phoneAnswerRate:   53.3,   // LKW 48.2% + LT 74.2% + HNR 66% + HNS 52.4% + PB 43.6% (ED7B) + PR 40.2% (18CB) + OSB 57.9% — weighted avg all 7
      hygieneRecare:    87.9,    // OSB from DI; Ascend not available
    },

    // Production/collections: aggregated from ProviderTotals (15) by provider-location mapping
    // newPatients: Ascend NP not available for Jan by location (set to 0); OSB from DI
    // phoneAnswerRate: LKW + LT from Mango Voice; other locations unavailable (0 = no data)
    // recareRate: OSB from DI; Ascend not available (0 = no data)
    locations: [
      { code:'LKW', production:566511, collections:271889, collectionRate:48.0,  newPatients:0,  recareRate:0,    phoneAnswerRate:48.2, activePatients:0, suppliesPct:0, status:'watch'     },
      { code:'LT',  production:287417, collections:171929, collectionRate:59.8,  newPatients:0,  recareRate:0,    phoneAnswerRate:74.2, activePatients:0, suppliesPct:0, status:'good'      },
      { code:'HNR', production:70912,  collections:18185,  collectionRate:25.6,  newPatients:0,  recareRate:0,    phoneAnswerRate:66.0, activePatients:0, suppliesPct:0, status:'needs_work' },
      { code:'HNS', production:104207, collections:53646,  collectionRate:51.5,  newPatients:0,  recareRate:0,    phoneAnswerRate:52.4, activePatients:0, suppliesPct:0, status:'good'      },
      { code:'PB',  production:315643, collections:56495,  collectionRate:17.9,  newPatients:0,  recareRate:0,    phoneAnswerRate:43.6, activePatients:0, suppliesPct:0, status:'good'      },
      { code:'PR',  production:322767, collections:80331,  collectionRate:24.9,  newPatients:0,  recareRate:0,    phoneAnswerRate:40.2, activePatients:0, suppliesPct:0, status:'good'      },
      { code:'OSB', production:173034, collections:162585, collectionRate:93.9,  newPatients:60, recareRate:87.9, phoneAnswerRate:57.9, activePatients:0, suppliesPct:0, status:'good', isOSB:true },
    ],

    // Source: ProviderTotals (15) Procedure Charges · OSB from providers-performance (DI)
    // ytdProd = grossProd (first month)
    doctors: [
      { name:'Nichols, Christopher',  locationCode:'LKW', grossProd:311306, collections:127997, collRate:41.1, prodPerDay:15565, daysWorked:20, ytdProd:311000  },
      { name:"Weathers, L'Cris",      locationCode:'PR',  grossProd:169497, collections:20832,  collRate:12.3, prodPerDay:8475,  daysWorked:20, ytdProd:169000  },
      { name:'Proctor, Sarah',        locationCode:'PB',  grossProd:225283, collections:36456,  collRate:16.2, prodPerDay:11264, daysWorked:20, ytdProd:225000  },
      { name:'Ballard, Erin',         locationCode:'PB',  grossProd:51060,  collections:6457,   collRate:12.6, prodPerDay:2553,  daysWorked:20, ytdProd:51000   },
      { name:'Connolly, Noah',        locationCode:'HNS', grossProd:104207, collections:53646,  collRate:51.5, prodPerDay:5210,  daysWorked:20, ytdProd:104000  },
      { name:'Nichols, Patrick',      locationCode:'LT',  grossProd:163264, collections:99510,  collRate:60.9, prodPerDay:8163,  daysWorked:20, ytdProd:163000  },
      { name:'Walters, Carrie',       locationCode:'LKW', grossProd:53532,  collections:34883,  collRate:65.2, prodPerDay:2677,  daysWorked:20, ytdProd:54000   },
      { name:'Skaggs, Ernest',        locationCode:'HNR', grossProd:70912,  collections:18185,  collRate:25.6, prodPerDay:3546,  daysWorked:20, ytdProd:71000   },
      { name:'Osbourne, Brian',       locationCode:'OSB', grossProd:75649,  collections:73347,  collRate:96.9, prodPerDay:3782,  daysWorked:20, ytdProd:76000,  isOSB:true },
      { name:'Gleason, Robert',       locationCode:'LKW', grossProd:41505,  collections:20914,  collRate:50.4, prodPerDay:2075,  daysWorked:20, ytdProd:42000   },
      { name:'Chadwick, Evan',        locationCode:'PR',  grossProd:75367,  collections:36022,  collRate:47.8, prodPerDay:3768,  daysWorked:20, ytdProd:75000   },
      { name:'Decker Haycraft, Kara', locationCode:'LT',  grossProd:63515,  collections:39810,  collRate:62.7, prodPerDay:3176,  daysWorked:20, ytdProd:64000   },
    ],

    // hoursWorked=0 — time clock data not extracted for historical months
    hygienists: [
      // ── LKW ──
      { name:'Howell, Dana',     locationCode:'LKW', grossProd:20047, collections:13401, collRate:66.9, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:17918, collections:8044,  collRate:44.9, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Woosley, Emily',   locationCode:'LKW', grossProd:17061, collections:8191,  collRate:48.0, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Berry, Tasha',     locationCode:'LKW', grossProd:17360, collections:7979,  collRate:46.0, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Payne, McKay',     locationCode:'LKW', grossProd:14424, collections:6791,  collRate:47.1, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Blandford, Cassi', locationCode:'LKW', grossProd:14706, collections:10611, collRate:72.2, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:18508, collections:8299,  collRate:44.8, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:10635, collections:7357,  collRate:69.2, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Bewley, Emma',     locationCode:'LKW', grossProd:8792,  collections:4037,  collRate:45.9, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Vowels, Susan',    locationCode:'LKW', grossProd:5790,  collections:4629,  collRate:79.9, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Youart, Britney',  locationCode:'LKW', grossProd:2722,  collections:3274,  collRate:120.3,hoursWorked:0, prodPerHr:0, recareRate:0 },
      // ── LT ──
      { name:'Logsdon, Megan',   locationCode:'LT',  grossProd:13005, collections:5863,  collRate:45.1, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Morris, Amber',    locationCode:'LT',  grossProd:16593, collections:6067,  collRate:36.6, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Harned, Stacy',    locationCode:'LT',  grossProd:9901,  collections:5513,  collRate:55.7, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:6152,  collections:3475,  collRate:56.5, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Miller, Jenna',    locationCode:'LT',  grossProd:9827,  collections:6991,  collRate:71.1, hoursWorked:0, prodPerHr:0, recareRate:0 },
      // ── PR ──
      { name:'Jones, Chad',      locationCode:'PR',  grossProd:41188, collections:12576, collRate:30.5, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Wires, Tanya',     locationCode:'PR',  grossProd:18804, collections:5405,  collRate:28.7, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Lynch, Cassie',    locationCode:'PR',  grossProd:17911, collections:5496,  collRate:30.7, hoursWorked:0, prodPerHr:0, recareRate:0 },
      // ── PB ──
      { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:26974, collections:5624,  collRate:20.8, hoursWorked:0, prodPerHr:0, recareRate:0 },
      { name:'Kittle, Jolena',   locationCode:'PB',  grossProd:12326, collections:7958,  collRate:64.6, hoursWorked:0, prodPerHr:0, recareRate:0 },
    ],

    // Mango Voice: all 7 confirmed. ED7B = PB (Proctor Family Dental); 18CB = PR (Proctor Family Dental - Radcliff).
    phones: [
      { code:'LKW', totalCalls:2387, answered:1150, missed:1237, answerRate:48.2, estMissedRevenue:218949 },
      { code:'LT',  totalCalls:1196, answered:888,  missed:308,  answerRate:74.2, estMissedRevenue:54516  },
      { code:'HNR', totalCalls:1089, answered:719,  missed:370,  answerRate:66.0, estMissedRevenue:65490  },
      { code:'HNS', totalCalls:399,  answered:209,  missed:190,  answerRate:52.4, estMissedRevenue:33630  },
      { code:'PB',  totalCalls:1853, answered:807,  missed:1046, answerRate:43.6, estMissedRevenue:185142 },
      { code:'PR',  totalCalls:1158, answered:466,  missed:692,  answerRate:40.2, estMissedRevenue:122484 },
      { code:'OSB', totalCalls:1525, answered:883,  missed:642,  answerRate:57.9, estMissedRevenue:113634 },
    ],

    // Source: AgedReceivables (17) as of 01/31/2026 (Ascend) · Dental Intel OSB operations-performance
    ar: {
      asOf: '01/31/2026',
      healthScore: 68,
      total: 1735742,  // Ascend $1,500,186 + OSB $235,556
      buckets: { d0_30: 1039783, d31_60: 218195, d61_90: 154527, d90plus: 87681 },
      pcts:    { d0_30: 69.3,    d31_60: 14.5,   d61_90: 10.3,   d90plus: 5.8  },
      arToProdRatio: 0.90,
      locations: [
        { code:'LKW', total:520799, d0_30:299079, d31_60:98075, d61_90:96214, d90plus:27430, pct0_30:57.4, pct31_60:18.8, pct61_90:18.5, pct90plus:5.3,  insuranceAR:205299, patientAR:302842, patientPct:58, arToProd:0.92, status:'watch'      },
        { code:'LT',  total:196654, d0_30:148383, d31_60:40813, d61_90:7306,  d90plus:152,   pct0_30:75.5, pct31_60:20.8, pct61_90:3.7,  pct90plus:0.1,  insuranceAR:79242,  patientAR:35216,  patientPct:18, arToProd:0.68, status:'good'       },
        { code:'HNR', total:230538, d0_30:109845, d31_60:43398, d61_90:24728, d90plus:52567, pct0_30:47.7, pct31_60:18.8, pct61_90:10.7, pct90plus:22.8, insuranceAR:122037, patientAR:102374, patientPct:44, arToProd:3.25, status:'needs_work'  },
        { code:'HNS', total:18619,  d0_30:13047,  d31_60:891,   d61_90:2432,  d90plus:2248,  pct0_30:70.1, pct31_60:4.8,  pct61_90:13.1, pct90plus:12.1, insuranceAR:9237,   patientAR:6252,   patientPct:34, arToProd:0.18, status:'watch'      },
        { code:'PB',  total:227657, d0_30:227657, d31_60:0,     d61_90:0,     d90plus:0,     pct0_30:100.0,pct31_60:0.0,  pct61_90:0.0,  pct90plus:0.0,  insuranceAR:123134, patientAR:24029,  patientPct:11, arToProd:0.72, status:'good'       },
        { code:'PR',  total:305919, d0_30:241771, d31_60:35018, d61_90:23847, d90plus:5283,  pct0_30:79.0, pct31_60:11.5, pct61_90:7.8,  pct90plus:1.7,  insuranceAR:115260, patientAR:159291, patientPct:52, arToProd:0.95, status:'good'       },
        { code:'OSB', total:235556, d0_30:0,      d31_60:0,     d61_90:0,     d90plus:0,     pct0_30:0,    pct31_60:0,    pct61_90:0,    pct90plus:0,    insuranceAR:152578, patientAR:82978,  patientPct:35, arToProd:1.36, status:'on_pace', isOSB:true },
      ],
    },
  },
}

export default jan2026
